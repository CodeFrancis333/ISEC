import {jsPDF} from 'jspdf';
import {calculate,f,references} from './calculations.js';
import {drawSection,sectionCaption} from './crossSection.js';

const C={ink:[38,49,48],muted:[98,108,105],brand:[103,31,37],gold:[165,123,57],line:[218,224,219],pale:[246,247,243]};
const clean=t=>String(t).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E\n]/g,'?');
export function createDeckReport(input){
 const r=calculate(input);
 if(r.errors.length)throw new Error('Correct invalid inputs before exporting.');
 const pdf=new jsPDF({unit:'mm',format:'a4'});
 pdf.setProperties({title:'Steel Deck Design Review',subject:'Summary, typical cross-section and auditable calculations',author:'Ingeniare Structural Engineering Consultancy'});
 let y=32;
 const text=(value,x,yy,size=9,bold=false,color=C.ink)=>{pdf.setFont('helvetica',bold?'bold':'normal');pdf.setFontSize(size);pdf.setTextColor(...color);pdf.text(clean(value),x,yy);};
 const wrap=(value,width,size=9,bold=false)=>{pdf.setFont('helvetica',bold?'bold':'normal');pdf.setFontSize(size);return pdf.splitTextToSize(clean(value),width);};
 const top=title=>{text('INGENIARE  /  STRUCTURAL ENGINEERING',18,14,8,true,C.brand);pdf.setDrawColor(...C.gold);pdf.setLineWidth(.5);pdf.line(18,18,192,18);text(title,18,27,16,true);y=36;};
 const page=title=>{pdf.addPage();top(title);};
 const ensure=(height,title='Steel deck design review')=>{if(y+height>272)page(title);};
 const para=(value,size=8.5,color=C.muted)=>{
  const rows=wrap(value,174,size);ensure(rows.length*4+3);
  rows.forEach(row=>{text(row,18,y,size,false,color);y+=4;});y+=3;
 };
 const heading=value=>{ensure(16);text(value,18,y,10,true,C.brand);y+=8;};
 const table=(headers,rows,widths)=>{
  const startX=18;
  const header=()=>{pdf.setFillColor(...C.brand);pdf.rect(startX,y,174,8,'F');let x=startX;headers.forEach((h,i)=>{text(h,x+3,y+5.3,8,true,[255,255,255]);x+=widths[i];});y+=8;};
  ensure(20);header();
  rows.forEach((row,index)=>{
   const lines=row.map((v,i)=>wrap(v,widths[i]-6,8));
   const height=Math.max(8,...lines.map(a=>a.length*3.7+4));
   if(y+height>272){page('Steel deck design review / continued');header();}
   pdf.setFillColor(...(index%2===0?C.pale:[255,255,255]));pdf.rect(startX,y,174,height,'F');
   let x=startX;row.forEach((value,i)=>{
    let color=C.ink;if(value==='Fail')color=[158,45,41];if(value==='Passed')color=[48,104,72];if(value==='NOT CHECKED')color=[124,95,42];
    lines[i].forEach((t,k)=>text(t,x+3,y+4.5+k*3.7,8,i===0,color));x+=widths[i];
   });pdf.setDrawColor(...C.line);pdf.setLineWidth(.15);pdf.line(startX,y+height,192,y+height);y+=height;
  });y+=5;
 };
 const metric=v=>v===null?'--':f(v);
 top('Steel deck design review');
 heading('01 / SUMMARY OF CHECKS');
 table(['Check','Demand','Limit','Ratio','Comparison'],r.checks.map(c=>[c.name.replace(" (catalog)","").replace(" elastic",""),metric(c.demand),metric(c.capacity),metric(c.ratio),c.status]),[64,27,27,18,38]);
 para('Units: moment kN.m/m; shear/bearing kN/m; deflection mm. Passed applies only to that comparison. -- means unavailable. Ratios use unrounded values; limit = 1.0000.',8);
 table(['Project / selection','Record'],[
  ['Project',`${input.project||'Untitled'}${input.location?' / '+input.location:''}`],
  ['Manufacturer / profile',`${r.product.manufacturer} / ${r.product.profile}`],
  ['Section / analysis spans',`t = ${input.thickness} mm; h = ${input.depth} mm; L = ${input.span} m; Lc = ${input.constructionSpan} m`],
 ],[40,134]);
 ensure(17);pdf.setFillColor(249,242,230);pdf.rect(18,y,174,14,'F');text('PRELIMINARY / INCOMPLETE DESIGN - NOT FOR CONSTRUCTION',21,y+5,8.2,true,C.brand);text(r.status,21,y+10,8,false);y+=21;
 ensure(72);heading('TYPICAL COMPOSITE SLAB CROSS-SECTION');
 drawSection(pdf,input,18,y-2,174);y+=61;para(sectionCaption,7.3);

 page('Design inputs & catalog properties');
 heading('02 / SELECTED PRODUCT - AUTOMATIC CATALOG LOOKUP');
 para(`${r.product.manufacturer} / ${r.product.profile}. ${r.product.source}. Exact listed thickness and overall slab depth; no interpolation.`,9);
 table(['Catalog property','Value','Unit'],[
  ['Steel deck mass',f(r.properties.mass),'kg/m2'],['Concrete volume',f(r.properties.volume),'m3/m2'],
  ['Steel deck inertia, Is',f(r.properties.steelI),'mm4 per m strip'],['Composite average inertia, Iave',f(r.properties.compositeI),'mm4 per m strip'],
  ['Composite flexure resistance, catalog oM',f(r.properties.moment),'kN.m/m'],['Composite shear resistance, catalog oV',f(r.properties.shear),'kN/m'],
 ],[85,45,44]);
 heading('PROJECT INPUTS & CRITERIA');
 table(['Parameter','Value','Unit / basis'],[
  ['Prepared by',input.engineer||'Not specified','Project record'],
  ['Completed slab analysis span, L',input.span,'m'],['Construction analysis span, Lc',input.constructionSpan,'m'],
  ['Superimposed dead load',input.finish,'kPa'],['Occupancy live load',input.live,'kPa'],['Uniform construction live load',input.constructionLoad,'kPa'],
  ['Wet / dry concrete unit weight',`${input.wetDensity} / ${input.dryDensity}`,'kN/m3'],
  ['Steel modulus, Es',input.steelE,'N/mm2'],['Concrete modulus, Ec',input.concreteE,'N/mm2'],['Iave transformation basis',input.inertiaBasis,'Supplier confirmation'],
  ['Deflection limits: construction / live / total',`${input.constructionLimit} / ${input.liveLimit} / ${input.totalLimit}`,'Span / denominator'],
  ['Construction moment resistance',input.constructionMoment||'Not provided','kN.m/m, factored'],['Construction shear resistance',input.constructionShear||'Not provided','kN/m, factored'],['Construction bearing resistance',input.bearing||'Not provided','kN/m, factored'],
 ],[85,45,44]);
 para(`Additional resistance source: ${input.capacityReference||'Not supplied. Optional construction resistances remain NOT CHECKED.'}`,8);
 para('Catalog properties are populated from the selected product. Project loads, concrete properties and deflection criteria are user assumptions. Catalog resistance and stiffness bases require supplier verification.',8);

 page('Manual calculation trail');
 heading('03 / FORMULAS, SUBSTITUTIONS & RESULTS');
 para('Simply supported, one-way, 1.000 m strip. 1 kPa x 1 m = 1 kN/m = 1 N/mm. Spans are converted from m to mm for deflection. Display values are rounded; calculations retain full precision.',8);
 r.steps.forEach((s,i)=>{
  const formula=wrap(s.formula,162,9),substitution=wrap(`Substitute: ${s.substitution}`,162,8.5),basis=wrap(s.basis,162,7.5);
  const height=13.5+formula.length*4.3+substitution.length*4+basis.length*3.5+8;
  ensure(height,'Manual calculation trail / continued');
  const start=y;pdf.setFillColor(...C.pale);pdf.setDrawColor(...C.line);pdf.setLineWidth(.2);pdf.roundedRect(18,start,174,height-3,1,1,'FD');
  text(`${String(i+1).padStart(2,'0')}  ${s.title}`,22,y+5,9,true,C.brand);y+=10.5;
  formula.forEach(t=>{text(t,22,y,9);y+=4.3;});
  substitution.forEach(t=>{text(t,22,y,8.5);y+=4;});
  text(`Result = ${f(s.result)} ${s.unit}`,22,y+1,9,true);y+=6.5;
  basis.forEach(t=>{text(t,22,y,7.5,false,C.muted);y+=3.5;});
  y=start+height;
 });

 page('Design basis & review record');
 heading('04 / ASSUMPTIONS & OUTSTANDING VERIFICATION');
 const notes=[
  'Scope: preliminary one-way, simply supported, 1 m strip under uniform static gravity loads. L and Lc are analysis spans between reaction lines. Props require separate design.',
  'Product: Architecks DN Steel Deck Four, exact catalog rows only. No interpolation. Catalog oM and oV are provisional design resistances; do not interchange oM with the separate OM column. Confirm concrete strength, resistance basis, applicable spans and support conditions with the supplier.',
  'Construction: uniform load screening only. Construction point loads, positioning, impact, erection sequence, wet-concrete accumulation and ponding are not evaluated. Entered resistances must be factored, for this section and support detail.',
  'Deflection: instantaneous elastic calculation only. Match Iave with the modulus of its confirmed reference material (Es or Ec); otherwise composite deflection is NOT CHECKED. delta = 5wL^4/(384 Eref Iave). Construction deflection uses wet concrete plus deck only.',
  'Serviceability: deflection denominators are project criteria. No creep, shrinkage, cracking recalculation, staged stress, load history or long-term deflection is included.',
  'Outstanding strength checks: longitudinal shear/bond and incomplete shear connection; effective cold-formed section/local buckling; web crippling, actual bearing length, fasteners and end anchorage.',
  'Outstanding detailing/system checks: shrinkage, temperature, negative-moment and fire reinforcement; diaphragm, openings, vibration, concentrated loads, seismic and fire design. Figure reinforcement is illustrative, not a designed detail.',
  'Approval: verify occupancy loads, partitions, material strengths, site conditions and governing Philippine code edition. Passed is not an overall compliance or safe-for-construction conclusion. Engineer review and supplier confirmation remain required.',
 ];
 notes.forEach((note,i)=>para(`${String(i+1).padStart(2,'0')}. ${note}`,8));
 heading('SOURCE REFERENCES');references.forEach((ref,i)=>para(`[${i+1}] ${ref}`,8));
 ensure(35);heading('REVIEW RECORD');
 para(`Prepared by: ${input.engineer||'Not specified'} | Generated: ${new Date().toLocaleString('en-SG',{timeZone:'Asia/Singapore',hour12:false})} SGT`,8);
 para('Supplier confirmation / date: ___________________________________________________',8);
 para('Engineer review / registration / signature / date: ____________________________________',8);
 const pages=pdf.getNumberOfPages();
 for(let p=1;p<=pages;p++){
  pdf.setPage(p);pdf.setDrawColor(...C.line);pdf.setLineWidth(.2);pdf.line(18,280,192,280);
  text('ISEC | deck-1.1 | PRELIMINARY',18,286,7,false,C.muted);text(`Page ${p} of ${pages}`,173,286,7,false,C.muted);
 }
 return pdf;
}
export function downloadDeckReport(input){createDeckReport(input).save('ISEC-steel-deck-calculations.pdf');}

