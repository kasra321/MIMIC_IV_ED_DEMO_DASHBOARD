import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { EncounterListItem, EncounterFilters } from '../types';

interface EncounterListProps {
  encounters: EncounterListItem[];
  total: number;
  page: number;
  totalPages: number;
  filters: EncounterFilters;
  onFiltersChange: (filters: EncounterFilters) => void;
  isLoading?: boolean;
}

function DispositionBadge({ disposition }: { disposition: string }) {
  const colorClasses: Record<string, string> = {
    ADMITTED: 'bg-purple-100 text-purple-800',
    HOME: 'bg-green-100 text-green-800',
    TRANSFER: 'bg-amber-100 text-amber-800',
    'LEFT WITHOUT BEING SEEN': 'bg-gray-100 text-gray-800',
    'LEFT AGAINST MEDICAL ADVICE': 'bg-red-100 text-red-800',
    ELOPED: 'bg-gray-100 text-gray-800',
    OTHER: 'bg-gray-100 text-gray-800',
    EXPIRED: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colorClasses[disposition] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {disposition}
    </span>
  );
}

function AcuityBadge({ acuity }: { acuity: number | null }) {
  if (acuity === null) return <span className="text-gray-400">-</span>;

  const colorClasses: Record<number, string> = {
    1: 'bg-red-100 text-red-800',
    2: 'bg-orange-100 text-orange-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-green-100 text-green-800',
    5: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
        colorClasses[acuity] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {acuity}
    </span>
  );
}

export function EncounterList({
  encounters,
  total,
  page,
  totalPages,
  filters,
  onFiltersChange,
  isLoading,
}: EncounterListProps) {
  const navigate = useNavigate();

  const handleSort = (column: string) => {
    if (filters.sortBy === column) {
      onFiltersChange({
        ...filters,
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onFiltersChange({
        ...filters,
        sortBy: column,
        sortOrder: 'desc',
      });
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (filters.sortBy !== column) return null;
    return (
      <span className="ml-1">
        {filters.sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse p-4">
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('stay_id')}
              >
                Stay ID
                <SortIcon column="stay_id" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Race
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('intime')}
              >
                Arrival
                <SortIcon column="intime" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chief Complaint
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acuity
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('disposition')}
              >
                Disposition
                <SortIcon column="disposition" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {encounters.map((encounter) => (
              <tr
                key={encounter.stay_id}
                onClick={() => navigate(`/encounter/${encounter.stay_id}`)}
                className="hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {encounter.stay_id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {encounter.gender === 'M' ? 'Male' : 'Female'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-[150px] truncate">
                  {encounter.race || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(encounter.intime), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {encounter.duration_hours.toFixed(1)}h
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                  {encounter.chiefcomplaint || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <AcuityBadge acuity={encounter.acuity} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <DispositionBadge disposition={encounter.disposition} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-medium">
            {(page - 1) * filters.perPage + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            {Math.min(page * filters.perPage, total)}
          </span>{' '}
          of <span className="font-medium">{total}</span> encounters
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() =>
              onFiltersChange({ ...filters, page: Math.max(1, page - 1) })
            }
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() =>
              onFiltersChange({
                ...filters,
                page: Math.min(totalPages, page + 1),
              })
            }
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
