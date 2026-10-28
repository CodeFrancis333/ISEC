import {selectedProduct} from './catalog.js';
export const defaults = { manufacturer: '', profile: '', project: 'Proposed steel deck floor', location: '', engineer: '', span: 3, constructionSpan: 3, thickness: '1.00', inertiaBasis: 'unconfirmed', depth: '125', finish: 1, live: 2.76, constructionLoad: 1.5, wetDensity: 24, dryDensity: 23.55, steelE: 200000, concreteE: 23000, constructionLimit: 180, liveLimit: 360, totalLimit: 240, constructionMoment: '', constructionShear: '', bearing: '', capacityReference: '' };
// Transcribed from the supplied Architecks catalog, PDF page 6. No interpolation.
const deck = { '0.80': { weight: 8, I: 518000 }, '1.00': { weight: 10, I: 648000 }, '1.20': { weight: 12, I: 777000 } };
const volumes = { '100': .077, '125': .102, '150': .127, '180': .157 };
const moments = { '0.80': [12.47,17.62,22.79,29.21], '1.00': [15.58,21.59,27.98,35.93], '1.20': [18.35,25.46,33.06,42.53] };
const shears = { '0.80': [38.312,50.410,62.853,72.245], '1.00': [38.312,50.410,63.517,78.125], '1.20': [38.312,50.410,63.517,80.576] };
const inertia = { '0.80': [5792014,11151680,18953266,32128000], '1.00': [6312754,12066492,20408851,34432764], '1.20': [6800543,12924654,21779514,36613265] };
export const f = (v) => Number(v).toLocaleString('en-US', {maximumFractionDigits: 4, useGrouping: false});
export const references = [
  'Architecks Metal Systems Inc., supplied catalog, PDF page 6: DECK FOUR, Deck Properties and Composite Properties. Capacities and Iave are supplier values, not independently derived resistances.',
  'Supplied one-page Analysis and Design of Composite Slab (Steel Deck Slab): worked example only; different geometry and concrete density. Not a design standard or a validated benchmark.',
  'Philippine basis for engineer confirmation: NSCP C101-15, Volume I, 7th edition (2015), gravity strength combinations 1.4D and 1.2D + 1.6L. Only D and L are evaluated here. Confirm governing edition and local approval requirements.',
  'ANSI/SDI C-2017: composite steel floor deck-slabs reference. ANSI/SDI SD-2022 supersedes the separate 2017 standards; adopting it requires project-specific review. https://sdi.org/codes-standards/sdi-standards/',
];
export const limitations = [
  'PRELIMINARY / INCOMPLETE DESIGN. A passing individual comparison is not approval of the floor system. Catalog capacity basis, concrete strength, bond performance, applicable spans and support conditions require current supplier confirmation.',
  'One-way, simply supported, 1.000 m strip; uniform static gravity loads only. Span is the analysis span between support reaction lines. Construction span is independently specified; temporary props need their own design.',
  'Catalog DECK FOUR only, exact listed thicknesses and overall depths. Do not use these properties for DN Deck One/Three or another manufacturer. Do not interpolate or infer capacities from steel yield strength.',
  'Composite flexure and vertical shear use the catalog columns headed oM and oV as design resistances, provisionally. The catalog also lists another moment column (OM); this tool does not interchange them. Their design basis is not stated sufficiently to establish NSCP compliance.',
  'Construction demands evaluate uniform loading with project gravity factors. SDI concentrated construction loads, load positioning, wet-concrete accumulation, ponding, impact, and erection sequence remain unevaluated. Construction moment/shear/bearing resistances must be supplied on the same factored basis.',
  'Elastic instantaneous deflection: construction uses wet concrete plus deck only; composite uses supplier Iave with the modulus matching its confirmed transformation basis. No creep, shrinkage, staged stress, cracking recalculation or long-term deflection. Deflection ratios are user project criteria, not certified code limits.',
  'Iave transformation basis is not stated in the catalog. Composite deflection remains NOT CHECKED until the user confirms steel or concrete reference material with the supplier. General formula: delta = 5 w L^4 / (384 Eref Iave), with matched Eref and Iave.',
  'Outstanding: longitudinal shear/bond and incomplete shear connection; effective cold-formed section/local buckling; web crippling and actual bearing length; fasteners/end anchorage; reinforcement for shrinkage, temperature, negative moment and fire; diaphragm, openings, vibration, concentrated loads, seismic and fire design.',
  'Engineer must verify loads (including partitions), material strengths, site conditions, applicable Philippine standards and every outstanding item before issuing a signed design. No overall compliance or safe-for-construction conclusion is produced.',
];
export function calculate(input) {
  const errors=[];
  const product=selectedProduct(input);
  if(!product) errors.push('Select a supported steel deck manufacturer and profile.');
  const positive=['span','constructionSpan','wetDensity','dryDensity','steelE','concreteE','constructionLimit','liveLimit','totalLimit'];
  const nonnegative=['finish','live','constructionLoad'];
  for(const key of [...positive,...nonnegative]) if(input[key]==='' || !Number.isFinite(Number(input[key])) || (positive.includes(key)?Number(input[key])<=0:Number(input[key])<0)) errors.push(`${key}: enter a finite ${positive.includes(key)?'positive':'nonnegative'} number.`);
  for(const key of ['constructionMoment','constructionShear','bearing']) if(input[key]!=='' && (!Number.isFinite(Number(input[key])) || Number(input[key])<=0)) errors.push(`${key}: enter a positive factored resistance, or leave blank.`);
  if(!deck[input.thickness] || !(input.depth in volumes)) errors.push('Select a listed catalog section.');
  if (!['unconfirmed','steel','concrete'].includes(input.inertiaBasis)) errors.push('Select a valid composite inertia transformation basis.');
  if(errors.length) return {errors};
  const n=Object.fromEntries([...positive,...nonnegative].map(k=>[k,Number(input[k])]));
  const p=deck[input.thickness], j=['100','125','150','180'].indexOf(input.depth), v=volumes[input.depth];
  const wd=p.weight*9.80665/1000, wet=v*n.wetDensity, dry=v*n.dryDensity;
  const D=dry+wd+n.finish, L=n.live, Dc=wet+wd;
  const wu=Math.max(1.4*D,1.2*D+1.6*L), wc=Math.max(1.4*Dc,1.2*Dc+1.6*n.constructionLoad);
  const Mu=wu*n.span**2/8, Vu=wu*n.span/2, Mc=wc*n.constructionSpan**2/8, Vc=wc*n.constructionSpan/2;
  const Ic=inertia[input.thickness][j], mr=moments[input.thickness][j], vr=shears[input.thickness][j];
  // kPa * 1 m = kN/m = N/mm, L is converted to mm; E N/mm2 and I mm4 per 1 m strip.
  const delta=(w,l,E,I)=>5*w*(l*1000)**4/(384*E*I);
  const compositeE=input.inertiaBasis==='steel'?n.steelE:n.concreteE;
  const dc=delta(Dc,n.constructionSpan,n.steelE,p.I), dl=delta(L,n.span,compositeE,Ic), dt=delta(D+L,n.span,compositeE,Ic);
  if (![D,wu,wc,Mu,Vu,Mc,Vc,dc,dl,dt,n.span*1000/n.liveLimit,n.span*1000/n.totalLimit,n.constructionSpan*1000/n.constructionLimit].every(Number.isFinite)) return {errors:['Inputs exceed the supported numerical range. Use realistic SI engineering values.']};
  const steps=[];
  const add=(title,formula,substitution,result,unit,basis)=>steps.push({title,formula,substitution,result,unit,basis});
  add('Deck self-weight','wdeck = mass x g / 1000',`${p.weight} x 9.80665 / 1000`,wd,'kPa','Catalog mass in kg/m2; standard gravity in m/s2.');
  add('Concrete self-weight','wwet = V x gammawet; wdry = V x gammadry',`V = ${v} m3/m2; wet: ${v} x ${n.wetDensity}; dry: ${v} x ${n.dryDensity}`,dry,'kPa (dry)',`Wet weight = ${f(wet)} kPa. Profile concrete volume, not overall depth times unit area.`);
  add('Permanent dead load','D = wdry + wdeck + SDL',`${f(dry)} + ${f(wd)} + ${n.finish}`,D,'kPa','SDL includes user-entered finishes, ceiling and permanent partitions.');
  add('Composite design load','wu = max(1.4D, 1.2D + 1.6L)',`max(${f(1.4*D)}, 1.2 x ${f(D)} + 1.6 x ${L})`,wu,'kN/m','1 m strip; gravity D/L combinations only.');
  add('Composite sagging moment','Mu = wu L^2 / 8',`${f(wu)} x ${n.span}^2 / 8`,Mu,'kN.m/m','Simply supported uniform load.');
  add('Composite support shear','Vu = wu L / 2',`${f(wu)} x ${n.span} / 2`,Vu,'kN/m','At support; no critical-section reduction.');
  add('Construction design load','wc = max(1.4Dc, 1.2Dc + 1.6CL)',`Dc = ${f(wet)} + ${f(wd)} = ${f(Dc)}; max(${f(1.4*Dc)}, ${f(1.2*Dc+1.6*n.constructionLoad)})`,wc,'kN/m','Uniform-load screening only; CL is a project input.');
  add('Construction moment','Mc = wc Lc^2 / 8',`${f(wc)} x ${n.constructionSpan}^2 / 8`,Mc,'kN.m/m','Deck alone before concrete gains strength.');
  add('Construction support shear','Vc = wc Lc / 2',`${f(wc)} x ${n.constructionSpan} / 2`,Vc,'kN/m','Also the reaction for the entered bearing resistance comparison.');
  add('Construction dead-load deflection','delta = 5 Dc (1000Lc)^4 / (384 Es Is)',`5 x ${f(Dc)} x (${n.constructionSpan} x 1000)^4 / (384 x ${n.steelE} x ${p.I})`,dc,'mm','Dc in N/mm for 1 m strip; effective stiffness requires verification. Excludes construction live load.');
  if (input.inertiaBasis !== 'unconfirmed') {
  add('Composite live-load deflection','deltaL = 5 L (1000Ls)^4 / (384 Eref Iave)',`5 x ${L} x (${n.span} x 1000)^4 / (384 x ${compositeE} x ${Ic})`,dl,'mm','Instantaneous; Eref matches user-confirmed Iave transformation basis. Not a long-term prediction.');
  add('Composite total-load deflection','deltaT = 5 (D + L) (1000Ls)^4 / (384 Eref Iave)',`5 x ${f(D+L)} x (${n.span} x 1000)^4 / (384 x ${compositeE} x ${Ic})`,dt,'mm','Unstaged elastic approximation; verify shoring and load history separately.');
  }
  const check=(name,demand,capacity,unit,source)=>({name,demand,capacity,unit,source,ratio:capacity && demand !== null?demand/capacity:null,status:capacity && demand !== null?(demand<=capacity?'Passed':'Fail'):'NOT CHECKED'});
  const checks=[check('Composite flexure (catalog)',Mu,mr,'kN.m/m','Catalog p.6, oM; supplier basis unconfirmed'),check('Composite vertical shear (catalog)',Vu,vr,'kN/m','Catalog p.6, oV; bond is separate'),check('Construction flexure',Mc,Number(input.constructionMoment)||null,'kN.m/m','User-entered factored resistance'),check('Construction shear',Vc,Number(input.constructionShear)||null,'kN/m','User-entered factored resistance'),check('Construction bearing',Vc,Number(input.bearing)||null,'kN/m','User-entered factored resistance'),check('Construction dead-load deflection',dc,n.constructionSpan*1000/n.constructionLimit,'mm',`Project criterion Lc/${n.constructionLimit}`),check('Composite live deflection',input.inertiaBasis==='unconfirmed'?null:dl,n.span*1000/n.liveLimit,'mm',`Project criterion L/${n.liveLimit}`),check('Composite total elastic deflection',input.inertiaBasis==='unconfirmed'?null:dt,n.span*1000/n.totalLimit,'mm',`Project criterion L/${n.totalLimit}`)];
  if(checks.some(c=>c.ratio!==null && !Number.isFinite(c.ratio))) return {errors:['Resistance or limit is outside the supported numerical range.']};
  for(const c of checks) if(c.capacity && c.demand !== null) add(c.name+' comparison','utilization = demand / resistance or limit',`${f(c.demand)} / ${f(c.capacity)}`,c.ratio,'',`${c.status}; ${c.source}. Limit <= 1.0000; comparison uses unrounded numbers.`);
  return {errors,steps,checks,product:{manufacturer:product.manufacturer.name,profile:product.profile.name,source:product.profile.source},properties:{mass:p.weight,volume:v,steelI:p.I,compositeI:Ic,moment:mr,shear:vr},status:checks.some(c=>c.status==='Fail')?'Fail - evaluated limit exceeded':'INCOMPLETE DESIGN'};
}


