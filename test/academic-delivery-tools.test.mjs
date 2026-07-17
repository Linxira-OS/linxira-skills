import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmod, copyFile, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestValidator = join(packageRoot, 'skills', 'academic-delivery-planning', 'scripts', 'validate-academic-delivery.mjs');
const toolchainChecker = join(packageRoot, 'skills', 'academic-delivery-planning', 'scripts', 'check-academic-toolchain.mjs');
const documentRenderer = join(packageRoot, 'skills', 'academic-document-generation', 'scripts', 'render-document.mjs');
const presentationGenerator = join(packageRoot, 'skills', 'academic-presentation-generation', 'scripts', 'create-pptx.mjs');
const artifactValidator = join(packageRoot, 'skills', 'academic-artifact-validation', 'scripts', 'render-and-inspect.mjs');
const imageGenerator = join(packageRoot, 'skills', 'academic-visual-evidence', 'scripts', 'generate-ai-illustration.mjs');
const imageManifestValidator = join(packageRoot, 'skills', 'academic-visual-evidence', 'scripts', 'validate-image-manifest.mjs');
const bibtexValidator = join(packageRoot, 'skills', 'citation-and-reference-formatting', 'scripts', 'validate-bibtex.mjs');
const metadataResolver = join(packageRoot, 'skills', 'citation-and-reference-formatting', 'scripts', 'resolve-reference-metadata.mjs');
const cslToBibtex = join(packageRoot, 'skills', 'citation-and-reference-formatting', 'scripts', 'csl-json-to-bibtex.mjs');

async function fixture(context) {
  const root = await mkdtemp(join(tmpdir(), 'linxira-academic-delivery-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'images'), { recursive: true });
  await mkdir(join(root, 'styles'), { recursive: true });
  await writeFile(join(root, 'manuscript.md'), '# Example\n\nText with a citation [@example].\n');
  await writeFile(join(root, 'references.bib'), '@article{example, title={Example}, author={Author}, year={2026}}\n');
  await writeFile(join(root, 'styles', 'numeric.csl'), '<style xmlns="http://purl.org/net/xbiblio/csl" version="1.0"/>\n');
  await writeFile(join(root, 'images', 'result.png'), 'fixture image\n');
  await writeFile(join(root, 'images', 'concept.png'), 'fixture image\n');
  return root;
}

function run(script, args, cwd, env = process.env) {
  return execFileSync(process.execPath, [script, ...args], { cwd, env, encoding: 'utf8', stdio: 'pipe' });
}

test('academic toolchain preflight reports availability without installing packages', () => {
  const report = JSON.parse(run(toolchainChecker, [], packageRoot));
  assert.equal(typeof report.complete, 'boolean');
  assert.ok(Array.isArray(report.missing));
  assert.equal(report.tools.length, 9);
  assert.equal(report.resources.length, 2);
  assert.ok(Array.isArray(report.missingResources));
  assert.equal(report.platform.os, process.platform);
  if (report.platform.packageManager === 'pacman') {
    assert.match(report.installRecommendation, /pacman -Syu/);
    assert.match(report.installRecommendation, /pandoc-cli/);
    assert.match(report.installRecommendation, /texlive-binextra/);
  }
});

test('academic delivery manifest validates evidence and labeled AI assets', async (context) => {
  const root = await fixture(context);
  const manifest = {
    artifact: 'paper',
    language: 'zh-CN',
    outputs: ['docx'],
    authoringStack: 'pandoc-docx',
    citationStyle: 'gb-t-7714-2015-numeric',
    source: 'manuscript.md',
    bibliography: 'references.bib',
    csl: 'styles/numeric.csl',
    outputDirectory: 'dist',
    images: {
      requireRealEvidence: true,
      allowAiIllustration: true,
      assets: [
        { id: 'result', class: 'evidence', source: 'analysis', path: 'images/result.png', label: 'Observed analysis result' },
        { id: 'concept', class: 'schematic', source: 'ai-generated', path: 'images/concept.png', label: 'AI-generated illustration' },
      ],
    },
  };
  const path = join(root, 'academic-delivery.json');
  await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`);
  const output = JSON.parse(run(manifestValidator, [path], root));
  assert.equal(output.valid, true);
  assert.deepEqual(output.outputs, ['docx']);
});

test('academic delivery manifest rejects AI evidence assets', async (context) => {
  const root = await fixture(context);
  const path = join(root, 'invalid.json');
  await writeFile(path, `${JSON.stringify({
    artifact: 'slides',
    language: 'zh-CN',
    outputs: ['pptx'],
    authoringStack: 'pptxgenjs',
    citationStyle: 'gb-t-7714-2015-numeric',
    images: {
      assets: [{ id: 'bad-image', class: 'evidence', source: 'ai-generated', path: 'images/concept.png', label: 'AI-generated illustration' }],
    },
  }, null, 2)}\n`);
  assert.throws(() => run(manifestValidator, [path], root), /cannot be evidence/);
});

test('academic delivery manifest honors allowAiIllustration', async (context) => {
  const root = await fixture(context);
  const path = join(root, 'ai-disabled.json');
  await writeFile(path, `${JSON.stringify({
    artifact: 'slides',
    language: 'zh-CN',
    outputs: ['pptx'],
    authoringStack: 'pptxgenjs',
    citationStyle: 'gb-t-7714-2015-numeric',
    images: {
      allowAiIllustration: false,
      assets: [{ id: 'concept', class: 'schematic', source: 'ai-generated', path: 'images/concept.png', label: 'AI-generated illustration' }],
    },
  }, null, 2)}\n`);
  assert.throws(() => run(manifestValidator, [path], root), /allowAiIllustration/);
});

test('academic delivery manifest rejects outputs not handled by its authoring stack', async (context) => {
  const root = await fixture(context);
  const path = join(root, 'mixed-output.json');
  await writeFile(path, `${JSON.stringify({
    artifact: 'paper',
    language: 'en-US',
    outputs: ['docx', 'pptx'],
    authoringStack: 'pandoc-docx',
    citationStyle: 'numeric-fixture',
    images: { assets: [] },
  }, null, 2)}\n`);
  assert.throws(() => run(manifestValidator, [path], root), /incompatible/);
});

test('academic delivery manifest rejects symbolic-link assets', { skip: process.platform === 'win32' }, async (context) => {
  const root = await fixture(context);
  const outside = join(root, '..', 'outside-academic-image.png');
  await writeFile(outside, 'outside image\n');
  context.after(() => rm(outside, { force: true }));
  await symlink(outside, join(root, 'images', 'escape.png'));
  const path = join(root, 'symlink.json');
  await writeFile(path, `${JSON.stringify({
    artifact: 'paper',
    language: 'zh-CN',
    outputs: ['docx'],
    authoringStack: 'pandoc-docx',
    citationStyle: 'gb-t-7714-2015-numeric',
    images: { assets: [{ id: 'escape', class: 'evidence', source: 'analysis', path: 'images/escape.png', label: 'Result' }] },
  }, null, 2)}\n`);
  assert.throws(() => run(manifestValidator, [path], root), /symbolic link or junction/);
});

test('document renderer creates a non-mutating Pandoc plan', async (context) => {
  const root = await fixture(context);
  const path = join(root, 'academic-delivery.json');
  await writeFile(path, `${JSON.stringify({
    artifact: 'paper',
    language: 'zh-CN',
    outputs: ['docx'],
    authoringStack: 'pandoc-docx',
    citationStyle: 'gb-t-7714-2015-numeric',
    source: 'manuscript.md',
    bibliography: 'references.bib',
    csl: 'styles/numeric.csl',
    outputDirectory: 'dist',
    images: { assets: [] },
  }, null, 2)}\n`);
  const plan = JSON.parse(run(documentRenderer, ['plan', path], root));
  assert.equal(plan.commands.length, 1);
  assert.equal(plan.commands[0].executable, 'pandoc');
  assert.match(plan.commands[0].arguments.join(' '), /--citeproc/);
  assert.match(plan.commands[0].arguments.join(' '), /--csl=/);
});

test('document renderer plans every declared Pandoc output and LaTeX prerequisites', async (context) => {
  const root = await fixture(context);
  await writeFile(join(root, 'main.tex'), '\\documentclass{article}\\begin{document}Fixture\\end{document}\n');
  const pandocManifest = join(root, 'pandoc-outputs.json');
  await writeFile(pandocManifest, `${JSON.stringify({
    artifact: 'paper',
    language: 'en-US',
    outputs: ['docx', 'tex'],
    authoringStack: 'pandoc-docx',
    citationStyle: 'numeric-fixture',
    source: 'manuscript.md',
    bibliography: 'references.bib',
    csl: 'styles/numeric.csl',
    outputDirectory: 'dist',
    images: { assets: [] },
  }, null, 2)}\n`);
  const pandocPlan = JSON.parse(run(documentRenderer, ['plan', pandocManifest], root));
  assert.equal(pandocPlan.commands.length, 2);
  assert.match(pandocPlan.commands.map(({ arguments: args }) => args.join(' ')).join('\n'), /manuscript\.tex/);

  const latexManifest = join(root, 'latex-outputs.json');
  await writeFile(latexManifest, `${JSON.stringify({
    artifact: 'paper',
    language: 'en-US',
    outputs: ['pdf', 'tex'],
    authoringStack: 'latex-bibtex',
    citationStyle: 'plain-bibtex-fixture',
    source: 'main.tex',
    outputDirectory: 'dist',
    images: { assets: [] },
  }, null, 2)}\n`);
  const latexPlan = JSON.parse(run(documentRenderer, ['plan', latexManifest], root));
  assert.match(latexPlan.commands[0].arguments.join(' '), /-outdir=/);
  assert.deepEqual(latexPlan.requiredTools.sort(), ['bibtex', 'latexmk', 'xelatex']);
});

test('document renderer rejects unresolved citation warnings before recording success', async (context) => {
  const root = await fixture(context);
  const bin = join(root, 'bin');
  await mkdir(bin);
  let nodeOptions = process.env.NODE_OPTIONS;
  if (process.platform === 'win32') {
    await copyFile(process.execPath, join(bin, 'pandoc.exe'));
    const hook = join(bin, 'pandoc-hook.cjs');
    await writeFile(hook, "if (process.argv[0].toLowerCase().endsWith('pandoc.exe')) { process.stderr.write('Citeproc: citation fixture not found\\n'); process.exit(0); }\n");
    nodeOptions = `${nodeOptions ? `${nodeOptions} ` : ''}--require=${hook}`;
  } else {
    const command = join(bin, 'pandoc');
    await writeFile(command, '#!/bin/sh\necho "Citeproc: citation fixture not found" >&2\nexit 0\n');
    await chmod(command, 0o755);
  }
  const path = join(root, 'warning.json');
  await writeFile(path, `${JSON.stringify({
    artifact: 'paper',
    language: 'en-US',
    outputs: ['docx'],
    authoringStack: 'pandoc-docx',
    citationStyle: 'numeric-fixture',
    source: 'manuscript.md',
    bibliography: 'references.bib',
    csl: 'styles/numeric.csl',
    outputDirectory: 'dist',
    images: { assets: [] },
  }, null, 2)}\n`);
  const env = { ...process.env, PATH: `${bin}${delimiter}${process.env.PATH}`, ...(nodeOptions ? { NODE_OPTIONS: nodeOptions } : {}) };
  assert.throws(() => run(documentRenderer, ['execute', path], root, env), /unresolved citations or references/);
  await writeFile(join(root, 'dist', 'user-owned.txt'), 'do not replace\n');
  assert.throws(() => run(documentRenderer, ['execute', path], root, env), /outputDirectory must be empty/);
});

test('presentation generator validates a slide manifest without PptxGenJS', async (context) => {
  const root = await fixture(context);
  const path = join(root, 'slides.json');
  await writeFile(path, `${JSON.stringify({
    title: 'Example Talk',
    aspectRatio: 'wide',
    slides: [
      {
        kind: 'title',
        title: 'Example Talk',
        subtitle: 'A bounded claim',
        image: { path: 'images/result.png', class: 'decorative', source: 'external', citationKey: 'Fixture source [1]', label: 'Fixture image' },
      },
      {
        kind: 'content',
        title: 'Observed result',
        body: ['A claim supported by a real result image.'],
        citation: '[1]',
        image: { path: 'images/result.png', class: 'evidence', source: 'analysis', label: 'Observed analysis result' },
      },
    ],
  }, null, 2)}\n`);
  const plan = JSON.parse(run(presentationGenerator, ['plan', path], root));
  assert.equal(plan.valid, true);
  assert.equal(plan.slides, 2);

  await writeFile(path, `${JSON.stringify({
    title: 'Invalid source',
    slides: [{
      kind: 'title',
      title: 'Invalid source',
      image: { path: 'images/result.png', class: 'decorative', source: 'external', citation: {}, label: 'Fixture image' },
    }],
  }, null, 2)}\n`);
  assert.throws(() => run(presentationGenerator, ['plan', path], root), /requires citation/);
});

test('artifact validator refuses pre-existing page images before invoking render tools', async (context) => {
  const root = await fixture(context);
  const pdf = join(root, 'artifact.pdf');
  const rendered = join(root, 'rendered');
  await writeFile(pdf, 'fixture PDF placeholder\n');
  await mkdir(rendered);
  await writeFile(join(rendered, 'page-1.png'), 'user-owned page image\n');
  assert.throws(() => run(artifactValidator, [pdf, rendered], root), /existing page image/);
});

test('AI illustration generator rejects evidence before external API access', async (context) => {
  const root = await fixture(context);
  const path = join(root, 'ai-request.json');
  await writeFile(path, `${JSON.stringify({
    class: 'evidence',
    purpose: 'Pretend experimental evidence',
    prompt: 'A fake experimental result that must be rejected by the local validator.',
    output: 'images/invalid.png',
    label: 'AI-generated illustration',
    externalGenerationApproved: true,
  }, null, 2)}\n`);
  const result = spawnSync(process.execPath, [imageGenerator, path, '--confirm-external-generation'], { cwd: root, encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /only for schematic or decorative/);
});

test('AI illustration generator rejects an existing output before API access', async (context) => {
  const root = await fixture(context);
  const output = join(root, 'images', 'existing.png');
  await writeFile(output, 'existing image\n');
  const path = join(root, 'existing-request.json');
  await writeFile(path, `${JSON.stringify({
    class: 'schematic',
    purpose: 'Explain a generic workflow without evidence claims.',
    prompt: 'A clean conceptual diagram of a generic workflow without text labels.',
    output: 'images/existing.png',
    label: 'AI-generated illustration',
    externalGenerationApproved: true,
  }, null, 2)}\n`);
  const result = spawnSync(process.execPath, [imageGenerator, path, '--confirm-external-generation'], { cwd: root, encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Refusing to overwrite/);
});

test('image manifest validates AI provenance and external attribution', async (context) => {
  const root = await fixture(context);
  const provenance = join(root, 'images', 'concept.png.provenance.json');
  const conceptHash = createHash('sha256').update(await readFile(join(root, 'images', 'concept.png'))).digest('hex');
  await writeFile(provenance, `${JSON.stringify({
    class: 'schematic',
    source: 'ai-generated',
    label: 'AI-generated illustration',
    model: 'gpt-image-1',
    generatedAt: '2026-07-17T00:00:00.000Z',
    promptSha256: 'a'.repeat(64),
    imagePath: 'images/concept.png',
    imageSha256: conceptHash,
  }, null, 2)}\n`);
  const path = join(root, 'images-manifest.json');
  await writeFile(path, `${JSON.stringify({
    version: 1,
    assets: [
      { id: 'result', class: 'evidence', source: 'analysis', path: 'images/result.png', label: 'Observed analysis result' },
      { id: 'concept', class: 'schematic', source: 'ai-generated', path: 'images/concept.png', label: 'AI-generated illustration', provenance: 'images/concept.png.provenance.json' },
      { id: 'external', class: 'decorative', source: 'external', path: 'images/result.png', label: 'External image', citationKey: 'Fixture source [1]' },
    ],
  }, null, 2)}\n`);
  const valid = JSON.parse(run(imageManifestValidator, [path], root));
  assert.deepEqual(valid, { valid: true, assets: 3 });

  await writeFile(join(root, 'images', 'concept.png'), 'replaced image\n');
  assert.throws(() => run(imageManifestValidator, [path], root), /not bound to the current image asset/);

  await writeFile(provenance, `${JSON.stringify({ class: 'evidence', source: 'ai-generated', label: 'AI-generated illustration' }, null, 2)}\n`);
  assert.throws(() => run(imageManifestValidator, [path], root), /does not match image manifest/);
});

test('BibTeX validator accepts unique complete entries and rejects duplicates', async (context) => {
  const root = await fixture(context);
  const bibliography = join(root, 'references.bib');
  const valid = JSON.parse(run(bibtexValidator, [bibliography], root));
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.keys, ['example']);

  const duplicate = join(root, 'duplicate.bib');
  await writeFile(duplicate, `@article{same, title={One}, author={A}, year={2026}}\n@article{same, title={Two}, author={B}, year={2026}}\n`);
  assert.throws(() => run(bibtexValidator, [duplicate], root), /duplicate citation keys/);

  const missingComma = join(root, 'missing-comma.bib');
  await writeFile(missingComma, '@article{bad, title={Title} author={Author}, year={2026}}\n');
  assert.throws(() => run(bibtexValidator, [missingComma], root), /must be followed by a comma/);
});

test('BibTeX validator handles nested braces and fails malformed later entries', async (context) => {
  const root = await fixture(context);
  const nested = join(root, 'nested.bib');
  await writeFile(nested, '@article(nested, title={{Nested} title with {Protected} Case}, author={Author}, year={2026})\n');
  const valid = JSON.parse(run(bibtexValidator, [nested], root));
  assert.deepEqual(valid.keys, ['nested']);

  await writeFile(nested, '@article{valid, title={Valid}, author={Author}, year={2026}}\n@article{broken, title={Missing end}\n');
  assert.throws(() => run(bibtexValidator, [nested], root), /Unbalanced BibTeX entry/);
});

test('reference metadata resolver requires explicit confirmation before network access', async (context) => {
  const root = await fixture(context);
  const input = join(root, 'identifiers.json');
  const output = join(root, 'references.json');
  await writeFile(input, `${JSON.stringify({ identifiers: [{ doi: '10.1000/example' }] }, null, 2)}\n`);
  const result = spawnSync(process.execPath, [metadataResolver, input, output], { cwd: root, encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /confirm-external-metadata/);

  await writeFile(input, `${JSON.stringify({ identifiers: [{ doi: 'not-a-doi' }] }, null, 2)}\n`);
  assert.throws(() => run(metadataResolver, [input, output, '--confirm-external-metadata'], root), /invalid DOI/);
});

test('CSL JSON converter produces BibTeX accepted by the structural validator', async (context) => {
  const root = await fixture(context);
  const input = join(root, 'references.json');
  const output = join(root, 'generated.bib');
  await writeFile(input, `${JSON.stringify({
    version: 1,
    records: [
      {
        id: 'doi:10.1000/example',
        type: 'article-journal',
        title: 'A {Protected} Reference & 50%_#',
        author: [{ family: 'Example', given: 'Ada' }],
        'container-title': 'Fixture Journal',
        issued: { 'date-parts': [[2026]] },
        DOI: '10.1000/example',
        URL: 'https://doi.org/10.1000/example',
      },
      {
        id: 'chapter:fixture',
        type: 'chapter',
        title: 'Fixture Chapter',
        author: [{ literal: 'Example Consortium' }],
        'container-title': 'Fixture Book',
        issued: { 'date-parts': [[2026]] },
        publisher: 'Fixture Press',
      },
    ],
  }, null, 2)}\n`);
  const conversion = JSON.parse(run(cslToBibtex, [input, output], root));
  assert.equal(conversion.converted, 2);
  const generated = await readFile(output, 'utf8');
  assert.match(generated, /title = {A {Protected} Reference \\& 50\\%\\_\\#}/);
  assert.match(generated, /@incollection/);
  assert.match(generated, /booktitle = {Fixture Book}/);
  assert.match(generated, /author = {{Example Consortium}}/);
  const validation = JSON.parse(run(bibtexValidator, [output], root));
  assert.equal(validation.entries, 2);
});
