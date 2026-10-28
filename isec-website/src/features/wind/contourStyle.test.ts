import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildContourDisplay, contourColor } from './contourStyle';
import type { WindDataset } from './dataset';

// Styling fixtures only; no geographic or engineering validation is implied.
function contours(group: WindDataset['categoryGroup'], speeds: number[]): WindDataset {
  return {
    categoryGroup: group, sourceFigure: { I: '207A.5-1C', II: '207A.5-1B', III_IV_V: '207A.5-1A' }[group], status: 'approved',
    contours: { type: 'FeatureCollection', features: speeds.map((speed, index) => ({
      type: 'Feature', id: `SYNTHETIC-STYLING-${index}`, geometry: { type: 'LineString', coordinates: [[0, 0], [0, 1]] },
      properties: { velocity_kmh: speed, verification_status: 'approved' },
    })) },
  } as WindDataset;
}
test('legend derives sorted unique values from the selected dataset', () => {
  assert.deepEqual(buildContourDisplay(contours('I', [300, 240, 300, 260]), 'I')!.legend.map(item => item.value), [240, 260, 300]);
});
test('eleven source-range speeds have distinct colors, without seven-color cycling', () => {
  const colors = Array.from({ length: 11 }, (_, index) => contourColor(240 + index * 10));
  assert.equal(new Set(colors).size, colors.length);
});
test('same wind speed keeps its color across occupancy categories', () => {
  const first = buildContourDisplay(contours('I', [240, 250, 260, 300]), 'I')!;
  const second = buildContourDisplay(contours('II', [250, 300, 320]), 'II')!;
  assert.equal(first.legend.find(item => item.value === 300)!.color, second.legend.find(item => item.value === 300)!.color);
});
test('line colors and labels exactly match the legend', () => {
  const display = buildContourDisplay(contours('II', [240, 260, 280]), 'II')!;
  for (const feature of display.data.features) {
    assert.equal(feature.properties.display_color, display.legend.find(item => item.value === feature.properties.velocity_kmh)!.color);
    assert.equal(feature.properties.display_label, `${feature.properties.velocity_kmh} km/h`);
  }
});
test('switching categories cannot display another group’s contours', () => {
  assert.equal(buildContourDisplay(contours('I', [240]), 'II'), null);
  assert.equal(buildContourDisplay(contours('II', [240]), 'III'), null);
  for (const category of ['III', 'IV', 'V'] as const) assert.ok(buildContourDisplay(contours('III_IV_V', [240]), category));
});
test('missing, draft or mislabeled datasets have no displayed legend', () => {
  assert.equal(buildContourDisplay(null, 'II'), null);
  assert.equal(buildContourDisplay({ ...contours('II', [240]), status: 'draft' } as unknown as WindDataset, 'II'), null);
  assert.equal(buildContourDisplay({ ...contours('II', [240]), sourceFigure: '207A.5-1C' }, 'II'), null);
});
test('styling never modifies source engineering attributes', () => {
  const data = contours('II', [240]); const original = structuredClone(data);
  buildContourDisplay(data, 'II'); assert.deepEqual(data, original);
});
test('invalid wind values are refused by the color key', () => {
  for (const value of [NaN, Infinity, -1, 0]) assert.throws(() => contourColor(value));
});
