import { z } from 'zod';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import booleanPointOnLine from '@turf/boolean-point-on-line';
import booleanValid from '@turf/boolean-valid';
import { point } from '@turf/helpers';
import type { LineString, Polygon, MultiPolygon, Position } from 'geojson';
import { categoryMetadata, kmhToMs, type LookupInput, type LookupResult } from '../../../../wind-map/shared/contracts';

const coordinate = z.tuple([z.number().finite().min(-180).max(180), z.number().finite().min(-90).max(90)]);
const line = z.array(coordinate).min(2);
const ring = z.array(coordinate).min(4).refine(r => r[0][0] === r.at(-1)![0] && r[0][1] === r.at(-1)![1], 'Rings must be closed');
const lineGeometry = z.union([
  z.object({ type: z.literal('LineString'), coordinates: line }),
  z.object({ type: z.literal('MultiLineString'), coordinates: z.array(line).min(1) }),
]);
const areaGeometry = z.union([
  z.object({ type: z.literal('Polygon'), coordinates: z.array(ring).min(1) }),
  z.object({ type: z.literal('MultiPolygon'), coordinates: z.array(z.array(ring).min(1)).min(1) }),
]);
const speed = z.number().finite().positive().max(1000);
const contourSchema = z.object({
  type: z.literal('Feature'), id: z.string().min(1), geometry: lineGeometry,
  properties: z.object({ velocity_kmh: speed, verification_status: z.literal('approved') }),
});
// Triangles are optional reviewed interpolation cells, not uniform-value zones.
const triangleSchema = z.object({
  type: z.literal('Feature'), id: z.string().min(1),
  geometry: z.object({ type: z.literal('Polygon'), coordinates: z.tuple([z.tuple([coordinate, coordinate, coordinate, coordinate])]) }),
  properties: z.object({
    method: z.literal('reviewed-linear-triangle'), vertex_speeds_kmh: z.tuple([speed, speed, speed]),
    verification_status: z.literal('approved'),
  }),
}).refine(f => {
  const [a, b, c, end] = f.geometry.coordinates[0];
  return a[0] === end[0] && a[1] === end[1] && Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) > 1e-12;
}, 'Interpolation cell must be a closed nondegenerate triangle');
export const datasetSchema = z.object({
  version: z.string().min(1), edition: z.literal('NSCP 2015'),
  categoryGroup: z.enum(['I', 'II', 'III_IV_V']), sourceFigure: z.enum(['207A.5-1C', '207A.5-1B', '207A.5-1A']),
  status: z.literal('approved'),
  review: z.object({
    reviewer: z.string().min(1), approvedAt: z.iso.datetime(), rightsConfirmed: z.literal(true),
    methodology: z.string().min(20), checkpointReport: z.string().min(1),
    positionalUncertaintyM: z.number().finite().nonnegative(),
  }),
  coverage: areaGeometry.nullable().default(null),
  contours: z.object({ type: z.literal('FeatureCollection'), features: z.array(contourSchema).min(1) }),
  zones: z.object({ type: z.literal('FeatureCollection'), features: z.array(triangleSchema) }).default({ type: 'FeatureCollection', features: [] }),
});
export type WindDataset = z.infer<typeof datasetSchema>;
export interface CatalogEntry { group: WindDataset['categoryGroup']; version: string; url: string; sha256: string }
export interface Catalog { schemaVersion: 1; datasets: CatalogEntry[] }
export const catalogSchema = z.object({
  schemaVersion: z.literal(1), datasets: z.array(z.object({
    group: z.enum(['I', 'II', 'III_IV_V']), version: z.string().min(1),
    url: z.string().regex(/^\/wind-data\/[a-zA-Z0-9._/-]+\.json$/).refine(url => !url.includes('..')),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  })),
}).refine(c => new Set(c.datasets.map(d => d.group)).size === c.datasets.length, 'Only one active release per category group');

export function parseDataset(value: unknown): WindDataset {
  const dataset = datasetSchema.parse(value);
  const figure = { I: '207A.5-1C', II: '207A.5-1B', III_IV_V: '207A.5-1A' }[dataset.categoryGroup];
  if (dataset.sourceFigure !== figure) throw new Error('Dataset category and source figure disagree.');
  const all = [...(dataset.coverage ? [dataset.coverage] : []), ...dataset.contours.features.map(f => f.geometry), ...dataset.zones.features.map(f => f.geometry)];
  if (all.some(geometry => !booleanValid(geometry))) throw new Error('Invalid GIS geometry.');
  const ids = [...dataset.contours.features, ...dataset.zones.features].map(f => f.id);
  if (new Set(ids).size !== ids.length) throw new Error('Feature identifiers must be unique.');
  return dataset;
}

export async function loadRelease(entry: CatalogEntry, signal?: AbortSignal): Promise<WindDataset> {
  const response = await fetch(entry.url, { signal, cache: 'no-cache' });
  if (!response.ok) throw new Error('The published contour file could not be loaded.');
  const bytes = await response.arrayBuffer();
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('');
  if (hash !== entry.sha256) throw new Error('Dataset integrity check failed. No wind speed has been determined.');
  const dataset = parseDataset(JSON.parse(new TextDecoder().decode(bytes)));
  if (dataset.version !== entry.version || dataset.categoryGroup !== entry.group) throw new Error('Published release metadata does not match.');
  return dataset;
}

export function triangleVelocity(position: Position, vertices: Position[], values: number[]): number {
  const [a, b, c] = vertices;
  const denominator = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
  if (Math.abs(denominator) < 1e-12) throw new Error('Degenerate interpolation cell.');
  const wa = ((b[1] - c[1]) * (position[0] - c[0]) + (c[0] - b[0]) * (position[1] - c[1])) / denominator;
  const wb = ((c[1] - a[1]) * (position[0] - c[0]) + (a[0] - c[0]) * (position[1] - c[1])) / denominator;
  const wc = 1 - wa - wb;
  if ([wa, wb, wc].some(w => w < -1e-9 || w > 1 + 1e-9)) throw new Error('Point lies outside interpolation cell.');
  return wa * values[0] + wb * values[1] + wc * values[2];
}

export function lookupWind(input: LookupInput, dataset: WindDataset | null): LookupResult {
  const { latitude, longitude, occupancyCategory } = input;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) throw new Error('Enter valid geographic coordinates.');
  if (!Object.hasOwn(categoryMetadata, occupancyCategory)) throw new Error('Invalid occupancy category.');
  const meta = categoryMetadata[occupancyCategory];
  const result: LookupResult = {
    latitude, longitude, occupancyCategory, standard: 'NSCP 2015', figure: meta.figure,
    status: 'no_approved_dataset', datasetVersion: null, velocityKmh: null, velocityMs: null,
    featureIds: [], methodology: 'No lookup performed.',
    warnings: ['Wind speed unavailable: engineering dataset validation pending.'], timestamp: new Date().toISOString(),
  };
  if (!dataset) return result;
  // Validate again at the calculation boundary; callers cannot bypass release checks.
  dataset = parseDataset(dataset);
  if (dataset.categoryGroup !== meta.group || (input.datasetVersion && input.datasetVersion !== dataset.version)) {
    return { ...result, status: 'dataset_unavailable', warnings: ['The dataset does not match the selected category or version.'] };
  }
  result.datasetVersion = dataset.version;
  if (!dataset.coverage) return { ...result, status: 'review_required', warnings: ['Reviewed contour lines are available for viewing. Point wind-speed lookup is pending coverage and interpolation validation.'] };
  const location = point([longitude, latitude]);
  if (!booleanPointInPolygon(location, dataset.coverage as Polygon | MultiPolygon)) return { ...result, status: 'outside_coverage', warnings: ['This point is outside the reviewed coverage. No extrapolation is permitted.'] };
  const onContours = dataset.contours.features.filter(f => f.geometry.type === 'LineString'
    ? booleanPointOnLine(location, f.geometry as LineString)
    : f.geometry.coordinates.some(coordinates => booleanPointOnLine(location, { type: 'LineString', coordinates })));
  let values: number[];
  if (onContours.length) {
    values = onContours.map(f => f.properties.velocity_kmh);
    result.featureIds = onContours.map(f => f.id);
    result.methodology = 'Point lies exactly on an approved digitized contour; no proximity snapping.';
  } else {
    const cells = dataset.zones.features.filter(f => booleanPointInPolygon(location, f.geometry));
    if (!cells.length) return { ...result, status: 'review_required', warnings: ['No reviewed interpolation cell covers this location. Contour proximity is not used to estimate a speed.'] };
    values = cells.map(f => triangleVelocity([longitude, latitude], f.geometry.coordinates[0], f.properties.vertex_speeds_kmh));
    result.featureIds = cells.map(f => f.id);
    result.methodology = `Reviewed linear interpolation within a geographic triangle. ${dataset.review.methodology}`;
  }
  if (Math.max(...values) - Math.min(...values) > 1e-7) return { ...result, status: 'review_required', warnings: ['Conflicting features meet at this point. Engineering review is required.'] };
  const velocityKmh = values[0];
  return { ...result, status: 'verified', velocityKmh, velocityMs: kmhToMs(velocityKmh), warnings: [`Digitization positional uncertainty: ${dataset.review.positionalUncertaintyM} m. Special wind regions and terrain require separate engineering assessment.`] };
}
