# Open Design Source Review

> Status: reviewed as a candidate source, not indexed or packaged. Any future
> inclusion requires a per-skill provenance, dependency, and action-risk gate.

## Reviewed Revision

- Repository: `nexu-io/open-design`
- Revision: `188ae72f8eed8c53634602635ec50ed5f85a71ac`
- Root license: Apache-2.0
- Review date: 2026-07-17

The tree contains 492 `SKILL.md` paths across first-party skills, design
templates, official examples and atoms, community packages, specification
examples, a contributor helper, and a test fixture. At least 113 names occur in
both `design-templates/` and `plugins/_official/examples/`; path count therefore
does not represent 492 independent skills. The tree also contains 86 license
files and no root `NOTICE` file.

## Decision

| Class | Decision | Reason |
| --- | --- | --- |
| Official atoms | Adapt candidates | Small operations such as critique, diff review, direction selection, handoff, rewrite planning, and token mapping may fill focused gaps after body-level review. |
| General design workflows | Adapt candidates | Design brief, design review, reference contracts, accessibility guidance, and writing guidance overlap Linxira delivery needs but must be reconciled with first-party policies. |
| Design systems and examples | Reference only | Duplicate paths, embedded examples, and directory-local license evidence require one provenance decision per selected body and asset set. |
| `od-contribute` | Reject for packaging | It authenticates with GitHub, creates forks, issues, branches, pushes, and PRs. Those account-bound external writes are outside a design-reference profile. |
| API, browser, deployment, and account skills | Reject by default | Paid APIs, data upload, browser state, local execution, GitHub writes, Figma, Vercel, Gmail, Linear, and Notion require explicit contracts that this source review does not establish. |

No Open Design body is approved for direct redistribution by this review. The
Apache-2.0 root license is necessary evidence, but it does not replace checking
the selected directory's local license, references, scripts, assets, external
services, and attribution before materialization.

## Candidate Order

Review small, general operations before broad style or generation bodies:

1. `plugins/_official/atoms/critique-theater`
2. `plugins/_official/atoms/diff-review`
3. `plugins/_official/atoms/direction-picker`
4. `plugins/_official/atoms/handoff`
5. `plugins/_official/atoms/rewrite-plan`
6. `plugins/_official/atoms/token-map`
7. `skills/design-brief`
8. `skills/design-review`
9. `skills/reference-design-contract`
10. `skills/web-design-guidelines`

Each candidate still needs its body hash, complete sibling-file inventory,
license evidence, overlap analysis, and a lifecycle fixture. Candidates that
execute builds, patch files, import code, call a service, or alter external state
also need the corresponding contract or guard before action.

## Routing Shape

A future adapted selection should use the existing three-level runtime shape:

```text
design-delivery router
  -> design-review index
    -> exact adapted leaf skill
```

The top-level router exposes compact descriptors only. The index chooses one
canonical leaf and does not concatenate duplicate template/example bodies. A
leaf that governs a tool or external action must be `required` at its action
gate under `docs/SKILL_LOADING_POLICY.md`.

## Re-entry Gate

Before adding a source track or first-party adaptation:

1. Pin one upstream path and revision and record its body hash.
2. Inventory all referenced scripts, templates, assets, fonts, URLs, and local
   license files.
3. Resolve duplicate paths and select one canonical upstream identity.
4. Classify account, paid API, data upload, browser, deployment, and local
   execution boundaries.
5. Add adapted input, output, verification, and user-confirmation contracts.
6. Add routing and install/uninstall lifecycle tests before packaging.
