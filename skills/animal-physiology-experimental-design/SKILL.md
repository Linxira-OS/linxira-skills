---
name: animal-physiology-experimental-design
description: Use to plan animal physiology studies with explicit animal experimental units, welfare safeguards, repeated-measure structure, allocation, blinding, and validity checks; not for executable animal procedures or clinical decisions.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, clinical, controlled-data]
---

# Animal Physiology Experimental Design

Design animal physiology studies so the animal-level inference, measurement
burden, dependence, and welfare obligations are explicit before enrollment or
data collection. This skill is planning-only and does not authorize animal work.

## Domain Intake

Establish:

- The physiological question, competing hypotheses, intended decision, target
  population, and limits of generalization.
- Species, strain, breed, sex, age, developmental stage, reproductive status,
  source, health status, housing, acclimation, and relevant baseline physiology.
- Intervention, exposure, comparator, challenge, procedure category, timing,
  primary and secondary outcomes, repeated measurements, and rescue conditions.
- Animal numbers available, cage or pen structure, litter or colony structure,
  facility, room, equipment, operators, observation schedule, and assay batches.
- Welfare burden, refinement and reduction opportunities, humane endpoints,
  veterinary oversight, analgesia or supportive care requirements, and approved
  stopping rules.
- IACUC, ethics committee, veterinary, biosafety, controlled-data, import, and
  institutional approvals. Route operational details to current approved SOPs.

Reuse `biological-experimental-design` for units, controls, allocation, and
confounding. Reuse `biological-study-statistics` for estimands, power, repeated
measures, missingness, covariance, and sensitivity planning.

## Animal Experimental Unit And Replication

Define the hierarchy before counting observations:

- **Animal experimental unit**: the smallest animal independently assigned to a
  condition, unless assignment occurs at cage, litter, pen, colony, or facility level.
- **Observational unit**: a physiological reading, specimen, tissue, behavior,
  image, assay, or time point recorded from an animal.
- **Analysis unit**: the unit represented as independent for the intended inference.
- **Biological replicate**: an independent animal or independently assigned cluster
  supporting inference about the target population.
- **Technical replicate**: repeated instrument, assay, image, or subsample measurement
  from the same animal or specimen.

State animals per cage or litter, cages or litters per condition, and all nesting.
Technical readings, cells, tissues, and repeated time points do not increase the
number of independent animals. If cage, litter, pen, or colony assignment is the
true treatment assignment, preserve that unit in design and analysis.

## Conditions And Controls

Choose controls that diagnose the physiological claim:

- Untreated, baseline, sham, vehicle, handling, pair-fed, matched-housing, or
  reference-condition controls as appropriate.
- Positive or responsive controls demonstrating that the physiological system and
  measurement can detect a known change.
- Procedure, anesthesia, restraint, telemetry, sampling, assay, and instrument
  controls for effects introduced by measurement or handling.
- Rescue, recovery, washout, or reversibility comparators when they are part of the
  hypothesis rather than post hoc explanations.

State the purpose and failure consequence of every control. Do not interpret a
between-group difference without considering handling, housing, circadian time,
order, stress, and supportive care.

## Randomization, Blocking, And Blinding

- Randomize eligible animals or clusters with a reproducible seed and preserve the
  assignment table; do not use cage order or alternation as a substitute.
- Stratify or block on sex, age, strain, litter, baseline value, body mass, health
  status, cage, room, facility, operator, day, instrument, and assay batch when relevant.
- Balance condition across cages, rooms, racks, measurement order, time of day,
  operators, instruments, and assay runs.
- Blind handlers, outcome assessors, image readers, and analysts where feasible;
  record who was unblinded, when, and why.
- Keep animal identity, treatment, housing, measurement, sample, and batch identifiers
  separate so deviations and repeated measurements remain traceable.

## Repeated Measures And Physiological Validity

Define subject, baseline, time points, recovery or carryover, order effects,
within-animal covariance, and the primary summary or contrast. Do not treat
serial measurements from one animal as independent animals. If the measurement,
sampling, restraint, or recovery changes later physiology, account for that effect
or choose a design that avoids the claimed interpretation.

Predefine calibration, assay precision, detection range, observer agreement,
instrument drift, sample integrity, circadian timing, acclimation, environmental
conditions, and acceptable deviations. Distinguish physiological failure from
measurement failure and document whether an endpoint is terminal, destructive,
or compatible with follow-up.

## Confounding And Bias Audit

Cross condition with sex, age, strain, litter, source, baseline physiology, body
mass, cage, room, facility, handling, operator, time of day, order, batch,
instrument, and attrition. Check for:

- A sex, strain, age, litter, room, or batch appearing in only one condition.
- One cage, litter, operator, or animal source carrying an entire treatment level.
- Selective exclusions, deaths, rescue, missing visits, or failed samples after allocation.
- Shared controls reused as independent animals across cohorts or experiments.
- Handling, assay, or measurement order confounded with treatment.

Predefine deviation, missingness, mortality, rescue, censoring, and exclusion rules;
route the estimand and model implications to `biological-study-statistics`.

## Welfare, Ethics, And Safety Boundaries

Require an approved animal-use protocol, IACUC or equivalent ethics review,
veterinary oversight, trained personnel, facility authorization, species-specific
monitoring, humane endpoints, pain and distress mitigation, and documented rescue
and euthanasia provisions where applicable. Apply reduction, refinement, and
replacement principles. Stop and escalate for unexpected morbidity, distress,
adverse events, protocol deviation, containment failure, or endpoint ambiguity.

Do not provide operational parameters for inducing disease, injury, severe distress,
or unsafe exposure, and do not give clinical treatment advice beyond the approved
study and veterinary authority. Protect identifiable, veterinary, genomic, and
controlled facility data.

## Design Artifacts

Deliver a question and estimand synopsis; animal and cluster unit hierarchy;
biological versus technical replication table; condition and control matrix;
sex-age-strain and baseline balance plan; randomization, blocking, housing,
batch, order, and blinding plan; repeated-measure schedule; measurement-validity
checklist; welfare and humane-endpoint matrix; approval register; confounding,
missingness, and pseudoreplication audit; and statistical handoff to
`biological-study-statistics`.

## Completion Criteria

Complete only when the animal experimental unit is explicit; biological and
technical replication are distinct; sex, age, strain, housing, batch, repeated
measures, randomization, blinding, controls, measurement validity, humane
endpoints, IACUC or equivalent ethics, safety boundaries, and confounding checks
support the intended physiological inference.
