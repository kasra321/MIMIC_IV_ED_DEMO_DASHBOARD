import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterPanel } from '../components/FilterPanel';
import { EncounterList } from '../components/EncounterList';
import { fetchEncounters, fetchFilterOptions } from '../api/client';
import type { EncounterFilters } from '../types';

const defaultFilters: EncounterFilters = {
  gender: null,
  races: [],
  dispositions: [],
  dateFrom: null,
  dateTo: null,
  chiefComplaint: null,
  page: 1,
  perPage: 20,
  sortBy: 'intime',
  sortOrder: 'desc',
};

export function ListPage() {
  const [filters, setFilters] = useState<EncounterFilters>(defaultFilters);

  const { data: filterOptions, isLoading: isLoadingOptions } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: fetchFilterOptions,
  });

  const { data: encountersData, isLoading: isLoadingEncounters } = useQuery({
    queryKey: ['encounters', filters],
    queryFn: () => fetchEncounters(filters),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            MIMIC IV ED Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore emergency department encounters
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <FilterPanel
          options={filterOptions}
          filters={filters}
          onChange={setFilters}
          isLoading={isLoadingOptions}
        />

        <EncounterList
          encounters={encountersData?.items || []}
          total={encountersData?.total || 0}
          page={encountersData?.page || 1}
          totalPages={encountersData?.total_pages || 1}
          filters={filters}
          onFiltersChange={setFilters}
          isLoading={isLoadingEncounters}
        />
      </main>
    </div>
  );
}
