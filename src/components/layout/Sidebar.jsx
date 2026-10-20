import { useNavigate, useLocation } from 'react-router-dom';
import UserSwitcher from '../ui/UserSwitcher';

export default function Sidebar({ navItems, basePath }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="app-sidebar">
      {/* Nav items */}
      <nav className="app-nav">
        <div className="app-nav-label">Workspace</div>
        {navItems.map(item => {
          const fullPath = `${basePath}/${item.path}`;
          const isActive = pathname === fullPath || pathname.startsWith(fullPath + '/');
          const Icon = item.icon;
          return (
            <button
              className={`app-nav-item${isActive ? ' active' : ''}`}
              key={item.path}
              onClick={() => navigate(fullPath)}
            >
              {Icon && <Icon size={16} style={{ flexShrink: 0 }} />}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User switcher */}
      <div className="app-user-panel">
        <div className="app-user-label">Logged in as</div>
        <UserSwitcher />
      </div>

      {/* Footer */}
      <div className="app-powered">
        <span>Powered by</span>
        <a
          href="https://sevadeep.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sevadeep NGO
        </a>
      </div>
    </aside>
  );
}
