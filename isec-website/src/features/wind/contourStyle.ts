import type { Category } from '../../../../wind-map/shared/contracts';
import { categoryMetadata } from '../../../../wind-map/shared/contracts';
import type { WindDataset } from './dataset';

// Display colors only: these stops do not define NSCP zones or allowable speeds.
// Numeric values keep the same color when switching between category datasets.
const stops: [number, string][] = [
  [180, '#b38216'], [220, '#719d2f'], [260, '#138d99'],
  [300, '#365fbd'], [340, '#863eac'], [380, '#bf326f'], [420, '#ca482b'],
];
export function contourColor(speed: number): string {
  if (!Number.isFinite(speed) || speed <= 0) throw new Error('A contour needs a finite positive wind speed.');
  const upper = stops.findIndex(([value]) => speed <= value);
  if (upper === 0) return stops[0][1];
  if (upper === -1) return stops.at(-1)![1];
  const [lowerValue, lowerColor] = stops[upper - 1];
  const [upperValue, upperColor] = stops[upper];
  const fraction = (speed - lowerValue) / (upperValue - lowerValue);
  const channels = [1, 3, 5].map(offset => {
    const lower = parseInt(lowerColor.slice(offset, offset + 2), 16);
    const upperChannel = parseInt(upperColor.slice(offset, offset + 2), 16);
    return Math.round(lower + (upperChannel - lower) * fraction).toString(16).padStart(2, '0');
  });
  return `#${channels.join('')}`;
}

export function buildContourDisplay(dataset: WindDataset | null, category: Category) {
  const metadata = categoryMetadata[category];
  if (!dataset || dataset.categoryGroup !== metadata.group || dataset.sourceFigure !== metadata.figure || dataset.status !== 'approved') return null;
  const values = [...new Set(dataset.contours.features.map(feature => feature.properties.velocity_kmh))].sort((a, b) => a - b);
  return {
    legend: values.map(value => ({ value, color: contourColor(value) })),
    data: { ...dataset.contours, features: dataset.contours.features.map(feature => ({
      ...feature, properties: {
        ...feature.properties, display_color: contourColor(feature.properties.velocity_kmh),
        display_label: `${feature.properties.velocity_kmh} km/h`,
      },
    })) },
  };
}
