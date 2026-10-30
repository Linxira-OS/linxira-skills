#!/usr/bin/env python3
"""Clean invisible characters and conservative container metadata.

Text output is UTF-8 without a byte-order mark. DOCX files are rewritten as
ZIP archives with custom properties, author fields, last-modified fields, and
body rsid attributes removed. PNG and JPEG files are rewritten at the container
level without re-encoding pixels.

Citation:
    Linxira OS. Linxira Skills: de-aigc-provenance. Version 0.1.0.
    Skill path: skills/de-aigc-provenance/SKILL.md. GitHub.
    https://github.com/Linxira-OS/linxira-skills
"""

from __future__ import annotations

import argparse
import codecs
import json
import os
import re
import struct
import sys
import zipfile
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

VERSION = "1.0.0"

TEXT_SUFFIXES = {".txt", ".md", ".markdown"}
IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg"}
DOCX_SUFFIX = ".docx"
SUPPORTED_SUFFIXES = TEXT_SUFFIXES | IMAGE_SUFFIXES | {DOCX_SUFFIX}

WORD_PART_RE = re.compile(
    r"^word/(?:document|header\d*|footer\d*|footnotes|endnotes|comments)\.xml$"
)

CATEGORY_ZERO_WIDTH = "zero_width"
CATEGORY_BIDI = "bidi_control"
CATEGORY_BOM = "bom"
CATEGORY_SOFT_HYPHEN = "soft_hyphen"
CATEGORY_VARIATION = "variation_selector"

CATEGORY_ORDER = [
    CATEGORY_ZERO_WIDTH,
    CATEGORY_BIDI,
    CATEGORY_BOM,
    CATEGORY_SOFT_HYPHEN,
    CATEGORY_VARIATION,
]

PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
PNG_TEXT_CHUNKS = {b"tEXt", b"zTXt", b"iTXt"}

JPEG_XMP_SIGNATURES = (
    b"http://ns.adobe.com/xap/1.0/\x00",
    b"http://ns.adobe.com/xmp/extension/\x00",
)
JPEG_STANDALONE_MARKERS = {0x01, 0xD8, 0xD9}
JPEG_STANDALONE_MARKERS.update(range(0xD0, 0xD8))


def classify(char: str) -> Optional[str]:
    code = ord(char)
    if 0x200B <= code <= 0x200D or 0x2060 <= code <= 0x2064:
        return CATEGORY_ZERO_WIDTH
    if 0x202A <= code <= 0x202E or 0x2066 <= code <= 0x2069:
        return CATEGORY_BIDI
    if code == 0xFEFF:
        return CATEGORY_BOM
    if code == 0x00AD:
        return CATEGORY_SOFT_HYPHEN
    if 0xFE00 <= code <= 0xFE0F or 0xE0100 <= code <= 0xE01EF:
        return CATEGORY_VARIATION
    return None


def clean_text(
    text: str, strip_variation_selectors: bool
) -> Tuple[str, Dict[str, int], int]:
    counts = {category: 0 for category in CATEGORY_ORDER}
    retained_variation = 0
    output: List[str] = []
    for char in text:
        category = classify(char)
        if category is None:
            output.append(char)
            continue
        if category == CATEGORY_VARIATION and not strip_variation_selectors:
            retained_variation += 1
            output.append(char)
            continue
        counts[category] += 1
    return "".join(output), counts, retained_variation


def non_zero_counts(counts: Dict[str, int]) -> Dict[str, int]:
    return {key: value for key, value in counts.items() if value}


def decode_text(raw: bytes) -> Tuple[str, str, int]:
    """Return decoded text, input encoding, and a consumed BOM count."""
    if raw.startswith(codecs.BOM_UTF16_LE) or raw.startswith(codecs.BOM_UTF16_BE):
        return raw.decode("utf-16"), "utf-16", 1
    if raw.startswith(codecs.BOM_UTF32_LE) or raw.startswith(codecs.BOM_UTF32_BE):
        return raw.decode("utf-32"), "utf-32", 1
    return raw.decode("utf-8", errors="surrogateescape"), "utf-8", 0


def clean_text_file(
    source: Path, destination: Path, strip_variation: bool
) -> Dict[str, Any]:
    raw = source.read_bytes()
    text, encoding, consumed_bom = decode_text(raw)
    cleaned, counts, retained = clean_text(text, strip_variation)
    counts[CATEGORY_BOM] += consumed_bom
    cleaned_bytes = cleaned.encode("utf-8", errors="surrogateescape")

    def writer(temporary: Path) -> None:
        temporary.write_bytes(cleaned_bytes)

    atomic_write(destination, writer)
    return {
        "format": "text",
        "encoding_in": encoding,
        "encoding_out": "utf-8",
        "removed_invisible": non_zero_counts(counts),
        "variation_selectors_retained": retained,
        "metadata_actions": [],
        "bytes_before": len(raw),
        "bytes_after": destination.stat().st_size,
    }


def clear_core_fields(xml_text: str, actions: List[str]) -> str:
    fields = ("dc:creator", "cp:lastModifiedBy", "dcterms:modified")
    for field in fields:
        pattern = (
            r"<" + re.escape(field) + r"\b[^>]*>.*?</" + re.escape(field) + r">"
            r"|<" + re.escape(field) + r"\b[^>]*/>"
        )
        xml_text, replacements = re.subn(
            pattern, "", xml_text, flags=re.DOTALL | re.IGNORECASE
        )
        if replacements:
            actions.append("cleared docProps/core.xml field {}".format(field))
    return xml_text


def strip_rsid_attributes(xml_text: str, actions: List[str], part: str) -> str:
    pattern = r"\s+w:rsid[A-Za-z0-9]*\s*=\s*(?:\"[^\"]*\"|'[^']*')"
    xml_text, replacements = re.subn(pattern, "", xml_text)
    if replacements:
        actions.append(
            "stripped {} w:rsid* attribute(s) from {}".format(replacements, part)
        )
    return xml_text


def remove_custom_content_type(xml_text: str, actions: List[str]) -> str:
    pattern = (
        r"<Override\b[^>]*PartName\s*=\s*[\"']/?docProps/custom\.xml[\"'][^>]*/>"
    )
    xml_text, replacements = re.subn(pattern, "", xml_text, flags=re.IGNORECASE)
    if replacements:
        actions.append("removed /docProps/custom.xml content-type override")
    return xml_text


def remove_custom_relationship(xml_text: str, actions: List[str]) -> str:
    pattern = (
        r"<Relationship\b[^>]*Target\s*=\s*[\"']/?docProps/custom\.xml[\"'][^>]*/>"
    )
    xml_text, replacements = re.subn(pattern, "", xml_text, flags=re.IGNORECASE)
    if replacements:
        actions.append("removed docProps/custom.xml relationship")
    return xml_text


def atomic_write(destination: Path, writer: Any) -> None:
    temporary = destination.with_name(destination.name + ".tmp")
    try:
        writer(temporary)
        os.replace(str(temporary), str(destination))
    finally:
        if temporary.exists():
            temporary.unlink()


def clean_docx_file(
    source: Path, destination: Path, strip_variation: bool
) -> Dict[str, Any]:
    counts = {category: 0 for category in CATEGORY_ORDER}
    actions: List[str] = []
    retained = 0
    bytes_before = source.stat().st_size

    def writer(temporary: Path) -> None:
        nonlocal retained
        with zipfile.ZipFile(source) as archive, zipfile.ZipFile(
            temporary, "w", compression=zipfile.ZIP_DEFLATED
        ) as output:
            for info in archive.infolist():
                name = info.filename
                data = archive.read(name)
                if name == "docProps/custom.xml":
                    actions.append("removed docProps/custom.xml")
                    continue
                if name == "docProps/core.xml":
                    text = data.decode("utf-8", errors="surrogateescape")
                    data = clear_core_fields(text, actions).encode(
                        "utf-8", errors="surrogateescape"
                    )
                elif name == "[Content_Types].xml":
                    text = data.decode("utf-8", errors="surrogateescape")
                    data = remove_custom_content_type(text, actions).encode(
                        "utf-8", errors="surrogateescape"
                    )
                elif name == "_rels/.rels":
                    text = data.decode("utf-8", errors="surrogateescape")
                    data = remove_custom_relationship(text, actions).encode(
                        "utf-8", errors="surrogateescape"
                    )
                elif WORD_PART_RE.match(name):
                    text = data.decode("utf-8", errors="surrogateescape")
                    text, part_counts, part_retained = clean_text(
                        text, strip_variation
                    )
                    for category, value in part_counts.items():
                        counts[category] += value
                    retained += part_retained
                    if name == "word/document.xml":
                        text = strip_rsid_attributes(text, actions, name)
                    data = text.encode("utf-8", errors="surrogateescape")
                output.writestr(info, data)

    atomic_write(destination, writer)
    return {
        "format": "docx",
        "removed_invisible": non_zero_counts(counts),
        "variation_selectors_retained": retained,
        "metadata_actions": actions,
        "bytes_before": bytes_before,
        "bytes_after": destination.stat().st_size,
    }


def clean_png_bytes(data: bytes, actions: List[str]) -> bytes:
    if not data.startswith(PNG_SIGNATURE):
        raise ValueError("not a PNG file")
    position = len(PNG_SIGNATURE)
    chunks: List[bytes] = []
    removed: List[str] = []
    saw_iend = False

    while position < len(data):
        if position + 8 > len(data):
            raise ValueError("truncated PNG chunk header")
        length = struct.unpack(">I", data[position : position + 4])[0]
        chunk_type = data[position + 4 : position + 8]
        end = position + 12 + length
        if end > len(data):
            raise ValueError("truncated PNG chunk")
        chunk = data[position:end]
        if chunk_type in PNG_TEXT_CHUNKS:
            removed.append(chunk_type.decode("ascii"))
        else:
            chunks.append(chunk)
        position = end
        if chunk_type == b"IEND":
            saw_iend = True
            break

    if not saw_iend:
        raise ValueError("PNG has no IEND chunk")
    if not chunks or chunks[0][4:8] != b"IHDR":
        raise ValueError("PNG does not start with IHDR")

    trailing = data[position:]
    if removed:
        actions.append(
            "removed {} PNG text/XMP chunk(s): {}".format(
                len(removed), ", ".join(removed)
            )
        )
    if trailing:
        actions.append(
            "preserved {} byte(s) after IEND without interpretation".format(
                len(trailing)
            )
        )
    return PNG_SIGNATURE + b"".join(chunks) + trailing


def is_xmp_app1(payload: bytes) -> bool:
    return any(payload.startswith(signature) for signature in JPEG_XMP_SIGNATURES)


def clean_jpeg_bytes(data: bytes, actions: List[str]) -> bytes:
    if not data.startswith(b"\xff\xd8"):
        raise ValueError("not a JPEG file")
    output = bytearray(data[:2])
    position = 2
    removed: List[str] = []

    while position < len(data):
        marker_start = position
        if data[position] != 0xFF:
            raise ValueError("invalid JPEG marker at byte {}".format(position))
        while position < len(data) and data[position] == 0xFF:
            position += 1
        if position >= len(data):
            raise ValueError("truncated JPEG marker")
        marker = data[position]
        position += 1

        if marker == 0xD9:  # EOI
            output += data[marker_start:position]
            actions.append("JPEG ended before a scan; preserved EOI")
            return bytes(output) + data[position:]

        if marker == 0xDA:  # SOS: copy entropy-coded data untouched
            output += data[marker_start:]
            if removed:
                actions.append(
                    "removed {} JPEG metadata segment(s): {}".format(
                        len(removed), ", ".join(removed)
                    )
                )
            return bytes(output)

        if marker in JPEG_STANDALONE_MARKERS:
            output += data[marker_start:position]
            continue

        if position + 2 > len(data):
            raise ValueError("truncated JPEG segment length")
        length = struct.unpack(">H", data[position : position + 2])[0]
        if length < 2:
            raise ValueError("invalid JPEG segment length")
        segment_end = position + length
        if segment_end > len(data):
            raise ValueError("truncated JPEG segment")
        payload = data[position + 2 : segment_end]

        is_comment = marker == 0xFE
        is_xmp = marker == 0xE1 and is_xmp_app1(payload)
        if is_comment or is_xmp:
            removed.append("COM" if is_comment else "APP1/XMP")
        else:
            output += data[marker_start:segment_end]
        position = segment_end

    raise ValueError("JPEG ended without SOS or EOI")


def clean_image_file(
    source: Path, destination: Path
) -> Dict[str, Any]:
    data = source.read_bytes()
    actions: List[str] = []
    suffix = source.suffix.lower()
    if suffix == ".png":
        cleaned = clean_png_bytes(data, actions)
    else:
        cleaned = clean_jpeg_bytes(data, actions)

    def writer(temporary: Path) -> None:
        temporary.write_bytes(cleaned)

    atomic_write(destination, writer)
    return {
        "format": suffix.lstrip("."),
        "removed_invisible": {},
        "variation_selectors_retained": 0,
        "metadata_actions": actions,
        "bytes_before": len(data),
        "bytes_after": destination.stat().st_size,
    }


def discover(
    raw_inputs: List[str],
) -> Tuple[List[Tuple[Path, Path, Optional[Path]]], List[Dict[str, str]]]:
    items: List[Tuple[Path, Path, Optional[Path]]] = []
    errors: List[Dict[str, str]] = []
    seen = set()

    for raw in raw_inputs:
        path = Path(raw)
        if not path.exists():
            errors.append({"path": raw, "error": "path does not exist"})
            continue
        if path.is_dir():
            for candidate in sorted(path.rglob("*")):
                if (
                    candidate.is_file()
                    and candidate.suffix.lower() in SUPPORTED_SUFFIXES
                ):
                    key = str(candidate.resolve())
                    if key not in seen:
                        seen.add(key)
                        items.append((candidate, candidate.relative_to(path), path))
            continue
        if path.suffix.lower() not in SUPPORTED_SUFFIXES:
            errors.append(
                {
                    "path": raw,
                    "error": "unsupported format; expected text, .docx, .png, or JPEG",
                }
            )
            continue
        key = str(path.resolve())
        if key not in seen:
            seen.add(key)
            items.append((path, Path(path.name), None))

    return items, errors


def default_destination(
    root_directory: Optional[Path], relative: Path, source: Path
) -> Path:
    if root_directory is not None:
        return root_directory.with_name(root_directory.name + ".clean") / relative
    return source.with_name(source.stem + ".clean" + source.suffix)


def choose_destination(
    source: Path,
    relative: Path,
    root_directory: Optional[Path],
    output_argument: Optional[str],
    output_is_directory: bool,
    single_directory_input: bool,
    in_place: bool,
) -> Path:
    if in_place:
        return source
    if output_argument is None:
        return default_destination(root_directory, relative, source)

    output_root = Path(output_argument)
    if output_is_directory or output_root.is_dir():
        if single_directory_input and root_directory is not None:
            return output_root / relative
        if root_directory is not None:
            return output_root / root_directory.name / relative
        return output_root / relative
    return output_root


def process_one(
    source: Path,
    destination: Path,
    strip_variation: bool,
    overwrite: bool,
    in_place: bool,
) -> Dict[str, Any]:
    record: Dict[str, Any] = {
        "input": str(source),
        "output": str(destination),
    }
    try:
        if not in_place and source.resolve() == destination.resolve():
            raise ValueError("refusing to overwrite input without --in-place")
        if (
            not in_place
            and not overwrite
            and destination.exists()
        ):
            raise FileExistsError(
                "output exists; use --overwrite or choose another path: {}".format(
                    destination
                )
            )
        destination.parent.mkdir(parents=True, exist_ok=True)
        suffix = source.suffix.lower()
        if suffix == DOCX_SUFFIX:
            details = clean_docx_file(source, destination, strip_variation)
        elif suffix in TEXT_SUFFIXES:
            details = clean_text_file(source, destination, strip_variation)
        elif suffix in IMAGE_SUFFIXES:
            details = clean_image_file(source, destination)
        else:
            raise ValueError("unsupported format")
        record.update(details)
        record["status"] = "ok"
    except Exception as error:
        record["status"] = "error"
        record["error"] = "{}: {}".format(type(error).__name__, error)
    return record


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Remove invisible characters and conservative container metadata."
    )
    parser.add_argument("inputs", nargs="+", help="Files or directories to clean")
    parser.add_argument(
        "-o",
        "--output",
        help="Output file, or output directory for multiple inputs",
    )
    parser.add_argument(
        "--in-place",
        action="store_true",
        help="Rewrite inputs in place; the original bytes are not preserved",
    )
    parser.add_argument(
        "--report",
        help="Write the JSON report to this path as well as stdout",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Allow replacing an existing output path",
    )
    parser.add_argument(
        "--strip-variation-selectors",
        action="store_true",
        help="Also remove variation selectors (off by default; review first)",
    )
    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    if args.in_place and args.output:
        print("clean.py: --in-place cannot be combined with --output", file=sys.stderr)
        return 2

    items, discovery_errors = discover(args.inputs)
    if not items and not discovery_errors:
        print("clean.py: no supported files found", file=sys.stderr)
        return 2

    input_paths = [Path(raw) for raw in args.inputs]
    directory_inputs = [path for path in input_paths if path.is_dir()]
    single_directory_input = len(items) >= 1 and len(directory_inputs) == 1 and all(
        root == directory_inputs[0] for _, _, root in items
    )

    output_is_directory = False
    if args.output:
        output_path = Path(args.output)
        output_is_directory = (
            len(items) > 1
            or any(root is not None for _, _, root in items)
            or output_path.is_dir()
            or args.output.endswith(("/", "\\"))
        )
        if output_is_directory and output_path.exists() and not output_path.is_dir():
            print(
                "clean.py: multiple or directory inputs need a directory output: {}".format(
                    output_path
                ),
                file=sys.stderr,
            )
            return 2

    plans: List[Tuple[Path, Path]] = []
    seen_destinations = set()
    for source, relative, root_directory in items:
        destination = choose_destination(
            source=source,
            relative=relative,
            root_directory=root_directory,
            output_argument=args.output,
            output_is_directory=output_is_directory,
            single_directory_input=single_directory_input,
            in_place=args.in_place,
        )
        destination_key = str(destination.resolve())
        if destination_key in seen_destinations:
            print(
                "clean.py: multiple inputs map to the same output: {}".format(
                    destination
                ),
                file=sys.stderr,
            )
            return 2
        seen_destinations.add(destination_key)
        plans.append((source, destination))

    records: List[Dict[str, Any]] = []
    for source, destination in plans:
        records.append(
            process_one(
                source,
                destination,
                args.strip_variation_selectors,
                args.overwrite,
                args.in_place,
            )
        )

    invisible_removed = 0
    actions = 0
    failed = 0
    for record in records:
        if record["status"] != "ok":
            failed += 1
            continue
        invisible_removed += sum(record.get("removed_invisible", {}).values())
        actions += len(record.get("metadata_actions", []))

    report = {
        "tool": "clean.py",
        "version": VERSION,
        "inputs": args.inputs,
        "options": {
            "in_place": args.in_place,
            "strip_variation_selectors": args.strip_variation_selectors,
        },
        "files": records,
        "errors": discovery_errors,
        "summary": {
            "files_processed": len([r for r in records if r["status"] == "ok"]),
            "files_failed": failed + len(discovery_errors),
            "invisible_characters_removed": invisible_removed,
            "metadata_actions": actions,
        },
    }

    serialized = json.dumps(report, ensure_ascii=False, indent=2)
    sys.stdout.write(serialized + "\n")
    if args.report:
        report_path = Path(args.report)
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(serialized + "\n", encoding="utf-8")

    if failed or discovery_errors:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
