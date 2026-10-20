import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Phone, User } from 'lucide-react';

const typeColors = {
  'Restaurant': { bg: '#FEF3C7', color: '#D97706' },
  'College Canteen': { bg: '#D1FAE5', color: '#059669' },
  'IT Park Canteen': { bg: '#DBEAFE', color: '#2563EB' },
  'Hotel Banquet': { bg: '#EDE9FE', color: '#7C3AED' },
  'Bakery': { bg: '#FFEDD5', color: '#EA580C' },
  'Local Dhaba': { bg: '#FEE2E2', color: '#DC2626' },
  'Corporate Cafeteria': { bg: '#CFFAFE', color: '#0891B2' },
};

export default function OpsPartners() {
  const { suppliers } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', ...new Set(suppliers.map(s => s.type))];
  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.area.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || s.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalKg = suppliers.reduce((sum, s) => sum + (s.totalDonated || 0), 0);
  const totalMeals = suppliers.reduce((sum, s) => sum + (s.mealsEnabled || 0), 0);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>NGO Partners</h1>
        <p style={{ fontSize: '0.875rem', color: '#9B9B9B', marginTop: '4px' }}>
          {suppliers.length} active partners · {totalKg.toLocaleString()} kg donated total · {totalMeals.toLocaleString()} meals enabled
        </p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '0 0 240px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9B9B9B' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search partners..."
            style={{ width: '100%', height: 36, paddingLeft: 30, paddingRight: 12, border: '1px solid #E5E5E5', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', background: '#FFFFFF', boxSizing: 'border-box' }}
          />
        </div>
        {types.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            style={{
              padding: '5px 12px', borderRadius: '20px', border: `1px solid ${typeFilter === t ? '#FF5C28' : '#E5E5E5'}`,
              background: typeFilter === t ? '#FF5C28' : '#F7F7F8', color: typeFilter === t ? '#FFF' : '#6B6B6B',
              fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>{t}</button>
        ))}
      </div>

      {/* Partner cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {filtered.map(s => {
          const tc = typeColors[s.type] || { bg: '#F7F7F8', color: '#6B6B6B' };
          return (
            <div key={s.id} style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', padding: '18px', border: '1px solid #E5E5E5' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0A0A0A' }}>{s.name}</div>
                <span style={{ background: tc.bg, color: tc.color, fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', flexShrink: 0, marginLeft: '8px' }}>{s.type}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#6B6B6B' }}><MapPin size={12} />{s.area}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#6B6B6B' }}><User size={12} />{s.contact}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#6B6B6B' }}><Phone size={12} />{s.phone}</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', paddingTop: '10px', borderTop: '1px solid #F0F0F0' }}>
                <div><div style={{ fontSize: '1rem', fontWeight: 700, color: '#0A0A0A' }}>{(s.totalDonated || 0).toLocaleString()} kg</div><div style={{ fontSize: '0.75rem', color: '#9B9B9B' }}>Total donated</div></div>
                <div><div style={{ fontSize: '1rem', fontWeight: 700, color: '#0A0A0A' }}>{(s.mealsEnabled || 0).toLocaleString()}</div><div style={{ fontSize: '0.75rem', color: '#9B9B9B' }}>Meals enabled</div></div>
                <div style={{ marginLeft: 'auto' }}><div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FF5C28' }}>Since {s.partnerSince}</div><div style={{ fontSize: '0.75rem', color: '#9B9B9B' }}>Partner</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
