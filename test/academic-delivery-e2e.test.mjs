import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixtureRoot = join(packageRoot, 'test', 'fixtures', 'academic-delivery');
const e2eEnabled = process.env.LINXIRA_ACADEMIC_E2E === '1';
const pptxE2eEnabled = e2eEnabled || process.env.LINXIRA_ACADEMIC_PPTX_E2E === '1';
const latexE2eEnabled = e2eEnabled || process.env.LINXIRA_ACADEMIC_LATEX_E2E === '1';
const npmCli = process.env.npm_execpath;

test('materialized presentation tooling creates a standard-ratio PPTX', { skip: !pptxE2eEnabled }, async (context) => {
  assert.ok(npmCli, 'npm_execpath must be set when the E2E test is launched through npm.');
  const root = await mkdtemp(join(tmpdir(), 'linxira-pptx-e2e-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  const tarballs = join(root, 'tarballs');
  const project = join(root, 'project');
  await mkdir(tarballs);
  await cp(fixtureRoot, project, { recursive: true });
  execFileSync('git', ['init', '--quiet', project]);
  await writeFixturePng(join(project, 'presentation', 'images', 'fixture.png'));

  const pack = JSON.parse(execNpm(['pack', '--json', '--pack-destination', tarballs], packageRoot));
  const tarball = join(tarballs, pack[0].filename);
  execNpm(['ci', '--ignore-scripts', '--no-audit', '--no-fund'], project);
  execNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], project);
  const cli = join(project, 'node_modules', 'linxira-skills', 'dist', 'linxira-skills.js');
  execFileSync(process.execPath, [cli, 'init', '--profile', 'research-communication-core'], { cwd: project, stdio: 'pipe' });

  const presentationScript = join(project, '.agents', 'skills', 'delivery', 'presentations', 'academic-presentation-generation', 'scripts', 'create-pptx.mjs');
  const presentationManifest = join(project, 'presentation', 'slides.json');
  execFileSync(process.execPath, [presentationScript, 'create', presentationManifest], { cwd: project, stdio: 'pipe' });
  const output = join(project, 'presentation', 'dist', 'presentation.pptx');
  assert.ok(existsSync(output));
  assert.ok((await readFile(output)).byteLength > 0);
});

test('materialized document tooling compiles XeLaTeX with BibTeX and Biber output', { skip: !latexE2eEnabled }, async (context) => {
  for (const executable of ['latexmk', 'xelatex', 'bibtex', 'biber', 'pdfinfo', 'pdftotext', 'pdftoppm']) {
    assert.equal(commandExists(executable), true, `required LaTeX E2E tool unavailable: ${executable}`);
  }
  assert.ok(npmCli, 'npm_execpath must be set when the E2E test is launched through npm.');

  const root = await mkdtemp(join(tmpdir(), 'linxira-latex-e2e-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  const tarballs = join(root, 'tarballs');
  const project = join(root, 'project');
  await mkdir(tarballs);
  await cp(fixtureRoot, project, { recursive: true });
  execFileSync('git', ['init', '--quiet', project]);

  const pack = JSON.parse(execNpm(['pack', '--json', '--pack-destination', tarballs], packageRoot));
  const tarball = join(tarballs, pack[0].filename);
  execNpm(['ci', '--ignore-scripts', '--no-audit', '--no-fund'], project);
  execNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], project);
  const cli = join(project, 'node_modules', 'linxira-skills', 'dist', 'linxira-skills.js');
  execFileSync(process.execPath, [cli, 'init', '--profile', 'research-communication-core'], { cwd: project, stdio: 'pipe' });

  const documentScript = join(project, '.agents', 'skills', 'delivery', 'writing', 'academic-document-generation', 'scripts', 'render-document.mjs');
  const cslToBibtex = join(project, '.agents', 'skills', 'delivery', 'citations', 'citation-and-reference-formatting', 'scripts', 'csl-json-to-bibtex.mjs');
  const bibtexValidator = join(project, '.agents', 'skills', 'delivery', 'citations', 'citation-and-reference-formatting', 'scripts', 'validate-bibtex.mjs');
  execFileSync(process.execPath, [cslToBibtex, join(project, 'latex', 'references.json'), join(project, 'latex', 'references.bib')], { cwd: project, stdio: 'pipe' });
  execFileSync(process.execPath, [bibtexValidator, join(project, 'latex', 'references.bib')], { cwd: project, stdio: 'pipe' });
  const latexManifest = join(project, 'latex', 'academic-delivery.json');
  execFileSync(process.execPath, [documentScript, 'execute', latexManifest], { cwd: project, stdio: 'pipe' });
  const pdf = join(project, 'latex', 'dist', 'main.pdf');
  assert.ok(existsSync(pdf));
  assert.ok((await readFile(pdf)).byteLength > 0);

  const validationScript = join(project, '.agents', 'skills', 'delivery', 'validation', 'academic-artifact-validation', 'scripts', 'render-and-inspect.mjs');
  const rendered = join(project, 'latex', 'dist', 'rendered');
  execFileSync(process.execPath, [validationScript, pdf, rendered, '--expect=Fixture LaTeX Title'], { cwd: project, stdio: 'pipe' });
  const report = JSON.parse(await readFile(join(rendered, 'render-report.json'), 'utf8'));
  assert.equal(report.pageCount, 1);
  assert.equal(report.pageImages.length, 1);

  const biberManifest = join(project, 'latex-biber', 'academic-delivery.json');
  execFileSync(process.execPath, [documentScript, 'execute', biberManifest], { cwd: project, stdio: 'pipe' });
  const biberPdf = join(project, 'latex-biber', 'dist', 'main.pdf');
  assert.ok(existsSync(biberPdf));
  assert.ok((await readFile(biberPdf)).byteLength > 0);
  const biberRendered = join(project, 'latex-biber', 'dist', 'rendered');
  execFileSync(process.execPath, [validationScript, biberPdf, biberRendered, '--expect=Fixture Biber Title'], { cwd: project, stdio: 'pipe' });
  const biberReport = JSON.parse(await readFile(join(biberRendered, 'render-report.json'), 'utf8'));
  assert.equal(biberReport.pageCount, 1);
});

test('materialized academic tooling creates and renders DOCX and PPTX artifacts', { skip: !e2eEnabled }, async (context) => {
  for (const executable of ['pandoc', 'libreoffice', 'pdfinfo', 'pdftotext']) {
    assert.equal(commandExists(executable), true, `required E2E tool unavailable: ${executable}`);
  }
  assert.ok(npmCli, 'npm_execpath must be set when the E2E test is launched through npm.');

  const root = await mkdtemp(join(tmpdir(), 'linxira-academic-e2e-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  const tarballs = join(root, 'tarballs');
  const project = join(root, 'project');
  await mkdir(tarballs);
  await cp(fixtureRoot, project, { recursive: true });
  execFileSync('git', ['init', '--quiet', project]);
  await writeFixturePng(join(project, 'presentation', 'images', 'fixture.png'));

  const pack = JSON.parse(execNpm(['pack', '--json', '--pack-destination', tarballs], packageRoot));
  const tarball = join(tarballs, pack[0].filename);
  execNpm(['ci', '--ignore-scripts', '--no-audit', '--no-fund'], project);
  execNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], project);

  const cli = join(project, 'node_modules', 'linxira-skills', 'dist', 'linxira-skills.js');
  execFileSync(process.execPath, [cli, 'init', '--profile', 'research-communication-core'], { cwd: project, stdio: 'pipe' });

  const documentScript = join(project, '.agents', 'skills', 'delivery', 'writing', 'academic-document-generation', 'scripts', 'render-document.mjs');
  const documentManifest = join(project, 'document', 'academic-delivery.json');
  execFileSync(process.execPath, [documentScript, 'execute', documentManifest], { cwd: project, stdio: 'pipe' });
  const documentOutput = join(project, 'document', 'dist', 'manuscript.docx');
  assert.ok(existsSync(documentOutput));
  assert.ok((await readFile(documentOutput)).byteLength > 0);
  const deliveryRecord = JSON.parse(await readFile(join(project, 'document', 'dist', 'delivery-manifest.json'), 'utf8'));
  assert.equal(deliveryRecord.authoringStack, 'pandoc-docx');
  assert.deepEqual(deliveryRecord.inputFiles.map(({ label }) => label).sort(), ['bibliography', 'csl', 'source']);
  assert.deepEqual(deliveryRecord.outputs.map(({ kind }) => kind), ['docx']);
  assert.deepEqual(deliveryRecord.warnings, []);

  const presentationScript = join(project, '.agents', 'skills', 'delivery', 'presentations', 'academic-presentation-generation', 'scripts', 'create-pptx.mjs');
  const presentationManifest = join(project, 'presentation', 'slides.json');
  execFileSync(process.execPath, [presentationScript, 'create', presentationManifest], { cwd: project, stdio: 'pipe' });
  const presentationOutput = join(project, 'presentation', 'dist', 'presentation.pptx');
  assert.ok(existsSync(presentationOutput));
  assert.ok((await readFile(presentationOutput)).byteLength > 0);

  const validationScript = join(project, '.agents', 'skills', 'delivery', 'validation', 'academic-artifact-validation', 'scripts', 'render-and-inspect.mjs');
  const documentRenderDirectory = join(project, 'document', 'dist', 'rendered');
  const presentationRenderDirectory = join(project, 'presentation', 'dist', 'rendered');
  execFileSync(process.execPath, [validationScript, documentOutput, documentRenderDirectory, '--expect=Fixture Document Title'], { cwd: project, stdio: 'pipe' });
  execFileSync(process.execPath, [validationScript, presentationOutput, presentationRenderDirectory, '--expect=Fixture Presentation', '--expect=Source: Fixture source [1]'], { cwd: project, stdio: 'pipe' });
  const documentReport = JSON.parse(await readFile(join(documentRenderDirectory, 'render-report.json'), 'utf8'));
  const presentationReport = JSON.parse(await readFile(join(presentationRenderDirectory, 'render-report.json'), 'utf8'));
  assert.equal(documentReport.humanVisualReview, 'required');
  assert.equal(presentationReport.pageCount, 2);
  assert.equal(presentationReport.pageImages.length, 2);
});

function execNpm(argumentsList, cwd) {
  return execFileSync(process.execPath, [npmCli, ...argumentsList], { cwd, encoding: 'utf8', stdio: 'pipe' });
}

function commandExists(executable) {
  const result = spawnSync(executable, ['--version'], { stdio: 'ignore' });
  return !result.error && result.status !== null;
}

async function writeFixturePng(path) {
  await mkdir(dirname(path), { recursive: true });
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwH/lRSjGQAAAABJRU5ErkJggg==', 'base64');
  await writeFile(path, png);
}
