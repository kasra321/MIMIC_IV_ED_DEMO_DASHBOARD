export interface EncounterListItem {
  stay_id: number;
  subject_id: number;
  hadm_id: number | null;
  intime: string;
  outtime: string;
  gender: string;
  race: string | null;
  arrival_transport: string | null;
  disposition: string;
  chiefcomplaint: string | null;
  acuity: number | null;
  duration_hours: number;
}

export interface EncounterListResponse {
  items: EncounterListItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface VitalSign {
  charttime: string;
  temperature: number | null;
  heartrate: number | null;
  resprate: number | null;
  o2sat: number | null;
  sbp: number | null;
  dbp: number | null;
  rhythm: string | null;
  pain: string | null;
}

export interface Diagnosis {
  seq_num: number;
  icd_code: string;
  icd_version: number;
  icd_title: string | null;
}

export interface Medication {
  charttime: string | null;
  name: string | null;
  source: 'medrecon' | 'pyxis';
  gsn: string | null;
  description: string | null;
}

export interface TriageData {
  temperature: number | null;
  heartrate: number | null;
  resprate: number | null;
  o2sat: number | null;
  sbp: number | null;
  dbp: number | null;
  pain: string | null;
  acuity: number | null;
  chiefcomplaint: string | null;
}

export interface EncounterDetail {
  stay_id: number;
  subject_id: number;
  hadm_id: number | null;
  intime: string;
  outtime: string;
  gender: string;
  race: string | null;
  arrival_transport: string | null;
  disposition: string;
  duration_hours: number;
  triage: TriageData | null;
  vitalsigns: VitalSign[];
  diagnoses: Diagnosis[];
  medications: Medication[];
}

export interface FilterOptions {
  genders: string[];
  races: string[];
  dispositions: string[];
  chief_complaints: string[];
  date_range: {
    min: string | null;
    max: string | null;
  };
}

export interface EncounterFilters {
  gender: string | null;
  races: string[];
  dispositions: string[];
  dateFrom: string | null;
  dateTo: string | null;
  chiefComplaint: string | null;
  page: number;
  perPage: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
