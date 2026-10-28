/** The only supported catalog. Add a manufacturer only with traceable product rows. */
export const manufacturers = [{id:'architecks',name:'Architecks Metal Systems Inc.',profiles:[{id:'deck-four',name:'DN Steel Deck Four',source:'Supplied Architecks catalog, PDF page 6',thicknesses:['0.80','1.00','1.20'],depths:['100','125','150','180']}]}];
export function selectedProduct(input) {
 const manufacturer=manufacturers.find(m=>m.id===input.manufacturer);
 const profile=manufacturer?.profiles.find(p=>p.id===input.profile);
 return profile ? {manufacturer,profile} : null;
}
