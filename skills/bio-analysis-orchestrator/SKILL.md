---
name: bio-analysis-orchestrator
description: Use when planning, selecting, connecting, or troubleshooting bioinformatics and biomedical analyses across sequencing, omics, genetics, structural biology, systems biology, imaging, clinical data, or public databases. Routes a scientific question to suitable methods, tools, checkpoints, and specialized skills.
---

# Bioinformatics Analysis Orchestrator

Translate the biological question into a reproducible analysis plan before
choosing software. Search the local upstream archives for a specialized skill
after defining the data type and intended inference.

## Intake

Establish these facts:

1. Biological question, organism, tissue, condition, and comparison.
2. Assay and platform, library design, read layout, and expected chemistry.
3. Input formats, sample count, replicates, controls, batches, and metadata.
4. Reference genome or database build, annotation release, and identifier type.
5. Required outputs, statistical claims, reporting standard, and compute limits.
6. Human-subject, clinical, privacy, biosafety, or data-use restrictions.

Do not infer missing design variables from filenames when they affect the
statistical model. Ask for them or mark assumptions explicitly.

## Route By Data Type

| Data or question | Typical route |
| --- | --- |
| FASTQ QC and mapping | read QC, trimming only when justified, alignment or pseudoalignment, MultiQC |
| Bulk RNA-seq | quantification, sample QC, design matrix, DESeq2/edgeR/limma-voom, pathway analysis |
| scRNA-seq | ambient RNA and doublets, QC, normalization, integration, clustering, annotation, differential tests |
| scATAC or multiome | fragment QC, peak matrix, dimensional reduction, integration, motifs, peak-gene links |
| WGS/WES/panels | alignment, duplicate handling, calibration as appropriate, calling, normalization, annotation, filtering |
| Long reads | basecalling, read QC, minimap2, assembly or variant/SV calling, polishing, methylation as required |
| ChIP/CUT&RUN/ATAC | alignment QC, duplicates, controls, peak calling, consensus peaks, differential binding, motifs |
| Methylation | chemistry-aware alignment/calling, conversion QC, CpG filtering, DMR modeling |
| Metagenomics/microbiome | host depletion, taxonomic or amplicon workflow, compositional statistics, contamination review |
| Proteomics/metabolomics | feature identification, missingness and QC, normalization, differential abundance, annotation |
| GWAS/population genetics | sample/variant QC, ancestry, relatedness, association model, fine mapping, replication |
| Structural biology/drug design | sequence/structure QC, prediction or retrieval, confidence, docking/design, orthogonal validation |
| Clinical/biostatistics | estimand, cohort definition, missingness, multiplicity, model diagnostics, reporting |
| Imaging/spatial | image QC, segmentation, feature extraction, registration, spatial statistics, validation |

## Search Local Skills

Use fast filename and content search instead of loading all archived skills:

```bash
rg --files sources -g 'SKILL.md' | rg 'single-cell|variant|proteomics'
rg -l -i 'specific tool|assay|database' sources -g 'SKILL.md'
```

Prefer `sources/bioSkills` for coherent core workflows. Use
`sources/awesome-bio-agent-skills` for specialized databases, medical topics,
protein design, niche assays, and additional implementations. Check provenance
and license before adapting archived material.

## Analysis Contract

Every plan should state:

- Inputs and immutable raw-data location.
- Sample sheet schema and reference versions.
- Per-step tool, version, parameters, resources, and expected outputs.
- QC checkpoint with a decision, not merely a plotted metric.
- Statistical model, contrasts, covariates, and multiple-testing method.
- Validation strategy, sensitivity analyses, and known confounders.
- Final artifacts: tables, figures, logs, environment, checksums, and report.

## Scientific Guardrails

- Preserve raw data and never silently overwrite primary results.
- Distinguish exploratory analysis from confirmatory inference.
- Use biological replicates as the unit of inference; avoid pseudoreplication.
- Record genome builds and normalize identifiers before joins.
- Use an appropriate background universe for enrichment analysis.
- Inspect effect sizes and uncertainty, not only adjusted p-values.
- Validate critical findings with an independent method or dataset where possible.
- Treat clinical interpretation as decision support requiring qualified review.

## Completion Criteria

An analysis is complete only when outputs are nonempty and parseable, sample
counts reconcile across steps, QC decisions are documented, key plots have been
inspected, results can be regenerated from commands or a workflow, and the
report states assumptions and limitations.
