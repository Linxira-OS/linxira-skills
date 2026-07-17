# Academic Delivery Standard

This materialized reference is the runtime copy of the academic delivery
standard. A mandatory university, journal, funder, or course template overrides
these defaults.

## Manifest

Start every multi-file delivery with `academic-delivery.json` using the bundled
`templates/academic-delivery.example.json`. Declare artifact type, language,
requested outputs, citation style, authoring stack, source files, and image
assets. Validate it with `scripts/validate-academic-delivery.mjs` before
generation.

## Chinese Paper Body Default

| Element | Default |
| --- | --- |
| Paper title at body opening | Sanhao |
| First through fourth heading levels | Xiaosanhao |
| Body text | Sihao |
| Figure and table captions | Xiaosihao, centered |
| Reference-list heading | Xiaosanhao |
| Reference-list entries | Xiaosihao |

These are common domestic defaults for the paper body, not a universal template.

## Numeric Citation Marks

Use half-width English punctuation in one bracket group: `[2]`, `[2,7]`, and
`[2-7]`. Use a comma for non-contiguous references and a hyphen for a continuous
range.

## Evidence and AI Images

Every image is `evidence`, `schematic`, or `decorative`.

- Evidence must be a real data product, actual screenshot, or declared simulation.
- AI-generated images may be schematic or decorative only and require a visible
  `AI-generated` label.
- Ask for user-provided real images before replacing an evidence-bearing visual
  with an illustration.
- Do not submit controlled, patient, unpublished, or otherwise protected material
  to an external image service without an approved data boundary.

## Delivery Record

Keep source files, citation database, image manifest, tool versions, command
record, unresolved warnings, and final artifacts together. Never report a DOCX,
PDF, or PPTX render as successful when its required renderer was unavailable.
