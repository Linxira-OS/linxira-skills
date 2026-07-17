# Research Communication Core Review

## Decision

`research-communication-core` is an installable first-party profile for
academic writing, references, figures/tables, scientific slide design, Chinese
paper-body formatting, document/LaTeX delivery, and academic image/AI-visual
boundaries. It extends `core` with 11 delivery-oriented skills and relies on
`research-manuscript-integrity` from `core` as the evidence and citation-truth
guard.

## Included Skills

| Skill | Role |
| --- | --- |
| `academic-delivery-planning` | Define artifact, outputs, citation style, toolchain, and asset manifest before production. |
| `academic-artifact-validation` | Render DOCX/PPTX artifacts through LibreOffice, extract PDF checks, and produce page images for review. |
| `academic-document-formatting` | Format Chinese academic paper/report bodies, caption typography, and numeric bracket citations. |
| `academic-document-generation` | Generate and validate declared DOCX, PDF, and TeX outputs. |
| `manuscript-structure-and-argument` | Draft and revise papers, abstracts, rebuttals, and thesis sections by section purpose and argument flow. |
| `citation-and-reference-formatting` | Normalize citation categories, style switching, software/data references, and unresolved metadata markers. |
| `latex-academic-authoring` | Select BibTeX or biblatex/Biber and compile reproducible LaTeX projects. |
| `scientific-figures-and-tables` | Plan and review figures, captions, panel structure, and tables for papers or talks. |
| `academic-visual-evidence` | Distinguish evidence images from AI-generated or decorative illustrations and require explicit labeling. |
| `academic-presentation-design` | Build seminar, defense, conference, and journal-club slide decks with citation and backup-slide discipline. |
| `academic-presentation-generation` | Generate and validate manifest-driven PPTX deliverables with PptxGenJS. |

## Boundary

These skills are first-party and do not redistribute external document or PPT
templates. They complement, but do not replace, `research-manuscript-integrity`.
That guard still owns evidence labels, citation truthfulness, and completion
claims.

## Validation

Current automated validation covers metadata, route generation, install/update/
uninstall lifecycle, packed artifact contents, manifest validation, BibTeX
structure checks, and the same artifact fixture on Arch Linux and Ubuntu. Each
environment installs its native package-manager toolchain. The fixture installs
PptxGenJS in the target project, generates DOCX, PPTX, XeLaTeX/BibTeX, and
XeLaTeX/Biber PDF artifacts from materialized skills, converts Office outputs
through LibreOffice, and checks resulting PDF text and page images. It does not
claim universal compatibility with every institutional Word, LaTeX, or
PowerPoint template.
