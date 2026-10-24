import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { USERS } from '../../context/users';

const roles = [
  { label: 'Supplier', path: '/supplier' },
  { label: 'Volunteer', path: '/volunteer' },
  { label: 'Ops Dashboard', path: '/ops' },
];

export default function TopBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { currentUser, setCurrentUser } = useApp();

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
                onClick={() => {
                  const roleKey = role.path.slice(1) === 'ops' ? 'ops' : `${role.path.slice(1)}s`;
                  // Ops can inspect the other portals without changing the logged-in
                  // coordinator identity. Supplier/volunteer users can still enter the
                  // Ops demo persona from the same switcher.
                  if (currentUser?.role !== 'ops' || roleKey === 'ops') {
                    setCurrentUser(USERS[roleKey][0]);
                  }
                  navigate(role.path);
                }}
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
