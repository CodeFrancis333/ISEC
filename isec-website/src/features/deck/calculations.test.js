import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,defaults as initialDefaults} from './calculations.js';
import {createDeckReport} from './report.js';
const defaults={...initialDefaults,manufacturer:'architecks',profile:'deck-four'};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('independent hand calculation and exact supplier row',()=>{
 const r=calculate(defaults);assert.deepEqual(r.errors,[]);
 const D=3.5001665, wu=1.2*D+1.6*2.76;
 close(r.steps.find(s=>s.title==='Permanent dead load').result,D);
 close(r.checks[0].demand,wu*9/8);close(r.checks[1].demand,wu*3/2);
 close(r.properties.moment,21.59);close(r.properties.compositeI,12066492);
 const wet=.102*24+.0980665, wc=1.2*wet+1.6*1.5;
 close(r.checks[2].demand,wc*9/8);
 close(r.checks[5].demand,5*wet*3000**4/(384*200000*648000));
 assert.equal(r.checks[2].status,'NOT CHECKED');assert.equal(r.status,'Fail - evaluated limit exceeded');
 assert.equal(calculate({...defaults,span:2,constructionSpan:2}).status,'INCOMPLETE DESIGN');
});
test('dead load combination governs with zero live load',()=>{
 close(calculate({...defaults,live:0}).checks[0].demand,1.4*3.5001665*9/8);
});
test('span sensitivity and separate construction span',()=>{
 const a=calculate({...defaults,inertiaBasis:"steel"}),b=calculate({...defaults,inertiaBasis:"steel",span:6});
 close(b.checks[0].demand,a.checks[0].demand*4);close(b.checks[1].demand,a.checks[1].demand*2);
 close(b.checks[6].demand,a.checks[6].demand*16);close(b.checks[2].demand,a.checks[2].demand);
 assert.equal(b.status,'Fail - evaluated limit exceeded');
});
test('comparison boundary uses unrounded values',()=>{
 const demand=calculate(defaults).checks[2].demand;
 assert.equal(calculate({...defaults,constructionMoment:demand}).checks[2].status,'Passed');
 assert.equal(calculate({...defaults,constructionMoment:demand-.0000001}).checks[2].status,'Fail');
});
test('inertia reference material must be explicitly confirmed and matches its modulus',()=>{
 assert.equal(calculate(defaults).checks[6].status,'NOT CHECKED');
 const steel=calculate({...defaults,inertiaBasis:'steel'}),concrete=calculate({...defaults,inertiaBasis:'concrete'});
 close(concrete.checks[6].demand/steel.checks[6].demand,200000/23000);
 close(steel.checks[6].demand,5*2.76*3000**4/(384*200000*12066492));
});
test('invalid inputs reject calculations and PDF export',()=>{
 for(const change of [{span:0},{live:-1},{span:''},{steelE:Infinity},{thickness:'1.40'},{depth:'130'},{bearing:-2}]){
  const input={...defaults,...change};assert.ok(calculate(input).errors.length);assert.throws(()=>createDeckReport(input));
 }
});
test('manufacturer and profile are required; unsupported catalog selections cannot export',()=>{
 for(const change of [{manufacturer:''},{manufacturer:'other-brand'},{profile:''},{profile:'deck-one'}]){
  const input={...defaults,...change};assert.ok(calculate(input).errors.length);assert.throws(()=>createDeckReport(input));
 }
 assert.ok(calculate(initialDefaults).errors.length);
});
test('properties load from the selected catalog row, ignoring arbitrary property inputs',()=>{
 const a=calculate({...defaults,mass:999,steelI:1,moment:999});
 assert.equal(a.properties.mass,10);assert.equal(a.properties.steelI,648000);assert.equal(a.properties.moment,21.59);
 const b=calculate({...defaults,thickness:'1.20',depth:'150'});
 assert.equal(b.properties.mass,12);assert.equal(b.properties.compositeI,21779514);assert.equal(b.properties.moment,33.06);
 assert.equal(b.product.manufacturer,'Architecks Metal Systems Inc.');
});
test('all catalog rows are finite and PDF contains the audit trail',()=>{
 for(const thickness of ['0.80','1.00','1.20'])for(const depth of ['100','125','150','180']){
  assert.ok(calculate({...defaults,thickness,depth}).steps.every(s=>Number.isFinite(s.result)));
 }
 const pdf=createDeckReport(defaults),text=pdf.output();assert.ok(text.startsWith('%PDF-'));assert.ok(pdf.getNumberOfPages()>=4);
 assert.ok(text.includes('Manual calculation trail'));assert.ok(text.includes('NOT CHECKED'));assert.ok(text.includes('PRELIMINARY'));
 const firstPage=pdf.internal.pages[1].join('\n');
 assert.ok(firstPage.includes('SUMMARY OF CHECKS'));assert.ok(firstPage.includes('TYPICAL COMPOSITE SLAB CROSS-SECTION'));
 assert.ok(firstPage.includes('h = 125 mm'));assert.ok(firstPage.includes('t = 1.00 mm'));
});


