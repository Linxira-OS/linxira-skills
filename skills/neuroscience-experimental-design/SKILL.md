---
name: neuroscience-experimental-design
description: Use to plan neural, behavioral, electrophysiology, or neuroimaging studies with explicit subject, circuit, region, session, trial, state, and cross-scale inference; not for executable procedures or clinical decisions.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, clinical, controlled-data]
---

# Neuroscience Experimental Design

Plan neuroscience studies so subject-level inference is not inflated by neurons,
trials, regions, electrodes, images, or repeated sessions.

## Design Frame

- Define neural or behavioral hypothesis, organism or population, circuit or region,
  intervention or exposure, task or state, comparator, endpoint, and time scale.
- Identify subject, litter or cage, session, trial, region, recording site, neuron,
  image, channel, and analysis units and preserve their nesting.
- Balance condition across subject characteristics, hemisphere, region, session,
  task order, time of day, operator, apparatus, acquisition system, and batch.
- Predefine habituation, learning, fatigue, carryover, sleep, arousal, stress,
  medication, movement, and missing-session handling.

Reuse `animal-physiology-experimental-design` or
`medical-translational-study-design` for subject-level governance and
`biological-study-statistics` for hierarchical and repeated-measure analysis.

## Measurement And Inference

- Define whether endpoints represent behavior, firing, field activity, connectivity,
  anatomy, hemodynamics, molecular state, or another construct.
- Document calibration, localization, artifact detection, exclusion, observer
  blinding, preprocessing provenance, and quality thresholds before comparison.
- Separate trial count from subject count and exploratory region selection from
  confirmatory inference.
- Do not infer behavior from neural correlation alone, infer cellular mechanism
  from system-level imaging alone, or generalize across species or clinical groups
  without direct evidence.

## Ethics And Safety

Require human-subject, animal, clinical, imaging, implant, radiation, electrical,
laser, controlled-data, and facility approvals as applicable. Route procedures and
apparatus operation to authorized SOPs and trained personnel. Do not provide
operational lesion, stimulation, exposure, implant, sedation, or treatment advice.

## Design Artifacts

Deliver a subject-session-trial-region-cell hierarchy; condition and task matrix;
randomization, counterbalancing, and blinding plan; state and artifact metadata;
measurement-validity checklist; cross-scale inference limits; welfare and approval
register; confounding audit; and statistical handoff.

## Completion Criteria

Complete only when subject-level replication is explicit, task and state effects
are controlled, acquisition and region selection are reproducible, cross-scale
claims are justified, and human or animal safety boundaries are documented.
