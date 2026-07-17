import { createHash } from 'node:crypto';
import { existsSync, lstatSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';

const imageClasses = new Set(['evidence', 'schematic', 'decorative']);
const imageSources = new Set(['user', 'analysis', 'external', 'ai-generated']);

const [manifestArgument] = process.argv.slice(2);
if (!manifestArgument || ['--help', '-h'].includes(manifestArgument)) {
  console.error('Usage: node validate-image-manifest.mjs <images-manifest.json>');
  process.exitCode = manifestArgument ? 0 : 1;
} else {
  const manifestPath = resolve(manifestArgument);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const baseDirectory = dirname(manifestPath);
  await validateManifest(manifest, baseDirectory);
  console.log(JSON.stringify({ valid: true, assets: manifest.assets.length }, null, 2));
}

async function validateManifest(manifest, baseDirectory) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest) || manifest.version !== 1) {
    fail('Manifest must be a version 1 JSON object.');
  }
  if (!Array.isArray(manifest.assets)) {
    fail('assets must be an array.');
  }
  const ids = new Set();
  for (const asset of manifest.assets) {
    await validateAsset(asset, baseDirectory, ids);
  }
}

async function validateAsset(asset, baseDirectory, ids) {
  if (!asset || typeof asset !== 'object' || Array.isArray(asset)) {
    fail('Each image asset must be an object.');
  }
  if (typeof asset.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(asset.id) || ids.has(asset.id)) {
    fail(`Invalid or duplicate asset id: ${String(asset.id)}`);
  }
  ids.add(asset.id);
  if (!imageClasses.has(asset.class) || !imageSources.has(asset.source)) {
    fail(`Invalid image class or source for ${asset.id}.`);
  }
  if (typeof asset.path !== 'string' || !asset.path) {
    fail(`Missing image path for ${asset.id}.`);
  }
  const imagePath = resolveWithin(baseDirectory, asset.path, `image path for ${asset.id}`, true);
  if (asset.source === 'ai-generated') {
    if (asset.class === 'evidence') {
      fail(`AI-generated asset cannot be evidence: ${asset.id}`);
    }
    if (!/ai-generated/i.test(String(asset.label))) {
      fail(`AI-generated asset requires a visible label: ${asset.id}`);
    }
    if (typeof asset.provenance !== 'string' || !asset.provenance) {
      fail(`AI-generated asset requires a provenance sidecar: ${asset.id}`);
    }
    const provenancePath = resolveWithin(baseDirectory, asset.provenance, `provenance for ${asset.id}`, true);
    const provenance = JSON.parse(await readFile(provenancePath, 'utf8'));
    if (provenance.source !== 'ai-generated' || provenance.class !== asset.class || provenance.label !== asset.label) {
      fail(`AI provenance does not match image manifest asset: ${asset.id}`);
    }
    const imageSha256 = createHash('sha256').update(await readFile(imagePath)).digest('hex');
    if (provenance.imagePath !== asset.path || provenance.imageSha256 !== imageSha256) {
      fail(`AI provenance is not bound to the current image asset: ${asset.id}`);
    }
    if (typeof provenance.model !== 'string' || typeof provenance.generatedAt !== 'string' || typeof provenance.promptSha256 !== 'string') {
      fail(`AI provenance is incomplete: ${asset.id}`);
    }
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
    fail(`${label} escapes the image manifest directory.`);
  }
  assertNoSymbolicLinks(baseDirectory, target, label);
  if (mustExist && !existsSync(target)) {
    fail(`${label} does not exist.`);
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
  throw new Error(`academic image manifest: ${message}`);
}
