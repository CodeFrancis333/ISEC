import { useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { WindDataset } from './dataset';
import { categoryMetadata, type Category } from '../../../../wind-map/shared/contracts';
import { buildContourDisplay } from './contourStyle';
maplibregl.setWorkerUrl(workerUrl);

interface Props {
  point: [number, number] | null;
  onSelect: (latitude: number, longitude: number) => void;
  dataset: WindDataset | null;
  category: Category;
  loading: boolean;
}
const styleUrl = import.meta.env.VITE_WIND_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty';
export default function WindMapCanvas({ point, onSelect, dataset, category, loading }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const select = useRef(onSelect);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [showContours, setShowContours] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [opacity, setOpacity] = useState(0.35);
  const [hiddenValues, setHiddenValues] = useState<number[]>([]);
  const display = useMemo(() => buildContourDisplay(dataset, category), [dataset, category]);
  const legend = display?.legend || [];
  const popup = useRef<maplibregl.Popup | null>(null);

  useEffect(() => { setHiddenValues([]); setShowContours(true); popup.current?.remove(); }, [dataset]);

  useEffect(() => { select.current = onSelect; }, [onSelect]);
  useEffect(() => {
    if (!container.current) return;
    try {
      const instance = new maplibregl.Map({
        container: container.current, style: styleUrl,
        center: [122.3, 12.4], zoom: 4.7, minZoom: 3, maxZoom: 17,
        maxBounds: [[112, 0], [135, 25]], attributionControl: {},
      });
      map.current = instance;
      instance.addControl(new maplibregl.NavigationControl(), 'top-right');
      instance.addControl(new maplibregl.FullscreenControl(), 'top-right');
      instance.on('click', e => select.current(e.lngLat.lat, e.lngLat.lng));
      instance.on('load', () => { setReady(true); setError(''); });
      instance.on('error', () => setError('A map layer could not load. You can still enter coordinates.'));
      const observer = new ResizeObserver(() => instance.resize());
      observer.observe(container.current);
      return () => { observer.disconnect(); popup.current?.remove(); marker.current?.remove(); marker.current = null; instance.remove(); map.current = null; };
    } catch { setError('Interactive maps need WebGL. Coordinate entry remains available.'); }
  }, []);

  useEffect(() => {
    if (!ready || !map.current || !point) return;
    if (!marker.current) {
      marker.current = new maplibregl.Marker({ color: '#590808', draggable: true }).setLngLat(point).addTo(map.current);
      marker.current.on('dragend', () => {
        const location = marker.current!.getLngLat();
        select.current(location.lat, location.lng);
      });
      marker.current.getElement().setAttribute('aria-label', 'Selected project location. Drag to move; use coordinate fields for keyboard positioning.');
    } else marker.current.setLngLat(point);
    map.current.easeTo({ center: point, duration: 0 });
  }, [point, ready]);

  useEffect(() => {
    if (!ready || !map.current) return;
    const instance = map.current;
    popup.current?.remove();
    for (const id of ['wind-contour-labels', 'wind-contours', 'wind-zones']) {
      if (instance.getLayer(id)) instance.removeLayer(id);
    }
    for (const id of ['wind-contours', 'wind-zones']) if (instance.getSource(id)) instance.removeSource(id);
    if (!dataset || !display) return;
    instance.addSource('wind-zones', { type: 'geojson', data: dataset.zones });
    instance.addLayer({ id: 'wind-zones', type: 'fill', source: 'wind-zones', paint: { 'fill-color': '#668cb4', 'fill-opacity': 0.35 } });
    instance.addSource('wind-contours', { type: 'geojson', data: display.data });
    instance.addLayer({ id: 'wind-contours', type: 'line', source: 'wind-contours', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['get', 'display_color'], 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 2.5, 10, 4] } });
    instance.addLayer({ id: 'wind-contour-labels', type: 'symbol', source: 'wind-contours', minzoom: 5, layout: {
      'symbol-placement': 'line', 'symbol-spacing': 220, 'text-field': ['get', 'display_label'], 'text-size': 12,
      'text-font': ['Noto Sans Regular'], 'text-keep-upright': true,
    }, paint: { 'text-color': '#193249', 'text-halo-color': '#ffffff', 'text-halo-width': 2 } });
    const showValue = (event: maplibregl.MapLayerMouseEvent) => {
      const speed = Number(event.features?.[0]?.properties.velocity_kmh);
      if (!Number.isFinite(speed)) return;
      popup.current?.remove();
      popup.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false })
        .setLngLat(event.lngLat).setText(`${speed} km/h contour · Category ${category} · Figure ${dataset.sourceFigure}`).addTo(instance);
      instance.getCanvas().style.cursor = 'pointer';
    };
    const hideValue = () => { popup.current?.remove(); instance.getCanvas().style.cursor = ''; };
    instance.on('mousemove', 'wind-contours', showValue);
    instance.on('mouseleave', 'wind-contours', hideValue);
    return () => { instance.off('mousemove', 'wind-contours', showValue); instance.off('mouseleave', 'wind-contours', hideValue); hideValue(); };
  }, [dataset, display, category, ready]);

  useEffect(() => {
    const instance = map.current;
    for (const id of ['wind-contours', 'wind-contour-labels']) if (instance?.getLayer(id)) {
      instance.setLayoutProperty(id, 'visibility', showContours ? 'visible' : 'none');
      instance.setFilter(id, ['!', ['in', ['get', 'velocity_kmh'], ['literal', hiddenValues]]]);
    }
    if (instance?.getLayer('wind-zones')) {
      instance.setLayoutProperty('wind-zones', 'visibility', showZones ? 'visible' : 'none');
      instance.setPaintProperty('wind-zones', 'fill-opacity', opacity);
    }
  }, [showContours, showZones, opacity, hiddenValues, dataset, display, ready]);

  return <div className="wind-map-wrap">
    <div ref={container} className="wind-map" aria-label="Interactive location map of the Philippines" />
    <div className="wind-map-tools">
      <button type="button" onClick={() => map.current?.fitBounds([[116.8, 4.4], [127, 21.4]], { padding: 35, duration: 0 })}>Fit Philippines</button>
      <details><summary>Layers</summary>
        <label><input type="checkbox" checked={showContours} onChange={e => setShowContours(e.target.checked)} disabled={!display} /> Contour lines and labels</label>
        <label><input type="checkbox" checked={showZones} onChange={e => setShowZones(e.target.checked)} disabled={!dataset?.zones.features.length} /> Reviewed interpolation cells</label>
        <label>Cell opacity <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => setOpacity(Number(e.target.value))} disabled={!dataset?.zones.features.length} /></label>
      </details>
    </div>
    {error && <p className="wind-map-error" role="alert">{error}</p>}
    <div className="wind-legend" aria-label={`Wind contour legend for category ${category}`}>
      <strong>Category {category} · Figure {categoryMetadata[category].figure}</strong>
      {legend.length ? <>
        <span className="wind-legend-caption">Basic wind-speed contours (km/h), low to high. Select a value to hide or show its lines.</span>
        {!showContours && <span className="wind-legend-caption">Contour layer is hidden. Enable it in Layers.</span>}
        <div className="wind-legend-values">{legend.map(({ value, color }) => <button type="button" key={value} aria-label={`${value} km/h contour lines`} aria-pressed={!hiddenValues.includes(value)} disabled={!showContours} onClick={() => setHiddenValues(previous => previous.includes(value) ? previous.filter(v => v !== value) : [...previous, value])}><span style={{ background: color }} />{value}</button>)}</div>
        <span className="wind-legend-caption">Line values are isolines, not uniform zone speeds. Colors are a visual key.</span>
      </> : <span>{loading ? 'Loading category contours…' : 'GIS contours are not published for this category yet. The basemap shows geography only.'}</span>}
    </div>
  </div>;
}
