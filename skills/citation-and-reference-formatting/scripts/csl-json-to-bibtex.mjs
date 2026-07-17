import { existsSync, lstatSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';

const [inputArgument, outputArgument] = process.argv.slice(2);
if (!inputArgument || !outputArgument) {
  console.error('Usage: node csl-json-to-bibtex.mjs <references.json> <references.bib>');
  process.exitCode = 1;
} else {
  const input = resolve(inputArgument);
  const baseDirectory = dirname(input);
  const output = resolve(outputArgument);
  assertWithin(baseDirectory, input, 'reference input');
  assertWithin(baseDirectory, output, 'BibTeX output');
  if (existsSync(output)) {
    fail(`Refusing to overwrite existing BibTeX output: ${output}`);
  }
  const payload = JSON.parse(await readFile(input, 'utf8'));
  const records = Array.isArray(payload) ? payload : payload.records;
  if (!Array.isArray(records) || records.length === 0) {
    fail('Input must be a non-empty CSL JSON array or a metadata record object.');
  }
  const keys = new Set();
  const entries = records.map((record) => bibtexEntry(record, keys));
  await mkdir(dirname(output), { recursive: true });
  assertWithin(baseDirectory, output, 'BibTeX output');
  await writeFile(output, `${entries.join('\n\n')}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ converted: entries.length, output }, null, 2));
}

function bibtexEntry(record, keys) {
  if (!record || typeof record !== 'object' || typeof record.title !== 'string' || !record.title.trim()) {
    fail('Each CSL record requires a title.');
  }
  const key = uniqueKey(record, keys);
  const type = bibtexType(record.type);
  const fields = [
    ['title', record.title],
    ['author', people(record.author)],
    ['editor', people(record.editor)],
    [type === 'incollection' ? 'booktitle' : 'journal', record['container-title']],
    ['publisher', record.publisher],
    ['year', record.issued?.['date-parts']?.[0]?.[0]],
    ['volume', record.volume],
    ['number', record.issue],
    ['pages', record.page],
    ['doi', record.DOI],
    ['pmid', record.PMID],
    ['url', record.URL],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');
  return `@${type}{${key},\n${fields.map(([name, value]) => `  ${name} = {${escapeValue(String(value))}}`).join(',\n')}\n}`;
}

function uniqueKey(record, keys) {
  const creator = record.author?.[0]?.family || record.author?.[0]?.literal || 'reference';
  const year = record.issued?.['date-parts']?.[0]?.[0] || 'nd';
  const word = record.title.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/)[0] || 'item';
  const base = `${creator}${year}${word}`.replace(/[^A-Za-z0-9]/g, '');
  const root = base || 'reference';
  let key = root;
  let suffix = 1;
  while (keys.has(key)) {
    key = `${root}${suffix}`;
    suffix += 1;
  }
  keys.add(key);
  return key;
}

function people(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return undefined;
  }
  return value
    .map(({ family, given, literal }) => literal ? `{${literal}}` : [family, given].filter(Boolean).join(', '))
    .filter(Boolean)
    .join(' and ');
}

function bibtexType(type) {
  return type === 'book' ? 'book' : type === 'chapter' ? 'incollection' : type === 'dataset' ? 'misc' : 'article';
}

function escapeValue(value) {
  return value
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%_#]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function assertWithin(baseDirectory, target, label) {
  const path = relative(baseDirectory, target);
  if (isAbsolute(path) || path === '..' || path.startsWith('../') || path.startsWith('..\\')) {
    fail(`${label} escapes the reference directory.`);
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
  throw new Error(`CSL JSON to BibTeX: ${message}`);
}
