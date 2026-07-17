---
name: differential-expression-results
description: Use when filtering, annotating, exporting, visualizing, and interpreting bulk RNA-seq differential-expression results. Preserves complete tested results, explains NA values correctly, separates statistical from biological thresholds, and prevents post-hoc or clinical overclaiming.
skill_class: guard
load_policy: conditional
risk_tags: [clinical, controlled-data]
---

# Differential Expression Results

Keep the complete tested result table as the primary artifact. A short list of
significant genes is a view, not the analysis record.

## Result Contract

Retain at least:

- stable gene identifier and original identifier
- base mean or equivalent count-support metric
- log2 fold change and standard error
- test statistic, raw p-value, and adjusted p-value
- contrast, design formula, alpha, shrinkage method, and annotation release

For an omnibus LRT, also retain the test type, full and reduced formulas,
degrees of freedom, and the name of the coefficient displayed as the LFC. The
LRT p-value tests the model comparison; that displayed coefficient is not an
omnibus effect size.

Define statistical significance and any minimum effect-size threshold separately.
Do not describe an effect-size-filtered list as though its FDR controls a new
magnitude-specific hypothesis unless that procedure was designed accordingly.

## Explain Missing Values

Classify NA values from the fitted result object rather than guessing:

- all-zero genes have no test result
- independent filtering can leave `padj` missing while retaining a raw p-value
- outlier handling or failed convergence can suppress a test

A gene that is zero in one condition and positive in another can still be
testable. Do not label it untestable solely because one group contains zeros.

## Identifier Handling

Preserve original IDs and normalize only the documented version suffix. For
Ensembl-like IDs, remove a terminal numeric version with a rule such as
`sub("\\.[0-9]+$", "", id)`; do not delete PAR or other biological suffixes.

Report unmapped, one-to-many, and duplicate mappings. Never silently keep the
first annotation row when it changes gene identity.

## Interpretation

Review effect size, uncertainty, normalized counts, sample support, and pathway
context. Separate:

- statistical evidence
- observed expression pattern
- biological hypothesis
- external validation

Bulk tissue expression does not prove cell type, mechanism, causality, diagnosis,
or treatment response. Clinical interpretation requires a separate validated
workflow and evidence standard.

## Outputs

Export the complete table, the declared filtered view, normalized-count plots for
selected genes, mapping statistics, and a machine-readable analysis metadata
record. Record every exclusion and threshold before manuscript summarization.

## Provenance

Adapted from MIT `bioSkills` revision
`24f0694a125e53f04a7c66a54ba9b81461b7227f`, path
`differential-expression/de-results`. This version corrects zero-count/NA
semantics and removes post-hoc filtering advice.

## Citation

```text
Linxira OS. Linxira Skills: differential-expression-results. Version 0.1.0.
Skill path: skills/differential-expression-results/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```

If exported results are used in a publication, also cite the underlying model
and annotation resources used to generate and interpret those results.
