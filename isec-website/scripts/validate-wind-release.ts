import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, sep } from 'node:path';
import { catalogSchema, parseDataset } from '../src/features/wind/dataset';

// Validation only: this command never approves data or publishes a release.
const catalogPath = resolve('public/wind-data/catalog.json');
const catalog = catalogSchema.parse(JSON.parse(await readFile(catalogPath, 'utf8')));
for (const release of catalog.datasets) {
  const path = resolve('public', `.${release.url}`);
  const within = relative(resolve('public/wind-data'), path);
  if (within.startsWith(`..${sep}`) || within === '..') throw new Error('Release path escapes the data directory.');
  const bytes = await readFile(path);
  if (createHash('sha256').update(bytes).digest('hex') !== release.sha256) throw new Error(`Hash mismatch: ${release.url}`);
  const dataset = parseDataset(JSON.parse(bytes.toString('utf8')));
  if (dataset.categoryGroup !== release.group || dataset.version !== release.version) throw new Error('Catalog mismatch.');
  if (/SYNTHETIC|TEST.?ONLY/i.test(`${dataset.version} ${dataset.review.reviewer}`)) throw new Error('Synthetic fixtures cannot be published.');
  console.log(`Validated release structure: ${release.group} / ${release.version}`);
}
console.log(catalog.datasets.length ? 'Structure and integrity checks passed. Engineering sign-off must be reviewed separately.' : 'No published wind datasets. Public results must remain unavailable.');
