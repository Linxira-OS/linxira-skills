---
name: immunology-experimental-design
description: Use to plan immune-cell, tissue, stimulation, challenge, repertoire, longitudinal-response, or functional immunology studies with explicit donor, compartment, batch, and control structure; not for clinical decisions or executable challenge protocols.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, clinical, controlled-data]
---

# Immunology Experimental Design

Plan immunology studies so donor, specimen, immune compartment, cell population,
stimulation, assay, and time point remain traceable and appropriately nested.

## Design Frame

- Define immune question, population or model, tissue or compartment, baseline
  state, exposure or stimulation, comparator, response window, and endpoint.
- Identify donor or animal, specimen, aliquot, culture, well, cell population,
  event, library, assay batch, and analysis units.
- Preserve paired and longitudinal structure; repeated immune measurements from one
  donor do not create independent donors.
- Balance condition across donor characteristics, collection time, processing delay,
  operator, reagent lot, plate, instrument, acquisition order, and assay batch.

Reuse `animal-physiology-experimental-design` for animal-level studies,
`medical-translational-study-design` for clinical cohorts, and shared statistics.

## Controls And Immune Validity

- Define unstimulated, vehicle, isotype or reference, fluorescence, process,
  viability, positive-response, and assay-specific controls by diagnostic purpose.
- Predefine compartment, cell-population identity, activation state, viability,
  function, cytokine, repertoire, antibody, or memory endpoint and its limitations.
- Distinguish baseline activation, treatment response, handling effects, acute
  stress, infection history, medication, circadian timing, and batch drift.
- Separate percentage, absolute count, intensity, repertoire diversity, and
  functional response claims; one does not automatically imply another.

## Safety And Clinical Boundaries

Require consent, clinical governance, animal approval, biosafety classification,
containment, specimen handling, de-identification, and authorized challenge or
stimulation SOPs. Do not provide pathogen challenge optimization, immune evasion,
clinical diagnosis, treatment selection, or patient-specific advice.

## Design Artifacts

Deliver a donor-compartment-cell-assay hierarchy; condition and control matrix;
collection and processing timeline; plate, reagent, and acquisition batch map;
immune endpoint definitions; longitudinal and paired-analysis handoff; confounding
audit; and ethics, consent, and biosafety register.

## Completion Criteria

Complete only when donor-level replication is preserved, immune compartments and
endpoints are defined, baseline state and batch are controlled, controls diagnose
assay validity, and clinical and biosafety boundaries are documented.
