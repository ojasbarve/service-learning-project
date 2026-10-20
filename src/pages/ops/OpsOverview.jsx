import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { upcomingEvents } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

const hospitalDeliveryIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:28px;height:28px;border-radius:50%;
    background:#0284C7;border:3px solid #fff;
    box-shadow:0 2px 6px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:13px;line-height:1;
  ">🏥</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const shelterDeliveryIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:28px;height:28px;border-radius:50%;
    background:#EA580C;border:3px solid #fff;
    box-shadow:0 2px 6px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:13px;line-height:1;
  ">⛺</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makeMapIcon(color, pulse = false) {
  return L.divIcon({
    className: '',
    html: `<div style="
      position:relative;
      width:24px;height:24px;border-radius:50%;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    ">
      ${pulse ? `<div style="
        position:absolute;inset:-6px;border-radius:50%;
        background:${color};opacity:0.3;
        animation:pulse-ring 1.5s ease-out infinite;
      "></div>` : ''}
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

const availableIcon = makeMapIcon('#00A67E');
const assignedIcon  = makeMapIcon('#0070F3');
const urgentIcon    = makeMapIcon('#E53E3E', true);

function getMarkerIcon(listing) {
  const diff = new Date(listing.deadline) - Date.now();
  if (diff > 0 && diff < 60 * 60 * 1000) return urgentIcon;
  if (listing.status === 'Assigned') return assignedIcon;
  return availableIcon;
}

const puneCenter = [18.5204, 73.8567];

const areaBarData = [
  { area: 'Hinjewadi',    kg: 120 },
  { area: 'Shivajinagar', kg: 80 },
  { area: 'Koregaon Park',kg: 75 },
  { area: 'Deccan/FC Rd', kg: 55 },
  { area: 'Kothrud',      kg: 36 },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 4px 6px rgba(0,0,0,0.07)', fontSize: '0.875rem' }}>
      <div style={{ fontWeight: 600, color: '#0A0A0A' }}>{payload[0].payload.area}</div>
      <div style={{ color: '#FF5C28' }}>{payload[0].value} kg available</div>
    </div>
  );
};

export default function OpsOverview() {
  const { listings, volunteers, deliverySpots } = useApp();
  const liveListings = listings.filter(l => ['Available', 'Assigned'].includes(l.status));
  const totalKg = liveListings.reduce((s, l) => s + l.quantity, 0);
  const activeVols = volunteers.filter(v => v.status !== 'Offline').length;

  return (
    <div className="operations-page ops-overview-page" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
          Ops Overview
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#9B9B9B', marginTop: '4px' }}>
          Live coordination dashboard for Sevadeep coordinators
        </p>
      </div>

      {/* Stat cards */}
      <div className="ops-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard number={liveListings.length} label="Active Surplus Listings" />
        <StatCard number={`${totalKg} kg`} label="Kg Available Today" accentNumber />
        <StatCard number={Math.round(totalKg / 0.35).toLocaleString()} label="Estimated Meals" />
        <StatCard number={`${activeVols} / ${volunteers.length}`} label="Volunteers Active" />
      </div>

      {/* Live Surplus Map */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A' }}>Live Surplus Map</h2>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#9B9B9B' }}>
            {[
              { color: '#00A67E', label: 'Available' },
              { color: '#0070F3', label: 'Assigned' },
              { color: '#E53E3E', label: 'Expiring <1hr' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderRadius: '10px', overflow: 'hidden', height: 380, position: 'relative' }}>
          <MapContainer center={puneCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {liveListings.map(l => (
              <Marker
                key={l.id}
                position={[l.lat, l.lng]}
                icon={getMarkerIcon(l)}
              >
                <Popup>
                  <div style={{ fontFamily: 'inherit', minWidth: 170 }}>
                    <div style={{ fontWeight: 700, color: '#0A0A0A', marginBottom: '4px' }}>{l.supplierName}</div>
                    <div style={{ color: '#6B6B6B', fontSize: '0.8rem', marginBottom: '4px' }}>
                      {l.foodType} · {l.quantity} kg
                    </div>
                    <div style={{ color: '#9B9B9B', fontSize: '0.75rem', marginBottom: '8px' }}>
                      Deadline: {new Date(l.deadline).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {l.status === 'Available' && (
                      <div style={{ background: '#FF5C28', color: '#fff', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', cursor: 'pointer' }}>
                        Assign to Volunteer
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Designated Delivery Hubs (Hospitals & Shelters) */}
            {deliverySpots.map(d => {
              const isHospital = d.type.toLowerCase().includes('hospital');
              return (
                <Marker
                  key={d.id}
                  position={[d.lat, d.lng]}
                  icon={isHospital ? hospitalDeliveryIcon : shelterDeliveryIcon}
                >
                  <Popup>
                    <div style={{ fontFamily: 'inherit', minWidth: 170 }}>
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: isHospital ? '#0284C7' : '#EA580C',
                        marginBottom: '4px',
                      }}>
                        {isHospital ? '🏥 PUBLIC HOSPITAL' : '⛺ COMMUNITY SHELTER'}
                      </div>
                      <div style={{ fontWeight: 700, color: '#0A0A0A', marginBottom: '2px' }}>{d.name}</div>
                      <div style={{ color: '#6B6B6B', fontSize: '0.8rem', marginBottom: '4px' }}>
                        {d.area} · {d.description}
                      </div>
                      <div style={{ color: '#9B9B9B', fontSize: '0.75rem' }}>
                        Contact: {d.contact} ({d.phone})
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Legend */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            zIndex: 999,
            background: 'rgba(255,255,255,0.96)',
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: '0 3px 12px rgba(0,0,0,0.18)',
            fontSize: '0.75rem',
            lineHeight: 1.4,
            maxWidth: 250,
          }}>
            <div style={{ fontWeight: 700, color: '#111827', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.675rem' }}>
              Platform Map Legend
            </div>

            {/* Donors */}
            <div style={{ fontWeight: 600, color: '#4B5563', fontSize: '0.7rem', marginBottom: '4px' }}>
              📦 Pickups (Hotels & Cafeterias)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#00A67E', border: '1px solid #fff' }} />
              <span style={{ color: '#374151' }}>Available — waiting for pickup</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#0070F3', border: '1px solid #fff' }} />
              <span style={{ color: '#374151' }}>Assigned — volunteer en route</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#E53E3E', border: '1px solid #fff' }} />
              <span style={{ color: '#374151' }}>Urgent — expires &lt; 1 hour</span>
            </div>

            {/* Deliveries */}
            <div style={{ fontWeight: 600, color: '#4B5563', fontSize: '0.7rem', marginTop: '6px', marginBottom: '4px', borderTop: '1px solid #F3F4F6', paddingTop: '4px' }}>
              Beneficiary Delivery Hubs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <span>🏥</span>
              <span style={{ color: '#0369A1', fontWeight: 600 }}>Public Hospitals (Sassoon, KEM)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⛺</span>
              <span style={{ color: '#C2410C', fontWeight: 600 }}>Community Shelters & Relief Camps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Left — area bar chart */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          padding: '20px',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '16px' }}>
            Surplus by Area
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={areaBarData} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#9B9B9B', fontFamily: 'inherit' }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'kg', position: 'insideBottomRight', offset: -5, style: { fontSize: 11, fill: '#9B9B9B' } }}
              />
              <YAxis
                type="category"
                dataKey="area"
                tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: 'inherit' }}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="kg" radius={[0, 4, 4, 0]} fill="#FF5C28" opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right — volunteer status table */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #E5E5E5' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A' }}>Volunteer Status</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F7F7F8' }}>
                {['Name', 'Zone', 'Status', 'Last Update'].map(h => (
                  <th key={h} style={{
                    padding: '9px 14px', textAlign: 'left', fontSize: '0.7rem',
                    fontWeight: 600, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v, i) => (
                <tr
                  key={v.id}
                  style={{ borderBottom: i < volunteers.length - 1 ? '1px solid #E5E5E5' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F7F7F8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontWeight: 500, fontSize: '0.875rem' }}>{v.shortName}</td>
                  <td style={{ padding: '10px 14px', color: '#9B9B9B', fontSize: '0.8125rem' }}>{v.zone}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge variant={v.status} />
                  </td>
                  <td style={{ padding: '10px 14px', color: '#9B9B9B', fontSize: '0.8125rem' }}>{v.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Surge alerts */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        padding: '20px',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '16px' }}>
          Upcoming Surge Alerts
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {upcomingEvents.map(ev => (
            <div key={ev.id} style={{
              background: '#F7F7F8',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #E5E5E5',
              transition: 'border-color 150ms ease',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#CCCCCC'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E5E5'}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{ev.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0A0A0A', lineHeight: 1.4, marginBottom: '6px' }}>
                {ev.title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#9B9B9B', marginBottom: '10px' }}>{ev.date}</div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#FF5C28',
                marginBottom: '6px',
              }}>
                Expected: {ev.expectedSurplus}
              </div>
              {ev.alertBy && (
                <div style={{ fontSize: '0.75rem', color: '#9B9B9B' }}>
                  Alert NGO partners by: {ev.alertBy}
                </div>
              )}
              {ev.recurring && (
                <div style={{
                  display: 'inline-flex',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  background: '#EBF4FF',
                  color: '#0070F3',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  marginTop: '6px',
                }}>
                  Recurring
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
