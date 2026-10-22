import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';

export default function Layout({ navItems, basePath, children }) {
  const { error, refreshing, lastSyncedAt, refresh } = useApp();
  return (
    <div className="app-shell">
      <TopBar />
      <Sidebar navItems={navItems} basePath={basePath} />
      <main className="app-main">
        <div className="app-content">
          <div className={`data-status${error ? ' is-offline' : ''}`} role={error ? 'alert' : 'status'}>
            <span><i aria-hidden="true" />{error ? <><strong>Offline mode</strong> — showing the last saved view.</> : <>Live data connected</>}</span>
            <span className="data-status-time">{lastSyncedAt ? `Synced ${lastSyncedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : 'Connecting…'}</span>
            <button onClick={refresh} disabled={refreshing}>{refreshing ? 'Refreshing…' : 'Refresh data'}</button>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
