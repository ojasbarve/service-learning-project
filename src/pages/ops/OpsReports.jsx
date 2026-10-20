import { distributionZones, demandHistory } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Package, Users, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontFamily: 'inherit' }}>
      <div style={{ fontSize: '0.75rem', color: '#9B9B9B', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0A0A0A' }}>{payload[0].value} {payload[0].name === 'packets' ? 'meals' : 'kg'}</div>
    </div>
  );
};

export default function OpsReports() {
  const { listings, volunteers } = useApp();
  const activeListings = listings.filter(l => l.status === 'Available' || l.status === 'Assigned');
  const totalKg = activeListings.reduce((sum, l) => sum + l.quantity, 0);
  const activeVols = volunteers.filter(v => v.status !== 'Offline').length;

  const zoneBarData = distributionZones.map(z => ({ name: z.name.split(' ').slice(0, 2).join(' '), kg: z.avgDaily }));

  const kpis = [
    { icon: <Package size={20} color="#FF5C28" />, value: `${totalKg} kg`, label: 'Available This Session', bg: '#FFF0EB' },
    { icon: <TrendingUp size={20} color="#10B981" />, value: Math.round(totalKg * 2.5).toLocaleString(), label: 'Estimated Meals', bg: '#ECFDF5' },
    { icon: <Users size={20} color="#3B82F6" />, value: `${activeVols}/${volunteers.length}`, label: 'Active Volunteers', bg: '#EFF6FF' },
    { icon: <MapPin size={20} color="#8B5CF6" />, value: distributionZones.length, label: 'Zones Covered', bg: '#F5F3FF' },
  ];

  return (
    <div className="operations-page ops-reports-page" style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>Reports & Analytics</h1>
        <p style={{ fontSize: '0.9rem', color: '#9B9B9B', marginTop: '4px' }}>Operational summary and trends</p>
      </div>

      {/* KPI row */}
      <div className="ops-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', padding: '18px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A0A0A' }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#9B9B9B', fontWeight: 500 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '16px' }}>Rescue Trend (Last 14 days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={demandHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9B9B9B', fontFamily: 'inherit' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: '#9B9B9B', fontFamily: 'inherit' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="packets" stroke="#FF5C28" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '16px' }}>Zone-wise Avg. Daily Demand</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={zoneBarData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9B9B9B', fontFamily: 'inherit' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6B6B6B', fontFamily: 'inherit' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="kg" radius={[0, 4, 4, 0]} fill="#3B82F6" opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volunteer table */}
      <div style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E5E5E5' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A' }}>Volunteer Performance</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F7F8' }}>
              {['Name', 'Zone', 'Status', 'Completed Today', 'Total Deliveries'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v, i) => {
              const statusColors = { 'En Route': '#FF5C28', 'Available': '#10B981', 'Distributing': '#3B82F6', 'Offline': '#9B9B9B' };
              return (
                <tr key={v.id} style={{ borderBottom: i < volunteers.length - 1 ? '1px solid #E5E5E5' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F7F7F8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.875rem' }}>{v.name}</td>
                  <td style={{ padding: '12px 16px', color: '#9B9B9B', fontSize: '0.8125rem' }}>{v.zone}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: `${statusColors[v.status]}18`, color: statusColors[v.status], padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{v.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0A0A0A', fontSize: '0.875rem' }}>{v.completedToday}</td>
                  <td style={{ padding: '12px 16px', color: '#6B6B6B', fontSize: '0.875rem' }}>{v.totalDeliveries}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
