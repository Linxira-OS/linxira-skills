# Compute Cloud Policy

## Decision

`compute-cloud` is the first-party contract for remote research execution across
cloud providers, managed notebooks, SSH-accessible GPU hosts, and institutional
HPC systems. It does not encode one vendor's CLI. Instead, it defines the gates
every future connector must satisfy.

## Scope

The contract covers:

- resource creation, resizing, and termination
- billing project and cost boundaries
- credential handling and account identity
- remote data transfer, retention, and verification
- scheduler and remote-session handoff
- teardown and continuing-cost ownership

It complements existing Linux and HPC skills:

- `linux-remote-access` covers connection mechanics and SSH safety
- `linux-file-transfer` covers transfer methods and verification
- `hpc-bioinformatics-operations` covers scheduler-aware scientific execution
- `compute-cloud` decides when those actions are allowed in the first place

## Non-Goals

- It does not define Google, Azure, AWS, Modal, or OpenStack commands.
- It does not replace provider-specific quota, IAM, or networking docs.
- It does not authorize data movement or remote launch without explicit user
  approval naming the provider, account, region or site, resource class, and
  stop condition.

## Follow-On Work

Provider or site connectors such as `CON-004` must inherit this contract and
then add provider-specific inputs: project, zone, billing, quota source,
approved image, network path, and cleanup method. Remote browser or web tasks
remain governed separately by `research-web`.
