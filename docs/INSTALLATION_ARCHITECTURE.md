# Installation Architecture

> Status: local implementation and cross-platform validation exist. The package
> has not been published to npm.

## Decision

The primary delivery mechanism is an npm CLI initializer, not an OpenCode-only
runtime plugin. It materializes a selected skill profile into a project's
`.agents/skills/` directory as a progressive three-level routing tree.
The command also maintains a small marked section in the target repository's
`AGENTS.md` so any compatible agent understands the library's scope and
progressive-loading rules.

OpenCode is the first supported runtime. OpenCode and Codex discover the
top-level router skills. The generated `AGENTS.md` block directs compatible
agents from one router to one second-level index and then to one exact leaf.
A project can therefore use the same installed profile without a second
runtime-specific plugin or a flat root containing every leaf skill.

## What Is And Is Not Installed

The repository retains complete upstream source tracks for research, review,
and local private use. A public npm package cannot blindly contain every source
tree:

| Material | Public npm payload | Reason |
| --- | --- | --- |
| Profile-selected first-party `skills/` | Yes | Project-owned, audited, and explicitly selected by an approved profile. |
| Approved MIT `bioSkills` subset | Later, after profile review | The source is MIT, but release profiles still need scientific and execution review. |
| `awesome-bio-agent-skills` bodies | No | Its root index is CC0 but nested source licenses differ. |
| `html-anything` bodies | Not by default | The root is Apache-2.0, but 22 templates cite external examples or inspiration. |
| Proprietary/vendor reference material | No | It is reference-only or has incompatible terms. |

The target first npm release ships 24 first-party skills across `core`,
`bioinformatics-core`, and `research-communication-core`, plus a compact
generated descriptor catalog. Seven bulk RNA-seq skills are adapted from
reviewed ideas in a pinned MIT `bioSkills` revision and record their source
paths and corrections in-body. No upstream skill body or full research archive
is published merely because it exists in a development clone.

## Package Shape

The initial distribution is one package, provisionally named
`linxira-skills`, with the executable `linxira-skills`. Splitting
the CLI and resource packs is deferred until the approved resource payload makes
the single package impractical.

```text
linxira-skills
  dist/                 CLI implementation
  payload/
    skills/             Redistributable skill directories only
    routes/             Top-level routers and second-level indexes
    catalog.json        Compact descriptors and source revisions
    profiles.json       Named materialization profiles
  templates/
    AGENTS.md.fragment
  THIRD_PARTY_NOTICES.md
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
      engineering/
        SKILL.md
        software/
          INDEX.md
          scientific-software-engineering/
            SKILL.md
      systems/
        SKILL.md
        linux/
          INDEX.md
          linux-foundations/
            SKILL.md
  .linxira/
    manifest.json
```

The initializer adds these exact ignore entries if absent:

```gitignore
.agents/skills/
.linxira/
```

`.agents/skills/` contains copied router files, indexes, and leaf skill
directories. Copying is more reliable than symlinks on Windows and keeps the
runtime independent of an npm cache eviction.

`.linxira/manifest.json` schema v2 records the installer version, selected
profile, source payload version, and each managed entry's stable ID, relative
path, kind, and hash. It is local state, not a team lockfile.

## AGENTS.md Marker Block

The CLI must upsert, rather than append repeatedly, this bounded block:

```markdown
<!-- linxira-skills:start -->
## Linxira Skills

Project-local Linxira content is materialized as a progressive routing tree
under `.agents/skills/`. Read only one matching top-level router first:

- Route software and performance work through `.agents/skills/engineering/SKILL.md`.
- Route Linux and compute work through `.agents/skills/systems/SKILL.md`.

Follow that router to one second-level index, then load only the exact leaf skill
required by the task.
<!-- linxira-skills:end -->
```

If `AGENTS.md` does not exist, initialization creates it with the block. If it
exists, all text outside the markers is preserved byte-for-byte. The command
fails instead of guessing when marker pairs are malformed or duplicated.

The route list is generated from the selected profile, so unused roots are not
advertised. Top-level `SKILL.md` files remain discoverable router skills; nested
indexes and leaves are reached through their explicit repository paths.

## CLI Contract

```text
npm install --save-dev linxira-skills
npx linxira-skills init [--profile core] [--dry-run]
npx linxira-skills status
npx linxira-skills update [--dry-run]
npx linxira-skills uninstall [--dry-run]
```

`core` is the default profile and contains 10 explicitly selected first-party
skills. `bioinformatics-core` adds 10 first-party domain skills, including a
bulk RNA-seq analysis path. `research-communication-core` adds 11 first-party
skills for manuscript structure, citation formatting, Chinese academic body
formatting, DOCX/LaTeX delivery, scientific figures/tables, image-evidence
boundaries, academic presentation generation, and rendered-artifact validation.
Other profiles remain non-installable until
every included body passes license, provenance, quality, and risk review.

Command behavior is intentionally conservative:

| Command | Required behavior |
| --- | --- |
| `init` | Locate the target Git root, validate the profile, write generated state, upsert the marker block, and never overwrite a non-managed skill directory. |
| `status` | Compare the manifest, installed payload, managed files and directories, and local modifications without changing files. |
| `update` | Update only manifest-owned, unmodified entries. Report divergent user edits and require `--force` before replacing them. |
| `uninstall` | Remove only unchanged manifest-owned entries, remove the marker block, and preserve unrelated `.agents` content. |

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
npm update linxira-skills
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

The repository root now contains the provisional `linxira-skills` package. It
has no runtime dependencies and uses Node's built-in modules for profile
materialization, manifest hashing, marker updates, and conflict checks.
`scripts/build-payload.mjs` discovers approved profile manifests, resolves their
base profiles, selects only referenced first-party skills, generates compact
descriptors, maps every leaf to a three-level target path, and renders separate
router/index files for each profile. The build fails when a leaf is not
advertised or a generated route points to an absent target.

The local Node 20/22/24 fixture suite verifies `init`, `status`, `update`,
`uninstall`, dry runs, progressive route generation, preserved `AGENTS.md` text,
modified-entry protection, and non-managed path protection. The packed-artifact
test verifies that the tarball contains only release material and excludes
source tracks, profiles, scripts, tests, and workspace skill sources.
`.github/workflows/cli-validation.yml` runs the same
fixture suite and package check on Windows, macOS, Ubuntu, Debian 12, Fedora 42,
and Arch Linux before a release is marked complete. The full academic artifact
suite runs independently on Ubuntu (`apt`) and Arch Linux (`pacman`) with native
Pandoc, LibreOffice, Poppler, XeLaTeX, BibTeX, and Biber packages. The
distribution containers validate user-space installation, path, process, and
packaging behavior. Kernel,
DKMS, NVIDIA driver, scheduler, and hardware claims require a dedicated host;
CachyOS is therefore not treated as fully validated by an Arch container alone.
