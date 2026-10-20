import { MapPin, Clock, Package } from 'lucide-react';
import Badge from './Badge';

function TimeLeft({ deadline }) {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end - now;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMs <= 0) return <span style={{ color: '#E53E3E', fontWeight: 500, fontSize: '0.875rem' }}>Expired</span>;

  const hrs = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  const isUrgent = diffMin < 120;

  const label = hrs > 0 ? `${hrs}h ${mins}m left` : `${mins}m left`;

  return (
    <span
      style={{
        color: isUrgent ? '#F59E0B' : '#00A67E',
        fontWeight: 600,
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <Clock size={14} />
      {label}
    </span>
  );
}

export default function SurplusCard({ listing, onAccept, disabled = false }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`;

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid transparent',
        transition: 'box-shadow 150ms ease, border-color 150ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.07)';
        e.currentTarget.style.borderColor = '#E5E5E5';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '1rem', color: '#0A0A0A' }}>
            {listing.supplierName}
          </div>
          <div style={{ marginTop: '4px' }}>
            <Badge variant={listing.supplierType} />
          </div>
        </div>
        <TimeLeft deadline={listing.deadline} />
      </div>

      {/* Food info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Package size={16} style={{ color: '#9B9B9B', flexShrink: 0 }} />
        <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0A0A0A' }}>
          {listing.foodType}
        </span>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#FF5C28',
          background: '#FFF0EB',
          borderRadius: '6px',
          padding: '2px 8px',
        }}>
          {listing.quantity} kg
        </span>
      </div>

      {/* Address */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={14} style={{ color: '#9B9B9B', flexShrink: 0 }} />
        <span style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>{listing.address}</span>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: 'auto',
            color: '#0070F3',
            fontSize: '0.75rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            flexShrink: 0,
          }}
        >
          <MapPin size={12} />
          Maps
        </a>
      </div>

      {/* Notes */}
      {listing.notes && (
        <div style={{
          fontSize: '0.75rem',
          color: '#9B9B9B',
          background: '#F7F7F8',
          borderRadius: '6px',
          padding: '8px 10px',
          lineHeight: 1.5,
        }}>
          {listing.notes}
        </div>
      )}

      {/* Action */}
      <button
        onClick={() => onAccept && onAccept(listing)}
        disabled={disabled}
        style={{
          background: '#FF5C28',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 16px',
          fontWeight: 600,
          fontSize: '0.875rem',
          cursor: disabled ? 'wait' : 'pointer',
          opacity: disabled ? 0.7 : 1,
          transition: 'background 150ms ease',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = '#E84E1D'; }}
        onMouseLeave={e => e.currentTarget.style.background = '#FF5C28'}
      >
        {disabled ? 'Claiming…' : 'Accept Pickup'}
      </button>
    </div>
  );
}
