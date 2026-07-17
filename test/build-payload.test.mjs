import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function buildFixture(context, options = {}) {
  const root = await mkdtemp(join(tmpdir(), 'linxira-build-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  for (const directory of [
    'scripts',
    'skills/example-skill',
    'catalog',
    'profiles',
    'routes/research/example',
  ]) {
    await mkdir(join(root, ...directory.split('/')), { recursive: true });
  }
  await cp(join(packageRoot, 'scripts', 'build-payload.mjs'), join(root, 'scripts', 'build-payload.mjs'));
  await writeFile(join(root, 'skills', 'example-skill', 'SKILL.md'), `---
name: example-skill
description: Use for the fixture task and not for unrelated work.
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# Example
`);
  const layout = { schemaVersion: 1, skills: { 'example-skill': 'research/example/example-skill' } };
  const profile = {
    schemaVersion: 2,
    status: options.status ?? 'approved-for-packaging',
    name: 'core',
    baseProfile: null,
    firstPartySkills: ['example-skill'],
    sourceTracks: options.sourceTracks ?? [],
    skills: [],
  };
  await writeFile(join(root, 'catalog', 'first-party-layout.json'), `${JSON.stringify(layout, null, 2)}\n`);
  await writeFile(join(root, 'profiles', 'core.json'), `${JSON.stringify(profile, null, 2)}\n`);
  await writeFile(join(root, 'routes', 'research', 'SKILL.md'), options.router ?? `---
name: fixture-research-router
description: Route fixture research tasks.
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# Research

- Fixture branch: \`example/INDEX.md\`
`);
  await writeFile(join(root, 'routes', 'research', 'example', 'INDEX.md'), `# Example

- Fixture skill: \`example-skill/SKILL.md\`
`);
  return root;
}

function runBuild(root) {
  return execFileSync(process.execPath, ['scripts/build-payload.mjs'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

test('payload builder accepts a minimal valid profile', async (context) => {
  const root = await buildFixture(context);
  runBuild(root);
  const profiles = JSON.parse(await readFile(join(root, 'payload', 'profiles.json'), 'utf8'));
  assert.deepEqual(Object.keys(profiles.profiles), ['core']);
});

test('payload builder rejects invalid status and escaping paths', async (context) => {
  const invalidStatusRoot = await buildFixture(context, { status: 'approved-for-packagin' });
  assert.throws(() => runBuild(invalidStatusRoot), /Invalid profile status/);

  const unsafePathRoot = await buildFixture(context, {
    sourceTracks: [{
      id: 'unsafe',
      repositoryPath: '../outside',
      skillRoot: '../outside',
      revision: '0'.repeat(40),
      license: 'MIT',
      notice: '../outside/LICENSE',
      noticeTarget: '../package.json',
    }],
  });
  assert.throws(() => runBuild(unsafePathRoot), /Invalid portable relative path|Invalid filename/);
});

test('payload builder rejects malformed router metadata', async (context) => {
  const root = await buildFixture(context, {
    router: `---
name: fixture-research-router
description: Route fixture research tasks.
skill_class: workflow
load_policy: conditional
---

# Research

- Fixture branch: \`example/INDEX.md\`
`,
  });
  assert.throws(() => runBuild(root), /Invalid first-party metadata|inline YAML list/);
});
