# Google Workspace OAuth Policy

## Decision

`google-workspace-oauth` is the first-party contract for Google Drive, Docs,
and Slides integrations. It does not implement one SDK or login flow. Instead,
it defines the boundaries every future Google connector must satisfy.

## Scope

The contract covers:

- minimum OAuth scope selection
- account identity confirmation
- read and write verification
- export and fidelity disclosure
- token storage and log exclusion
- remote share, move, and deletion approval gates

## Non-Goals

- no browser automation fallback for Google account flows
- no token capture in chat or workspace files
- no assumption that examples from other runtimes are portable here

## Follow-On Work

Any concrete Google Drive, Docs, or Slides connector must inherit this contract
and then add client type, redirect or consent flow, token refresh behavior,
document export formats, and workspace-specific storage choices.
