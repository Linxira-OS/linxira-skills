---
name: google-cloud-vertex
description: Use before launching, modifying, or deleting Google Cloud or Vertex AI resources for research. Defines project, region, billing, quota, service account, storage, and teardown requirements.
skill_class: contract
load_policy: required
risk_tags: [account-bound, controlled-data, expensive, privileged, remote-compute]
---

# Google Cloud And Vertex Contract

Use this contract before creating or mutating Google Cloud or Vertex AI
resources for research. It specializes `compute-cloud` for Google project,
billing, quota, service identity, and storage boundaries.

## Preflight

Before launch or change, establish:

1. Google Cloud project ID and the billing account that will be charged.
2. Region or zone, and the reason that location is allowed for the data.
3. Resource type: Vertex training job, notebook, endpoint, VM, batch job,
   bucket, or another named service.
4. Service account or user identity, required roles, and secret boundary.
5. Source and destination buckets, local artifacts, retention, and teardown.

Do not infer a default project, region, or service account from local CLI state
when the user has not explicitly approved it.

## Approval Gates

Require explicit user approval before:

- enabling billable Google APIs for a project
- creating or resizing a VM, notebook, training job, endpoint, or accelerator
- attaching public IPs, large disks, or premium storage
- moving controlled or unpublished data into Google-managed storage
- deleting a project-scoped artifact or shutting down an endpoint that may still
  serve traffic

Approval must name the project, region or zone, resource class, expected cost
or stop condition, and data scope.

## Identity And Secrets

- Use approved Google auth flows or service-account binding methods.
- Do not request pasted service-account JSON, refresh tokens, or raw private
  keys in chat.
- Keep credentials out of the workspace, manifests, test fixtures, package
  payloads, and logs.
- Confirm the effective project and identity before any write or launch action.

## Storage And Data

- State exactly which bucket, dataset, model artifact, or output path will be
  used.
- Verify region compatibility between compute and storage.
- Record checksum, URI, or versioned object identifier for important artifacts.
- Do not leave controlled data in temporary buckets, notebook homes, or endpoint
  caches after the approved task ends.

## Completion

A Google Cloud or Vertex task is complete only when the project, region,
identity, resource ID, output location, and teardown state are all known, and
any continuing cost has a named owner and explicit reason.
