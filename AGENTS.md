# Linxira Skills

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

## Reading Discipline

Do not load or summarize every `SKILL.md`. Start from frontmatter, source
metadata, and the task. Read one selected skill body only when the task, tool,
or risk gate requires it. Do not execute an indexed upstream skill until its
provenance and risk state allow it.

## Runtime Compatibility

The `linxira-skills init` command materializes a selected profile as a
three-level routing tree under `.agents/skills/` and records ownership in
`.linxira/`. OpenCode and Codex discover the top-level router skills; the
generated `AGENTS.md` block directs agents from one router to one index and then
to the exact leaf skill. Both paths are generated runtime state and ignored by
Git.

`AGENTS.md` provides routing guidance. It does not itself register every skill
with a runtime. Do not manually populate `.agents/skills`; use the initializer
so updates and uninstall can preserve user-owned skills.

## Browser Runtime Boundary

`agent-browser` may exist as an OpenCode-compatible browser runtime, but the
current Web UI path does not reliably carry its interactive state and follow-up
information between turns. Do not treat it as a preferred execution path here.
Use a separate terminal, CI worker, or other approved execution environment for
browser automation validation unless the current session explicitly proves it
can support that interaction model end to end.
