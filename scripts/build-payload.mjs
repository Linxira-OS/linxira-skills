import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = join(root, 'skills');
const routeRoot = join(root, 'routes');
const profileRoot = join(root, 'profiles');
const payloadRoot = join(root, 'payload');
const payloadSkills = join(payloadRoot, 'skills');
const allowedClasses = new Set(['reference', 'workflow', 'guard', 'contract']);
const allowedPolicies = new Set(['on-demand', 'conditional', 'required']);
const allowedProfileStatuses = new Set([
  'approved-for-packaging',
  'reviewed-not-packaged',
  'superseded-not-packaged',
]);
const allowedRiskTags = new Set([
  'account-bound',
  'clinical',
  'controlled-data',
  'destructive',
  'expensive',
  'paid',
  'privileged',
  'remote-compute',
]);

const firstPartyLayout = JSON.parse(await readFile(join(root, 'catalog', 'first-party-layout.json'), 'utf8'));
const firstPartyDescriptors = await loadFirstPartyDescriptors();
const manifests = await loadProfileManifests();
const approvedProfiles = [...manifests.values()]
  .filter(({ status }) => status === 'approved-for-packaging')
  .sort((left, right) => left.name.localeCompare(right.name));

if (!approvedProfiles.some(({ name }) => name === 'core')) {
  throw new Error('profiles/core.json must define an approved core profile.');
}

const resolvedProfiles = new Map();
for (const manifest of approvedProfiles) {
  await resolveProfile(manifest.name, []);
}

await rm(payloadRoot, { recursive: true, force: true });
await mkdir(payloadSkills, { recursive: true });

const packagedDescriptors = new Map();
const descriptorProfiles = new Map();
for (const [profileName, descriptors] of resolvedProfiles) {
  for (const descriptor of descriptors) {
    const existing = packagedDescriptors.get(descriptor.id);
    if (existing && !sameDescriptor(existing, descriptor)) {
      throw new Error(`Packaged skill identity collision: ${descriptor.id}`);
    }
    packagedDescriptors.set(descriptor.id, descriptor);
    if (!descriptorProfiles.has(descriptor.id)) {
      descriptorProfiles.set(descriptor.id, []);
    }
    descriptorProfiles.get(descriptor.id).push(profileName);
  }
}

for (const descriptor of [...packagedDescriptors.values()].sort((left, right) => left.id.localeCompare(right.id))) {
  const target = join(payloadSkills, descriptor.name);
  if (descriptor.sourceType === 'first-party') {
    await cp(descriptor.sourcePath, target, { recursive: true });
  } else {
    await mkdir(target, { recursive: true });
    await writeFile(join(target, 'SKILL.md'), descriptor.body);
  }
}

await copyRequiredNotices(packagedDescriptors.values());

const payloadProfiles = {};
for (const manifest of approvedProfiles) {
  const descriptors = resolvedProfiles.get(manifest.name);
  const routes = await buildProfileRoutes(manifest.name, descriptors);
  const skills = descriptors.map((descriptor) => ({
    id: descriptor.id,
    source: `skills/${descriptor.name}`,
    target: descriptor.targetPath,
    kind: 'directory',
  }));
  const entries = [...routes.entries, ...skills];
  validatePayloadEntries(entries, manifest.name);
  payloadProfiles[manifest.name] = {
    entries,
    agentRoutes: routes.agentRoutes,
  };
}

const catalog = [...packagedDescriptors.values()]
  .sort((left, right) => left.name.localeCompare(right.name))
  .map((descriptor) => ({
    id: descriptor.id,
    name: descriptor.name,
    summary: compactSummary(descriptor.description),
    description: descriptor.description,
    skillClass: descriptor.skillClass,
    loadPolicy: descriptor.loadPolicy,
    riskTags: descriptor.riskTags,
    sourceType: descriptor.sourceType,
    sourceTrack: descriptor.sourceTrack,
    sourceRevision: descriptor.sourceRevision,
    license: descriptor.license,
    noticeSha256: descriptor.noticeSha256,
    targetPath: descriptor.targetPath,
    bodySha256: descriptor.bodySha256,
    profiles: descriptorProfiles.get(descriptor.id).sort((left, right) => left.localeCompare(right)),
  }));

await writeFile(join(payloadRoot, 'profiles.json'), `${JSON.stringify({ version: 2, profiles: payloadProfiles }, null, 2)}\n`);
await writeFile(join(payloadRoot, 'catalog.json'), `${JSON.stringify({ version: 2, skills: catalog }, null, 2)}\n`);

async function loadFirstPartyDescriptors() {
  const entries = await readdir(sourceRoot, { withFileTypes: true });
  const skillDirectories = entries
    .filter((entry) => entry.isDirectory() && existsSync(join(sourceRoot, entry.name, 'SKILL.md')))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
  const layoutNames = Object.keys(firstPartyLayout.skills).sort((left, right) => left.localeCompare(right));
  if (JSON.stringify(layoutNames) !== JSON.stringify(skillDirectories)) {
    throw new Error('catalog/first-party-layout.json must map every first-party skill exactly once.');
  }

  const descriptors = new Map();
  for (const directory of skillDirectories) {
    const sourcePath = join(sourceRoot, directory);
    await assertRealContained(sourceRoot, sourcePath, `skills/${directory}`);
    await assertTreeNoSymlinks(sourcePath, `skills/${directory}`);
    const body = await readFile(join(sourcePath, 'SKILL.md'), 'utf8');
    const metadata = parseFrontmatter(body, `skills/${directory}/SKILL.md`);
    const targetPath = firstPartyLayout.skills[metadata.name];
    if (metadata.name !== directory) {
      throw new Error(`First-party skill name must match its directory: ${directory}`);
    }
    validateDescriptorMetadata(metadata, `skills/${directory}/SKILL.md`);
    assertTargetPath(targetPath);
    descriptors.set(metadata.name, {
      id: metadata.name,
      name: metadata.name,
      description: metadata.description,
      skillClass: metadata.skill_class,
      loadPolicy: metadata.load_policy,
      riskTags: parseInlineList(metadata.risk_tags, `skills/${directory}/SKILL.md risk_tags`),
      sourceType: 'first-party',
      sourceTrack: 'project',
      sourceRevision: null,
      license: 'MIT',
      notice: null,
      noticeTarget: null,
      targetPath,
      bodySha256: normalizedTextHash(body),
      sourcePath,
    });
  }
  return descriptors;
}

async function loadProfileManifests() {
  const files = (await readdir(profileRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
  const loaded = new Map();
  for (const file of files) {
    const manifest = JSON.parse(await readFile(join(profileRoot, file), 'utf8'));
    if (!manifest || manifest.schemaVersion !== 2 || typeof manifest.name !== 'string' || typeof manifest.status !== 'string') {
      throw new Error(`Unsupported profile manifest: profiles/${file}`);
    }
    if (basename(file, '.json') !== manifest.name) {
      throw new Error(`Profile filename must match its name: profiles/${file}`);
    }
    if (loaded.has(manifest.name)) {
      throw new Error(`Duplicate profile name: ${manifest.name}`);
    }
    await validateProfileManifest(manifest, `profiles/${file}`);
    loaded.set(manifest.name, manifest);
  }
  return loaded;
}

async function resolveProfile(profileName, stack) {
  if (resolvedProfiles.has(profileName)) {
    return resolvedProfiles.get(profileName);
  }
  if (stack.includes(profileName)) {
    throw new Error(`Profile inheritance cycle: ${[...stack, profileName].join(' -> ')}`);
  }
  const manifest = manifests.get(profileName);
  if (!manifest) {
    throw new Error(`Unknown base profile: ${profileName}`);
  }
  if (manifest.status !== 'approved-for-packaging') {
    throw new Error(`Approved profiles cannot extend a non-packaged profile: ${profileName}`);
  }

  const descriptors = new Map();
  if (manifest.baseProfile) {
    for (const descriptor of await resolveProfile(manifest.baseProfile, [...stack, profileName])) {
      descriptors.set(descriptor.id, descriptor);
    }
  }

  for (const name of manifest.firstPartySkills ?? []) {
    const descriptor = firstPartyDescriptors.get(name);
    if (!descriptor) {
      throw new Error(`Unknown first-party skill in ${profileName}: ${name}`);
    }
    addProfileDescriptor(descriptors, descriptor, profileName);
  }

  const tracks = new Map((manifest.sourceTracks ?? []).map((track) => [track.id, track]));
  for (const skill of manifest.skills ?? []) {
    const track = tracks.get(skill.sourceTrack);
    if (!track) {
      throw new Error(`Unknown source track for ${profileName}/${skill.name}: ${String(skill.sourceTrack)}`);
    }
    addProfileDescriptor(descriptors, await reviewedDescriptor(profileName, track, skill), profileName);
  }

  const resolved = [...descriptors.values()];
  resolvedProfiles.set(profileName, resolved);
  return resolved;
}

async function reviewedDescriptor(profileName, track, skill) {
  assertRelativeSkillPath(skill.relativePath);
  assertTargetPath(skill.targetPath);
  if (!allowedClasses.has(skill.skillClass) || !allowedPolicies.has(skill.loadPolicy)) {
    throw new Error(`Invalid reviewed descriptor policy: ${profileName}/${skill.name}`);
  }
  const riskTags = validateRiskTags(skill.riskTags, `${profileName}/${skill.name}`);
  const repositoryPath = resolveWithin(root, track.repositoryPath, `${profileName}/${track.id} repositoryPath`);
  await assertRealContained(root, repositoryPath, `${profileName}/${track.id} repositoryPath`);
  await assertGitRepository(repositoryPath, track.revision, `${profileName}/${track.id}`);
  const skillRoot = resolveWithin(root, track.skillRoot, `${profileName}/${track.id} skillRoot`);
  assertContained(repositoryPath, skillRoot, `${profileName}/${track.id} skillRoot`);
  await assertRealContained(repositoryPath, skillRoot, `${profileName}/${track.id} skillRoot`);
  const sourcePath = resolveWithin(skillRoot, skill.relativePath, `${profileName}/${skill.name} relativePath`);
  const body = gitFile(repositoryPath, track.revision, join(sourcePath, 'SKILL.md'), `${profileName}/${skill.name} SKILL.md`, 'utf8');
  const noticePath = resolveWithin(root, track.notice, `${profileName}/${track.id} notice`);
  const noticeBody = gitFile(repositoryPath, track.revision, noticePath, `${profileName}/${track.id} notice`);
  const metadata = parseFrontmatter(body, `${profileName}/${skill.relativePath}/SKILL.md`);
  if (metadata.name !== skill.name || !metadata.description) {
    throw new Error(`Reviewed source skill changed or is invalid: ${skill.relativePath}`);
  }
  const bodySha256 = normalizedTextHash(body);
  if (bodySha256 !== skill.bodySha256) {
    throw new Error(`Reviewed source skill hash changed: ${skill.relativePath}`);
  }
  return {
    id: skill.name,
    name: skill.name,
    description: metadata.description,
    skillClass: skill.skillClass,
    loadPolicy: skill.loadPolicy,
    riskTags,
    sourceType: 'reviewed-third-party',
    sourceTrack: track.id,
    sourceRevision: track.revision,
    license: track.license,
    notice: track.notice,
    noticeTarget: track.noticeTarget,
    noticeBody,
    noticeSha256: createHash('sha256').update(noticeBody).digest('hex'),
    targetPath: skill.targetPath,
    bodySha256,
    body,
    sourcePath,
  };
}

function addProfileDescriptor(descriptors, descriptor, profileName) {
  const existing = descriptors.get(descriptor.id);
  if (existing && !sameDescriptor(existing, descriptor)) {
    throw new Error(`Conflicting skill inherited by ${profileName}: ${descriptor.id}`);
  }
  for (const current of descriptors.values()) {
    if (current.id !== descriptor.id && current.targetPath === descriptor.targetPath) {
      throw new Error(`Duplicate target path inherited by ${profileName}: ${descriptor.targetPath}`);
    }
  }
  descriptors.set(descriptor.id, descriptor);
}

async function copyRequiredNotices(descriptors) {
  const notices = new Map();
  for (const descriptor of descriptors) {
    if (!descriptor.notice) {
      continue;
    }
    const existing = notices.get(descriptor.noticeTarget);
    if (existing && existing.noticeSha256 !== descriptor.noticeSha256) {
      throw new Error(`Notice target collision: ${descriptor.noticeTarget}`);
    }
    notices.set(descriptor.noticeTarget, descriptor);
  }
  if (notices.size === 0) {
    return;
  }
  await mkdir(join(payloadRoot, 'notices'), { recursive: true });
  for (const [target, descriptor] of [...notices].sort(([left], [right]) => left.localeCompare(right))) {
    const destination = resolveWithin(join(payloadRoot, 'notices'), target, `notice target ${target}`);
    await writeFile(destination, descriptor.noticeBody);
  }
}

async function buildProfileRoutes(profileName, descriptors) {
  const required = new Map();
  for (const descriptor of descriptors) {
    const [route, branch] = descriptor.targetPath.split('/');
    if (!required.has(route)) {
      required.set(route, new Map());
    }
    if (!required.get(route).has(branch)) {
      required.get(route).set(branch, []);
    }
    required.get(route).get(branch).push(descriptor);
  }

  const allowedTargets = new Set();
  for (const [route, branches] of required) {
    allowedTargets.add(`${route}/SKILL.md`);
    for (const [branch, skills] of branches) {
      allowedTargets.add(`${route}/${branch}/INDEX.md`);
      for (const skill of skills) {
        allowedTargets.add(`${skill.targetPath}/SKILL.md`);
      }
    }
  }

  const entries = [];
  const agentRoutes = [];
  for (const [route, branches] of [...required].sort(([left], [right]) => left.localeCompare(right))) {
    const routerTarget = `${route}/SKILL.md`;
    const routerBody = await renderRouteTemplate(routerTarget, allowedTargets);
    await writeGeneratedRoute(profileName, routerTarget, routerBody);
    entries.push(routeEntry(`route-${route}`, profileName, routerTarget));
    const metadata = parseFrontmatter(routerBody, `routes/${routerTarget}`);
    validateDescriptorMetadata(metadata, `routes/${routerTarget}`);
    agentRoutes.push({ path: routerTarget, description: metadata.description });

    for (const [branch, skills] of [...branches].sort(([left], [right]) => left.localeCompare(right))) {
      const indexTarget = `${route}/${branch}/INDEX.md`;
      const indexBody = await renderRouteTemplate(indexTarget, allowedTargets);
      await writeGeneratedRoute(profileName, indexTarget, indexBody);
      entries.push(routeEntry(`route-${route}-${branch}`, profileName, indexTarget));
      const references = resolvedReferences(indexBody, indexTarget);
      for (const skill of skills) {
        if (!references.has(`${skill.targetPath}/SKILL.md`)) {
          throw new Error(`Route index does not advertise ${skill.id}: routes/${indexTarget}`);
        }
      }
    }

    const routerReferences = resolvedReferences(routerBody, routerTarget);
    for (const branch of branches.keys()) {
      const expected = `${route}/${branch}/INDEX.md`;
      if (!routerReferences.has(expected)) {
        throw new Error(`Top-level router does not advertise branch: ${expected}`);
      }
    }
  }
  return { entries, agentRoutes };
}

async function renderRouteTemplate(target, allowedTargets) {
  const source = join(routeRoot, ...target.split('/'));
  await assertRealContained(routeRoot, source, `route template ${target}`);
  const body = await readFile(source, 'utf8');
  const lines = body.split(/\r?\n/);
  const filtered = lines.filter((line) => {
    const references = markdownReferences(line);
    if (/(?:INDEX|SKILL)\.md/.test(line) && references.length === 0) {
      throw new Error(`Route references must use backticked relative paths: ${target}`);
    }
    if (references.length > 0 && !line.trimStart().startsWith('- ')) {
      throw new Error(`Route references must be single-line list items: ${target}`);
    }
    if (!line.trimStart().startsWith('- ')) {
      return true;
    }
    return references.length === 0 || references.every((reference) => allowedTargets.has(resolveRouteReference(target, reference)));
  });
  const rendered = filtered.join('\n').replace(/\n{3,}/g, '\n\n');
  for (const reference of resolvedReferences(rendered, target)) {
    if (!allowedTargets.has(reference)) {
      throw new Error(`Generated route contains a dangling reference: ${target} -> ${reference}`);
    }
  }
  return rendered.endsWith('\n') ? rendered : `${rendered}\n`;
}

async function writeGeneratedRoute(profileName, target, body) {
  const destination = join(payloadRoot, 'routes', profileName, ...target.split('/'));
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, body);
}

function routeEntry(id, profileName, target) {
  return { id, source: `routes/${profileName}/${target}`, target, kind: 'file' };
}

function validatePayloadEntries(entries, profileName) {
  const ids = new Set();
  const targets = new Set();
  for (const entry of entries) {
    assertId(entry.id, `${profileName} payload entry`);
    if (ids.has(entry.id)) {
      throw new Error(`Duplicate payload entry ID in ${profileName}: ${entry.id}`);
    }
    if (targets.has(entry.target)) {
      throw new Error(`Duplicate payload target in ${profileName}: ${entry.target}`);
    }
    ids.add(entry.id);
    targets.add(entry.target);
  }
}

function resolvedReferences(body, target) {
  return new Set(markdownReferences(body).map((reference) => resolveRouteReference(target, reference)));
}

function markdownReferences(body) {
  return [...body.matchAll(/`([^`]+\/(?:INDEX|SKILL)\.md)`/g)].map((match) => match[1]);
}

function resolveRouteReference(target, reference) {
  if (reference.startsWith('/') || reference.includes('\\')) {
    throw new Error(`Invalid route reference in ${target}: ${reference}`);
  }
  const resolved = posix.normalize(posix.join(posix.dirname(target), reference));
  if (resolved === '..' || resolved.startsWith('../')) {
    throw new Error(`Route reference escapes the managed tree in ${target}: ${reference}`);
  }
  return resolved;
}

function parseFrontmatter(body, label) {
  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`Missing YAML frontmatter: ${label}`);
  }
  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!field) {
      continue;
    }
    if (Object.hasOwn(values, field[1])) {
      throw new Error(`Duplicate frontmatter field ${field[1]}: ${label}`);
    }
    values[field[1]] = field[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return values;
}

function validateDescriptorMetadata(metadata, label) {
  assertId(metadata.name, `${label} name`);
  if (!metadata.name || !metadata.description || !allowedClasses.has(metadata.skill_class) || !allowedPolicies.has(metadata.load_policy)) {
    throw new Error(`Invalid first-party metadata: ${label}`);
  }
  validateRiskTags(parseInlineList(metadata.risk_tags, `${label} risk_tags`), label);
}

function parseInlineList(value, label) {
  const match = value?.match(/^\[(.*)\]$/);
  if (!match) {
    throw new Error(`Expected an inline YAML list: ${label}`);
  }
  if (!match[1].trim()) {
    return [];
  }
  return match[1].split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
}

function validateRiskTags(value, label) {
  if (!Array.isArray(value) || value.some((tag) => !allowedRiskTags.has(tag))) {
    throw new Error(`Invalid risk tags: ${label}`);
  }
  return [...value];
}

function sameDescriptor(left, right) {
  return left.id === right.id
    && left.name === right.name
    && left.description === right.description
    && left.targetPath === right.targetPath
    && left.bodySha256 === right.bodySha256
    && left.skillClass === right.skillClass
    && left.loadPolicy === right.loadPolicy
    && JSON.stringify(left.riskTags) === JSON.stringify(right.riskTags)
    && left.sourceType === right.sourceType
    && left.sourceTrack === right.sourceTrack
    && left.sourceRevision === right.sourceRevision
    && left.license === right.license
    && left.notice === right.notice
    && left.noticeTarget === right.noticeTarget
    && left.noticeSha256 === right.noticeSha256
    && left.sourcePath === right.sourcePath;
}

function compactSummary(description) {
  const normalized = description.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 240) {
    return normalized;
  }
  const shortened = normalized.slice(0, 237).replace(/\s+\S*$/, '').trimEnd();
  return `${shortened || normalized.slice(0, 237)}...`;
}

function normalizedTextHash(body) {
  return createHash('sha256').update(body.replace(/\r\n/g, '\n')).digest('hex');
}

function assertRelativeSkillPath(value) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*$/.test(value)) {
    throw new Error(`Invalid reviewed source path: ${String(value)}`);
  }
}

function assertTargetPath(value) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*){2}$/.test(value)) {
    throw new Error(`Invalid three-level target path: ${String(value)}`);
  }
}

async function validateProfileManifest(manifest, label) {
  assertId(manifest.name, `${label} name`);
  if (!allowedProfileStatuses.has(manifest.status)) {
    throw new Error(`Invalid profile status in ${label}: ${manifest.status}`);
  }
  if (manifest.baseProfile !== null && manifest.baseProfile !== undefined) {
    assertId(manifest.baseProfile, `${label} baseProfile`);
  }
  for (const field of ['firstPartySkills', 'sourceTracks', 'skills']) {
    if (!Array.isArray(manifest[field])) {
      throw new Error(`${label} must define ${field} as an array.`);
    }
  }

  assertUnique(manifest.firstPartySkills, `${label} firstPartySkills`);
  for (const name of manifest.firstPartySkills) {
    assertId(name, `${label} first-party skill`);
  }

  const tracks = new Map();
  for (const track of manifest.sourceTracks) {
    if (!track || typeof track !== 'object') {
      throw new Error(`Invalid source track in ${label}`);
    }
    assertId(track.id, `${label} source track id`);
    if (tracks.has(track.id)) {
      throw new Error(`Duplicate source track in ${label}: ${track.id}`);
    }
    assertPortableRelativePath(track.repositoryPath, `${label}/${track.id} repositoryPath`);
    assertPortableRelativePath(track.skillRoot, `${label}/${track.id} skillRoot`);
    assertPortableRelativePath(track.notice, `${label}/${track.id} notice`);
    assertFilename(track.noticeTarget, `${label}/${track.id} noticeTarget`);
    if (typeof track.revision !== 'string' || !/^[0-9a-f]{40}$/.test(track.revision) || typeof track.license !== 'string' || !track.license) {
      throw new Error(`Invalid revision or license in ${label}: ${track.id}`);
    }
    const repositoryPath = resolveWithin(root, track.repositoryPath, `${label}/${track.id} repositoryPath`);
    const skillRoot = resolveWithin(root, track.skillRoot, `${label}/${track.id} skillRoot`);
    const noticePath = resolveWithin(root, track.notice, `${label}/${track.id} notice`);
    assertContained(repositoryPath, skillRoot, `${label}/${track.id} skillRoot`);
    assertContained(repositoryPath, noticePath, `${label}/${track.id} notice`);
    await assertRealContained(root, repositoryPath, `${label}/${track.id} repositoryPath`);
    await assertRealContained(repositoryPath, skillRoot, `${label}/${track.id} skillRoot`);
    await assertRealContained(repositoryPath, noticePath, `${label}/${track.id} notice`);
    await assertGitRepository(repositoryPath, track.revision, `${label}/${track.id}`);
    gitFile(repositoryPath, track.revision, noticePath, `${label}/${track.id} notice`);
    tracks.set(track.id, track);
  }

  const skillNames = new Set();
  const targets = new Set();
  for (const skill of manifest.skills) {
    assertId(skill.name, `${label} reviewed skill name`);
    if (skillNames.has(skill.name)) {
      throw new Error(`Duplicate reviewed skill in ${label}: ${skill.name}`);
    }
    skillNames.add(skill.name);
    if (!tracks.has(skill.sourceTrack)) {
      throw new Error(`Unknown source track in ${label}/${skill.name}: ${String(skill.sourceTrack)}`);
    }
    assertRelativeSkillPath(skill.relativePath);
    assertTargetPath(skill.targetPath);
    if (targets.has(skill.targetPath)) {
      throw new Error(`Duplicate reviewed target in ${label}: ${skill.targetPath}`);
    }
    targets.add(skill.targetPath);
    if (!allowedClasses.has(skill.skillClass) || !allowedPolicies.has(skill.loadPolicy)) {
      throw new Error(`Invalid reviewed descriptor policy: ${label}/${skill.name}`);
    }
    validateRiskTags(skill.riskTags, `${label}/${skill.name}`);
    if (typeof skill.bodySha256 !== 'string' || !/^[0-9a-f]{64}$/.test(skill.bodySha256)) {
      throw new Error(`Invalid reviewed body hash: ${label}/${skill.name}`);
    }
    const track = tracks.get(skill.sourceTrack);
    const repositoryPath = resolveWithin(root, track.repositoryPath, `${label}/${track.id} repositoryPath`);
    const skillRoot = resolveWithin(root, track.skillRoot, `${label}/${track.id} skillRoot`);
    const sourcePath = resolveWithin(skillRoot, skill.relativePath, `${label}/${skill.name} relativePath`);
    const body = gitFile(repositoryPath, track.revision, join(sourcePath, 'SKILL.md'), `${label}/${skill.name} SKILL.md`, 'utf8');
    const metadata = parseFrontmatter(body, `${label}/${skill.relativePath}/SKILL.md`);
    if (metadata.name !== skill.name || normalizedTextHash(body) !== skill.bodySha256) {
      throw new Error(`Reviewed source skill changed or is invalid: ${label}/${skill.relativePath}`);
    }
  }
}

function assertId(value, label) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(value)) {
    throw new Error(`Invalid identifier for ${label}: ${String(value)}`);
  }
}

function assertUnique(values, label) {
  if (new Set(values).size !== values.length) {
    throw new Error(`Duplicate entries in ${label}`);
  }
}

function assertPortableRelativePath(value, label) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]*(?:\/[A-Za-z0-9][A-Za-z0-9._-]*)*$/.test(value)) {
    throw new Error(`Invalid portable relative path for ${label}: ${String(value)}`);
  }
}

function assertFilename(value, label) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value)) {
    throw new Error(`Invalid filename for ${label}: ${String(value)}`);
  }
}

function resolveWithin(base, value, label) {
  assertPortableRelativePath(value, label);
  const resolvedPath = resolve(base, ...value.split('/'));
  assertContained(base, resolvedPath, label);
  return resolvedPath;
}

function assertContained(base, candidate, label) {
  const path = relative(base, candidate);
  if (path === '..' || path.startsWith(`..${posix.sep}`) || path.startsWith('..\\') || isAbsolute(path)) {
    throw new Error(`Path escapes its allowed root for ${label}`);
  }
}

async function assertRealContained(base, candidate, label) {
  const [realBase, realCandidate] = await Promise.all([realpath(base), realpath(candidate)]);
  assertContained(realBase, realCandidate, label);
}

async function assertTreeNoSymlinks(directory, label) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Symbolic links are not allowed in packaged first-party skills: ${label}/${entry.name}`);
    }
    if (entry.isDirectory()) {
      await assertTreeNoSymlinks(path, `${label}/${entry.name}`);
    }
  }
}

async function assertGitRepository(repositoryPath, revision, label) {
  const topLevel = execFileSync('git', ['-C', repositoryPath, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const [realRepository, realTopLevel] = await Promise.all([realpath(repositoryPath), realpath(topLevel)]);
  const normalize = (value) => process.platform === 'win32' ? value.toLowerCase() : value;
  if (normalize(realRepository) !== normalize(realTopLevel)) {
    throw new Error(`Declared repositoryPath is not a Git root: ${label}`);
  }
  const checkedOutRevision = execFileSync('git', ['-C', repositoryPath, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (checkedOutRevision !== revision) {
    throw new Error(`Source track revision mismatch for ${label}: expected ${revision}, found ${checkedOutRevision}`);
  }
}

function gitFile(repositoryPath, revision, absolutePath, label, encoding = undefined) {
  assertContained(repositoryPath, absolutePath, label);
  const gitPath = relative(repositoryPath, absolutePath).replace(/\\/g, '/');
  if (!gitPath || gitPath === '.') {
    throw new Error(`Expected a file path inside the source repository: ${label}`);
  }
  return execFileSync('git', ['-C', repositoryPath, 'show', `${revision}:${gitPath}`], {
    encoding,
    maxBuffer: 16 * 1024 * 1024,
  });
}
