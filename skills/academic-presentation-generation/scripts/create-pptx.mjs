import { existsSync, lstatSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';

const [command, deckArgument, outputArgument] = process.argv.slice(2);
if (!['plan', 'create'].includes(command) || !deckArgument) {
  console.error('Usage: node create-pptx.mjs <plan|create> <slides.json> [output.pptx]');
  process.exitCode = 1;
} else {
  const deckPath = resolve(deckArgument);
  const deck = JSON.parse(await readFile(deckPath, 'utf8'));
  const baseDirectory = dirname(deckPath);
  const normalizedDeck = validateDeck(deck, baseDirectory);

  if (command === 'plan') {
    console.log(JSON.stringify({ valid: true, slides: normalizedDeck.slides.length, title: normalizedDeck.title }, null, 2));
  } else {
    const output = outputArgument ? resolve(outputArgument) : resolve(baseDirectory, 'dist', 'presentation.pptx');
    assertWithin(baseDirectory, output, 'output');
    if (existsSync(output)) {
      fail(`Refusing to overwrite existing presentation: ${output}`);
    }
    await mkdir(dirname(output), { recursive: true });
    assertWithin(baseDirectory, output, 'output');
    await createPresentation(normalizedDeck, output);
    console.log(JSON.stringify({ created: output, slides: normalizedDeck.slides.length }, null, 2));
  }
}

function validateDeck(deck, baseDirectory) {
  if (!deck || typeof deck !== 'object' || Array.isArray(deck)) {
    fail('Deck must be a JSON object.');
  }
  if (typeof deck.title !== 'string' || !deck.title.trim() || deck.title.length > 120) {
    fail('Deck title is required and must be at most 120 characters.');
  }
  if (!Array.isArray(deck.slides) || deck.slides.length === 0) {
    fail('Deck requires at least one slide.');
  }
  if (deck.aspectRatio && !['wide', 'standard'].includes(deck.aspectRatio)) {
    fail('aspectRatio must be wide or standard.');
  }
  return {
    ...deck,
    slides: deck.slides.map((slide, index) => validateSlide(slide, index + 1, baseDirectory)),
  };
}

function validateSlide(slide, number, baseDirectory) {
  if (!slide || typeof slide !== 'object' || !['title', 'content'].includes(slide.kind)) {
    fail(`Slide ${number} has an invalid kind.`);
  }
  if (typeof slide.title !== 'string' || !slide.title.trim() || slide.title.length > 140) {
    fail(`Slide ${number} needs a title of at most 140 characters.`);
  }
  if (slide.kind === 'content' && (!Array.isArray(slide.body) || slide.body.length === 0 || slide.body.length > 6)) {
    fail(`Content slide ${number} requires 1-6 body points.`);
  }
  if (slide.body?.some((line) => typeof line !== 'string' || line.length > 180)) {
    fail(`Content slide ${number} has an invalid body point.`);
  }
  if (slide.citation !== undefined && (typeof slide.citation !== 'string' || slide.citation.length > 200)) {
    fail(`Slide ${number} has an invalid citation.`);
  }
  let image;
  if (slide.image) {
    image = validateImage(slide.image, number, baseDirectory);
  }
  return { ...slide, image };
}

function validateImage(image, number, baseDirectory) {
  if (!image || typeof image !== 'object' || typeof image.path !== 'string') {
    fail(`Slide ${number} image is invalid.`);
  }
  if (!['evidence', 'schematic', 'decorative'].includes(image.class)) {
    fail(`Slide ${number} image class is invalid.`);
  }
  if (!['user', 'analysis', 'external', 'ai-generated'].includes(image.source)) {
    fail(`Slide ${number} image source is invalid.`);
  }
  const path = resolve(baseDirectory, image.path);
  assertWithin(baseDirectory, path, `slide ${number} image`);
  if (!existsSync(path)) {
    fail(`Slide ${number} image does not exist: ${image.path}`);
  }
  if (image.class === 'evidence' && image.source === 'ai-generated') {
    fail(`Slide ${number} cannot use an AI-generated evidence image.`);
  }
  if (image.source === 'ai-generated' && !/ai-generated/i.test(String(image.label))) {
    fail(`Slide ${number} AI-generated image requires a visible label.`);
  }
  if (image.source === 'external' && ![image.citation, image.citationKey, image.sourceUrl].some((value) => typeof value === 'string' && value.trim())) {
    fail(`Slide ${number} external image requires citation, citationKey, or sourceUrl.`);
  }
  return { ...image, path };
}

async function createPresentation(deck, output) {
  let module;
  try {
    module = await import('pptxgenjs');
  } catch {
    fail('PptxGenJS is required to create PPTX. Install it in the target project with npm install --save-dev pptxgenjs.');
  }
  const PptxGenJS = module.default ?? module;
  const pptx = new PptxGenJS();
  pptx.layout = deck.aspectRatio === 'standard' ? 'LAYOUT_4x3' : 'LAYOUT_WIDE';
  pptx.author = deck.author ?? 'Linxira Skills';
  pptx.subject = 'Academic presentation';
  pptx.title = deck.title;
  pptx.lang = deck.language ?? 'en-US';
  pptx.company = 'Linxira OS';

  for (const [index, definition] of deck.slides.entries()) {
    const slide = pptx.addSlide();
    drawSlide(pptx, slide, definition, index + 1, deck.slides.length, deck.aspectRatio !== 'standard');
  }
  await pptx.writeFile({ fileName: output });
}

function drawSlide(pptx, slide, definition, number, count, wide) {
  const width = wide ? 13.333 : 10;
  const height = wide ? 7.5 : 7.5;
  const accent = '155E75';
  const ink = '18313A';
  const muted = '56727A';
  slide.background = { color: 'FFFFFF' };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: width, h: 0.24, line: { color: accent }, fill: { color: accent } });
  slide.addText(definition.title, { x: 0.55, y: 0.45, w: width - 1.1, h: 0.55, fontFace: 'Aptos Display', fontSize: 24, bold: true, color: ink, margin: 0 });

  if (definition.kind === 'title') {
    if (definition.image) {
      const imageWidth = width * 0.52;
      const imageX = (width - imageWidth) / 2;
      slide.addImage({ path: definition.image.path, x: imageX, y: 1.35, w: imageWidth, h: 3.55, sizing: { type: 'contain', x: imageX, y: 1.35, w: imageWidth, h: 3.55 } });
      addImageAttribution(slide, definition.image, imageX, 5.0, imageWidth, muted);
      slide.addText(definition.subtitle ?? '', { x: 0.7, y: 5.45, w: width - 1.4, h: 0.5, align: 'center', fontFace: 'Aptos', fontSize: 18, color: muted, margin: 0 });
    } else {
      slide.addText(definition.subtitle ?? '', { x: 0.7, y: 2.65, w: width - 1.4, h: 0.7, align: 'center', fontFace: 'Aptos', fontSize: 20, color: muted, margin: 0 });
    }
  } else {
    const imageWidth = definition.image ? width * 0.44 : 0;
    const textWidth = definition.image ? width * 0.47 : width - 1.1;
    slide.addText(definition.body.map((text) => ({ text, options: { bullet: { indent: 16 }, hanging: 4 } })), {
      x: 0.65,
      y: 1.3,
      w: textWidth,
      h: 4.6,
      fontFace: 'Aptos',
      fontSize: definition.image ? 18 : 22,
      color: ink,
      breakLine: true,
      paraSpaceAfterPt: 11,
      margin: 0.04,
      valign: 'top',
    });
    if (definition.image) {
      slide.addImage({ path: definition.image.path, x: width - imageWidth - 0.5, y: 1.35, w: imageWidth, h: 4.35, sizing: { type: 'contain', x: width - imageWidth - 0.5, y: 1.35, w: imageWidth, h: 4.35 } });
      addImageAttribution(slide, definition.image, width - imageWidth - 0.5, 5.78, imageWidth, muted);
    }
  }

  if (definition.citation) {
    slide.addText(definition.citation, { x: 0.55, y: height - 0.42, w: width - 1.35, h: 0.18, fontFace: 'Aptos', fontSize: 8, color: muted, margin: 0 });
  }
  slide.addText(`${number}/${count}`, { x: width - 0.7, y: height - 0.42, w: 0.25, h: 0.18, align: 'right', fontFace: 'Aptos', fontSize: 8, color: muted, margin: 0 });
}

function assertWithin(baseDirectory, target, label) {
  const path = relative(baseDirectory, target);
  if (isAbsolute(path) || path === '..' || path.startsWith('../') || path.startsWith('..\\')) {
    fail(`${label} escapes the presentation directory.`);
  }
  assertNoSymbolicLinks(baseDirectory, target, label);
}

function imageAttributionText(image) {
  if (image.source === 'ai-generated') {
    return { text: image.label, aiGenerated: true };
  }
  if (image.source === 'external') {
    const source = [image.citation, image.citationKey, image.sourceUrl].find((value) => typeof value === 'string' && value.trim());
    return { text: `Source: ${source}`, aiGenerated: false };
  }
  return null;
}

function addImageAttribution(slide, image, x, y, width, muted) {
  const attribution = imageAttributionText(image);
  if (!attribution) {
    return;
  }
  slide.addText(attribution.text, {
    x,
    y,
    w: width,
    h: 0.32,
    fontFace: 'Aptos',
    fontSize: 8,
    italic: attribution.aiGenerated,
    color: attribution.aiGenerated ? '8B3A3A' : muted,
    margin: 0,
  });
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
  throw new Error(`academic presentation generation: ${message}`);
}
