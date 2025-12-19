import { format } from 'date-fns';
import type { EncounterDetail as EncounterDetailType } from '../types';
import { VitalsChart } from './VitalsChart';

interface EncounterDetailProps {
  encounter: EncounterDetailType;
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        colorClasses[disposition] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {disposition}
    </span>
  );
}

function AcuityBadge({ acuity }: { acuity: number | null }) {
  if (acuity === null) return null;

  const colorClasses: Record<number, string> = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
    5: 'bg-blue-500',
  };

  const labels: Record<number, string> = {
    1: 'Critical',
    2: 'Emergent',
    3: 'Urgent',
    4: 'Less Urgent',
    5: 'Non-Urgent',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
        colorClasses[acuity] || 'bg-gray-500'
      }`}
    >
      Level {acuity}: {labels[acuity] || 'Unknown'}
    </span>
  );
}

function VitalCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | null;
  unit: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-gray-900">
        {value !== null ? `${value} ${unit}` : '-'}
      </div>
    </div>
  );
}

export function EncounterDetailComponent({ encounter }: EncounterDetailProps) {
  const { triage, vitalsigns, diagnoses, medications } = encounter;

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Stay ID: {encounter.stay_id}
            </h1>
            <p className="text-gray-600 mt-1">
              Subject ID: {encounter.subject_id}
              {encounter.hadm_id && ` | Hospital Admission: ${encounter.hadm_id}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DispositionBadge disposition={encounter.disposition} />
            <AcuityBadge acuity={triage?.acuity ?? null} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <div className="text-sm text-gray-500">Gender</div>
            <div className="font-medium">
              {encounter.gender === 'M' ? 'Male' : 'Female'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Race</div>
            <div className="font-medium">{encounter.race || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Arrival</div>
            <div className="font-medium">
              {format(new Date(encounter.intime), 'MMM d, yyyy HH:mm')}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Duration</div>
            <div className="font-medium">{encounter.duration_hours} hours</div>
          </div>
        </div>

        {encounter.arrival_transport && (
          <div className="mt-4">
            <div className="text-sm text-gray-500">Arrival Transport</div>
            <div className="font-medium">{encounter.arrival_transport}</div>
          </div>
        )}
      </div>

      {/* Triage Section */}
      {triage && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Triage Assessment
          </h2>

          {triage.chiefcomplaint && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                Chief Complaint
              </div>
              <div className="text-blue-900 mt-1">{triage.chiefcomplaint}</div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <VitalCard
              label="Heart Rate"
              value={triage.heartrate}
              unit="bpm"
            />
            <VitalCard
              label="Blood Pressure"
              value={triage.sbp}
              unit={triage.dbp ? `/${triage.dbp}` : 'mmHg'}
            />
            <VitalCard label="O2 Saturation" value={triage.o2sat} unit="%" />
            <VitalCard label="Resp Rate" value={triage.resprate} unit="/min" />
            <VitalCard
              label="Temperature"
              value={triage.temperature}
              unit="°F"
            />
            <VitalCard
              label="Pain"
              value={triage.pain ? parseInt(triage.pain) : null}
              unit="/10"
            />
          </div>
        </div>
      )}

      {/* Vital Signs Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Vital Signs Timeline
        </h2>
        <VitalsChart vitalsigns={vitalsigns} />
      </div>

      {/* Diagnoses */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Diagnoses ({diagnoses.length})
        </h2>
        {diagnoses.length === 0 ? (
          <p className="text-gray-500">No diagnoses recorded</p>
        ) : (
          <div className="space-y-2">
            {diagnoses.map((dx, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm font-medium text-gray-600">
                  {dx.seq_num}
                </span>
                <div>
                  <div className="font-medium text-gray-900">
                    {dx.icd_title || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500">
                    ICD-{dx.icd_version}: {dx.icd_code}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Medications ({medications.length})
        </h2>
        {medications.length === 0 ? (
          <p className="text-gray-500">No medications recorded</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Medication
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medications.map((med, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {med.name || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          med.source === 'pyxis'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {med.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {med.charttime
                        ? format(new Date(med.charttime), 'MMM d, HH:mm')
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                      {med.description || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
