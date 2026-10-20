import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge';
import { format } from 'date-fns';

export default function SurplusHistory() {
  const { listings, currentUser } = useApp();
  const visibleListings = currentUser?.role === 'supplier'
    ? listings.filter(listing => listing.supplierId === currentUser.supplierId)
    : listings;
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
          My History
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#9B9B9B', marginTop: '4px' }}>
          All your surplus listings from the past 30 days
        </p>
      </div>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        overflowX: 'auto',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F7F8' }}>
              {['Food Type', 'Qty', 'Date', 'Status', 'Volunteer', 'Notes'].map(h => (
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
            {visibleListings.map((l, i) => (
              <tr
                key={l.id}
                style={{ borderBottom: i < visibleListings.length - 1 ? '1px solid #E5E5E5' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F7F7F8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{l.foodType}</td>
                <td style={{ padding: '12px 16px', color: '#6B6B6B' }}>{l.quantity} kg</td>
                <td style={{ padding: '12px 16px', color: '#9B9B9B', fontSize: '0.8125rem' }}>
                  {format(new Date(l.listedAt), 'MMM d, h:mm a')}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge variant={l.status} />
                </td>
                <td style={{ padding: '12px 16px', color: '#6B6B6B', fontSize: '0.875rem' }}>
                  {l.volunteerAssigned ?? '—'}
                </td>
                <td style={{ padding: '12px 16px', color: '#9B9B9B', fontSize: '0.8125rem', maxWidth: 200 }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {l.notes || '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
