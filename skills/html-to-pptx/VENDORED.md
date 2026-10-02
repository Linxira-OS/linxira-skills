# VENDORED: html-to-pptx

- **Upstream repo**: https://github.com/henryhlu/Editable-Design
- **Upstream commit**: c87b16f
- **License**: Apache-2.0 (LICENSE and THIRD_PARTY_NOTICES.md copied with this directory and kept unchanged)

## Copied files
Entire upstream `skills/html-to-pptx/` directory, copied verbatim:
`SKILL.md`, `README.md`, `LICENSE`, `THIRD_PARTY_NOTICES.md`, `agents/`, `pack.sh`, `requirements.txt`, `requirements-check.txt`, `scripts/`

## Modifications
- Added frontmatter fields `skill_class: workflow`, `load_policy: conditional`, `risk_tags: []` to SKILL.md (name/description already present).

## 未随迁依赖 / unresolved references
- Sibling skill `editable-design`: this skill auto-detects and converts `editor.html` (from editable-design) and `layers.html` (layer breakdown) files; that skill is vendored alongside at `skills/editable-design/`, so the reference resolves in this repository layout.
- Runtime dependencies not bundled (installed on first run by `scripts/run.sh` into an isolated `.venv`): Python 3.10+, Python dependencies from `requirements.txt`, and Playwright Chromium. No LLM or persistent service required.
- No references to repository-root files (TOOLKIT.md, repo-level gallery/ or assets/) were found in the copied content.
