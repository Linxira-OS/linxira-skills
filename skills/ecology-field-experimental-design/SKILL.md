---
name: ecology-field-experimental-design
description: Use to plan ecological field experiments and observational studies with explicit sites, plots, transects, sampling frames, dependence, detection, and permit boundaries; not for executable field collection instructions.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, controlled-data]
---

# Ecology Field Experimental Design

Design ecological studies so the sampled system, spatial and temporal scope,
unit of inference, and detection process are explicit. This is planning-only and
does not replace permits, field safety plans, or species-specific collection SOPs.

## Domain Intake

Establish:

- The ecological question, hypotheses, target population, causal or descriptive
  aim, and intended spatial and temporal generalization.
- Study design: experiment, natural experiment, survey, monitoring, or mixed design.
- Sites, landscapes, watersheds, habitats, plots, transects, quadrats, colonies,
  nests, individuals, samples, and repeated visits available.
- Exposure or intervention, comparator, covariates, primary outcomes, observation
  window, seasonal timing, and detection or non-detection process.
- Accessibility, weather, observer, equipment, destructive sampling, transport,
  sample storage, local community, animal welfare, and field safety constraints.
- Required landowner permissions, collection permits, protected-species rules,
  biosecurity, invasive-species controls, and controlled location or occurrence data.

Reuse `biological-experimental-design` for general allocation, controls, units,
and confounding. Reuse `biological-study-statistics` for estimands, power,
missingness, repeated measures, hierarchical models, and dependence diagnostics.

## Sampling Frame And Units

Define the frame from which units can be selected and the unit at each level:

- **Site or landscape unit**: an independently sampled or assigned geographic system.
- **Plot, transect, quadrat, station, nest, colony, or reach**: a lower-level
  sampling or assignment unit with a defined boundary and selection rule.
- **Observational unit**: an individual, species record, count, detection history,
  measurement, specimen, or repeated visit record.
- **Analysis unit**: the unit represented as independent for the intended inference.
- **Biological replicate**: an independent site, plot, transect, population, or
  temporal sampling occasion appropriate to the claim.
- **Technical replicate**: repeated observer pass, sensor reading, laboratory assay,
  image, or subsample from the same field unit.

Document inclusion, exclusion, replacement, and nonresponse rules. Define whether
sites are a sample of a target population or a fixed set of case studies. Do not
count observations within one plot, transect, colony, or site as independent
replicates without representing their nesting.

## Experimental And Observational Structure

For interventions, identify assignment level, treatment spillover, interference,
buffer zones, baseline period, and control condition. For observational studies,
state the exposure definition, sampling design, comparison set, and assumptions
needed for interpretation. Distinguish site-level, plot-level, transect-level,
individual-level, and visit-level questions.

Plan repeated visits and seasonal sampling to separate treatment or exposure from
calendar time, observer, weather, migration, succession, and detectability. If
destructive sampling is required, specify which units are consumed, whether
replacement is valid, and how removal changes remaining population or habitat.

## Controls, Randomization, And Blocking

- Use untreated, reference habitat, before-after, sham, matched, or other controls
  that diagnose the actual ecological comparison.
- Randomize eligible sites, plots, transects, or sampling starts when assignment is
  possible; preserve the seed, constraints, and final geographic allocation.
- Block or match on habitat, elevation, watershed, baseline abundance, accessibility,
  management history, season, observer, or other strong nuisance variables.
- Balance sampling effort, visit order, observer coverage, instrument deployment,
  and time of day across conditions and locations.
- Keep treatment, location, observer, visit, weather, gear, and specimen identifiers
  separate. Blind observers or analysts to condition where feasible.

Do not call convenience selection, alternating locations, or a fixed route random
sampling. Do not place all treatment units in one site, season, observer period,
or habitat patch.

## Dependence And Pseudoreplication Audit

Map spatial neighbors, shared sites, watersheds, colonies, social groups, transects,
and repeated visits. Check for spatial autocorrelation, temporal autocorrelation,
observer dependence, home-range overlap, movement between units, treatment spillover,
and shared environmental shocks. State the spacing, revisit, and clustering logic
that supports the intended analysis; do not invent independence from geographic
distance alone.

Audit for site or plot pseudoreplication, nested samples, repeated detections of the
same individual, reused controls, unequal effort, and treatment aliased with access,
habitat, season, or observer. Redesign or narrow the inference when a nuisance
factor cannot be separated from the ecological contrast.

## Detection, Abundance, And Occupancy

Define the biological state separately from observation. For abundance, record the
counting frame, effort, area, distance or encounter process, zero definition, and
possible double counts. For occupancy, define the site state, repeat-visit history,
closure period, detection opportunities, covariates affecting detection, and what
non-detection means. For presence-only, camera, acoustic, eDNA, or sensor data,
document sampling effort, false positives, contamination or misclassification,
calibration, and reference records.

Predefine observer training, identification keys, instrument checks, weather limits,
missing visits, failed sensors, and specimen identity verification. Technical
replication improves detection or measurement characterization; it does not replace
independent sites or plots.

## Destructive Sampling And Permits

Document the target material, number and level of units affected, collection timing,
non-target impacts, replacement or restoration plan, and chain of custody. Confirm
land access, collecting, protected species, animal handling, export or transport,
indigenous or community permissions, and data-sharing restrictions before work.
Do not disclose sensitive locations for threatened species or culturally restricted
resources. Follow approved field, biosafety, decontamination, and waste procedures.

## Design Artifacts

Deliver a question and estimand synopsis; sampling-frame definition; site-plot-
transect unit hierarchy; replication and revisit table; control, randomization,
blocking, and effort plan; spatial and temporal dependence map; detection and
measurement-validity checklist; destructive-sampling and permit register; controlled-
data plan; confounding and pseudoreplication audit; and statistical handoff to
`biological-study-statistics`.

## Completion Criteria

Complete only when the sampling frame, site/plot/transect units, biological and
technical replication, controls, allocation, effort, detection process, spatial
and temporal dependence, destructive-sampling consequences, permits, ethical and
field-safety boundaries, data controls, and confounding checks support the stated
ecological inference.
