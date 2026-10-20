import { Truck, MapPin } from 'lucide-react';

export default function RouteTimeline({ stops }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {stops.map((stop, i) => {
        const isPickup = stop.type === 'pickup';
        const isLast = i === stops.length - 1;
        return (
          <div key={stop.id} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            {/* Timeline line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: isPickup ? '#E6F7F3' : '#FFF0EB',
                border: `2px solid ${isPickup ? '#00A67E' : '#FF5C28'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isPickup ? '#00A67E' : '#FF5C28',
                flexShrink: 0,
                zIndex: 1,
              }}>
                {i + 1}
              </div>
              {!isLast && (
                <div style={{
                  width: 2,
                  flex: 1,
                  minHeight: 24,
                  background: '#E5E5E5',
                  margin: '2px 0',
                }} />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: isLast ? 0 : 16, paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isPickup
                  ? <Truck size={13} style={{ color: '#00A67E' }} />
                  : <MapPin size={13} style={{ color: '#FF5C28' }} />
                }
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: isPickup ? '#00A67E' : '#FF5C28',
                }}>
                  {isPickup ? 'Pickup' : 'Drop'}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0A0A0A', marginTop: 2 }}>
                {stop.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9B9B9B' }}>
                {stop.area} · {stop.detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
