---
name: linux-wsl
description: Use when installing, configuring, diagnosing, or using Windows Subsystem for Linux, including WSL 2 distributions, Windows-to-Linux command boundaries, filesystem locations, networking, systemd, GPU use, SSH identities, VS Code, backups, export/import, and Windows or WSL interoperation.
skill_class: workflow
load_policy: conditional
risk_tags: [privileged]
---

# Linux WSL

WSL is a Linux execution context running on a Windows client. State explicitly
whether each action occurs in PowerShell, Windows CMD, or a Bash shell inside
WSL, because paths, permissions, package managers, configuration, and SSH homes
are distinct.

## Inspect The Environment

From PowerShell:

```powershell
wsl --status
wsl --list --verbose
wsl --version
```

From WSL:

```bash
uname -a
cat /etc/os-release
printf '%s\n' "${WSL_DISTRO_NAME:-not-wsl}"
ps -p 1 -o comm=
```

Confirm WSL version, selected distribution, kernel, systemd state, networking,
DNS/proxy policy, time, disk availability, and whether the work is local
development or a remote-server/HPC task.

## Filesystem And Tool Boundaries

Keep Linux-heavy repositories, environments, and high-I/O scientific work under
workloads from `/mnt/c` unless Windows interoperability is required.

| Context | Path style | Typical command |
| --- | --- | --- |
| PowerShell | `C:\\Users\\name\\project` | `wsl --cd ~ bash -lc 'command'` |
| WSL Bash | `/home/name/project` | `explorer.exe .` |
| Windows drive in WSL | `/mnt/c/Users/name/project` | `wslpath 'C:\\Users\\name\\project'` |
| WSL files in Explorer | `\\wsl$\\Distribution\\home\\name` | Open through Explorer |

Do not assume a Windows executable and a Linux executable use compatible paths,
quoting, permissions, credential stores, or config files.

## Package, SSH, And Editor Separation

Install Linux packages inside the distribution using its own package manager.
Windows OpenSSH and WSL OpenSSH have separate agents, keys, `known_hosts`, and
configuration unless deliberately coordinated. Prefer Linux private keys in the
WSL home directory with mode `600`; do not casually put private keys under
`/mnt/c`.

Use VS Code's WSL integration or Remote SSH only after confirming the code and
tools run in the intended environment. A Windows GUI transfer client and a WSL
CLI may coexist, but both must target the same intended remote destination.

## Networking And Services

Treat localhost behavior, firewall rules, VPNs, proxy configuration, and exposed
ports as Windows-plus-WSL concerns. Verify the listening address and client path
before exposing a development service beyond localhost. Do not use WSL as a
substitute for an institutionally managed production server.

Enable systemd, modify `.wslconfig`, alter networking mode, or add startup
services only with a stated reason and rollback plan. Changes can affect every

## GPU And Compute

For CUDA in WSL, use the Windows host driver supported for WSL and do not install
GPU support to current vendor documentation after detecting hardware and WSL
support. Validate with lightweight discovery commands before downloading models
or compiling software.

## Backup And Lifecycle

Export, import, move, terminate, and unregister are lifecycle operations, not
routine cleanup. Require explicit confirmation before termination or unregister,

```powershell
wsl --export Distribution backup.tar
wsl --list --verbose
```

## Completion Criteria

- The Windows client, WSL distribution, and current shell are identified.
- Files, tools, SSH keys, and workloads are placed in the intended environment.
- The requested command or service works from the intended client path.
- Any system-wide or lifecycle change has a documented verification and rollback
  path.
