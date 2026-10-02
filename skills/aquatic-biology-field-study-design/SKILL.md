---
name: aquatic-biology-field-study-design
description: Use to plan marine and freshwater field studies with explicit station, reach, depth, water-mass, visit, hydrological dependence, detection, and permit structure; not for executable collection or vessel operations.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, controlled-data]
---

# Aquatic Biology Field Study Design

Plan aquatic studies around hydrological connectivity, water movement, depth,
season, and the platform used to observe the system.

## Sampling Frame And Units

- Define marine, estuarine, riverine, lake, wetland, groundwater, or experimental
  system; target population; spatial extent; season; depth; and response window.
- Identify basin, watershed, reach, station, transect, depth, water mass, visit,
  tow or deployment, specimen, subsample, and analysis units.
- Treat depths at one station, repeated grabs, technical filters, and repeated
  instrument readings as nested unless they represent the intended independent unit.
- Record tide, flow, discharge, stratification, salinity, temperature, weather,
  mixing, residence time, connectivity, and upstream or downstream influence.

Reuse `ecology-field-experimental-design` for general sampling and detection and
`biological-study-statistics` for spatial-temporal dependence.

## Allocation And Validity

- Balance condition across station order, vessel or platform, crew, gear, sensor,
  depth, time of day, tide or flow state, preservation, laboratory batch, and season.
- Define reference sites, upstream-downstream or before-after comparisons, blanks,
  field controls, calibration checks, and contamination controls.
- Separate biological absence from failed detection and account for transport,
  eDNA or specimen contamination, unequal effort, and hydrological non-independence.
- Do not generalize from one water body, season, depth, or event without a design
  representing that scope.

## Permits And Safety

Require access, collection, protected-species, animal, biosecurity, vessel,
diving, export, transport, community, and controlled-location permissions as
applicable. Use approved field and decontamination SOPs. Do not disclose sensitive
locations or provide operational vessel, diving, capture, or hazardous sampling
instructions.

## Design Artifacts

Deliver a hydrological sampling frame; basin-station-depth-visit unit hierarchy;
station and temporal allocation map; environmental metadata schema; effort,
detection, calibration, and contamination plan; connectivity and dependence map;
permit register; confounding audit; and statistical handoff.

## Completion Criteria

Complete only when hydrological dependence, depth and temporal structure, platform
effects, detection, contamination, effort, permits, and inference limits are explicit.
