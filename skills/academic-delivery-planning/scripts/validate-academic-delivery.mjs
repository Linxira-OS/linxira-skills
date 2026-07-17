import { existsSync, lstatSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';

const artifacts = new Set(['paper', 'thesis-chapter', 'report', 'slides', 'poster', 'rebuttal', 'cover-letter']);
const outputs = new Set(['docx', 'pdf', 'tex', 'pptx', 'png', 'source-archive']);
const stacks = new Set(['pandoc-docx', 'latex-bibtex', 'latex-biblatex', 'pptxgenjs']);
const outputsByStack = {
  'pandoc-docx': new Set(['docx', 'pdf', 'tex']),
  'latex-bibtex': new Set(['pdf', 'tex']),
  'latex-biblatex': new Set(['pdf', 'tex']),
  pptxgenjs: new Set(['pptx']),
};
const imageClasses = new Set(['evidence', 'schematic', 'decorative']);
const imageSources = new Set(['user', 'analysis', 'external', 'ai-generated']);

const [manifestArgument] = process.argv.slice(2);
if (!manifestArgument || ['--help', '-h'].includes(manifestArgument)) {
  console.error('Usage: node validate-academic-delivery.mjs <academic-delivery.json>');
  process.exitCode = manifestArgument ? 0 : 1;
} else {
  const manifestPath = resolve(manifestArgument);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const baseDirectory = dirname(manifestPath);
  validateManifest(manifest, baseDirectory);
  console.log(JSON.stringify({ valid: true, artifact: manifest.artifact, outputs: manifest.outputs }, null, 2));
}

function validateManifest(manifest, baseDirectory) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    fail('Manifest must be a JSON object.');
  }
  if (!artifacts.has(manifest.artifact)) {
    fail(`Unsupported artifact: ${String(manifest.artifact)}`);
  }
  if (!Array.isArray(manifest.outputs) || manifest.outputs.length === 0 || manifest.outputs.some((value) => !outputs.has(value))) {
    fail('outputs must be a non-empty array of supported output types.');
  }
  if (!stacks.has(manifest.authoringStack)) {
    fail(`Unsupported authoringStack: ${String(manifest.authoringStack)}`);
  }
  if (manifest.outputs.some((value) => !outputsByStack[manifest.authoringStack].has(value))) {
    fail(`outputs are incompatible with ${manifest.authoringStack}.`);
  }
  if (new Set(manifest.outputs).size !== manifest.outputs.length) {
    fail('outputs must not contain duplicates.');
  }
  if (typeof manifest.language !== 'string' || !manifest.language) {
    fail('language is required.');
  }
  if (typeof manifest.citationStyle !== 'string' || !manifest.citationStyle) {
    fail('citationStyle is required.');
  }
  if (manifest.artifact === 'slides' && !manifest.outputs.includes('pptx')) {
    fail('slides artifacts must include pptx in outputs.');
  }
  if (manifest.artifact === 'slides' && manifest.authoringStack !== 'pptxgenjs') {
    fail('slides artifacts require the pptxgenjs authoringStack.');
  }
  if (manifest.authoringStack === 'pptxgenjs' && !manifest.outputs.includes('pptx')) {
    fail('pptxgenjs requires pptx in outputs.');
  }
  if (['latex-bibtex', 'latex-biblatex'].includes(manifest.authoringStack) && !manifest.outputs.includes('pdf')) {
    fail('LaTeX authoring requires pdf output; the TeX source remains the declared source artifact.');
  }
  if (!manifest.images || typeof manifest.images !== 'object' || Array.isArray(manifest.images)) {
    fail('images must be an object.');
  }
  if (!Array.isArray(manifest.images.assets)) {
    fail('images.assets must be an array.');
  }

  const assetIds = new Set();
  for (const asset of manifest.images.assets) {
    validateAsset(asset, baseDirectory, assetIds, manifest.images);
  }
}

function validateAsset(asset, baseDirectory, assetIds, imagePolicy) {
  if (!asset || typeof asset !== 'object') {
    fail('Each image asset must be an object.');
  }
  if (typeof asset.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(asset.id) || assetIds.has(asset.id)) {
    fail(`Invalid or duplicate image asset id: ${String(asset.id)}`);
  }
  assetIds.add(asset.id);
  if (!imageClasses.has(asset.class) || !imageSources.has(asset.source)) {
    fail(`Invalid image class or source for ${asset.id}.`);
  }
  if (typeof asset.path !== 'string' || !asset.path) {
    fail(`Missing image path for ${asset.id}.`);
  }
  resolveWithin(baseDirectory, asset.path, `image path for ${asset.id}`, asset.required !== false);
  if (asset.source === 'ai-generated' && asset.class === 'evidence') {
    fail(`AI-generated asset cannot be evidence: ${asset.id}`);
  }
  if (asset.source === 'ai-generated' && imagePolicy.allowAiIllustration !== true) {
    fail(`AI-generated asset is disabled by images.allowAiIllustration: ${asset.id}`);
  }
  if (asset.source === 'ai-generated' && !/ai-generated/i.test(String(asset.label))) {
    fail(`AI-generated asset requires a visible AI-generated label: ${asset.id}`);
  }
  if (asset.source === 'external' && ![asset.citation, asset.citationKey, asset.sourceUrl].some((value) => typeof value === 'string' && value.trim())) {
    fail(`External asset requires citation, citationKey, or sourceUrl: ${asset.id}`);
  }
}

function resolveWithin(baseDirectory, value, label, mustExist) {
  if (typeof value !== 'string' || !value) {
    fail(`${label} must be a non-empty relative path.`);
  }
  const target = resolve(baseDirectory, value);
  const path = relative(baseDirectory, target);
  if (isAbsolute(path) || path === '..' || path.startsWith('../') || path.startsWith('..\\')) {
    fail(`${label} escapes the delivery directory.`);
  }
  assertNoSymbolicLinks(baseDirectory, target, label);
  if (mustExist && !existsSync(target)) {
    fail(`Referenced image asset does not exist: ${label}.`);
  }
  return target;
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
  throw new Error(`academic-delivery manifest: ${message}`);
}
