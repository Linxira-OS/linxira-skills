# Changelog

All notable changes to this package are documented in this file.

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
