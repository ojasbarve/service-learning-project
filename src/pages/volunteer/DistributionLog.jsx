import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge';
import { format } from 'date-fns';
import { CheckCircle, ClipboardList, Package, TrendingUp } from 'lucide-react';

import { useState } from 'react';

export default function DistributionLog() {
  const { currentUser, listings, volunteers } = useApp();
  const [selectedVolId, setSelectedVolId] = useState(
    currentUser?.volunteerId || volunteers[0]?.id || ''
  );

  const isOps = currentUser?.role === 'ops';
  const isVolunteer = currentUser?.role === 'volunteer';

  if (!isOps && !isVolunteer) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center', padding: '48px', background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <ClipboardList size={38} style={{ marginBottom: 16, color: '#f15b35' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '8px' }}>Distribution Log View</h2>
        <p style={{ color: '#9B9B9B', fontSize: '0.9rem' }}>You are logged in as a Supplier. Switch to a <strong>Volunteer</strong> or <strong>Sevadeep Ops</strong> in the sidebar to inspect delivery logs.</p>
      </div>
    );
  }

  const activeVolId = isVolunteer ? currentUser.volunteerId : selectedVolId;
  const volunteer = volunteers.find(v => v.id === activeVolId) || volunteers[0] || {
    id: activeVolId, name: 'No volunteer selected', shortName: '', completedToday: 0, totalDeliveries: 0,
  };

  const completed = listings.filter(l =>
    (l.status === 'Distributed' || l.status === 'Picked Up') &&
    (l.volunteerAssigned === volunteer.shortName || l.volunteerAssigned === volunteer.name)
  );
  const totalKg = completed.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            {isOps ? `Distribution Log: ${volunteer.name}` : 'Distribution Log'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#9B9B9B', marginTop: '4px' }}>
            {isOps ? 'Sevadeep NGO Overseer View — verified delivery records for this volunteer' : 'Your completed pickups and deliveries'}
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
              Inspect Volunteer:
            </span>
            <select
              value={selectedVolId}
              onChange={e => setSelectedVolId(e.target.value)}
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
              {volunteers.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.zone})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {[
          { icon: <CheckCircle size={20} color="#10B981" />, number: volunteer.completedToday, label: 'Completed Today' },
          { icon: <TrendingUp size={20} color="#3B82F6" />, number: volunteer.totalDeliveries, label: 'Total Deliveries' },
          { icon: <Package size={20} color="#FF5C28" />, number: `${totalKg} kg`, label: 'Total kg Rescued' },
        ].map(card => (
          <div key={card.label} style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', padding: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A0A0A' }}>{card.number}</div>
              <div style={{ fontSize: '0.8125rem', color: '#9B9B9B', fontWeight: 500 }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E5E5E5' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A' }}>Delivery History</h2>
        </div>
        {completed.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#9B9B9B' }}>
            <ClipboardList size={32} style={{ marginBottom: 12, color: '#f15b35' }} />
            <div style={{ fontWeight: 600, color: '#6B6B6B', marginBottom: '6px' }}>No completed deliveries yet</div>
            <div style={{ fontSize: '0.875rem' }}>Accept a pickup from Available Surplus to get started</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F7F7F8' }}>
                {['Food Type', 'Supplier', 'Area', 'Qty (kg)', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...completed].sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt)).map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < completed.length - 1 ? '1px solid #E5E5E5' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F7F7F8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 500, fontSize: '0.875rem' }}>{l.foodType}</td>
                  <td style={{ padding: '12px 16px', color: '#6B6B6B', fontSize: '0.875rem' }}>{l.supplierName}</td>
                  <td style={{ padding: '12px 16px', color: '#9B9B9B', fontSize: '0.8125rem' }}>{l.supplierArea}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0A0A0A', fontSize: '0.875rem' }}>{l.quantity}</td>
                  <td style={{ padding: '12px 16px', color: '#9B9B9B', fontSize: '0.8125rem' }}>{format(new Date(l.listedAt), 'MMM d, h:mm a')}</td>
                  <td style={{ padding: '12px 16px' }}><Badge variant={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
