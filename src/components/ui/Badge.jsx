// Status badge color map — single source of truth
const variantMap = {
  // Surplus listing statuses
  Available:   { bg: '#E6F7F3', color: '#00A67E', label: 'Available' },
  Assigned:    { bg: '#EBF4FF', color: '#0070F3', label: 'Assigned' },
  'Picked Up': { bg: '#FFFBEB', color: '#F59E0B', label: 'Picked Up' },
  Distributed: { bg: '#F7F7F8', color: '#6B6B6B', label: 'Distributed' },
  Expired:     { bg: '#FFF5F5', color: '#E53E3E', label: 'Expired' },
  // Volunteer statuses
  'En Route':     { bg: '#EBF4FF', color: '#0070F3', label: 'En Route' },
  Distributing:   { bg: '#E6F7F3', color: '#00A67E', label: 'Distributing' },
  Offline:        { bg: '#F7F7F8', color: '#9B9B9B', label: 'Offline' },
  // Priority
  High:    { bg: '#FFF5F5', color: '#E53E3E', label: 'High' },
  Medium:  { bg: '#FFFBEB', color: '#F59E0B', label: 'Medium' },
  'No data': { bg: '#F7F7F8', color: '#9B9B9B', label: 'No data' },
  // Supplier types
  Restaurant:     { bg: '#FFF0EB', color: '#FF5C28', label: 'Restaurant' },
  'College Canteen':{ bg: '#EBF4FF', color: '#0070F3', label: 'College Canteen' },
  'Hotel Banquet':  { bg: '#E6F7F3', color: '#00A67E', label: 'Hotel Banquet' },
  'IT Park Canteen':{ bg: '#FFFBEB', color: '#F59E0B', label: 'IT Park Canteen' },
  'Wedding Hall':   { bg: '#FFF0EB', color: '#FF5C28', label: 'Wedding Hall' },
};

export default function Badge({ variant, className = '' }) {
  const style = variantMap[variant] ?? { bg: '#F7F7F8', color: '#6B6B6B', label: variant };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 500,
        backgroundColor: style.bg,
        color: style.color,
        whiteSpace: 'nowrap',
      }}
      className={className}
    >
      {style.label}
    </span>
  );
}
