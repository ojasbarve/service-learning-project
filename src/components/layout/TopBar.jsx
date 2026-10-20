import { useNavigate, useLocation } from 'react-router-dom';

const roles = [
  { label: 'Supplier', path: '/supplier' },
  { label: 'Volunteer', path: '/volunteer' },
  { label: 'Ops Dashboard', path: '/ops' },
];

export default function TopBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeRole = roles.find(r => pathname.startsWith(r.path)) ?? null;

  return (
    <header className="app-topbar">
      {/* Wordmark */}
      <button className="app-wordmark"
        onClick={() => navigate('/')}
      >
        <span className="app-mark">N</span>
        Nourish.Net
      </button>

      {/* Role switcher — center */}
      <div className="app-role-switcher">
          {roles.map(role => {
            const isActive = activeRole?.path === role.path;
            return (
              <button className={`app-role-button${isActive ? ' active' : ''}`}
                key={role.path}
                onClick={() => navigate(role.path)}
              >
                {role.label}
              </button>
            );
          })}
        </div>

      {/* Sevadeep chip */}
      <div className="app-ngo-chip">
        <span className="app-ngo-dot" />
        Sevadeep NGO
      </div>
    </header>
  );
}
