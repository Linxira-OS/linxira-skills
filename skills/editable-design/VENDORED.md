# VENDORED: editable-design

- **Upstream repo**: https://github.com/henryhlu/Editable-Design
- **Upstream commit**: c87b16f
- **License**: Apache-2.0 (LICENSE and THIRD_PARTY_NOTICES.md copied with this directory and kept unchanged)

## Copied files
Entire upstream `skills/editable-design/` directory, copied verbatim:
`SKILL.md`, `README.md`, `LICENSE`, `THIRD_PARTY_NOTICES.md`, `agents/`, `assets/`, `font-kit/`, `pack.sh`, `references/`, `scripts/`, `tests/`

## Modifications
- Added frontmatter fields `skill_class: workflow`, `load_policy: conditional`, `risk_tags: []` to SKILL.md (name/description already present).

## 未随迁依赖 / unresolved references
- Sibling skill `html-to-pptx` is referenced (SKILL.md "Optional PPTX handoff" section, ~lines 592–598): the skill tells the agent to hand off `index.html` / `*.edited.html` to `html-to-pptx` when available. That skill is vendored alongside at `skills/html-to-pptx/`, so the reference resolves in this repository layout; it is optional at runtime.
- Runtime dependencies not bundled: Chromium-based browser + headless renderer used by `scripts/` for HTML→PNG rendering; `font-kit` handles local fonts. See README.md and THIRD_PARTY_NOTICES.md for details.
- No references to repository-root files (TOOLKIT.md, repo-level gallery/ or assets/) were found in the copied content; `assets/` mentions in SKILL.md refer to the per-project `assets/` output directory, not a repo-root path.
