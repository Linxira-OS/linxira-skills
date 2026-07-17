import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [bibliographyArgument, ...options] = process.argv.slice(2);
if (!bibliographyArgument || options.some((option) => !['--allow-incomplete'].includes(option))) {
  console.error('Usage: node validate-bibtex.mjs <references.bib> [--allow-incomplete]');
  process.exitCode = 1;
} else {
  const bibliographyPath = resolve(bibliographyArgument);
  const body = await readFile(bibliographyPath, 'utf8');
  const entries = parseEntries(body);
  const duplicates = entries.filter((entry, index) => entries.findIndex(({ key }) => key === entry.key) !== index).map(({ key }) => key);
  if (duplicates.length > 0) {
    throw new Error(`BibTeX contains duplicate citation keys: ${[...new Set(duplicates)].join(', ')}`);
  }
  if (!options.includes('--allow-incomplete')) {
    const incomplete = entries.filter(({ type, fields }) => !fields.title || (!fields.author && !fields.editor && !fields.organization) || !fields.year || (type === 'incollection' && !fields.booktitle));
    if (incomplete.length > 0) {
      throw new Error(`BibTeX entries require title, creator, and year: ${incomplete.map(({ key }) => key).join(', ')}`);
    }
  }
  console.log(JSON.stringify({ valid: true, entries: entries.length, keys: entries.map(({ key }) => key) }, null, 2));
}

function parseEntries(body) {
  const entries = [];
  let cursor = 0;
  while (cursor < body.length) {
    const start = body.indexOf('@', cursor);
    if (start === -1) {
      break;
    }
    const typeMatch = body.slice(start + 1).match(/^([A-Za-z]+)/);
    if (!typeMatch) {
      throw new Error(`Malformed BibTeX entry at character ${start}.`);
    }
    const type = typeMatch[1].toLowerCase();
    let contentStart = start + 1 + typeMatch[1].length;
    contentStart = skipWhitespace(body, contentStart);
    const open = body[contentStart];
    if (!['{', '('].includes(open)) {
      throw new Error(`BibTeX entry ${type} must open with { or (.`);
    }
    const close = open === '{' ? '}' : ')';
    const entryStart = contentStart + 1;
    const entryEnd = balancedEnd(body, entryStart, open, close);
    if (entryEnd === -1) {
      throw new Error(`Unbalanced BibTeX entry near character ${start}.`);
    }
    if (!['comment', 'preamble', 'string'].includes(type)) {
      const contents = body.slice(entryStart, entryEnd);
      const separator = topLevelComma(contents);
      if (separator === -1) {
        throw new Error(`BibTeX entry ${type} is missing a citation key or field separator.`);
      }
      const key = contents.slice(0, separator).trim();
      if (!/^[^,\s]+$/.test(key)) {
        throw new Error(`Invalid BibTeX citation key: ${key || '(empty)'}`);
      }
      entries.push({ type, key, fields: parseFields(contents.slice(separator + 1), key) });
    }
    cursor = entryEnd + 1;
  }
  if (entries.length === 0) {
    throw new Error('No BibTeX entries found.');
  }
  return entries;
}

function balancedEnd(body, start, open, close) {
  let outerDepth = 1;
  let braceDepth = 0;
  let quoted = false;
  let escaped = false;
  for (let index = start; index < body.length; index += 1) {
    const character = body[index];
    if (quoted) {
      if (!escaped && character === '"') {
        quoted = false;
      }
      escaped = !escaped && character === '\\';
      continue;
    }
    if (character === '"') {
      quoted = true;
      continue;
    }
    if (open === '{') {
      if (character === '{') {
        outerDepth += 1;
      } else if (character === '}') {
        outerDepth -= 1;
        if (outerDepth === 0) {
          return index;
        }
      }
      continue;
    }
    if (character === '{') {
      braceDepth += 1;
    } else if (character === '}' && braceDepth > 0) {
      braceDepth -= 1;
    } else if (braceDepth === 0 && character === open) {
      outerDepth += 1;
    } else if (braceDepth === 0 && character === close) {
      outerDepth -= 1;
      if (outerDepth === 0) {
        return index;
      }
    }
  }
  return -1;
}

function parseFields(body) {
  const fields = {};
  let cursor = 0;
  while (cursor < body.length) {
    cursor = skipWhitespace(body, cursor);
    if (cursor >= body.length) {
      break;
    }
    const nameMatch = body.slice(cursor).match(/^([A-Za-z][A-Za-z0-9_-]*)/);
    if (!nameMatch) {
      throw new Error(`Invalid BibTeX field near ${body.slice(cursor, cursor + 40)}.`);
    }
    const name = nameMatch[1].toLowerCase();
    cursor += nameMatch[1].length;
    cursor = skipWhitespace(body, cursor);
    if (body[cursor] !== '=') {
      throw new Error(`BibTeX field ${name} is missing =.`);
    }
    cursor = skipWhitespace(body, cursor + 1);
    const value = readFieldValue(body, cursor);
    fields[name] = value.value.trim();
    cursor = skipWhitespace(body, value.next);
    if (cursor >= body.length) {
      break;
    }
    if (body[cursor] !== ',') {
      throw new Error(`BibTeX field ${name} must be followed by a comma.`);
    }
    cursor += 1;
  }
  return fields;
}

function readFieldValue(body, start) {
  if (body[start] === '{') {
    const end = balancedEnd(body, start + 1, '{', '}');
    if (end === -1) {
      throw new Error('Unbalanced braced BibTeX field value.');
    }
    return { value: body.slice(start + 1, end), next: end + 1 };
  }
  if (body[start] === '"') {
    let escaped = false;
    for (let index = start + 1; index < body.length; index += 1) {
      if (!escaped && body[index] === '"') {
        return { value: body.slice(start + 1, index), next: index + 1 };
      }
      escaped = !escaped && body[index] === '\\';
    }
    throw new Error('Unbalanced quoted BibTeX field value.');
  }
  const end = topLevelComma(body, start);
  return { value: body.slice(start, end === -1 ? body.length : end), next: end === -1 ? body.length : end };
}

function topLevelComma(body, start = 0) {
  let braceDepth = 0;
  let quoted = false;
  let escaped = false;
  for (let index = start; index < body.length; index += 1) {
    const character = body[index];
    if (quoted) {
      if (!escaped && character === '"') {
        quoted = false;
      }
      escaped = !escaped && character === '\\';
      continue;
    }
    if (character === '"') {
      quoted = true;
    } else if (character === '{') {
      braceDepth += 1;
    } else if (character === '}' && braceDepth > 0) {
      braceDepth -= 1;
    } else if (character === ',' && braceDepth === 0) {
      return index;
    }
  }
  return -1;
}

function skipWhitespace(body, cursor) {
  while (cursor < body.length && /\s/.test(body[cursor])) {
    cursor += 1;
  }
  return cursor;
}
