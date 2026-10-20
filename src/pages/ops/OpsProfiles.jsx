import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Bike,
  MapPin,
  Phone,
  User,
  Search,
  ShieldCheck,
} from 'lucide-react';

const supplierTypeColors = {
  'Restaurant': { bg: '#FEF3C7', color: '#D97706' },
  'College Canteen': { bg: '#D1FAE5', color: '#059669' },
  'IT Park Canteen': { bg: '#DBEAFE', color: '#2563EB' },
  'Hotel Banquet': { bg: '#EDE9FE', color: '#7C3AED' },
  'Bakery': { bg: '#FFEDD5', color: '#EA580C' },
  'Local Dhaba': { bg: '#FEE2E2', color: '#DC2626' },
  'Corporate Cafeteria': { bg: '#CFFAFE', color: '#0891B2' },
};

const volStatusColors = {
  'En Route': { bg: '#EFF6FF', text: '#1D4ED8' },
  'Distributing': { bg: '#FDF4FF', text: '#A21CAF' },
  'Available': { bg: '#ECFDF5', text: '#047857' },
  'Offline': { bg: '#F3F4F6', text: '#6B7280' },
};

export default function OpsProfiles() {
  const navigate = useNavigate();
  const { volunteers, listings, suppliers, getVolunteerRoute } = useApp();
  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers' | 'volunteers'
  const [search, setSearch] = useState('');

  const totalKgAllSuppliers = suppliers.reduce((s, x) => s + (x.totalDonated || 0), 0);
  const activeVolunteersCount = volunteers.filter(v => v.status !== 'Offline').length;

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.area.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase())
  );

  const filteredVolunteers = volunteers.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.zone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{
            background: '#EFF6FF',
            color: '#1D4ED8',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <ShieldCheck size={13} />
            Sevadeep NGO Overseer
          </span>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
          User Profiles & Network Directory
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '4px' }}>
          Platform client overseer view: inspect registered food donor establishments and field volunteers
        </p>
      </div>

      {/* Top Overseer Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A0A0A' }}>{suppliers.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>Verified Food Donors</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FF5C28' }}>{totalKgAllSuppliers.toLocaleString()} kg</div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>Lifetime Rescued Food</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0070F3' }}>{volunteers.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>Registered Field Drivers</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#059669' }}>{activeVolunteersCount} Active</div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>Volunteers on Duty</div>
        </div>
      </div>

      {/* Tab Switcher & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: '#F3F4F6', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('suppliers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'suppliers' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'suppliers' ? '#0A0A0A' : '#6B7280',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'suppliers' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              fontFamily: 'inherit',
            }}
          >
            <Building2 size={15} />
            Food Suppliers ({suppliers.length})
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'volunteers' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'volunteers' ? '#0A0A0A' : '#6B7280',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'volunteers' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              fontFamily: 'inherit',
            }}
          >
            <Bike size={15} />
            Field Volunteers ({volunteers.length})
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 260 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            style={{
              width: '100%',
              height: 36,
              paddingLeft: 32,
              paddingRight: 12,
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontFamily: 'inherit',
              background: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* TAB CONTENT 1: SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          {filteredSuppliers.map(s => {
            const tc = supplierTypeColors[s.type] || { bg: '#F3F4F6', color: '#4B5563' };
            const supplierListings = listings.filter(l => l.supplierId === s.id);
            const activeCount = supplierListings.filter(l => l.status === 'Available' || l.status === 'Assigned').length;

            return (
              <div
                key={s.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111827' }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>
                      Partner Since: {s.partnerSince || '2025'}
                    </div>
                  </div>
                  <span style={{
                    background: tc.bg,
                    color: tc.color,
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}>
                    {s.type}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem', color: '#4B5563', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} style={{ color: '#9CA3AF' }} />
                    <span>{s.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} style={{ color: '#9CA3AF' }} />
                    <span>Contact: {s.contact}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={13} style={{ color: '#9CA3AF' }} />
                    <span>{s.phone}</span>
                  </div>
                </div>

                {/* Impact Metrics */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '14px',
                  borderTop: '1px solid #F3F4F6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                      {(s.totalDonated || 0).toLocaleString()} kg
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginLeft: '4px' }}>donated</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#FF5C28' }}>
                      {(s.mealsEnabled || 0).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginLeft: '4px' }}>meals</span>
                  </div>
                  <div>
                    <span style={{
                      background: activeCount > 0 ? '#ECFDF5' : '#F3F4F6',
                      color: activeCount > 0 ? '#047857' : '#6B7280',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '12px',
                    }}>
                      {activeCount} active batch{activeCount !== 1 ? 'es' : ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT 2: VOLUNTEERS */}
      {activeTab === 'volunteers' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          {filteredVolunteers.map(v => {
            const sc = volStatusColors[v.status] || volStatusColors['Available'];
            const vStops = getVolunteerRoute(v.id);

            return (
              <div
                key={v.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}>
                      🚴
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111827' }}>
                        {v.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {v.zone} Sector · Joined {v.joinedDate || '2025'}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    background: sc.bg,
                    color: sc.text,
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    padding: '3px 9px',
                    borderRadius: '12px',
                  }}>
                    {v.status}
                  </span>
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem', color: '#4B5563', marginBottom: '16px' }}>
                  <div>Vehicle: <strong>{v.vehicleType}</strong> ({v.vehicleNumber})</div>
                  <div>Phone: <strong>{v.phone}</strong></div>
                  <div>Last System Update: <span style={{ color: '#9CA3AF' }}>{v.lastUpdate}</span></div>
                </div>

                {/* Route & Deliveries Footer */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '14px',
                  borderTop: '1px solid #F3F4F6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
                      {v.totalDeliveries || 0}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Total Deliveries</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}>
                      {v.completedToday || 0}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Today Completed</div>
                  </div>
                  <div>
                    <button
                      onClick={() => navigate('/ops/routes')}
                      style={{
                        background: '#EFF6FF',
                        color: '#1D4ED8',
                        border: '1px solid #BFDBFE',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontFamily: 'inherit',
                      }}
                    >
                      Inspect Route ({vStops.length} stops) →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const kpiCardStyle = {
  background: '#FFFFFF',
  borderRadius: '10px',
  border: '1px solid #E5E7EB',
  padding: '16px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
};
