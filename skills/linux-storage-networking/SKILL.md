---
name: linux-storage-networking
description: Use when inspecting, configuring, diagnosing, or planning Linux storage, filesystems, mounts, quotas, NFS/SMB access, disks, RAID/LVM layers, routing, DNS, ports, firewall reachability, or network performance on Debian/Ubuntu or Arch-family hosts.
skill_class: contract
load_policy: required
risk_tags: [destructive, privileged]
---

# Linux Storage And Networking

Map layers before modifying them. Storage incidents often involve filesystems,
mounts, quotas, inodes, or deleted-open files rather than capacity alone;
network incidents often involve DNS, routes, TLS, proxies, firewalls, or the
application rather than a generic "network failure."

## Storage Inspection

Start read-only and follow a path from device to consumer:

```bash
lsblk -f
findmnt
df -hT
du -xhd1 /path
```

For apparent disk-full conditions, check quota, inode use, snapshots, and
deleted-open files. Do not run an unbounded `du /` scan across remote mounts
without considering load, mount boundaries, and permissions.

Before a resize, repair, reformat, LVM/RAID operation, mount change, or fstab
edit, confirm device identity, mount boundaries, consumers, backup/snapshot
state, console recovery, and rollback path. Require explicit confirmation for
any operation that can make data unavailable.

## Network Inspection

Diagnose from local state outward:

```bash
ip address
ip route
ss -lntup
resolvectl status 2>/dev/null || cat /etc/resolv.conf
curl -v https://service.example/health
```

Separate these questions:

1. Does the process listen on the expected address and port?
2. Can the host route to the target network?
3. Does DNS resolve to the intended address?
4. Do firewall, security group, VPN, proxy, or network policy permit traffic?
5. Does TLS authenticate the intended service?
6. Does the application accept and respond correctly after the connection?

Use packet capture only with authorization and an appropriate privacy boundary;
captures can contain credentials and scientific data.

## Mounts And Shared Storage

For NFS, SMB, object-storage mounts, and institutional project filesystems,
identify server, export/share, mount options, credential model, caching behavior,
quota, retention, and failure mode. Do not put long-running high-I/O workload
scratch data on shared home storage without checking site policy. Preserve data
on the intended durable filesystem and treat node-local scratch as disposable.

Never enable SMB1. Use approved authentication and avoid placing passwords in
mount commands, shell history, fstab, or logs.

## Firewall And Change Safety

Keep an active fallback session before changing a remote firewall, route, DNS
resolver, or network-manager configuration. State the exact access path that
will be tested after change. Do not expose administrative ports publicly or
weaken TLS/host verification as a diagnostic shortcut.

## Completion Criteria

- The relevant storage or network layer is identified with evidence.
- Any change has been tested from the actual client path, not only localhost.
- Capacity, inodes, quota, mount state, route, listener, and policy have been
  checked where relevant.
- Destructive or access-affecting changes have a known rollback path.
