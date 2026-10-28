// Shared transverse-section geometry for browser SVG and PDF vectors.
// Reinforcement is illustrative; bar diameters, spacing and cover are not designed here.
export const section = {
 width:700,height:250,
 deck:[[55,135],[110,135],[130,165],[185,165],[205,135],[285,135],[305,165],[360,165],[380,135],[460,135],[480,165],[535,165],[555,135],[605,135]],
 longitudinalBars:Array.from({length:12},(_,i)=>({x:92+i*44,y:79,r:4})),
 transverseBar:{x:75,y:83,width:510,height:6},
 labels:[
  {text:'Longitudinal bars (upper)*',x:70,y:24,leader:[[155,30],[155,43],[180,43],[180,75]]},
  {text:'Transverse bars (lower)*',x:340,y:24,leader:[[437,30],[437,43],[422,43],[422,83]]},
  {text:'Concrete slab',x:75,y:215,leader:[[125,195],[125,111]]},
  {text:'Profiled steel decking',x:290,y:215,leader:[[355,195],[355,167]]},
 ],
};
export function sectionLabels(input) {
 return [...section.labels,{text:`h = ${input.depth} mm`,x:570,y:42},{text:`t = ${input.thickness} mm`,x:485,y:235,leader:[[555,229],[585,193],[568,136]]}];
}
export function arrowHead(points,size=5) {
 const tip=points[points.length-1],from=points[points.length-2];
 const length=Math.hypot(tip[0]-from[0],tip[1]-from[1]);
 const ux=(tip[0]-from[0])/length,uy=(tip[1]-from[1])/length;
 return [tip,[tip[0]-size*ux-size*.45*uy,tip[1]-size*uy+size*.45*ux],[tip[0]-size*ux+size*.45*uy,tip[1]-size*uy-size*.45*ux]];
}
export const sectionCaption='Typical transverse cross-section - schematic, not to scale. Longitudinal bars above transverse bars. *Bar sizes, spacing and cover require separate design. Rib geometry is illustrative; span is perpendicular to this section.';
export function drawSection(pdf,input,x,y,width) {
 const s=width/section.width;
 const line=(a,b)=>pdf.line(x+a[0]*s,y+a[1]*s,x+b[0]*s,y+b[1]*s);
 const polygon=(points,style)=>{
  const vectors=points.slice(1).map((p,i)=>[(p[0]-points[i][0])*s,(p[1]-points[i][1])*s]);
  pdf.lines(vectors,x+points[0][0]*s,y+points[0][1]*s,[1,1],style,true);
 };
 const leader=points=>{
  pdf.setDrawColor(103,116,115);pdf.setFillColor(103,116,115);pdf.setLineWidth(.2);
  points.slice(1).forEach((p,i)=>line(points[i],p));polygon(arrowHead(points),'F');
 };
 pdf.setDrawColor(132,144,145);pdf.setFillColor(237,240,238);pdf.setLineWidth(.25);
 polygon([[55,55],[605,55],...section.deck.slice().reverse()],'FD');
 pdf.setFillColor(185,193,187);
 for(let xx=85;xx<600;xx+=27)for(let yy=104;yy<130;yy+=18)polygon([[xx,yy-1],[xx+2,yy+1],[xx-1,yy+2]],'F');
 pdf.setDrawColor(148,103,40);pdf.setLineWidth(.65);
 section.deck.slice(1).forEach((p,i)=>line(section.deck[i],p));
 const bar=section.transverseBar;
 pdf.setFillColor(77,97,106);pdf.roundedRect(x+bar.x*s,y+bar.y*s,bar.width*s,bar.height*s,2*s,2*s,'F');
 pdf.setDrawColor(148,165,170);pdf.setLineWidth(.15);line([bar.x+3,bar.y+1.5],[bar.x+bar.width-3,bar.y+1.5]);
 for(const b of section.longitudinalBars){
  pdf.setDrawColor(47,65,74);pdf.setFillColor(87,111,122);pdf.setLineWidth(.15);pdf.circle(x+b.x*s,y+b.y*s,b.r*s,'FD');
  pdf.setFillColor(186,202,207);pdf.circle(x+(b.x-1)*s,y+(b.y-1)*s,.9*s,'F');
 }
 pdf.setDrawColor(103,116,115);pdf.setLineWidth(.2);
 line([635,55],[635,165]);line([615,55],[645,55]);line([615,165],[645,165]);
 pdf.setFillColor(103,116,115);polygon(arrowHead([[635,72],[635,55]]),'F');polygon(arrowHead([[635,148],[635,165]]),'F');
 pdf.setFont('helvetica','normal');pdf.setFontSize(8);
 for(const label of sectionLabels(input)){
  pdf.setTextColor(52,67,65);pdf.text(label.text,x+label.x*s,y+label.y*s);
  if(label.leader)leader(label.leader);
 }
}
