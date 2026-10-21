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
          {error && <div role="alert" className="data-status">
            <span><strong>Offline mode</strong> — showing the last saved view.</span>
            <button onClick={refresh}>Try again</button>
          </div>}
          {children}
        </div>
      </main>
    </div>
  );
}
