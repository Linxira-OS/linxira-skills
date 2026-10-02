---
name: plant-physiology-experimental-design
description: Use to plan mechanistic plant physiology studies involving water relations, gas exchange, development, source-sink behavior, or stress trajectories; not for cultivation recipes or environmental release instructions.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, controlled-data]
---

# Plant Physiology Experimental Design

Plan mechanistic plant studies around developmental state, organ, treatment
assignment, and the time scale of the physiological claim. Use
`crop-plant-experimental-design` instead when the main question is agronomic,
multi-environment, or plot-level performance.

## Design Frame

- Define genotype, developmental stage, organ, environment, treatment, baseline,
  response window, and the physiological mechanism under test.
- Distinguish independently treated plants, pots, chambers, leaves, organs,
  subsamples, repeated readings, and analysis units.
- Treat plants sharing one pot, hydroponic vessel, chamber, or treatment zone as
  nested unless assignment and exposure are genuinely independent.
- Separate destructive cohorts from longitudinal plants and state how destructive
  sampling changes the estimand.

Reuse `biological-experimental-design` for allocation and controls and
`biological-study-statistics` for power, trajectories, repeated measures, and
missingness.

## Physiological Validity

- Predefine water status, carbon exchange, fluorescence, growth, phenology,
  nutrient, source-sink, anatomical, or stress-response endpoints and units.
- Balance genotype and condition across chamber, bench, position, day, operator,
  instrument, measurement order, and time of day.
- Record acclimation, developmental stage, leaf age and position, substrate,
  moisture, temperature, humidity, light history, and realized exposure.
- Use calibration, reference material, dark or blank controls, baseline readings,
  and orthogonal measurements where they diagnose the claim.
- Do not infer whole-plant performance from repeated measurements of one leaf or
  infer field adaptation from one controlled environment.

## Confounding And Boundaries

Audit treatment against chamber, pot, genotype, developmental stage, watering
zone, diurnal window, operator, instrument, and harvest order. Stop if treatment
is inseparable from one chamber or measurement day. Require current approvals and
authorized SOPs for regulated plants, genetic material, pathogens, chemicals,
quarantine, transport, containment, or release. Do not provide executable growth,
transformation, inoculation, stress-induction, or release parameters.

## Design Artifacts

Deliver a hypothesis and estimand synopsis; plant-pot-organ unit hierarchy;
treatment and control matrix; chamber, position, timing, and batch allocation;
developmental and environmental metadata schema; measurement-validity checklist;
destructive-versus-longitudinal sampling plan; confounding audit; and statistical
handoff.

## Completion Criteria

Complete only when assignment and analysis units agree, diurnal and developmental
timing are controlled, chamber and position effects are separable, physiological
measurements support the mechanism, and biosafety boundaries are documented.
