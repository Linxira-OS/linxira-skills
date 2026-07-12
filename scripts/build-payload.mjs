import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = join(root, 'skills');
const payloadRoot = join(root, 'payload');
const payloadSkills = join(payloadRoot, 'skills');
const lifeSciencesProfile = JSON.parse(await readFile(join(root, 'profiles', 'life-sciences-core.json'), 'utf8'));

if (lifeSciencesProfile.status !== 'approved-for-packaging') {
  throw new Error('life-sciences-core is not approved for packaging.');
}

const entries = await readdir(sourceRoot, { withFileTypes: true });
const skillDirectories = entries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right));

const catalog = [];
for (const directory of skillDirectories) {
  const body = await readFile(join(sourceRoot, directory, 'SKILL.md'), 'utf8');
  const name = frontmatterValue(body, 'name');
  const description = frontmatterValue(body, 'description');
  if (!name || !description) {
    throw new Error(`Missing name or description in skills/${directory}/SKILL.md`);
  }
  catalog.push({ name, description, source: 'first-party' });
}

const coreSkillNames = catalog.map(({ name }) => name);
const lifeSciencesSkillNames = [...coreSkillNames];
for (const skill of lifeSciencesProfile.skills) {
  assertRelativeSkillPath(skill.relativePath);
  const source = join(root, 'sources', 'bioSkills', skill.relativePath);
  const body = await readFile(join(source, 'SKILL.md'), 'utf8');
  const name = frontmatterValue(body, 'name');
  const description = frontmatterValue(body, 'description');
  const bodySha256 = createHash('sha256').update(body).digest('hex');
  if (name !== skill.name || !description || bodySha256 !== skill.bodySha256) {
    throw new Error(`Reviewed source skill changed or is invalid: ${skill.relativePath}`);
  }
  if (lifeSciencesSkillNames.includes(name)) {
    throw new Error(`Duplicate profile skill name: ${name}`);
  }
  lifeSciencesSkillNames.push(name);
  catalog.push({
    name,
    description,
    source: 'bioSkills',
    sourceRevision: lifeSciencesProfile.sourceTracks[0].revision,
    license: lifeSciencesProfile.sourceTracks[0].license,
    loadPolicy: skill.loadPolicy,
    riskTags: skill.riskTags,
  });
}

await rm(payloadRoot, { recursive: true, force: true });
await mkdir(payloadRoot, { recursive: true });
await cp(sourceRoot, payloadSkills, { recursive: true });
for (const skill of lifeSciencesProfile.skills) {
  const source = join(root, 'sources', 'bioSkills', skill.relativePath);
  const target = join(payloadSkills, skill.name);
  await mkdir(target, { recursive: true });
  await cp(join(source, 'SKILL.md'), join(target, 'SKILL.md'));
}
await mkdir(join(payloadRoot, 'notices'), { recursive: true });
await cp(join(root, lifeSciencesProfile.sourceTracks[0].notice), join(payloadRoot, 'notices', 'bioSkills-MIT.txt'));
await writeFile(join(payloadRoot, 'profiles.json'), `${JSON.stringify({ version: 1, profiles: { core: { skills: coreSkillNames }, 'life-sciences-core': { skills: lifeSciencesSkillNames } } }, null, 2)}\n`);
await writeFile(join(payloadRoot, 'catalog.json'), `${JSON.stringify({ version: 1, skills: catalog }, null, 2)}\n`);

function frontmatterValue(body, key) {
  const match = body.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '');
}

function assertRelativeSkillPath(value) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*$/.test(value)) {
    throw new Error(`Invalid reviewed source path: ${String(value)}`);
  }
}
