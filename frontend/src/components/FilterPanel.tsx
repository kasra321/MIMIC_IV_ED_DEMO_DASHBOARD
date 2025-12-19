import type { FilterOptions, EncounterFilters } from '../types';

interface FilterPanelProps {
  options: FilterOptions | undefined;
  filters: EncounterFilters;
  onChange: (filters: EncounterFilters) => void;
  isLoading?: boolean;
}

export function FilterPanel({
  options,
  filters,
  onChange,
  isLoading,
}: FilterPanelProps) {
  const hasActiveFilters =
    filters.gender ||
    filters.races.length > 0 ||
    filters.dispositions.length > 0 ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.chiefComplaint;

  const clearFilters = () => {
    onChange({
      ...filters,
      gender: null,
      races: [],
      dispositions: [],
      dateFrom: null,
      dateTo: null,
      chiefComplaint: null,
      page: 1,
    });
  };

  if (isLoading || !options) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={filters.gender || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                gender: e.target.value || null,
                page: 1,
              })
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All</option>
            {options.genders.map((g) => (
              <option key={g} value={g}>
                {g === 'M' ? 'Male' : g === 'F' ? 'Female' : g}
              </option>
            ))}
          </select>
        </div>

        {/* Race */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Race
          </label>
          <select
            multiple
            value={filters.races}
            onChange={(e) =>
              onChange({
                ...filters,
                races: Array.from(e.target.selectedOptions, (o) => o.value),
                page: 1,
              })
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            size={1}
          >
            {options.races.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {filters.races.length > 0 && (
            <span className="text-xs text-gray-500">
              {filters.races.length} selected
            </span>
          )}
        </div>

        {/* Disposition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Disposition
          </label>
          <select
            multiple
            value={filters.dispositions}
            onChange={(e) =>
              onChange({
                ...filters,
                dispositions: Array.from(
                  e.target.selectedOptions,
                  (o) => o.value
                ),
                page: 1,
              })
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            size={1}
          >
            {options.dispositions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {filters.dispositions.length > 0 && (
            <span className="text-xs text-gray-500">
              {filters.dispositions.length} selected
            </span>
          )}
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  dateFrom: e.target.value || null,
                  page: 1,
                })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Chief Complaint Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chief Complaint
          </label>
          <input
            type="text"
            value={filters.chiefComplaint || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                chiefComplaint: e.target.value || null,
                page: 1,
              })
            }
            placeholder="Search..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
