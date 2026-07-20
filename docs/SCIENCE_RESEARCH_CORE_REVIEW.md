# Science Research Core Review

> Status: approved first-party umbrella profile for evidence-grounded research
> design across biology, chemistry, physics, and selected medical domains.

## Included Domains

`science-research-core` extends `biology-research-core` and adds:

- biochemistry and molecular biology;
- crop and plant science;
- ecology and field studies;
- animal physiology;
- chemistry;
- physics;
- medical and translational study design.

The shared profile already supplies ideation, literature search, screening,
evidence synthesis, general biological design, statistics, citation verification,
wet-lab governance, manuscript delivery, and artifact validation.

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
