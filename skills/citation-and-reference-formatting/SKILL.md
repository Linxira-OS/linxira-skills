---
name: citation-and-reference-formatting
description: Use when selecting, checking, converting, or normalizing scholarly citation formats and reference lists for papers, theses, reports, slide decks, or rebuttals. Covers citation categories, software/data citation, reference-list consistency, style switching, and unresolved metadata markers; use research-manuscript-integrity for truthfulness of claims.
skill_class: guard
load_policy: conditional
risk_tags: []
---

# Citation And Reference Formatting

Treat references as structured records, not decoration. The task is to preserve
source identity, style consistency, and citation purpose without fabricating
metadata.

## Classify The Citation

Before formatting, label each item as one of:

- primary research article
- review or perspective
- preprint
- software
- dataset or database release
- protocol or guideline
- website or public record
- personal or unpublished communication

Different categories need different fields. Software and datasets are not always
well represented by a journal-article template.

## Required Checks

Verify whenever available:

- author or organization name
- title
- year
- venue or publisher
- volume, issue, and page or article number
- DOI, PMID, accession, URL, or version/release
- access date for changing web resources

If metadata is incomplete, keep an explicit marker such as `citation to verify`
or `metadata incomplete`; do not guess the missing field.

## Style Switching

When converting between styles:

- preserve author order and spelling
- preserve title capitalization rules only as the style requires
- preserve DOI and stable identifiers
- preserve software version and dataset release where the source type needs them
- preserve whether the citation is a preprint, article, database, or software

Common style families to support:

- numbered biomedical formats such as Vancouver and AMA
- author-year formats such as APA, Harvard, and many journal house styles
- BibTeX-driven LaTeX workflows
- `biblatex` plus `biber` workflows when the project needs richer source-type
  control than classic BibTeX styles provide
- slide or poster formats that need shortened inline references
- common Chinese academic body formats that keep half-width English bracket
  citations such as `[2]`, `[2,7]`, and `[2-7]`

## Software And Data

For software, keep project name, version, publisher/owner, repository or archive,
and persistent identifier where available. For datasets and databases, keep the
release version, accession, archive, and access date when the content changes.

For LaTeX projects, choose one citation stack deliberately:

- classic `.bib` plus BibTeX when the venue class or legacy template requires it
- `biblatex` plus `biber` when the project needs clearer source categories,
  localized formatting, or more controlled bibliography logic

Do not mix manual ad hoc references with an automated bibliography backend in
the same manuscript unless the template explicitly requires an exception.

Use the bundled `scripts/validate-bibtex.mjs references.bib` before compiling to
detect duplicate keys, unbalanced entries, and missing core fields. It is a
structural preflight, not a replacement for DOI/PMID metadata verification.

## DOI And PMID Metadata

Use `scripts/resolve-reference-metadata.mjs identifiers.json references.json
--confirm-external-metadata` only after the user approves sending DOI/PMID
identifiers to Crossref and PubMed. The resolver sends identifiers only, records
the metadata service used, and refuses to overwrite an existing output.

Use `scripts/csl-json-to-bibtex.mjs references.json references.bib` to turn the
result into a reviewable BibTeX file, then run `validate-bibtex.mjs`. Verify
resolved records against the cited source before treating metadata as final.

## Inline Citation Rules

- Distinguish support, contrast, method source, and background use.
- Use grouped citations only when they truly support the same statement.
- Keep citation style consistent across the whole artifact.
- For Chinese academic body text using numeric references, keep the full
  reference cluster inside one square-bracket pair and use half-width English
  punctuation.
- In slide decks, shorten inline citations only after the full references exist
  in notes, appendix, or a linked bibliography.

## Completion Criteria

- Every reference matches the selected style family.
- Citation categories remain distinguishable after formatting.
- Software, datasets, and web resources keep version/release information.
- Any unresolved metadata is visibly marked instead of invented.

## Citation

```text
Linxira OS. Linxira Skills: citation-and-reference-formatting. Version 0.1.0.
Skill path: skills/citation-and-reference-formatting/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
