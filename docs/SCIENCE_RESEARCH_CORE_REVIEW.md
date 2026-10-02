# Science Research Core Review

> Status: approved first-party umbrella profile for evidence-grounded research
> design across biology, chemistry, physics, and selected medical domains.

## Included Domains

`science-research-core` extends `biology-research-core` and adds:

- biochemistry and molecular biology;
- crop and plant science;
- mechanistic plant physiology;
- ecology and field studies;
- aquatic, conservation, and soil biology;
- animal physiology;
- microbiology, cell biology, genetics and genomics, and developmental biology;
- immunology and neuroscience;
- cellular imaging, flow cytometry, and multi-omics study design;
- chemistry;
- physics;
- medical and translational study design.

The shared profile already supplies ideation, literature search, screening,
evidence synthesis, general biological design, statistics, citation verification,
wet-lab governance, manuscript delivery, and artifact validation.

The profile materializes 58 skill directories: 39 inherited from
`biology-research-core` and 19 specialized science-domain leaves.

## Design Boundary

Each domain leaf owns its scientific units, controls, nuisance factors, validity
checks, and domain artifacts. Shared statistical, literature, integrity, web, and
SOP rules are not duplicated. All leaves are planning or review workflows.

- Chemistry does not generate executable synthesis, purification, scale-up, or
  hazardous operating parameters.
- Physics does not generate apparatus assembly, energization, alignment, radiation,
  pressure, cryogen, laser, or other hazardous operating procedures.
- Crop and ecology leaves do not authorize release, collection, transport, or
  handling of regulated organisms or sensitive locations.
- Microbiology, cellular, immunology, imaging, and multi-omics leaves do not supply
  executable culture, challenge, manipulation, sorting, or instrument procedures.
- Genetics and developmental biology leaves do not make clinical, reproductive,
  or embryo-use decisions.
- Aquatic, conservation, and soil leaves do not authorize collection, vessel or
  diving operations, species management, habitat alteration, or sensitive-location
  disclosure.
- Neuroscience does not authorize stimulation, lesion, implant, exposure, sedation,
  or patient-specific procedures.
- Animal physiology does not authorize animal work or provide veterinary treatment.
- Medical/translational design does not provide diagnosis, treatment, or patient
  decisions.

## Evidence And Sources

All domains use the equal-baseline evidence policy in
`BIOLOGICAL_EVIDENCE_ACCEPTANCE_POLICY.md`: language, country, author, institution,
and study location do not create automatic credibility weights. Specific source
status actions require authoritative, versioned evidence.

The current domain implementation is first-party. External candidates are recorded
in `docs/SOURCES.md` for selective future review; no upstream body is copied into
this profile.

## Routing

```text
research router
  -> life-sciences, chemistry, physics, or medical index
    -> exact domain experimental-design leaf
```
