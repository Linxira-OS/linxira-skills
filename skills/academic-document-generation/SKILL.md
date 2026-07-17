---
name: academic-document-generation
description: Use when generating or validating academic DOCX, PDF, or TeX outputs from structured source material. Covers Pandoc, reference.docx, CSL/BibTeX inputs, renderer detection, output manifests, and honest reporting when Word, LaTeX, or PDF rendering is unavailable.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data]
---

# Academic Document Generation

Generate from structured source and a declared template rather than repeatedly
editing divergent copies of the same manuscript.

## Supported Stacks

- Markdown + Pandoc + `reference.docx` for DOCX.
- Markdown + Pandoc + CSL/BibTeX for bibliography-aware DOCX or PDF.
- LaTeX source + `latexmk` for template-controlled PDF.
- DOCX/PPTX + LibreOffice headless for conversion validation where available.

## Preflight

Check the requested tools before mutation:

```bash
pandoc --version
latexmk --version
libreoffice --version
```

If a required tool is absent, generate only the source artifact that can be
honestly produced and report the missing renderer. Do not substitute a renamed
file or claim a visual check occurred.

## DOCX Generation

For a Pandoc route, keep a versioned `reference.docx` that encodes paragraph,
heading, caption, and reference styles. Feed the Markdown source, bibliography,
CSL style, and citation processor through one repeatable command.

Apply the Chinese body defaults only when no institutional template overrides
them. Inspect the generated DOCX in a compatible renderer before declaring
final formatting correct.

## Output Manifest

Write `delivery-manifest.json` with:

- source paths and hashes
- selected template and citation style
- commands and tool versions
- outputs created
- warnings and unresolved rendering checks

## Bundled Script

Use `scripts/render-document.mjs plan academic-delivery.json` to inspect exact
Pandoc or LaTeX commands without writing deliverables. Use `execute` only after
the user has approved output locations and the required renderer is installed.

## Completion Criteria

- Every output is traceable to declared source and template.
- Required citation backend completed without unresolved keys.
- DOCX/PDF claims match actual renderer availability.
- Formatting exceptions are documented rather than silently normalized.

## Citation

```text
Linxira OS. Linxira Skills: academic-document-generation. Version 0.1.0.
Skill path: skills/academic-document-generation/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
