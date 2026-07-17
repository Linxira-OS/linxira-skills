---
name: differential-expression-deseq2
description: Use when fitting a bulk RNA-seq differential-expression model with DESeq2 from raw integer counts or a tximport object. Requires a defensible design, explicit reference levels and contrasts, replication, model diagnostics, and a shrinkage method compatible with the requested coefficient.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data]
---

# Differential Expression With DESeq2

Define the estimand before fitting. A model cannot recover a condition effect
that is fully confounded with batch, subject, processing date, or another design
variable.

## Design Gate

Confirm:

- the experimental unit and biological replicates
- the primary contrast and reference level
- paired/repeated measures and blocking variables
- batch variables known before outcome inspection
- sufficient residual degrees of freedom
- no duplicated samples or technical runs counted as biological replication

Use a design such as `~ batch + condition` only when those terms are estimable.
For paired data, include the subject term. Use interactions only when the
scientific question is an interaction.

## Construction And Fit

For Salmon outputs, preserve the tximport offset information:

```r
library(DESeq2)

coldata$condition <- relevel(factor(coldata$condition), ref = "control")
dds <- DESeqDataSetFromTximport(
  txi,
  colData = coldata,
  design = ~ batch + condition
)
dds <- DESeq(dds)
resultsNames(dds)
```

This constructor is for full-length RNA-seq. For QuantSeq or another 3'-tag
protocol, preserve the original tximport object and construct the DDS from
`round(txi$counts)` without `avgTxLength`; do not silently apply the full-length
offset path.

For a simple named comparison:

```r
res <- results(
  dds,
  contrast = c("condition", "treated", "control"),
  alpha = 0.05
)
```

Use `apeglm` only with a named coefficient present in `resultsNames(dds)`. If
the desired pairwise comparison is not a coefficient, relevel and refit so it is
one, or use a shrinkage method that supports the explicit contrast, such as
`ashr`. A no-intercept design does not automatically make arbitrary contrasts
compatible with coefficient-only shrinkage.

With interactions, state the exact simple effect or difference-in-differences
estimand. A main-effect coefficient is the effect at the reference level of the
interacting factor, not an average effect. Use a Wald coefficient/contrast for a
specific estimand and a full-versus-reduced likelihood-ratio test for a planned
multi-degree-of-freedom omnibus question.

## Diagnostics

Review dispersion estimates, MA plots, count support for important genes,
sample-level QC, Cook's distance behavior, convergence warnings, and model
matrix rank. Do not interpret a p-value without effect direction, effect size,
uncertainty, and count support.

Independent filtering and multiple-testing correction must be declared before
selective interpretation. Do not disable filtering only for genes that look
interesting after the analysis.

## Outputs

Record the design formula, factor levels, contrast, `resultsNames(dds)`, DESeq2
and shrinkage package versions, alpha, filtering behavior, and complete result
object. Preserve the fitted object or enough inputs to recreate it.

Keep the original unshrunk `results(dds, ...)` statistic for ranked enrichment.
Join shrunken fold changes back by stable gene ID; do not expect an
`apeglm`-shrunken result object to supply the Wald statistic.

An LRT statistic is an unsigned deviance and must not be used as a directional
GSEA rank. For enrichment after an omnibus LRT, define a scientifically relevant
signed Wald contrast separately or omit directional ranked enrichment.

## Provenance

Adapted from MIT `bioSkills` revision
`24f0694a125e53f04a7c66a54ba9b81461b7227f`, path
`differential-expression/deseq2-basics`. This version corrects interaction and
coefficient-shrinkage guidance and makes model estimability an explicit gate.

## Citation

```text
Linxira OS. Linxira Skills: differential-expression-deseq2. Version 0.1.0.
Skill path: skills/differential-expression-deseq2/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```

Also cite DESeq2 and any shrinkage method actually used, such as apeglm or
ashr, in the final manuscript or methods report.
