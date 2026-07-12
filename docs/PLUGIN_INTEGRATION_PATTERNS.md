# Plugin Skill Integration Patterns

## Why This Exists

The current repository is collecting large hierarchical skill corpora, not a
single flat install set. Previous local work in
`openagent-labforge/Future/extendai-lab-v1` already solved several practical
problems that this project will face again:

- how to ship some skills directly with an npm package
- how to keep large template packs out of the default visible skill list
- how to resolve package-relative paths after npm install
- how to load categories on demand without flattening directory structure

This document records the reusable parts of that design and separates them from
project-specific content.

## The Three Loading Surfaces

The previous plugin used three distinct skill surfaces. The split is still
useful.

### 1. Directly exposed bundled skills

These are ordinary skill directories that become visible in the runtime skill
list and can be loaded by name.

Example from the previous plugin:

- Source root: `src/skills/`
- Installed target: `getConfigDir()/skills`
- Packaging: included in npm `files`

Use this surface for:

- first-party local skills
- a small number of high-signal official skills
- workflows users may intentionally invoke by name

Do not use it for hundreds of variants that would overwhelm the user.

### 2. Tool-loaded category packs

These skills stay on disk in full directories, but they are not shown as a flat
user-facing list. A dedicated tool loads one or more categories for the current
session.

Example from the previous plugin:

- Category definitions: `src/template-skills/catalog.ts`
- Recursive loader: `src/template-skills/loader.ts`
- Per-session state: `src/template-skills/session-manager.ts`
- Tool entry: `load_skill_template`

The old categories were:

- `html-deck`
- `html-templates`
- `academic-tools`

This surface is the best fit for:

- `html-anything` style template collections
- office/document helper packs
- academic writing and formatting toolkits
- very large specialist catalogs where the agent should browse a category first

### 3. Always-on internal guidance

These are not discoverable install targets. They are embedded into the agent's
prompting or internal routing and act as behavior layers.

Use this surface for:

- coding philosophy
- review discipline
- safety defaults
- formatting conventions

Open Science's `domain-check`, `stats-integrity`, `large-file`, and
`traceability-review` are not exactly prompt-only, but they behave like guard
layers rather than peer domain skills and should be routed similarly.

## Packaging Lessons From The Previous Plugin

The previous plugin's npm package explicitly shipped these payload roots:

- `dist/`
- `ThirdParty/`
- `src/skills/`
- `resources/bioSkills/`
- `resources/academicSkills/`

This matters because the runtime needs the full directory trees after install,
not only compiled JavaScript.

### Path Resolution

The previous plugin hit the classic npm packaging bug: build-time absolute paths
worked on the developer machine and failed after install. The fix was to resolve
everything from `import.meta.url` at runtime.

That pattern should be reused here:

- never bake workspace-local absolute paths into a built artifact
- always derive the package root at runtime
- keep source trees relative to the package root

### Config Directory Resolution

The old plugin resolved OpenCode config paths in this order:

1. `OPENCODE_CONFIG_DIR`
2. `XDG_CONFIG_HOME/opencode`
3. `~/.config/opencode`

This is a good default and should be preserved.

## Source Classes And Recommended Handling

### Anthropic official skills

Repository: `anthropics/skills`

Important findings:

- The repository contains a mixed license model.
- Many example skills are Apache-2.0.
- `skills/docx`, `skills/pdf`, `skills/pptx`, and `skills/xlsx` are explicitly
  source-available/proprietary, not open source.
- `doc-coauthoring` is a general document workflow skill worth studying for
  structure and review stages.

Recommended handling:

- treat Apache-2.0 example skills as normal third-party candidates
- treat proprietary document skills as reference-only unless a release path is
  explicitly compatible
- never flatten their office trees or strip references/scripts from the skill
  directory

### OpenAI official Codex skills

Repository: `openai/skills`

Important findings:

- The repository is deprecated in favor of `openai/plugins`.
- It still contains useful installer and workflow examples such as
  `skill-installer`, `jupyter-notebook`, `pdf`, and Notion-related skills.
- It does not provide an official `docx`/`pptx`/`xlsx` suite comparable to
  Anthropic's document skills.

Recommended handling:

- use as a legacy reference for skill installation and curated skill packaging
- do not anchor new office/document strategy on this deprecated repository

### OpenAI current plugin examples

Repository: `openai/plugins`

Important findings:

- This is the current Codex example repository.
- It contains many plugin-scoped skill bundles rather than one global catalog.
- Relevant document and presentation examples include:
  - `plugins/google-drive/skills/google-docs`
  - `plugins/google-drive/skills/google-slides`
  - `plugins/sharepoint/skills/sharepoint-word-docs`
  - `plugins/sharepoint/skills/sharepoint-powerpoint`
  - `plugins/sharepoint/skills/sharepoint-spreadsheets`
  - `plugins/build-web-data-visualization/skills/reports-pdfs-and-slide-automation`
  - `plugins/notion/skills/notion-research-documentation`
  - `plugins/canva/skills/canva-branded-presentation`

Recommended handling:

- treat this as the canonical current Codex integration reference
- prefer plugin-bundle style grouping over one monolithic office skill pack
- study connector-first workflows separately from file-based office generation

### HTML Anything

Repository: `nexu-io/html-anything`

Important findings:

- License: Apache-2.0.
- Current upstream snapshot exposes 81 `SKILL.md` files under
  `next/src/lib/templates/skills/`.
- Each template directory includes `SKILL.md`, `example.html`, and sometimes
  `example.md` or `assets/`; keep each directory complete.
- Twenty-two skills expose `example_source_url` metadata for external examples
  or inspiration. They require the same provenance gate as other aggregated
  material before automatic routing or redistribution.
- The previous plugin carried a migrated snapshot with 75 skill directories.
- The migrated snapshot is missing at least these current upstream skills:
  - `article-sketchnote-editorial`
  - `competitive-teardown`
  - `deck-ljg-present`
  - `exec-briefing-memo`
  - `experiment-readout`
  - `info-funnel`

Recommended handling:

- keep the upstream tree as a complete category-loaded template track under
  `sources/html-anything`, with its nested template directory as discovery root
- identify it by source track plus relative path, not only by skill name
- prefer upstream sync over maintaining an increasingly stale local forked copy

### HTML PPT and Guizang PPT

Repositories represented in the previous plugin:

- `html-ppt-skill` — MIT
- `guizang-ppt-skill` — MIT

Recommended handling:

- both are good selective include candidates for HTML/slide generation
- keep their full directories and license files intact
- expose them through a deck-template category rather than a flat user list

### Previous plugin academic office stack

Local source: `resources/academicSkills/`

Current notable skills:

- `office-academic-skill`
- `research-writing-skill`
- `academic-md2docx`
- `academic-pipeline`
- citation and CNKI tools

Recommended handling:

- this is a useful local reference for Chinese-first academic workflows
- it is not automatically a releasable upstream source unless each file's origin
  and license are clarified
- structurally, it fits best as an `academic-tools` tool-loaded category

### WPS built-in skills archive

Local source: `C:\Users\BoHuYeShan\Desktop\$R79Z3I3.7z`

Important findings:

- It contains a `builtin-skills/` tree that syncs into
  `~/.wpscomate/agent/skills/builtin/<agent>/...` by manifest.
- Manifest-based agent partitioning is already implemented.
- Relevant office/document skills include:
  - `powerpoint-jsapi`
  - `word-jsapi`
  - `excel-jsapi`
  - `xlsx`
  - `deck-presenter`
  - `capability-guide/plugins/wps365`

Recommended handling:

- use this archive as a reference for built-in partitioning and Office JSAPI
  skill design
- treat it as reference-only unless redistribution and license status are made
  explicit

## Recommended Architecture For This Repository

### Directly exposed

- first-party project skills under `skills/`
- a small, reviewed set of stable official or selectively included third-party
  skills

### Category-loaded packs

- `life-sciences` source tracks
- `html-deck`
- `html-templates`
- `academic-tools`
- `office-connectors`
- `office-jsapi`

### Guard layers

- Open Science integrity and review skills
- first-party safety and engineering guidance

### Shadowed aliases

When the same capability exists in a canonical direct source and in an aggregate
snapshot, keep both for provenance but only route the canonical one by default.

## Minimal Reuse Checklist

If this project reuses the old plugin's architecture, keep these five rules:

1. Use package-root-relative discovery after install.
2. Keep complete directories, not isolated `SKILL.md` files.
3. Separate visible direct skills from tool-loaded packs.
4. Use session-scoped category loading for large template families.
5. Record source-track identity and license state before execution.
