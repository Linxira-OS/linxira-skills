---
name: linux-gpu-compute
description: Use when discovering, validating, allocating, diagnosing, or preparing Linux GPU compute hosts for scientific workloads on NVIDIA, AMD, or Intel hardware. Covers hardware detection, driver/runtime boundaries, scheduler-aware GPU use, containers, isolation, lightweight validation, and vendor-skill routing without performing unsafe driver changes by default.
skill_class: workflow
load_policy: conditional
risk_tags: [privileged, remote-compute]
---

# Linux GPU Compute

Detect hardware and host role before recommending a stack. GPU configuration is
vendor-, kernel-, distribution-, container-, and scheduler-specific; do not
apply generic driver fixes to an unknown system.

## Read-Only Discovery

```bash
cat /etc/os-release
uname -r
lspci -nn | rg -i 'vga|3d|display'
lspci -k | rg -A3 -i 'vga|3d|display'
command -v nvidia-smi rocm-smi rocminfo xpu-smi 2>/dev/null
```

Then run only the relevant vendor tool when present:

```bash
nvidia-smi
rocm-smi
rocminfo
xpu-smi discovery
```

Record GPU model/count, driver version, runtime version, visible devices, host
role, scheduler or container runtime, CPU/memory/local scratch, and any
institutional modules or support policy. Do not download models, compile CUDA or
ROCm, or run stress tests as part of discovery.

## Dispatch By Vendor And Host

| Context | Route |
| --- | --- |
| NVIDIA driver/runtime, CUDA, multi-GPU, NCCL, Slurm, or medical AI | Use current NVIDIA documentation and the separately governed NVIDIA vendor package. |
| AMD ROCm/HIP fault diagnosis | Use the AMD vendor package, especially its read-only diagnosis flow where applicable. |
| Intel GPU/XPU or SYCL | Use current Intel documentation and selectively reviewed Intel XPU material. |
| CPU profiling or CPU-bound code | Use `linux-perf` and `performance-patterns` from Intel's MIT performance package when included. |
| Shared HPC cluster | Follow site modules, scheduler, container, and support policy before vendor installation steps. |

Vendor packages are not substitutes for this skill's host classification and
safety boundaries. This skill must not claim their vendor-specific diagnostics
are available unless that package is installed.

## Environments And Containers

Keep framework environments separate from host drivers. Record the exact
framework build, runtime, container image digest, visible-device setting,
resource request, and sample validation result. On managed clusters, use the
site's module/container/scheduler path rather than installing drivers or runtime
components in the home directory.

Before running a workload, confirm:

- The scheduler allocation or local GPU ownership.
- Requested GPU count/model/memory and CPU/memory balance.
- Compatible host driver and user-space runtime.
- Container GPU passthrough or environment activation.
- Writable scratch/output path and storage quota.
- Logging, checkpoint, and output-validation plan.

## Safe Validation

Start with a lightweight vendor discovery command and a framework device query.
Use a small known-safe smoke workload only after the environment and allocation
are confirmed. Check exit status, device visibility, expected precision/runtime,
multi-GPU, network, or scientific result.

## Safety

Require explicit user confirmation before changing drivers, kernels, firmware,
Secure Boot, boot parameters, DKMS modules, GPU persistence settings, scheduler
configuration, or system-wide container runtime. Capture existing versions and
ensure a console/recovery path before changes. Never test on a shared GPU that
is allocated to another user or job.

## Completion Criteria

- Vendor, model, driver/runtime, execution environment, and host role are known.
- The requested workload has an approved allocation or exclusive local device.
- A proportionate validation command succeeds and its result is recorded.
- Any further issue is routed to the appropriate vendor or scheduler procedure
  rather than guessed from incomplete host state.
