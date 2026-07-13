# Installation Architecture

> Status: local implementation exists. The package has not been published and
> its release test matrix still needs Linux and macOS verification.

## Decision

The primary delivery mechanism is an npm CLI initializer, not an OpenCode-only
runtime plugin. It materializes a selected skill profile into a project's
`.agents/skills/` directory, which both OpenCode and Codex discover natively.
The command also maintains a small marked section in the target repository's
`AGENTS.md` so any compatible agent understands the library's scope and
progressive-loading rules.

OpenCode is the first supported runtime. Its current skill discovery includes
project-local `.agents/skills/<name>/SKILL.md`; Codex also scans that compatible
location. A project can therefore use the same installed profile without a
second runtime-specific plugin.

## What Is And Is Not Installed

The repository retains complete upstream source tracks for research, review,
and local private use. A public npm package cannot blindly contain every source
tree:

| Material | Public npm payload | Reason |
| --- | --- | --- |
| First-party `skills/` | Yes | Project-owned and audited by this repository. |
| Approved MIT `bioSkills` subset | Later, after profile review | The source is MIT, but release profiles still need scientific and execution review. |
| `awesome-bio-agent-skills` bodies | No | Its root index is CC0 but nested source licenses differ. |
| `html-anything` bodies | Not by default | The root is Apache-2.0, but 22 templates cite external examples or inspiration. |
| Proprietary/vendor reference material | No | It is reference-only or has incompatible terms. |

The target first npm release ships the 20 metadata-audited first-party skills,
four hash-pinned MIT entries from `life-sciences-core`, three hash-pinned
Apache-2.0 entries from `html-reporting-core`, their required notices, and a
compact catalog of permitted metadata. It does not publish the full research
archive merely because that archive exists in a development clone.

## Package Shape

The initial distribution is one package, provisionally named
`@linxira-science-skills/cli`, with the executable `linxira-skills`. Splitting
the CLI and resource packs is deferred until the approved resource payload makes
the single package impractical.

```text
@linxira-science-skills/cli
  dist/                 CLI implementation
  payload/
    skills/             Redistributable skill directories only
    catalog.json        Compact descriptors and source revisions
    profiles.json       Named materialization profiles
  templates/
    AGENTS.md.fragment
  LICENSE
  README.md
```

`package.json` must publish only `dist/`, `payload/`, `templates/`, and release
documents through its `files` field. It must not publish `.git`, research
clones, source-track histories, unapproved third-party bodies, credentials, or
workspace-specific paths.

The CLI resolves payload paths relative to its installed module URL. It never
assumes the npm cache path, the caller's home directory, or this repository's
development location.

## Target Repository State

Running initialization from a target Git repository creates only generated,
ignored runtime state:

```text
target-repository/
  AGENTS.md                 Existing file, updated through a marker block
  .agents/
    skills/
      <selected-skill>/SKILL.md
  .linxira/
    manifest.json
```

The initializer adds these exact ignore entries if absent:

```gitignore
.agents/skills/
.linxira/
```

`.agents/skills/` contains copied skill directories by default. Copying is more
reliable than symlinks on Windows and keeps the runtime independent of an npm
cache eviction. A future `--link` option may be offered only as an explicit
local-development optimization.

`.linxira/manifest.json` records the installer version, selected profile, source
payload version, managed directories, and file hashes. It is local state, not a
team lockfile. A tracked lockfile can be added later only when teams need
reproducible shared project profiles.

## AGENTS.md Marker Block

The CLI must upsert, rather than append repeatedly, this bounded block:

```markdown
<!-- linxira-skills:start -->
## Linxira Skills

Project-local skills are materialized under `.agents/skills/`. Use the runtime
skill tool to load a matching skill on demand. Do not load every skill body;
follow the selected skill's risk and completion requirements before action.
<!-- linxira-skills:end -->
```

If `AGENTS.md` does not exist, initialization creates it with the block. If it
exists, all text outside the markers is preserved byte-for-byte. The command
fails instead of guessing when marker pairs are malformed or duplicated.

`AGENTS.md` guides agents but is not a native skill registry by itself. The
physical `.agents/skills/` directory is what makes the profile discoverable to
OpenCode and Codex.

## CLI Contract

```text
npm install --save-dev @linxira-science-skills/cli
npx linxira-skills init [--profile core] [--dry-run]
npx linxira-skills status
npx linxira-skills update [--dry-run]
npx linxira-skills uninstall [--dry-run]
```

`core` is the initial default profile and contains only the metadata-audited
first-party skills. Future profiles may include `linux`, `life-sciences-core`,
`research-engineering`, or `templates`, but a profile is publishable only after
every included body passes license, provenance, quality, and risk review.

Command behavior is intentionally conservative:

| Command | Required behavior |
| --- | --- |
| `init` | Locate the target Git root, validate the profile, write generated state, upsert the marker block, and never overwrite a non-managed skill directory. |
| `status` | Compare the manifest, installed payload, managed directories, and local modifications without changing files. |
| `update` | Update only manifest-owned, unmodified directories. Report divergent user edits and require `--force` before replacing them. |
| `uninstall` | Remove only unchanged manifest-owned directories, remove the marker block, and preserve unrelated `.agents` content. |

All mutating commands support `--dry-run`. None run `git add`, modify source
submodules, fetch an upstream repository, request credentials, or send data to a
remote service.

## Token And Model Behavior

Materialization does not mean permanent prompt injection. OpenCode and Codex
receive skill names and descriptions, then read a selected `SKILL.md` body on
demand. The installed `AGENTS.md` block reinforces this rule.

The profile uses the first-party `load_policy` metadata:

- `on-demand` skills are loaded only through explicit request or selection.
- `conditional` skills are loaded after an exact task, environment, or artifact
  match.
- `required` skills are read before a matched external-state, privileged,
  destructive, controlled-data, remote-compute, or completion-claim action.

This lets capable models avoid generic reference text while keeping the same
mandatory contracts for smaller models and risky operations. See
[`SKILL_LOADING_POLICY.md`](SKILL_LOADING_POLICY.md) for the complete rules.

## Upstream To Release Workflow

The client package never pulls moving upstream branches. A maintainer performs
the following release pipeline:

1. Run `scripts/sync-source-tracks.ps1` and inspect the report.
2. Apply only reviewed fast-forwards and record every new source revision.
3. Run provenance, license, overlap, frontmatter, and profile audits.
4. Build `payload/catalog.json` from approved source descriptors only.
5. Assemble the payload from permitted files and preserve required notices.
6. Run clean-directory `init`, `status`, `update`, and `uninstall` tests on
   Windows, Linux, and macOS.
7. Run `npm pack --dry-run`, inspect the package file list and size, then bump
   the npm version and publish.

Users update only from a published package version:

```text
npm update @linxira-science-skills/cli
npx linxira-skills update
```

This separates upstream change detection from user-machine mutation and makes
every installed payload traceable to a repository commit and npm version.

## Previous Repository Migration

The previous `extendai-lab-v1` repository is a donor and reference, not a target
for modification. Its directly exposed `src/skills/` collection contains useful
engineering, browser, planning, document, and review candidates. Each candidate
must be copied only after a migration record identifies its original source,
license, revision, runtime dependencies, and overlap with this repository.

Do not migrate its `ThirdParty/`, `resources/academicSkills/`, or browser/tool
wrappers wholesale. Those trees have independent provenance, licensing, runtime,
or credential constraints. A migrated skill becomes a first-party payload entry
only after its audit record permits redistribution and its dependencies have a
cross-runtime replacement or an explicit compatibility declaration.

## Implementation Order

1. Create the CLI package skeleton, payload manifest schema, and marker-block
   updater without importing any large source track.
2. Implement `init`, `status`, and `uninstall` with fixture repositories and
   Windows-safe copy semantics.
3. Add `update`, hash conflict handling, and package-content verification.
4. Migrate a small reviewed engineering skill batch from the previous repository.
5. Add approved life-science profiles only after their release gates pass.

The first implementation target is the initializer contract, not browser,
Google, AlphaFold, cloud, or other service connectors. Those remain separate
capabilities and must not be smuggled into a generic installer.

## Current Implementation

The repository root now contains the provisional
`@linxira-science-skills/cli` package. It has no runtime dependencies and
uses Node's built-in modules for profile materialization, manifest hashing,
marker updates, and conflict checks. `scripts/build-payload.mjs` generates the
ignored `payload/` directory from 20 audited first-party skills plus the seven
hash-pinned third-party entries in `life-sciences-core` and
`html-reporting-core` before tests and packing.

The local Node 24 fixture suite verifies `init`, `status`, `update`,
`uninstall`, dry runs, preserved `AGENTS.md` text, modified-skill protection,
and non-managed directory protection. `npm pack --dry-run` verifies that the
tarball contains only the CLI, generated first-party payload, template,
README, and license. `.github/workflows/cli-validation.yml` runs the same
fixture suite and package check on Windows, Linux, and macOS before a release
is marked complete.
