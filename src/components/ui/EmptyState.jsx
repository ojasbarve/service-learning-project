export default function EmptyState({ icon: Icon, heading, subtext }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      gap: '12px',
    }}>
      {Icon && (
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          background: '#F7F7F8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={24} style={{ color: '#9B9B9B' }} />
        </div>
      )}
      <div style={{ fontWeight: 600, fontSize: '1rem', color: '#0A0A0A' }}>{heading}</div>
      <div style={{ fontSize: '0.875rem', color: '#9B9B9B', maxWidth: 280 }}>{subtext}</div>
    </div>
  );
}
