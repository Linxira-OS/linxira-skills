import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = join(root, 'skills');
const routeRoot = join(root, 'routes');
const payloadRoot = join(root, 'payload');
const payloadSkills = join(payloadRoot, 'skills');
const firstPartyLayout = JSON.parse(await readFile(join(root, 'catalog', 'first-party-layout.json'), 'utf8'));
const reviewedProfiles = [
  {
    manifest: JSON.parse(await readFile(join(root, 'profiles', 'life-sciences-core.json'), 'utf8')),
    sourceRoot: join(root, 'sources', 'bioSkills'),
    catalogSource: 'bioSkills',
    noticeName: 'bioSkills-MIT.txt',
  },
  {
    manifest: JSON.parse(await readFile(join(root, 'profiles', 'html-reporting-core.json'), 'utf8')),
    sourceRoot: join(root, 'sources', 'html-anything', 'next', 'src', 'lib', 'templates', 'skills'),
    catalogSource: 'html-anything',
    noticeName: 'html-anything-Apache-2.0.txt',
  },
];

for (const { manifest } of reviewedProfiles) {
  if (manifest.status !== 'approved-for-packaging') {
    throw new Error(`${manifest.name} is not approved for packaging.`);
  }
}

const entries = await readdir(sourceRoot, { withFileTypes: true });
const skillDirectories = entries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right));

const layoutNames = Object.keys(firstPartyLayout.skills).sort((left, right) => left.localeCompare(right));
if (JSON.stringify(layoutNames) !== JSON.stringify(skillDirectories)) {
  throw new Error('catalog/first-party-layout.json must map every first-party skill exactly once.');
}

const catalog = [];
const firstPartyEntries = [];
for (const directory of skillDirectories) {
  const body = await readFile(join(sourceRoot, directory, 'SKILL.md'), 'utf8');
  const name = frontmatterValue(body, 'name');
  const description = frontmatterValue(body, 'description');
  if (!name || !description) {
    throw new Error(`Missing name or description in skills/${directory}/SKILL.md`);
  }
  const target = firstPartyLayout.skills[name];
  assertTargetPath(target);
  catalog.push({ name, description, source: 'first-party', targetPath: target });
  firstPartyEntries.push({ id: name, source: `skills/${name}`, target, kind: 'directory' });
}

const profileEntries = { core: firstPartyEntries };
const reviewedSkills = [];
const packagedSkillNames = new Set(firstPartyEntries.map(({ id }) => id));
for (const profile of reviewedProfiles) {
  const packagedEntries = [...firstPartyEntries];
  const sourceTrack = profile.manifest.sourceTracks[0];
  for (const skill of profile.manifest.skills) {
    assertRelativeSkillPath(skill.relativePath);
    assertTargetPath(skill.targetPath);
    const source = join(profile.sourceRoot, skill.relativePath);
    const body = await readFile(join(source, 'SKILL.md'), 'utf8');
    const name = frontmatterValue(body, 'name');
    const description = frontmatterValue(body, 'description');
    const bodySha256 = normalizedTextHash(body);
    if (name !== skill.name || !description || bodySha256 !== skill.bodySha256) {
      throw new Error(`Reviewed source skill changed or is invalid: ${skill.relativePath}`);
    }
    if (packagedSkillNames.has(name)) {
      throw new Error(`Duplicate packaged skill name: ${name}`);
    }
    packagedSkillNames.add(name);
    packagedEntries.push({ id: name, source: `skills/${name}`, target: skill.targetPath, kind: 'directory' });
    reviewedSkills.push({ source, name });
    catalog.push({
      name,
      description,
      source: profile.catalogSource,
      sourceRevision: sourceTrack.revision,
      license: sourceTrack.license,
      loadPolicy: skill.loadPolicy,
      riskTags: skill.riskTags,
      targetPath: skill.targetPath,
    });
  }
  profileEntries[profile.manifest.name] = packagedEntries;
}

await rm(payloadRoot, { recursive: true, force: true });
await mkdir(payloadRoot, { recursive: true });
await cp(sourceRoot, payloadSkills, { recursive: true });
for (const skill of reviewedSkills) {
  const target = join(payloadSkills, skill.name);
  await mkdir(target, { recursive: true });
  await cp(join(skill.source, 'SKILL.md'), join(target, 'SKILL.md'));
}
await cp(routeRoot, join(payloadRoot, 'routes'), { recursive: true });
await mkdir(join(payloadRoot, 'notices'), { recursive: true });
for (const profile of reviewedProfiles) {
  await cp(join(root, profile.manifest.sourceTracks[0].notice), join(payloadRoot, 'notices', profile.noticeName));
}
const routeFiles = await collectFiles(routeRoot);
const payloadProfiles = {};
for (const [name, skills] of Object.entries(profileEntries)) {
  const routes = await routesForSkills(routeFiles, skills);
  payloadProfiles[name] = {
    entries: [...routes.entries, ...skills],
    agentRoutes: routes.agentRoutes,
  };
}
await writeFile(join(payloadRoot, 'profiles.json'), `${JSON.stringify({ version: 2, profiles: payloadProfiles }, null, 2)}\n`);
await writeFile(join(payloadRoot, 'catalog.json'), `${JSON.stringify({ version: 1, skills: catalog }, null, 2)}\n`);

function frontmatterValue(body, key) {
  const match = body.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '');
}

function normalizedTextHash(body) {
  return createHash('sha256').update(body.replace(/\r\n/g, '\n')).digest('hex');
}

function assertRelativeSkillPath(value) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*$/.test(value)) {
    throw new Error(`Invalid reviewed source path: ${String(value)}`);
  }
}

function assertTargetPath(value) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*){2}$/.test(value)) {
    throw new Error(`Invalid three-level target path: ${String(value)}`);
  }
}

async function collectFiles(directory) {
  const files = [];
  async function visit(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) {
        await visit(path);
      } else if (entry.isFile()) {
        files.push(path);
      }
    }
  }
  await visit(directory);
  return files.sort((left, right) => left.localeCompare(right));
}

async function routesForSkills(routeFiles, skills) {
  const entries = [];
  const agentRoutes = [];
  for (const path of routeFiles) {
    const target = portablePath(path.slice(routeRoot.length + 1));
    const routeDirectory = portablePath(dirname(target));
    if (!skills.some((skill) => skill.target.startsWith(`${routeDirectory}/`))) {
      continue;
    }
    entries.push({
      id: `route-${target.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/g, '')}`,
      source: `routes/${target}`,
      target,
      kind: 'file',
    });
    if (/^[a-z0-9-]+\/SKILL\.md$/.test(target)) {
      const body = await readFile(path, 'utf8');
      const name = frontmatterValue(body, 'name');
      const description = frontmatterValue(body, 'description');
      const skillClass = frontmatterValue(body, 'skill_class');
      const loadPolicy = frontmatterValue(body, 'load_policy');
      const riskTags = frontmatterValue(body, 'risk_tags');
      if (!name || !description || !skillClass || !loadPolicy || !riskTags) {
        throw new Error(`Invalid top-level route skill: ${target}`);
      }
      agentRoutes.push({ path: target, description });
    }
  }
  return { entries, agentRoutes };
}

function portablePath(value) {
  return value.replace(/\\/g, '/');
}
