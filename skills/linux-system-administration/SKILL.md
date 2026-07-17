---
name: linux-system-administration
description: Use when operating Linux services, users, backups, containers, maintenance windows, and incidents on a managed host. Use the focused package, remote-access, storage/networking, transfer, or troubleshooting skill when that subsystem is the primary task.
skill_class: contract
load_policy: required
risk_tags: [destructive, privileged]
---

# Linux System Administration

Operate with least privilege and a recovery path. Gather evidence before making
changes, especially on remote or production systems.

This skill coordinates host-level administration. It does not replace the
focused contract for package changes, SSH access, data transfer, storage and
network mutation, or failure diagnosis.

## Pre-Change Checklist

Identify distribution/version, host role, environment, maintenance window,
current health, recent changes, backup state, console access, and rollback
method. Record the existing configuration and service status.

## Services And Logs

```bash
systemctl status service
systemctl cat service
journalctl -u service --since '1 hour ago'
systemd-analyze critical-chain
```

Use drop-in overrides instead of editing vendor units. Run the service's config
test before reload or restart. Prefer reload when supported and verify both
process health and application-level behavior afterward.

## Packages And Updates

Use the distribution package manager and configured repositories. Preview
changes, verify available disk space, protect database compatibility, and stage
major upgrades. Do not mix distribution packages, random install scripts, and
language package managers for the same system component without a deliberate
ownership model.

## Users And Access

- Use named accounts, groups, sudo policy, SSH keys, and auditable privilege.
- Disable unused accounts and remove stale authorized keys.
- Avoid direct root SSH login and password authentication where policy permits.
- Test a second authenticated session before changing SSH or firewall rules.

## Storage

Map devices, filesystems, mounts, LVM/RAID layers, and consumers before changes:

```bash
lsblk -f
findmnt
df -hT
du -xhd1 /path
```

Check inode exhaustion, deleted-open files, quotas, snapshots, and filesystem
health. Never resize, reformat, or repair a filesystem without confirming the
device and backup/recovery plan.

## Networking

Diagnose from local state outward:

```bash
ip address
ip route
ss -lntup
resolvectl status
curl -v https://service.example/health
```

Separate DNS, routing, firewall, TLS, proxy, listening socket, and application
failures. Make firewall changes with an active fallback session and verify from
the client network, not only localhost.

## Performance

Classify saturation as CPU, memory, I/O, network, locks, or external dependency.
Use `uptime`, `vmstat`, `iostat`, `pidstat`, `sar`, `ss`, and application metrics
where installed. Correlate symptoms with timestamps and workload; do not treat a
single utilization snapshot as a root cause.

## Containers

Pin images by version or digest, run non-root where possible, constrain CPU and
memory, mount persistent data explicitly, configure health checks, rotate logs,
and scan dependencies. Keep secrets outside images and command history.

## Backups

Define recovery point and recovery time objectives. Use multiple copies across
failure domains, encrypt protected data, monitor jobs, and regularly restore to
an isolated location. A successful backup command without a tested restore is
not sufficient.

## Incident Handling

1. Stabilize service and preserve evidence.
2. Record timeline, scope, affected assets, and active access.
3. Contain with the least destructive action.
4. Eradicate the cause and rotate exposed credentials.
5. Recover from known-good state and validate externally.
6. Document root cause, detection gaps, and preventive actions.

Avoid rebooting or deleting logs solely to clear symptoms unless immediate
safety requires it and evidence has been preserved.
