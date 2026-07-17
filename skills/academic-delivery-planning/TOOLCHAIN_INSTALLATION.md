# Academic Toolchain Installation

Install system renderers deliberately. The bundled checker reports missing
commands and a distro-specific recommendation; it never installs packages or
uses elevated privileges.

## Arch Linux

Arch is a primary supported artifact environment. Perform a full synchronized
upgrade and install in one transaction; do not use a partial upgrade:

```bash
sudo pacman -Syu --needed pandoc-cli libreoffice-fresh poppler \
  texlive-binextra texlive-xetex texlive-latexrecommended \
  texlive-bibtexextra biber otf-latin-modern ttf-liberation
```

Package ownership:

| Capability | Arch package |
| --- | --- |
| Pandoc | `pandoc-cli` |
| DOCX/PPTX headless conversion | `libreoffice-fresh` |
| `pdfinfo`, `pdftotext`, `pdftoppm` | `poppler` |
| `latexmk` | `texlive-binextra` |
| XeLaTeX engine and support | `texlive-xetex` |
| `fontspec.sty` | `texlive-latexrecommended` |
| BibTeX/biblatex styles, including GB/T 7714 packages | `texlive-bibtexextra` |
| Biber executable | `biber` |
| Latin Modern OpenType fonts | `otf-latin-modern` |
| Stable office font substitution baseline | `ttf-liberation` |

`texlive-xetex` and `texlive-binextra` pull the required TeX Live base packages.
Install an institutional CJK font family separately when a template mandates a
specific Chinese font; do not silently substitute it in a final submission.

## Ubuntu

```bash
sudo apt-get update
sudo apt-get install pandoc libreoffice poppler-utils latexmk texlive-xetex \
  texlive-bibtex-extra biber fonts-liberation fonts-lmodern
```

## Preflight

```bash
node scripts/check-academic-toolchain.mjs
node scripts/check-academic-toolchain.mjs --require-all
```

The strict form exits nonzero when any required command is absent. Record tool
versions in delivery output because Arch is rolling release and renderer output
can change after a system upgrade.
