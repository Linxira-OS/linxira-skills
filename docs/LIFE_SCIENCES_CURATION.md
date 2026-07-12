# Life-Sciences Curation

## Scope

The repository preserves complete upstream source tracks instead of flattening
their skills into one directory. The first profile highlights common
bioinformatics analysis paths, but it does not limit which `bioSkills` folders
are available to a source-aware plugin.

The initial profile must support these routes:

1. Raw sequence data to QC, alignment-file inspection, and validated artifacts.
2. BAM/CRAM to normalized, annotated VCF/BCF for research use.
3. Bulk RNA-seq quantification, QC, differential expression, and enrichment.
4. scRNA-seq object handling, QC, clustering, and marker-based annotation.
5. Shotgun metagenomic taxonomic classification and abundance estimation.
6. Protein structure retrieval/prediction interpretation.
7. Experimental design, workflow execution, reproducibility, and reporting.

Clinical diagnosis, therapeutic recommendations, protected-data handling, and
automated publication are not part of this first profile. Such skills need
separate subject-matter, safety, and source review.

## Full-Source Availability

| Source track | Physical hierarchy | Logical classification | Default state |
| --- | --- | --- | --- |
| `bioSkills` | `sources/bioSkills/<category>/<skill>/SKILL.md` | First directory is the scientific/tool category. | Enabled source track: all 562 discovered skills are available to the plugin. |
| `awesome-bio-agent-skills` | `sources/awesome-bio-agent-skills/skills/<source_repo>/<skill>/...` | `bioskill_index_v3.csv` maps physical paths to its published scientific categories. | Indexed source track: all 1,705 discovered skills are available for browsing, but unverified third-party skills are not automatically redistributed in a release. |

The plugin should recursively discover `SKILL.md` files below the physical
roots, preserve their paths for unambiguous identity, then use the logical index
for browsing and filtering. It must not flatten skill folders or discard
supporting files.

## Source Decision

`sources/bioSkills` is the primary source for this pass:

- Original upstream: `GPTomics/bioSkills`.
- Local research fork: `BOHUYESHAN-APB/bioSkills`.
- Reviewed source revision: `24f0694a125e53f04a7c66a54ba9b81461b7227f`.
- License: MIT, copyright GPTomics.
- Current inventory: 562 `SKILL.md` files in 63 categories.

An accepted unmodified skill must retain its upstream text, source path,
revision, copyright, and MIT license notice. An adapted skill needs a per-file
modification summary before distribution. The `awesome-bio-agent-skills` fork is
a complete source track, not a direct license grant for every nested project.
Its root CC0 license covers the collection/index; per-skill original license and
source still control public redistribution and adaptation.

## Core Profile Rules

A core-profile candidate is selected for detailed review only when it:

- Starts or completes a common analysis path in the scope above.
- Has a narrow trigger and a clear input/output boundary.
- Adds a capability not already provided better by a first-party project skill.
- Uses an identifiable maintained tool or data source.
- Does not make a clinical decision, spend money, publish, delete data, or
  require uncontrolled browser/account automation by default.

Skills outside the profile remain discoverable in their full source hierarchy.
Clinical interpretation, paid or account-dependent services, and unreviewed
specialist workflows require an explicit risk state before a plugin executes
them.

## First Core Profile

All entries below are `priority-review` shortcuts for common workflows. The YAML
companion contains machine-readable paths and decisions; it is not a whitelist
for source discovery.

| Route | Candidate count | Coverage |
| --- | ---: | --- |
| Sequence, read QC, and alignments | 6 | FASTA/FASTQ parsing, sequencing QC, preprocessing, SAM/BAM/CRAM inspection and QC |
| Variants | 4 | VCF/BCF inspection, manipulation, normalization, and research annotation |
| Bulk RNA-seq | 5 | Quantification, count-matrix QC, DESeq2, results, and ranked enrichment |
| Single-cell RNA-seq | 4 | Object I/O, preprocessing, clustering, and marker annotation |
| Metagenomics | 2 | Kraken2 classification and Bracken abundance estimation |
| Structural biology | 1 | AlphaFold prediction retrieval and confidence interpretation |
| Design and reproducibility | 2 | Power analysis and Snakemake workflows |

## Existing Project Skills

The project already has draft orchestration and reproducibility skills under
`skills/`. They are complementary to the selected specialized candidates:

- `bio-analysis-orchestrator` routes a biological question to an analysis plan.
- `bioinformatics-reproducibility` defines provenance and validation contracts.
- `hpc-bioinformatics-operations` handles scheduler-aware execution.
- Linux skills handle operating-system, transfer, remote access, and GPU work.

Before release, these pre-existing project drafts need an authorship/provenance
record just like every other distributable skill.

## Release Gate

Each profile skill needs a focused review of its full body before it moves to
`accepted` for a curated release:

1. Confirm no nested license or missing referenced file.
2. Verify current tools, versions, database releases, and command behavior.
3. Check trigger overlap and input/output handoff against its route neighbors.
4. Add scientific QC, reproducibility, and safety gaps through an attributed
   adaptation when needed.
5. Run structural checks plus a small safe fixture or command smoke test where
   the dependencies are available.

The full source tracks remain in their original hierarchical locations. A future
independently installable package will record pinned source revisions, discovery
roots, category indexes, license state, and its enabled profiles rather than
duplicating the same skill tree under flattened names.
