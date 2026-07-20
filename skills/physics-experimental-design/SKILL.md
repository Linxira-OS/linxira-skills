---
name: physics-experimental-design
description: Use to design physics experiments around operational measurands, calibrated apparatus, controls, uncertainty, order effects, drift, model comparison, preregistered analysis, and reproducibility; not for executable apparatus procedures.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data, privileged]
---

# Physics Experimental Design

Design a physics experiment so the measurand, intervention or comparison, apparatus
response, uncertainty, and inferential limits are explicit before data collection.
This skill creates a planning specification, not an apparatus operating procedure.

## Intake

Establish:

- The physical question, competing hypotheses or models, intended decision, and claim scope.
- The target system, regime, expected scale, boundary conditions, and validity domain.
- Candidate measurands, observables, derived quantities, and operational constraints.
- Available apparatus, sensors, references, calibration services, runs, operators, sites,
  software, computing resources, and acquisition time.
- Known backgrounds, nuisance variables, environmental sensitivities, and expected drift.
- Safety, facility, data-classification, export-control, collaboration, and access limits.

If organisms, participants, tissues, or biological responses define the experimental
units or endpoints, route design to `biological-experimental-design` and statistical
planning to `biological-study-statistics`.

## Define The Measurand

Give each primary measurand an operational definition that states:

- The physical quantity, unit, sign convention, coordinate frame, and reference state.
- The system or population to which it applies and the spatial and temporal support.
- The observable or sensor response from which it is estimated.
- Corrections, transformations, normalization, and constants used in derivation.
- Resolution, bandwidth, dynamic range, trigger, threshold, and censoring boundaries.
- The conditions under which the definition is valid and the claim can generalize.

Distinguish the measurand from a raw channel, proxy, fitted parameter, model prediction,
and displayed value. Define secondary and diagnostic quantities separately.

## Define Units And Repeated Runs

Name the independent experimental unit, acquisition unit, observational unit, and
analysis unit. State whether independence occurs at the specimen, device, apparatus
configuration, field realization, beam period, session, day, site, or another level.

Plan repeated runs to estimate relevant variation across restarts, alignments,
configurations, days, operators, instruments, or sites. Repeated samples within one
acquisition estimate short-term noise and do not automatically provide independent
replication. Document nesting, aggregation, synchronization, and shared references.

## Apparatus And Calibration

Create an apparatus map from physical input through sensor, signal conditioning,
acquisition, correction, and reported quantity. For each critical component record:

- Identifier, configuration, firmware or software, calibration status, and traceability.
- Operating range assumed by the design and any nonlinearity or saturation boundary.
- Reference standards, transfer standards, calibration model, and verification checks.
- Alignment, timing, geometry, gain, offset, response function, and cross-channel effects.
- Recalibration triggers after elapsed time, transport, reconfiguration, repair, or drift.

Separate calibration data from data used for primary model evaluation where feasible.
Do not use the target result itself as the sole calibration reference.

## Controls And Null Measurements

Use controls that isolate instrumental and physical alternatives:

- Zero-input, dark, background, empty-apparatus, dummy-load, or shielded measurements.
- Null configurations designed to remove or reverse the predicted effect.
- Positive or injected-reference checks that demonstrate end-to-end sensitivity.
- Sham configuration changes that reveal handling, alignment, or analysis artifacts.
- Cross-sensor, cross-method, or reference-instrument comparisons.
- Contamination, hysteresis, memory, leakage, cross-talk, and carryover checks.

State what each control diagnoses, its expected response and uncertainty, and how failure
limits interpretation. A null result is informative only when sensitivity to the
effect size of interest has been demonstrated.

## Allocation, Randomization, And Order Effects

- Randomize condition order when the apparatus and safety constraints permit.
- Counterbalance or block hard-to-randomize configurations across time and operators.
- Interleave controls and reference checks to distinguish condition effects from drift.
- Balance direction, polarity, orientation, position, channel, and acquisition sequence.
- Record the allocation algorithm, constraints, seed where used, and executed order.
- Predefine washout, settling, reset, or exclusion concepts without prescribing operation.

Assess hysteresis, warm-up, fatigue, aging, depletion, memory, carryover, adaptation,
and irreversible configuration changes. Do not claim randomization when order is fixed
or condition is aliased with time, operator, instrument, or apparatus state.

## Drift And Environmental Conditions

Identify environmental quantities that can affect the measurand or apparatus, including
temperature, pressure, humidity, vibration, electromagnetic background, radiation
background, acoustic noise, power quality, timing references, and mechanical stability.

Define monitoring channels, sampling cadence at the design level, acceptable data-quality
states, and rules for annotation, exclusion, correction, or sensitivity analysis.
Plan reference observations that quantify short-term drift, long-term drift, step changes,
and post-configuration settling. Preserve raw environmental and instrument-state records.

## Uncertainty Budget

Build an uncertainty budget tied to the measurement equation. Include as relevant:

- Calibration standards, transfer, interpolation, and traceability.
- Resolution, quantization, repeatability, reproducibility, and sampling variation.
- Geometry, alignment, timing, synchronization, gain, offset, and response correction.
- Background subtraction, environmental correction, drift, and model dependence.
- Shared references, correlated channels, covariance, and common-mode effects.
- Numerical approximation, software implementation, constants, and rounding.

Classify contributions by evaluation method and correlation structure. State how they
combine, the coverage or interval interpretation, and which components dominate.
Avoid double counting a correction and its uncertainty or treating systematic effects
as if repetition alone removes them.

## Model Comparison And Preregistered Analysis

Before examining confirmatory results, specify:

- Primary estimands or fitted physical parameters and their units.
- Competing models, parameter constraints, nuisance terms, and validity ranges.
- The comparison criterion, uncertainty method, and decision threshold or evidence scale.
- Data-quality rules, exclusions, missing or censored observations, and stopping rules.
- Residual, calibration, stability, and goodness-of-fit diagnostics.
- Planned robustness checks, alternative reasonable models, and negative-control analyses.
- Separation of confirmatory analyses from exploratory model development.

Preregister the analysis and preserve a timestamped version where the claim warrants it.
Do not choose models solely by the smallest residual, largest significance, or best result.
Account for complexity, identifiability, parameter degeneracy, predictive performance,
and whether models make distinguishable predictions in the measured regime.

When a physics instrument measures biological samples or outcomes and biological
variation contributes to inference, route sample-size, estimand, missingness,
multiplicity, and biological dependence planning to `biological-study-statistics`.

## Reproducibility Plan

Preserve enough provenance to reconstruct the study without converting this plan into
an operating protocol:

- Apparatus diagram, configuration identifiers, component and calibration records.
- Acquisition schema, channel dictionary, units, timestamps, clocks, and run manifest.
- Randomization and executed-order records, control placement, and deviations.
- Raw, intermediate, and final data lineage with checksums and access controls.
- Software, dependencies, configuration, seeds, constants, and environment provenance.
- Analysis code, model definitions, preregistration, results, and machine-readable outputs.

Plan independent reproduction across runs and, where the claim requires it, across
operators, apparatuses, methods, or sites. Distinguish repeatability, intermediate
precision, reproducibility, and conceptual replication.

## Artifacts

Deliver:

- A design synopsis connecting question, physical claim, measurand, and decision.
- Operational-definition and measurement-equation table.
- Experimental, acquisition, observational, and analysis-unit hierarchy.
- Apparatus, calibration, traceability, and verification matrix.
- Control, null-measurement, randomization, run-order, and blocking plan.
- Drift and environmental-monitoring plan with data-quality rules.
- Uncertainty budget with covariance and dominant-contributor review.
- Preregistered model-comparison and analysis specification.
- Reproducibility manifest, data schema, provenance plan, and reporting shell.

## Non-Goals And Safety

- Do not provide an executable apparatus assembly, alignment, energization, or operating
  procedure, especially for high voltage, lasers, radiation, pressure, vacuum, cryogens,
  strong fields, energetic machinery, or other hazardous systems.
- Do not substitute generic planning for facility rules, qualified supervision, or
  equipment-specific safety review.
- Do not optimize hazardous performance or advise bypassing interlocks, shielding,
  containment, access controls, monitoring, or approvals.
- Do not treat repeated readouts as independent runs or precision as accuracy.
- Do not hide uncontrolled drift, failed nulls, model changes, exclusions, or deviations.
- Do not expose controlled facility, instrument, defense, export-controlled, or
  collaborator-restricted data outside approved systems.

## Completion Criteria

Complete only when the measurand and operational definition are unambiguous; units and
independence are explicit; apparatus calibration and traceability support the claim;
controls and null measurements test credible alternatives; run order, repetition,
drift, and environmental effects are addressed; the uncertainty budget is complete;
model comparison and analysis are preregistered where appropriate; and provenance is
sufficient for the intended level of repeatability and reproducibility.
