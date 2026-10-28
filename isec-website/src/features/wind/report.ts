import { jsPDF } from 'jspdf';
import type { LookupResult } from '../../../../wind-map/shared/contracts';
import { lookupWind, type WindDataset } from './dataset';

export function createWindReport(result: LookupResult, locationName: string, dataset: WindDataset): jsPDF {
  const checked = lookupWind({ latitude: result.latitude, longitude: result.longitude, occupancyCategory: result.occupancyCategory, datasetVersion: result.datasetVersion || '' }, dataset);
  if (checked.status !== 'verified' || result.status !== 'verified' || checked.velocityKmh !== result.velocityKmh) throw new Error('Reports require a matching, reviewed lookup result.');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  // PDF's standard Times face; no unlicensed Windows font is bundled.
  pdf.setFont('times', 'normal'); pdf.setTextColor(0); pdf.setFontSize(11);
  let y = 22;
  const paragraph = (text: string, bold = false) => {
    pdf.setFont('times', bold ? 'bold' : 'normal');
    const lines: string[] = pdf.splitTextToSize(text, 170);
    for (const line of lines) {
      if (y > 272) { pdf.addPage(); y = 22; }
      pdf.text(line, 20, y); y += 5;
    }
    y += 3;
  };
  paragraph('INGENIARE STRUCTURAL ENGINEERING CONSULTANCY', true);
  paragraph('PHILIPPINE BASIC WIND VELOCITY DETERMINATION REPORT', true);
  paragraph(`Generated: ${result.timestamp}`);
  const rows = [
    ['Location', locationName], ['Latitude / longitude', `${result.latitude.toFixed(6)}, ${result.longitude.toFixed(6)}`],
    ['Standard / category', `${result.standard} / ${result.occupancyCategory}`], ['Source figure', result.figure],
    ['Basic wind velocity', `${result.velocityKmh!.toFixed(2)} km/h / ${result.velocityMs!.toFixed(3)} m/s`],
    ['Dataset / status', `${dataset.version} / reviewed`], ['Reviewer / approval', `${dataset.review.reviewer} / ${dataset.review.approvedAt}`],
    ['Feature identifiers', result.featureIds.join(', ')], ['Positional uncertainty', `${dataset.review.positionalUncertaintyM} m`],
  ];
  for (const [label, value] of rows) {
    const text = pdf.splitTextToSize(value, 110) as string[];
    const height = Math.max(9, text.length * 5 + 4);
    if (y + height > 272) { pdf.addPage(); y = 22; }
    pdf.setDrawColor(170); pdf.rect(20, y - 4, 170, height); pdf.line(75, y - 4, 75, y - 4 + height);
    pdf.setFont('times', 'bold'); pdf.text(label, 22, y + 1);
    pdf.setFont('times', 'normal'); pdf.text(text, 77, y + 1); y += height;
  }
  y += 6;
  paragraph('Lookup methodology', true); paragraph(result.methodology);
  paragraph('Engineering remarks', true);
  for (const warning of result.warnings) paragraph(warning);
  paragraph(`Independent checkpoint record: ${dataset.review.checkpointReport}`);
  paragraph('The result concerns basic wind velocity only. Terrain, exposure, topography, special wind regions and other project-specific design requirements must be assessed by the responsible engineer.');
  paragraph(`Source: NSCP 2015, Figure ${result.figure}. Published derivative dataset: ${dataset.version}. Distribution authorization is recorded in the dataset review metadata.`);
  const pages = pdf.getNumberOfPages();
  for (let page = 1; page <= pages; page++) { pdf.setPage(page); pdf.setFontSize(9); pdf.text(`INGENIARE | Dataset ${dataset.version} | Page ${page} of ${pages}`, 20, 287); }
  return pdf;
}
export function downloadWindReport(result: LookupResult, locationName: string, dataset: WindDataset): void {
  createWindReport(result, locationName, dataset).save(`Ingeniare-wind-${result.occupancyCategory}-${dataset.version.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
}
