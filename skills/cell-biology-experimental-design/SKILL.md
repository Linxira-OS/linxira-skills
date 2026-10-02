---
name: cell-biology-experimental-design
description: Use to plan cell-line, primary-cell, organoid, perturbation, localization, or cell-state experiments with explicit donor, clone, plate, well, field, and cell hierarchies; not for executable culture or manipulation protocols.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, clinical, controlled-data]
---

# Cell Biology Experimental Design

Design cellular studies so donor, line, clone, organoid, culture, well, image
field, and individual cell are not confused as equivalent replicates.

## Unit And Perturbation Plan

- Define cell source, donor, line, clone, passage window, state, perturbation,
  comparator, endpoint, time course, and intended level of inference.
- Identify the independently perturbed unit and nest donor, culture, plate, well,
  organoid, field, cell, assay, and repeated readout beneath it.
- Treat many cells or image fields from one well as subsampling unless the design
  explicitly models that hierarchy.
- Balance perturbations across donors, clones, plates, rows, columns, days,
  operators, instruments, and processing order.

Reuse `biological-experimental-design` for general allocation,
`biological-study-statistics` for hierarchical analysis, and
`wet-lab-experiment-planning` before operational work.

## Controls And Measurement Validity

- Use untreated, vehicle, mock, delivery, negative, positive, rescue, matched-
  background, and assay controls according to the causal claim.
- Predefine authentication, contamination status, passage, confluence, viability,
  differentiation or activation state, and acceptable deviations.
- State whether endpoints represent abundance, localization, morphology, dynamics,
  viability, function, interaction, or molecular state.
- Separate segmentation or gating failure from biological change and require an
  orthogonal assay when one readout cannot distinguish competing mechanisms.
- Audit edge effects, density, evaporation, substrate, media lot, plate position,
  operator, acquisition order, and selective field choice.

## Safety And Data Boundaries

Require current authorization and SOPs for human or animal material, primary
cells, organoids, genetic manipulation, infectious material, restricted chemicals,
controlled clinical data, containment, waste, and consent limits. Do not provide
executable culture, transfection, editing, infection, selection, or differentiation
parameters.

## Design Artifacts

Deliver a donor-line-clone-culture-well-cell hierarchy; perturbation and control
matrix; plate and batch allocation map; provenance and authentication checklist;
endpoint-validity plan; image or cytometry handoff; confounding and
pseudoreplication audit; approval register; and statistical handoff.

## Completion Criteria

Complete only when the independent perturbation unit is explicit, donor and clone
variation are represented, plate and passage effects are separable, controls test
the claimed mechanism, and safety and consent limits are documented.
