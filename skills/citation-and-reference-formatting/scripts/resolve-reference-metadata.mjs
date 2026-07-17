import { existsSync, lstatSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';

const [inputArgument, outputArgument, confirmation] = process.argv.slice(2);
if (!inputArgument || !outputArgument || confirmation !== '--confirm-external-metadata') {
  console.error('Usage: node resolve-reference-metadata.mjs <identifiers.json> <references.json> --confirm-external-metadata');
  process.exitCode = 1;
} else {
  const input = resolve(inputArgument);
  const baseDirectory = dirname(input);
  const output = resolve(outputArgument);
  assertWithin(baseDirectory, input, 'identifier input');
  assertWithin(baseDirectory, output, 'metadata output');
  if (existsSync(output)) {
    fail(`Refusing to overwrite existing metadata output: ${output}`);
  }
  const request = JSON.parse(await readFile(input, 'utf8'));
  const identifiers = validateIdentifiers(request);
  const records = [];
  for (const identifier of identifiers) {
    records.push(identifier.type === 'doi' ? await resolveDoi(identifier.value) : await resolvePmid(identifier.value));
  }
  await mkdir(dirname(output), { recursive: true });
  assertWithin(baseDirectory, output, 'metadata output');
  await writeFile(output, `${JSON.stringify({ version: 1, retrievedAt: new Date().toISOString(), records }, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ resolved: records.length, output }, null, 2));
}

function validateIdentifiers(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request) || !Array.isArray(request.identifiers) || request.identifiers.length === 0) {
    fail('Input must contain a non-empty identifiers array.');
  }
  const seen = new Set();
  return request.identifiers.map((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      fail(`Identifier ${index + 1} must be an object.`);
    }
    const provided = [['doi', entry.doi], ['pmid', entry.pmid]].filter(([, value]) => typeof value === 'string' || typeof value === 'number');
    if (provided.length !== 1) {
      fail(`Identifier ${index + 1} must contain exactly one DOI or PMID.`);
    }
    const [type, rawValue] = provided[0];
    const value = type === 'doi' ? normalizeDoi(String(rawValue)) : String(rawValue).trim();
    if (type === 'doi' && !/^10\.\d{4,9}\/.+$/i.test(value)) {
      fail(`Identifier ${index + 1} has an invalid DOI.`);
    }
    if (type === 'pmid' && !/^\d+$/.test(value)) {
      fail(`Identifier ${index + 1} has an invalid PMID.`);
    }
    const identity = `${type}:${value.toLowerCase()}`;
    if (seen.has(identity)) {
      fail(`Duplicate identifier: ${identity}`);
    }
    seen.add(identity);
    return { type, value };
  });
}

async function resolveDoi(doi) {
  const source = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  const payload = await fetchJson(source);
  const item = payload.message;
  if (!item || typeof item !== 'object') {
    fail(`Crossref did not return a record for DOI ${doi}.`);
  }
  return compactRecord({
    id: `doi:${item.DOI ?? doi}`,
    type: crossrefType(item.type),
    title: first(item.title),
    author: normalizeCrossrefPeople(item.author),
    editor: normalizeCrossrefPeople(item.editor),
    'container-title': first(item['container-title']),
    publisher: item.publisher,
    issued: normalizeDate(item.issued ?? item.published ?? item['published-print'] ?? item['published-online']),
    volume: item.volume,
    issue: item.issue,
    page: item.page,
    DOI: item.DOI ?? doi,
    URL: item.URL ?? `https://doi.org/${item.DOI ?? doi}`,
    metadataSource: 'crossref',
  });
}

async function resolvePmid(pmid) {
  const source = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&retmode=json`;
  const payload = await fetchJson(source);
  const item = payload.result?.[pmid];
  if (!item || typeof item !== 'object') {
    fail(`PubMed did not return a record for PMID ${pmid}.`);
  }
  const doi = item.articleids?.find(({ idtype }) => idtype === 'doi')?.value;
  return compactRecord({
    id: `pmid:${pmid}`,
    type: 'article-journal',
    title: item.title,
    author: item.authors?.map(({ name }) => pubmedPerson(name)).filter(Boolean),
    'container-title': item.fulljournalname || item.source,
    issued: normalizePubmedDate(item.pubdate),
    volume: item.volume,
    issue: item.issue,
    page: item.pages || item.elocationid,
    DOI: doi,
    PMID: pmid,
    URL: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    metadataSource: 'pubmed',
  });
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'linxira-skills/0.1.0 reference-metadata-resolver' },
      signal: controller.signal,
    });
    if (!response.ok) {
      fail(`Metadata service request failed with HTTP ${response.status}.`);
    }
    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      fail('Metadata service request timed out after 30 seconds.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function normalizeDoi(value) {
  return value.trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');
}

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeCrossrefPeople(people) {
  return Array.isArray(people)
    ? people.map(({ family, given, name }) => compactRecord({ family, given, literal: name })).filter((person) => person.family || person.literal)
    : undefined;
}

function pubmedPerson(name) {
  if (typeof name !== 'string' || !name.trim()) {
    return undefined;
  }
  return { literal: name.trim() };
}

function normalizeDate(value) {
  const parts = value?.['date-parts']?.[0];
  return Array.isArray(parts) ? { 'date-parts': [parts] } : undefined;
}

function normalizePubmedDate(value) {
  const year = String(value ?? '').match(/\b(1[89]\d{2}|20\d{2})\b/)?.[1];
  return year ? { 'date-parts': [[Number(year)]] } : undefined;
}

function crossrefType(value) {
  return value === 'journal-article' ? 'article-journal' : value === 'book-chapter' ? 'chapter' : value === 'book' ? 'book' : 'article';
}

function compactRecord(record) {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined && value !== null && value !== ''));
}

function assertWithin(baseDirectory, target, label) {
  const path = relative(baseDirectory, target);
  if (isAbsolute(path) || path === '..' || path.startsWith('../') || path.startsWith('..\\')) {
    fail(`${label} escapes the identifier directory.`);
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
  throw new Error(`reference metadata resolver: ${message}`);
}
