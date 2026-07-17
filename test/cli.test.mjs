import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
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

async function assertInstalledRoutes(root) {
  const manifest = JSON.parse(await readFile(join(root, '.linxira', 'manifest.json'), 'utf8'));
  const skillsRoot = join(root, '.agents', 'skills');
  for (const record of Object.values(manifest.entries)) {
    if (record.kind !== 'file' || !/(?:INDEX|SKILL)\.md$/.test(record.path)) {
      continue;
    }
    const path = join(skillsRoot, ...record.path.split('/'));
    const body = await readFile(path, 'utf8');
    for (const match of body.matchAll(/`([^`]+\/(?:INDEX|SKILL)\.md)`/g)) {
      const target = resolve(dirname(path), ...match[1].split('/'));
      assert.equal(relative(skillsRoot, target).startsWith('..'), false, `route escapes skill root: ${match[1]}`);
      assert.equal(existsSync(target), true, `missing route target: ${record.path} -> ${match[1]}`);
    }
  }

  const agents = await readFile(join(root, 'AGENTS.md'), 'utf8');
  for (const match of agents.matchAll(/`\.agents\/skills\/([^`]+\/SKILL\.md)`/g)) {
    assert.equal(existsSync(join(skillsRoot, ...match[1].split('/'))), true, `missing AGENTS.md route: ${match[1]}`);
  }
}

test('init, status, update, and uninstall preserve user-owned content', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  const initialAgents = '# Project Instructions\n\nKeep this text.\n';
  await writeFile(join(root, 'AGENTS.md'), initialAgents);

  const dryRunLog = output();
  assert.equal(await run(['init', '--dry-run'], root, dryRunLog), 0);
  assert.equal(existsSync(join(root, '.linxira', 'manifest.json')), false);
  assert.match(dryRunLog.lines.join('\n'), /copy \.agents\/skills\/engineering\/software\/scientific-software-engineering/);
  assert.doesNotMatch(dryRunLog.lines.join('\n'), /bio-analysis-orchestrator/);

  assert.equal(await run(['init'], root, output()), 0);
  const manifestPath = join(root, '.linxira', 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.profile, 'core');
  assert.equal(manifest.schemaVersion, 2);
  assert.equal(Object.values(manifest.entries).filter(({ kind }) => kind === 'directory').length, 10);
  const agents = await readFile(join(root, 'AGENTS.md'), 'utf8');
  assert.match(agents, /linxira-skills:start/);
  assert.match(agents, /\.agents\/skills\/engineering\/SKILL\.md/);
  assert.doesNotMatch(agents, /life-sciences\/INDEX\.md/);
  assert.match(await readFile(join(root, '.gitignore'), 'utf8'), /\.agents\/skills\//);
  await assertInstalledRoutes(root);
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
  const userSkill = join(root, '.agents', 'skills', 'systems', 'linux', 'linux-foundations');
  await mkdir(userSkill, { recursive: true });
  await writeFile(join(userSkill, 'SKILL.md'), '# User-owned skill\n');

  await assert.rejects(() => run(['init'], root, output()), /non-managed skill directory/);
  assert.equal(await readFile(join(userSkill, 'SKILL.md'), 'utf8'), '# User-owned skill\n');
  assert.equal(existsSync(join(root, '.linxira', 'manifest.json')), false);
});

test('init rolls back copied entries when a later target cannot be created', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, '.agents', 'skills'), { recursive: true });
  await writeFile(join(root, '.agents', 'skills', 'systems'), 'blocks systems directory\n');

  await assert.rejects(() => run(['init'], root, output()));
  assert.equal(existsSync(join(root, '.agents', 'skills', 'engineering', 'SKILL.md')), false);
  assert.equal(existsSync(join(root, '.agents', 'skills', 'research', 'SKILL.md')), false);
  assert.equal(existsSync(join(root, '.linxira', 'manifest.json')), false);
  assert.equal(existsSync(join(root, 'AGENTS.md')), false);
  assert.equal(await readFile(join(root, '.agents', 'skills', 'systems'), 'utf8'), 'blocks systems directory\n');
});

test('concurrent lifecycle commands are serialized by a repository lock', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));

  const results = await Promise.allSettled([
    run(['init'], root, output()),
    run(['init'], root, output()),
  ]);
  assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 1);
  assert.equal(results.filter(({ status }) => status === 'rejected').length, 1);
  assert.match(results.find(({ status }) => status === 'rejected').reason.message, /operation is in progress/);
  assert.equal(await run(['status'], root, output()), 0);
  assert.equal(await run(['uninstall'], root, output()), 0);
});

test('init rejects symbolic links in managed path ancestors', { skip: process.platform === 'win32' }, async (context) => {
  const root = await fixture();
  const external = await mkdtemp(join(tmpdir(), 'linxira-external-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  context.after(() => rm(external, { recursive: true, force: true }));
  await symlink(external, join(root, '.agents'), 'dir');

  await assert.rejects(() => run(['init'], root, output()), /symbolic link/);
  assert.equal(existsSync(join(external, 'skills')), false);
});

test('bioinformatics-core materializes the bulk RNA-seq route', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  const workflowSkills = [
    'bio-analysis-orchestrator',
    'bioinformatics-reproducibility',
    'bulk-rnaseq-analysis',
    'fastq-quality-control',
    'salmon-quantification',
    'count-matrix-quality-control',
    'differential-expression-deseq2',
    'differential-expression-results',
    'gene-set-enrichment-analysis',
  ];

  assert.equal(await run(['init', '--profile', 'bioinformatics-core'], root, output()), 0);
  const manifest = JSON.parse(await readFile(join(root, '.linxira', 'manifest.json'), 'utf8'));
  assert.equal(manifest.profile, 'bioinformatics-core');
  assert.equal(Object.values(manifest.entries).filter(({ kind }) => kind === 'directory').length, 20);
  assert.doesNotMatch(await readFile(join(root, 'AGENTS.md'), 'utf8'), /delivery\/SKILL\.md/);
  for (const skill of workflowSkills) {
    assert.equal(existsSync(join(root, '.agents', 'skills', 'research', 'life-sciences', skill, 'SKILL.md')), true);
  }
  assert.equal(existsSync(join(root, '.agents', 'skills', 'research', 'life-sciences', 'bio-read-sequences')), false);
  assert.equal(existsSync(join(root, '.agents', 'skills', 'systems', 'compute', 'hpc-bioinformatics-operations', 'SKILL.md')), true);
  await assertInstalledRoutes(root);
  assert.equal(await run(['status'], root, output()), 0);
  assert.equal(await run(['uninstall'], root, output()), 0);
});

test('biology-research-core materializes experimental and evidence routes', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  const discoverySkills = [
    'biological-research-ideation',
    'life-science-literature-search',
    'literature-screening-and-extraction',
    'biological-evidence-synthesis',
  ];
  const designSkills = [
    'biological-experimental-design',
    'biological-study-statistics',
    'wet-lab-experiment-planning',
  ];

  assert.equal(await run(['init', '--profile', 'biology-research-core'], root, output()), 0);
  const manifest = JSON.parse(await readFile(join(root, '.linxira', 'manifest.json'), 'utf8'));
  assert.equal(manifest.profile, 'biology-research-core');
  assert.equal(Object.values(manifest.entries).filter(({ kind }) => kind === 'directory').length, 39);
  assert.match(await readFile(join(root, 'AGENTS.md'), 'utf8'), /delivery\/SKILL\.md/);
  assert.match(await readFile(join(root, 'AGENTS.md'), 'utf8'), /integrations\/SKILL\.md/);
  for (const skill of discoverySkills) {
    assert.equal(existsSync(join(root, '.agents', 'skills', 'research', 'discovery', skill, 'SKILL.md')), true);
  }
  for (const skill of designSkills) {
    assert.equal(existsSync(join(root, '.agents', 'skills', 'research', 'life-sciences', skill, 'SKILL.md')), true);
  }
  assert.equal(existsSync(join(root, '.agents', 'skills', 'integrations', 'web', 'research-web', 'SKILL.md')), true);
  assert.equal(existsSync(join(root, '.agents', 'skills', 'delivery', 'writing', 'manuscript-structure-and-argument', 'SKILL.md')), true);
  await assertInstalledRoutes(root);
  assert.equal(await run(['status'], root, output()), 0);
  assert.equal(await run(['update'], root, output()), 0);
  assert.equal(await run(['uninstall'], root, output()), 0);
});

test('research-communication-core materializes delivery skills', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  const skills = {
    writing: [
      'academic-delivery-planning',
      'academic-document-formatting',
      'academic-document-generation',
      'latex-academic-authoring',
      'manuscript-structure-and-argument',
    ],
    validation: ['academic-artifact-validation'],
    citations: ['citation-and-reference-formatting'],
    visuals: ['scientific-figures-and-tables', 'academic-visual-evidence'],
    presentations: ['academic-presentation-design', 'academic-presentation-generation'],
  };

  assert.equal(await run(['init', '--profile', 'research-communication-core'], root, output()), 0);
  const manifest = JSON.parse(await readFile(join(root, '.linxira', 'manifest.json'), 'utf8'));
  assert.equal(manifest.profile, 'research-communication-core');
  assert.equal(Object.values(manifest.entries).filter(({ kind }) => kind === 'directory').length, 21);
  assert.match(await readFile(join(root, 'AGENTS.md'), 'utf8'), /delivery\/SKILL\.md/);
  for (const [branch, names] of Object.entries(skills)) {
    for (const skill of names) {
      assert.equal(existsSync(join(root, '.agents', 'skills', 'delivery', branch, skill, 'SKILL.md')), true);
    }
  }
  await assertInstalledRoutes(root);
  assert.equal(await run(['status'], root, output()), 0);
  assert.equal(await run(['uninstall'], root, output()), 0);
});

test('profiles held for review are not installable', async (context) => {
  const root = await fixture();
  context.after(() => rm(root, { recursive: true, force: true }));
  await assert.rejects(() => run(['init', '--profile', 'life-sciences-core'], root, output()), /Unknown profile/);
  await assert.rejects(() => run(['init', '--profile', 'html-reporting-core'], root, output()), /Unknown profile/);
});

test('packed CLI contains only release material and runs in a clean Git repository', async (context) => {
  const root = await mkdtemp(join(tmpdir(), 'linxira-packed-'));
  const tarballDirectory = join(root, 'tarballs');
  const project = join(root, 'project');
  context.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(tarballDirectory);
  await mkdir(project);

  const npmCli = process.env.npm_execpath;
  assert.ok(npmCli, 'npm_execpath must be set by npm test');
  const packOutput = execFileSync(process.execPath, [npmCli, 'pack', '--json', '--pack-destination', tarballDirectory], {
    cwd: packageRoot,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  const [packResult] = JSON.parse(packOutput);
  const packedPaths = packResult.files.map(({ path }) => path);
  assert.ok(packedPaths.includes('CITATION.cff'));
  assert.ok(packedPaths.includes('THIRD_PARTY_NOTICES.md'));
  assert.ok(packedPaths.includes('payload/skills/academic-delivery-planning/ACADEMIC_DELIVERY_STANDARD.md'));
  assert.ok(packedPaths.includes('payload/skills/academic-delivery-planning/TOOLCHAIN_INSTALLATION.md'));
  assert.ok(packedPaths.includes('payload/skills/academic-delivery-planning/scripts/check-academic-toolchain.mjs'));
  assert.ok(packedPaths.includes('payload/skills/academic-presentation-generation/scripts/create-pptx.mjs'));
  assert.ok(packedPaths.includes('payload/skills/academic-artifact-validation/scripts/render-and-inspect.mjs'));
  assert.ok(packedPaths.includes('payload/skills/academic-visual-evidence/scripts/generate-ai-illustration.mjs'));
  assert.ok(packedPaths.includes('payload/skills/academic-visual-evidence/scripts/validate-image-manifest.mjs'));
  assert.ok(packedPaths.includes('payload/skills/citation-and-reference-formatting/scripts/resolve-reference-metadata.mjs'));
  assert.ok(packedPaths.includes('payload/skills/citation-and-reference-formatting/scripts/csl-json-to-bibtex.mjs'));
  assert.ok(packedPaths.includes('payload/profiles.json'));
  for (const path of packedPaths) {
    assert.equal(/^(?:sources|skills|profiles|scripts|test|docs)\//.test(path), false, `unexpected release path: ${path}`);
  }

  const tarballs = await readdir(tarballDirectory);
  assert.equal(tarballs.length, 1);
  const tarball = join(tarballDirectory, tarballs[0]);
  execFileSync(process.execPath, [npmCli, 'install', '--ignore-scripts', '--no-package-lock', '--no-audit', '--no-fund', '--prefix', project, tarball], {
    stdio: 'pipe',
  });
  execFileSync('git', ['init', '--quiet', project]);
  const cli = join(project, 'node_modules', 'linxira-skills', 'dist', 'linxira-skills.js');

  execFileSync(process.execPath, [cli, 'init', '--profile', 'bioinformatics-core'], { cwd: project, stdio: 'pipe' });
  const manifest = JSON.parse(await readFile(join(project, '.linxira', 'manifest.json'), 'utf8'));
  assert.equal(manifest.profile, 'bioinformatics-core');
  assert.equal(Object.values(manifest.entries).filter(({ kind }) => kind === 'directory').length, 20);
  execFileSync(process.execPath, [cli, 'status'], { cwd: project, stdio: 'pipe' });
  execFileSync(process.execPath, [cli, 'update'], { cwd: project, stdio: 'pipe' });
  execFileSync(process.execPath, [cli, 'uninstall'], { cwd: project, stdio: 'pipe' });
  assert.equal(existsSync(join(project, '.linxira', 'manifest.json')), false);
  assert.equal(existsSync(join(project, '.agents', 'skills', 'research', 'life-sciences', 'bulk-rnaseq-analysis')), false);

  execFileSync(process.execPath, [cli, 'init', '--profile', 'biology-research-core'], { cwd: project, stdio: 'pipe' });
  const biologyManifest = JSON.parse(await readFile(join(project, '.linxira', 'manifest.json'), 'utf8'));
  assert.equal(biologyManifest.profile, 'biology-research-core');
  assert.equal(Object.values(biologyManifest.entries).filter(({ kind }) => kind === 'directory').length, 39);
  assert.equal(existsSync(join(project, '.agents', 'skills', 'research', 'discovery', 'life-science-literature-search', 'SKILL.md')), true);
  assert.equal(existsSync(join(project, '.agents', 'skills', 'research', 'life-sciences', 'wet-lab-experiment-planning', 'SKILL.md')), true);
  execFileSync(process.execPath, [cli, 'status'], { cwd: project, stdio: 'pipe' });
  execFileSync(process.execPath, [cli, 'uninstall'], { cwd: project, stdio: 'pipe' });

  execFileSync(process.execPath, [cli, 'init'], { cwd: project, stdio: 'pipe' });
  const coreManifest = JSON.parse(await readFile(join(project, '.linxira', 'manifest.json'), 'utf8'));
  assert.equal(coreManifest.profile, 'core');
  assert.equal(Object.values(coreManifest.entries).filter(({ kind }) => kind === 'directory').length, 10);
  execFileSync(process.execPath, [cli, 'status'], { cwd: project, stdio: 'pipe' });
  execFileSync(process.execPath, [cli, 'uninstall'], { cwd: project, stdio: 'pipe' });
});
