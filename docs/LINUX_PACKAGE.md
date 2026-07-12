# Linux Package Blueprint

## Goal

The Linux package should let an agent operate a scientific workstation, WSL
environment, remote server, or HPC login node safely. Debian-family and
Arch-family systems share the same task skills; distribution-specific details
live in adapters and references rather than duplicated skills.

## Recommended User Tools

These are guidance defaults for human-operated setups. The agent may perform the
same tasks directly when the environment already provides CLI access and policy
allows it.

| Need | Windows recommendation | Linux recommendation |
| --- | --- | --- |
| Terminal | Windows Terminal | Native terminal emulator |
| SSH shell | Windows OpenSSH, Windows Terminal | OpenSSH client |
| Stable remote interactive session | `tmux` inside WSL or on the remote Linux host | `tmux` |
| Legacy/common session persistence | GNU `screen` on the remote Linux host | GNU `screen` |
| Roaming / unstable interactive network | `mosh` from WSL when allowed | `mosh` |
| SFTP GUI | WinSCP | FileZilla or native file manager with SFTP support |
| Cross-platform transfer GUI | FileZilla | FileZilla |
| Remote code editing | VS Code Remote SSH | VS Code Remote SSH |
| Terminal + SFTP in one app | MobaXterm or Termius | Termius optional |
| Windows-to-Windows bulk sync | Robocopy | N/A |
| Cross-host sync | `rsync` from WSL or OpenSSH + `scp` | `rsync` |
| Cloud/object storage transfer | `rclone`, provider CLI | `rclone`, provider CLI |
| Desktop remote access to Windows | Remote Desktop | FreeRDP or Remmina |
| Desktop remote access to Linux | VS Code, SSH + X/Wayland forwarding, RDP/VNC if approved | SSH, RDP/VNC if approved |

These are recommendations, not hard dependencies. The Linux package should tell
the user which tool category is appropriate and then adapt to what is already
installed.

## Exposed Skills

```text
linux/
  linux-foundations
  linux-package-management
  linux-remote-access
  linux-session-persistence
  linux-file-transfer
  linux-system-administration
  linux-storage-networking
  linux-gpu-compute
  linux-wsl
  linux-troubleshooting
```

Every skill supports both families where applicable:

- Debian, Ubuntu, and `ID_LIKE=debian`.
- Arch, CachyOS, Linxira OS, and `ID_LIKE=arch`.

A skill directory may contain `references/debian-family.md` and
`references/arch-family.md`, but those references are not separately exposed as
skills.

## Common Dispatch

Before changing a system, detect:

```bash
cat /etc/os-release
uname -a
id
systemctl --version 2>/dev/null || true
command -v apt pacman dnf zypper apk 2>/dev/null
```

Use `ID` and `ID_LIKE`; do not infer a distribution from package-manager
presence alone. Detect WSL separately using `/proc/version`, `WSL_DISTRO_NAME`,
or `wsl.exe --status` from Windows.

Remote workflows must distinguish three independent facts:

1. **Client operating system:** Windows or Linux.
2. **Current execution context:** PowerShell/CMD, native Linux shell, or WSL.
3. **Target operating system:** Windows or Linux.

Never infer the target operating system from the client. Ask or probe it after
connection.

Useful client detection:

```powershell
$PSVersionTable
[System.Environment]::OSVersion
Get-Command ssh, scp, sftp, wsl -ErrorAction SilentlyContinue
```

```bash
uname -a
test -n "${WSL_DISTRO_NAME:-}" && echo WSL
command -v ssh scp sftp rsync rclone
```

## Client And Target Matrix

| Client | Target | Preferred automation | GUI/human option |
| --- | --- | --- | --- |
| Linux | Linux | OpenSSH, rsync/SFTP, scheduler tools | Native terminal, VS Code Remote SSH, FileZilla |
| Windows | Linux | Windows OpenSSH from PowerShell, or WSL OpenSSH | Windows Terminal, WinSCP, FileZilla, MobaXterm, VS Code Remote SSH |
| Windows | Windows | PowerShell Remoting or OpenSSH; SMB/robocopy for approved file shares | RDP, Windows Admin Center, Explorer, WinSCP when SSH is enabled |
| Linux | Windows | OpenSSH or PowerShell over SSH; SMB only on trusted networks | Remmina/FreeRDP for RDP, `smbclient`, FileZilla/WinSCP alternatives |
| WSL | Linux | Linux OpenSSH, rsync, SFTP, native Linux tooling | Windows-hosted terminal or GUI clients as needed |
| WSL | Windows host | WSL interop, `/mnt/<drive>`, `wsl.exe`, localhost networking | Explorer through `\\wsl$`, Windows Terminal |

Protocol selection depends on the target service and policy, not merely the
client operating system.

## Windows Remote Operations

Windows targets need their own adapter inside remote-access and file-transfer
skills:

- **PowerShell Remoting:** preferred for structured Windows administration when
  WinRM or PowerShell over SSH is already configured. Do not expose WinRM to the
  public internet or weaken TrustedHosts/certificate validation as a shortcut.
- **OpenSSH Server:** useful for cross-platform command execution and SFTP. Check
  the remote default shell and quoting rules; a Windows SSH target may start
  PowerShell, CMD, or another configured shell.
- **RDP:** appropriate for visual administration and applications that require a
  desktop. Confirm identity, certificate, VPN or gateway, clipboard/drive
  redirection, and sign-out behavior.
- **SMB:** suitable for approved LAN/VPN file shares. Require modern SMB and
  access control; never enable SMB1.
- **Robocopy:** preferred for resilient Windows-to-Windows directory copy and
  mirroring, but `/MIR` is destructive and requires preview plus explicit
  confirmation.
- **Windows services and tasks:** use Services, `Get-Service`, `sc.exe`, Task
  Scheduler, or PowerShell scheduled jobs instead of keeping server work alive
  in an interactive RDP window.

For Windows-to-Windows operations, do not recommend `screen` or `tmux` unless
the actual work runs inside WSL. Native persistence uses services, scheduled
tasks, background jobs, or the application's own job system.

## Distribution Differences

Keep these differences in adapters:

| Area | Debian/Ubuntu | Arch/CachyOS/Linxira |
| --- | --- | --- |
| Packages | APT and dpkg | Pacman, makepkg, optional AUR helper |
| Release model | Fixed stable releases | Rolling release |
| Third-party sources | Signed APT repositories and PPAs | AUR and custom Pacman repositories |
| Full upgrade | Release-aware APT upgrade | `pacman -Syu`; partial upgrades unsupported |
| Initramfs | `update-initramfs`, sometimes dracut | mkinitcpio or dracut depending on system |
| Kernel/driver cadence | Conservative and vendor-supported | Newer kernels and hardware support |
| Recovery | Release rollback and package pinning | Package cache, downgrade, snapshots, Arch News |
| Security defaults | Ubuntu commonly uses AppArmor | Minimal defaults vary by installation |

Most shell, systemd, SSH, filesystem, process, networking, storage, container,
and scientific workflow behavior remains common.

## WSL

The `linux-wsl` skill should cover:

1. Install or enable WSL 2 and select a distribution.
2. Verify WSL version, kernel, systemd, networking, DNS, proxy, clock, and GPU.
3. Explain Windows paths versus Linux paths.
4. Keep Linux-heavy projects inside the WSL filesystem for performance; avoid
   high-I/O workloads under `/mnt/c` unless Windows access is required.
5. Launch Windows applications from WSL and Linux commands from PowerShell.
6. Configure `.wslconfig` for memory, processors, swap, networking, and idle
   behavior only when needed.
7. Handle CUDA for WSL without installing a second Linux kernel driver inside
   the distribution; review AMD/Intel support separately against current vendor
   documentation.
8. Export, import, move, back up, terminate, and unregister distributions with
   explicit confirmation before destructive operations.
9. Explain that WSL is suitable for local research and development, not a
   substitute for a production Linux server or institutional HPC policy.

WSL is a Linux execution context on a Windows client, not a remote server. Keep
these boundaries explicit:

- A command typed in PowerShell follows Windows path and quoting semantics.
- A command typed inside WSL follows Linux path, permission, and quoting rules.
- Windows OpenSSH and WSL OpenSSH have separate configuration, agents, home
  directories, and known-host databases unless deliberately coordinated.
- Prefer storing Linux private keys inside the WSL home directory with mode 600;
  avoid casually sharing private keys through `/mnt/c`.
- A Windows GUI transfer client can operate alongside WSL, but both must target
  the same intended host and destination rather than creating duplicate uploads.
- For reproducible instructions, always label command blocks as PowerShell,
  Windows CMD, or Bash/WSL.

Cross-boundary file transfers should use ordinary paths for small interactive
work and `rsync`, archive streams, or Windows-native copy tools for large trees.
Verify checksums after important transfers.

## SSH And Remote Access

The `linux-remote-access` skill should cover:

- OpenSSH client/server, keys, agents, `~/.ssh/config`, jump hosts, tunnels, and
  host-key verification.
- Named host aliases instead of repeatedly exposing addresses and key paths.
- `ProxyJump`, local/remote forwarding, SOCKS forwarding, and port conflicts.
- `mosh` for unstable interactive networks when the server permits UDP.
- VS Code Remote SSH for code editing and terminal work.
- Terminal clients such as Windows Terminal, Tabby, Termius, and MobaXterm as
  optional user-facing choices, not mandatory dependencies.
- Batch mode for agent automation; no password scraping or repeated password
  retries.

First contact to a new host, host-key changes, privilege escalation, firewall
changes, and remote deletion require explicit user confirmation.

### SSH Key Lifecycle

Default to Ed25519 where the server supports it. Use RSA 3072/4096 only for
legacy compatibility; do not create DSA keys.

The workflow should cover:

1. Check for an existing suitable key before generating another one.
2. Generate a named key for its purpose, preferably with a passphrase.
3. Keep the private key local with restrictive permissions; transfer only the
   public key.
4. Install the public key through an approved channel and verify a second login
   before closing the original session.
5. Use `ssh-agent`, Windows OpenSSH agent, a hardware-backed key, or an approved
   credential manager instead of repeatedly exposing a passphrase.
6. Define the host in `~/.ssh/config` with `HostName`, `User`, `IdentityFile`,
   `IdentitiesOnly yes`, and `ProxyJump` where needed.
7. Remove expired or compromised keys from every `authorized_keys` location and
   rotate related credentials.

Never upload a private key to a server, shared drive, repository, chat, or
browser form. Agent forwarding is disabled by default because a compromised
remote host can abuse the forwarded agent. Enable it only for a justified,
time-bounded workflow.

Host keys authenticate the server, while user keys authenticate the user. Do
not resolve a changed host-key warning by deleting `known_hosts` blindly. Verify
the new fingerprint through an administrator or a separate trusted channel,
then update only the affected entry.

### Connection Reliability

For ordinary SSH sessions, configure client-side keepalive where appropriate:

```sshconfig
Host research-server
  ServerAliveInterval 30
  ServerAliveCountMax 3
```

Keepalive detects a dead connection; it does not preserve a running interactive
process after disconnect. Use `tmux`, `screen`, a scheduler, or a service for
that. Use `autossh` only for intentionally persistent tunnels, and use `mosh`
for roaming or unstable interactive networks when policy and firewall allow it.

For jump hosts, prefer `ProxyJump bastion` over manually nested SSH sessions.
Record which host actually stores data and runs computation; a login node may
only be a gateway to compute nodes or a scheduler.

## Session Persistence

Recommend tools by task:

| Need | Preferred tool |
| --- | --- |
| Interactive terminal that survives disconnects | `tmux` |
| Existing environment or minimal compatibility | GNU `screen` |
| One non-interactive command with simple logs | `nohup` or `systemd-run --user` |
| Scheduled/repeated system work | systemd service/timer |
| HPC computation | Slurm/PBS job, never a login-node `screen` session |
| Unstable roaming connection | `mosh` plus `tmux` where available |

The skill must explain attach, detach, list, name, log, terminate, and recovery.
It should prefer `tmux` for new interactive workflows but recognize `screen` as
widely installed and sufficient.

Do not present terminal multiplexers as job schedulers. Long scientific jobs
need resource declarations, logs, exit status, checkpoints, and output
validation.

## File Transfer

Choose by scenario:

| Scenario | Recommended method |
| --- | --- |
| One or a few files over SSH | `scp` or interactive `sftp` |
| Large/repeated directory synchronization | `rsync` over SSH |
| Cloud/object storage | `rclone` or provider CLI |
| Very large institutional datasets | Globus where available |
| Resumable HTTP/FTP download | `curl`, `wget`, or `aria2c` |
| Windows GUI over SFTP | WinSCP or FileZilla |
| Cross-platform GUI | FileZilla or Cyberduck |
| Integrated remote workstation | MobaXterm, Termius, or VS Code Remote SSH |

FileZilla must use SFTP when the server exposes SSH. Plain FTP is not acceptable
for credentials or research data. For protected biomedical data, first confirm
the destination, policy, encryption, account authorization, and data-use terms.

### Windows Transfer Paths

Windows users should be offered both command-line and GUI routes:

| User need | Windows recommendation |
| --- | --- |
| Native command line | Windows OpenSSH `scp` and `sftp` from PowerShell or Windows Terminal |
| Reliable SFTP GUI | WinSCP |
| Cross-platform SFTP/FTPS GUI | FileZilla |
| SFTP plus terminal in one application | MobaXterm or Termius |
| Edit code directly on a server | VS Code Remote SSH |
| Windows/WSL local movement | Explorer via `\\wsl$`, `wsl.exe`, or explicit path copy |
| Large repeated synchronization | `rsync` inside WSL or a native synchronization tool |

WinSCP is generally the clearest Windows-first recommendation because it
supports SFTP, resume, synchronization, transfer queues, host-key prompts, and
PuTTY/OpenSSH key workflows. FileZilla is suitable when users need the same GUI
on Windows, Linux, and macOS.

Protocol selection must be explicit:

- **SFTP:** preferred; file transfer over SSH, usually port 22.
- **FTPS:** legacy FTP with TLS; use only when the service specifically requires
  it and verify certificate and passive-mode settings.
- **FTP:** unencrypted; avoid for credentials or research data.
- **SCP:** simple copy over SSH; useful for small transfers but less suitable
  than rsync/SFTP for complex resumable workflows.

Do not confuse SFTP with FTP or FTPS; they use different protocols despite
similar client interfaces.

Transfers should follow:

1. Inspect source size, file count, permissions, and available destination space.
2. Confirm direction, host, destination path, overwrite behavior, and expected
   cost when cloud storage or egress is involved.
3. Use dry-run where supported.
4. Transfer with resume and progress for large data.
5. Compare file count, size, and cryptographic checksums.
6. Keep logs or a manifest for scientific inputs.
7. Remove source data only after verified transfer and explicit confirmation.

For directories with many small files, consider creating a `tar` archive before
transfer to reduce metadata overhead, then verify and extract at the destination.
For files that may change during transfer, stop the writer or create an immutable
snapshot first. Never checksum a source that is still being modified and treat
the result as a stable manifest.

### GUI Transfer Handoff

When the user performs a GUI transfer, the agent should provide a short
checklist and wait for observable results:

1. Confirm protocol, host, port, username, and expected fingerprint.
2. Select a key file or use the configured SSH agent; never ask for key content.
3. Identify the exact local and remote directories.
4. State upload versus download and overwrite policy.
5. Confirm available remote quota and expected data size.
6. Watch queued, successful, and failed transfer lists.
7. Retry only failed files rather than restarting everything.
8. Run or request a destination-side checksum comparison.

Screenshots can be used to identify controls and status, but they must not expose
passwords, private-key contents, tokens, patient identifiers, or protected file
names unnecessarily.

## Remote Server Preflight

Before starting remote scientific work, collect:

- Host role: personal workstation, cloud VM, login node, or compute node.
- Operating system, shell, architecture, scheduler, modules, containers, and
  available package managers.
- CPU, memory, GPU model/driver, local scratch, project storage, quota, and inode
  availability.
- Network and transfer restrictions, VPN/bastion requirements, and expected
  cloud egress or storage cost.
- Allowed installation methods and whether sudo is available or appropriate.
- Backup, retention, deletion, and controlled-data policies.

Avoid heavy computation, large downloads, compilation, or long `screen`/`tmux`
jobs on an institutional login node. Submit through the scheduler or request an
interactive allocation. Preserve command logs, environment versions, exit
status, scheduler job ID, and output paths.

## Computer Use And Human Handoff

Computer Use is a cross-package capability shared with `research-web`, not a
Linux-distribution skill. Linux skills can request it when a GUI is more
appropriate.

The agent chooses one of three modes:

1. **Direct CLI:** execute commands when tools and authorization are available.
2. **Guided GUI:** give the user exact software, screen, field, button, expected
   state, and verification steps.
3. **Interactive handoff:** open or highlight the relevant UI, ask the user to
   complete login, OTP, CAPTCHA, payment, key import, or irreversible action,
then resume after confirmation.

Computer Use guidance must first identify the user's desktop platform:

- On Windows, use Windows Terminal, PowerShell, Explorer, Settings, Task Manager,
  RDP, WinSCP, FileZilla, or VS Code where appropriate.
- On Linux, use the available terminal and desktop environment without assuming
  GNOME or KDE; prefer portable CLI paths and provide GUI alternatives only
  after detecting installed applications.
- On Windows with WSL, state whether the next action occurs in Windows or WSL
  and which filesystem owns the files.

GUI guidance should not be a vague list. For a FileZilla SFTP transfer, specify:

- Download source and supported operating system.
- Protocol: SFTP.
- Host alias or hostname, port, username, and key-file selection.
- Local and remote panes and transfer direction.
- Whether overwriting is allowed.
- Queue completion and failed-transfer tabs.
- Remote checksum command or manifest verification after upload.

The agent must never ask the user to paste passwords, private keys, session
cookies, OTP values, or recovery codes into chat.

## Scientific Compute Defaults

For scientific tools, prefer environment isolation over distribution packages:

1. Locked Conda/Bioconda, Pixi, uv, or renv environment.
2. Apptainer on HPC; Docker or Podman where permitted.
3. Official binaries or language package managers.
4. Distribution packages when appropriate for system dependencies.

GPU handling is vendor-specific and must dispatch to NVIDIA, AMD, or Intel
references after hardware detection. Distribution adapters handle only the
installation and service differences.

## Safety And Completion

Require confirmation before:

- Deleting or overwriting remote data.
- Changing SSH trust, firewall, users, permissions, mounts, boot, kernels, or
  drivers.
- Installing from AUR, curl-piped scripts, unsigned repositories, or unknown
  binaries.
- Uploading controlled data or creating paid cloud resources.
- Terminating sessions or jobs not created in the current workflow.

A remote task is complete only when connection state, exit status, logs,
outputs, checksums, destination path, and cleanup state are known.
