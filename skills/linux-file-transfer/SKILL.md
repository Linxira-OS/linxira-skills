---
name: linux-file-transfer
description: Use when moving, synchronizing, downloading, uploading, verifying, or recovering scientific files between Linux, Windows, WSL, HPC, cloud/object storage, SFTP servers, SMB shares, or institutional transfer services. Covers scp, sftp, rsync, rclone, Globus, WinSCP, FileZilla, checksums, manifests, and destructive sync safeguards.
skill_class: contract
load_policy: required
risk_tags: [account-bound, controlled-data, destructive]
---

# Linux File Transfer

Choose a protocol based on the target service, data sensitivity, scale, and
resume requirements. Verify the destination and preserve the source until the
transfer is confirmed.

| Scenario | Preferred method |
| --- | --- |
| One or a few files over SSH | `scp` or `sftp` |
| Large/repeated directory synchronization | `rsync` over SSH |
| Cloud/object storage | `rclone` or provider CLI |
| Institutional large-data exchange | Globus where available |
| Resumable HTTP/HTTPS download | `curl`, `wget`, or `aria2c` |
| Windows SFTP GUI | WinSCP |
| Cross-platform SFTP GUI | FileZilla or Cyberduck |
| Approved Windows-to-Windows share | SMB plus Robocopy |

SFTP uses SSH and is not FTP or FTPS. Prefer SFTP for SSH-enabled servers;
avoid unencrypted FTP for credentials or research data.

## Preflight

Before transfer, inspect source size, file count, permissions, available space,
quota, inode availability, destination path, overwrite behavior, network or
egress cost, and controlled-data policy.

```bash
du -sh source-dir
find source-dir -type f -printf '.' | wc -c
df -h destination-parent
df -i destination-parent
```

Confirm transfer direction and exact source/target paths in words before running
a command. For protected biomedical data, also confirm authorization, encryption
requirements, retention rules, and permitted destination.

## Command-Line Transfers

Use a non-destructive `rsync` preview before synchronization:

```bash
rsync -a --info=progress2 --dry-run source-dir/ research-server:/data/project/source-dir/
rsync -a --info=progress2 source-dir/ research-server:/data/project/source-dir/
```

Add `--checksum` only when necessary: it can be expensive for large trees.
Never add `--delete` until the user has reviewed a dry run and explicitly
confirmed the deletion scope.

For a simple file copy:

```bash
scp -- file.fastq.gz research-server:/data/project/
sftp research-server
```

For remote downloads, keep a manifest and use checksums when the publisher
provides them. Do not treat an HTTP 200 response alone as integrity proof.

## Large And Many-File Data

For many small stable files, consider a `tar` stream or archive to reduce
metadata overhead. Do not archive files still being written; create a snapshot
or stop the writer first. For resumable institutional datasets, prefer Globus or
the site-supported service rather than improvising long-running transfers.

After transfer, compare source and destination counts, sizes, and cryptographic
checksums. Keep a manifest with source revision/accession, command, timestamps,
destination, and checksum algorithm for scientific inputs.

```bash
find source-dir -type f -print0 | sort -z | xargs -0 sha256sum > source.sha256
sha256sum -c source.sha256
```

Run verification on the correct side of the transfer and use relative paths in
manifests when practical.

## Windows And GUI Routes

On Windows, use Windows OpenSSH from PowerShell for CLI transfers, WinSCP for a
Windows-first SFTP GUI, and FileZilla when the same GUI needs to work across
platforms. For a GUI handoff, provide the protocol, host alias/hostname, port,
username, key-selection method, local directory, remote directory, transfer

Do not ask a user to paste passwords, private keys, or one-time codes. Screenshots
may guide controls but should not unnecessarily expose protected filenames or
credentials.

## Completion Criteria

- The expected files are present at the intended destination.
- File count, size, and appropriate checksums or manifests reconcile.
- Transfer failures and retries are known rather than hidden.
- Source data remains intact unless deletion was explicitly approved after
  verification.
- Logs or manifest records are retained for important scientific data.
