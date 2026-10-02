---
name: multi-omics-study-design
description: Use to plan matched multi-omics studies with explicit specimen and aliquot allocation, modality-specific controls, batch alignment, missing modalities, integration estimands, validation, and reproducible handoff.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, clinical, controlled-data]
---

# Multi-Omics Study Design

Plan multi-omics studies around a biological question that requires more than one
modality, not around the availability of platforms alone.

## Design Frame

- Define target population, biological system, primary hypothesis, integration
  estimand, modalities, shared covariates, validation target, and inference scope.
- Identify subject or biological unit, specimen, region or compartment, aliquot,
  extraction, library, run, feature, and analysis units.
- Decide whether modalities are measured on the same material, matched aliquots,
  matched cells, repeated specimens, or different cohorts and state the resulting
  limits on integration.
- Allocate finite material before collection, preserving priority endpoints,
  reserve material, destructive assays, and modality-failure contingencies.

Reuse domain-specific assay skills, `biological-study-statistics`, and
`bioinformatics-reproducibility`; use `bulk-rnaseq-analysis` only for its exact
transcriptomic stages.

## Batch, Missingness, And Integration

- Balance biological conditions within every modality across collection,
  processing, extraction, library, plate, run, instrument, center, and operator.
- Align batches where practical without forcing all modalities into one batch or
  confounding modality with condition.
- Predefine sample identifiers, feature namespaces, reference builds, annotation
  versions, transformations, QC flags, and cross-modality matching rules.
- Distinguish biological absence, below-detection values, technical failure,
  censored values, and unavailable modality data.
- Separate discovery, integration, prediction, replication, and orthogonal
  validation; do not present post hoc cross-modal correlation as mechanism.

## Ethics And Governance

Require consent-compatible reuse across modalities, specimen authorization,
clinical and genomic privacy, controlled access, biosafety, and data-retention
rules. Do not make clinical decisions or provide operational specimen-processing
or hazardous assay parameters.

## Design Artifacts

Deliver a biological-question and integration-estimand synopsis; specimen-aliquot-
modality map; material budget; modality control matrix; batch-alignment plan;
identifier and metadata contract; missing-modality policy; discovery-validation
chain; governance register; and reproducible statistical handoff.

## Completion Criteria

Complete only when every modality is necessary, samples and aliquots remain
traceable, condition is not confounded with batch, missing modalities are planned,
integration answers a prespecified question, and validation is independent.
