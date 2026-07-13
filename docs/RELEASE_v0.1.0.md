# v0.1.0 Release Draft

## Summary

First public package candidate for Linxira Science Skills.

This release introduces the cross-runtime `linxira-skills` initializer and the
first reviewed profiles for scientific work:

- `core`
- `life-sciences-core`
- `html-reporting-core`

## Included

- 21 first-party skills for scientific software, manuscript integrity, web and
  cloud safety, Linux/HPC operations, and AI execution boundaries.
- 4 reviewed MIT `bioSkills` bodies in `life-sciences-core`.
- 3 reviewed Apache-2.0 `html-anything` bodies in `html-reporting-core`.
- reviewed connector contracts for AlphaFold DB public access, Google Workspace
  OAuth, Google Cloud / Vertex, browser safety, compute cloud, and scientific AI.

## Validation

- local first-party metadata audit passed
- local profile lifecycle tests passed
- local packed tarball install smoke test passed
- `npm pack --dry-run` package-content check passed
- GitHub Actions matrix passed on Ubuntu, Windows, and macOS

## Third-Party Boundary

- unreviewed `awesome-bio-agent-skills` content is not part of the package
- externally cited `html-anything` templates remain source-only
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
