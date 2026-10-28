import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaWind, FaArrowLeft, FaInfoCircle, FaDownload, FaSearch } from 'react-icons/fa';
import Seo from '../../components/seo/Seo.jsx';
import { categoryMetadata, type Category, type LookupResult } from '../../../../wind-map/shared/contracts';
import { catalogSchema, loadRelease, lookupWind, type Catalog, type WindDataset } from './dataset';
import { places } from './places';
import WindMapCanvas from './WindMapCanvas';
import './wind.css';

export default function WindMapPage() {
  const [category, setCategory] = useState<Category>('II');
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [dataset, setDataset] = useState<WindDataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retry, setRetry] = useState(0);
  const [point, setPoint] = useState<[number, number] | null>(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [coordinatesDirty, setCoordinatesDirty] = useState(false);
  const [query, setQuery] = useState('');
  const [locationName, setLocationName] = useState('Selected map location');
  const [inputError, setInputError] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [exporting, setExporting] = useState(false);
  const releaseCache = useRef(new Map<string, WindDataset>());
  const meta = categoryMetadata[category];

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setLoadError(''); setCatalog(null); setDataset(null); setResult(null);
    fetch('/wind-data/catalog.json', { signal: abort.signal, cache: 'no-cache' })
      .then(response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(value => setCatalog(catalogSchema.parse(value)))
      .catch(() => { if (!abort.signal.aborted) { setLoadError('Dataset status could not be loaded. No wind speed has been determined.'); setLoading(false); } });
    return () => abort.abort();
  }, [retry]);

  useEffect(() => {
    if (!catalog) return;
    const abort = new AbortController();
    setDataset(null); setResult(null); setLoadError('');
    const entry = catalog.datasets.find(item => item.group === meta.group);
    if (!entry) { setLoading(false); return; }
    setLoading(true);
    const key = `${entry.url}:${entry.sha256}`;
    const cached = releaseCache.current.get(key);
    const load = cached ? Promise.resolve(cached) : loadRelease(entry, abort.signal);
    load.then(value => {
      if (!abort.signal.aborted) { releaseCache.current.set(key, value); setDataset(value); setLoading(false); }
    }).catch(error => {
      if (!abort.signal.aborted) { setLoadError(error instanceof Error ? error.message : 'Dataset could not be loaded.'); setLoading(false); }
    });
    return () => abort.abort();
  }, [catalog, meta.group, category]);

  const selectLocation = useCallback((lat: number, lng: number, name = 'Selected map location') => {
    setPoint([lng, lat]); setLatitude(lat.toFixed(6)); setLongitude(lng.toFixed(6));
    setCoordinatesDirty(false);
    setLocationName(name); setInputError(''); setResult(null);
  }, []);

  useEffect(() => {
    if (!point || loading || loadError || coordinatesDirty) { setResult(null); return; }
    try { setResult(lookupWind({ latitude: point[1], longitude: point[0], occupancyCategory: category }, dataset)); }
    catch (error) { setResult(null); setInputError(error instanceof Error ? error.message : 'Lookup requires review.'); }
  }, [point, category, dataset, loading, loadError, coordinatesDirty]);

  const submitCoordinates = (event: FormEvent) => {
    event.preventDefault();
    const lat = Number(latitude.trim()), lng = Number(longitude.trim());
    if (!latitude.trim() || !longitude.trim() || !Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setInputError('Enter a latitude from -90 to 90 and longitude from -180 to 180.'); return;
    }
    if (lat < 4 || lat > 22 || lng < 116 || lng > 128) {
      setInputError('These coordinates are outside this tool’s Philippine map extent (4–22° N, 116–128° E).'); return;
    }
    selectLocation(lat, lng, 'Entered coordinates');
  };
  const suggestions = query.trim().length >= 2 ? places.filter(place => place.name.toLowerCase().includes(query.toLowerCase().trim())).slice(0, 6) : [];
  const exportReport = async () => {
    if (!result || result.status !== 'verified' || !dataset) return;
    setExporting(true);
    try {
      const { downloadWindReport } = await import('./report');
      downloadWindReport(result, locationName, dataset);
    } catch { setInputError('The report could not be generated. Please try again.'); }
    finally { setExporting(false); }
  };

  return <>
    <Seo title="Philippine Wind Speed Map | NSCP 2015 | Ingeniare" description="Select a Philippine location and NSCP 2015 occupancy category. Wind velocities are provided only where reviewed engineering datasets are available." path="/resources/nscp-2015-wind-map" schema={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Ingeniare Philippine Wind Speed Map', applicationCategory: 'EngineeringApplication', operatingSystem: 'Web' }} />
    <div className="wind-app">
      <header className="wind-header">
        <div><Link to="/resources" className="wind-back"><FaArrowLeft aria-hidden="true" /> All resources</Link>
          <h1><FaWind aria-hidden="true" /> Philippine Wind Speed Map</h1>
          <p>NSCP 2015 · Basic wind velocity · INGENIARE</p>
        </div>
        <a href="#wind-methodology" className="wind-help"><FaInfoCircle aria-hidden="true" /> Methodology & data status</a>
      </header>
      {!dataset && <div className="wind-notice" role="status"><FaInfoCircle aria-hidden="true" /><span><strong>Engineering dataset validation pending.</strong> Explore locations now. Design wind velocities will be available after contours are digitized and independently reviewed.</span></div>}
      <div className="wind-workspace">
        <aside className="wind-sidebar" aria-label="Location and wind parameters">
          <section className="wind-input-panel">
            <h2><FaMapMarkerAlt aria-hidden="true" /> Project location</h2>
            <label htmlFor="wind-place">Find a city</label>
            <div className="wind-search"><FaSearch aria-hidden="true" /><input id="wind-place" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. Cebu or Muntinlupa" aria-describedby="wind-search-hint" /></div>
            <p id="wind-search-hint" className="wind-hint">City-centre shortcuts. Refine your actual site by clicking the map, dragging the pin, or entering coordinates.</p>
            {suggestions.length > 0 && <ul className="wind-suggestions">{suggestions.map(place => <li key={place.name}><button type="button" onClick={() => { selectLocation(place.latitude, place.longitude, place.name); setQuery(''); }}>{place.name}</button></li>)}</ul>}
            {query.trim().length >= 2 && !suggestions.length && <p className="wind-hint">No matching shortcut. Select your site on the map or enter its coordinates.</p>}
            <form onSubmit={submitCoordinates}>
              <div className="wind-coordinate-grid">
                <div><label htmlFor="wind-lat">Latitude (° N)</label><input id="wind-lat" type="number" step="any" min="-90" max="90" value={latitude} onChange={e => { setLatitude(e.target.value); setCoordinatesDirty(true); setResult(null); }} placeholder="14.599500" required /></div>
                <div><label htmlFor="wind-lng">Longitude (° E)</label><input id="wind-lng" type="number" step="any" min="-180" max="180" value={longitude} onChange={e => { setLongitude(e.target.value); setCoordinatesDirty(true); setResult(null); }} placeholder="120.984200" required /></div>
              </div>
              <label htmlFor="wind-category">Occupancy category</label>
              <select id="wind-category" value={category} onChange={e => { setLoading(true); setCategory(e.target.value as Category); setResult(null); }}>
                {(['I', 'II', 'III', 'IV', 'V'] as Category[]).map(value => <option key={value} value={value}>Category {value}</option>)}
              </select>
              <p className="wind-hint">Select the category specified for your project under NSCP 2015.</p>
              <button type="submit" className="wind-primary">Use coordinates</button>
            </form>
            {inputError && <p role="alert" className="wind-error">{inputError}</p>}
          </section>
          <section className="wind-result-panel" aria-live="polite" aria-atomic="true">
            <p className="wind-eyebrow">BASIC WIND VELOCITY</p>
            {loading ? <p className="wind-loading">Checking published datasets…</p> : loadError ? <><h2>Data unavailable</h2><p>{loadError}</p><button type="button" onClick={() => setRetry(v => v + 1)}>Retry loading data</button></> : result?.status === 'verified' ? <><h2 className="wind-speed">{result.velocityKmh!.toFixed(1)} <span>km/h</span></h2><p>{result.velocityMs!.toFixed(2)} m/s · Reviewed dataset</p><p>{result.methodology}</p></> : <><h2>{point ? 'Wind speed unavailable' : 'Select a project location'}</h2><p>{result?.warnings[0] || 'Search a city, enter coordinates, or click anywhere on the Philippine map.'}</p></>}
            {point && <p className="wind-selected-location"><strong>{locationName}</strong><br />{point[1].toFixed(6)}° N, {point[0].toFixed(6)}° E</p>}
            <dl className="wind-metadata"><div><dt>Standard</dt><dd>NSCP 2015</dd></div><div><dt>Category</dt><dd>{category}</dd></div><div><dt>Source figure</dt><dd>{meta.figure}</dd></div><div><dt>Approximate MRI</dt><dd>{meta.mri.toLocaleString()} years</dd></div><div><dt>Dataset</dt><dd>{dataset?.version || 'Not yet published'}</dd></div></dl>
            <button type="button" className="wind-export" disabled={result?.status !== 'verified' || exporting} onClick={() => void exportReport()}><FaDownload aria-hidden="true" />{exporting ? 'Preparing report…' : 'Download wind report'}</button>
            {result?.status !== 'verified' && <p className="wind-hint">Reports become available when a reviewed velocity can be determined.</p>}
          </section>
        </aside>
        <WindMapCanvas point={point} onSelect={selectLocation} dataset={dataset} category={category} loading={loading} />
      </div>
      <section id="wind-methodology" className="wind-methodology">
        <h2>Methodology & data status</h2>
        <div className="wind-method-grid"><div><h3>Three independent maps</h3><p>Category I: Figure 207A.5-1C (page 2-40). Category II: Figure 207A.5-1B (page 2-39). Categories III, IV and V: Figure 207A.5-1A (page 2-38). Assignments follow the supplied figure captions.</p></div>
          <div><h3>Reviewed contours only</h3><p>No wind speeds are inferred from longitude, basemap colors, city names, or nearby contours. {dataset ? `Current dataset: ${dataset.version}, reviewed by ${dataset.review.reviewer}.` : 'The scanned maps are not yet georeferenced. No approved geographic wind dataset is currently published.'}</p></div>
          <div><h3>Engineering interpretation</h3><p>The supplied notes describe 3-second gust speeds at 10 m above ground for Exposure C and permit linear interpolation between contours. Any digital interpolation model requires independent engineering validation. Special terrain and wind regions require additional assessment.</p></div></div>
        <p className="wind-hint">Basemap: <a href="https://openfreemap.org/" target="_blank" rel="noreferrer">OpenFreeMap</a>, OpenMapTiles and OpenStreetMap contributors. Geographic labels are separate from the NSCP wind dataset. Search shortcuts and wind calculations run in your browser; the basemap provider receives normal tile requests. Source scans are not publicly redistributed.</p>
      </section>
    </div>
  </>;
}
