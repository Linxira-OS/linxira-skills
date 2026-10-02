---
name: cellular-imaging-cytometry-study-design
description: Use to plan microscopy and flow-cytometry measurements with explicit acquisition units, panels or channels, calibration, field or event selection, gating or segmentation, batch balance, and pseudoreplication controls.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, clinical, controlled-data, privileged]
---

# Cellular Imaging And Cytometry Study Design

Plan microscopy and cytometry as measurement systems embedded in a biological
study. This skill does not provide instrument-operation, sorting, laser, aerosol,
sample-preparation, or clinical interpretation procedures.

## Measurement Frame

- Define biological construct, sample hierarchy, modality, channels or markers,
  acquisition unit, endpoint, expected range, and decision rule.
- Preserve donor, specimen, culture, well, section, field, image, cell, event,
  technical repeat, run, instrument, and analysis-unit identifiers.
- Treat fields, cells, and events from one biological unit as subsampling unless
  the inferential model represents their hierarchy.
- Balance condition across preparation batch, slide or plate, position, operator,
  instrument, run, acquisition order, and analysis version.

## Controls And Reproducibility

- Predefine reference, negative, positive, blank, autofluorescence, compensation,
  viability, calibration, staining, segmentation, and gating controls as applicable.
- Establish field-selection or event-inclusion rules before unblinding; avoid
  choosing representative images after seeing condition labels.
- Version panel or channel definitions, acquisition metadata, calibration,
  thresholds, compensation, gates, segmentation models, and manual corrections.
- Check saturation, spillover, drift, focus, illumination, sampling bias, debris,
  doublets, rare-event stability, observer agreement, and ground truth.
- Separate acquisition failure, segmentation or gating failure, and biological change.

## Safety And Data Boundaries

Require trained operators, facility authorization, instrument and sorter SOPs,
laser and aerosol controls, biosafety classification, clinical consent, and
controlled image or specimen data handling. Stop if sample risk or instrument
authorization is unclear.

## Design Artifacts

Deliver a biological-to-acquisition unit hierarchy; panel or channel and control
matrix; plate, slide, run, and instrument allocation; calibration and QC plan;
field/event selection rules; gating or segmentation version record; blinded review
plan; pseudoreplication audit; and statistical handoff.

## Completion Criteria

Complete only when biological replication is distinct from cells or events,
controls diagnose the measurement chain, acquisition and analysis are versioned,
selection is reproducible, batches are balanced, and facility safety is approved.
