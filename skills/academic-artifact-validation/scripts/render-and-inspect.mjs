import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, lstatSync } from 'node:fs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';

const [inputArgument, outputArgument, ...options] = process.argv.slice(2);
if (!inputArgument || !outputArgument || options.some((option) => !option.startsWith('--expect='))) {
  console.error('Usage: node render-and-inspect.mjs <artifact.docx|artifact.pptx|artifact.pdf> <render-directory> [--expect=text]');
  process.exitCode = 1;
} else {
  const input = resolve(inputArgument);
  const baseDirectory = dirname(input);
  const outputDirectory = resolve(outputArgument);
  const expected = options.map((option) => option.slice('--expect='.length)).filter(Boolean);
  const artifactType = await validatePaths(input, outputDirectory, baseDirectory);
  const report = await renderAndInspect(input, outputDirectory, expected, artifactType);
  console.log(JSON.stringify(report, null, 2));
}

async function validatePaths(input, outputDirectory, baseDirectory) {
  const artifactType = extname(input).toLowerCase();
  if (!['.docx', '.pptx', '.pdf'].includes(artifactType)) {
    fail('Input artifact must be a DOCX, PPTX, or PDF file.');
  }
  if (!existsSync(input)) {
    fail(`Input artifact does not exist: ${input}`);
  }
  assertWithin(baseDirectory, input, 'input artifact');
  assertWithin(baseDirectory, outputDirectory, 'render directory');
  const reportPath = join(outputDirectory, 'render-report.json');
  const convertedPdf = join(outputDirectory, `${basename(input, extname(input))}.pdf`);
  if (existsSync(reportPath) || (artifactType !== '.pdf' && existsSync(convertedPdf))) {
    fail(`Refusing to overwrite existing render output in ${outputDirectory}.`);
  }
  if (existsSync(outputDirectory)) {
    const existingPageImages = (await readdir(outputDirectory)).filter((name) => /^page-\d+\.png$/.test(name));
    if (existingPageImages.length > 0) {
      fail(`Refusing to overwrite existing page image output in ${outputDirectory}.`);
    }
  }
  return artifactType;
}

async function renderAndInspect(input, outputDirectory, expected, artifactType) {
  const renderer = artifactType === '.pdf' ? null : firstAvailable(['libreoffice', 'soffice']);
  const required = {
    pdfinfo: firstAvailable(['pdfinfo']),
    pdftotext: firstAvailable(['pdftotext']),
    pdftoppm: firstAvailable(['pdftoppm']),
  };
  if (renderer) {
    required.renderer = renderer;
  }
  for (const [name, executable] of Object.entries(required)) {
    if (!executable) {
      fail(`Required rendering tool is unavailable: ${name}.`);
    }
  }

  await mkdir(outputDirectory, { recursive: true });
  assertWithin(dirname(input), outputDirectory, 'render directory');
  let pdfPath = input;
  if (artifactType !== '.pdf') {
    const conversion = spawnSync(renderer, ['--headless', '--convert-to', 'pdf', '--outdir', outputDirectory, input], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    if (conversion.status !== 0) {
      fail(`LibreOffice conversion failed: ${(conversion.stderr || conversion.stdout || '').trim().slice(0, 500)}`);
    }
    pdfPath = join(outputDirectory, `${basename(input, extname(input))}.pdf`);
    if (!existsSync(pdfPath)) {
      fail('LibreOffice completed without creating the expected PDF.');
    }
  }

  const pdfInfo = execFileSync(required.pdfinfo, [pdfPath], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const pageMatch = pdfInfo.match(/^Pages:\s+(\d+)\s*$/m);
  if (!pageMatch) {
    fail('pdfinfo did not report a PDF page count.');
  }
  const extractedText = execFileSync(required.pdftotext, [pdfPath, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const missingExpectedText = expected.filter((value) => !extractedText.includes(value));
  if (missingExpectedText.length > 0) {
    fail(`Rendered PDF is missing expected text: ${missingExpectedText.join(', ')}`);
  }
  const pagePrefix = join(outputDirectory, 'page');
  const pageImages = spawnSync(required.pdftoppm, ['-png', '-r', '144', pdfPath, pagePrefix], { encoding: 'utf8', stdio: 'pipe' });
  if (pageImages.status !== 0) {
    fail(`pdftoppm failed: ${(pageImages.stderr || pageImages.stdout || '').trim().slice(0, 500)}`);
  }
  const renderedPages = (await readdir(outputDirectory))
    .filter((name) => /^page-\d+\.png$/.test(name))
    .sort((left, right) => Number(left.match(/\d+/)[0]) - Number(right.match(/\d+/)[0]));
  if (renderedPages.length !== Number(pageMatch[1])) {
    fail(`Expected ${pageMatch[1]} rendered page image(s), found ${renderedPages.length}.`);
  }

  const report = {
    input,
    pdfPath,
    pageCount: Number(pageMatch[1]),
    expectedText: expected,
    pageImages: renderedPages,
    toolVersions: Object.fromEntries(Object.entries(required).map(([name, executable]) => [name, toolVersion(executable)])),
    generatedAt: new Date().toISOString(),
    humanVisualReview: 'required',
  };
  await writeFile(join(outputDirectory, 'render-report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
  return report;
}

function firstAvailable(candidates) {
  return candidates.find((candidate) => commandExists(candidate));
}

function commandExists(executable) {
  const result = spawnSync(executable, ['--version'], { stdio: 'ignore' });
  return !result.error && result.status !== null;
}

function toolVersion(executable) {
  const argumentsList = ['pdfinfo', 'pdftotext', 'pdftoppm'].includes(executable) ? ['-v'] : ['--version'];
  const result = spawnSync(executable, argumentsList, { encoding: 'utf8' });
  if (result.status !== 0) {
    return 'unavailable';
  }
  return (result.stdout || result.stderr || 'unknown').trim().split(/\r?\n/)[0];
}

function assertWithin(baseDirectory, target, label) {
  const path = relative(baseDirectory, target);
  if (isAbsolute(path) || path === '..' || path.startsWith('../') || path.startsWith('..\\')) {
    fail(`${label} escapes the artifact directory.`);
  }
  assertNoSymbolicLinks(baseDirectory, target, label);
}

function assertNoSymbolicLinks(baseDirectory, target, label) {
  assertRegularPathNode(baseDirectory, label);
  const path = relative(baseDirectory, target);
  let current = baseDirectory;
  for (const segment of path.split(/[\\/]/)) {
    if (!segment) {
      continue;
    }
    current = join(current, segment);
    if (!existsSync(current)) {
      return;
    }
    assertRegularPathNode(current, label);
  }
}

function assertRegularPathNode(path, label) {
  if (lstatSync(path).isSymbolicLink()) {
    fail(`${label} traverses a symbolic link or junction.`);
  }
}

function fail(message) {
  throw new Error(`academic artifact validation: ${message}`);
}
