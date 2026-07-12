# Linxira Science Skills

Linxira Science Skills is a planned family of independently installable Agent
Skills packages for scientific research. The first package will focus on life
sciences, including bioinformatics, biomedical research, relevant chemistry,
and limited biophysics.

This repository is in research and early authoring. It is not yet an installable
OpenCode package, and no project OpenCode configuration is enabled.

## Planned Packages

| Package | Scope |
| --- | --- |
| `life-sciences` | Biology, medicine, bioinformatics, biostatistics, relevant chemistry, and biophysics |
| `research-web` | Browser automation, Computer Use, scientific search, databases, downloads, uploads, accounts, and citations |
| `linux` | Dual-family Linux skills for Debian/Ubuntu and Arch/CachyOS/Linxira, plus WSL, SSH, remote sessions, transfers, operations, and GPU hosts |
| `compute-cloud` | SSH, file transfer, containers, GPU servers, cloud instances, HPC, Slurm, and cost control |
| `scientific-ai` | Model use, training, fine-tuning, distributed training, evaluation, and experiment tracking |
| `research-engineering` | Scientific software, workflows, testing, packaging, provenance, and reproducibility |

Packages must remain independently installable. A life-science workflow may
declare optional capabilities from `research-web`, `linux`, `compute-cloud`, or
`scientific-ai`, but it must not duplicate those skills.

## First Milestone

The first release milestone is the `life-sciences` package. `GPTomics/bioSkills`
is the initial high-quality backbone. Linux core skills are being authored now
to establish execution boundaries for later scientific workflows. Broader
collections and agent projects are used as discovery sources, not copied
wholesale.

Before packaging, the project will produce:

1. A capability coverage matrix.
2. A repository and skill source registry.
3. A repeatable quality and risk scoring rubric.
4. Duplicate and overlap reports.
5. A reviewed shortlist for the first package.

See [`docs/PLAN.md`](docs/PLAN.md) for the staged plan and
[`docs/THIRD_PARTY.md`](docs/THIRD_PARTY.md) for provenance requirements. The
Linux package design is documented in
[`docs/LINUX_PACKAGE.md`](docs/LINUX_PACKAGE.md).

## Research Workspace

Temporary shallow clones are stored under `.research-temp/`, which is ignored
by Git. Research clones should use only the latest default-branch snapshot:

```bash
git clone --depth 1 --single-branch <url> .research-temp/<name>
```

Temporary clones are evidence for review and are not part of the distributable
package.

## Upstream Material

The current local research set includes the user's forks of:

- `GPTomics/bioSkills`
- `BioTender-max/awesome-bio-agent-skills`

It also retains `nexu-io/html-anything` as an optional Apache-2.0 template
source track. Its externally cited template examples remain provenance-gated and
are not default-routed.

The second project aggregates many repositories with mixed provenance and
quality. Its entries must be traced back to their original upstream project
before reuse.

No third-party skill will be presented as original work. Adapted skills will
retain source repository, source path, source revision, license, modification
summary, and attribution.

## Installation Status

OpenCode is the priority target, followed by other Agent Skills compatible
runtimes. Installation design starts only after the first package taxonomy,
source registry, and quality gates are approved.
