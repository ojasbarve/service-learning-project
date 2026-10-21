import { MapPin, Clock, Package } from 'lucide-react';
import Badge from './Badge';

function TimeLeft({ deadline }) {
  const diffMs = new Date(deadline) - new Date();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMs <= 0) return <span className="surplus-time surplus-time-expired">Expired</span>;

  const hrs = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  const label = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  const tone = diffMin < 120 ? 'surplus-time-urgent' : 'surplus-time-safe';

  return <span className={`surplus-time ${tone}`}><Clock size={14} /> {label} left</span>;
}

export default function SurplusCard({ listing, onAccept, disabled = false }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`;

  return (
    <article className="surplus-row">
      <div className="surplus-row-supplier">
        <span className="surplus-row-label">Donor</span>
        <strong>{listing.supplierName}</strong>
        <Badge variant={listing.supplierType} />
      </div>

      <div className="surplus-row-food">
        <span className="surplus-row-label">Available</span>
        <strong><Package size={16} /> {listing.foodType}</strong>
        <span className="surplus-quantity">{listing.quantity} kg</span>
      </div>

      <div className="surplus-row-location">
        <span className="surplus-row-label">Pickup point</span>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin size={14} /> {listing.address}
        </a>
        {listing.notes && <span className="surplus-row-note">{listing.notes}</span>}
      </div>

      <div className="surplus-row-deadline">
        <span className="surplus-row-label">Deadline</span>
        <TimeLeft deadline={listing.deadline} />
      </div>

      <button className="surplus-accept" onClick={() => onAccept?.(listing)} disabled={disabled}>
        {disabled ? 'Claiming…' : 'Accept pickup'}
      </button>
    </article>
  );
}
