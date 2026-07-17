# Light Skills Source Review

> Status: reviewed as a reference source. No upstream body or script is
> packaged; selected concepts are implemented through clean-room first-party
> biology skills.

## Reviewed Revision

- Repository: `Light0305/Light-skills`
- Default branch: `master`
- Revision: `6b44f57d1274eb38a6c79dc29c2d21e5e0a225a9`
- Root license: MIT, copyright 2026 Light0305
- Review date: 2026-07-17

The repository contains useful research workflow material, but most skills are
coupled to a 13-stage Light workflow, shared Python contracts, checkpoint state,
templates, scripts, and persistent registries. Importing one `SKILL.md` would not
preserve its execution contract.

## Classification

| Skill | Decision | Reason |
| --- | --- | --- |
| `light-citation` | Direct candidate, not selected | Strong existence, identity, publication-status, and claim-support checks, but the current Linxira citation and integrity skills already own this boundary. |
| `light-literature-search` | Clean-room adapt | Useful query logging, source coverage, citation chasing, and update-search concepts; remove Light stage coupling and do not copy uncertain derived code. |
| `light-research-plan` | Clean-room adapt | Estimand, preregistration, power, falsifier, and failure-tree concepts are useful, but the body is computational-research centered. |
| `light-research-ethics` | Reference | Useful authority and consent lifecycle; it cannot stand in for institution-, jurisdiction-, IRB-, or IACUC-specific review. |
| `light-paper-writing`, `light-review-rebuttal`, `light-consistency`, `light-venue-matching` | Reference | Valuable publication checks but substantially overlap existing first-party delivery and integrity contracts. |
| `light-idea-generation`, `light-idea-critique` | Reference | Retain gap, competing-explanation, and discriminating-test concepts; reject numeric novelty and top-conference verdicts as biology validity gates. |
| `light-result-analysis` | Reject as biology statistics | Fixed automatic-test and evidence-grade rules do not cover biological units, nesting, repeated measures, censoring, batches, or multiplicity families. |
| `light-file-reading` | Reject | Generic document tooling with no distinct biology capability. |

## Provenance Gate

The root MIT license does not close all file-level provenance questions:

- `light-literature-search/scripts/domain_map.py` identifies a borrowed advisory
  from `imbad0202/academic-research-skills`.
- idea-critique files identify borrowing from that project's
  `academic-paper-reviewer`.
- the identified upstream uses CC BY-NC 4.0, which is not suitable for an
  unrestricted npm adaptation without resolving the copied expression.
- other files mention mechanisms from external projects, an unidentified
  `paper-tracker`, or scripts ported from a missing v1 history.

Consequently, Linxira records the source and concepts but does not copy Light
bodies, scripts, templates, or assets. Any future direct candidate needs a full
sibling inventory, body and asset hashes, original-source tracing, and retained
notices.

## External Action Boundary

Light search and citation workflows can contact Crossref, DataCite, OpenAlex,
arXiv, PubMed, Europe PMC, DOAJ, Semantic Scholar, and Unpaywall. Restricted
sources such as CNKI, Wanfang, Scopus, JCR, and institutional databases require
lawful user access. Manuscript text must not be sent to online language services
without explicit approval, and unpublished ideas must not be exposed through
venue-search queries.

In Linxira, all such calls route through `research-web`; account use, downloads,
query privacy, terms, rate limits, and evidence provenance remain mandatory.
