import { useApp } from '../../context/AppContext';
import { USERS } from '../../context/users';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const allUsers = [...USERS.suppliers, ...USERS.volunteers, ...USERS.ops];

const roleColors = {
  supplier: { bg: '#FFF0EB', color: '#FF5C28' },
  volunteer: { bg: '#ECFDF5', color: '#10B981' },
  ops: { bg: '#EFF6FF', color: '#3B82F6' },
};

export default function UserSwitcher() {
  const { currentUser, setCurrentUser } = useApp();
  const [open, setOpen] = useState(false);
  const rc = roleColors[currentUser.role];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: rc.bg, border: `1px solid ${rc.color}22`,
          borderRadius: '8px', padding: '6px 10px',
          cursor: 'pointer', fontFamily: 'inherit', width: '100%',
        }}
      >
        <span className="user-avatar-monogram">{currentUser.avatar}</span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A0A0A' }}>{currentUser.name}</div>
          <div style={{ fontSize: '0.7rem', color: rc.color, textTransform: 'capitalize', fontWeight: 500 }}>{currentUser.role}</div>
        </div>
        <ChevronDown size={14} style={{ color: '#9B9B9B', flexShrink: 0 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0, right: 0,
          background: '#FFFFFF', border: '1px solid #E5E5E5',
          borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 100, overflow: 'hidden', marginBottom: '6px',
        }}>
          {['supplier', 'volunteer', 'ops'].map(role => (
            <div key={role}>
              <div style={{
                padding: '6px 12px', fontSize: '0.65rem', fontWeight: 700,
                color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.08em',
                background: '#F7F7F8', borderBottom: '1px solid #E5E5E5',
              }}>
                {role}
              </div>
              {allUsers.filter(u => u.role === role).map(u => (
                <button
                  key={u.id}
                  onClick={() => { setCurrentUser(u); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', padding: '8px 12px',
                    background: currentUser.id === u.id ? '#F7F7F8' : 'transparent',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    borderBottom: '1px solid #F0F0F0',
                  }}
                >
                  <span className="user-avatar-monogram user-avatar-monogram-small">{u.avatar}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: currentUser.id === u.id ? 600 : 400, color: '#0A0A0A' }}>
                    {u.name}
                  </span>
                  {currentUser.id === u.id && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: roleColors[role].color, fontWeight: 600 }}>Active</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
