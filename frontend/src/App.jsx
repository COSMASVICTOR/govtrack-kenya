import HelpSupport from './components/HelpSupport';
import NotificationBell from './components/NotificationBell';
import ProfilePage from './pages/ProfilePage';
import ReportFound from './pages/ReportFound';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { TrackDocument, MyDocuments, ReportLost, FoundItems, MyReports } from './pages/CitizenPages';
import { AdminDashboard, AdminDocuments, AdminFound, AdminLost, AdminUsers } from './pages/admin/AdminPages';

function App() {
  const { user, logout, loading, theme, toggleTheme } = useAuth();
  const [screen, setScreen] = useState('landing'); // landing | login | register | found-public
  const [activePage, setActivePage] = useState('dashboard');

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2ef' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#0a5c36', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <span style={{ color: 'white', fontSize: 22 }}>🛡</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Loading GovDocTrack Kenya...</p>
        </div>
      </div>
    );
  }

  // ── Logged-in App ────────────────────────────────
  if (user) {
    const citizenPages = {
      dashboard:    <Dashboard user={user} onNavigate={setActivePage} />,
      track:        <TrackDocument />,
      documents:    <MyDocuments />,
      'report-lost':<ReportLost />,
      'found-items':<FoundItems />,
      'report-found': <ReportFound />,
      'profile':      <ProfilePage />,
      'my-reports': <MyReports />,
    };

    const adminPages = {
      'admin-dashboard': <AdminDashboard />,
      'admin-documents': <AdminDocuments />,
      'admin-found':     <AdminFound />,
      'admin-lost':      <AdminLost />,
      'admin-users':     <AdminUsers />,
    };

    const pages = user.role === 'admin' ? adminPages : citizenPages;
    const defaultPage = user.role === 'admin' ? 'admin-dashboard' : 'dashboard';
    const currentPage = pages[activePage] || pages[defaultPage];

    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          active={activePage}
          onChange={setActivePage}
          user={user}
          onLogout={() => { logout(); setScreen('landing'); setActivePage('dashboard'); }}
        />
        <div className="main-area">
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, gap: 8 }}>
  <NotificationBell />
  <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark/light mode">
    {theme === 'light' ? '🌙' : '☀️'}
  </button>
</div>
  {currentPage}
</div>
<HelpSupport />
      </div>
    );
  }

  // ── Public Screens ───────────────────────────────
  const navigate = (to) => setScreen(to);

  if (screen === 'login' || screen === 'register') {
    return <AuthPage mode={screen} onNavigate={navigate} />;
  }

  if (screen === 'found-public') {
    return <PublicFoundPage onNavigate={navigate} />;
  }

  return <LandingPage onNavigate={navigate} />;
}

// ── Simple Public Found Items Page ──────────────────
import { useState as useStateP, useEffect as useEffectP } from 'react';
import { getFoundItemsPublic } from './api/axios';
import { StatusBadge, DocTypeIcon } from './components/StatusBadge';
import Icon from './components/Icon';

function PublicFoundPage({ onNavigate }) {
  const [query, setQueryP] = useStateP('');
  const [items, setItemsP] = useStateP([]);
  const [loaded, setLoadedP] = useStateP(false);

  useEffectP(() => {
    getFoundItemsPublic('').then(res => { setItemsP(res.data); setLoadedP(true); }).catch(() => setLoadedP(true));
  }, []);

  const search = async () => {
    const res = await getFoundItemsPublic(query);
    setItemsP(res.data);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2ef', padding: 24 }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0a5c36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="shield" size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>GovDocTrack Kenya</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Public Found Items Registry</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => onNavigate('login')}>Sign In</button>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => onNavigate('register')}>Register</button>
          </div>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Search Found Documents</h1>
        <div className="card" style={{ padding: 20, marginBottom: 20, display: 'flex', gap: 12 }}>
          <input className="input-field" placeholder="Enter your name or document number..." value={query} onChange={e => setQueryP(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
          <button className="btn-primary" onClick={search}><Icon name="search" size={15} /></button>
        </div>

        {loaded && items.map(item => (
          <div key={item._id} className="card" style={{ padding: 20, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <DocTypeIcon type={item.docType} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{item.docType}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#6b7280' }}>{item.docNumber}</div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>Owner: <strong>{item.ownerName}</strong></div>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
            {item.status === 'Awaiting Owner' && (
              <div style={{ marginTop: 12, background: '#f0fdf4', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#15803d' }}>
                📍 Deposited at: <strong>{item.depositedAt}</strong> — Visit with valid ID to claim.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;