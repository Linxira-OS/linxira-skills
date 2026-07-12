import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { run } from '../dist/cli.js';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'linxira-skills-'));
  execFileSync('git', ['init', '--quiet', root]);
  return root;
}

function output() {
  const lines = [];
  return { lines, log: (line) => lines.push(line) };
}

test('init, status, update, and uninstall preserve user-owned content', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  const initialAgents = '# Project Instructions\n\nKeep this text.\n';
  await writeFile(join(root, 'AGENTS.md'), initialAgents);

  const dryRunLog = output();
  assert.equal(await run(['init', '--dry-run'], root, dryRunLog), 0);
  assert.equal(existsSync(join(root, '.linxira', 'manifest.json')), false);
  assert.match(dryRunLog.lines.join('\n'), /copy \.agents\/skills\/bio-analysis-orchestrator/);

  assert.equal(await run(['init'], root, output()), 0);
  const manifestPath = join(root, '.linxira', 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.profile, 'core');
  assert.equal(Object.keys(manifest.skills).length, 14);
  assert.match(await readFile(join(root, 'AGENTS.md'), 'utf8'), /linxira-skills:start/);
  assert.match(await readFile(join(root, '.gitignore'), 'utf8'), /\.agents\/skills\//);
  assert.equal(await run(['status'], root, output()), 0);

  const userSkill = join(root, '.agents', 'skills', 'user-private-skill');
  await mkdir(userSkill);
  await writeFile(join(userSkill, 'SKILL.md'), '# User-owned skill\n');

  const changedSkill = join(root, '.agents', 'skills', 'scientific-software-engineering', 'SKILL.md');
  await writeFile(changedSkill, `${await readFile(changedSkill, 'utf8')}\nLocal change.\n`);
  assert.equal(await run(['status'], root, output()), 1);
  await assert.rejects(() => run(['update'], root, output()), /modified managed skills/);
  assert.equal(await run(['update', '--force'], root, output()), 0);
  assert.equal(await run(['status'], root, output()), 0);

  assert.equal(await run(['uninstall', '--dry-run'], root, output()), 0);
  assert.equal(existsSync(manifestPath), true);
  assert.equal(await run(['uninstall'], root, output()), 0);
  assert.equal(existsSync(manifestPath), false);
  assert.equal(existsSync(join(root, '.agents', 'skills', 'scientific-software-engineering')), false);
  assert.equal(await readFile(join(userSkill, 'SKILL.md'), 'utf8'), '# User-owned skill\n');
  assert.equal(await readFile(join(root, 'AGENTS.md'), 'utf8'), initialAgents);
  await assert.rejects(() => stat(join(root, '.linxira', 'manifest.json')));
});

test('init rejects malformed Linxira marker pairs before writing managed state', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, 'AGENTS.md'), '<!-- linxira-skills:start -->\n');

  await assert.rejects(() => run(['init'], root, output()), /malformed or duplicate/);
  assert.equal(existsSync(join(root, '.linxira', 'manifest.json')), false);
  assert.equal(existsSync(join(root, '.agents', 'skills')), false);
});

test('init never replaces a same-named user skill directory', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  const userSkill = join(root, '.agents', 'skills', 'linux-wsl');
  await mkdir(userSkill, { recursive: true });
  await writeFile(join(userSkill, 'SKILL.md'), '# User-owned skill\n');

  await assert.rejects(() => run(['init'], root, output()), /non-managed skill directory/);
  assert.equal(await readFile(join(userSkill, 'SKILL.md'), 'utf8'), '# User-owned skill\n');
  assert.equal(existsSync(join(root, '.linxira', 'manifest.json')), false);
});
