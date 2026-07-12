import { createHash } from 'node:crypto';
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const markerStart = '<!-- linxira-skills:start -->';
const markerEnd = '<!-- linxira-skills:end -->';
const markerBlock = (await readFile(join(packageRoot, 'templates', 'AGENTS.md.fragment'), 'utf8')).trimEnd();
const requiredIgnoreEntries = ['.agents/skills/', '.linxira/'];

class CliError extends Error {}

export async function run(argv, cwd = process.cwd(), io = console) {
  const { command, options } = parseArguments(argv);

  if (command === 'help') {
    io.log(helpText());
    return 0;
  }

  const root = await findGitRoot(cwd);

  if (command === 'init') {
    return initialize(root, options, io);
  }
  if (command === 'status') {
    return showStatus(root, io);
  }
  if (command === 'update') {
    return update(root, options, io);
  }
  if (command === 'uninstall') {
    return uninstall(root, options, io);
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
      return candidate;
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
  const sources = await profileSources(profile);
  const targets = sources.map(({ name }) => join(root, '.agents', 'skills', name));

  for (const target of targets) {
    if (existsSync(target)) {
      throw new CliError(`Refusing to overwrite non-managed skill directory: ${relative(root, target)}`);
    }
  }

  const agentsPlan = await markerPlan(root, 'upsert');
  const ignorePlan = await gitignorePlan(root);
  const manifest = await buildManifest(profile, sources);

  if (options.dryRun) {
    reportInitPlan(profile, sources, agentsPlan, ignorePlan, io);
    return 0;
  }

  await mkdir(join(root, '.agents', 'skills'), { recursive: true });
  for (const { name, source } of sources) {
    await cp(source, join(root, '.agents', 'skills', name), { recursive: true, errorOnExist: true });
  }
  await applyPlan(agentsPlan);
  await applyPlan(ignorePlan);
  await writeManifest(root, manifest);
  io.log(`Initialized ${profile} profile with ${sources.length} skills.`);
  return 0;
}

async function showStatus(root, io) {
  const manifest = await readManifest(root);
  if (!manifest) {
    io.log('No Linxira manifest found.');
    return 0;
  }

  const statuses = await managedStatuses(root, manifest);
  io.log(`Profile: ${manifest.profile}`);
  for (const { name, state } of statuses) {
    io.log(`${name}: ${state}`);
  }

  return statuses.some(({ state }) => state !== 'ok') ? 1 : 0;
}

async function update(root, options, io) {
  const manifest = await readManifest(root);
  if (!manifest) {
    throw new CliError('No Linxira manifest found. Run init first.');
  }

  const sources = await profileSources(manifest.profile);
  const currentStatuses = await managedStatuses(root, manifest);
  const divergent = currentStatuses.filter(({ state }) => state !== 'ok');
  if (divergent.length > 0 && !options.force) {
    throw new CliError(`Refusing to replace modified managed skills: ${divergent.map(({ name }) => name).join(', ')}. Re-run with --force after review.`);
  }

  const managed = new Set(Object.keys(manifest.skills));
  const desired = new Set(sources.map(({ name }) => name));
  for (const { name } of sources) {
    const target = join(root, '.agents', 'skills', name);
    if (existsSync(target) && !managed.has(name)) {
      throw new CliError(`Refusing to overwrite non-managed skill directory: ${relative(root, target)}`);
    }
  }

  const agentsPlan = await markerPlan(root, 'upsert');
  const ignorePlan = await gitignorePlan(root);
  const nextManifest = await buildManifest(manifest.profile, sources);
  const removals = [...managed].filter((name) => !desired.has(name));

  if (options.dryRun) {
    for (const { name } of sources) {
      io.log(`[dry-run] refresh .agents/skills/${name}`);
    }
    for (const name of removals) {
      io.log(`[dry-run] remove .agents/skills/${name}`);
    }
    reportPlans(agentsPlan, ignorePlan, io);
    io.log('[dry-run] write .linxira/manifest.json');
    return 0;
  }

  for (const name of removals) {
    await rm(join(root, '.agents', 'skills', name), { recursive: true, force: true });
  }
  for (const { name, source } of sources) {
    const target = join(root, '.agents', 'skills', name);
    await rm(target, { recursive: true, force: true });
    await cp(source, target, { recursive: true, errorOnExist: true });
  }
  await applyPlan(agentsPlan);
  await applyPlan(ignorePlan);
  await writeManifest(root, nextManifest);
  io.log(`Updated ${manifest.profile} profile.`);
  return 0;
}

async function uninstall(root, options, io) {
  const manifest = await readManifest(root);
  if (!manifest) {
    throw new CliError('No Linxira manifest found.');
  }

  const statuses = await managedStatuses(root, manifest);
  const divergent = statuses.filter(({ state }) => state !== 'ok');
  if (divergent.length > 0 && !options.force) {
    throw new CliError(`Refusing to remove modified managed skills: ${divergent.map(({ name }) => name).join(', ')}. Re-run with --force after review.`);
  }

  const agentsPlan = await markerPlan(root, 'remove');
  if (options.dryRun) {
    for (const { name } of statuses) {
      io.log(`[dry-run] remove .agents/skills/${name}`);
    }
    reportPlans(agentsPlan, undefined, io);
    io.log('[dry-run] remove .linxira/manifest.json');
    return 0;
  }

  for (const { name } of statuses) {
    await rm(join(root, '.agents', 'skills', name), { recursive: true, force: true });
  }
  await applyPlan(agentsPlan);
  await rm(manifestPath(root), { force: true });
  io.log(`Uninstalled ${manifest.profile} profile.`);
  return 0;
}

async function profileSources(profileName) {
  const profiles = JSON.parse(await readFile(join(packageRoot, 'payload', 'profiles.json'), 'utf8'));
  const profile = profiles.profiles?.[profileName];
  if (!profile) {
    throw new CliError(`Unknown profile: ${profileName}`);
  }

  const sources = [];
  for (const name of profile.skills) {
    assertSkillName(name);
    const source = join(packageRoot, 'payload', 'skills', name);
    if (!existsSync(source)) {
      throw new CliError(`Packaged skill is missing: ${name}`);
    }
    sources.push({ name, source });
  }
  return sources;
}

function assertSkillName(name) {
  if (typeof name !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    throw new CliError(`Invalid skill name in package payload: ${String(name)}`);
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

  if (!manifest || typeof manifest.profile !== 'string' || !manifest.skills || typeof manifest.skills !== 'object') {
    throw new CliError('The Linxira manifest has an unsupported shape.');
  }
  for (const [name, record] of Object.entries(manifest.skills)) {
    assertSkillName(name);
    if (!record || typeof record.hash !== 'string') {
      throw new CliError(`The Linxira manifest entry for ${name} is invalid.`);
    }
  }
  return manifest;
}

function manifestPath(root) {
  return join(root, '.linxira', 'manifest.json');
}

async function buildManifest(profile, sources) {
  const packageInfo = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
  const skills = {};
  for (const { name, source } of sources) {
    skills[name] = { hash: await directoryHash(source) };
  }

  return {
    schemaVersion: 1,
    installerVersion: packageInfo.version,
    payloadVersion: packageInfo.version,
    profile,
    skills,
  };
}

async function writeManifest(root, manifest) {
  await mkdir(dirname(manifestPath(root)), { recursive: true });
  await writeFile(manifestPath(root), `${JSON.stringify(manifest, null, 2)}\n`);
}

async function managedStatuses(root, manifest) {
  const statuses = [];
  for (const [name, record] of Object.entries(manifest.skills).sort(([left], [right]) => left.localeCompare(right))) {
    const target = join(root, '.agents', 'skills', name);
    let state = 'ok';
    if (!existsSync(target)) {
      state = 'missing';
    } else {
      try {
        if ((await stat(target)).isDirectory() && await directoryHash(target) === record.hash) {
          state = 'ok';
        } else {
          state = 'modified';
        }
      } catch {
        state = 'modified';
      }
    }
    statuses.push({ name, state });
  }
  return statuses;
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

async function markerPlan(root, action) {
  const path = join(root, 'AGENTS.md');
  const before = existsSync(path) ? await readFile(path, 'utf8') : '';
  const after = action === 'upsert' ? upsertMarker(before) : removeMarker(before);
  return { path, before, after, label: 'AGENTS.md marker block' };
}

function upsertMarker(content) {
  const bounds = markerBounds(content);
  if (!bounds) {
    if (!content) {
      return markerBlock;
    }
    const separator = content.endsWith('\n') ? '' : '\n';
    return `${content}${separator}${markerBlock}`;
  }
  return `${content.slice(0, bounds.start)}${markerBlock}${content.slice(bounds.afterEnd)}`;
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
  const before = existsSync(path) ? await readFile(path, 'utf8') : '';
  const existing = new Set(before.split(/\r?\n/));
  const missing = requiredIgnoreEntries.filter((entry) => !existing.has(entry));
  if (missing.length === 0) {
    return { path, before, after: before, label: '.gitignore entries' };
  }
  const prefix = before && !before.endsWith('\n') ? `${before}\n` : before;
  return { path, before, after: `${prefix}${missing.join('\n')}\n`, label: '.gitignore entries' };
}

async function applyPlan(plan) {
  if (plan.after !== plan.before) {
    await mkdir(dirname(plan.path), { recursive: true });
    await writeFile(plan.path, plan.after);
  }
}

function reportInitPlan(profile, sources, agentsPlan, ignorePlan, io) {
  for (const { name } of sources) {
    io.log(`[dry-run] copy .agents/skills/${name}`);
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
