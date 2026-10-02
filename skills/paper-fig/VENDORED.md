# VENDORED: paper-fig

- **Upstream repo**: https://github.com/henryhlu/Editable-Design (EditDesign skills monorepo)
- **Upstream commit**: c87b16f
- **License**: Apache-2.0 (see NOTICE.md in this directory for third-party attribution — the package is an independent adaptation of OpenAI's Presentations 26.905.11957, and several bundled helper scripts remain "Copyright (c) OpenAI. All rights reserved.")

## Copied files
Entire upstream `skills/paper-fig/` directory, copied verbatim:
`SKILL.md`, `INSTALL.md`, `NOTICE.md`, `agents/`, `artifact_tool_docs/`, `assets/`, `container_tools/`, `domain_guidance/`, `references/`, `routing/`, `style_guidelines.md`, `template_following_scripts/`

## Modifications
- Added frontmatter fields `skill_class: workflow`, `load_policy: conditional`, `risk_tags: []` to SKILL.md (name/description already present).

## 未随迁依赖 / unresolved references
- `paper-fig/NOTICE.md` was copied with the directory and kept unchanged (upstream attribution notice).
- Runtime dependencies not bundled: `@oai/artifact-tool` presentation runtime, model service credentials, image-generation tool, and a bundled LibreOffice install — all resolved at runtime via `load_workspace_dependencies` or host-supplied paths (documented in SKILL.md / INSTALL.md).
- Broken intra-package relative links (paths resolve outside `artifact_tool_docs/` in upstream layout too; left unchanged per migration rules):
  - `artifact_tool_docs/api/API_DOCS.md:3` → `../API_QUICK_START.md` (actually resolves within dir; correct relative to `api/`)
  - `artifact_tool_docs/api/API_DOCS.md:7`, `api/references/jsx.md:167`, `api/references/rich-text.spec.md:75` → `../../references/native_bullets.md` / `../../../references/native_bullets.md`, which point above `artifact_tool_docs/` and do not resolve; the actual file lives at `references/native_bullets.md` in this directory. Recorded, not edited.
