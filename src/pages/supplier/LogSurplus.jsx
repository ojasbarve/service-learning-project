import { useEffect, useState } from 'react';
import { Bike, Info, PlusCircle } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

const foodTypes = ['Cooked Rice', 'Dal/Curry', 'Biryani', 'Bread/Roti', 'Snacks', 'Mixed Meal', 'Bakery Items', 'Other'];

export default function LogSurplus() {
  const { currentUser, listings, suppliers, addListing } = useApp();
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine current active supplier or fallback to first supplier
  const currentSupplier =
    currentUser?.role === 'supplier'
      ? suppliers.find(s => s.id === currentUser.supplierId) || suppliers[0]
      : suppliers[0];

  const [selectedSupplierId, setSelectedSupplierId] = useState(currentSupplier.id);
  const activeSupplier = suppliers.find(s => s.id === selectedSupplierId) || currentSupplier;

  const [form, setForm] = useState({
    foodType: '',
    quantity: '',
    availableFrom: '09:00',
    deadline: '14:00',
    address: activeSupplier.address,
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (activeSupplier?.address) setForm(f => ({ ...f, address: activeSupplier.address }));
  }, [activeSupplier?.id, activeSupplier?.address]);

  // Active listings for this supplier from shared AppContext
  const activeListings = listings.filter(
    l => String(l.supplierId) === String(activeSupplier.id) && ['Available', 'Assigned', 'Picked Up'].includes(l.status)
  );

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSupplierChange(newId) {
    setSelectedSupplierId(newId);
    const supp = suppliers.find(s => s.id === newId);
    if (supp) {
      setForm(f => ({ ...f, address: supp.address }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSubmitted(false);
    setIsSubmitting(true);

    // Construct deadline ISO
    let deadlineIso;
    if (form.deadline) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      deadlineIso = new Date(`${todayStr}T${form.deadline}`).toISOString();
    } else {
      deadlineIso = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
    }

    const newListing = {
      id: `l-${Date.now()}`,
      supplierId: activeSupplier.id,
      supplierName: activeSupplier.name,
      supplierArea: activeSupplier.area,
      supplierType: activeSupplier.type,
      foodType: form.foodType,
      quantity: Number(form.quantity),
      listedAt: new Date().toISOString(),
      deadline: deadlineIso,
      address: form.address || activeSupplier.address,
      lat: activeSupplier.lat + (Math.random() - 0.5) * 0.003,
      lng: activeSupplier.lng + (Math.random() - 0.5) * 0.003,
      status: 'Available',
      volunteerAssigned: null,
      notes: form.notes || 'Freshly prepared surplus batch.',
    };

    try {
      await addListing(newListing);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setForm({
        foodType: '',
        quantity: '',
        availableFrom: '09:00',
        deadline: '14:00',
        address: activeSupplier.address,
        notes: '',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setFormError(error.message || 'Listing could not be added. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {formError && <div role="alert" style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 12, background: '#fff4f1', color: '#a43b22', fontSize: '.85rem', fontWeight: 600 }}>{formError}</div>}
      {/* Page header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            Log Surplus Food
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#9B9B9B', marginTop: '4px' }}>
            New listings are broadcast in real-time to Sevadeep volunteers and the Ops dashboard
          </p>
        </div>

        {/* If Ops is logged in, allow them to log on behalf of any supplier */}
        {currentUser?.role === 'ops' && (
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E40AF' }}>
              Logging as Supplier:
            </span>
            <select
              value={selectedSupplierId}
              onChange={e => handleSupplierChange(e.target.value)}
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
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.area})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {submitted && (
        <div style={{
          background: '#E6F7F3',
          border: '1px solid #00A67E',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '24px',
          color: '#00A67E',
          fontWeight: 600,
          fontSize: '0.925rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '1.2rem' }}>✓</span>
          <div>
          <div>Listing added</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 400, color: '#065F46' }}>
            The listing is now available to volunteers and the Ops dashboard.
            </div>
          </div>
        </div>
      )}

      {/* Section 1 — Log form */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        padding: '28px',
        marginBottom: '28px',
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: '32px',
      }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* Food type */}
            <div>
              <label style={labelStyle}>Food Type *</label>
              <select
                name="foodType"
                value={form.foodType}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Select food type…</option>
                {foodTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label style={labelStyle}>Quantity (in kg) *</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 25"
                min="1"
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* Available From */}
            <div>
              <label style={labelStyle}>Available From</label>
              <input
                type="time"
                name="availableFrom"
                value={form.availableFrom}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Pickup Deadline */}
            <div>
              <label style={labelStyle}>Pickup Deadline (critical for urgency) *</label>
              <input
                type="time"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Address */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Pickup Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Special Instructions / Dietary Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="e.g. Pure veg, Jain preparation, packaged in stainless steel containers..."
              rows={3}
              style={{
                ...inputStyle,
                height: 'auto',
                padding: '10px 12px',
                resize: 'vertical',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: '#FF5C28',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 24px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isSubmitting ? 'wait' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 150ms ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E84E1D'}
            onMouseLeave={e => e.currentTarget.style.background = '#FF5C28'}
          >
            <PlusCircle size={16} />
            {isSubmitting ? 'Adding listing…' : 'Post Surplus Listing'}
          </button>
        </form>

        {/* Sidebar Info */}
        <div style={{
          background: '#F7F7F8',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Info size={15} style={{ color: '#FF5C28' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0A0A0A' }}>How it works</span>
          </div>
          {[
            { n: 1, text: 'You log surplus with quantity & deadline' },
            { n: 2, text: 'Listing appears instantly on volunteer screens' },
            { n: 3, text: 'Volunteer claims it & pickup is routed to a hospital or shelter' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#FFF0EB',
                color: '#FF5C28',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0,
              }}>{step.n}</div>
              <span style={{ fontSize: '0.875rem', color: '#6B6B6B', lineHeight: 1.5 }}>{step.text}</span>
            </div>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #E5E5E5', fontSize: '0.75rem', color: '#9B9B9B' }}>
            Active Donor: <strong style={{ color: '#0A0A0A' }}>{activeSupplier.name}</strong> ({activeSupplier.area})
          </div>
        </div>
      </div>

      {/* Section 2 — Active listings table */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        marginBottom: '28px',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A' }}>
              Your Active Listings ({activeListings.length})
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#9B9B9B', marginTop: '2px' }}>
              Live batches registered under {activeSupplier.name}
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {activeListings.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9B9B9B', fontSize: '0.875rem' }}>
              No active listings currently. Fill out the form above to log a new batch.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F7F7F8' }}>
                  {['Food Type', 'Qty', 'Listed At', 'Pickup Deadline', 'Status', 'Volunteer Assigned'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeListings.map((l, i) => (
                  <tr
                    key={l.id}
                    style={{ borderBottom: i < activeListings.length - 1 ? '1px solid #E5E5E5' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F7F7F8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600, color: '#0A0A0A' }}>{l.foodType}</span>
                      <div style={{ fontSize: '0.75rem', color: '#9B9B9B' }}>{l.notes || l.supplierName}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700, color: '#FF5C28' }}>{l.quantity} kg</span>
                    </td>
                    <td style={{ ...tdStyle, color: '#9B9B9B', fontSize: '0.8125rem' }}>
                      {format(new Date(l.listedAt), 'h:mm a')}
                    </td>
                    <td style={{ ...tdStyle, color: '#9B9B9B', fontSize: '0.8125rem' }}>
                      {format(new Date(l.deadline), 'h:mm a')}
                    </td>
                    <td style={tdStyle}>
                      <Badge variant={l.status} />
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.875rem', color: '#6B6B6B' }}>
                      {l.volunteerAssigned ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 600, color: '#0070F3' }}><Bike size={14} /> {l.volunteerAssigned}</span>
                      ) : (
                        <span style={{ color: '#9B9B9B' }}>Waiting for pickup</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Section 3 — Impact stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <StatCard number={`${activeSupplier.totalDonated || 847} kg`} label="Total Food Logged" sub="All time" />
        <StatCard number={(activeSupplier.mealsEnabled || 2350).toLocaleString()} label="Meals Enabled" sub="Est. 350g per meal" />
        <StatCard number={activeSupplier.partnerSince || "Mar 2025"} label="Partner Since" sub="Active contributor" />
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: '#6B6B6B',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  height: 36,
  border: '1px solid #E5E5E5',
  borderRadius: '10px',
  padding: '0 12px',
  fontSize: '0.875rem',
  background: '#FFFFFF',
  color: '#0A0A0A',
  fontFamily: 'inherit',
  transition: 'border-color 150ms ease',
};

const thStyle = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#9B9B9B',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '0.875rem',
  color: '#0A0A0A',
  verticalAlign: 'middle',
  minHeight: 44,
};
