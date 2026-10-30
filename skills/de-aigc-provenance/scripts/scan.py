#!/usr/bin/env python3
"""Scan text and DOCX files for invisible characters and DOCX properties.

The report is JSON on stdout. Scanning is read-only. Findings are evidence for
review, not an automatic failure: variation selectors and full-width characters
need human judgement.

Citation:
    Linxira OS. Linxira Skills: de-aigc-provenance. Version 0.1.0.
    Skill path: skills/de-aigc-provenance/SKILL.md. GitHub.
    https://github.com/Linxira-OS/linxira-skills
"""

from __future__ import annotations

import argparse
import codecs
import json
import re
import sys
import unicodedata
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

VERSION = "1.0.0"

TEXT_SUFFIXES = {".txt", ".md", ".markdown"}
SUPPORTED_SUFFIXES = TEXT_SUFFIXES | {".docx"}

WORD_MAIN = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
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


def classify(char: str) -> Optional[str]:
    """Return the report category for an invisible character, or None."""
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


def code_point(char: str) -> str:
    return "U+{:04X}".format(ord(char))


def escape_for_context(char: str) -> str:
    code = ord(char)
    if char == "\t":
        return "\\t"
    if classify(char) is not None or code < 0x20 or code == 0x7F:
        if code <= 0xFFFF:
            return "\\u{:04x}".format(code)
        return "\\U{:08x}".format(code)
    return char


def context_window(line: str, index: int, width: int = 40) -> str:
    start = max(0, index - width)
    end = min(len(line), index + width + 1)
    return "".join(escape_for_context(char) for char in line[start:end])


class Findings:
    """Aggregate invisible-character occurrences for one file."""

    def __init__(self, max_locations: int = 200) -> None:
        self.max_locations = max_locations
        self.items: Dict[Any, Dict[str, Any]] = {}

    def add(self, char: str, part: str, line: int, column: int) -> None:
        category = classify(char)
        if category is None:
            return
        key = (category, ord(char))
        item = self.items.get(key)
        if item is None:
            try:
                name = unicodedata.name(char)
            except ValueError:
                name = "UNKNOWN"
            item = {
                "category": category,
                "codepoint": code_point(char),
                "name": name,
                "count": 0,
                "locations": [],
                "locations_truncated": False,
            }
            self.items[key] = item
        item["count"] += 1
        if len(item["locations"]) < self.max_locations:
            item["locations"].append(
                {
                    "part": part,
                    "line": line,
                    "column": column,
                    "context": None,
                }
            )
        else:
            item["locations_truncated"] = True

    def attach_contexts(self, lines_by_part: Dict[str, List[str]]) -> None:
        for item in self.items.values():
            for location in item["locations"]:
                lines = lines_by_part.get(location["part"], [])
                line_number = location["line"]
                if 1 <= line_number <= len(lines):
                    line_text = lines[line_number - 1]
                    location["context"] = context_window(
                        line_text, location["column"] - 1
                    )

    def to_list(self) -> List[Dict[str, Any]]:
        def sort_key(item: Dict[str, Any]) -> Any:
            index = CATEGORY_ORDER.index(item["category"])
            return (index, item["codepoint"])

        return sorted(self.items.values(), key=sort_key)


def scan_text(
    text: str,
    part: str,
    findings: Findings,
    lines_by_part: Dict[str, List[str]],
) -> None:
    lines = text.splitlines()
    lines_by_part[part] = lines
    for line_number, line in enumerate(lines, 1):
        for index, char in enumerate(line):
            if classify(char) is not None:
                findings.add(char, part, line_number, index + 1)


def decode_text_bytes(raw: bytes) -> Tuple[str, str, bool]:
    """Decode a text file and report whether a BOM came from the encoding."""
    if raw.startswith(codecs.BOM_UTF16_LE) or raw.startswith(codecs.BOM_UTF16_BE):
        return raw.decode("utf-16"), "utf-16", True
    if raw.startswith(codecs.BOM_UTF32_LE) or raw.startswith(codecs.BOM_UTF32_BE):
        return raw.decode("utf-32"), "utf-32", True
    return raw.decode("utf-8", errors="replace"), "utf-8", False


def scan_text_file(path: Path, findings: Findings) -> Dict[str, Any]:
    raw = path.read_bytes()
    text, encoding, bom_from_encoding = decode_text_bytes(raw)
    lines_by_part: Dict[str, List[str]] = {}
    if bom_from_encoding:
        # The codec consumed the byte-order mark. Keep it visible to the scanner.
        text = "\uFEFF" + text
    scan_text(text, "content", findings, lines_by_part)
    findings.attach_contexts(lines_by_part)
    return {
        "encoding": encoding,
        "bom_from_encoding": bom_from_encoding,
        "bytes": len(raw),
    }


def local_name(tag: str) -> str:
    if "}" in tag:
        return tag.rsplit("}", 1)[1]
    return tag


def read_docx_properties(archive: zipfile.ZipFile) -> Dict[str, Any]:
    metadata: Dict[str, Any] = {"custom_properties": [], "core": {}}

    if "docProps/custom.xml" in archive.namelist():
        try:
            root = ET.fromstring(archive.read("docProps/custom.xml"))
            for prop in root:
                name = prop.attrib.get("name", "")
                value = ""
                value_type = ""
                if len(prop):
                    child = prop[0]
                    value_type = local_name(child.tag)
                    value = "".join(child.itertext()).strip()
                else:
                    value = (prop.text or "").strip()
                metadata["custom_properties"].append(
                    {
                        "name": name,
                        "type": value_type,
                        "value": value,
                        "pid": prop.attrib.get("pid", ""),
                    }
                )
        except ET.ParseError as error:
            metadata["custom_properties_error"] = str(error)

    if "docProps/core.xml" in archive.namelist():
        try:
            root = ET.fromstring(archive.read("docProps/core.xml"))
            fields = {
                "creator": "creator",
                "lastModifiedBy": "last_modified_by",
                "created": "created",
                "modified": "modified",
            }
            for element in root:
                name = fields.get(local_name(element.tag))
                if name:
                    metadata["core"][name] = (element.text or "").strip()
        except ET.ParseError as error:
            metadata["core_error"] = str(error)

    return metadata


def scan_docx_file(path: Path, findings: Findings) -> Dict[str, Any]:
    lines_by_part: Dict[str, List[str]] = {}
    parts_scanned: List[str] = []
    with zipfile.ZipFile(path) as archive:
        for name in archive.namelist():
            if not WORD_PART_RE.match(name):
                continue
            parts_scanned.append(name)
            try:
                root = ET.fromstring(archive.read(name))
            except ET.ParseError as error:
                raise ValueError("cannot parse {}: {}".format(name, error))
            paragraphs = list(root.iter(WORD_MAIN + "p"))
            if paragraphs:
                text = "\n".join("".join(p.itertext()) for p in paragraphs)
            else:
                text = "".join(root.itertext())
            scan_text(text, name, findings, lines_by_part)
        metadata = read_docx_properties(archive)

    findings.attach_contexts(lines_by_part)
    return {
        "parts_scanned": parts_scanned,
        "metadata": metadata,
    }


def discover(paths: List[str]) -> Tuple[List[Path], List[Dict[str, str]]]:
    files: List[Path] = []
    errors: List[Dict[str, str]] = []
    for raw_path in paths:
        path = Path(raw_path)
        if not path.exists():
            errors.append({"path": raw_path, "error": "path does not exist"})
            continue
        if path.is_dir():
            for candidate in sorted(path.rglob("*")):
                if candidate.is_file() and candidate.suffix.lower() in SUPPORTED_SUFFIXES:
                    files.append(candidate)
            continue
        if path.suffix.lower() not in SUPPORTED_SUFFIXES:
            errors.append(
                {
                    "path": raw_path,
                    "error": "unsupported format; expected .txt, .md, .markdown, or .docx",
                }
            )
            continue
        files.append(path)

    unique: List[Path] = []
    seen = set()
    for path in files:
        key = str(path.resolve())
        if key not in seen:
            seen.add(key)
            unique.append(path)
    return unique, errors


def scan_file(path: Path, max_locations: int) -> Dict[str, Any]:
    suffix = path.suffix.lower()
    findings = Findings(max_locations=max_locations)
    entry: Dict[str, Any] = {
        "path": str(path),
        "format": suffix.lstrip("."),
        "findings": [],
    }
    try:
        if suffix == ".docx":
            details = scan_docx_file(path, findings)
        elif suffix in TEXT_SUFFIXES:
            details = scan_text_file(path, findings)
        else:
            raise ValueError("unsupported format")
        entry.update(details)
        entry["findings"] = findings.to_list()
        entry["invisible_occurrences"] = sum(
            item["count"] for item in entry["findings"]
        )
    except Exception as error:  # report and continue to the next file
        entry["error"] = "{}: {}".format(type(error).__name__, error)
    return entry


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scan text and DOCX files for invisible characters and metadata."
    )
    parser.add_argument("paths", nargs="+", help="Files or directories to scan")
    parser.add_argument(
        "--max-locations",
        type=int,
        default=200,
        help="Maximum location records retained per code point (default: 200)",
    )
    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    if args.max_locations < 1:
        print("scan.py: --max-locations must be a positive integer", file=sys.stderr)
        return 2

    files, discovery_errors = discover(args.paths)
    entries = [scan_file(path, args.max_locations) for path in files]
    file_error_count = sum(1 for entry in entries if "error" in entry)

    by_category: Dict[str, int] = {category: 0 for category in CATEGORY_ORDER}
    total_occurrences = 0
    files_with_findings = 0
    custom_property_count = 0
    for entry in entries:
        if entry.get("findings"):
            files_with_findings += 1
        for item in entry.get("findings", []):
            by_category[item["category"]] += item["count"]
            total_occurrences += item["count"]
        metadata = entry.get("metadata") or {}
        custom_property_count += len(metadata.get("custom_properties", []))

    report = {
        "tool": "scan.py",
        "version": VERSION,
        "inputs": args.paths,
        "files": entries,
        "errors": discovery_errors,
        "summary": {
            "files_scanned": len(entries),
            "files_with_findings": files_with_findings,
            "invisible_occurrences": total_occurrences,
            "by_category": by_category,
            "docx_custom_properties": custom_property_count,
            "errors": len(discovery_errors) + file_error_count,
        },
    }
    json.dump(report, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")

    if discovery_errors or file_error_count:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
