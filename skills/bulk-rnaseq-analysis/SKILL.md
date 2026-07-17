---
name: bulk-rnaseq-analysis
description: Use when running or reviewing a bulk RNA-seq analysis from FASTQ quality control through transcript quantification, gene-level differential expression, ranked gene-set enrichment, and final reproducibility artifacts. Do not use for single-cell, spatial, clinical diagnosis, or de novo transcriptome assembly.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data]
---

# Bulk RNA-seq Analysis

Treat the analysis as one evidence chain. A downstream result is not valid when
sample identity, experimental design, reference provenance, or an upstream QC
decision is unresolved.

## Required Inputs

Start with:

1. A sample sheet with biological analysis-unit ID, library ID, sequencing-run
   ID, condition, replicate, FASTQ paths, layout, and all planned covariates.
2. Organism, genome and annotation release, transcriptome source, and checksum.
3. Library protocol, strandedness expectation, read length, and sequencing
   platform.
4. The biological contrast and experimental unit. Technical runs are not
   biological replicates.
5. Data-use restrictions and the approved compute/storage location.

Reject or clarify duplicated sample IDs, missing FASTQ mates, confounded design
variables, an unknown reference release, or a contrast without biological
replication before starting expensive work.

Collapse lane or run files from the same library into one quantification unit,
for example by passing all matching FASTQs to one Salmon invocation. Multiple
technical runs must not become independent DESeq2 columns. Distinct library
preparations from one biological unit require a predeclared aggregation or
blocking strategy.

## Workflow

1. **Raw-read QC**: run the `fastq-quality-control` skill on every input and
   create one cohort-level MultiQC report. Record pass, warn, or fail decisions.
2. **Remediation decision**: trim only when adapter or quality evidence supports
   it. Never deduplicate ordinary bulk RNA-seq FASTQ files.
3. **Quantification**: use `salmon-quantification` with one versioned,
   decoy-aware reference and an explicit library-type check.
4. **Gene-level handoff**: import Salmon outputs through `tximport`. Do not build
   a plain transcript-count CSV and send it directly to DESeq2.
5. **Sample QC**: use `count-matrix-quality-control` before hypothesis testing.
   Investigate outliers and metadata errors; do not remove samples automatically.
6. **Model fitting**: use `differential-expression-deseq2` with a design that
   matches the experiment and an explicitly named contrast.
7. **Result handling**: use `differential-expression-results` to preserve the
   complete table, explain NA values, annotate identifiers, and separate
   statistical thresholds from biological interpretation.
8. **Pathway analysis**: use `gene-set-enrichment-analysis` on a complete ranked
   statistic, not a significance-filtered gene list.
9. **Delivery**: produce a final methods/QC/results report under the manuscript
   integrity and bioinformatics reproducibility contracts.

## Branching Rules

- Prefer Salmon for gene-level differential expression when splice-junction,
  allele-specific, fusion, or novel-transcript evidence is not required.
- Use a genome-alignment branch only when the scientific question needs
  alignment-derived artifacts. That branch requires RNA-specific alignment QC;
  generic DNA coverage thresholds are not sufficient.
- Analyze paired or repeated measures with an appropriate subject/block term.
- Treat batch correction as part of the model where possible. Do not erase a
  fully confounded design with post-hoc correction.
- For QuantSeq and other 3'-tag protocols, do not apply transcript-length
  offsets. Import estimated counts and construct the DESeq2 object without
  `avgTxLength`; record this protocol branch explicitly.

## Completion Bundle

The workflow is complete only when it retains:

- sample sheet and design formula
- exact commands and software versions
- reference and annotation release plus checksums
- raw MultiQC report and, when reads were remediated, a post-remediation report
- Salmon logs, library-type evidence, and `quant.sf` files
- `tx2gene`, serialized `tximport` object, and sample-QC artifacts
- complete DE table, named contrast, thresholds, and shrinkage method
- ranked vector, gene-set source/version, enrichment table, and leading edges
- QC exclusions with reasons, remaining limitations, and `sessionInfo()`

## Provenance

Adapted from MIT `bioSkills` revision
`24f0694a125e53f04a7c66a54ba9b81461b7227f`, especially
`workflows/rnaseq-to-de`. This version adds the required tximport handoff, GSEA,
artifact completion contract, and corrected branching boundaries.

## Citation

When citing this workflow skill, cite the repository and exact skill path:

```text
Linxira OS. Linxira Skills: bulk-rnaseq-analysis. Version 0.1.0.
Skill path: skills/bulk-rnaseq-analysis/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```

Also cite the underlying workflow methods and software actually used, including
the relevant Salmon, tximport, DESeq2, MultiQC, and enrichment-method papers.
