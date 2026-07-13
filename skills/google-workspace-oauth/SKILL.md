---
name: google-workspace-oauth
description: Use before reading, creating, editing, exporting, or sharing Google Drive, Docs, or Slides content through OAuth-backed APIs. Defines minimum scopes, account confirmation, write verification, and token handling.
skill_class: contract
load_policy: required
risk_tags: [account-bound, controlled-data, destructive]
---

# Google Workspace OAuth Contract

Google Drive, Docs, and Slides actions change remote state under a named user or
service identity. Use this contract before any OAuth-based read, write,
export, share, or metadata operation.

## Preflight

Before authorization or API use, establish:

1. Target service: Drive, Docs, Slides, or a combination.
2. Actor: named user account or approved service account.
3. Intended action: read, create, update, export, move, share, or delete.
4. Data class: public, private, controlled, unpublished, or personal.
5. Artifact destination: Drive location, local export path, and retention.

Do not treat a Google document request as a generic office-file task. Remote
identity, scopes, and external write effects must stay visible.

## Scope Discipline

- Request the narrowest OAuth scopes that satisfy the task.
- Prefer file-scoped or read-only scopes when the user only needs inspection or
  export.
- Escalate to write scopes only for an explicitly approved create or edit task.
- Confirm any sharing or permission-changing scope separately from document
  editing.

## Account And Consent

- Identify the target Google account before consent and again before any write.
- The user authenticates directly. Do not ask for passwords, refresh tokens,
  cookies, or OAuth authorization codes in chat.
- Store tokens only in an approved credential store or other user-approved
  secret location, never in the workspace, test fixtures, package payload,
  provenance manifest, or logs.

## Read And Write Verification

- For reads, record document ID, title, owner or target identity, access date,
  and export format.
- For writes, confirm the exact destination folder, document, or presentation
  before mutation.
- After a write, read the remote object back or verify returned revision or file
  metadata before claiming success.
- For exports, disclose the output format and any fidelity loss relative to the
  native Google document.

## Sharing, Deletion, And Publication

Require explicit approval before:

- changing sharing settings or link visibility
- moving a file between Drive locations with different access policies
- deleting, overwriting, or replacing an existing remote object
- sending controlled or unpublished content to a shared Google Workspace target

Summarize the external effect with the final document ID or file ID after the
operation completes.

## Completion

A Google Workspace task is complete only when the target identity, scopes,
remote object, resulting revision or export, and local token-handling location
are all known. If any of these remain uncertain, do not report the remote write
as complete.
