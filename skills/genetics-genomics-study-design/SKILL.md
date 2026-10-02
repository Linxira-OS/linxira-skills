---
name: genetics-genomics-study-design
description: Use to plan inheritance, pedigree, cross, population, association, sequencing, or genotype-phenotype studies with explicit ascertainment, relatedness, reference, validation, and interpretation boundaries.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, clinical, controlled-data]
---

# Genetics And Genomics Study Design

Plan genetic studies around the population, family, cross, sampling process, and
claim that the data can support. This skill plans evidence and analysis handoffs;
it does not make clinical interpretations or provide genetic manipulation steps.

## Design Frame

- Define inheritance or association hypothesis, phenotype, genotype, target
  population, pedigree or cross structure, sampling frame, and validation target.
- Identify individual, family, line, population, specimen, library, lane, variant,
  and analysis units; preserve relatedness and repeated samples.
- Record inclusion, ascertainment, recruitment, missing relatives, ancestry or
  population structure, environmental covariates, and phenotype measurement error.
- Predefine reference assembly, annotation version, coordinate conventions,
  variant classes, identity checks, and sample-to-file provenance.

Reuse `biological-study-statistics` for estimands, multiplicity, relatedness,
missingness, and sensitivity analysis and `bioinformatics-reproducibility` for
computational provenance.

## Validity And Replication

- Distinguish discovery, technical confirmation, independent replication, and
  functional validation.
- Balance specimen processing, library preparation, platform, lane, center, batch,
  operator, and analysis version across comparison groups.
- Audit phenotype definition, population stratification, cryptic relatedness,
  batch effects, reference bias, coverage, contamination, sample swaps, and
  selective reporting.
- Do not infer causality from association alone or generalize beyond represented
  populations, families, environments, or variant classes.

## Ethics And Governance

Require consent-compatible use, privacy, controlled-access rules, return-of-results
policy, incidental-finding governance, community or population permissions, and
clinical review where applicable. Protect identifiable genomic and pedigree data.
Require approved SOPs for specimen collection or genetic manipulation and do not
offer diagnosis, reproductive advice, or clinical action.

## Design Artifacts

Deliver a population and ascertainment synopsis; pedigree, cross, or cohort map;
phenotype and genotype definitions; sample and reference provenance schema; batch
allocation plan; discovery-replication-validation chain; bias and relatedness
audit; consent and data-governance register; and statistical handoff.

## Completion Criteria

Complete only when ascertainment and relatedness are explicit, phenotype and
reference definitions are versioned, technical and biological replication are
separate, population and batch confounding are addressed, and interpretation stays
within ethical and evidentiary limits.
