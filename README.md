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
| `core` | 10 first-party software, integrity, Linux, transfer, and compute skills |
| `bioinformatics-core` | `core` plus 10 first-party bioinformatics and bulk RNA-seq workflow skills |
| `research-communication-core` | `core` plus 11 first-party manuscript, citation, formatting, figure, image, document, LaTeX, presentation, and rendered-artifact validation skills |

Reviewed connector profiles such as AlphaFold DB public access are tracked in
this repository, but are not separate packaged payloads yet.

Academic artifact generation treats Arch Linux (including Arch-derived Linxira
and CachyOS environments) and Ubuntu as primary execution targets. CI runs the
same DOCX, PPTX, XeLaTeX/BibTeX, XeLaTeX/Biber, LibreOffice, and Poppler fixture
suite against native `pacman` and `apt` toolchains.

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
`bioinformatics-core` is the first domain profile, not the platform boundary.

## Third-Party And Adaptation

Reviewed third-party material is included only when its source revision,
license, notice, and payload boundary are pinned explicitly. The current public
payload contains no third-party skill bodies.

- `bioinformatics-core` contains first-party adaptations informed by pinned MIT
  `bioSkills` paths, with provenance and concrete corrections recorded in each
  adapted skill.
- The former `life-sciences-core` and `html-reporting-core` selections remain
  review records but are not installable because their upstream bodies require
  further correction or asset validation.
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
npx linxira-skills init --profile bioinformatics-core
npx linxira-skills init --profile research-communication-core
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
- Linux, SSH, file transfer, storage/networking, and cloud-compute contracts
- bulk RNA-seq QC, Salmon/tximport, count QC, DESeq2, result interpretation,
  ranked enrichment, HPC handoff, and reproducibility
- manuscript structure, reference formatting, scientific figure/table design,
  and academic slide deck design

## Citation

If a manuscript, benchmark, workflow paper, or another skill library uses this
repository or one of its adapted scientific skills, cite the repository release
and the exact skill path. See [SKILL_CITATION_POLICY.md](docs/SKILL_CITATION_POLICY.md)
and [CITATION.cff](CITATION.cff).

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
- [SKILL_CITATION_POLICY.md](docs/SKILL_CITATION_POLICY.md)
- [SOURCES.md](docs/SOURCES.md)
- [BIOINFORMATICS_CORE_REVIEW.md](docs/BIOINFORMATICS_CORE_REVIEW.md)
- [RESEARCH_COMMUNICATION_CORE_REVIEW.md](docs/RESEARCH_COMMUNICATION_CORE_REVIEW.md)
- [ACADEMIC_DELIVERY_STANDARD.md](docs/ACADEMIC_DELIVERY_STANDARD.md)
- [SKILL_PORTFOLIO_REVIEW.md](docs/SKILL_PORTFOLIO_REVIEW.md)
- [LIFE_SCIENCES_CORE_REVIEW.md](docs/LIFE_SCIENCES_CORE_REVIEW.md)
- [HTML_ANYTHING_PROFILE_REVIEW.md](docs/HTML_ANYTHING_PROFILE_REVIEW.md)
- [ALPHAFOLD_DB_PUBLIC_PROFILE.md](docs/ALPHAFOLD_DB_PUBLIC_PROFILE.md)
- [GOOGLE_WORKSPACE_OAUTH_POLICY.md](docs/GOOGLE_WORKSPACE_OAUTH_POLICY.md)
- [GOOGLE_CLOUD_VERTEX_POLICY.md](docs/GOOGLE_CLOUD_VERTEX_POLICY.md)

## Validation

Local validation currently covers:

- first-party metadata audit
- profile materialization lifecycle tests
- profile-specific route resolution tests
- packed tarball install smoke test in a clean Git repository
- package-content inspection that rejects development and source-track paths

GitHub Actions runs the same validation on Ubuntu, Windows, and macOS, plus
container jobs for Debian 12, Fedora 42, and Arch Linux.

An additional Arch Linux WSL smoke pass was run locally before release drafting.
CachyOS user-space compatibility is represented by the Arch job. CachyOS kernel,
scheduler, DKMS, NVIDIA driver, and hardware behavior requires a dedicated host
or self-hosted runner and is not claimed by container validation.
