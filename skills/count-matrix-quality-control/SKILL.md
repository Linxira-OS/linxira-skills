---
name: count-matrix-quality-control
description: Use when checking bulk RNA-seq gene-count and tximport objects before differential expression, including sample order, library size, detection, transformation, PCA, sample distances, batch structure, and outlier investigation. Do not automatically remove samples from unsupervised plots alone.
skill_class: guard
load_policy: conditional
risk_tags: [controlled-data]
---

# Count Matrix Quality Control

Run sample-level QC before hypothesis testing. The goal is to detect identity,
metadata, library, reference, or design problems without selecting samples based
on whether they support the desired result.

## Input Contract

Require the serialized `tximport` object or raw integer gene counts, plus sample
metadata whose row names exactly match matrix columns.

Check:

- unique gene and sample identifiers
- identical sample sets and ordering across all objects
- finite nonnegative values and expected count semantics
- condition, batch, subject, and other design fields with no silent missingness
- the same annotation release used during quantification

Never round TPM values and call them raw counts. Use the tximport-aware DESeq2
constructor for full-length Salmon-derived inputs. For QuantSeq or another
3'-tag protocol, construct the DDS from imported estimated gene counts without
`avgTxLength` offsets and preserve the protocol decision in the QC record.

## Filtering

Define a low-count rule before examining differential-expression results. Tie
the number of required samples to the smallest biological group or the model's
replication structure rather than using an unexplained constant.

Filtering removes uninformative rows for modeling efficiency; it does not repair
a low-depth or failed sample. Keep the pre-filter matrix and report the retained
gene count.

## Sample Diagnostics

Calculate and review:

- library size and detected genes
- zero fraction and expression distribution
- variance-stabilized sample distances
- PCA colored by condition, batch, and other planned covariates
- replicate correlations and unexpected clustering
- Cook's distance or model diagnostics after a preliminary fit where relevant

Use VST or rlog only for visualization and distance calculations, never as the
count input to DESeq2. Record whether transformation is blind to the design; use
`blind = FALSE` when strong design effects would distort dispersion estimation
for downstream visualization.

## Outlier Decisions

An unusual PCA location is an investigation trigger, not an exclusion rule.
Check sample identity, FASTQ QC, mapping/quantification logs, library size,
protocol, batch, contamination, and metadata. Exclude only with a documented
technical or identity failure that was defined independently of the tested
biological result.

## Outputs

Retain:

- validated metadata in model order
- filtering rule and retained-gene mask
- library-size and detection table
- PCA coordinates, sample-distance matrix, and plots
- outlier investigation record
- final inclusion/exclusion decision with reason

## Provenance

Adapted from MIT `bioSkills` revision
`24f0694a125e53f04a7c66a54ba9b81461b7227f`, path
`rna-quantification/count-matrix-qc`. This version separates tximport and integer
count contracts and removes automatic or plot-only sample exclusion.

## Citation

```text
Linxira OS. Linxira Skills: count-matrix-quality-control. Version 0.1.0.
Skill path: skills/count-matrix-quality-control/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```

Also cite the transformation, ordination, and downstream statistical framework
used in the actual analysis, especially if DESeq2-derived transformations are
reported.
