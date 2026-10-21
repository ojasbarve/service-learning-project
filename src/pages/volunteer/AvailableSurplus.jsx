import { useState } from 'react';
import { AlertTriangle, Filter, MapPin, PackageOpen } from 'lucide-react';
import SurplusCard from '../../components/ui/SurplusCard';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

const filterOptions = ['All', 'Cooked meal', 'Bakery', 'Expiring soon'];
const sortOptions = ['Expiring soonest', 'Quantity: high to low'];

export default function AvailableSurplus() {
  const { listings, claimListing, currentUser, loading } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [sort, setSort] = useState('Expiring soonest');
  const [claimingId, setClaimingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const now = new Date();
  const available = listings.filter(l => l.status === 'Available');
  const urgent = available.filter(l => {
    const diff = new Date(l.deadline) - now;
    return diff > 0 && diff < 2 * 60 * 60 * 1000;
  });

  let displayed = [...available];
  if (activeFilter === 'Cooked meal') {
    displayed = displayed.filter(l => ['Mixed Meal', 'Biryani', 'Dal/Curry', 'Full Thali', 'Cooked Rice'].includes(l.foodType));
  } else if (activeFilter === 'Bakery') {
    displayed = displayed.filter(l => ['Bread/Roti', 'Bakery Items'].includes(l.foodType));
  } else if (activeFilter === 'Expiring soon') {
    displayed = displayed.filter(l => {
      const diff = new Date(l.deadline) - now;
      return diff > 0 && diff < 2 * 60 * 60 * 1000;
    });
  }

  displayed.sort((a, b) => sort === 'Expiring soonest'
    ? new Date(a.deadline) - new Date(b.deadline)
    : b.quantity - a.quantity);

  async function handleAccept(listing) {
    const volunteerId = currentUser?.role === 'volunteer' ? currentUser.volunteerId : 'v1';
    setClaimingId(listing.id);
    setActionError('');
    try { await claimListing(listing.id, volunteerId); }
    catch (error) { setActionError(error.message); }
    finally { setClaimingId(null); }
  }

  return (
    <div className="volunteer-queue">
      <header className="queue-header">
        <div>
          <p className="queue-kicker">Volunteer queue</p>
          <h1>Available surplus</h1>
          <p className="queue-intro">Choose a pickup you can complete before the deadline.</p>
        </div>
        <div className="queue-meta">
          <span>{format(now, 'EEEE, MMMM d, yyyy')}</span>
          <span><MapPin size={14} /> Pune</span>
        </div>
      </header>

      {actionError && <div role="alert" className="queue-error">{actionError}</div>}
      {loading && <div className="queue-loading">Refreshing the pickup queue…</div>}

      {urgent.length > 0 && (
        <div className="queue-alert">
          <AlertTriangle size={17} />
          <span><strong>{urgent.length} pickup{urgent.length > 1 ? 's' : ''}</strong> close{urgent.length === 1 ? 's' : ''} in the next two hours.</span>
        </div>
      )}

      <div className="queue-metrics" aria-label="Queue summary">
        <div><span>Available now</span><strong>{available.length}</strong><small>pickups in Pune</small></div>
        <div><span>Needs attention</span><strong>{urgent.length}</strong><small>within two hours</small></div>
        <div><span>Total food</span><strong>{available.reduce((sum, listing) => sum + Number(listing.quantity || 0), 0)} kg</strong><small>ready to rescue</small></div>
      </div>

      <div className="queue-toolbar">
        <div className="queue-filters" role="group" aria-label="Filter surplus">
          <Filter size={15} />
          {filterOptions.map(option => (
            <button key={option} className={activeFilter === option ? 'active' : ''} onClick={() => setActiveFilter(option)}>
              {option}
            </button>
          ))}
        </div>
        <label className="queue-sort">
          <span>Sort</span>
          <select value={sort} onChange={event => setSort(event.target.value)}>
            {sortOptions.map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <div className="queue-summary"><strong>{displayed.length}</strong> pickup{displayed.length === 1 ? '' : 's'} available</div>

      {displayed.length === 0 ? (
        <div className="queue-empty">
          <PackageOpen size={30} />
          <strong>No pickups match this filter</strong>
          <span>Try “All” to see the complete queue.</span>
        </div>
      ) : (
        <div className="surplus-list">{displayed.map(listing => <SurplusCard key={listing.id} listing={listing} onAccept={handleAccept} disabled={claimingId === listing.id} />)}</div>
      )}
    </div>
  );
}
