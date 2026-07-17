# v0.1.0 Release Draft

## Summary

First public package candidate for Linxira Skills.

This release introduces the cross-runtime `linxira-skills` initializer and the
first reviewed profiles for engineering, systems, research integrity,
bioinformatics, and academic communication work:

- `core`
- `bioinformatics-core`
- `research-communication-core`

## Included

- 10 first-party core skills for software verification, manuscript integrity,
  Linux operations, transfer, storage/networking, and remote compute.
- 10 additional first-party bioinformatics skills for analysis routing,
  reproducibility, bulk RNA-seq, and HPC execution boundaries.
- 11 first-party academic communication skills for manuscript structure,
  reference formatting, Chinese body formatting, DOCX/LaTeX delivery,
  figure/table review, image-evidence boundaries, and slide deck generation.
- Corrected adaptations informed by pinned MIT `bioSkills` paths without
  redistributing upstream skill bodies.
- retained review records for future AlphaFold DB, Google, browser, GPU, and
  scientific-AI profiles; these are not part of the packaged payload.

## Validation

- local first-party metadata audit passed
- local profile lifecycle tests passed
- generated route-reference validation passed
- local packed tarball install smoke test passed
- packed artifact allowlist check passed
- GitHub Actions is configured for Node 20/22/24 on Ubuntu, Windows, and macOS;
  the current candidate must pass that matrix before publication

## Third-Party Boundary

- unreviewed `awesome-bio-agent-skills` content is not part of the package
- externally cited `html-anything` templates remain source-only
- the previous `life-sciences-core` and `html-reporting-core` upstream-body
  profiles are retained as non-installable review records
- donor content from the previous repository is used for audit and rewrite
  requirements, not wholesale redistribution

## Known Limits

- `agent-browser` is defined as a valid OpenCode-compatible candidate, but it is
  non-preferred in the current Web UI path until stateful turn-to-turn browser
  handoff is validated
- Google Workspace and Google Cloud / Vertex are connector contracts, not full
  implementation bundles
- AlphaFold DB public access is reviewed as a connector profile, not a separate
  packaged payload
- FastQC, MultiQC, Salmon, tximport, DESeq2, and fgsea still require a small
  public-data executable fixture before npm publication
