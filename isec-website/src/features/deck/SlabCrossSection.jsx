import {section,sectionLabels,sectionCaption,arrowHead} from './crossSection.js';
const points=vertices=>vertices.map(p=>p.join(',')).join(' ');
export default function SlabCrossSection({input}) {
 const concrete=[[55,55],[605,55],...section.deck.slice().reverse()];
 const bar=section.transverseBar;
 return <figure className="deck-cross-section"><svg viewBox="0 0 700 250" role="img" aria-label={`Typical composite slab transverse cross-section, longitudinal bars above transverse bars, overall depth ${input.depth} mm, steel thickness ${input.thickness} mm`}>
 <polygon points={points(concrete)} fill="#edf0ee" stroke="#849091" strokeWidth="1.5"/>
 <g fill="#b9c1bb">{Array.from({length:20},(_,i)=>[104,122].map(yy=><polygon key={`${i}-${yy}`} points={points([[85+i*27,yy-1],[87+i*27,yy+1],[84+i*27,yy+2]])}/>))}</g>
 <polyline points={points(section.deck)} fill="none" stroke="#946728" strokeWidth="3"/>
 <rect x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx="2" fill="#4d616a"/>
 <line x1={bar.x+3} y1={bar.y+1.5} x2={bar.x+bar.width-3} y2={bar.y+1.5} stroke="#94a5aa" strokeWidth=".7"/>
 {section.longitudinalBars.map(b=><g key={b.x}><circle cx={b.x} cy={b.y} r={b.r} fill="#576f7a" stroke="#2f414a" strokeWidth=".7"/><circle cx={b.x-1} cy={b.y-1} r=".9" fill="#bacacf"/></g>)}
 <path d="M635 55 V165 M615 55 H645 M615 165 H645" fill="none" stroke="#677473"/>
 {[[[635,72],[635,55]],[[635,148],[635,165]]].map((line,i)=><polygon key={i} points={points(arrowHead(line))} fill="#677473"/>)}
 {sectionLabels(input).map(label=><g key={label.text}><text x={label.x} y={label.y} fill="#344341" fontSize="13">{label.text}</text>{label.leader&&<><polyline points={points(label.leader)} fill="none" stroke="#677473"/><polygon points={points(arrowHead(label.leader))} fill="#677473"/></>}</g>)}
 </svg><figcaption>{sectionCaption}</figcaption></figure>;
}
