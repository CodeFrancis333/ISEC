export type Category = 'I' | 'II' | 'III' | 'IV' | 'V';
export const categoryMetadata = {
  I: { group: 'I', figure: '207A.5-1C', page: '2-40', mri: 1700 },
  II: { group: 'II', figure: '207A.5-1B', page: '2-39', mri: 700 },
  III: { group: 'III_IV_V', figure: '207A.5-1A', page: '2-38', mri: 300 },
  IV: { group: 'III_IV_V', figure: '207A.5-1A', page: '2-38', mri: 300 },
  V: { group: 'III_IV_V', figure: '207A.5-1A', page: '2-38', mri: 300 },
} as const;
export interface LookupInput {
  latitude: number;
  longitude: number;
  occupancyCategory: Category;
  datasetVersion?: string;
  edition?: 'NSCP 2015';
}
export type LookupStatus = 'verified' | 'no_approved_dataset' | 'outside_coverage' | 'review_required' | 'dataset_unavailable';
export interface LookupResult {
  status: LookupStatus;
  latitude: number;
  longitude: number;
  occupancyCategory: Category;
  standard: 'NSCP 2015';
  figure: string;
  datasetVersion: string | null;
  velocityKmh: number | null;
  velocityMs: number | null;
  featureIds: string[];
  methodology: string;
  warnings: string[];
  timestamp: string;
}
export interface DatasetMetadata {
  id: string;
  version: string;
  category_group: 'I' | 'II' | 'III_IV_V';
  status: string;
  source_figure: string;
  published_at: string | null;
  positional_uncertainty_m: number | null;
}
export const kmhToMs = (velocity: number): number => velocity / 3.6;
