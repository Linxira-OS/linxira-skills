import { createHash } from 'node:crypto';
import { existsSync, lstatSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';

const outputsByStack = {
  'pandoc-docx': new Set(['docx', 'pdf', 'tex']),
  'latex-bibtex': new Set(['pdf', 'tex']),
  'latex-biblatex': new Set(['pdf', 'tex']),
};

const [command, manifestArgument] = process.argv.slice(2);
if (!['plan', 'execute'].includes(command) || !manifestArgument) {
  console.error('Usage: node render-document.mjs <plan|execute> <academic-delivery.json>');
  process.exitCode = 1;
} else {
  const manifestPath = resolve(manifestArgument);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const baseDirectory = dirname(manifestPath);
  const plan = buildPlan(manifest, baseDirectory);

  if (command === 'plan') {
    console.log(JSON.stringify(plan, null, 2));
  } else {
    await executePlan(plan, manifest, manifestPath);
  }
}

function buildPlan(manifest, baseDirectory) {
  if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest.outputs)) {
    fail('Invalid academic-delivery manifest.');
  }
  if (!['pandoc-docx', 'latex-bibtex', 'latex-biblatex'].includes(manifest.authoringStack)) {
    fail(`Unsupported document authoring stack: ${String(manifest.authoringStack)}`);
  }
  if (typeof manifest.citationStyle !== 'string' || !manifest.citationStyle) {
    fail('citationStyle is required for document rendering.');
  }
  if (manifest.outputs.length === 0 || manifest.outputs.some((output) => !outputsByStack[manifest.authoringStack].has(output))) {
    fail(`Declared outputs are incompatible with ${manifest.authoringStack}.`);
  }
  if (new Set(manifest.outputs).size !== manifest.outputs.length) {
    fail('Declared outputs must not contain duplicates.');
  }
  if (typeof manifest.source !== 'string' || !manifest.source) {
    fail('source is required for document rendering.');
  }

  const source = resolveWithin(baseDirectory, manifest.source, 'source', true);
  const outputDirectory = resolveWithin(baseDirectory, manifest.outputDirectory ?? 'dist', 'outputDirectory');
  const commands = [];
  const inputFiles = [{ label: 'source', path: source }];
  const outputFiles = [];

  if (manifest.authoringStack === 'pandoc-docx') {
    const citation = pandocCitationArguments(manifest, baseDirectory);
    inputFiles.push(...citation.inputFiles);
    if (manifest.outputs.includes('docx')) {
      const path = join(outputDirectory, 'manuscript.docx');
      commands.push({
        executable: 'pandoc',
        arguments: [source, '-o', path, ...citation.arguments, ...referenceDocArguments(manifest, baseDirectory, inputFiles)],
      });
      outputFiles.push({ kind: 'docx', path, generated: true });
    }
    if (manifest.outputs.includes('pdf')) {
      const path = join(outputDirectory, 'manuscript.pdf');
      commands.push({
        executable: 'pandoc',
        arguments: [source, '-o', path, '--pdf-engine=xelatex', ...citation.arguments],
      });
      outputFiles.push({ kind: 'pdf', path, generated: true });
    }
    if (manifest.outputs.includes('tex')) {
      const path = join(outputDirectory, 'manuscript.tex');
      commands.push({
        executable: 'pandoc',
        arguments: [source, '-o', path, ...citation.arguments],
      });
      outputFiles.push({ kind: 'tex', path, generated: true });
    }
  } else {
    if (!manifest.outputs.includes('pdf')) {
      fail('LaTeX authoring requires pdf output; the TeX source remains the declared source artifact.');
    }
    const pdfPath = join(outputDirectory, `${basename(source, extname(source))}.pdf`);
    commands.push({
      executable: 'latexmk',
      arguments: ['-xelatex', '-bibtex', `-outdir=${outputDirectory}`, '-interaction=nonstopmode', '-halt-on-error', source],
    });
    outputFiles.push({ kind: 'pdf', path: pdfPath, generated: true });
    if (manifest.outputs.includes('tex')) {
      outputFiles.push({ kind: 'tex', path: source, generated: false });
    }
    if (manifest.bibliography) {
      inputFiles.push({ label: 'bibliography', path: resolveWithin(baseDirectory, manifest.bibliography, 'bibliography', true) });
    }
  }

  return {
    baseDirectory,
    source,
    outputDirectory,
    authoringStack: manifest.authoringStack,
    citationStyle: manifest.citationStyle,
    commands,
    requiredTools: requiredTools(manifest, commands),
    inputFiles,
    outputFiles,
  };
}

function pandocCitationArguments(manifest, baseDirectory) {
  if (typeof manifest.bibliography !== 'string' || !manifest.bibliography) {
    fail('pandoc-docx requires bibliography so the declared citationStyle can be applied.');
  }
  if (typeof manifest.csl !== 'string' || !manifest.csl) {
    fail('pandoc-docx requires csl so the declared citationStyle can be applied.');
  }
  const bibliography = resolveWithin(baseDirectory, manifest.bibliography, 'bibliography', true);
  const csl = resolveWithin(baseDirectory, manifest.csl, 'csl', true);
  return {
    arguments: ['--citeproc', `--bibliography=${bibliography}`, `--csl=${csl}`],
    inputFiles: [{ label: 'bibliography', path: bibliography }, { label: 'csl', path: csl }],
  };
}

function referenceDocArguments(manifest, baseDirectory, inputFiles) {
  if (!manifest.referenceDoc) {
    return [];
  }
  const referenceDoc = resolveWithin(baseDirectory, manifest.referenceDoc, 'referenceDoc', true);
  inputFiles.push({ label: 'referenceDoc', path: referenceDoc });
  return [`--reference-doc=${referenceDoc}`];
}

async function executePlan(plan, manifest, manifestPath) {
  for (const executable of plan.requiredTools) {
    if (!commandExists(executable)) {
      fail(`Required tool is unavailable: ${executable}. Run plan instead or install the declared toolchain.`);
    }
  }
  await mkdir(plan.outputDirectory, { recursive: true });
  assertNoSymbolicLinks(plan.baseDirectory, plan.outputDirectory, 'outputDirectory');
  if ((await readdir(plan.outputDirectory)).length > 0) {
    fail(`outputDirectory must be empty before generation: ${plan.outputDirectory}`);
  }
  const recordPath = join(plan.outputDirectory, 'delivery-manifest.json');
  for (const output of plan.outputFiles.filter(({ generated }) => generated)) {
    assertNoSymbolicLinks(plan.baseDirectory, output.path, `output ${output.kind}`);
    if (existsSync(output.path)) {
      fail(`Refusing to overwrite existing output: ${output.path}`);
    }
  }
  assertNoSymbolicLinks(plan.baseDirectory, recordPath, 'delivery manifest');
  if (existsSync(recordPath)) {
    fail(`Refusing to overwrite existing delivery manifest: ${recordPath}`);
  }
  const warnings = [];
  for (const command of plan.commands) {
    const result = spawnSync(command.executable, command.arguments, {
      cwd: dirname(manifestPath),
      encoding: 'utf8',
      env: command.executable === 'latexmk' ? latexEnvironment(dirname(manifestPath)) : process.env,
    });
    if (result.status !== 0) {
      fail(`${command.executable} failed with exit code ${String(result.status)}: ${commandOutput(result).slice(0, 1000)}`);
    }
    const diagnostics = command.executable === 'latexmk' ? await finalLatexDiagnostics(plan, commandOutput(result)) : commandOutput(result);
    const commandWarnings = warningLines(diagnostics);
    warnings.push(...commandWarnings.map((warning) => ({ executable: command.executable, warning })));
    const unresolved = unresolvedReferences(diagnostics);
    if (unresolved.length > 0) {
      fail(`${command.executable} reported unresolved citations or references: ${unresolved.join(' | ').slice(0, 1000)}`);
    }
  }
  const missingOutputs = plan.outputFiles.filter(({ path }) => !existsSync(path));
  if (missingOutputs.length > 0) {
    fail(`Declared outputs were not created: ${missingOutputs.map(({ path }) => path).join(', ')}`);
  }
  for (const output of plan.outputFiles) {
    assertNoSymbolicLinks(plan.baseDirectory, output.path, `output ${output.kind}`);
  }

  const record = {
    source: plan.source,
    sourceSha256: createHash('sha256').update(await readFile(plan.source)).digest('hex'),
    inputFiles: await fileRecords(plan.inputFiles),
    outputs: await fileRecords(plan.outputFiles),
    authoringStack: plan.authoringStack,
    citationStyle: plan.citationStyle,
    commands: plan.commands,
    warnings,
    generatedAt: new Date().toISOString(),
    toolVersions: Object.fromEntries(plan.requiredTools.map((executable) => [executable, toolVersion(executable)])),
  };
  await writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ executed: true, outputDirectory: plan.outputDirectory }, null, 2));
}

function latexEnvironment(baseDirectory) {
  const separator = process.platform === 'win32' ? ';' : ':';
  return {
    ...process.env,
    BIBINPUTS: [baseDirectory, process.env.BIBINPUTS ?? ''].join(separator),
    TEXINPUTS: [baseDirectory, process.env.TEXINPUTS ?? ''].join(separator),
  };
}

async function fileRecords(files) {
  return Promise.all(files.map(async ({ label, kind, path }) => ({
    ...(label ? { label } : {}),
    ...(kind ? { kind } : {}),
    path,
    sha256: createHash('sha256').update(await readFile(path)).digest('hex'),
  })));
}

function commandOutput(result) {
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();
}

async function finalLatexDiagnostics(plan, fallback) {
  const logPath = join(plan.outputDirectory, `${basename(plan.source, extname(plan.source))}.log`);
  return existsSync(logPath) ? readFile(logPath, 'utf8') : fallback;
}

function warningLines(output) {
  return output.split(/\r?\n/).filter((line) => /warning/i.test(line)).map((line) => line.trim());
}

function unresolvedReferences(output) {
  const patterns = [
    /(?:citation|reference).*(?:undefined|not found)/i,
    /undefined (?:citations|references)/i,
    /please \(re\)run (?:biber|bibtex)/i,
    /citeproc.*(?:not found|warning)/i,
  ];
  return output.split(/\r?\n/).filter((line) => patterns.some((pattern) => pattern.test(line))).map((line) => line.trim());
}

function commandExists(executable) {
  const result = spawnSync(executable, ['--version'], { stdio: 'ignore' });
  return !result.error && result.status !== null;
}

function toolVersion(executable) {
  try {
    return execFileSync(executable, ['--version'], { encoding: 'utf8', maxBuffer: 1024 * 1024 }).split(/\r?\n/)[0];
  } catch {
    return 'unavailable';
  }
}

function resolveWithin(baseDirectory, value, label, mustExist = false) {
  if (typeof value !== 'string' || !value) {
    fail(`${label} must be a non-empty relative path.`);
  }
  const resolved = resolve(baseDirectory, value);
  const path = relative(baseDirectory, resolved);
  if (isAbsolute(path) || path === '..' || path.startsWith('../') || path.startsWith('..\\')) {
    fail(`${label} escapes the delivery directory.`);
  }
  assertNoSymbolicLinks(baseDirectory, resolved, label);
  if (mustExist && !existsSync(resolved)) {
    fail(`${label} does not exist.`);
  }
  return resolved;
}

function requiredTools(manifest, commands) {
  const tools = new Set(commands.map(({ executable }) => executable));
  if (manifest.authoringStack === 'pandoc-docx' && manifest.outputs.includes('pdf')) {
    tools.add('xelatex');
  }
  if (manifest.authoringStack === 'latex-bibtex') {
    tools.add('xelatex');
    tools.add('bibtex');
  }
  if (manifest.authoringStack === 'latex-biblatex') {
    tools.add('xelatex');
    tools.add('biber');
  }
  return [...tools];
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
  throw new Error(`academic document generation: ${message}`);
}
