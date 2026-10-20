import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import 'leaflet/dist/leaflet.css';

const TYPE_COLORS = {
  'IT Park Canteen': '#3B82F6',
  'Wedding Hall': '#8B5CF6',
  'Hotel Restaurant': '#F59E0B',
  'College Canteen': '#10B981',
  'Local Dhaba': '#EF4444',
  'Corporate Cafeteria': '#06B6D4',
  'Bakery': '#F97316',
};

export default function OpsSupplyMap() {
  const { suppliers } = useApp();
  const [activeType, setActiveType] = useState('All');

  const networkPartners = suppliers.map(s => ({ ...s, active: true }));
  const allTypes = [...new Set(networkPartners.map(p => p.type))];
  const filtered = activeType === 'All'
    ? networkPartners
    : networkPartners.filter(p => p.type === activeType);

  const totalCount = networkPartners.length;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>Supply Network Map</h1>
        <p style={{ fontSize: '0.9rem', color: '#9B9B9B', marginTop: '4px' }}>{totalCount} network partners across Pune</p>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px', alignItems: 'center' }}>
        <Filter size={14} color="#9B9B9B" />
        {['All', ...allTypes].map(type => {
          const count = type === 'All'
            ? networkPartners.length
            : networkPartners.filter(p => p.type === type).length;
          const isActive = activeType === type;
          const dotColor = TYPE_COLORS[type];
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '20px',
                border: `1px solid ${isActive ? '#FF5C28' : '#E5E5E5'}`,
                background: isActive ? '#FF5C28' : '#F7F7F8',
                color: isActive ? '#FFF' : '#6B6B6B',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {type !== 'All' && (
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: isActive ? 'rgba(255,255,255,0.8)' : dotColor, flexShrink: 0 }} />
              )}
              {type} ({count})
            </button>
          );
        })}
      </div>

      {/* Map + Legend wrapper */}
      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <MapContainer
          center={[18.5204, 73.8567]}
          zoom={12}
          style={{ height: 'calc(100vh - 200px)', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map(p => (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={8}
              pathOptions={{
                fillColor: TYPE_COLORS[p.type] || '#9B9B9B',
                color: 'white',
                weight: 1.5,
                fillOpacity: p.active ? 0.85 : 0.35,
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'inherit', minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0A0A0A', marginBottom: '4px' }}>{p.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6B6B6B', marginBottom: '2px' }}>{p.type}</div>
                  <div style={{ fontSize: '0.8rem', color: '#9B9B9B', marginBottom: '8px' }}>{p.area}</div>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: p.active ? '#ECFDF5' : '#F7F7F8',
                    color: p.active ? '#10B981' : '#9B9B9B',
                  }}>
                    {p.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Floating legend */}
        <div style={{
          position: 'absolute',
          bottom: 20,
          right: 10,
          zIndex: 999,
          background: '#FFFFFF',
          borderRadius: '8px',
          padding: '12px 14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          minWidth: 160,
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Partner Types</div>
          {allTypes.map(type => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: TYPE_COLORS[type], flexShrink: 0 }} />
              <span style={{ fontSize: '0.775rem', color: '#6B6B6B' }}>{type}</span>
            </div>
          ))}
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#9B9B9B', opacity: 0.4, flexShrink: 0 }} />
            <span style={{ fontSize: '0.775rem', color: '#9B9B9B' }}>Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
}
