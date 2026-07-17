# Academic Delivery Standard

## Scope

This standard governs generated or revised academic papers, reports, reference
lists, figures, and slide decks. It applies after the user or venue has supplied
any mandatory institutional template. A journal, university, grant, or course
template always overrides this repository default.

## Artifact Manifest

Every multi-file delivery begins with `academic-delivery.json`:

```json
{
  "artifact": "paper",
  "language": "zh-CN",
  "outputs": ["docx", "pdf", "tex"],
  "citationStyle": "gb-t-7714-2015-numeric",
  "authoringStack": "pandoc-docx",
  "images": {
    "requireRealEvidence": true,
    "allowAiIllustration": true
  }
}
```

Supported `artifact` values are `paper`, `thesis-chapter`, `report`, `slides`,
`poster`, `rebuttal`, and `cover-letter`. `authoringStack` is one of
`pandoc-docx`, `latex-bibtex`, `latex-biblatex`, or `pptxgenjs`.

Every requested output must be handled by the selected stack:

| Authoring stack | Allowed outputs |
| --- | --- |
| `pandoc-docx` | `docx`, `pdf`, `tex` |
| `latex-bibtex` | `pdf`, `tex` (PDF required) |
| `latex-biblatex` | `pdf`, `tex` (PDF required) |
| `pptxgenjs` | `pptx` |

`slides` artifacts require `pptxgenjs`. Do not combine unrelated output types in
one manifest; use coordinated manifests when a paper and a slide deck belong to
the same delivery.

DOI/PMID metadata retrieval is a separate, explicit external step. Send only
identifiers after user approval, retain the normalized record as source data,
and verify returned metadata before rendering it as a bibliography.

## Chinese Paper Body Default

This is a common domestic default for the paper body only. It is not claimed as
a universal national or institutional template.

| Element | Default |
| --- | --- |
| Paper title at body opening | Sanhao |
| First through fourth heading levels | Xiaosanhao |
| Body text | Sihao |
| Figure and table captions | Xiaosihao, centered |
| Reference-list heading | Xiaosanhao |
| Reference-list entries | Xiaosihao |

## Numeric Citation Marks

Use half-width English punctuation in one square-bracket group:

```text
[2]
[2,7]
[2-7]
```

Use `,` for non-contiguous citations and `-` for an inclusive continuous range.
Do not put full-width punctuation or multiple adjacent bracket groups in the
same citation cluster.

## Image Classes

Every image has one class: `evidence`, `schematic`, or `decorative`.

- Evidence must be real data, an actual screenshot, or an explicitly declared
  simulation.
- AI-generated images may be schematic or decorative only.
- AI-generated images require a visible label in a caption, slide, note, or
  adjacent source statement.
- AI-generated images require a provenance sidecar that records model, prompt
  hash, output path, and output hash.
- Ask for user-provided real images before substituting an illustration where a
  visual claim depends on evidence.

## Delivery Record

Each output directory must retain its manifest, source files, citation database,
image manifest, tool versions, command log, unresolved warnings, and final
artifacts. Do not report PDF, DOCX, or PPTX success when the required renderer
is unavailable.

The repository validates the same fixture routes on both Arch Linux and Ubuntu
with Pandoc, PptxGenJS, XeLaTeX/BibTeX, XeLaTeX/Biber, LibreOffice, and Poppler.
It verifies file creation, PDF conversion, page count, selected rendered text,
and page-image production. This is a baseline artifact check, not a substitute
for venue-specific template review or human visual review of every figure.
Pushes, pull requests, manual dispatches, and a weekly scheduled run exercise the
workflow so rolling Arch package changes are detected even when the repository
source has not changed.
