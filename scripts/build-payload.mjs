import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = join(root, 'skills');
const payloadRoot = join(root, 'payload');
const payloadSkills = join(payloadRoot, 'skills');

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

await rm(payloadRoot, { recursive: true, force: true });
await mkdir(payloadRoot, { recursive: true });
await cp(sourceRoot, payloadSkills, { recursive: true });
await writeFile(join(payloadRoot, 'profiles.json'), `${JSON.stringify({ version: 1, profiles: { core: { skills: catalog.map(({ name }) => name) } } }, null, 2)}\n`);
await writeFile(join(payloadRoot, 'catalog.json'), `${JSON.stringify({ version: 1, skills: catalog }, null, 2)}\n`);

function frontmatterValue(body, key) {
  const match = body.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '');
}
