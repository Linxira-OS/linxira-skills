# HTML Reporting Core Review

> Status: reviewed but not packaged. The selected upstream bodies need stronger
> input/output, accessibility, CDN-approval, and asset contracts before release.

## Decision

`profiles/html-reporting-core.json` defines a retained review record. It
extends `core` with three self-contained, Apache-2.0
`html-anything` skill bodies at revision
`aea749837d780f1da6261f2ed777d7e107231f5f`:

| Skill | Scope | Loading and action boundary |
| --- | --- | --- |
| `dashboard` | Local operational dashboard layout. | `conditional`; use only supplied data. |
| `data-report` | CSV, Excel, or JSON report layout with KPI cards, tables, and charts. | `required`; use supplied data, do not fabricate conclusions, and ask before relying on a Chart.js/ECharts CDN. |
| `docs-page` | Local technical-documentation layout. | `conditional`; no service or account interaction. |

The profile contains only the hash-pinned `SKILL.md` bodies. Its selected
guides do not rely on sibling assets. The root Apache-2.0 notice must accompany
any future payload materialization.

## Full Track Classification

The catalog schema v2 records a declared `ExampleSource` for every skill that
has one. At the pinned revision:

- 81 total templates have frontmatter and body hashes.
- 22 templates declare an external example source. They remain source-only;
  their exact URLs and labels are available in `catalog/source-skills.json`.
- `waitlist-page` is excluded because its email-capture form creates an
  external-write contract.
- 3 templates are reviewed for the optional profile above.
- 55 remaining unreferenced templates are still research-only. Absence of an
  `ExampleSource` is not a redistribution approval.

The external-reference group includes templates derived from or styled after
third-party content such as `lijigang/ljg-skills`, `guizang-ppt-skill`,
`open-slide`, Replit Slides, `kami`, `baoyu-skills`, and Hyperframes. None may
enter an npm payload without separate provenance and license review.

## Deferred Templates

`experiment-readout` and `exec-briefing-memo` have useful research-reporting
structures, but their skills point to sibling HTML assets that are not yet
cataloged or reviewed. They are deliberately excluded instead of publishing a
broken partial template. Future review must inventory every referenced asset,
hash it, inspect embedded fonts/scripts/URLs, and decide whether it belongs in
the payload.

## Packaging Gate

The three hashes remain pinned for review, but the payload builder excludes the
profile and CLI installation rejects its name. Re-entry requires adapted bodies,
asset/CDN review, and a new lifecycle fixture.
