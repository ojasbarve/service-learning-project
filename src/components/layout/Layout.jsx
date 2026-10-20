import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';

export default function Layout({ navItems, basePath, children }) {
  const { error, refresh } = useApp();
  return (
    <div className="app-shell">
      <TopBar />
      <Sidebar navItems={navItems} basePath={basePath} />
      <main className="app-main">
        <div className="app-content">
          {error && <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, padding: '12px 14px', borderRadius: 14, background: '#fff4f1', color: '#a43b22', fontSize: '.84rem', fontWeight: 600 }}>
            <span style={{ flex: 1 }}>Live data is temporarily unavailable. Showing the last available view.</span>
            <button onClick={refresh} style={{ border: 0, borderRadius: 9, padding: '7px 10px', background: '#fff', color: '#a43b22', cursor: 'pointer', fontWeight: 700 }}>Retry</button>
          </div>}
          {children}
        </div>
      </main>
    </div>
  );
}
