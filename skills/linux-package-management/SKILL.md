---
name: linux-package-management
description: Use when installing, removing, upgrading, pinning, repairing, or investigating Linux packages and repositories on Debian, Ubuntu, Arch, CachyOS, or Linxira systems. Covers apt/dpkg, pacman, trusted repositories, package ownership, package conflicts, and safe system upgrades.
---

# Linux Package Management

Determine the distribution and package ownership before changing software.
Never infer a package manager only from a binary on `PATH`; inspect
`/etc/os-release` and use `ID` plus `ID_LIKE`.

## Dispatch

```bash
cat /etc/os-release
command -v apt apt-get dpkg pacman makepkg 2>/dev/null
```

| System family | Primary tools | Important rule |
| --- | --- | --- |
| Debian/Ubuntu | `apt`, `apt-cache`, `dpkg-query` | Review removals and held packages before upgrades. |
| Arch/CachyOS/Linxira | `pacman`, `pactree`, `makepkg` | Run full upgrades with `pacman -Syu`; partial upgrades are unsupported. |

Do not mix package-manager families or install a package-manager bootstrapper on
a system it does not belong to.

## Inspect First

For a requested tool, establish whether it already exists, who owns it, and
which candidate version would be installed:

```bash
command -v tool
tool --version

# Debian/Ubuntu
apt-cache policy package-name
dpkg-query -S "$(command -v tool)"
dpkg-query -W -f='${Package}\t${Version}\t${Status}\n' package-name

# Arch family
pacman -Qi package-name
pacman -Qo "$(command -v tool)"
pacman -Si package-name
```

If the executable is not package-owned, identify whether it comes from a
container, Conda/Pixi/uv environment, language package manager, manually
installed binary, or another user-managed location. Do not replace it blindly
with a system package.

## Install And Remove

Use the distribution package manager for system dependencies. Use an isolated
project environment for scientific Python, R, Node, or workflow dependencies
unless the software is deliberately operated as a shared system service.

```bash
# Debian/Ubuntu
sudo apt update
apt list --upgradable
sudo apt install package-name

# Arch family
sudo pacman -Syu
sudo pacman -S package-name
```

Before a removal, list dependent packages and inspect data/configuration paths.
On Debian systems, distinguish `remove` from `purge`. On Arch systems, review
orphans separately and do not remove them automatically from a diagnostic list.

Require confirmation before a command removes packages, replaces a kernel,
changes a desktop/session stack, alters a database server, or discards package
configuration.

## Repositories And Trust

Use signed official repositories by default. For a third-party repository,
record its owner, supported distribution/release, signing key or keyring,
packages it provides, removal path, and why an official repository or isolated
environment is insufficient.

- Do not use `curl | sh` as a package installation method.
- Do not disable signature verification or use `--allow-unauthenticated`.
- Do not add PPAs, AUR packages, or unsigned repositories without explicit user
  approval.
- Treat AUR helpers as user-facing convenience tools, not trusted system
  authorities. Review PKGBUILDs, `.SRCINFO`, patches, and source URLs before
  building.
- On Arch systems, read current Arch News before upgrades that affect core
  packages, boot, filesystems, graphics, or initramfs.

## Upgrades And Recovery

Before a major update, capture system state, free disk space, package holds,
running services, backup/snapshot status, and local access recovery path.

```bash
# Debian/Ubuntu
apt list --upgradable
apt-mark showhold
df -h / /boot

# Arch family
pacman -Qu
df -h / /boot
```

Do not automate a release upgrade, kernel/driver change, mass package removal,
or rolling-release upgrade across an SSH session without a confirmed recovery
route. Preserve relevant logs and package-manager output.

## Completion Criteria

- The correct distribution family and package owner are known.
- The requested version is installed or the requested problem is explained.
- The package manager reports a consistent state.
- The executable runs with the intended environment and version.
- Any service or scientific tool affected by the change passes its own health
  check or smoke test.
