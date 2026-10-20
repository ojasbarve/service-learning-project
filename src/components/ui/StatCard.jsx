export default function StatCard({ number, label, sub, trend, accentNumber = false }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        transition: 'box-shadow 150ms ease, border-color 150ms ease',
        border: '1px solid transparent',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#E5E5E5';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <div
        style={{
          fontSize: '1.875rem',
          fontWeight: 600,
          color: accentNumber ? '#FF5C28' : '#0A0A0A',
          lineHeight: 1.1,
        }}
      >
        {number}
      </div>
      <div style={{ fontSize: '0.875rem', color: '#6B6B6B', fontWeight: 500 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: '0.75rem', color: '#9B9B9B', marginTop: '2px' }}>
          {sub}
        </div>
      )}
      {trend && (
        <div style={{ fontSize: '0.75rem', color: '#00A67E', marginTop: '4px', fontWeight: 500 }}>
          {trend}
        </div>
      )}
    </div>
  );
}
