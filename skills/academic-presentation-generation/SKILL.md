---
name: academic-presentation-generation
description: Use when generating, exporting, or validating an academic PPTX deck from a slide plan, figures, citations, and image manifest. Uses PptxGenJS for reproducible PPTX generation and requires a rendered visual review when LibreOffice or another approved renderer is available.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data]
---

# Academic Presentation Generation

Generate a deck from a slide manifest, not from an unstructured prompt. The
manifest must declare each slide's conclusion, evidence assets, citation keys,
and whether any image is real evidence, schematic, or AI-generated.

## Toolchain

Use PptxGenJS for PPTX creation. Detect optional renderers before claiming visual
validation:

```bash
node --version
libreoffice --version
```

Do not hand-draw OOXML or claim PDF screenshots were reviewed when no renderer
is installed.

The bundled `scripts/create-pptx.mjs` validates a structured slide manifest in
`plan` mode without dependencies. Its `create` mode requires PptxGenJS in the
target project: `npm install --save-dev pptxgenjs`.

## Required Slide Record

For each slide record:

- takeaway title
- visual purpose
- evidence/source asset IDs
- short inline citation or source marker
- AI-generated-image label when applicable
- speaker-note or backup-slide status

Use 16:9 by default unless the manifest specifies another aspect ratio.

## Generation Rules

- Create stable layout constants for margins, title band, body region, citation
  footer, and image area.
- Never allow text boxes to auto-grow into citation or footer space.
- Use real result figures for evidence slides.
- Request user real images before generating illustrative substitutes.
- Include an explicit label for every AI-generated illustration.

## Validation

When a renderer is available:

1. Export PPTX to PDF or page images.
2. Inspect every slide for overflow, overlap, cropped citations, tiny labels,
   unreadable legends, and unlabeled AI images.
3. Check that citations do not collide with chart axes or page numbers.

Without a renderer, perform structural layout checks and report visual review as
unavailable.

## Completion Criteria

- PPTX, slide manifest, source assets, and citations are retained together.
- Each slide has one declared purpose and visible source handling.
- AI-generated visuals are clearly marked and never used as evidence.
- Rendered visual validation is either passed or explicitly unavailable.

## Citation

```text
Linxira OS. Linxira Skills: academic-presentation-generation. Version 0.1.0.
Skill path: skills/academic-presentation-generation/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
