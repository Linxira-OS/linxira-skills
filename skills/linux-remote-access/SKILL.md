---
name: linux-remote-access
description: Use when connecting to, configuring, diagnosing, or securely operating a Linux or Windows host over SSH, SFTP, a bastion, port forwarding, PowerShell remoting, or Remote Desktop. Covers client-target OS dispatch, SSH keys, host keys, jump hosts, tunnels, remote IDE access, and connection reliability.
skill_class: contract
load_policy: required
risk_tags: [account-bound, privileged]
---

# Linux Remote Access

Separate the client operating system, the current shell context, and the target
operating system. A Windows client, WSL shell, and Linux target are three
independent facts. Confirm the target after connection rather than assuming it.

## Identify The Route

Collect the host role, target name, account, access policy, VPN/bastion
requirement, and required service before connecting.

```powershell
$PSVersionTable
Get-Command ssh, scp, sftp, wsl -ErrorAction SilentlyContinue
```

```bash
uname -a
test -n "${WSL_DISTRO_NAME:-}" && echo WSL
command -v ssh scp sftp
```

Use SSH or SFTP when the target offers OpenSSH. Use PowerShell Remoting for
structured Windows administration only when WinRM or PowerShell over SSH is
already configured. Use RDP for applications requiring a desktop, not as a
substitute for a service or scheduler.

## SSH Configuration

Prefer a named host entry over repeating addresses, users, and identity paths:

```sshconfig
Host research-server
  HostName server.example.edu
  User researcher
  IdentityFile ~/.ssh/id_ed25519_research
  IdentitiesOnly yes
  ServerAliveInterval 30
  ServerAliveCountMax 3
```

For a required gateway, use a separate bastion alias and `ProxyJump`:

```sshconfig
Host bastion
  HostName bastion.example.edu
  User researcher

Host cluster-login
  HostName login.internal.example.edu
  User researcher
  ProxyJump bastion
  IdentityFile ~/.ssh/id_ed25519_research
  IdentitiesOnly yes
```

Use `ssh -v alias` to diagnose connection failures. Check DNS, VPN, route,
port, account, key selection, server reachability, and target shell separately.
Do not disable host-key verification merely to proceed.

## Key And Host-Key Lifecycle

Prefer Ed25519 keys when supported. Before generating a key, inspect existing
purpose-specific keys and local agent state. Keep private keys local with
restrictive permissions; install only the public key through an approved path.

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_research -C 'research access'
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519_research
chmod 644 ~/.ssh/id_ed25519_research.pub
ssh-add ~/.ssh/id_ed25519_research
```

After adding a public key, test a second session before closing the working
session. Do not upload private keys, forward an agent by default, or request a
password, private-key content, OTP, recovery code, or token in chat.

Host keys authenticate the server. If a host key changes, stop and verify the
fingerprint through an administrator or other trusted channel. Update only the
affected `known_hosts` entry after verification; never delete the whole file as
a routine fix.

## Tunnels And Remote Development

State the listening side, destination, port, and access scope before creating a
tunnel:

```bash
# Local client port 8888 reaches a service bound to the remote host's localhost.
ssh -N -L 8888:127.0.0.1:8888 research-server
```

Bind forwarded ports to `127.0.0.1` unless LAN exposure is explicitly needed and
approved. Check for local port conflicts with `ss -lnt` or the matching Windows
network command. Use VS Code Remote SSH for approved remote code editing; it
does not remove the need to understand where files, compute, and credentials
reside.

## Persistent Remote Work

SSH keepalives detect dead connections; they do not preserve a process. Use
`tmux` for interactive work that must survive disconnects and durable log files
for non-interactive commands. On managed clusters, use the site scheduler rather
than `tmux`, `screen`, or `nohup` for compute work on a login node.

After reconnecting, inspect existing sessions, processes, scheduler jobs, logs,
and partial outputs before launching a duplicate run. End completed sessions and
record the terminal state of background work.

## Remote Windows Hosts

For a Windows target, confirm whether the remote service starts PowerShell, CMD,
or another shell before composing commands. Do not weaken WinRM `TrustedHosts`,
certificate validation, or public firewall exposure as a shortcut. For RDP,
confirm identity, certificate, VPN/gateway, clipboard/drive redirection, and
sign-out behavior.

## Confirmation And Completion

Require user confirmation before first contact with a new host, accepting or
replacing a host key, installing a user key, enabling forwarding that exposes a
service, changing firewall/SSH policy, escalating privileges, or operating a
production target.

A remote-access task is complete only when the intended account is connected to
the intended target, the target OS and host role are confirmed, the requested
command or service health check has succeeded, and any tunnel or session cleanup
state is known.
