---
name: crop-plant-experimental-design
description: Use to plan crop and plant experiments across field, greenhouse, and controlled environments with explicit plot and plant units, genotype by environment structure, spatial allocation, and measurement validity; not for executable cultivation protocols.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, controlled-data]
---

# Crop And Plant Experimental Design

Design plant studies around the level at which treatment is assigned and the
level at which agronomic or physiological inference is intended. This skill
plans comparisons and records; it does not provide executable cultivation,
chemical, release, or regulated-organism instructions.

## Domain Intake

Establish:

- The crop or plant system, biological question, hypotheses, target population,
  and intended production, ecological, or mechanistic inference.
- Genotypes, accessions, varieties, treatments, management factors, environments,
  and the genotype x environment questions to be answered.
- Field, greenhouse, growth-room, or other setting; site history; season; planting
  window; available plots, plants, pots, benches, facilities, and operators.
- Primary traits, measurement timing, destructive versus nondestructive outcomes,
  harvest definition, quality traits, and meaningful effect size.
- Soil, weather, irrigation, nutrient, pest, disease, and spatial information
  available before allocation.
- Biosafety, quarantine, gene-edited or transgenic status, pesticide or fertilizer
  restrictions, permits, environmental release boundaries, labor, and data limits.

Reuse `biological-experimental-design` for general units, controls, allocation,
and confounding structure. Reuse `biological-study-statistics` for estimands,
power, multi-environment models, missingness, and spatial or repeated-measure
analysis assumptions.

## Experimental And Observational Units

Define the hierarchy explicitly:

- **Experimental unit**: the smallest plot, pot, bed, greenhouse compartment,
  plant, or other unit independently assigned to a treatment.
- **Observational unit**: the plant, organ, subsample, quadrat, harvest, image,
  or repeated time point from which a measurement is recorded.
- **Analysis unit**: the unit represented as independent for the target inference.
- **Biological replicate**: an independent plot, plant, pot, site-season combination,
  or other biological source supporting inference.
- **Technical replicate**: repeated readings, subsamples, images, or assays from
  the same plant, plot, or collected material.

State the number of plants per plot and plots per genotype-treatment-environment
combination. Plants within one treated plot are not independent plot replicates.
Subsamples and repeated trait readings estimate within-unit variation unless the
design and analysis explicitly represent their nesting.

## Genotype By Environment Structure

Specify genotype, environment, management treatment, and their intended
interactions. Define whether environment means site, soil class, greenhouse,
season, year, weather regime, or another target. Include enough independent
site-season or facility occasions to distinguish genotype response from one
location or year. State which factors are fixed for the decision and which are a
sample of environments for generalization.

For factorial, split-plot, or multi-environment designs, identify the whole-plot
factor, subplot factor, assignment level, error strata, and interaction contrasts.
Do not claim broad stability from a single site, season, greenhouse, or year.

## Controls And Comparators

Use controls that diagnose the plant-specific threat:

- Untreated, standard practice, reference variety, baseline, or local check.
- Positive or responsive comparator for stress, nutrient, disease, irrigation, or
  management effects where scientifically justified.
- Mock, vehicle, empty-vector, segregant, or matched-background controls for
  treatments involving delivery, transformation, or genetic material.
- Border, guard, and measurement controls where edge effects or instrument drift
  can alter the observation, without treating guards as experimental replication.

Define what each control establishes and what its failure means. Keep genotype,
seed lot, planting material, developmental stage, and management history traceable.

## Field, Greenhouse, And Allocation Plan

- Randomize eligible plots or pots using a reproducible seed and preserve the map.
- Block on known soil gradients, topography, shade, bench or bay, irrigation zone,
  site, season, or other strong nuisance variables.
- Use spatially balanced allocation and rotate or balance treatment positions where
  practical; do not make treatment coincide with row, edge, irrigation line, or
  greenhouse compartment.
- Record the assigned unit, genotype, treatment, environment, season, and neighbor
  structure separately from observed outcomes.
- Define split-plot or cluster assignment when irrigation, shelter, soil treatment,
  or another factor applies to a whole plot, zone, bench, or compartment.

## Soil, Weather, Season, And Irrigation

Record pre-treatment soil properties, field history, topographic position, weather,
irrigation zone, irrigation event records, nutrient and pest management, planting
dates, harvest dates, and deviations. Treat season and weather as design or
analysis variables, not merely narrative context. Distinguish planned irrigation
allocation from realized water exposure, and define how drought, flooding, frost,
storm, pest, disease, or equipment failures affect interpretation.

## Measurement Validity And Confounding

Predefine trait definitions, units, developmental stage, observers, instruments,
calibration, sampling positions, image rules, destructive subsampling, and timing.
Assess repeatability, observer agreement, detection limits, missingness, harvest
loss, and whether measurement itself changes future outcomes.

Audit condition against genotype, seed lot, plot, row, soil, site, season, weather,
irrigation zone, greenhouse compartment, operator, date, and harvest order. Check
for edge effects, neighbor interference, unequal stand establishment, treatment
drift, mortality, selective harvest, and treatment-by-season or treatment-by-site
aliasing. Redesign when a key effect is inseparable from spatial position, season,
site, or management batch.

## Ethical, Biosafety, And Environmental Boundaries

Require institutional approvals, permits, quarantine, containment, waste, transport,
and environmental-release controls for regulated organisms, imported material,
gene-edited or transgenic lines, plant pathogens, pests, and restricted chemicals.
Do not optimize dissemination, persistence, resistance, pathogenicity, or release
of hazardous biological material. Use current authorized SOPs and stop if approval,
containment, identity, or disposal requirements are unclear.

## Design Artifacts

Deliver a question and estimand synopsis; genotype-treatment-environment matrix;
unit and replication table; control matrix; field or facility map; randomization,
blocking, spatial, season, irrigation, and batch plan; soil and weather metadata
schema; measurement-validity checklist; confounding and pseudoreplication audit;
deviation log; and statistical handoff to `biological-study-statistics`.

## Completion Criteria

Complete only when plot, plant, observational, and analysis units agree; biological
and technical replication are distinct; genotype x environment structure is
estimable; controls, spatial blocking, site-season allocation, soil-weather-
irrigation records, measurement validity, safety boundaries, and confounding
checks are documented.
