# Google Cloud And Vertex Policy

## Decision

`google-cloud-vertex` is the first-party connector contract for Google Cloud and
Vertex AI research execution. It inherits `compute-cloud` and narrows it to the
Google-specific boundaries every future implementation must satisfy.

## Scope

The contract covers:

- project and billing-account confirmation
- region or zone selection and data-location fit
- service-account or user identity confirmation
- quota-sensitive resource selection
- bucket, artifact, and model output destinations
- teardown and continuing-cost ownership

## Non-Goals

- no direct `gcloud` or REST command recipes
- no assumption that a locally configured default project is correct
- no automatic enablement of Google APIs or background services

## Follow-On Work

Any concrete Google Cloud or Vertex connector must inherit this contract and
then define exact resource types, auth bootstrap, bucket layout, log and model
artifact capture, and cleanup behavior.
