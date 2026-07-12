# Skill Routing And Conflict Resolution

## Problem

The source tracks intentionally preserve 2,000+ skill directories. A plugin
cannot load all bodies into context or treat a YAML `name` as a globally unique
identifier. The same task may appear in multiple sources, sometimes as an exact
copy and sometimes as divergent text under the same name.

The current overlap audit found:

- 507 shared names between the standalone `bioSkills` track and the aggregate
  track's `bioskills` subtree.
- 90 cross-track pairs are exact `SKILL.md` matches.
- 429 cross-track pairs have the same declared name but different text, usually because the
  aggregate snapshot and the standalone upstream evolved independently.
- Open Science Desktop's seven first-party core skill names do not collide with
  the currently audited project or life-sciences source tracks.

Some declared names occur more than once within a track, so the exact and
different body-pair counts are not subtractive from the shared-name count.

## Stable Identity

Every discovered skill needs an identity independent of its declared YAML name:

```text
<track-id>:<path-relative-to-track-root>
```

Examples:

```text
bioskills:variant-calling/vcf-basics
aggregate:openclaw/variant-calling
open-science-core:domain-check
nature-skills:scientific-figure-design
```

The plugin stores this identity with declared name, source revision, raw body
hash, license state, physical category, logical categories, risk tags, and
availability state. Folder paths and supporting files remain intact.

## Track Roles And Precedence

| Rank | Track or layer | Role | Default behavior |
| ---: | --- | --- | --- |
| 1 | Project first-party skills | Local orchestration and operating contracts | Prefer when the trigger is exact and provenance is confirmed. |
| 2 | Open Science core | Cross-cutting integrity and reproducibility guards | Attach as checks; do not use as a competing domain-analysis result. |
| 3 | Nature Skills | Manuscript, figure, revision, and editorial workflows | Optional Apache-2.0 extension at `Yuan1z0825/nature-skills@74a322725ff2d36984762ca146f7e28cbb49e32d`; activate for paper/figure work after source review and pair with Open Science guard skills. |
| 4 | Standalone `bioSkills` | Canonical broad bioinformatics source | Default domain source for life-sciences tasks. |
| 5 | Aggregate non-`bioskills` sources | Specialist supplementary sources | Index for discovery; require provenance/risk policy before automatic execution. |
| 6 | Aggregate `bioskills` subtree | Historical/alternate snapshot of `bioSkills` | Shadow whenever standalone `bioSkills` exposes the same declared name. |

The numeric rank resolves a same-name conflict only. It is not a scientific
quality score and does not replace explicit user selection.

## Resolution Algorithm

1. Enumerate `SKILL.md` recursively under each declared source root.
2. Create a descriptor using the stable identity and retain its complete skill
   directory path.
3. Group descriptors by raw SHA-256 of `SKILL.md`.
   Exact copies become one canonical descriptor with aliases, preserving all
   original source paths for attribution.
4. Group remaining descriptors by declared name.
   When names collide but bodies differ, expose the highest-precedence canonical
   descriptor and mark lower-precedence entries `shadowed-by:<identity>`.
5. Do not automatically merge semantically similar skills with different names.
   Show alternatives only after task/category filtering or an explicit user
   request; false semantic merges are unsafe for scientific methods.
6. Apply risk gates before execution, regardless of precedence: clinical,
   controlled-data, account-bound, paid, destructive, remote-compute, and
   privileged actions all require their respective approval flows.

An explicit stable identity always overrides default routing. A user can choose
an alternate source after seeing its provenance, revision, risk state, and why it
was shadowed.

## Open Science And Nature Workflows

These two sources solve different layers of research work:

| Stage | Preferred capability |
| --- | --- |
| Before reading large scientific inputs | Open Science `large-file` |
| Before and after analysis code | Open Science `domain-check`; `stats-integrity` when relevant |
| Domain analysis | Project orchestration plus canonical `bioSkills` or an explicitly selected specialist source |
| Manuscript structure, prose, and journal-oriented figure design | Nature Skills |
| Producing reproducible plotting code | Open Science `publication-figures` plus the selected domain visualization skill |
| Auditing citations, numbers, and figure/code linkage | Open Science `traceability-review` |

Nature Skills should not be allowed to substitute editorial polish for
traceability, current citations, reproducible methods, or evidence checks.
Open Science's figure style guard should not suppress a journal-specific figure
design workflow; it supplies the baseline reproducibility and rendering contract.

Nature Skills currently exposes 17 `nature-*` skills with no declared-name
collision against the audited tracks. It is a complete-directory extension:
`nature-figure`, for example, requires its local `references/`, `static/`,
`scripts/`, `manifest.yaml`, assets, and the repository-level `skills/_shared/`
directory. The plugin must install or mount that complete tree, not only its
`SKILL.md` files.

For a Nature-oriented manuscript workflow, run `nature-writing`,
`nature-figure`, and `nature-statistics` for structured drafting and figure
production; then run `publication-figures` for the reproducible plotting baseline
where applicable and finish with `traceability-review`. Citation search and
reference-verification output remain drafts until source identifiers are checked
against the final manuscript.

## External Packs

Open Science Desktop fetches `ai4s-skills` and Anthropic office/document skills
at build time. They are external dependencies, not part of its seven committed
core skills. The plugin records them as separate pinned tracks only after their
own revision and license records are available.

Anthropic's currently reviewed `docx`, `pdf`, `pptx`, and `xlsx` directories
declare proprietary terms in both frontmatter and local license files. They are
not discovery sources: their license prohibits outside-service retention,
copying, derivative works, and distribution. The plugin must not clone, mirror,
body-index, package, or auto-install them.

## Installation And Context Loading

The prior plugin established three useful operational patterns: resolve resource
paths from the installed package root, keep complete skill directories intact,
and cache category selection per session. It must not be copied unchanged:
its category loader recursively collected every `SKILL.md` body and treated the
declared YAML `name` as the practical key.

This project's plugin instead indexes descriptors eagerly and reads bodies
lazily. A descriptor contains the stable identity, declared name, path, revision,
license state, body hash, physical grouping, and logical categories. Category
selection returns descriptors; routing selects one canonical descriptor; only
then does the plugin mount or read its complete skill directory. Session caches
store selected identities and source revisions, not unbounded category bodies.
First-party model profiles and loading-policy semantics are defined in
[`SKILL_LOADING_POLICY.md`](SKILL_LOADING_POLICY.md).

## Office And Document Routing

Document skills must route by execution environment before file type:

| Task environment | Eligible source role | Routing rule |
| --- | --- | --- |
| Local `.docx`, `.pptx`, `.pdf`, or spreadsheet files | Future reviewed file-workflow track | Select only skills with compatible redistribution terms and declared local dependencies. |
| WPS WebOffice document already open in a provider runtime | Provider-bound integration | Activate a WPS JSAPI skill only when the host exposes its named tools and injected API contract; never route a local file task to it by keyword alone. |
| HTML pages, reports, decks, or visual templates | Optional `html-anything` template track | Mount the Apache-2.0 source tree at its pinned revision and choose a narrow template skill by indexed category. Keep its 22 externally cited skills behind provenance review. |
| Google, SharePoint, or other remote office systems | Provider plugin integration | Require the corresponding account, connector, scopes, and disclosure gates; do not treat an API skill as a generic document-file skill. |

The WPS archive and prior plugin copies remain evidence for provider adapters and
workflow design only. They do not gain precedence over a reviewed upstream
source merely because they are locally available.
