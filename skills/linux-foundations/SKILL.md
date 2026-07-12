---
name: linux-foundations
description: Use when working in a Linux shell or teaching Linux command-line usage, including files, directories, permissions, processes, pipes, text processing, archives, SSH, environment variables, package discovery, shell scripting, and troubleshooting common command failures.
---

# Linux Foundations

Use inspect-first commands and preserve user data. Explain privilege, scope, and
side effects before commands that modify the system.

## Orientation

Start with:

```bash
pwd
id
uname -a
cat /etc/os-release
printf '%s\n' "$SHELL"
df -h
free -h
```

Use `command -v tool` and `tool --version` before assuming software exists.

## Files And Search

- Quote paths and use `--` before untrusted filenames.
- Prefer `find` for filesystem attributes and `rg` for file names or content.
- Preview selections before bulk moves, permission changes, or deletion.
- Use checksums for important transfers and `rsync -a --info=progress2` for
  resumable directory copies.

Examples:

```bash
rg --files -g '*.fastq.gz'
find data -type f -size +10G -print
du -sh -- * | sort -h
sha256sum file.tar.gz
```

## Permissions

Understand owner, group, mode bits, ACLs, and default umask. Prefer group-based
collaboration over world-writable directories. Do not apply recursive `chmod`
or `chown` until symlinks, mount boundaries, and the exact target are checked.

```bash
namei -l /path/to/file
stat /path/to/file
getfacl /path/to/file
```

## Processes And Resources

Inspect process identity and workload before sending signals:

```bash
ps -ef
pgrep -af process-name
top
free -h
df -h
```

Use `TERM` for graceful shutdown, wait, then consider `KILL` only when recovery
requires it. For long jobs use `tmux`, `screen`, `nohup`, or a scheduler rather
than relying on an SSH session.

## Text And Data Streams

Compose small tools with pipes. Use `jq` for JSON, `yq` for YAML, `csvkit` or a
language parser for CSV, and domain tools for biological formats. Avoid parsing
structured data with fragile `grep | cut` chains.

Enable strict shell behavior in maintained Bash scripts:

```bash
set -Eeuo pipefail
IFS=$'\n\t'
```

Add traps when temporary files or partial outputs require cleanup. Validate
arguments, quote expansions, and write outputs atomically through a temporary
file followed by `mv`.

## SSH And Transfers

Use host aliases in `~/.ssh/config`, key authentication, known-host checking,
and least-privilege accounts. Debug with `ssh -v host`; do not disable host-key
verification as a routine fix.

## Troubleshooting Order

1. Capture the exact command, exit code, stderr, and current directory.
2. Check existence, permissions, disk, memory, and process limits.
3. Verify executable path, version, environment, and library dependencies.
4. Reduce to the smallest failing input.
5. Inspect logs and system messages relevant to the time of failure.
6. Change one variable, rerun, and record the result.
