# Linxira Science Skills

This repository is the source and release workspace for a cross-runtime skill
library. It is not itself a flattened runtime installation.

## Skill Layout

- `skills/` contains first-party, directly materializable skills.
- `sources/` contains pinned upstream submodules. Preserve their hierarchy and
  do not edit their files for local policy changes.
- `docs/SKILL_LOADING_POLICY.md` defines token-aware loading and required action
  gates.
- `docs/INSTALLATION_ARCHITECTURE.md` defines the npm CLI initializer and
  release boundary.
- `docs/WORK_QUEUE.md` is the persistent cross-session task ledger. Update it
  before ending substantial work.

## Reading Discipline

Do not load or summarize every `SKILL.md`. Start from frontmatter, source
metadata, and the task. Read one selected skill body only when the task, tool,
or risk gate requires it. Do not execute an indexed upstream skill until its
provenance and risk state allow it.

## Runtime Compatibility

OpenCode and Codex discover project-local skills under
`.agents/skills/<name>/SKILL.md`. The future `linxira-skills init` command will
materialize a selected profile there and record ownership in `.linxira/`.
Both paths are generated runtime state and ignored by Git.

`AGENTS.md` provides routing guidance. It does not itself register every skill
with a runtime. Do not manually populate `.agents/skills`; use the initializer
so updates and uninstall can preserve user-owned skills.
