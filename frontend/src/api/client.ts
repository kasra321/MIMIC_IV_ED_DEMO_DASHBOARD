import axios from 'axios';
import type {
  EncounterListResponse,
  EncounterDetail,
  FilterOptions,
  EncounterFilters,
} from '../types';

// Use relative URL in production (Docker), absolute URL in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function fetchEncounters(
  filters: EncounterFilters
): Promise<EncounterListResponse> {
  const params = new URLSearchParams();

  if (filters.gender) params.append('gender', filters.gender);
  filters.races.forEach((r) => params.append('race', r));
  filters.dispositions.forEach((d) => params.append('disposition', d));
  if (filters.dateFrom) params.append('date_from', filters.dateFrom);
  if (filters.dateTo) params.append('date_to', filters.dateTo);
  if (filters.chiefComplaint)
    params.append('chief_complaint', filters.chiefComplaint);
  params.append('page', String(filters.page));
  params.append('per_page', String(filters.perPage));
  params.append('sort_by', filters.sortBy);
  params.append('sort_order', filters.sortOrder);

  const response = await api.get<EncounterListResponse>(
    `/encounters?${params.toString()}`
  );
  return response.data;
}

export async function fetchEncounterDetail(
  stayId: number
): Promise<EncounterDetail> {
  const response = await api.get<EncounterDetail>(`/encounters/${stayId}`);
  return response.data;
}

export async function fetchFilterOptions(): Promise<FilterOptions> {
  const response = await api.get<FilterOptions>('/filters/options');
  return response.data;
}
