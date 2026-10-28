import {useState} from 'react';
import Seo from '../../components/seo/Seo.jsx';
import {calculate,defaults,f,references,limitations} from './calculations.js';
import {downloadDeckReport} from './report.js';
import './deck.css';
import {manufacturers,selectedProduct} from './catalog.js';
import SlabCrossSection from './SlabCrossSection.jsx';
const groups=[
  ['Project record',[['project','Project name','text'],['location','Project location','text'],['engineer','Prepared by','text']]],
  ['Geometry & gravity loads',[['span','Completed slab analysis span','m'],['constructionSpan','Deck construction analysis span','m'],['finish','Superimposed dead load (incl. partitions)','kPa'],['live','Occupancy live load','kPa'],['constructionLoad','Uniform construction live load','kPa']]],
  ['Materials & serviceability',[['wetDensity','Wet concrete unit weight','kN/m3'],['dryDensity','Dry concrete unit weight','kN/m3'],['steelE','Steel elastic modulus Es','N/mm2'],['concreteE','Concrete elastic modulus Ec','N/mm2'],['constructionLimit','Construction dead-load limit Lc /','ratio'],['liveLimit','Composite live-load limit L /','ratio'],['totalLimit','Composite total elastic limit L /','ratio']]],
  ['Additional supplier resistances',[['constructionMoment','Factored construction moment resistance','kN.m/m'],['constructionShear','Factored construction shear resistance','kN/m'],['bearing','Factored construction bearing resistance','kN/m'],['capacityReference','Supplier document / page / design basis','text']]],
];
export default function SteelDeckPage(){
 const [input,setInput]=useState({...defaults}); const [exportError,setExportError]=useState('');
 const product=selectedProduct(input);
 const manufacturer=manufacturers.find(m=>m.id===input.manufacturer);
 const result=calculate(input); const valid=result.errors.length===0;
 const change=(key,value)=>setInput(previous=>({...previous,[key]:value}));
 const changeSection=(key,value)=>setInput(previous=>({...previous,[key]:value,inertiaBasis:'unconfirmed',constructionMoment:'',constructionShear:'',bearing:'',capacityReference:''}));
 const exportReport=()=>{try{downloadDeckReport(input);setExportError('');}catch(e){setExportError(e.message);}};
 return <>
 <Seo title="Steel Deck Design & PDF Calculations | Ingeniare" description="Review steel deck gravity calculations, formulas and supplier comparisons, and export an auditable preliminary PDF report." path="/resources/steel-deck-design" />
 <main className="deck-page">
 <header className="deck-hero"><div className="container"><p className="deck-eyebrow">INGENIARE / ENGINEERING TOOLS</p><h1>Steel deck design</h1><p>Trace every load. Review every formula.<br/>Keep a calculation report you can check.</p><div className="deck-tags"><span>Philippine design context</span><span>SI units</span><span>Auditable PDF</span></div></div></header>
 <div className="container deck-workspace">
 <section className="deck-scope"><strong>Preliminary gravity design worksheet</strong><p>Simply supported, one-way Architecks DECK FOUR slab on a 1 m strip. This tool compares calculated demands with catalog values and entered resistances. Full code compliance requires the outstanding checks below.</p></section>
 <div className="deck-grid"><aside className="deck-inputs"><div className="deck-panel-heading"><h2>01 / Design inputs</h2><button className="deck-link" onClick={()=>setInput({...defaults})}>Reset example</button></div>
 <section className="deck-section"><h3>Select manufacturer &amp; product</h3><div className="deck-fields">
 <label className="deck-wide">Steel deck manufacturer<select value={input.manufacturer} onChange={e=>setInput(previous=>({...previous,manufacturer:e.target.value,profile:'',inertiaBasis:'unconfirmed',constructionMoment:'',constructionShear:'',bearing:'',capacityReference:''}))}><option value="">Select manufacturer</option>{manufacturers.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
 <label className="deck-wide">Steel deck profile<select disabled={!manufacturer} value={input.profile} onChange={e=>setInput(previous=>({...previous,profile:e.target.value,inertiaBasis:'unconfirmed',constructionMoment:'',constructionShear:'',bearing:'',capacityReference:''}))}><option value="">Select profile</option>{manufacturer?.profiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
 <p className="deck-wide">Catalog properties load automatically from your selection. Currently supported: Architecks DN Steel Deck Four. More brands require their own verified catalog data.</p>
 <label>Deck thickness (mm)<select disabled={!product} value={input.thickness} onChange={e=>changeSection('thickness',e.target.value)}>{['0.80','1.00','1.20'].map(t=><option key={t}>{t}</option>)}</select></label>
 <label>Overall slab depth (mm)<select disabled={!product} value={input.depth} onChange={e=>changeSection('depth',e.target.value)}>{['100','125','150','180'].map(d=><option key={d}>{d}</option>)}</select></label></div><label className="deck-inertia-label">Composite Iave transformation basis<select value={input.inertiaBasis} onChange={e=>change("inertiaBasis",e.target.value)}><option value="unconfirmed">Unconfirmed - deflection not checked</option><option value="steel">Supplier confirms steel basis (Es)</option><option value="concrete">Supplier confirms concrete basis (Ec)</option></select></label><p>The catalog does not state the transformation basis of Iave. Confirm it with the supplier before selecting Es or Ec. Slab depth includes the deck profile. Example loads and moduli are editable assumptions, not an occupancy or material recommendation.</p></section>
 {groups.map(([title,fields])=><fieldset className="deck-section" key={title}><legend>{title}</legend><div className="deck-fields">{fields.map(([key,label,unit])=><label key={key} className={unit==='text'?'deck-wide':''}>{label}{unit!=='text'&&` (${unit})`}<input type={unit==='text'?'text':'number'} step="any" value={input[key]} min={unit==='text'?undefined:0} onChange={e=>change(key,e.target.value)} placeholder={['constructionMoment','constructionShear','bearing'].includes(key)?'Not provided':undefined}/></label>)}</div>{title==='Additional supplier resistances'&&<p>Leave unavailable resistances blank. Use factored design resistances for this exact section and support detail; do not enter nominal or ASD allowable values.</p>}</fieldset>)}
 </aside><section className="deck-results" aria-label="Calculation results"><div className="deck-panel-heading"><h2>02 / Calculation review</h2><button className="deck-export" disabled={!valid} onClick={exportReport}>Export PDF report ↓</button></div>
 {exportError&&<p role="alert">{exportError}</p>}
 {!product?<div className="deck-selection-prompt"><h3>Choose your manufacturer and deck profile</h3><p>The catalog properties and calculation summary will load automatically. Then enter the project spans and loads.</p><SlabCrossSection input={input}/></div>:!valid?<div className="deck-alert" role="alert"><strong>Correct the inputs to calculate</strong><ul>{result.errors.map(e=><li key={e}>{e}</li>)}</ul></div>:<>
 <div className="deck-summary" aria-live="polite"><span>DESIGN STATUS</span><h3>{result.status}</h3><p>{result.checks.filter(c=>c.status==='Fail').length} failed comparisons · {result.checks.filter(c=>c.status==='NOT CHECKED').length} unevaluated comparisons</p><small>Catalog basis and outstanding checks require review even when all evaluated comparisons are within limits.</small></div>
 <SlabCrossSection input={input} />
 <h3 className="deck-subtitle">Automatically loaded catalog properties</h3><p>{result.product.manufacturer} / {result.product.profile} · {result.product.source}. These values are read-only.</p><div className="deck-property-strip"><span>Deck mass <b>{f(result.properties.mass)} kg/m²</b></span><span>Catalog flexure <b>{f(result.properties.moment)} kN.m/m</b></span><span>Catalog shear <b>{f(result.properties.shear)} kN/m</b></span><span>Concrete volume <b>{result.properties.volume} m³/m²</b></span><span>Steel inertia <b>{f(result.properties.steelI)} mm⁴/m</b></span><span>Composite Iave <b>{f(result.properties.compositeI)} mm⁴/m</b></span></div>
 <h3 className="deck-subtitle">Demand / resistance comparisons</h3><p>Passed means only that the shown demand does not exceed the entered or catalog limit. It does not verify the capacity basis.</p>
 <div className="deck-table-wrap"><table><thead><tr><th>Check</th><th>Demand</th><th>Limit</th><th>Ratio</th><th>Comparison</th></tr></thead><tbody>{result.checks.map(c=><tr key={c.name}><th scope="row">{c.name}<small>{c.source} · {c.unit}</small></th><td>{c.demand===null?"Not checked":f(c.demand)}</td><td>{c.capacity?f(c.capacity):'—'}</td><td>{c.ratio===null?'—':f(c.ratio)}</td><td><span className={`deck-badge ${c.status==='Fail'?'deck-fail':c.status==='Passed'?'deck-within':''}`}>{c.status}</span></td></tr>)}</tbody></table></div>
 <h3 className="deck-subtitle">Manual calculation trail</h3><p>The PDF contains this same calculation trail, complete input record, source references and unresolved checks. Comparisons use unrounded values.</p>
 <div className="deck-calculations">{result.steps.map((s,i)=><details key={s.title} open={i<6}><summary><span>{String(i+1).padStart(2,'0')} / {s.title}</span><b>{f(s.result)} {s.unit}</b></summary><div><code>{s.formula}</code><p>Substitute: {s.substitution}</p><strong>= {f(s.result)} {s.unit}</strong><p className="deck-basis">{s.basis}</p></div></details>)}</div>
 </>}
 </section></div>
 <section className="deck-notes"><h2>03 / Design basis & outstanding checks</h2>{limitations.map((t,i)=><p key={t}><strong>{String(i+1).padStart(2,'0')}.</strong> {t}</p>)}<h3>References</h3>{references.map(t=><p key={t}>{t}</p>)}<a href="https://sdi.org/codes-standards/sdi-standards/" target="_blank" rel="noreferrer">View the SDI standards register ↗</a></section>
 </div></main></>;
}




