# Linxira Science Skills

Linxira Science Skills is a cross-runtime skill library for scientific research.
This repository builds the first npm-deliverable package and keeps its reviewed
source tracks, payload definitions, and contract skills in one place.

The first package targets OpenCode and other runtimes that discover
project-local skills under `.agents/skills/`.

Chinese overview: [README.zh-CN.md](README.zh-CN.md)

## Package

- npm package: `@linxira-science-skills/cli`
- executable: `linxira-skills`
- install model: materialize reviewed skill profiles into a target repository

Current profile counts in the package build:

| Profile | Contents |
| --- | --- |
| `core` | 21 first-party contract, guard, workflow, and reference skills |
| `life-sciences-core` | `core` plus 4 reviewed MIT `bioSkills` entries |
| `html-reporting-core` | `core` plus 3 reviewed Apache-2.0 `html-anything` entries |

Reviewed connector profiles such as AlphaFold DB public access are tracked in
this repository, but are not separate packaged payloads yet.

## Third-Party And Adaptation

Reviewed third-party material is included only when its source revision,
license, notice, and payload boundary are pinned explicitly.

- `life-sciences-core` includes 4 reviewed MIT `bioSkills` bodies.
- `html-reporting-core` includes 3 reviewed Apache-2.0 `html-anything` bodies.
- externally cited `html-anything` templates remain source-only.
- `awesome-bio-agent-skills` remains an indexed research source, not a public
  payload.
- donor content from the previous repository is used for audit and rewrite
  requirements, not wholesale reuse.

See [THIRD_PARTY.md](docs/THIRD_PARTY.md) for provenance policy and the profile
review documents for concrete inclusion and modification boundaries.

## Install

```bash
npm install --save-dev @linxira-science-skills/cli
npx linxira-skills init
```

Profile selection:

```bash
npx linxira-skills init --profile core
npx linxira-skills init --profile life-sciences-core
npx linxira-skills init --profile html-reporting-core
```

Lifecycle commands:

```bash
npx linxira-skills status
npx linxira-skills update
npx linxira-skills uninstall
```

## What Is Included

First-party skills provide execution boundaries for:

- scientific software and change verification
- manuscript integrity and research reporting
- browser, cloud, and AI safety contracts
- Linux, SSH, file transfer, GPU, and HPC operations

## Repository Layout

- `skills/`: first-party skills that may be packaged directly
- `profiles/`: reviewed profile manifests and pinned source hashes
- `sources/`: pinned upstream source tracks for audit and selection
- `scripts/`: payload and catalog builders plus audits
- `docs/`: packaging, policy, profile-review, and provenance documents

## Key Docs

- [INSTALLATION_ARCHITECTURE.md](docs/INSTALLATION_ARCHITECTURE.md)
- [SKILL_LOADING_POLICY.md](docs/SKILL_LOADING_POLICY.md)
- [THIRD_PARTY.md](docs/THIRD_PARTY.md)
- [SOURCES.md](docs/SOURCES.md)
- [LIFE_SCIENCES_CORE_REVIEW.md](docs/LIFE_SCIENCES_CORE_REVIEW.md)
- [HTML_ANYTHING_PROFILE_REVIEW.md](docs/HTML_ANYTHING_PROFILE_REVIEW.md)
- [ALPHAFOLD_DB_PUBLIC_PROFILE.md](docs/ALPHAFOLD_DB_PUBLIC_PROFILE.md)
- [GOOGLE_WORKSPACE_OAUTH_POLICY.md](docs/GOOGLE_WORKSPACE_OAUTH_POLICY.md)
- [GOOGLE_CLOUD_VERTEX_POLICY.md](docs/GOOGLE_CLOUD_VERTEX_POLICY.md)

## Validation

Local validation currently covers:

- first-party metadata audit
- profile materialization lifecycle tests
- packed tarball install smoke test in a clean Git repository
- package-content inspection with `npm pack --dry-run`

GitHub Actions runs the same validation matrix on Ubuntu, Windows, and macOS.

An additional Arch Linux WSL smoke pass was run locally before release drafting.
