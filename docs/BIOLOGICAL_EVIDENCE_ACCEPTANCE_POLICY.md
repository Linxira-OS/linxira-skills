# Biological Evidence Acceptance Policy

## Current Rule

Eligible biological and medical papers begin with equal baseline treatment. The
library does not assign prior credibility weights from publication language,
author nationality, institution, country, or study location.

These attributes may still matter for:

- search coverage and language-access limitations;
- population, setting, environmental, health-system, or assay applicability;
- prespecified subgroup and heterogeneity analysis;
- conflicts of interest and institutional context when supported by evidence.

They are not substitutes for study-level quality assessment.

## Evidence Required For Claims

When an output is described as literature-grounded or makes a factual conclusion:

1. Preserve a real DOI, PMID, registry ID, accession, or authoritative record.
2. Verify publication identity and current status.
3. Check retractions, withdrawals, corrections, and expressions of concern.
4. Confirm that the source supports the exact claim, quantity, mechanism, or
   method for which it is cited.
5. Keep observations, interpretations, hypotheses, and proposals distinct.
6. Mark missing support as `evidence needed` or `citation to verify` rather than
   filling the gap from model memory.

A valid identifier is necessary but insufficient. A real paper may be miscited,
contradict the claim, use an inapplicable population, or have severe validity
limitations.

## Study-Level Assessment

Confidence changes must be traceable to characteristics such as:

- design and experimental or analysis unit;
- controls, randomization, blinding, allocation, and confounding;
- sample support, attrition, missingness, and multiplicity;
- measurement and assay validity;
- reporting completeness and selective-outcome risk;
- data, code, protocol, and preregistration availability;
- conflicts of interest, corrections, and publication status;
- directness to the target biological or clinical context;
- independent replication and consistency with other credible evidence.

Journal prestige, citation count, search rank, language, and geography do not
replace these checks.

## Status Action Levels

Do not perform a general public-opinion or social-media search for each author.
For papers that support a material conclusion, check only concise, attributable
status sources: the publisher record, DOI/Crossref relations, PubMed publication
types and notices, registry records, and formal institutional or regulatory
findings when one is already identified.

| Status | Default action |
| --- | --- |
| Retracted or withdrawn version | Exclude that version from positive evidentiary support; retain it only when discussing the retraction or research-integrity history. |
| Final formal finding that invalidates specified data, figures, analyses, or conclusions | Exclude only the affected paper, version, result, or claim identified by the finding. |
| Expression of concern, major unresolved correction, or documented ongoing formal investigation | Flag for enhanced verification; do not use as sole support for a material conclusion. |
| Correction with unaffected conclusions | Use the corrected version and record what changed. |
| Informal allegation, social-media post, news commentary, anonymous list, or reputation claim | No automatic evidence action; preserve as an unverified lead only if the task explicitly studies research integrity. |
| No adverse status located | Continue normal study-level assessment; absence of a notice is not proof that the study is valid. |

Publisher and official findings control status decisions. Secondary integrity
databases or post-publication discussion may identify a record to verify, but do
not independently justify exclusion.

## Future Source Actions

Do not hardcode author or institution names inside `SKILL.md` bodies. If a future
official investigation establishes a source problem, record the action in a
separate versioned registry with:

- exact author, institution, paper, journal, or identifier scope;
- authoritative investigation, publisher, regulator, or institutional source;
- source URL, publication date, retrieval date, and immutable snapshot or hash;
- action type: flag, require enhanced verification, exclude a version, or
  exclude a defined set;
- rationale, effective date, reviewer, expiry or review date, and appeal path;
- treatment of unaffected coauthors, papers, institutions, and corrected versions.

Use the narrowest supported action. A finding about one paper, laboratory, author,
or period does not automatically invalidate unrelated work. Retraction and formal
findings are evidence inputs; they do not authorize nationality- or language-wide
penalties.
