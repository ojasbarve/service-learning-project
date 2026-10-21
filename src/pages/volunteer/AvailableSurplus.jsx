import { useState } from 'react';
import { AlertTriangle, MapPin, Filter, PackageOpen } from 'lucide-react';
import SurplusCard from '../../components/ui/SurplusCard';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

const filterOptions = ['All', 'Cooked Meal', 'Bakery', 'Expiring Soon'];
const sortOptions = ['Expiring Soonest', 'Quantity (High→Low)'];

export default function AvailableSurplus() {
  const { listings, claimListing, currentUser, loading } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [sort, setSort] = useState('Expiring Soonest');
  const [claimingId, setClaimingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const now = new Date();
  const available = listings.filter(l => l.status === 'Available');
  const urgent = available.filter(l => {
    const diff = new Date(l.deadline) - now;
    return diff > 0 && diff < 2 * 60 * 60 * 1000;
  });

  let displayed = [...available];

  if (activeFilter === 'Cooked Meal') {
    displayed = displayed.filter(l => ['Mixed Meal', 'Biryani', 'Dal/Curry', 'Full Thali', 'Cooked Rice'].includes(l.foodType));
  } else if (activeFilter === 'Bakery') {
    displayed = displayed.filter(l => l.foodType === 'Bread/Roti' || l.foodType === 'Bakery Items');
  } else if (activeFilter === 'Expiring Soon') {
    displayed = displayed.filter(l => {
      const diff = new Date(l.deadline) - now;
      return diff > 0 && diff < 2 * 60 * 60 * 1000;
    });
  }

  if (sort === 'Expiring Soonest') {
    displayed = [...displayed].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  } else {
    displayed = [...displayed].sort((a, b) => b.quantity - a.quantity);
  }

  async function handleAccept(listing) {
    // If logged in as volunteer, use their ID; else use v1 as default
    const volId = currentUser?.role === 'volunteer' ? currentUser.volunteerId : 'v1';
    setClaimingId(listing.id); setActionError('');
    try { await claimListing(listing.id, volId); }
    catch (error) { setActionError(error.message); }
    finally { setClaimingId(null); }
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {actionError && <div role="alert" style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 12, background: '#fff4f1', color: '#a43b22', fontSize: '.85rem', fontWeight: 600 }}>{actionError}</div>}
      {loading && <div style={{ marginBottom: 16, color: '#747985', fontSize: '.85rem' }}>Refreshing live listings…</div>}
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', flex: 1 }}>
          Available Surplus
        </h1>
        <div style={{ background: '#F7F7F8', border: '1px solid #E5E5E5', borderRadius: '20px', padding: '5px 12px', fontSize: '0.8125rem', color: '#6B6B6B', fontWeight: 500 }}>
          {format(now, 'EEEE, MMMM d, yyyy')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F7F7F8', border: '1px solid #E5E5E5', borderRadius: '20px', padding: '5px 12px', fontSize: '0.8125rem', color: '#6B6B6B', fontWeight: 500 }}>
          <MapPin size={13} />
          Pune
        </div>
      </div>

      {/* Urgent strip */}
      {urgent.length > 0 && (
        <div style={{ background: '#FFFBEB', border: '1px solid #F59E0B', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#92400E', fontWeight: 500, fontSize: '0.9rem' }}>
          <AlertTriangle size={18} style={{ color: '#F59E0B', flexShrink: 0 }} />
          <span><strong>{urgent.length} listing{urgent.length > 1 ? 's' : ''}</strong> expire{urgent.length === 1 ? 's' : ''} in under 2 hours — act now to avoid food waste</span>
        </div>
      )}

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Filter size={15} style={{ color: '#9B9B9B' }} />
        {filterOptions.map(opt => (
          <button key={opt} onClick={() => setActiveFilter(opt)}
            style={{
              background: activeFilter === opt ? '#FF5C28' : '#F7F7F8',
              color: activeFilter === opt ? '#FFFFFF' : '#6B6B6B',
              border: `1px solid ${activeFilter === opt ? '#FF5C28' : '#E5E5E5'}`,
              borderRadius: '20px', padding: '5px 14px',
              fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
              transition: 'all 150ms ease', fontFamily: 'inherit',
            }}
          >{opt}</button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ height: 34, border: '1px solid #E5E5E5', borderRadius: '8px', padding: '0 10px', fontSize: '0.8125rem', color: '#6B6B6B', background: '#FFFFFF', cursor: 'pointer', fontFamily: 'inherit' }}>
            {sortOptions.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Cards grid */}
      {displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: '#9B9B9B', background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <PackageOpen size={34} style={{ marginBottom: 12, color: '#f15b35' }} />
          <div style={{ fontWeight: 600, color: '#6B6B6B', marginBottom: '6px' }}>No listings match this filter</div>
          <div style={{ fontSize: '0.875rem' }}>Try switching to "All" to see everything available</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {displayed.map(l => (
            <SurplusCard key={l.id} listing={l} onAccept={handleAccept} disabled={claimingId === l.id} />
          ))}
        </div>
      )}
    </div>
  );
}
