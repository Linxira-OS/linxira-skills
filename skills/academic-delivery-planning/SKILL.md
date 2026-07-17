---
name: academic-delivery-planning
description: Use when starting a paper, report, thesis chapter, academic PPT, poster, rebuttal, or mixed research deliverable that needs coordinated writing, citations, images, document generation, and validation. Creates the delivery manifest and routes each production stage without conflating evidence, formatting, or visual assets.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data]
---

# Academic Delivery Planning

Create a delivery manifest before drafting files. The manifest prevents an
article, bibliography, figure set, and slide deck from drifting into incompatible
formats or untraceable assets.

## Intake

Collect:

1. Artifact type and target audience.
2. Required outputs: `docx`, `pdf`, `tex`, `pptx`, `png`, or source archive.
3. Language, venue, institution, and mandatory template.
4. Citation style and available reference source: DOI/PMID list, BibTeX, RIS,
   CSL JSON, reference manager export, or manual records.
5. Available real figures, tables, screenshots, datasets, and permissions.
6. Whether an external image-generation service is allowed.
7. Deadline, presentation duration, and expected review/Q&A format.

## Manifest

Create `academic-delivery.json` at the delivery root using the bundled
`ACADEMIC_DELIVERY_STANDARD.md`. Validate it with the bundled
`scripts/validate-academic-delivery.mjs` helper. Keep image metadata in the
manifest or `images/manifest.json` and references in `references/references.bib`
or a declared equivalent source.

Use `TOOLCHAIN_INSTALLATION.md` and
`scripts/check-academic-toolchain.mjs` for Arch Linux or Ubuntu renderer
preflight. Arch is a primary supported artifact environment and uses a complete
`pacman -Syu` transaction rather than a partial upgrade.

## Route

- Use `manuscript-structure-and-argument` for content architecture.
- Use `academic-document-formatting` for Chinese body typography.
- Use `citation-and-reference-formatting` for record integrity and style.
- Use `latex-academic-authoring` or `academic-document-generation` for files.
- Use `scientific-figures-and-tables` and `academic-visual-evidence` for
  figures and image boundaries.
- Use `academic-presentation-design` and `academic-presentation-generation`
  for talks and PPTX.

## Completion Criteria

- Artifact, output formats, citation style, and authoring stack are declared.
- Real evidence assets and illustrative assets are separated.
- Required user inputs and unresolved tool dependencies are visible.
- Every final file can be traced to source, manifest, and validation record.

## Citation

```text
Linxira OS. Linxira Skills: academic-delivery-planning. Version 0.1.0.
Skill path: skills/academic-delivery-planning/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
