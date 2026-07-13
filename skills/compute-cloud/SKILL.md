---
name: compute-cloud
description: Use before creating, resizing, starting, stopping, scheduling, or deleting remote compute for research, including SSH hosts, cloud VMs, GPU instances, managed notebooks, and HPC allocations. Defines approval, cost, data, credential, and teardown requirements.
skill_class: contract
load_policy: required
risk_tags: [account-bound, expensive, privileged, remote-compute]
---

# Compute Cloud Contract

Remote compute is an external state change with cost, credential, data, and
cleanup consequences. Use this contract before provisioning or modifying cloud
instances, GPU hosts, managed notebooks, batch jobs, schedulers, or remote
storage paths for research work.

## Preflight Facts

Establish all of the following before launch or mutation:

1. Provider or site: cloud vendor, institutional cluster, managed notebook, or
   SSH-accessible host.
2. Intended workload: software stack, runtime, GPU or CPU need, memory, storage,
   wall time, and expected outputs.
3. Cost boundary: budget owner, billing account or project, region, instance
   class, expected duration, and stop condition.
4. Data boundary: source, destination, retention, encryption, and whether
   controlled, unpublished, or personal data is involved.
5. Credential boundary: which identity is allowed, how it is supplied, and what
   must never be stored in workspace files, logs, or provenance.

Do not infer a billing project, region, instance family, or destructive cleanup
policy from convenience defaults.

## Approval Gates

Require explicit user approval before:

- creating or cloning a remote compute resource
- attaching GPUs, large disks, public IPs, snapshots, or premium storage
- changing instance size, scheduler partition, or autoscaling behavior
- transferring controlled or unpublished data to a remote target
- deleting, terminating, or releasing a resource that may contain outputs

Approval must name the provider or cluster, account or project, region or site,
resource class, maximum duration or stop condition, and intended data scope.

## Provisioning Rules

- Prefer the smallest resource that can plausibly satisfy the workload.
- Record region, image or container, hardware type, disk size, scheduler queue,
  and quota assumptions before launch.
- Distinguish login, head, notebook, batch, and compute nodes. Do not run heavy
  work on a login node because it is reachable by SSH.
- Prefer immutable or versioned environments: container image digest, explicit
  package list, or pinned module stack.
- Keep bootstrap steps idempotent and log only non-secret configuration.

## Credentials And Access

- Use approved provider auth flows, OS credential stores, or user-managed SSH
  keys. Do not ask for private-key content, long-lived tokens, or pasted cloud
  secrets in chat.
- Keep credentials out of shell history, workspace files, manifests, and test
  fixtures.
- Confirm the remote identity after connection and before any write, launch, or
  deletion action.

## Data Transfer And Storage

- State exactly what data will move, where it will land, and how it will be
  verified after transfer.
- Use checksums, manifests, or scheduler-visible artifact paths for important
  scientific inputs and outputs.
- Treat cloud object storage, shared scratch, and ephemeral disks differently.
  Scratch or instance-local disks are not archival storage.
- Do not leave controlled data on disposable resources after the approved task
  ends.

## Runtime And Monitoring

- Record the launch or job identifier, command or workflow entry point, log
  destination, expected completion signal, and recovery path.
- Monitor cost and resource use with provider or scheduler-native signals rather
  than guessing from wall-clock time alone.
- Stop or scale down idle resources as soon as the approved workload ends.

## Teardown And Completion

A remote compute task is complete only when:

- outputs are copied to the approved durable destination and verified
- required logs, manifests, and provenance are retained
- temporary credentials, ports, and remote sessions are closed
- the remote resource is explicitly kept or explicitly torn down
- any continuing cost has an identified owner and reason

Never claim completion while a chargeable or stateful remote resource is still
running unintentionally.
