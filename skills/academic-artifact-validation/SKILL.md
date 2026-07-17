---
name: academic-artifact-validation
description: Use when validating a generated academic DOCX, PPTX, or PDF artifact before delivery. Renders Office artifacts through LibreOffice, checks PDF page count and expected text with Poppler, produces page images for visual review, and records tool versions and validation results without claiming a visual pass when the renderer is unavailable.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data]
---

# Academic Artifact Validation

Use rendered artifacts for delivery checks. Source-level validation does not
prove that Word/PDF/PPT layout, citations, charts, or labels survive conversion.

## Required Tools

Detect before rendering:

```bash
libreoffice --version
pdfinfo -v
pdftotext -v
pdftoppm -v
```

On Windows, `soffice` may provide the LibreOffice command. PDF input needs only
the Poppler utilities; DOCX/PPTX input also needs LibreOffice. Do not report a
visual validation result when required tools are unavailable.

## Bundled Script

Run:

```bash
node scripts/render-and-inspect.mjs deliverable.pptx rendered --expect="Main conclusion"
```

The script accepts DOCX, PPTX, or already-rendered PDF input. It refuses output directories outside the artifact directory, rejects
symbolic-link/junction traversal, converts to PDF, checks expected text and page
count, writes page PNGs, and creates `render-report.json`.

## Review Steps

1. Confirm all expected pages exist and the page count matches the manifest.
2. Inspect generated page images for overflow, overlap, cropped labels, missing
   citations, unreadable legends, and font substitution.
3. Confirm AI-generated labels and external image attribution remain visible.
4. Record unresolved visual concerns rather than calling the artifact final.

## Completion Criteria

- Render report records renderer and Poppler versions.
- Required expected text is present in extracted PDF text.
- Page images are available for human visual inspection.
- Human review outcome is separate from structural/render success.

## Citation

```text
Linxira OS. Linxira Skills: academic-artifact-validation. Version 0.1.0.
Skill path: skills/academic-artifact-validation/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
