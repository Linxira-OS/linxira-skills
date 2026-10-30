# Changelog

All notable changes to this package are documented in this file.

## Unreleased

## [0.1.5] - 2026-10-30

### Added

- De-AI-tone writing family in native languages: `academic-humanizer`
  (English academic papers, abstracts, rebuttals, NSF/NIH proposals),
  `humanizer` (English general pattern catalog), `sepia` (narrative,
  discourse, and venue passes plus Chinese calibration), and `qu-ai-wei`
  (Simplified Chinese general, v0.9.1 pinned). All MIT, vendored with pinned
  revisions; `nsfc-humanization` remains the NSFC-grant specialist.
- `de-aigc-provenance`: clean-room first-party skill that scans and cleans
  invisible characters and document metadata (TXT/MD/DOCX/PNG/JPEG) and gates
  number, citation, and table-reference fidelity. No detection-evasion claims.
- Plotting gap fillers: `r-ggplot-figures` (R/ggplot2 publication figures with
  patchwork and journal-exact export) and `figure-polish` (uniform, disclosed
  image polishing with integrity red lines).
- `research-communication-core` now carries 54 skills; route indexes updated;
  THIRD_PARTY_NOTICES and SOURCES list the four new MIT upstreams.

## [0.1.4] - 2026-10-29

### Changed

- The Publish workflow now creates the matching GitHub Release on the same tag
  right after the signed npm publish succeeds (`gh release create
  --generate-notes`, idempotent when a Release already exists). Publish and
  Release steps run only for `v*` tag refs, and the workflow keeps a single
  trigger source (tag push) so creating a Release never re-triggers a second
  publish.

## [0.1.3] - 2026-10-28

### Added

- User-scope installation: `init`, `status`, `update`, and `uninstall` accept
  `--user` (alias `--global`). A user-scope install does not require a Git
  repository, does not touch `AGENTS.md` or `.gitignore`, and never writes to
  `~/.zeta`. It installs under `$LINXIRA_SKILLS_HOME` when set, otherwise the
  OS home directory: skills in `<scope root>/.agents/skills/` (namespaced
  `linxira-*` roots) and metadata in
  `<scope root>/.agents/linxira-skills.json`.
- `init --user` prints a one-line warning that a global install is visible to
  every project and consumes agent context; project scope remains the default
  and the recommendation.
- User-scope operations keep the operation lock, symlink-component checks,
  rollback behavior, and refusal to overwrite non-managed directories, with
  lock and backup files under `.agents/` instead of `.linxira/`.
- Tests covering user-scope init, status, `--global` alias, and uninstall.

## [0.1.2] - 2026-10-02

### Added

- `figureforge` (vendored, MIT): the original FigureForge browser SVG editor
  subtree with a first-party Chinese wrapper skill; zero-install local editing
  of figures, posters, and schematics.
- `ppt-master` (vendored, MIT): the full document-to-editable-PPTX skill
  subtree (13k files) with its integrity guard preserved unmodified; brand
  template and AGPL dependency notes recorded in the skill's `VENDORED.md`.
- `mcp-connectors` profile with `mcp-recommendations` (verified MCP landscape
  by capability area) and `open-design` (fail-closed connector for the local
  OpenDesign MCP server).
- `integrations/mcp` route branch; visuals and presentations indexes updated.
- Clean-room plotting rewrite: `scientific-figure-style` now ships an original
  `scripts/pubstyle.py` plus five runnable demos; `discipline-figure-patterns`
  deepened to a 50+ figure-type per-discipline library; new
  `ai-figure-prompting` skill for compliant AI schematic generation.

### Changed

- `research-communication-core` carries 47 first-party skills.
- The packed-artifact test accepts large payloads and both npm 11/12
  `pack --json` shapes; emulated install is skipped on npm 12/Windows.

## [0.1.1] - 2026-10-02

### Added

- Dual materialization layouts: `namespaced` (default) materializes routers as
  `.agents/skills/linxira-<root>/` so the managed tree cannot collide with
  skills from other tools; `init --layout flat` keeps the v0.1.0 unprefixed
  roots. The chosen layout is recorded in `.linxira/manifest.json` and followed
  by `status`, `update`, and `uninstall`.
- Uninstall and profile-shrinking updates prune now-empty managed ancestor
  directories instead of leaving empty husks under `.agents/skills/`.

### Fixed

- Installed-CLI tests resolve the binary under the scoped
  `node_modules/@linxiraos/linxira-skills` layout.
- The packed-artifact test accepts both npm ≤ 11 and npm 12 `pack --json`
  output shapes, installs natively on npm ≤ 11, and skips the emulated install
  on npm 12/Windows where bsdtar cannot read UTF-8 tarball names.

## [0.1.0] - 2026-10-02

### Added

- Cross-runtime `linxira-skills` CLI with safe profile lifecycle commands.
- Lean `core` and first-party `bioinformatics-core` payload profiles.
- First-party `biology-research-core` profile for biological ideation,
  literature search and collection, evidence synthesis, experimental design,
  statistical planning, governed wet-lab planning, and manuscript preparation.
- First-party `science-research-core` profile for chemistry, physics, crop and
  plant science, ecology, animal physiology, biochemistry and molecular biology,
  and medical/translational study design.
- First-party `research-communication-core` profile for manuscript structure,
  reference formatting, Chinese academic body formatting, document/LaTeX
  delivery, scientific figures, image-evidence boundaries, and academic slides.
- Profile-specific route generation with dangling-link validation.
- A bulk RNA-seq workflow from FASTQ QC through Salmon/tximport, DESeq2,
  result interpretation, ranked enrichment, and reproducibility artifacts.
- Unified generated descriptors with class, loading policy, risk tags, hashes,
  target paths, and profile membership.
- Repository and skill citation policy with machine-readable `CITATION.cff` and
  per-skill citation sections for adapted scientific workflows.

### Changed

- Held the previous `life-sciences-core` and `html-reporting-core` upstream-body
  selections out of the public payload pending correction and asset review.
- Merged scientific change verification into scientific software engineering.
- Merged remote session persistence guidance into remote-access/HPC contracts.
