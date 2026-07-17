# Kami Source Review

> Status: reviewed as an implementation reference and first-party adaptation
> source. Direct packaging is not approved.

## Reviewed Revision

- Repository: `tw93/kami`
- Revision: `f97bfc9ef83626edb863f6e42632067047a23601`
- Root license: MIT
- Review date: 2026-07-17

The repository exposes one large `kami` skill, a cheatsheet, reference material,
build and packaging scripts, HTML/Marp/Python templates, diagram templates,
demos, and font assets. The same skill is mirrored under
`plugins/kami/skills/kami/`. The root `SKILL.md` is about 42 KB, so treating it
as a compact leaf would violate this repository's token-aware loading model.

## Decision

| Surface | Decision | Reason |
| --- | --- | --- |
| Editorial workflow principles | Adapt | Source checks, material checks, explicit output contracts, density checks, and artifact verification fit the first-party academic delivery chain. |
| Document and slide templates | Reference | Useful implementation examples, but direct use depends on sibling templates, scripts, fonts, WeasyPrint, Marp, or Python tooling. |
| Diagram selection guidance | Adapt selectively | The chart and diagram decision rules are useful when narrowed to scientific and academic evidence requirements. |
| Full `kami` skill | Reject for direct packaging | It is monolithic, duplicates plugin content, assumes its own directory layout and toolchain, and performs a daily network update check. |
| Font bundle | Reject for direct packaging | Font files carry separate terms and large binary payloads; the skill itself notes commercial Chinese fonts and package exclusions. |
| `html-anything` `doc-kami-parchment` | Reference only | It declares Kami as an example source. The Apache-2.0 downstream body does not remove the need to record this upstream inspiration and review independently. |

The MIT license permits adaptation with attribution, but license compatibility
does not make the complete runtime an appropriate flattened skill payload.
Linxira should preserve its existing Pandoc, LibreOffice, XeLaTeX, BibTeX,
Biber, and PPTX contracts instead of introducing a second artifact runtime.

## Adaptation Boundary

Useful concepts should enter first-party skills as narrowly scoped behavior:

- Verify current facts from primary sources before making publication claims.
- Require real logos, screenshots, figures, and data where the subject depends
  on them; mark missing material instead of fabricating it.
- Lock language, artifact type, length, visual checks, and verification command
  before generation.
- Render and inspect output artifacts rather than reporting success from source
  generation alone.
- Keep diagram choice tied to data shape and evidence, not decoration.

Do not copy the warm-parchment visual system as a universal default. It is a
specific design language, while this library must support journal, institution,
conference, and user-provided style contracts.

## Routing Shape

Any adapted behavior belongs under existing first-party delivery routes:

```text
research-communication router
  -> artifact-delivery index
    -> exact document, presentation, or evidence leaf
```

General design heuristics remain `conditional`. Toolchain and artifact
verification contracts become `required` immediately before rendering or a
completion claim. The full upstream body must not be loaded as a parallel router.

## Re-entry Gate

Direct source-track consideration would require:

1. Split the monolithic body into independently routable leaves.
2. Inventory and hash every required template, script, reference, and asset.
3. Remove or explicitly gate the network update check.
4. Resolve each font's redistribution terms and package-size impact.
5. Map WeasyPrint, Marp, Python, and browser verification to supported runtime
   contracts on Windows, Ubuntu, and Arch-family environments.
6. Add artifact and lifecycle tests before exposing an installable profile.
