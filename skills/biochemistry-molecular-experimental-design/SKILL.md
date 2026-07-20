---
name: biochemistry-molecular-experimental-design
description: Use to plan biochemistry and molecular biology studies with explicit units, replication, controls, assay validity, allocation, and confounding checks; not for executable protocols or operational parameter optimization.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, controlled-data]
---

# Biochemistry And Molecular Experimental Design

Design the study so molecular mechanism, biological inference, and assay
measurement are not confused. This is a planning skill, not an executable
protocol and not a substitute for institutional oversight.

## Domain Intake

Establish:

- The molecular question, competing hypotheses, intended contrast, and decision.
- The biological source, strain, donor, cell system, tissue, construct, protein,
  analyte, or public dataset and the intended scope of inference.
- The intervention or perturbation, comparator, dose concept if relevant, time
  points, primary readout, secondary readouts, and expected direction of effect.
- Whether the design concerns enzyme kinetics, binding, omics or another assay,
  molecular constructs, expression, localization, interaction, or a combination.
- Available biological sources, assay runs, plates, instruments, operators, lots,
  sequencing libraries, and independent preparation opportunities.
- Biosafety, genetic-material, controlled-data, ethical, budget, and throughput
  constraints. Record approvals and route execution details to current local SOPs.

Reuse `biological-experimental-design` for general design structure and
`biological-study-statistics` for estimands, power, models, missingness,
multiplicity, and diagnostics.

## Units And Replication

Name the hierarchy before counting samples:

- **Experimental unit**: the smallest biological entity independently assigned to
  treatment, perturbation, construct, ligand, or condition.
- **Observational unit**: the entity or measurement from which a value is recorded,
  such as a well, aliquot, molecule, cell, library, or time point.
- **Analysis unit**: the unit treated as independent for the intended inference.
- **Biological replicate**: an independent culture, preparation, donor, organism,
  tissue source, clone, or experimental occasion supporting biological inference.
- **Technical replicate**: repeated assay, injection, library measurement, or readout
  of the same biological material.

State numbers and nesting at every level. Technical repeats estimate measurement
variation and do not create independent biological replication. Cells, reads,
fields of view, wells from one preparation, and aliquots from one source must not
be relabeled as independent biological units.

## Design By Study Type

For enzyme or kinetic work, define substrate, enzyme, inhibitor, time, and condition
factors; distinguish initial-rate, endpoint, and dynamic outcomes; identify the
kinetic quantity and comparison of interest; and ensure the planned design can
separate saturation, inhibition, time, and batch effects without prescribing
operational settings.

For binding studies, define interaction partners, reference states, affinity or
occupancy outcome, specificity comparison, concentration concept, equilibrium or
kinetic question, and competition or nonbinding controls. State what a signal
cannot establish, such as direct binding versus indirect association.

For omics and assay studies, define the specimen-to-signal chain, library or assay
batch, normalization target, detection limits, missingness, quality exclusions,
and confirmatory readout. Preserve raw measurements and predeclare primary versus
exploratory features.

For molecular constructs, define construct identity, intended perturbation, matched
backbone, expression or delivery comparator, validation readout, and functional
readout. Distinguish construct-level biological replication from repeated reads of
one clone or preparation; do not infer function from expression or localization
alone.

## Controls And Measurement Validity

Select controls for the actual failure modes:

- Negative, untreated, vehicle, mock, empty-vector, wild-type, or nonbinding controls.
- Positive, rescue, reference-ligand, known-substrate, or system-responsiveness controls.
- Process controls for extraction, lysis, purification, contamination, carryover,
  amplification, labeling, library preparation, and instrument drift.
- Calibration, reference material, spike-in, internal standard, and run-bridging
  controls where the measurement requires them.
- Orthogonal or confirmatory readouts when specificity, identity, or mechanism is
  central to the claim.

Define the diagnostic purpose and failure consequence of each control. Check
identity, specificity, dynamic range, limit of detection, saturation, linearity,
precision, normalization, drift, interference, carryover, and assay stability.
Do not treat a technically clean signal as evidence that the biological construct
or mechanism is valid.

## Allocation, Batch, And Blinding

- Randomize eligible biological units to conditions with a recorded seed and assignment table.
- Block or balance on donor, passage or generation, preparation day, operator, lot,
  plate, instrument, lane, run order, and other strong nuisance variables.
- Distribute all conditions across plates, positions, runs, batches, and operators;
  never make condition identical to batch or plate region.
- Blind sample identity during processing, image or signal assessment, and analysis
  when feasible. Record unavoidable unblinding and its timing.
- Keep biological condition, sample identity, preparation, assay batch, and technical
  repeat identifiers in separate fields.

## Confounding And Validity Audit

Cross condition with donor or source, clone, construct preparation, sex or stage
where relevant, operator, day, lot, plate, instrument, run, position, and sequence
depth. Check that:

- Every key condition is represented across independent biological sources and batches.
- One source, clone, plate, or run does not carry an entire condition.
- Controls are not reused as independent samples across unrelated experiments.
- Repeated measures, technical repeats, nested cells, and aliquots retain dependence.
- Construct identity, sample swaps, contamination, degradation, and failed controls
  have predefined handling rules.

Redesign when a biological effect is aliased with batch, source, operator, or assay
position. Route formal estimands and statistical assumptions to
`biological-study-statistics`.

## Safety And Ethical Boundaries

Do not provide operational parameters for culturing, engineering, delivery,
selection, amplification, pathogen or toxin work, or other hazardous molecular
activities. Require applicable biosafety, genetic-material, human-sample, data,
and institutional approvals, authorized personnel, containment, waste, and
incident procedures. Do not expose controlled genomic, donor, facility, or
sequence information in planning artifacts.

## Design Artifacts

Deliver a study synopsis; unit and replication hierarchy; condition and control
matrix; assay-validity checklist; construct or specimen identity map; allocation,
blocking, batch, plate, and blinding plan; confounding and pseudoreplication audit;
data dictionary; and statistical handoff to `biological-study-statistics`.

## Completion Criteria

Complete only when the question, units, biological and technical replication,
controls, measurement validity, allocation, batch handling, blinding, safety
boundaries, data structure, and confounding checks are explicit and support the
intended molecular inference without crossing into executable protocol guidance.
