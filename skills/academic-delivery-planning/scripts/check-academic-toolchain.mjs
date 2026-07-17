import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const options = new Set(process.argv.slice(2));
if ([...options].some((option) => option !== '--require-all')) {
  console.error('Usage: node check-academic-toolchain.mjs [--require-all]');
  process.exitCode = 1;
} else {
  const tools = [
    ['pandoc', ['--version']],
    [firstAvailable(['libreoffice', 'soffice']) ?? 'libreoffice', ['--version']],
    ['pdfinfo', ['-v']],
    ['pdftotext', ['-v']],
    ['pdftoppm', ['-v']],
    ['latexmk', ['--version']],
    ['xelatex', ['--version']],
    ['bibtex', ['--version']],
    ['biber', ['--version']],
  ];
  const results = tools.map(([command, versionArguments]) => inspectTool(command, versionArguments));
  const missing = results.filter(({ available }) => !available).map(({ command }) => command);
  const resources = [
    inspectResource('fontspec.sty', 'kpsewhich', ['fontspec.sty'], (output) => output.trim().endsWith('fontspec.sty')),
    inspectResource('Latin Modern Roman', 'fc-match', ['-f', '%{file}\n%{family}', 'LM Roman 10'], (output) => /lmroman10-regular\.otf/i.test(output)),
  ];
  const missingResources = resources.filter(({ available }) => !available).map(({ resource }) => resource);
  const platform = await platformDetails();
  const report = {
    platform,
    complete: missing.length === 0 && missingResources.length === 0,
    missing,
    missingResources,
    tools: results,
    resources,
    installRecommendation: recommendation(platform.packageManager),
  };
  console.log(JSON.stringify(report, null, 2));
  if (options.has('--require-all') && !report.complete) {
    process.exitCode = 1;
  }
}

function inspectTool(command, versionArguments) {
  if (!commandExists(command)) {
    return { command, available: false, version: null };
  }
  const result = spawnSync(command, versionArguments, { encoding: 'utf8' });
  const version = (result.stdout || result.stderr || '').trim().split(/\r?\n/)[0] || 'unknown';
  return { command, available: result.status === 0, version };
}

function inspectResource(resource, command, argumentsList, validate) {
  const result = spawnSync(command, argumentsList, { encoding: 'utf8' });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();
  return { resource, command, available: !result.error && result.status === 0 && validate(output), output: output || null };
}

function firstAvailable(commands) {
  return commands.find((command) => commandExists(command));
}

function commandExists(command) {
  const result = spawnSync(command, ['--version'], { stdio: 'ignore' });
  return !result.error && result.status !== null;
}

async function platformDetails() {
  if (process.platform === 'win32') {
    return { os: process.platform, distribution: null, packageManager: null };
  }
  let distribution = null;
  if (existsSync('/etc/os-release')) {
    const body = await readFile('/etc/os-release', 'utf8');
    distribution = body.match(/^ID=(?:"([^"]+)"|([^\n]+))$/m)?.slice(1).find(Boolean) ?? null;
  }
  const packageManager = commandExists('pacman') ? 'pacman' : commandExists('apt-get') ? 'apt-get' : null;
  return { os: process.platform, distribution, packageManager };
}

function recommendation(packageManager) {
  if (packageManager === 'pacman') {
    return 'sudo pacman -Syu --needed pandoc-cli libreoffice-fresh poppler texlive-binextra texlive-xetex texlive-latexrecommended texlive-bibtexextra biber otf-latin-modern ttf-liberation';
  }
  if (packageManager === 'apt-get') {
    return 'sudo apt-get update && sudo apt-get install pandoc libreoffice poppler-utils latexmk texlive-xetex texlive-bibtex-extra biber fonts-liberation fonts-lmodern';
  }
  return null;
}
