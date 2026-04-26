import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = join(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const raw = String(pkg.version ?? '');
const parts = raw.split('.');

if (parts.length !== 3) {
  throw new Error(`package.json version must be semver x.y.z, got: ${raw}`);
}

const patch = Number(parts[2]);
if (!Number.isFinite(patch)) {
  throw new Error(`Invalid patch segment in version: ${raw}`);
}

parts[2] = String(patch + 1);
pkg.version = parts.join('.');
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(`[deploy] version → ${pkg.version}`);
