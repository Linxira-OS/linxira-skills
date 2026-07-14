import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { run } from '../dist/cli.js';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

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
  assert.match(dryRunLog.lines.join('\n'), /copy \.agents\/skills\/research\/life-sciences\/bio-analysis-orchestrator/);

  assert.equal(await run(['init'], root, output()), 0);
  const manifestPath = join(root, '.linxira', 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.profile, 'core');
  assert.equal(manifest.schemaVersion, 2);
  assert.equal(Object.values(manifest.entries).filter(({ kind }) => kind === 'directory').length, 21);
  const agents = await readFile(join(root, 'AGENTS.md'), 'utf8');
  assert.match(agents, /linxira-skills:start/);
  assert.match(agents, /\.agents\/skills\/engineering\/SKILL\.md/);
  assert.doesNotMatch(agents, /bio-analysis-orchestrator/);
  assert.match(await readFile(join(root, '.gitignore'), 'utf8'), /\.agents\/skills\//);
  assert.equal(await run(['status'], root, output()), 0);

  const userSkill = join(root, '.agents', 'skills', 'systems', 'linux', 'user-private-skill');
  await mkdir(userSkill);
  await writeFile(join(userSkill, 'SKILL.md'), '# User-owned skill\n');

  const changedSkill = join(root, '.agents', 'skills', 'engineering', 'software', 'scientific-software-engineering', 'SKILL.md');
  await writeFile(changedSkill, `${await readFile(changedSkill, 'utf8')}\nLocal change.\n`);
  assert.equal(await run(['status'], root, output()), 1);
  await assert.rejects(() => run(['update'], root, output()), /modified managed entries/);
  assert.equal(await run(['update', '--force'], root, output()), 0);
  assert.equal(await run(['status'], root, output()), 0);

  assert.equal(await run(['uninstall', '--dry-run'], root, output()), 0);
  assert.equal(existsSync(manifestPath), true);
  assert.equal(await run(['uninstall'], root, output()), 0);
  assert.equal(existsSync(manifestPath), false);
  assert.equal(existsSync(join(root, '.agents', 'skills', 'engineering', 'software', 'scientific-software-engineering')), false);
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
  const userSkill = join(root, '.agents', 'skills', 'systems', 'linux', 'linux-wsl');
  await mkdir(userSkill, { recursive: true });
  await writeFile(join(userSkill, 'SKILL.md'), '# User-owned skill\n');

  await assert.rejects(() => run(['init'], root, output()), /non-managed skill directory/);
  assert.equal(await readFile(join(userSkill, 'SKILL.md'), 'utf8'), '# User-owned skill\n');
  assert.equal(existsSync(join(root, '.linxira', 'manifest.json')), false);
});

test('life-sciences-core materializes only its reviewed additions', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  const reviewedSkills = [
    'bio-read-sequences',
    'bio-sequence-statistics',
    'bio-structural-biology-structure-navigation',
    'bio-structural-biology-alphafold-predictions',
  ];

  assert.equal(await run(['init', '--profile', 'life-sciences-core'], root, output()), 0);
  const manifestPath = join(root, '.linxira', 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.profile, 'life-sciences-core');
  assert.equal(Object.values(manifest.entries).filter(({ kind }) => kind === 'directory').length, 25);
  assert.doesNotMatch(await readFile(join(root, 'AGENTS.md'), 'utf8'), /delivery\/SKILL\.md/);
  for (const skill of reviewedSkills) {
    assert.equal(existsSync(join(root, '.agents', 'skills', 'research', 'life-sciences', skill, 'SKILL.md')), true);
  }
  assert.equal(existsSync(join(root, '.agents', 'skills', 'research', 'life-sciences', 'bio-read-sequences', 'examples')), false);
  assert.equal(await run(['status'], root, output()), 0);
  assert.equal(await run(['uninstall'], root, output()), 0);
  for (const skill of reviewedSkills) {
    assert.equal(existsSync(join(root, '.agents', 'skills', 'research', 'life-sciences', skill)), false);
  }
});

test('html-reporting-core materializes only its reviewed additions', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  const reviewedSkills = ['dashboard', 'data-report', 'docs-page'];

  assert.equal(await run(['init', '--profile', 'html-reporting-core'], root, output()), 0);
  const manifestPath = join(root, '.linxira', 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.profile, 'html-reporting-core');
  assert.equal(Object.values(manifest.entries).filter(({ kind }) => kind === 'directory').length, 24);
  assert.match(await readFile(join(root, 'AGENTS.md'), 'utf8'), /delivery\/SKILL\.md/);
  for (const skill of reviewedSkills) {
    assert.equal(existsSync(join(root, '.agents', 'skills', 'delivery', 'reporting', skill, 'SKILL.md')), true);
    assert.equal(existsSync(join(root, '.agents', 'skills', 'delivery', 'reporting', skill, 'example.html')), false);
  }
  assert.equal(await run(['status'], root, output()), 0);
  assert.equal(await run(['uninstall'], root, output()), 0);
  assert.equal(existsSync(join(root, '.agents', 'skills', 'delivery', 'SKILL.md')), false);
  for (const skill of reviewedSkills) {
    assert.equal(existsSync(join(root, '.agents', 'skills', 'delivery', 'reporting', skill)), false);
  }
});

test('packed CLI installs and runs in a clean Git repository', async (context) => {
  const root = await mkdtemp(join(tmpdir(), 'linxira-packed-'));
  const tarballDirectory = join(root, 'tarballs');
  const project = join(root, 'project');
  context.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(tarballDirectory);
  await mkdir(project);

  const npmCli = process.env.npm_execpath;
  assert.ok(npmCli, 'npm_execpath must be set by npm test');
  execFileSync(process.execPath, [npmCli, 'pack', '--pack-destination', tarballDirectory], {
    cwd: packageRoot,
    stdio: 'pipe',
  });
  const tarballs = await readdir(tarballDirectory);
  assert.equal(tarballs.length, 1);
  const tarball = join(tarballDirectory, tarballs[0]);

  execFileSync(process.execPath, [npmCli, 'install', '--ignore-scripts', '--no-package-lock', '--no-audit', '--no-fund', '--prefix', project, tarball], {
    stdio: 'pipe',
  });
  execFileSync('git', ['init', '--quiet', project]);
  const cli = join(project, 'node_modules', 'linxira-skills', 'dist', 'linxira-skills.js');

  execFileSync(process.execPath, [cli, 'init', '--profile', 'html-reporting-core'], { cwd: project, stdio: 'pipe' });
  const manifest = JSON.parse(await readFile(join(project, '.linxira', 'manifest.json'), 'utf8'));
  assert.equal(manifest.profile, 'html-reporting-core');
  assert.equal(Object.values(manifest.entries).filter(({ kind }) => kind === 'directory').length, 24);
  execFileSync(process.execPath, [cli, 'status'], { cwd: project, stdio: 'pipe' });
  execFileSync(process.execPath, [cli, 'update'], { cwd: project, stdio: 'pipe' });
  execFileSync(process.execPath, [cli, 'uninstall'], { cwd: project, stdio: 'pipe' });
  assert.equal(existsSync(join(project, '.linxira', 'manifest.json')), false);
  assert.equal(existsSync(join(project, '.agents', 'skills', 'delivery', 'reporting', 'data-report')), false);
});
