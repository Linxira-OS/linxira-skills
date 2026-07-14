# Linxira Skills

Linxira Skills is a cross-runtime skill platform for research, engineering, and
execution workflows. It packages reviewed skills and profiles without limiting
the project to a single discipline, toolchain, or runtime.

The repository is both the source workspace and release boundary for the CLI,
first-party skills, reviewed third-party material, profile definitions, and
provenance records.

The first package targets OpenCode and other runtimes that use project-local
instructions under `.agents/skills/` and `AGENTS.md`.

Chinese overview: [README.zh-CN.md](README.zh-CN.md)

## Package

- npm package: `linxira-skills`
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

## Progressive Routing

Installed profiles use a three-level tree instead of exposing every leaf skill
at the root:

```text
.agents/skills/
  engineering/                 top-level router
    native-performance/        second-level index
      <exact-skill>/SKILL.md    third-level leaf
```

The generated `AGENTS.md` block lists only installed top-level routers. An agent
reads one router, follows one matching index, and then reads the exact leaf
needed for the task. Current roots are `research`, `engineering`, `systems`,
`integrations`, and `delivery`; profiles install only the roots they use.

## Content Model

The platform separates reusable capabilities from domain-specific knowledge:

- **Platform foundations:** software verification, Linux, SSH, remote compute,
  browser operations, cloud safety, AI workflows, and integrity contracts.
- **Domain profiles:** reviewed methods and terminology for fields such as life
  sciences, with additional disciplines added through the same review process.
- **Reporting profiles:** reusable document, figure, and presentation workflows.
- **Connectors:** explicit contracts for databases, cloud providers, and
  authenticated external systems.

Linux is an execution foundation shared by profiles, not a discipline package.
`life-sciences-core` is the first domain profile, not the platform boundary.

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
npm install --save-dev linxira-skills
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

- software engineering and change verification
- research integrity and reporting
- browser, cloud, and AI safety contracts
- Linux, SSH, file transfer, GPU, and HPC operations

## Repository Layout

- `skills/`: first-party skills that may be packaged directly
- `routes/`: top-level routers and second-level indexes for progressive loading
- `catalog/first-party-layout.json`: stable skill IDs mapped to three-level install paths
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
