---
name: latex-academic-authoring
description: Use when creating, compiling, debugging, or reviewing an academic LaTeX project with BibTeX or biblatex/Biber. Covers engine selection, Chinese typesetting, bibliography backend choice, reproducible compilation, warning review, and source-to-PDF validation.
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# LaTeX Academic Authoring

Use LaTeX when the venue supplies a class/template, the manuscript requires
stable mathematical/typesetting control, or reproducible source-to-PDF builds
matter more than interactive Word editing.

## Preflight

Detect and record:

```bash
latexmk --version
xelatex --version
biber --version
bibtex --version
```

Do not claim a PDF build if the selected engine is unavailable. For Chinese
content, prefer XeLaTeX with a CJK-capable setup unless the venue template
explicitly requires another engine.

## Choose One Bibliography Backend

- Use **BibTeX** when a journal class/template explicitly requires it or ships a
  `.bst` style.
- Use **biblatex + Biber** when the project needs richer source categories,
  localization, URL/DOI control, or modern bibliography logic.
- Do not mix `\bibliography`/BibTeX commands with `biblatex` commands in one
  manuscript.

Keep one canonical `.bib` database and validate duplicate citation keys before
compiling.

## Build Commands

For a BibTeX project:

```bash
latexmk -xelatex -bibtex -interaction=nonstopmode -halt-on-error main.tex
```

For a biblatex/Biber project:

```bash
latexmk -xelatex -bibtex -interaction=nonstopmode -halt-on-error main.tex
```

Run from a dedicated build directory where the template supports it. Preserve
the `.log`, `.blg`, `.bbl`, and command record for review.

## Chinese Numeric Citation Rule

For a Chinese numeric style, configure the package/template so grouped citations
render as `[2]`, `[2,7]`, and `[2-7]` using half-width punctuation. Confirm the
actual rendered PDF rather than assuming a package option produces the expected
output.

## Validation

Fail or report explicitly on:

- undefined citations and bibliography keys
- unresolved cross references
- missing figures or fonts
- overfull boxes affecting readable output
- bibliography backend mismatch
- compiler warnings that change output semantics

## Completion Criteria

- Source compiles reproducibly with one declared engine/backend.
- PDF has no unresolved citation or cross-reference markers.
- Bibliography style and rendered numeric marks match the manifest.
- Tool versions and remaining warnings are recorded.

## Citation

```text
Linxira OS. Linxira Skills: latex-academic-authoring. Version 0.1.0.
Skill path: skills/latex-academic-authoring/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
