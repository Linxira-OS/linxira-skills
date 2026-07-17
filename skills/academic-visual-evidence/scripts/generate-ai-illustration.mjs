import { createHash } from 'node:crypto';
import { existsSync, lstatSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';

const [requestArgument, confirmation] = process.argv.slice(2);
if (!requestArgument || confirmation !== '--confirm-external-generation') {
  console.error('Usage: node generate-ai-illustration.mjs <request.json> --confirm-external-generation');
  process.exitCode = 1;
} else {
  const requestPath = resolve(requestArgument);
  const request = JSON.parse(await readFile(requestPath, 'utf8'));
  const baseDirectory = dirname(requestPath);
  const destinations = validateRequest(request, baseDirectory);
  await generate(request, destinations, requestPath);
}

function validateRequest(request, baseDirectory) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    fail('Request must be a JSON object.');
  }
  if (!['schematic', 'decorative'].includes(request.class)) {
    fail('AI generation is allowed only for schematic or decorative images, never evidence.');
  }
  if (typeof request.prompt !== 'string' || request.prompt.trim().length < 20) {
    fail('A descriptive prompt of at least 20 characters is required.');
  }
  if (typeof request.purpose !== 'string' || !request.purpose.trim()) {
    fail('purpose is required.');
  }
  if (request.externalGenerationApproved !== true) {
    fail('externalGenerationApproved must be true after user approval.');
  }
  if (!/ai-generated/i.test(String(request.label))) {
    fail('label must visibly identify the image as AI-generated.');
  }
  if (typeof request.output !== 'string' || !request.output) {
    fail('output is required.');
  }
  const output = resolve(baseDirectory, request.output);
  assertWithin(baseDirectory, output, 'output');
  const provenancePath = `${output}.provenance.json`;
  if (existsSync(output) || existsSync(provenancePath)) {
    fail(`Refusing to overwrite an existing image or provenance record: ${output}`);
  }
  if (!['1024x1024', '1536x1024', '1024x1536'].includes(request.size ?? '1024x1024')) {
    fail('size must be 1024x1024, 1536x1024, or 1024x1536.');
  }
  return { output, provenancePath };
}

async function generate(request, destinations, requestPath) {
  const { output, provenancePath } = destinations;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    fail('OPENAI_API_KEY is required for external image generation.');
  }
  await mkdir(dirname(output), { recursive: true });
  assertWithin(dirname(requestPath), output, 'output');
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: request.model ?? 'gpt-image-1',
      prompt: request.prompt,
      size: request.size ?? '1024x1024',
      n: 1,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    fail(`Image API request failed (${response.status}): ${body.slice(0, 500)}`);
  }
  const payload = await response.json();
  const result = payload.data?.[0];
  if (!result) {
    fail('Image API response did not contain an image result.');
  }

  let bytes;
  if (result.b64_json) {
    bytes = Buffer.from(result.b64_json, 'base64');
  } else if (result.url) {
    const imageResponse = await fetch(result.url);
    if (!imageResponse.ok) {
      fail(`Image download failed (${imageResponse.status}).`);
    }
    bytes = Buffer.from(await imageResponse.arrayBuffer());
  } else {
    fail('Image API response did not contain b64_json or url.');
  }

  try {
    await writeFile(output, bytes, { flag: 'wx' });
  } catch (error) {
    if (error.code === 'EEXIST') {
      fail(`Refusing to overwrite existing image: ${output}`);
    }
    throw error;
  }
  const record = {
    class: request.class,
    source: 'ai-generated',
    label: request.label,
    purpose: request.purpose,
    model: request.model ?? 'gpt-image-1',
    size: request.size ?? '1024x1024',
    promptSha256: createHash('sha256').update(request.prompt).digest('hex'),
    imagePath: request.output,
    imageSha256: createHash('sha256').update(bytes).digest('hex'),
    request: relative(dirname(requestPath), requestPath),
    generatedAt: new Date().toISOString(),
  };
  try {
    await writeFile(provenancePath, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
  } catch (error) {
    await rm(output, { force: true });
    throw error;
  }
  console.log(JSON.stringify({ generated: output, provenance: provenancePath, label: request.label }, null, 2));
}

function assertWithin(baseDirectory, target, label) {
  const path = relative(baseDirectory, target);
  if (isAbsolute(path) || path === '..' || path.startsWith('../') || path.startsWith('..\\')) {
    fail(`${label} escapes the request directory.`);
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
  throw new Error(`academic AI illustration: ${message}`);
}
