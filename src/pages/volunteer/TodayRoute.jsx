import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';
import RouteTimeline from '../../components/ui/RouteTimeline';
import { useApp } from '../../context/AppContext';

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makeStopIcon(type, category = '') {
  const isPickup = type === 'pickup';
  const isHospital = (category || '').toLowerCase().includes('hospital');

  let bg = '#00A67E'; // green for pickup
  let marker = 'P';

  if (!isPickup) {
    if (isHospital) {
      bg = '#0284C7'; // sky blue for hospital
      marker = 'H';
    } else {
      bg = '#EA580C'; // amber-orange for shelter/camp
      marker = 'S';
    }
  }

  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:${bg};border:3px solid #fff;
      box-shadow:0 3px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
      font-size:11px;line-height:1;font-weight:800;color:#fff;
    ">${marker}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const puneCenter = [18.5204, 73.8567];

export default function TodayRoute() {
  const { currentUser, getVolunteerRoute, volunteers: liveVolunteers } = useApp();

  // If volunteer is logged in, show their route; if ops, allow selecting any volunteer
  const defaultVolId =
    currentUser?.role === 'volunteer' && currentUser.volunteerId
      ? currentUser.volunteerId
      : 'v1';

  const [selectedVolId, setSelectedVolId] = useState(defaultVolId);

  const activeVol = liveVolunteers.find(v => v.id === selectedVolId) || liveVolunteers[0] || {
    id: selectedVolId, name: 'No volunteer selected', zone: 'Pune', status: 'Offline', vehicleType: 'Vehicle', vehicleNumber: '—',
  };
  const stops = getVolunteerRoute(selectedVolId);

  const pickupCount = stops.filter(s => s.type === 'pickup').length;
  const dropCount = stops.filter(s => s.type === 'drop').length;
  const routePositions = stops.map(s => [s.lat, s.lng]);

  // Google Maps needs the route split into origin, waypoints, and destination.
  // Encoding the whole stop list as one path makes Maps treat it as one place.
  const googleMapsUrl = stops.length > 0
    ? (() => {
        const location = stop => `${Number(stop.lat)},${Number(stop.lng)}`;
        const origin = location(stops[0]);
        const destination = location(stops[stops.length - 1]);
        const waypoints = stops.slice(1, -1).map(location).join('|');
        const params = new URLSearchParams({
          api: '1',
          origin,
          destination,
          travelmode: 'driving',
        });
        if (waypoints) params.set('waypoints', waypoints);
        return `https://www.google.com/maps/dir/?${params.toString()}`;
      })()
    : 'https://www.google.com/maps';

  return (
    <div className="operations-page volunteer-route-page" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            Today's Route: {activeVol.name}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#9B9B9B', marginTop: '4px' }}>
            {activeVol.zone} Zone · {activeVol.vehicleType || 'Vehicle'} ({activeVol.vehicleNumber || 'Registered'}) · Status: <span style={{ fontWeight: 600, color: '#0070F3' }}>{activeVol.status}</span>
          </p>
        </div>

        {/* Volunteer Selector (Visible to Ops or anyone wishing to preview different routes) */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E5E5E5',
          borderRadius: '10px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B6B6B' }}>
            Select Volunteer Route:
          </span>
          <select
            value={selectedVolId}
            onChange={e => setSelectedVolId(e.target.value)}
            style={{
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#0A0A0A',
              background: '#F9FAFB',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {liveVolunteers.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.zone} — {v.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="route-layout" style={{
        display: 'grid',
        gridTemplateColumns: '2fr 3fr',
        gap: '20px',
        alignItems: 'start',
      }}>
        {/* Left sidebar — Timeline & Summary */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          padding: '24px',
        }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0A0A0A' }}>
                Sequential Stop Timeline
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9B9B9B', marginTop: '2px' }}>
                {pickupCount} Pickup{pickupCount !== 1 ? 's' : ''} / {dropCount} Delivery Drop{dropCount !== 1 ? 's' : ''}
              </div>
            </div>
            <span style={{
              background: activeVol.status === 'En Route' ? '#EFF6FF' : '#ECFDF5',
              color: activeVol.status === 'En Route' ? '#1D4ED8' : '#047857',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}>
              {activeVol.status}
            </span>
          </div>

          {stops.length === 0 ? (
            <div style={{ padding: '40px 10px', textAlign: 'center', color: '#9B9B9B', fontSize: '0.875rem' }}>
              No stops scheduled right now. Accept listings from Available Surplus to build your route.
            </div>
          ) : (
            <RouteTimeline stops={stops} />
          )}

          {/* Summary Box */}
          <div style={{
            marginTop: '20px',
            padding: '14px',
            background: '#F7F7F8',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-around',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#0A0A0A' }}>{stops.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#9B9B9B' }}>total stops</div>
            </div>
            <div style={{ width: 1, background: '#E5E5E5' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#FF5C28' }}>{pickupCount} / {dropCount}</div>
              <div style={{ fontSize: '0.75rem', color: '#9B9B9B' }}>pickups / drops</div>
            </div>
            <div style={{ width: 1, background: '#E5E5E5' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#0A0A0A' }}>
                {stops.length > 0 ? `${stops.length * 25}m` : '0m'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9B9B9B' }}>est. transit</div>
            </div>
          </div>

          {/* Detailed Legend */}
          <div style={{
            marginTop: '20px',
            padding: '14px',
            background: '#F9FAFB',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '0.75rem',
          }}>
            <div style={{ fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontSize: '0.675rem' }}>
              Route Legend & Marker Types
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="map-legend-letter" style={{ background: '#00A67E' }}>P</span>
                <span style={{ fontWeight: 600, color: '#065F46' }}>Pickup Spot:</span>
                <span style={{ color: '#6B7280' }}>Hotels, Cafeterias, College Canteens, Bakeries</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="map-legend-letter" style={{ background: '#0284C7' }}>H</span>
                <span style={{ fontWeight: 600, color: '#0369A1' }}>Delivery Spot (Hospital):</span>
                <span style={{ color: '#6B7280' }}>Sassoon Hospital, KEM, Bharati, Sancheti</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="map-legend-letter" style={{ background: '#EA580C' }}>S</span>
                <span style={{ fontWeight: 600, color: '#C2410C' }}>Delivery Spot (Shelter):</span>
                <span style={{ color: '#6B7280' }}>Ekta Nagar, Yerwada Colony, Migrant Sites</span>
              </div>
            </div>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '20px',
              background: '#FF5C28',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '10px',
              padding: '11px',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E84E1D'}
            onMouseLeave={e => e.currentTarget.style.background = '#FF5C28'}
          >
            <Navigation size={16} />
            Start Turn-by-Turn GPS
          </a>
        </div>

        {/* Right — Interactive Map */}
        <div style={{
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          height: 600,
          position: 'relative',
        }}>
          <MapContainer
            center={stops.length > 0 ? [stops[0].lat, stops[0].lng] : puneCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Route polyline */}
            {routePositions.length > 1 && (
              <Polyline
                positions={routePositions}
                pathOptions={{ color: '#0070F3', weight: 3, dashArray: '6 6', opacity: 0.8 }}
              />
            )}

            {/* Markers */}
            {stops.map((stop, idx) => {
              const isPickup = stop.type === 'pickup';
              const isHospital = (stop.category || '').toLowerCase().includes('hospital');

              return (
                <Marker
                  key={stop.id}
                  position={[stop.lat, stop.lng]}
                  icon={makeStopIcon(stop.type, stop.category)}
                >
                  <Popup>
                    <div style={{ fontFamily: 'inherit', minWidth: 180 }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginBottom: '6px',
                        background: isPickup ? '#ECFDF5' : isHospital ? '#E0F2FE' : '#FFEDD5',
                        color: isPickup ? '#047857' : isHospital ? '#0369A1' : '#C2410C',
                      }}>
                        {isPickup ? 'PICKUP SPOT' : isHospital ? 'HOSPITAL DELIVERY' : 'SHELTER DELIVERY'}
                        <span>· Stop #{idx + 1}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0A0A0A' }}>
                        {stop.name}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '2px' }}>
                        {stop.address || stop.area}
                      </div>
                      <div style={{
                        marginTop: '6px',
                        paddingTop: '6px',
                        borderTop: '1px solid #F3F4F6',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        color: isPickup ? '#00A67E' : '#FF5C28',
                      }}>
                        {stop.detail}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Floating On-Map Mini Legend */}
          <div style={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            zIndex: 999,
            background: 'rgba(255, 255, 255, 0.96)',
            borderRadius: '8px',
            padding: '10px 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '0.75rem',
            lineHeight: 1.4,
          }}>
            <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.7rem', marginBottom: '4px', textTransform: 'uppercase' }}>
              Map Stop Types
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
              <span className="map-legend-letter" style={{ background: '#00A67E' }}>P</span>
              <span>Pickup (Hotels & Cafeterias)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
              <span className="map-legend-letter" style={{ background: '#0284C7' }}>H</span>
              <span>Delivery: Public Hospitals</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
              <span className="map-legend-letter" style={{ background: '#EA580C' }}>S</span>
              <span>Delivery: Shelters & Camps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
