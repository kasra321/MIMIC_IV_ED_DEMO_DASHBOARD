import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import type { VitalSign } from '../types';

interface VitalsChartProps {
  vitalsigns: VitalSign[];
}

const VITAL_COLORS: Record<string, string> = {
  heartrate: '#ef4444',
  sbp: '#3b82f6',
  dbp: '#60a5fa',
  o2sat: '#22c55e',
  resprate: '#f59e0b',
  temperature: '#8b5cf6',
};

const VITAL_LABELS: Record<string, string> = {
  heartrate: 'Heart Rate',
  sbp: 'Systolic BP',
  dbp: 'Diastolic BP',
  o2sat: 'O2 Saturation',
  resprate: 'Resp Rate',
  temperature: 'Temperature',
};

export function VitalsChart({ vitalsigns }: VitalsChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<string[]>([
    'heartrate',
    'sbp',
    'dbp',
    'o2sat',
  ]);

  if (vitalsigns.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        No vital signs recorded for this encounter
      </div>
    );
  }

  // Sort by charttime and format for the chart
  const chartData = [...vitalsigns]
    .sort(
      (a, b) =>
        new Date(a.charttime).getTime() - new Date(b.charttime).getTime()
    )
    .map((v) => ({
      ...v,
      time: format(new Date(v.charttime), 'HH:mm'),
      fullTime: v.charttime,
    }));

  const toggleSeries = (key: string) => {
    setVisibleSeries((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  return (
    <div className="space-y-4">
      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(VITAL_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => toggleSeries(key)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              visibleSeries.includes(key)
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: visibleSeries.includes(key)
                ? VITAL_COLORS[key]
                : undefined,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              yAxisId="left"
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[80, 100]}
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip
              labelFormatter={(_, payload) => {
                if (payload?.[0]?.payload?.fullTime) {
                  return format(
                    new Date(payload[0].payload.fullTime),
                    'MMM d, HH:mm'
                  );
                }
                return '';
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />

            {visibleSeries.includes('heartrate') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="heartrate"
                name="Heart Rate"
                stroke={VITAL_COLORS.heartrate}
                dot={{ r: 4 }}
                strokeWidth={2}
                connectNulls
              />
            )}
            {visibleSeries.includes('sbp') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sbp"
                name="Systolic BP"
                stroke={VITAL_COLORS.sbp}
                dot={{ r: 4 }}
                strokeWidth={2}
                connectNulls
              />
            )}
            {visibleSeries.includes('dbp') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="dbp"
                name="Diastolic BP"
                stroke={VITAL_COLORS.dbp}
                dot={{ r: 4 }}
                strokeWidth={2}
                connectNulls
              />
            )}
            {visibleSeries.includes('o2sat') && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="o2sat"
                name="O2 Saturation"
                stroke={VITAL_COLORS.o2sat}
                dot={{ r: 4 }}
                strokeWidth={2}
                connectNulls
              />
            )}
            {visibleSeries.includes('resprate') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="resprate"
                name="Resp Rate"
                stroke={VITAL_COLORS.resprate}
                dot={{ r: 4 }}
                strokeWidth={2}
                connectNulls
              />
            )}
            {visibleSeries.includes('temperature') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke={VITAL_COLORS.temperature}
                dot={{ r: 4 }}
                strokeWidth={2}
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
