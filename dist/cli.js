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
  rmdir,
  stat,
  writeFile,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
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

  const scope = await resolveScope(options.user, cwd);
  const guardedPaths = scope.user
    ? [scope.skillsDir, scope.manifestFile, scope.lockFile]
    : [
        join(scope.root, 'AGENTS.md'),
        join(scope.root, '.gitignore'),
        scope.skillsDir,
        scope.manifestFile,
      ];
  for (const path of guardedPaths) {
    await assertNoSymlinkComponents(scope.root, path);
  }

  if (command === 'init') {
    return options.dryRun
      ? initialize(scope, options, io)
      : withOperationLock(scope, command, () => initialize(scope, options, io));
  }
  if (command === 'status') {
    return showStatus(scope, io);
  }
  if (command === 'update') {
    return options.dryRun
      ? update(scope, options, io)
      : withOperationLock(scope, command, () => update(scope, options, io));
  }
  if (command === 'uninstall') {
    return options.dryRun
      ? uninstall(scope, options, io)
      : withOperationLock(scope, command, () => uninstall(scope, options, io));
  }

  throw new CliError(`Unknown command: ${command}`);
}

function parseArguments(argv) {
  const [rawCommand = 'help', ...rawOptions] = argv;
  const command = rawCommand === '--help' || rawCommand === '-h' ? 'help' : rawCommand;
  const options = { dryRun: false, force: false, user: false, profile: undefined, layout: undefined };

  for (let index = 0; index < rawOptions.length; index += 1) {
    const option = rawOptions[index];
    if (option === '--dry-run') {
      options.dryRun = true;
    } else if (option === '--force') {
      options.force = true;
    } else if (option === '--user' || option === '--global') {
      options.user = true;
    } else if (option === '--profile') {
      options.profile = rawOptions[index + 1];
      index += 1;
      if (!options.profile || options.profile.startsWith('-')) {
        throw new CliError('--profile requires a profile name.');
      }
    } else if (option === '--layout') {
      options.layout = rawOptions[index + 1];
      index += 1;
      if (!options.layout || options.layout.startsWith('-')) {
        throw new CliError('--layout requires a layout name.');
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
  if (options.layout && command !== 'init') {
    throw new CliError('--layout is only supported by init. The installed layout is recorded in the manifest.');
  }
  if (options.layout && !layoutNames.has(options.layout)) {
    throw new CliError(`Unknown layout: ${options.layout}. Supported layouts: ${[...layoutNames].join(', ')}.`);
  }
  if (options.force && !['update', 'uninstall'].includes(command)) {
    throw new CliError('--force is only supported by update and uninstall.');
  }

  return { command, options };
}

const layoutNames = new Set(['namespaced', 'flat']);

function applyLayout(layout, target) {
  if (layout !== 'namespaced') {
    return target;
  }
  const separator = target.indexOf('/');
  return separator === -1 ? `linxira-${target}` : `linxira-${target.slice(0, separator)}${target.slice(separator)}`;
}

function applyLayoutToEntries(layout, entries) {
  return entries.map((entry) => ({ ...entry, target: applyLayout(layout, entry.target) }));
}

function applyLayoutToAgentRoutes(layout, agentRoutes) {
  return agentRoutes.map((route) => ({ ...route, path: applyLayout(layout, route.path) }));
}

function manifestLayout(manifest) {
  return manifest.layout ?? 'flat';
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

async function resolveScope(user, cwd) {
  if (user) {
    const configured = process.env.LINXIRA_SKILLS_HOME;
    const root = resolve(configured && configured.trim() ? configured : homedir());
    return buildScope(root, true);
  }
  return buildScope(await findGitRoot(cwd), false);
}

// Project scope keeps .linxira/ build state in the repository. User scope
// stores only what agents must read: skills under .agents/skills/ and the
// manifest beside them. No .linxira directory is created in the home root.
function buildScope(root, user) {
  const agentsDir = join(root, '.agents');
  return {
    root,
    user,
    agentsDir,
    skillsDir: join(agentsDir, 'skills'),
    manifestFile: user ? join(agentsDir, 'linxira-skills.json') : join(root, '.linxira', 'manifest.json'),
    lockFile: user ? join(agentsDir, 'linxira-skills.lock') : join(root, '.linxira', 'operation.lock'),
    backupDir: user ? agentsDir : join(root, '.linxira'),
    manifestLabel: user ? '.agents/linxira-skills.json' : '.linxira/manifest.json',
    lockLabel: user ? '.agents/linxira-skills.lock' : '.linxira/operation.lock',
  };
}

async function initialize(scope, options, io) {
  const { root } = scope;
  if (scope.user) {
    io.log('Warning: a user-scope install makes skills visible to every project and consumes agent context; prefer project scope unless intentional.');
  }

  const existingManifest = await readManifest(scope);
  if (existingManifest) {
    throw new CliError(scope.user
      ? 'The user scope is already initialized. Use update or uninstall instead.'
      : 'This repository is already initialized. Use update or uninstall instead.');
  }

  const layout = options.layout ?? 'namespaced';
  const profile = options.profile ?? 'core';
  const profileData = await profileEntries(profile);
  const entries = applyLayoutToEntries(layout, profileData.entries);
  const agentRoutes = applyLayoutToAgentRoutes(layout, profileData.agentRoutes);
  const targets = entries.map(({ target }) => join(scope.skillsDir, target));

  for (const target of targets) {
    await assertNoSymlinkComponents(root, target);
    if (existsSync(target)) {
      throw new CliError(`Refusing to overwrite non-managed skill directory: ${relative(root, target)}`);
    }
  }

  // User scope must not touch AGENTS.md or .gitignore: it is shared by every
  // project and must not advertise project-specific routes.
  const agentsPlan = scope.user ? undefined : await markerPlan(root, 'upsert', markerBlock(agentRoutes));
  const ignorePlan = scope.user ? undefined : await gitignorePlan(root);
  const manifest = await buildManifest(layout, profile, entries);

  if (options.dryRun) {
    reportInitPlan(scope, profile, entries, agentsPlan, ignorePlan, io);
    return 0;
  }

  const createdTargets = [];
  try {
    await mkdir(scope.skillsDir, { recursive: true });
    for (const entry of entries) {
      const target = join(scope.skillsDir, entry.target);
      createdTargets.push(target);
      await copyEntry(entry, target);
    }
    if (agentsPlan) {
      await applyPlan(agentsPlan);
    }
    if (ignorePlan) {
      await applyPlan(ignorePlan);
    }
    await writeManifest(scope, manifest);
  } catch (error) {
    for (const target of createdTargets.reverse()) {
      try {
        await rm(target, { recursive: true, force: true });
      } catch {
        // A blocked ancestor can make one target unremovable; continue rolling back earlier copies.
      }
    }
    if (agentsPlan) {
      await restorePlan(agentsPlan);
    }
    if (ignorePlan) {
      await restorePlan(ignorePlan);
    }
    await rm(scope.manifestFile, { force: true });
    throw error;
  }
  io.log(`Initialized ${profile} profile with ${entries.length} managed entries (${layout} layout${scope.user ? ', user scope' : ''}).`);
  return 0;
}

async function showStatus(scope, io) {
  const manifest = await readManifest(scope);
  if (!manifest) {
    io.log('No Linxira manifest found.');
    return 0;
  }

  await assertManifestTargetsSafe(scope, manifest);
  const statuses = await managedStatuses(scope, manifest);
  io.log(`Profile: ${manifest.profile}`);
  for (const { id, state } of statuses) {
    io.log(`${id}: ${state}`);
  }

  return statuses.some(({ state }) => state !== 'ok') ? 1 : 0;
}

async function update(scope, options, io) {
  const { root } = scope;
  const manifest = await readManifest(scope);
  if (!manifest) {
    throw new CliError('No Linxira manifest found. Run init first.');
  }

  await assertManifestTargetsSafe(scope, manifest);
  const layout = manifestLayout(manifest);
  const profileData = await profileEntries(manifest.profile);
  const entries = applyLayoutToEntries(layout, profileData.entries);
  const agentRoutes = applyLayoutToAgentRoutes(layout, profileData.agentRoutes);
  for (const { target } of entries) {
    await assertNoSymlinkComponents(root, join(scope.skillsDir, target));
  }
  const currentStatuses = await managedStatuses(scope, manifest);
  const divergent = currentStatuses.filter(({ state }) => state !== 'ok');
  if (divergent.length > 0 && !options.force) {
    throw new CliError(`Refusing to replace modified managed entries: ${divergent.map(({ id }) => id).join(', ')}. Re-run with --force after review.`);
  }

  const managedTargets = new Set(Object.values(manifest.entries).map(({ path }) => path));
  const desiredEntries = new Map(entries.map((entry) => [entry.id, entry]));
  for (const { target } of entries) {
    const targetPath = join(scope.skillsDir, target);
    if (existsSync(targetPath) && !managedTargets.has(target)) {
      throw new CliError(`Refusing to overwrite non-managed Linxira path: ${relative(root, targetPath)}`);
    }
  }

  const agentsPlan = scope.user ? undefined : await markerPlan(root, 'upsert', markerBlock(agentRoutes));
  const ignorePlan = scope.user ? undefined : await gitignorePlan(root);
  const nextManifest = await buildManifest(layout, manifest.profile, entries);
  const removals = Object.entries(manifest.entries).filter(([id, record]) => {
    const desired = desiredEntries.get(id);
    return !desired || desired.target !== record.path;
  });

  if (options.dryRun) {
    for (const { target } of entries) {
      io.log(`[dry-run] refresh .agents/skills/${target}`);
    }
    for (const [, record] of removals) {
      io.log(`[dry-run] remove .agents/skills/${record.path}`);
    }
    reportPlans(agentsPlan, ignorePlan, io);
    io.log(`[dry-run] write ${scope.manifestLabel}`);
    return 0;
  }

  const backupRoot = join(scope.backupDir, `.update-backup-${process.pid}-${Date.now()}`);
  const moved = [];
  const copiedTargets = [];
  try {
    for (const record of Object.values(manifest.entries)) {
      const target = join(scope.skillsDir, record.path);
      if (!existsSync(target)) {
        continue;
      }
      const backup = join(backupRoot, ...record.path.split('/'));
      await mkdir(dirname(backup), { recursive: true });
      await rename(target, backup);
      moved.push({ target, backup });
    }
    for (const entry of entries) {
      const target = join(scope.skillsDir, entry.target);
      copiedTargets.push(target);
      await copyEntry(entry, target);
    }
    if (agentsPlan) {
      await applyPlan(agentsPlan);
    }
    if (ignorePlan) {
      await applyPlan(ignorePlan);
    }
    await pruneEmptyAncestors(root, Object.values(manifest.entries).map(({ path }) => path));
    await writeManifest(scope, nextManifest);
  } catch (error) {
    for (const target of copiedTargets.reverse()) {
      await rm(target, { recursive: true, force: true });
    }
    if (agentsPlan) {
      await restorePlan(agentsPlan);
    }
    if (ignorePlan) {
      await restorePlan(ignorePlan);
    }
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

async function uninstall(scope, options, io) {
  const { root } = scope;
  const manifest = await readManifest(scope);
  if (!manifest) {
    throw new CliError('No Linxira manifest found.');
  }

  await assertManifestTargetsSafe(scope, manifest);
  const statuses = await managedStatuses(scope, manifest);
  const divergent = statuses.filter(({ state }) => state !== 'ok');
  if (divergent.length > 0 && !options.force) {
    throw new CliError(`Refusing to remove modified managed entries: ${divergent.map(({ id }) => id).join(', ')}. Re-run with --force after review.`);
  }

  const agentsPlan = scope.user ? undefined : await markerPlan(root, 'remove');
  if (options.dryRun) {
    for (const { path } of statuses) {
      io.log(`[dry-run] remove .agents/skills/${path}`);
    }
    reportPlans(agentsPlan, undefined, io);
    io.log(`[dry-run] remove ${scope.manifestLabel}`);
    return 0;
  }

  const backupRoot = join(scope.backupDir, `.uninstall-backup-${process.pid}-${Date.now()}`);
  const moved = [];
  try {
    for (const { path } of statuses) {
      const target = join(scope.skillsDir, path);
      if (!existsSync(target)) {
        continue;
      }
      const backup = join(backupRoot, ...path.split('/'));
      await mkdir(dirname(backup), { recursive: true });
      await rename(target, backup);
      moved.push({ target, backup });
    }
    if (agentsPlan) {
      await applyPlan(agentsPlan);
    }
    await pruneEmptyAncestors(root, statuses.map(({ path }) => path));
    await rm(scope.manifestFile, { force: true });
  } catch (error) {
    if (agentsPlan) {
      await restorePlan(agentsPlan);
    }
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

async function readManifest(scope) {
  const path = manifestPath(scope);
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
  if (manifest.layout !== undefined && !layoutNames.has(manifest.layout)) {
    throw new CliError('The Linxira manifest has an unsupported layout value.');
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

function manifestPath(scope) {
  return scope.manifestFile;
}

async function buildManifest(layout, profile, sources) {
  const packageInfo = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
  const entries = {};
  for (const { id, source, target, kind } of sources) {
    entries[id] = { path: target, kind, hash: await entryHash(source, kind) };
  }

  return {
    schemaVersion: 2,
    layout,
    installerVersion: packageInfo.version,
    payloadVersion: packageInfo.version,
    profile,
    entries,
  };
}

async function writeManifest(scope, manifest) {
  await mkdir(dirname(manifestPath(scope)), { recursive: true });
  await atomicWriteFile(manifestPath(scope), `${JSON.stringify(manifest, null, 2)}\n`);
}

async function managedStatuses(scope, manifest) {
  const statuses = [];
  for (const [id, record] of Object.entries(manifest.entries).sort(([left], [right]) => left.localeCompare(right))) {
    const target = join(scope.skillsDir, record.path);
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

async function assertManifestTargetsSafe(scope, manifest) {
  for (const record of Object.values(manifest.entries)) {
    await assertNoSymlinkComponents(scope.root, join(scope.skillsDir, record.path));
  }
}

// After removals, prune now-empty managed ancestor directories so a layout
// root like .agents/skills/linxira-engineering/ does not linger as an empty
// husk. rmdir refuses non-empty directories, so user content is never lost.
async function pruneEmptyAncestors(root, materializedPaths) {
  const skillsRoot = join(root, '.agents', 'skills');
  const candidates = new Set();
  for (const path of materializedPaths) {
    let current = dirname(join(skillsRoot, path));
    while (current !== skillsRoot && current.startsWith(skillsRoot)) {
      candidates.add(current);
      current = dirname(current);
    }
  }
  for (const directory of [...candidates].sort((left, right) => right.length - left.length)) {
    try {
      await rmdir(directory);
    } catch {
      // Still contains managed or user content; keep it.
    }
  }
  try {
    await rmdir(skillsRoot);
  } catch {
    // The skills root still holds other content; keep it.
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

async function withOperationLock(scope, command, action) {
  const lockPath = scope.lockFile;
  await assertNoSymlinkComponents(scope.root, lockPath);
  await mkdir(dirname(lockPath), { recursive: true });
  let handle;
  try {
    handle = await open(lockPath, 'wx');
    await handle.writeFile(`${JSON.stringify({ pid: process.pid, command, startedAt: new Date().toISOString() })}\n`);
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new CliError(`Another Linxira lifecycle operation is in progress. Review ${scope.lockLabel} if no process is active.`);
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

function reportInitPlan(scope, profile, sources, agentsPlan, ignorePlan, io) {
  for (const { target } of sources) {
    io.log(`[dry-run] copy .agents/skills/${target}`);
  }
  reportPlans(agentsPlan, ignorePlan, io);
  io.log(`[dry-run] write ${scope.manifestLabel} for ${profile}`);
}

function reportPlans(agentsPlan, ignorePlan, io) {
  for (const plan of [agentsPlan, ignorePlan].filter(Boolean)) {
    if (plan.after !== plan.before) {
      io.log(`[dry-run] update ${plan.label}`);
    }
  }
}

function helpText() {
  return `Usage: linxira-skills <command> [options]\n\nCommands:\n  init [--profile core] [--layout namespaced|flat] [--user|--global] [--dry-run]\n  status [--user|--global]\n  update [--user|--global] [--dry-run] [--force]\n  uninstall [--user|--global] [--dry-run] [--force]\n\nScopes:\n  project  default; requires a Git repository and installs under the repo root\n  user     installs for the current user under <LINXIRA_SKILLS_HOME or HOME>.\n           Primarily for cross-project tooling; it is visible to every project\n           and consumes agent context, so prefer project scope.\n\nLayouts:\n  namespaced  default; materializes routers as .agents/skills/linxira-<root>/ to\n              avoid collisions with other skills in the same directory\n  flat        materializes routers as .agents/skills/<root>/; matches v0.1.0\n\nPaths (user scope):\n  skills    <scope>/.agents/skills/\n  manifest  <scope>/.agents/linxira-skills.json\n\nExamples:\n  linxira-skills init --profile core\n  linxira-skills status\n  linxira-skills init --user --profile mcp-connectors\n  linxira-skills status --user\n  linxira-skills uninstall --user`;
}
