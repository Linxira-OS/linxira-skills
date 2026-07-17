# Bioinformatics Core Review

## Decision

`bioinformatics-core` is a provisional installable domain profile. It extends the
10-skill `core` profile with 10 first-party bioinformatics skills and establishes
a coherent bulk RNA-seq path from input design through reproducible delivery.

The profile does not redistribute upstream `bioSkills` bodies. Seven workflow
skills are first-party adaptations informed by MIT `bioSkills` revision
`24f0694a125e53f04a7c66a54ba9b81461b7227f`; each body records its source path
and concrete corrections.

## Included Domain Skills

| Skill | Role |
| --- | --- |
| `bio-analysis-orchestrator` | Route biological questions and data types. |
| `bioinformatics-reproducibility` | Preserve environments, provenance, validation, and artifacts. |
| `bulk-rnaseq-analysis` | Own the end-to-end workflow and completion bundle. |
| `fastq-quality-control` | Validate FASTQ inputs and gate remediation. |
| `salmon-quantification` | Quantify transcripts and require the tximport handoff. |
| `count-matrix-quality-control` | Validate samples, counts, transformations, PCA, and outliers. |
| `differential-expression-deseq2` | Fit estimable models and valid contrasts/shrinkage. |
| `differential-expression-results` | Preserve, annotate, export, and interpret complete results. |
| `gene-set-enrichment-analysis` | Run deterministic ranked enrichment with versioned gene sets. |
| `hpc-bioinformatics-operations` | Route resource-managed execution to a scheduler. |

## Corrections To Upstream Guidance

- A Salmon `quant.sf` collection must pass through a validated `tx2gene` and
  `tximport` object before gene-level DESeq2 analysis.
- A no-intercept DESeq2 design does not make arbitrary contrasts compatible
  with coefficient-only `apeglm` shrinkage.
- A gene with zero counts in one condition can still be testable; all-zero rows,
  independent filtering, outliers, and convergence failures are distinct states.
- `eps = 0` in supported fgsea APIs removes a p-value floor but does not create
  exact Monte Carlo p-values.
- Generic BAM coverage and insert-size rules are not accepted as RNA-seq QC.
- FASTQ trimming is evidence-gated and raw reads remain preserved.

## Release Validation

Current automated validation covers metadata, profile inheritance, payload
selection, route resolution, CLI lifecycle, tarball contents, and clean packed
installation. FastQC, MultiQC, Salmon, R, tximport, DESeq2, and fgsea are not
installed in this workspace, so a small public-data executable fixture remains
required before the npm release is finalized. No command is claimed as executed
until that fixture exists.

Fixture acceptance must cover a full-length library, a 3'-tag library without
length offsets, technical-run collapse, duplicate identifier mapping,
interaction/LRT routing, and deterministic enrichment output.

## Citation

If this profile or one of its adapted workflow skills is cited in a manuscript,
benchmark, or methods supplement, cite both the repository release and the exact
skill path. See [SKILL_CITATION_POLICY.md](SKILL_CITATION_POLICY.md).
