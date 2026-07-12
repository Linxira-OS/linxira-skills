---
name: linux-troubleshooting
description: Use when a Linux command, service, package, SSH connection, WSL environment, storage path, network path, process, container, or scientific workload fails, behaves unexpectedly, or performs poorly. Provides an evidence-first diagnosis workflow with minimal reproduction, logs, layered checks, reversible changes, and completion verification.
---

# Linux Troubleshooting

Diagnose from evidence, not symptoms alone. Preserve the failing state long
time of failure.

## Triage

Collect the smallest useful incident record:

```bash
pwd
id
uname -a
cat /etc/os-release
date --iso-8601=seconds
command -v tool
tool --version
```

Record the exact failing command, redacted inputs, exit code, stderr, current
directory, environment activation, recent changes, affected scope, and whether
the issue is reproducible. Do not paste protected data, credentials, or private
keys into logs or chat.

## Diagnose In Layers

Check one layer at a time, from immediate prerequisites outward:

1. Command spelling, paths, inputs, permissions, ownership, and available disk
   or memory.
2. Executable version, dynamic libraries, environment, modules, containers, and
   configuration.
3. Process state, limits, locks, CPU/memory/I/O pressure, and relevant logs.
4. Filesystem, mount, quota, inode, DNS, route, port, proxy, firewall, or TLS
   state.
5. Remote target role, scheduler allocation, service dependency, and external
   account/API status.

Use a reduced input or safe dry run where possible. Change one variable per
attempt and record the result; avoid combining an upgrade, configuration change,
restart, and cleanup in a single "fix."

## Logs And State

Inspect the log source appropriate to the component and failure time:

```bash
systemctl status service
journalctl -u service --since '1 hour ago'
ps -ef
df -hT
```

For a remote workload, also inspect scheduler state/accounting, application
logs, container logs, and client-side SSH or transfer output. For WSL, label
whether the failure occurs in Windows or inside the distribution before applying

## Select A Narrow Fix

Prefer the smallest reversible action supported by evidence. Preview package
changes, validate configuration before reload, use a second SSH session before
access changes, and preserve configuration copies before edits. Require explicit
confirmation before deletion, overwrites, restarts of production services,
privilege changes, firewall/SSH changes, package removals, kernel/driver changes,

If the evidence does not distinguish plausible causes, state the remaining
uncertainty and collect the next discriminating observation rather than guessing.

## Verify And Document

Re-run the original failing command or user-visible health check in the original
context. A successful adjacent command is not sufficient. Confirm exit status,
expected output, service/client reachability where relevant, and absence of
unexpected side effects.

Finish with the cause or bounded uncertainty, change made, exact verification,
rollback state, and any follow-up monitoring. Route performance, package,
network/storage, WSL, remote-access, GPU, or scheduler cases to their focused
Linux skill once the incident is classified.
