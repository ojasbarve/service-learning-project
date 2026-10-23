import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import RouteTimeline from '../../components/ui/RouteTimeline';
import { useApp } from '../../context/AppContext';

function makeStopIcon(type, category = '') {
  const isPickup = type === 'pickup';
  const isHospital = (category || '').toLowerCase().includes('hospital');

  let bg = '#00A67E';
  let marker = 'P';

  if (!isPickup) {
    if (isHospital) {
      bg = '#0284C7';
      marker = 'H';
    } else {
      bg = '#EA580C';
      marker = 'S';
    }
  }

  return L.divIcon({
    className: '',
    html: `<div style="
      width:30px;height:30px;border-radius:50%;
      background:${bg};border:3px solid #fff;
      box-shadow:0 3px 6px rgba(0,0,0,0.25);
      display:flex;align-items:center;justify-content:center;
      font-size:11px;line-height:1;font-weight:800;color:#fff;
    ">${marker}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

const puneCenter = [18.5204, 73.8567];

const statusBadgeColors = {
  'En Route': { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  'Distributing': { bg: '#FDF4FF', text: '#A21CAF', border: '#F5D0FE' },
  'Available': { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  'Offline': { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' },
};

export default function OpsVolunteerRoutes() {
  const { volunteers, getVolunteerRoute } = useApp();
  const [selectedVolId, setSelectedVolId] = useState('v1');

  const selectedVol = volunteers.find(v => v.id === selectedVolId) || volunteers[0] || {
    id: selectedVolId, name: 'No volunteer selected', zone: 'Pune', status: 'Offline', vehicleType: 'Vehicle', vehicleNumber: '—', phone: '—',
  };
  const stops = getVolunteerRoute(selectedVolId);

  const pickupCount = stops.filter(s => s.type === 'pickup').length;
  const dropCount = stops.filter(s => s.type === 'drop').length;
  const routePositions = stops.map(s => [s.lat, s.lng]);
  const googleMapsUrl = stops.length > 0
    ? (() => {
        const location = stop => `${Number(stop.lat)},${Number(stop.lng)}`;
        const params = new URLSearchParams({
          api: '1',
          origin: location(stops[0]),
          destination: location(stops[stops.length - 1]),
          travelmode: 'driving',
        });
        const waypoints = stops.slice(1, -1).map(location).join('|');
        if (waypoints) params.set('waypoints', waypoints);
        return `https://www.google.com/maps/dir/?${params.toString()}`;
      })()
    : 'https://www.google.com/maps';

  return (
    <div className="operations-page ops-routes-page" style={{ maxWidth: 1180, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
          Volunteer Route Inspector
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '4px' }}>
          Real-time oversight of all volunteer transit routes, pickup locations, and hospital/shelter drop-offs
        </p>
      </div>

      {/* Main Grid: Left Volunteer Selector Column, Right Volunteer Route Details */}
      <div className="ops-route-layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Volunteers List */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          border: '1px solid #E5E7EB',
        }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sevadeep Volunteers ({volunteers.length})
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>
              Select a volunteer to inspect their live route
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {volunteers.map(vol => {
              const isSelected = vol.id === selectedVolId;
              const volStops = getVolunteerRoute(vol.id);
              const sb = statusBadgeColors[vol.status] || statusBadgeColors['Available'];

              return (
                <button
                  key={vol.id}
                  onClick={() => setSelectedVolId(vol.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '14px 18px',
                    border: 'none',
                    borderBottom: '1px solid #F3F4F6',
                    background: isSelected ? '#EFF6FF' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.background = '#F9FAFB';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: isSelected ? 700 : 600, fontSize: '0.925rem', color: '#111827' }}>
                      {vol.name}
                    </span>
                    <span style={{
                      background: sb.bg,
                      color: sb.text,
                      border: `1px solid ${sb.border}`,
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}>
                      {vol.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#4B5563', marginBottom: '4px' }}>
                    Zone: <strong>{vol.zone}</strong> · {vol.vehicleType || 'Vehicle'}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B7280' }}>
                    <span>{volStops.length} stops scheduled</span>
                    <span style={{ color: isSelected ? '#1D4ED8' : '#9CA3AF', fontWeight: isSelected ? 700 : 400 }}>
                      {isSelected ? 'Viewing route →' : 'View route'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Volunteer Route details & Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Volunteer Status Bar */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#FFF0EB',
                color: '#FF5C28',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 700,
              }}>
                <span className="route-avatar-monogram">{selectedVol.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>
                    {selectedVol.name}
                  </h2>
                  <span style={{
                    background: (statusBadgeColors[selectedVol.status] || statusBadgeColors['Available']).bg,
                    color: (statusBadgeColors[selectedVol.status] || statusBadgeColors['Available']).text,
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {selectedVol.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '2px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <span>Zone: {selectedVol.zone}</span>
                  <span>Vehicle: {selectedVol.vehicleType} ({selectedVol.vehicleNumber})</span>
                  <span>Phone: {selectedVol.phone}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
                  {stops.length} Stops
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  {pickupCount} Pickups · {dropCount} Drops
                </div>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={stops.length === 0}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '10px 13px', borderRadius: '8px',
                  background: stops.length > 0 ? '#FF5C28' : '#E5E7EB',
                  color: stops.length > 0 ? '#FFFFFF' : '#9CA3AF',
                  textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700,
                  pointerEvents: stops.length > 0 ? 'auto' : 'none',
                }}
              >
                <Navigation size={15} />
                Open A → B → C → D in Google Maps
              </a>
            </div>
          </div>

          {/* Interactive Map & Timeline Split */}
          <div className="ops-route-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
            {/* Timeline */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              padding: '20px',
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827', marginBottom: '16px' }}>
                Assigned Stops in Transit Order
              </div>

              {stops.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.875rem' }}>
                  No active route stops assigned for this volunteer.
                </div>
              ) : (
                <RouteTimeline stops={stops} />
              )}
            </div>

            {/* Map */}
            <div style={{
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              height: 480,
              position: 'relative',
              border: '1px solid #E5E7EB',
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

                {routePositions.length > 1 && (
                  <Polyline
                    positions={routePositions}
                    pathOptions={{ color: '#0070F3', weight: 3, dashArray: '6 6', opacity: 0.85 }}
                  />
                )}

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
                        <div style={{ fontFamily: 'inherit', minWidth: 170 }}>
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
                            <span>· #{idx + 1}</span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#111827' }}>
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

              {/* Floating Legend */}
              <div style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                zIndex: 999,
                background: 'rgba(255,255,255,0.96)',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                fontSize: '0.725rem',
                lineHeight: 1.4,
              }}>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.675rem', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Marker Legend
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
              <span className="map-legend-letter">P</span>
                  <span><strong>Pickup:</strong> Hotel / Cafeteria</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
              <span className="map-legend-letter">H</span>
                  <span><strong>Delivery:</strong> Hospital Relief Hub</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
              <span className="map-legend-letter">S</span>
                  <span><strong>Delivery:</strong> Community Shelter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
