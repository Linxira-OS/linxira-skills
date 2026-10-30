#!/usr/bin/env python3
"""Compare numbers, citations, and table references before and after a rewrite.

Exit status 0 means the compared token multisets match. Exit status 1 means a
token disappeared, or a new token appeared without --allow-additions. Exit
status 2 means an input could not be read.

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
from collections import Counter
from pathlib import Path
from typing import Any, Counter as CounterType, Dict, List, Optional

VERSION = "1.0.0"
WORD_MAIN = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

NUMBER_RE = re.compile(
    r"(?<![\w.])[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)"
    r"(?:\.\d+)?(?:[eE][+-]?\d+)?(?![\w.])"
)
PERCENT_RE = re.compile(
    r"(?<![\w.])(?:\d{1,3}(?:,\d{3})+|\d+)"
    r"(?:\.\d+)?\s*[%％]"
)
BRACKET_CITATION_RE = re.compile(r"\[\s*\d+(?:\s*[,;–—-]\s*\d+)*\s*\]")
AUTHOR_YEAR_RE = re.compile(
    r"\([A-Z][^(),;]{0,60}?,\s*(?:19|20)\d{2}[a-z]?"
    r"(?:\s*;\s*[A-Z][^(),;]{0,60}?,\s*(?:19|20)\d{2}[a-z]?)*\)"
)
DOI_RE = re.compile(r"\b10\.\d{4,9}/[-._;()/:A-Za-z0-9]+\b")
ARXIV_RE = re.compile(
    r"\barXiv:\s*(?:\d{4}\.\d{4,5}|[a-z-]+(?:\.[A-Z]{2})?/\d{7})(?:v\d+)?",
    re.IGNORECASE,
)
TABLE_RE = re.compile(
    r"\b(?:Extended\s+Data\s+|Supplementary\s+|Supplemental\s+)?Tables?\s+"
    r"(?:S?\d+[A-Za-z]?)"
    r"(?:\s*(?:,|and|&|[-–—])\s*(?:S?\d+[A-Za-z]?))*\b"
    r"|\bTab\.\s*S?\d+[A-Za-z]?\b"
    r"|(?:附)?表\s*S?\d+[A-Za-z]?"
)

CATEGORIES = [
    ("numbers", NUMBER_RE),
    ("percentages", PERCENT_RE),
    ("bracket_citations", BRACKET_CITATION_RE),
    ("author_year_citations", AUTHOR_YEAR_RE),
    ("dois", DOI_RE),
    ("arxiv_ids", ARXIV_RE),
    ("table_references", TABLE_RE),
]


def normalize(token: str) -> str:
    token = unicodedata.normalize("NFKC", token)
    token = re.sub(r"\s+", " ", token).strip()
    return token


def decode_text(raw: bytes) -> str:
    if raw.startswith(codecs.BOM_UTF16_LE) or raw.startswith(codecs.BOM_UTF16_BE):
        return raw.decode("utf-16")
    if raw.startswith(codecs.BOM_UTF32_LE) or raw.startswith(codecs.BOM_UTF32_BE):
        return raw.decode("utf-32")
    return raw.decode("utf-8-sig", errors="replace")


def docx_text(path: Path) -> str:
    with zipfile.ZipFile(path) as archive:
        try:
            data = archive.read("word/document.xml")
        except KeyError:
            raise ValueError("DOCX has no word/document.xml")
    root = ET.fromstring(data)
    paragraphs = list(root.iter(WORD_MAIN + "p"))
    if paragraphs:
        return "\n".join("".join(paragraph.itertext()) for paragraph in paragraphs)
    return "".join(root.itertext())


def extract_text(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(str(path))
    if path.is_dir():
        raise ValueError("expected a file, not a directory: {}".format(path))
    if path.suffix.lower() == ".docx":
        return docx_text(path)
    if path.suffix.lower() in {".txt", ".md", ".markdown"}:
        return decode_text(path.read_bytes())
    raise ValueError("unsupported format for fidelity comparison: {}".format(path))


def extract_tokens(text: str) -> Dict[str, CounterType[str]]:
    tokens: Dict[str, CounterType[str]] = {}
    for name, pattern in CATEGORIES:
        normalized = [normalize(match.group(0)) for match in pattern.finditer(text)]
        tokens[name] = Counter(normalized)
    return tokens


def diff_counters(
    before: CounterType[str], after: CounterType[str]
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    missing: List[Dict[str, Any]] = []
    added: List[Dict[str, Any]] = []
    for token in sorted(set(before) | set(after)):
        difference = after.get(token, 0) - before.get(token, 0)
        if difference < 0:
            missing.append({"token": token, "count": -difference})
        elif difference > 0:
            added.append({"token": token, "count": difference})
    return missing, added


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Verify numeric, citation, DOI, and table-reference fidelity."
    )
    parser.add_argument("before", help="Original text, Markdown, or DOCX file")
    parser.add_argument("after", help="Cleaned or rewritten file to compare")
    parser.add_argument(
        "--allow-additions",
        action="store_true",
        help="Do not fail when the rewritten file contains new tokens",
    )
    parser.add_argument(
        "--json-out",
        help="Write the JSON report to this path as well as stdout",
    )
    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    try:
        before_text = extract_text(Path(args.before))
        after_text = extract_text(Path(args.after))
    except Exception as error:
        report = {
            "tool": "fidelity.py",
            "version": VERSION,
            "before": args.before,
            "after": args.after,
            "status": "error",
            "error": "{}: {}".format(type(error).__name__, error),
        }
        serialized = json.dumps(report, ensure_ascii=False, indent=2)
        sys.stdout.write(serialized + "\n")
        if args.json_out:
            output = Path(args.json_out)
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(serialized + "\n", encoding="utf-8")
        return 2

    before_tokens = extract_tokens(before_text)
    after_tokens = extract_tokens(after_text)

    checks: Dict[str, Any] = {}
    failures: List[str] = []
    warnings: List[str] = []
    for name, _ in CATEGORIES:
        missing, added = diff_counters(before_tokens[name], after_tokens[name])
        checks[name] = {
            "before_total": sum(before_tokens[name].values()),
            "after_total": sum(after_tokens[name].values()),
            "missing": missing,
            "added": added,
        }
        if missing:
            failures.append(
                "{}: {} token occurrence(s) missing".format(
                    name, sum(item["count"] for item in missing)
                )
            )
        if added:
            message = "{}: {} new token occurrence(s)".format(
                name, sum(item["count"] for item in added)
            )
            if args.allow_additions:
                warnings.append(message)
            else:
                failures.append(message)

    status = "pass" if not failures else "fail"
    report = {
        "tool": "fidelity.py",
        "version": VERSION,
        "before": args.before,
        "after": args.after,
        "options": {"allow_additions": args.allow_additions},
        "checks": checks,
        "failures": failures,
        "warnings": warnings,
        "status": status,
    }
    serialized = json.dumps(report, ensure_ascii=False, indent=2)
    sys.stdout.write(serialized + "\n")
    if args.json_out:
        output = Path(args.json_out)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(serialized + "\n", encoding="utf-8")

    return 0 if status == "pass" else 1


if __name__ == "__main__":
    sys.exit(main())
