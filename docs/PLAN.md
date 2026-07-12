# Systematic Curation Plan

## Goal

Build an independently installable family of high-quality scientific Agent
Skills. The first deliverable gives an AI broad life-science capability from
question formulation through data acquisition, computation, validation,
interpretation, and reporting.

The project optimizes and validates skills; it does not merely aggregate them
and does not fine-tune a model.

## Package Boundaries

```text
Linxira Science Skills
  life-sciences
  research-web
  linux
  compute-cloud
  scientific-ai
  research-engineering
```

`life-sciences` is first. Other packages are designed now only to define clean
interfaces and prevent domain skills from absorbing generic system operations.

## Phase 0: Governance And Evidence

Deliverables:

- Source registry with repository, owner, URL, revision, license, and role.
- Third-party attribution format and modification policy.
- Research clone convention: ignored, shallow, default branch only.
- License decision table: include, adapt with notice, reference only, or reject.
- Terminology for `original`, `adapted`, `derived`, `vendored`, and `inspired`.

Exit condition: every reviewed file can be traced to an original upstream and a
license decision.

## Phase 1: Repository Discovery

Search in six tracks:

1. Bioinformatics and biomedical Agent Skills.
2. Chemistry, structural biology, and drug discovery.
3. Scientific research agents and reproducibility systems.
4. Browser automation and scientific internet access.
5. Linux, cloud, GPU, HPC, and file-transfer operations.
6. AI research, training, evaluation, and scientific software engineering.

For each repository record:

- Latest revision and release recency.
- License and nested-license behavior.
- Number and location of `SKILL.md` files.
- Tests, scripts, fixtures, CI, and executable dependencies.
- Whether content is original, aggregated, generated, or copied.
- OpenCode compatibility and portability assumptions.
- Maintenance signals and unresolved security issues.

Exit condition: candidate registry is broad enough that two consecutive search
passes add no new high-value capability area.

## Phase 2: Inventory And Normalization

Extract metadata without changing source content:

- Skill name, description, path, source revision, and license.
- Domain, task, tools, inputs, outputs, dependencies, and risks.
- Required network, account, browser, compute, privilege, or payment capability.
- Referenced scripts and whether those files exist.
- Version claims, database releases, and external URLs.

Normalize names only in the inventory. Do not rename source files during this
phase.

Exit condition: every candidate skill has a machine-readable inventory record
or a recorded parse failure.

## Phase 3: Deduplication

Use several levels:

1. Exact file hash.
2. Normalized Markdown hash with metadata and whitespace removed.
3. Same `name` and highly similar description.
4. Similar body embeddings or token shingles.
5. Human review for skills that solve the same task with different tools.

Select a canonical source based on scientific quality, provenance, maintenance,
license clarity, and executable validation. Preserve useful alternatives as
tool-specific implementations only when they add real capability.

Exit condition: each duplicate cluster has a canonical candidate and a reason.

## Phase 4: Quality Evaluation

Score each candidate from 0 to 5 in these dimensions:

| Dimension | Question |
| --- | --- |
| Trigger quality | Does the description activate for the correct task without excessive overlap? |
| Scientific correctness | Are methods, assumptions, coordinates, statistics, and interpretation defensible? |
| Executability | Are inputs, outputs, dependencies, commands, and failure behavior complete? |
| Validation | Are QC, tests, sanity checks, and completion criteria present? |
| Reproducibility | Are versions, references, environments, seeds, and provenance addressed? |
| Safety | Are destructive, privileged, paid, clinical, privacy, and account actions gated? |
| Currency | Are tools, APIs, flags, databases, and recommendations current? |
| Maintainability | Is the skill focused, structured, and free from unnecessary duplication? |
| Source confidence | Is the upstream identifiable, licensed, maintained, and technically credible? |
| Unique value | Does the skill add capability not already covered better elsewhere? |

Automatic checks may flag problems, but scientific correctness and final
selection require human review.

Exit condition: shortlisted skills have scores, reviewer notes, and a decision:
accept, adapt, merge, reference, quarantine, or reject.

## Phase 5: Life-Sciences Coverage Matrix

Build the first package across:

- Core sequence and biological file formats.
- Genomics and variant analysis.
- Transcriptomics and differential expression.
- Single-cell and spatial omics.
- Epigenomics and chromatin.
- Proteomics and metabolomics.
- Microbiome, metagenomics, and pathogen genomics.
- Population genetics, GWAS, and causal genomics.
- Structural biology and protein modeling.
- Cheminformatics, computational chemistry, and drug discovery.
- Systems biology, pathways, and regulatory networks.
- Imaging, flow cytometry, and spatial measurement.
- Biostatistics, experimental design, and clinical research.
- Literature, databases, reporting, and scientific integrity.
- Limited biophysics required by the workflows above.

Each row must define inputs, outputs, upstream/downstream relations, preferred
methods, alternatives, validation requirements, and required external package
capabilities.

Exit condition: no common life-science workflow lacks an entry point, execution
path, QC gate, and reporting path.

## Phase 6: Adaptation And Testing

Adapt selected skills into a consistent format:

- Rewrite triggers to reduce collisions.
- Add explicit inputs, outputs, assumptions, and non-goals.
- Update obsolete commands and references.
- Add scientific and operational checkpoints.
- Gate browser login, payment, publication, deletion, privilege, and protected
  data transfer.
- Add scripts only when they are tested and materially improve reliability.
- Record every material modification in the skill's provenance metadata.

Test at three levels:

1. Structural lint and link/script existence.
2. Small executable fixtures and command smoke tests.
3. End-to-end scenario evaluations with expected artifacts and failure cases.

Exit condition: accepted skills pass the package's structural and scenario
quality gates.

## Phase 7: Packaging

OpenCode is the first installation target. Packaging must support:

- Installing one package without all others.
- Installing selected domains or profiles.
- Pinning a release and verifying checksums.
- Listing source and license information locally.
- Updating without overwriting user-authored skills.
- Uninstalling cleanly.

Other compatible runtimes are adapters over the same canonical skills, not
separate edited copies.

The first delivery path is a cross-runtime npm initializer that materializes
selected skills under `.agents/skills/`, not a runtime-specific plugin. See
[`INSTALLATION_ARCHITECTURE.md`](INSTALLATION_ARCHITECTURE.md).

Exit condition: clean install, update, selective install, and uninstall tests
pass on supported platforms.

## Initial Source Priority

| Priority | Source | Intended use |
| --- | --- | --- |
| Enabled source track | `GPTomics/bioSkills` | Hierarchical MIT bioinformatics source tree with category-preserving discovery |
| Indexed source track | `BioTender-max/awesome-bio-agent-skills` | Full hierarchical source tree plus logical category index; trace original upstream before public redistribution |
| Execution reference | `Runchuan-BU/BioClaw` | Bio agent workflows, browser/database tools, containers, cluster execution |
| Integrity reference | `ai4s-research/open-science` | Domain checks, provenance, large files, remote compute, OpenCode integration |
| Science expansion | `K-Dense-AI/scientific-agent-skills` | Chemistry, medicine, databases, GPU and scientific tooling |
| AI training | `Orchestra-Research/AI-Research-SKILLs`, `NVIDIA/skills` | Training, distributed compute, GPU, MLOps, vendor-specific workflows |
| AMD compute | `amd/skills`, selected ROCm repositories | Ryzen AI, ROCm, Instinct/EPYC, profiling and quantization |
| Intel compute | `intel/intel-performance-skills`, selected XPU repositories | Linux CPU performance, XPU, SYCL, quantization and benchmarks |
| Microsoft/Azure | Playwright MCP and selected Azure repositories | Browser automation, AI infrastructure, agent evaluation and cloud execution |
| HPC reference | `yale-som-hpc/claude-code-marketplace` | Scheduler and cluster user workflows |
| Browser reference | `Tencent/BrowserSkill`, `badlogic/pi-skills` | Logged-in browser and CLI browser workflows |
| Template source track | `nexu-io/html-anything` | Apache-2.0 HTML templates, reports, and decks; external example citations remain provenance-gated |
| Engineering method | `obra/superpowers`, `multica-ai/andrej-karpathy-skills` | Development discipline and coding-agent behavior |

Priority means review order, not automatic inclusion.

## Linux Implementation Direction

Linux skills are organized by task, not duplicated by distribution. Every
applicable skill dispatches between Debian/Ubuntu and Arch/CachyOS/Linxira after
detecting `/etc/os-release`. WSL, SSH, session persistence, file transfer, GPU
hosts, remote operation, and guided GUI handoff are first-class coverage areas.
See `docs/LINUX_PACKAGE.md`.
