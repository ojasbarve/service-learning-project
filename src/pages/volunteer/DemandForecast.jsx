import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { distributionZones, weekForecast } from '../../data/mockData';

const priorityColor = {
  High: '#E53E3E',
  Medium: '#F59E0B',
  'No data': '#9B9B9B',
};

const priorityBg = {
  High: '#FFF5F5',
  Medium: '#FFFBEB',
  'No data': '#F7F7F8',
};

function TrendCell({ trend }) {
  if (!trend) return <span style={{ color: '#9B9B9B' }}>—</span>;
  return (
    <span style={{ color: '#00A67E', fontWeight: 500, fontSize: '0.875rem' }}>
      {trend}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E5E5',
      borderRadius: '8px',
      padding: '10px 14px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
      fontSize: '0.875rem',
    }}>
      <div style={{ fontWeight: 600, color: '#0A0A0A', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: payload[0]?.color === '#FF5C28' ? '#FF5C28' : '#9B9B9B' }}>
        {payload[0]?.value} packets
        {payload[0]?.payload?.isProjection ? ' (forecast)' : ''}
        {payload[0]?.payload?.isToday ? ' — TODAY' : ''}
      </div>
    </div>
  );
};

export default function DemandForecast() {
  return (
    <div className="forecast-page" style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Page header */}
      <div className="forecast-header" style={{ marginBottom: '24px' }}>
        <div className="forecast-title-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <BarChart3 size={18} style={{ color: '#FF5C28' }} />
          <h1 className="forecast-title" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            Distribution outlook
          </h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#9B9B9B' }}>
          Expected packet demand across Pune, based on recent distribution activity.
        </p>
      </div>

      {/* Summary card */}
      <div className="forecast-summary" style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        padding: '24px',
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '24px',
        alignItems: 'center',
        border: '1px solid #FFF0EB',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: '#FF5C28', lineHeight: 1 }}>148</div>
          <div style={{ fontSize: '0.8125rem', color: '#9B9B9B', marginTop: '4px', fontWeight: 500 }}>
            Packets needed today
          </div>
          <div style={{
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: '#E6F7F3',
            color: '#00A67E',
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}>
            <TrendingUp size={12} />
            Planning confidence · 82%
          </div>
        </div>
        <div style={{ borderLeft: '1px solid #E5E5E5', paddingLeft: '24px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Planning note
          </div>
          <p style={{ fontSize: '0.9375rem', color: '#0A0A0A', lineHeight: 1.6 }}>
            Thursday + Overcast weather increases footfall at distribution points by ~23%
          </p>
          <div style={{ marginTop: '12px', fontSize: '0.8125rem', color: '#9B9B9B' }}>
            Review again when the next route report arrives
          </div>
        </div>
      </div>

      {/* Zone breakdown table */}
      <div className="forecast-table-panel" style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        marginBottom: '24px',
        overflow: 'hidden',
      }}>
        <div className="forecast-panel-heading" style={{ padding: '18px 24px', borderBottom: '1px solid #E5E5E5' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A' }}>Zone Breakdown</h2>
        </div>
        <table className="forecast-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F7F8' }}>
              {['Zone', 'Area', 'Avg Daily', "Today's Est.", 'Trend', 'Priority'].map(h => (
                <th key={h} style={{
                  padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem',
                  fontWeight: 600, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {distributionZones.map((zone, i) => (
              <tr
                key={zone.id}
                style={{ borderBottom: i < distributionZones.length - 1 ? '1px solid #E5E5E5' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F7F7F8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '13px 16px', fontWeight: 500, color: '#0A0A0A', fontSize: '0.875rem' }}>
                  {zone.name}
                </td>
                <td style={{ padding: '13px 16px', color: '#9B9B9B', fontSize: '0.875rem' }}>
                  {zone.area}
                </td>
                <td style={{ padding: '13px 16px', color: '#6B6B6B', fontSize: '0.875rem' }}>
                  {zone.avgDaily}
                </td>
                <td style={{ padding: '13px 16px', fontWeight: 600, color: zone.todayEst ? '#0A0A0A' : '#9B9B9B', fontSize: '0.875rem' }}>
                  {zone.todayEst ?? '—'}
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <TrendCell trend={zone.trend} />
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: priorityBg[zone.priority],
                    color: priorityColor[zone.priority],
                  }}>
                    {zone.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar chart */}
      <div className="forecast-chart-panel" style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        padding: '24px',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A' }}>
            This Week's Packet Distribution
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#9B9B9B', marginTop: '2px' }}>
            Today (Thursday) is highlighted · Fri–Sun are projections
          </p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weekForecast} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#9B9B9B', fontFamily: 'inherit' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#9B9B9B', fontFamily: 'inherit' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Packets',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                style: { fontSize: 11, fill: '#9B9B9B', fontFamily: 'inherit' },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={() => <span style={{ fontSize: '0.8125rem', color: '#6B6B6B' }}>Packets distributed</span>}
            />
            <Bar dataKey="packets" name="Packets" radius={[4, 4, 0, 0]}>
              {weekForecast.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.isToday ? '#FF5C28' : entry.isProjection ? '#FFCCB6' : '#E5E5E5'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
