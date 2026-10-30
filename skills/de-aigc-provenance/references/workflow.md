# Provenance Workflows

Use the same three-script sequence in every scenario: scan, clean, verify, then
re-scan. The differences are what you preserve as evidence and who reviews the
residual list.

All examples assume the current directory is
`skills/de-aigc-provenance/`. Adjust paths to the document under review. Keep an
untouched original in every workflow.

## Scenario 1: Pre-Submission Self-Check

Use when an author is about to upload a manuscript or supporting file and wants
a documented cleanup before submission.

```bash
# 1. Preserve the original and capture a baseline.
mkdir -p provenance
cp manuscript.docx provenance/manuscript.original.docx
python scripts/scan.py provenance/manuscript.original.docx \
  > provenance/scan-before.json

# 2. Clean a copy, never the baseline.
python scripts/clean.py provenance/manuscript.original.docx \
  -o provenance/manuscript.clean.docx --report provenance/clean.json

# 3. Prove that numbers and citations survived.
python scripts/fidelity.py provenance/manuscript.original.docx \
  provenance/manuscript.clean.docx > provenance/fidelity.json

# 4. Re-scan the cleaned artifact and attach the result.
python scripts/scan.py provenance/manuscript.clean.docx \
  > provenance/scan-after.json
```

Review `scan-after.json` before renaming the cleaned file. A variation selector
is expected to remain unless `--strip-variation-selectors` was deliberately
used. Open the DOCX in Word or LibreOffice and inspect comments, tracked
changes, headers, footers, and embedded objects, which the cleaner does not
remove. If a PDF is part of the submission, export a fresh PDF and handle its
metadata with a PDF-specific tool.

Submission gate:

- `fidelity.py` exits 0.
- The post-clean scan contains no zero-width, bidi, BOM, or soft-hyphen
  findings.
- Every retained variation selector and every unhandled metadata surface is
  listed in the handoff note.

## Scenario 2: Collaboration And Vendor Handoff

Use when a document moves between authors, a copy editor, a translation vendor,
or a production service and the sender must show that content was not silently
changed.

```bash
# Scan the received version before touching it.
python scripts/scan.py received.docx > provenance/vendor-scan.json

# Clean a copy for return or for the next stage.
python scripts/clean.py received.docx -o returned.clean.docx \
  --report provenance/returned-clean.json

# Compare the received text with the returned text.
python scripts/fidelity.py received.docx returned.clean.docx \
  --json-out provenance/returned-fidelity.json
```

Send three artifacts together:

1. the untouched received file;
2. the cleaned file;
3. `vendor-scan.json`, `returned-clean.json`, and
   `returned-fidelity.json`.

If `fidelity.py` reports a missing number, percentage, citation, DOI, arXiv
identifier, or table reference, do not accept the handoff. Locate the change and
decide whether it was authorized. New tokens fail by default; use
`--allow-additions` only when an addition is expected and documented, such as
an inserted disclosure statement.

For a directory of deliverables:

```bash
python scripts/clean.py incoming/ -o outgoing/ --report provenance/clean.json
python scripts/fidelity.py incoming/report.docx outgoing/report.docx
```

The directory form preserves relative paths under the output root. Review each
file record in the JSON; a partial success is not a clean batch.

## Scenario 3: Institutional Review Or Audit

Use when a reviewer, journal, funder, or integrity office asks what was done to
a file. The goal is a reproducible record, not a claim of compliance.

```bash
# Record the original fingerprint before any rewrite.
# PowerShell:
Get-FileHash manuscript.docx -Algorithm SHA256
# POSIX:
sha256sum manuscript.docx

# Build the evidence chain.
python scripts/scan.py manuscript.docx > evidence/scan-before.json
python scripts/clean.py manuscript.docx -o evidence/manuscript.clean.docx \
  --report evidence/clean.json
python scripts/fidelity.py manuscript.docx evidence/manuscript.clean.docx \
  --json-out evidence/fidelity.json
python scripts/scan.py evidence/manuscript.clean.docx \
  > evidence/scan-after.json
```

Attach the original fingerprint, both scans, the clean report, and the fidelity
report. State explicitly:

- which characters and metadata fields were removed;
- which were retained and why;
- which surfaces were not examined, including PDF metadata, EXIF, comments,
  tracked changes, embedded objects, and statistical watermarks;
- that no detector outcome, authorship conclusion, or compliance certification
  is implied.

If the review asks for a determination this skill cannot make, stop and name
the missing evidence. Do not convert a deterministic cleanup into a claim about
how the text was produced.

## Handling Script Results

| Result | Meaning | Action |
| --- | --- | --- |
| `scan.py` exit 0 | Scan completed; findings may still exist | Review `summary.by_category` and `metadata` |
| `clean.py` exit 0 | Every discovered file was rewritten | Review each file's `metadata_actions` |
| `clean.py` exit 1 | At least one file failed or a path was invalid | Fix the path or file; do not call the batch clean |
| `fidelity.py` exit 0 | Compared token multisets match | Proceed to manual review |
| `fidelity.py` exit 1 | A token disappeared or appeared unexpectedly | Locate and explain the difference; do not sign off |
| `fidelity.py` exit 2 | An input could not be read | Fix encoding, format, or path |

Run `scan.py` on the output after every successful `clean.py`. A baseline scan
alone cannot support a post-clean claim.

## Citation

```text
Linxira OS. Linxira Skills: de-aigc-provenance. Version 0.1.0.
Skill path: skills/de-aigc-provenance/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
