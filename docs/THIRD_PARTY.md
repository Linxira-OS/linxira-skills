# Third-Party Provenance And Attribution

## Policy

Every non-original skill must be traceable to its original source. Aggregator
repositories are discovery indexes, not sufficient attribution when the
original project can be identified.

Do not assume a repository-level license automatically covers nested vendored
projects. Review the original repository and any license files inside the skill
directory.

## Required Source Record

Each reviewed skill must record:

```yaml
source:
  repository: owner/repository
  url: https://github.com/owner/repository
  path: path/to/skill
  revision: full-commit-sha
  retrieved: YYYY-MM-DD
  license: SPDX-or-exact-license-name
  authors: original author or project
  discovered_via: optional aggregator repository and path
adaptation:
  status: unmodified | adapted | merged | inspired
  modified_by: Linxira Skills contributors
  summary:
    - concrete change
```

The canonical source revision must be immutable. Branch names alone are not
sufficient for a released package.

## Adaptation Labels

- `unmodified`: byte-equivalent except allowed packaging metadata.
- `adapted`: retains substantial original structure or text with documented
  corrections, additions, or format changes.
- `merged`: combines substantial material from multiple named sources.
- `inspired`: newly written implementation based on ideas, with no substantial
  copied expression; still cite influential sources when useful.

Do not use `original` for rewritten material that still substantially follows a
third-party skill.

## Repository-Level Files

The project must maintain:

- `THIRD_PARTY_NOTICES.md` in every released package.
- A machine-readable source registry.
- Copies of licenses when the license requires distribution.
- A README section listing major upstream projects and the nature of changes.
- Per-skill provenance for adapted and merged skills.

## Modification Summary

Avoid vague statements such as "optimized" or "improved." Record concrete
changes, for example:

- Corrected an obsolete command-line flag.
- Added genome-build and coordinate-system requirements.
- Added input schema and output validation.
- Added browser login and paid-resource confirmation gates.
- Split Linux execution into an external package dependency.
- Merged overlapping Scanpy and Seurat routing guidance.
- Replaced an untested shell parser with a maintained format library.

## Aggregated Sources

For a skill found in `awesome-bio-agent-skills`:

1. Record the aggregator path as `discovered_via`.
2. Identify the original source named by its index or directory namespace.
3. Compare the aggregated copy with the original revision when possible.
4. Use the original repository's license and attribution.
5. Quarantine the skill if the original source or license cannot be resolved.

## License Decisions

Possible decisions:

- `include`: redistribution and modification requirements are compatible.
- `adapt-with-notice`: permitted with attribution, notice, or license copy.
- `reference-only`: useful but not redistributed; link or installer fetches it
  under the user's control where legally and technically appropriate.
- `reject`: incompatible, unclear, missing, or operationally unsafe.

License review is a release gate, not a final cleanup task.

## Mixed-License Repositories

When documentation and code use different licenses, apply the license according
to file type rather than assigning one repository-wide label. For example,
`NVIDIA/skills` uses CC-BY-4.0 for skills/documentation and Apache-2.0 for source
code. An adapted `SKILL.md` and a copied helper script therefore have different
notice obligations even when they come from the same skill directory.
