---
name: gene-set-enrichment-analysis
description: Use when performing ranked gene-set enrichment after differential expression, including identifier mapping, deterministic rank construction, gene-set versioning, multilevel enrichment, leading-edge review, and bounded pathway interpretation. Do not rank only significant genes.
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# Gene-set Enrichment Analysis

Use a complete ranked statistic to test coordinated shifts. A pathway result is
an association with the ranking, not proof that the pathway is activated or
causal.

## Inputs

Require:

- one statistic for every eligible tested gene, preferably a signed model
  statistic or a predeclared signed effect metric
- the identifier namespace and annotation release
- a versioned gene-set collection with source and access date
- the exact tested contrast and organism

Do not rank adjusted p-values or provide only genes that passed a significance
threshold. Remove non-finite statistics and document the eligible universe.

## Identifier Mapping

Map identifiers before ranking and report unmapped and one-to-many cases. When
one source gene maps to multiple target IDs, resolve it with a documented
biological rule or reject it from the ranked input; do not duplicate one test
statistic across several target IDs. When
multiple input rows map to one enrichment identifier, use a documented,
deterministic rule such as retaining the row with the largest absolute statistic
and resolving ties by stable identifier order. Preserve the discarded mapping
table for audit.

```r
mapped <- results[is.finite(results$stat) & !is.na(results$entrez_id), ]
mapped <- mapped[order(-abs(mapped$stat), mapped$source_gene_id, mapped$entrez_id), ]
mapped <- mapped[!duplicated(mapped$entrez_id), ]
ranks <- setNames(mapped$stat, mapped$entrez_id)
ranks <- sort(ranks, decreasing = TRUE, method = "radix")
stopifnot(length(ranks) > 0, !anyDuplicated(names(ranks)))
```

## Analysis Contract

Use a maintained implementation such as `fgseaMultilevel` or the matching
versioned clusterProfiler API. Record package versions, random seed, minimum and
maximum gene-set size, and all parameters. Setting `eps = 0` removes a p-value
floor in supported fgsea APIs; it does not make Monte Carlo estimates exact.

Preranked fgsea uses a gene-permutation competitive null. Inter-gene correlation
can make its p-values anti-conservative, and BH correction does not repair that
null-model mismatch. When a count/expression matrix and design are available and
formal competitive inference matters, route to the correlation-aware CAMERA
competitive test. Use ROAST or fry only when the self-contained null is the
intended scientific question. Treat preranked results as bounded rank enrichment
and interpret overlapping terms as related clusters.

## Review Results

For each reported term, retain normalized enrichment score, p-value, adjusted
p-value, size, leading-edge genes, and the tested collection. Check whether a
result is driven by a few extreme genes, ambiguous mappings, duplicated gene
families, or a broad housekeeping program.

Compare enrichment direction with the underlying rank and expression evidence.
Use orthogonal databases or sensitivity analyses when the conclusion depends on
one collection or one identifier mapping rule.

## Outputs

Save the complete rank vector, mapping audit, gene-set snapshot/version,
parameters, full enrichment table, leading-edge table, and plots. Do not write
the only result to a temporary directory.

## Provenance

Adapted from MIT `bioSkills` revision
`24f0694a125e53f04a7c66a54ba9b81461b7227f`, path
`pathway-analysis/gsea`. This version corrects p-value claims, duplicate mapping,
and durable-artifact requirements.

## Citation

```text
Linxira OS. Linxira Skills: gene-set-enrichment-analysis. Version 0.1.0.
Skill path: skills/gene-set-enrichment-analysis/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```

Also cite the actual enrichment implementation and gene-set source used in the
analysis, such as fgsea, CAMERA, MSigDB, GO, Reactome, or another declared
collection.
