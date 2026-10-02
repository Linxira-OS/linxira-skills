---
name: microbiology-experimental-design
description: Use to plan microbial isolate, community, host-associated, or culture-independent studies with explicit strain provenance, independent units, contamination controls, and containment boundaries; not for culture recipes or pathogen optimization.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, clinical, controlled-data]
---

# Microbiology Experimental Design

Plan microbial studies without turning colony, read, field, or repeated assay
counts into false biological replication. This skill does not provide operational
culture conditions, propagation methods, or virulence optimization.

## Design Frame

- Define organism or community, strain or taxon provenance, host or environment,
  biological question, exposure, comparator, endpoint, and target population.
- Identify independent cultures, isolates, hosts, sites, specimens, vessels,
  batches, colonies, aliquots, sequencing libraries, and analysis units.
- State whether isolates are independent biological sources or descendants of one
  source. Colonies from one inoculum are not automatically independent replicates.
- Record passage, storage, thaw, inoculum, collection, extraction, library, plate,
  and instrument batches as provenance rather than hidden narrative.

Reuse `biological-experimental-design`, `biological-study-statistics`, and the
required `wet-lab-experiment-planning` action gate.

## Controls And Validity

- Match negative, blank, process, extraction, contamination, mock-community,
  reference-strain, positive, and host controls to the claimed inference.
- Balance condition across culture, collection, extraction, plate, operator,
  instrument, sequencing, and analysis batch.
- Define growth state, viability, abundance, compositional, functional, genomic,
  or host-response endpoints and what technical failure looks like.
- For culture-independent studies, separate biological absence from detection
  failure and account for biomass, contamination, batch, and compositionality.
- For host-associated studies, preserve host, specimen, microbial, and technical
  hierarchies and avoid treating repeated samples from one host as new hosts.

## Safety And Governance

Require verified identity, biosafety classification, containment, trained staff,
approved SOPs, clinical or environmental permissions, transport, decontamination,
waste, incident, and data controls. Stop when organism identity, authorization, or
containment is unclear. Do not optimize pathogenicity, host range, persistence,
evasion, dissemination, resistance, or environmental release.

## Design Artifacts

Deliver a strain and specimen provenance table; unit and replication hierarchy;
condition and control matrix; contamination-control plan; collection-to-analysis
batch map; endpoint and detection-validity checklist; containment and approval
register; confounding audit; and statistical handoff.

## Completion Criteria

Complete only when biological sources are independent, contamination controls
diagnose the workflow, passage and batch provenance are traceable, detection and
absence are distinguishable, and containment and approval boundaries are explicit.
