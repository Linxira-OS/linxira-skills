import { createHash } from 'node:crypto';
import {
  cp,
  lstat,
  mkdir,
  open,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const markerStart = '<!-- linxira-skills:start -->';
const markerEnd = '<!-- linxira-skills:end -->';
const markerTemplate = (await readFile(join(packageRoot, 'templates', 'AGENTS.md.fragment'), 'utf8')).trimEnd();
const requiredIgnoreEntries = ['.agents/skills/', '.linxira/'];

class CliError extends Error {}

export async function run(argv, cwd = process.cwd(), io = console) {
  const { command, options } = parseArguments(argv);

  if (command === 'help') {
    io.log(helpText());
    return 0;
  }

  const root = await findGitRoot(cwd);
  for (const path of [
    join(root, 'AGENTS.md'),
    join(root, '.gitignore'),
    join(root, '.agents', 'skills'),
    manifestPath(root),
  ]) {
    await assertNoSymlinkComponents(root, path);
  }

  if (command === 'init') {
    return options.dryRun
      ? initialize(root, options, io)
      : withOperationLock(root, command, () => initialize(root, options, io));
  }
  if (command === 'status') {
    return showStatus(root, io);
  }
  if (command === 'update') {
    return options.dryRun
      ? update(root, options, io)
      : withOperationLock(root, command, () => update(root, options, io));
  }
  if (command === 'uninstall') {
    return options.dryRun
      ? uninstall(root, options, io)
      : withOperationLock(root, command, () => uninstall(root, options, io));
  }

  throw new CliError(`Unknown command: ${command}`);
}

function parseArguments(argv) {
  const [rawCommand = 'help', ...rawOptions] = argv;
  const command = rawCommand === '--help' || rawCommand === '-h' ? 'help' : rawCommand;
  const options = { dryRun: false, force: false, profile: undefined };

  for (let index = 0; index < rawOptions.length; index += 1) {
    const option = rawOptions[index];
    if (option === '--dry-run') {
      options.dryRun = true;
    } else if (option === '--force') {
      options.force = true;
    } else if (option === '--profile') {
      options.profile = rawOptions[index + 1];
      index += 1;
      if (!options.profile || options.profile.startsWith('-')) {
        throw new CliError('--profile requires a profile name.');
      }
    } else if (option === '--help' || option === '-h') {
      return { command: 'help', options };
    } else {
      throw new CliError(`Unknown option: ${option}`);
    }
  }

  if (!['init', 'status', 'update', 'uninstall', 'help'].includes(command)) {
    throw new CliError(`Unknown command: ${command}`);
  }
  if (options.profile && command !== 'init') {
    throw new CliError('--profile is only supported by init.');
  }
  if (options.force && !['update', 'uninstall'].includes(command)) {
    throw new CliError('--force is only supported by update and uninstall.');
  }

  return { command, options };
}

async function findGitRoot(cwd) {
  let candidate = resolve(cwd);

  while (true) {
    if (existsSync(join(candidate, '.git'))) {
      return realpath(candidate);
    }

    const parent = dirname(candidate);
    if (parent === candidate) {
      throw new CliError('Run this command from a Git repository or one of its subdirectories.');
    }
    candidate = parent;
  }
}

async function initialize(root, options, io) {
  const existingManifest = await readManifest(root);
  if (existingManifest) {
    throw new CliError('This repository is already initialized. Use update or uninstall instead.');
  }

  const profile = options.profile ?? 'core';
  const profileData = await profileEntries(profile);
  const targets = profileData.entries.map(({ target }) => join(root, '.agents', 'skills', target));

  for (const target of targets) {
    await assertNoSymlinkComponents(root, target);
    if (existsSync(target)) {
      throw new CliError(`Refusing to overwrite non-managed skill directory: ${relative(root, target)}`);
    }
  }

  const agentsPlan = await markerPlan(root, 'upsert', markerBlock(profileData.agentRoutes));
  const ignorePlan = await gitignorePlan(root);
  const manifest = await buildManifest(profile, profileData.entries);

  if (options.dryRun) {
    reportInitPlan(profile, profileData.entries, agentsPlan, ignorePlan, io);
    return 0;
  }

  const createdTargets = [];
  try {
    await mkdir(join(root, '.agents', 'skills'), { recursive: true });
    for (const entry of profileData.entries) {
      const target = join(root, '.agents', 'skills', entry.target);
      createdTargets.push(target);
      await copyEntry(entry, target);
    }
    await applyPlan(agentsPlan);
    await applyPlan(ignorePlan);
    await writeManifest(root, manifest);
  } catch (error) {
    for (const target of createdTargets.reverse()) {
      try {
        await rm(target, { recursive: true, force: true });
      } catch {
        // A blocked ancestor can make one target unremovable; continue rolling back earlier copies.
      }
    }
    await restorePlan(agentsPlan);
    await restorePlan(ignorePlan);
    await rm(manifestPath(root), { force: true });
    throw error;
  }
  io.log(`Initialized ${profile} profile with ${profileData.entries.length} managed entries.`);
  return 0;
}

async function showStatus(root, io) {
  const manifest = await readManifest(root);
  if (!manifest) {
    io.log('No Linxira manifest found.');
    return 0;
  }

  await assertManifestTargetsSafe(root, manifest);
  const statuses = await managedStatuses(root, manifest);
  io.log(`Profile: ${manifest.profile}`);
  for (const { id, state } of statuses) {
    io.log(`${id}: ${state}`);
  }

  return statuses.some(({ state }) => state !== 'ok') ? 1 : 0;
}

async function update(root, options, io) {
  const manifest = await readManifest(root);
  if (!manifest) {
    throw new CliError('No Linxira manifest found. Run init first.');
  }

  await assertManifestTargetsSafe(root, manifest);
  const profileData = await profileEntries(manifest.profile);
  for (const { target } of profileData.entries) {
    await assertNoSymlinkComponents(root, join(root, '.agents', 'skills', target));
  }
  const currentStatuses = await managedStatuses(root, manifest);
  const divergent = currentStatuses.filter(({ state }) => state !== 'ok');
  if (divergent.length > 0 && !options.force) {
    throw new CliError(`Refusing to replace modified managed entries: ${divergent.map(({ id }) => id).join(', ')}. Re-run with --force after review.`);
  }

  const managedTargets = new Set(Object.values(manifest.entries).map(({ path }) => path));
  const desiredEntries = new Map(profileData.entries.map((entry) => [entry.id, entry]));
  for (const { id, target } of profileData.entries) {
    const targetPath = join(root, '.agents', 'skills', target);
    if (existsSync(targetPath) && !managedTargets.has(target)) {
      throw new CliError(`Refusing to overwrite non-managed Linxira path: ${relative(root, targetPath)}`);
    }
  }

  const agentsPlan = await markerPlan(root, 'upsert', markerBlock(profileData.agentRoutes));
  const ignorePlan = await gitignorePlan(root);
  const nextManifest = await buildManifest(manifest.profile, profileData.entries);
  const removals = Object.entries(manifest.entries).filter(([id, record]) => {
    const desired = desiredEntries.get(id);
    return !desired || desired.target !== record.path;
  });

  if (options.dryRun) {
    for (const { target } of profileData.entries) {
      io.log(`[dry-run] refresh .agents/skills/${target}`);
    }
    for (const [, record] of removals) {
      io.log(`[dry-run] remove .agents/skills/${record.path}`);
    }
    reportPlans(agentsPlan, ignorePlan, io);
    io.log('[dry-run] write .linxira/manifest.json');
    return 0;
  }

  const backupRoot = join(root, '.linxira', `.update-backup-${process.pid}-${Date.now()}`);
  const moved = [];
  const copiedTargets = [];
  try {
    for (const record of Object.values(manifest.entries)) {
      const target = join(root, '.agents', 'skills', record.path);
      if (!existsSync(target)) {
        continue;
      }
      const backup = join(backupRoot, ...record.path.split('/'));
      await mkdir(dirname(backup), { recursive: true });
      await rename(target, backup);
      moved.push({ target, backup });
    }
    for (const entry of profileData.entries) {
      const target = join(root, '.agents', 'skills', entry.target);
      copiedTargets.push(target);
      await copyEntry(entry, target);
    }
    await applyPlan(agentsPlan);
    await applyPlan(ignorePlan);
    await writeManifest(root, nextManifest);
  } catch (error) {
    for (const target of copiedTargets.reverse()) {
      await rm(target, { recursive: true, force: true });
    }
    await restorePlan(agentsPlan);
    await restorePlan(ignorePlan);
    for (const { target, backup } of moved.reverse()) {
      await mkdir(dirname(target), { recursive: true });
      await rename(backup, target);
    }
    await rm(backupRoot, { recursive: true, force: true });
    throw error;
  }
  try {
    await rm(backupRoot, { recursive: true, force: true });
  } catch {
    io.log(`Updated ${manifest.profile} profile, but backup cleanup requires review: ${relative(root, backupRoot)}`);
  }
  io.log(`Updated ${manifest.profile} profile.`);
  return 0;
}

async function uninstall(root, options, io) {
  const manifest = await readManifest(root);
  if (!manifest) {
    throw new CliError('No Linxira manifest found.');
  }

  await assertManifestTargetsSafe(root, manifest);
  const statuses = await managedStatuses(root, manifest);
  const divergent = statuses.filter(({ state }) => state !== 'ok');
  if (divergent.length > 0 && !options.force) {
    throw new CliError(`Refusing to remove modified managed entries: ${divergent.map(({ id }) => id).join(', ')}. Re-run with --force after review.`);
  }

  const agentsPlan = await markerPlan(root, 'remove');
  if (options.dryRun) {
    for (const { path } of statuses) {
      io.log(`[dry-run] remove .agents/skills/${path}`);
    }
    reportPlans(agentsPlan, undefined, io);
    io.log('[dry-run] remove .linxira/manifest.json');
    return 0;
  }

  const backupRoot = join(root, '.linxira', `.uninstall-backup-${process.pid}-${Date.now()}`);
  const moved = [];
  try {
    for (const { path } of statuses) {
      const target = join(root, '.agents', 'skills', path);
      if (!existsSync(target)) {
        continue;
      }
      const backup = join(backupRoot, ...path.split('/'));
      await mkdir(dirname(backup), { recursive: true });
      await rename(target, backup);
      moved.push({ target, backup });
    }
    await applyPlan(agentsPlan);
    await rm(manifestPath(root), { force: true });
  } catch (error) {
    await restorePlan(agentsPlan);
    for (const { target, backup } of moved.reverse()) {
      await mkdir(dirname(target), { recursive: true });
      await rename(backup, target);
    }
    await rm(backupRoot, { recursive: true, force: true });
    throw error;
  }
  try {
    await rm(backupRoot, { recursive: true, force: true });
  } catch {
    io.log(`Uninstalled ${manifest.profile} profile, but backup cleanup requires review: ${relative(root, backupRoot)}`);
  }
  io.log(`Uninstalled ${manifest.profile} profile.`);
  return 0;
}

async function profileEntries(profileName) {
  const profiles = JSON.parse(await readFile(join(packageRoot, 'payload', 'profiles.json'), 'utf8'));
  const profile = profiles.profiles?.[profileName];
  if (!profile) {
    throw new CliError(`Unknown profile: ${profileName}`);
  }

  if (!Array.isArray(profile.entries) || !Array.isArray(profile.agentRoutes)) {
    throw new CliError(`Packaged profile has an unsupported shape: ${profileName}`);
  }
  const entries = [];
  const ids = new Set();
  const targets = new Set();
  for (const entry of profile.entries) {
    assertEntry(entry);
    if (ids.has(entry.id) || targets.has(entry.target)) {
      throw new CliError(`Packaged profile contains a duplicate entry: ${entry.id}`);
    }
    ids.add(entry.id);
    targets.add(entry.target);
    const source = join(packageRoot, 'payload', ...entry.source.split('/'));
    if (!existsSync(source)) {
      throw new CliError(`Packaged entry is missing: ${entry.id}`);
    }
    entries.push({ ...entry, source });
  }
  for (const route of profile.agentRoutes) {
    if (!route || typeof route.path !== 'string' || typeof route.description !== 'string') {
      throw new CliError(`Packaged profile contains an invalid agent route: ${profileName}`);
    }
    assertManagedPath(route.path);
    if (!targets.has(route.path)) {
      throw new CliError(`Packaged profile advertises a missing agent route: ${route.path}`);
    }
  }
  return { entries, agentRoutes: profile.agentRoutes };
}

function assertEntry(entry) {
  if (!entry) {
    throw new CliError(`Invalid entry id in package payload: ${String(entry?.id)}`);
  }
  assertEntryId(entry.id);
  if (entry.kind !== 'file' && entry.kind !== 'directory') {
    throw new CliError(`Invalid entry kind in package payload: ${String(entry.kind)}`);
  }
  assertManagedPath(entry.source);
  assertManagedPath(entry.target);
}

function assertEntryId(value) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(value)) {
    throw new CliError(`Invalid entry id in package payload: ${String(value)}`);
  }
}

function assertManagedPath(value) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9.-]*(?:\/[a-zA-Z0-9][a-zA-Z0-9.-]*)*$/.test(value)) {
    throw new CliError(`Invalid managed path in package payload: ${String(value)}`);
  }
}

async function readManifest(root) {
  const path = manifestPath(root);
  if (!existsSync(path)) {
    return null;
  }

  let manifest;
  try {
    manifest = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    throw new CliError('The Linxira manifest is not valid JSON. Repair or remove it before continuing.');
  }

  if (!manifest || manifest.schemaVersion !== 2 || typeof manifest.profile !== 'string' || !manifest.entries || typeof manifest.entries !== 'object') {
    throw new CliError('The Linxira manifest has an unsupported shape.');
  }
  for (const [id, record] of Object.entries(manifest.entries)) {
    assertEntryId(id);
    if (!record || typeof record.hash !== 'string' || (record.kind !== 'file' && record.kind !== 'directory')) {
      throw new CliError(`The Linxira manifest entry for ${id} is invalid.`);
    }
    assertManagedPath(record.path);
  }
  return manifest;
}

function manifestPath(root) {
  return join(root, '.linxira', 'manifest.json');
}

async function buildManifest(profile, sources) {
  const packageInfo = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
  const entries = {};
  for (const { id, source, target, kind } of sources) {
    entries[id] = { path: target, kind, hash: await entryHash(source, kind) };
  }

  return {
    schemaVersion: 2,
    installerVersion: packageInfo.version,
    payloadVersion: packageInfo.version,
    profile,
    entries,
  };
}

async function writeManifest(root, manifest) {
  await mkdir(dirname(manifestPath(root)), { recursive: true });
  await atomicWriteFile(manifestPath(root), `${JSON.stringify(manifest, null, 2)}\n`);
}

async function managedStatuses(root, manifest) {
  const statuses = [];
  for (const [id, record] of Object.entries(manifest.entries).sort(([left], [right]) => left.localeCompare(right))) {
    const target = join(root, '.agents', 'skills', record.path);
    let state = 'ok';
    if (!existsSync(target)) {
      state = 'missing';
    } else {
      try {
        if (await entryHash(target, record.kind) === record.hash) {
          state = 'ok';
        } else {
          state = 'modified';
        }
      } catch {
        state = 'modified';
      }
    }
    statuses.push({ id, path: record.path, state });
  }
  return statuses;
}

async function copyEntry(entry, target) {
  await mkdir(dirname(target), { recursive: true });
  await cp(entry.source, target, { recursive: entry.kind === 'directory', errorOnExist: true });
}

async function entryHash(path, kind) {
  const details = await stat(path);
  if (kind === 'file') {
    if (!details.isFile()) {
      throw new CliError(`Managed entry is not a file: ${path}`);
    }
    return createHash('sha256').update(await readFile(path)).digest('hex');
  }
  if (!details.isDirectory()) {
    throw new CliError(`Managed entry is not a directory: ${path}`);
  }
  return directoryHash(path);
}

async function directoryHash(directory) {
  const hash = createHash('sha256');

  async function visit(current) {
    const entries = await readdir(current, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) {
        hash.update(`directory:${relative(directory, path)}\n`);
        await visit(path);
      } else if (entry.isFile()) {
        hash.update(`file:${relative(directory, path)}\n`);
        hash.update(await readFile(path));
      } else {
        throw new CliError(`Managed skill contains an unsupported filesystem entry: ${relative(directory, path)}`);
      }
    }
  }

  await visit(directory);
  return hash.digest('hex');
}

function markerBlock(routes) {
  const routeLines = routes
    .map(({ path, description }) => `- ${description}\n  Read \`.agents/skills/${path}\`.`)
    .join('\n');
  return markerTemplate.replace('{{routes}}', routeLines);
}

async function markerPlan(root, action, block = '') {
  const path = join(root, 'AGENTS.md');
  const existed = existsSync(path);
  const before = existed ? await readFile(path, 'utf8') : '';
  const after = action === 'upsert' ? upsertMarker(before, block) : removeMarker(before);
  return { path, before, after, existed, label: 'AGENTS.md marker block' };
}

function upsertMarker(content, block) {
  const bounds = markerBounds(content);
  if (!bounds) {
    if (!content) {
      return block;
    }
    const separator = content.endsWith('\n') ? '' : '\n';
    return `${content}${separator}${block}`;
  }
  return `${content.slice(0, bounds.start)}${block}${content.slice(bounds.afterEnd)}`;
}

function removeMarker(content) {
  const bounds = markerBounds(content);
  if (!bounds) {
    return content;
  }
  return `${content.slice(0, bounds.start)}${content.slice(bounds.afterEnd)}`;
}

function markerBounds(content) {
  const start = content.indexOf(markerStart);
  const end = content.indexOf(markerEnd);
  if (start === -1 && end === -1) {
    return null;
  }
  if (start === -1 || end === -1 || end < start || content.indexOf(markerStart, start + markerStart.length) !== -1 || content.indexOf(markerEnd, end + markerEnd.length) !== -1) {
    throw new CliError('AGENTS.md contains malformed or duplicate Linxira markers. Repair them before continuing.');
  }
  return { start, afterEnd: end + markerEnd.length };
}

async function gitignorePlan(root) {
  const path = join(root, '.gitignore');
  const existed = existsSync(path);
  const before = existed ? await readFile(path, 'utf8') : '';
  const existing = new Set(before.split(/\r?\n/));
  const missing = requiredIgnoreEntries.filter((entry) => !existing.has(entry));
  if (missing.length === 0) {
    return { path, before, after: before, existed, label: '.gitignore entries' };
  }
  const prefix = before && !before.endsWith('\n') ? `${before}\n` : before;
  return { path, before, after: `${prefix}${missing.join('\n')}\n`, existed, label: '.gitignore entries' };
}

async function applyPlan(plan) {
  if (plan.after !== plan.before) {
    await mkdir(dirname(plan.path), { recursive: true });
    await atomicWriteFile(plan.path, plan.after);
  }
}

async function restorePlan(plan) {
  if (plan.after === plan.before) {
    return;
  }
  if (!plan.existed) {
    await rm(plan.path, { force: true });
    return;
  }
  await atomicWriteFile(plan.path, plan.before);
}

async function atomicWriteFile(path, content) {
  const temporary = `${path}.linxira-${process.pid}-${Date.now()}.tmp`;
  await writeFile(temporary, content);
  try {
    await rename(temporary, path);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
}

async function assertManifestTargetsSafe(root, manifest) {
  for (const record of Object.values(manifest.entries)) {
    await assertNoSymlinkComponents(root, join(root, '.agents', 'skills', record.path));
  }
}

async function assertNoSymlinkComponents(root, target) {
  const path = relative(root, target);
  if (isAbsolute(path) || path === '..' || path.startsWith('../') || path.startsWith('..\\')) {
    throw new CliError(`Managed path escapes the repository: ${target}`);
  }
  let current = root;
  for (const segment of path.split(/[\\/]/).filter(Boolean)) {
    current = join(current, segment);
    if (!existsSync(current)) {
      continue;
    }
    if ((await lstat(current)).isSymbolicLink()) {
      throw new CliError(`Refusing to use a symbolic link in a managed path: ${relative(root, current)}`);
    }
  }
}

async function withOperationLock(root, command, action) {
  const lockPath = join(root, '.linxira', 'operation.lock');
  await assertNoSymlinkComponents(root, lockPath);
  await mkdir(dirname(lockPath), { recursive: true });
  let handle;
  try {
    handle = await open(lockPath, 'wx');
    await handle.writeFile(`${JSON.stringify({ pid: process.pid, command, startedAt: new Date().toISOString() })}\n`);
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new CliError('Another Linxira lifecycle operation is in progress. Review .linxira/operation.lock if no process is active.');
    }
    throw error;
  }

  try {
    return await action();
  } finally {
    await handle.close();
    await rm(lockPath, { force: true });
  }
}

function reportInitPlan(profile, sources, agentsPlan, ignorePlan, io) {
  for (const { target } of sources) {
    io.log(`[dry-run] copy .agents/skills/${target}`);
  }
  reportPlans(agentsPlan, ignorePlan, io);
  io.log(`[dry-run] write .linxira/manifest.json for ${profile}`);
}

function reportPlans(agentsPlan, ignorePlan, io) {
  for (const plan of [agentsPlan, ignorePlan].filter(Boolean)) {
    if (plan.after !== plan.before) {
      io.log(`[dry-run] update ${plan.label}`);
    }
  }
}

function helpText() {
  return `Usage: linxira-skills <command> [options]\n\nCommands:\n  init [--profile core] [--dry-run]\n  status\n  update [--dry-run] [--force]\n  uninstall [--dry-run] [--force]`;
}
