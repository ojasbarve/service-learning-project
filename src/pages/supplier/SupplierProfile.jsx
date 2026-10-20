import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { format } from 'date-fns';
import { MapPin, Phone, User, Award, Calendar } from 'lucide-react';

export default function SupplierProfile() {
  const { currentUser, listings, suppliers } = useApp();
  const [selectedSupplierId, setSelectedSupplierId] = useState(
    currentUser?.supplierId || suppliers[0].id
  );

  const isOps = currentUser?.role === 'ops';
  const isSupplier = currentUser?.role === 'supplier';

  if (!isOps && !isSupplier) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center', padding: '48px', background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🏪</div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '8px' }}>Supplier Profile View</h2>
        <p style={{ color: '#9B9B9B', fontSize: '0.9rem' }}>You are logged in as a Volunteer. Switch to a <strong>Supplier</strong> or <strong>Sevadeep Ops</strong> in the sidebar to inspect supplier profiles.</p>
      </div>
    );
  }

  const activeSupplierId = isSupplier ? currentUser.supplierId : selectedSupplierId;
  const supplier = suppliers.find(s => s.id === activeSupplierId) || suppliers[0];

  const myListings = listings.filter(l => l.supplierId === supplier.id);
  const recentListings = [...myListings].sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt)).slice(0, 6);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            {isOps ? `Supplier Profile: ${supplier.name}` : 'My Profile'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#9B9B9B', marginTop: '4px' }}>
            {isOps ? 'Sevadeep NGO Overseer View — verified food donor partner record' : 'Your supplier account and impact summary'}
          </p>
        </div>

        {isOps && (
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E40AF' }}>
              Inspect Supplier:
            </span>
            <select
              value={selectedSupplierId}
              onChange={e => setSelectedSupplierId(e.target.value)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #93C5FD',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#1E3A8A',
                cursor: 'pointer',
              }}
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.area})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Profile header card */}
      <div style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', padding: '24px', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <div style={{ width: 64, height: 64, borderRadius: '12px', background: '#FFF0EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>
          {currentUser.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A0A0A' }}>{supplier.name}</h2>
            <span style={{ background: '#FFF0EB', color: '#FF5C28', fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px' }}>{supplier.type}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#6B6B6B', fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} />{supplier.address}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14} />{supplier.contact}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={14} />{supplier.phone}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} />Partner since {supplier.partnerSince}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', color: '#10B981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
          <Award size={14} />
          Active Partner
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <StatCard number={`${supplier.totalDonated} kg`} label="Total Food Donated" sub="All time" />
        <StatCard number={supplier.mealsEnabled.toLocaleString()} label="Meals Enabled" sub="Est. 350g per meal" />
        <StatCard number={supplier.partnerSince} label="Partner Since" sub={`${myListings.length} total submissions`} />
      </div>

      {/* Recent activity */}
      <div style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E5E5E5' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A' }}>Recent Submissions</h2>
        </div>
        {recentListings.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9B9B9B' }}>No submissions yet. Start by logging surplus food.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F7F7F8' }}>
                {['Food Type', 'Qty', 'Date', 'Status', 'Volunteer'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentListings.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < recentListings.length - 1 ? '1px solid #E5E5E5' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F7F7F8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 500, fontSize: '0.875rem' }}>{l.foodType}</td>
                  <td style={{ padding: '12px 16px', color: '#6B6B6B', fontSize: '0.875rem' }}>{l.quantity} kg</td>
                  <td style={{ padding: '12px 16px', color: '#9B9B9B', fontSize: '0.8125rem' }}>{format(new Date(l.listedAt), 'MMM d, h:mm a')}</td>
                  <td style={{ padding: '12px 16px' }}><Badge variant={l.status} /></td>
                  <td style={{ padding: '12px 16px', color: '#6B6B6B', fontSize: '0.875rem' }}>{l.volunteerAssigned ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
