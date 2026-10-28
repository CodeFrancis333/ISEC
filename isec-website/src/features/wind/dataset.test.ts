import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogSchema, lookupWind, parseDataset, triangleVelocity } from './dataset';
import { categoryMetadata, kmhToMs, type Category } from '../../../../wind-map/shared/contracts';

// SYNTHETIC SOFTWARE FIXTURE. Not NSCP data; never published or shipped in the application.
function fixture() {
  return parseDataset({
    version: 'SYNTHETIC-TEST-ONLY', edition: 'NSCP 2015', categoryGroup: 'II', sourceFigure: '207A.5-1B', status: 'approved',
    review: { reviewer: 'SYNTHETIC TEST ONLY', approvedAt: '2026-01-01T00:00:00Z', rightsConfirmed: true, methodology: 'Synthetic barycentric interpolation for software tests only.', checkpointReport: 'synthetic-test', positionalUncertaintyM: 0 },
    coverage: { type: 'Polygon', coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]] },
    contours: { type: 'FeatureCollection', features: [
      { type: 'Feature', id: 'SYNTHETIC-LINE', geometry: { type: 'LineString', coordinates: [[0, 0], [0, 10]] }, properties: { velocity_kmh: 200, verification_status: 'approved' } },
    ] },
    zones: { type: 'FeatureCollection', features: [
      { type: 'Feature', id: 'SYNTHETIC-TRIANGLE', geometry: { type: 'Polygon', coordinates: [[[0, 0], [10, 0], [0, 10], [0, 0]]] }, properties: { method: 'reviewed-linear-triangle', vertex_speeds_kmh: [200, 300, 200], verification_status: 'approved' } },
    ] },
  });
}
const input = { latitude: 2, longitude: 2, occupancyCategory: 'II' as Category };
test('category mappings match source figure captions', () => {
  assert.equal(categoryMetadata.I.figure, '207A.5-1C');
  assert.equal(categoryMetadata.II.figure, '207A.5-1B');
  for (const key of ['III', 'IV', 'V'] as Category[]) assert.equal(categoryMetadata[key].group, 'III_IV_V');
});
test('no approved dataset returns null velocities for every category', () => {
  for (const category of Object.keys(categoryMetadata) as Category[]) {
    const result = lookupWind({ ...input, occupancyCategory: category }, null);
    assert.equal(result.status, 'no_approved_dataset'); assert.equal(result.velocityKmh, null); assert.equal(result.velocityMs, null);
  }
});
test('invalid coordinates and category are rejected', () => {
  for (const latitude of [NaN, Infinity, 91, -91]) assert.throws(() => lookupWind({ ...input, latitude }, null));
  for (const longitude of [Infinity, 181, -181]) assert.throws(() => lookupWind({ ...input, longitude }, null));
  assert.throws(() => lookupWind({ ...input, occupancyCategory: 'toString' as Category }, null));
});
test('unit conversion retains internal precision', () => assert.equal(kmhToMs(241), 241 / 3.6));
test('draft data and missing rights cannot enter the lookup', () => {
  assert.throws(() => parseDataset({ ...fixture(), status: 'draft' }));
  const data = fixture(); assert.throws(() => parseDataset({ ...data, review: { ...data.review, rightsConfirmed: false } }));
});
test('source/category mismatch is rejected', () => assert.throws(() => parseDataset({ ...fixture(), sourceFigure: '207A.5-1C' })));
test('wrong selected category or version never produces a velocity', () => {
  assert.equal(lookupWind({ ...input, occupancyCategory: 'I' }, fixture()).status, 'dataset_unavailable');
  assert.equal(lookupWind({ ...input, datasetVersion: 'withdrawn' }, fixture()).velocityKmh, null);
});
test('exact contour boundary returns contour value', () => {
  const result = lookupWind({ ...input, longitude: 0 }, fixture());
  assert.equal(result.status, 'verified'); assert.equal(result.velocityKmh, 200); assert.deepEqual(result.featureIds, ['SYNTHETIC-LINE']);
});
test('reviewed triangle interpolates without rounding', () => {
  const result = lookupWind(input, fixture());
  assert.equal(result.status, 'verified'); assert.ok(Math.abs(result.velocityKmh! - 220) < 1e-9);
  assert.equal(result.velocityMs, result.velocityKmh! / 3.6);
});
test('coverage gaps return review required, without nearest-line approximation', () => {
  const result = lookupWind({ ...input, latitude: 9, longitude: 9 }, fixture());
  assert.equal(result.status, 'review_required'); assert.equal(result.velocityKmh, null);
});
test('outside coverage and polygon holes exclude locations', () => {
  const data = fixture();
  assert.equal(lookupWind({ ...input, longitude: 11 }, data).status, 'outside_coverage');
  data.coverage = { type: 'Polygon', coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]], [[1, 1], [1, 3], [3, 3], [3, 1], [1, 1]]] };
  assert.equal(lookupWind(input, data).status, 'outside_coverage');
});
test('MultiPolygon coverage and MultiLineString contours are supported', () => {
  const data = fixture();
  data.coverage = { type: 'MultiPolygon', coordinates: [[[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]] };
  data.contours.features[0].geometry = { type: 'MultiLineString', coordinates: [[[0, 0], [0, 10]]] };
  assert.equal(lookupWind({ ...input, longitude: 0 }, data).velocityKmh, 200);
});
test('conflicting contours and overlapping cells return review required', () => {
  const data = fixture();
  data.contours.features.push({ ...data.contours.features[0], id: 'SYNTHETIC-CONFLICT', properties: { velocity_kmh: 300, verification_status: 'approved' } });
  assert.equal(lookupWind({ ...input, longitude: 0 }, data).status, 'review_required');
  data.zones.features.push({ ...data.zones.features[0], id: 'SYNTHETIC-CELL-CONFLICT', properties: { ...data.zones.features[0].properties, vertex_speeds_kmh: [300, 300, 300] } });
  assert.equal(lookupWind(input, data).status, 'review_required');
});
test('degenerate triangles, duplicate IDs and nonfinite speeds are rejected', () => {
  const data = fixture(); data.zones.features[0].geometry.coordinates = [[[0, 0], [1, 1], [2, 2], [0, 0]]];
  assert.throws(() => parseDataset(data));
  const duplicate = fixture(); duplicate.contours.features.push(duplicate.contours.features[0]); assert.throws(() => parseDataset(duplicate));
  const invalidSpeed = fixture(); invalidSpeed.contours.features[0].properties.velocity_kmh = Infinity; assert.throws(() => parseDataset(invalidSpeed));
});
test('interpolation refuses extrapolation', () => assert.throws(() => triangleVelocity([12, 12], [[0, 0], [10, 0], [0, 10]], [200, 300, 200])));
test('contour-only releases can be viewed without enabling point velocities', () => {
  const data = parseDataset({ ...fixture(), coverage: null, zones: undefined });
  assert.equal(data.contours.features.length, 1); assert.equal(data.zones.features.length, 0);
  const result = lookupWind(input, data);
  assert.equal(result.status, 'review_required'); assert.equal(result.velocityKmh, null);
});
test('catalog refuses ambiguous releases and directory traversal', () => {
  const entry = { group: 'II', version: 'test', url: '/wind-data/test.json', sha256: 'a'.repeat(64) };
  assert.throws(() => catalogSchema.parse({ schemaVersion: 1, datasets: [entry, entry] }));
  assert.throws(() => catalogSchema.parse({ schemaVersion: 1, datasets: [{ ...entry, url: '/wind-data/../private/data.json' }] }));
});
