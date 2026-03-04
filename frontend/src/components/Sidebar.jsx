import { useState } from 'react';
import Icon from './Icon';

const Sidebar = ({ active, onChange, user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const citizenLinks = [
    { id: 'dashboard',    icon: 'home',   label: 'Dashboard'        },
    { id: 'track',        icon: 'search', label: 'Track Document'   },
    { id: 'documents',    icon: 'file',   label: 'My Documents'     },
    { id: 'report-lost',  icon: 'alert',  label: 'Report Lost'      },
    { id: 'found-items',  icon: 'inbox',  label: 'Found Items'      },
    { id: 'report-found', icon: 'flag',   label: 'Report Found Doc' },
    { id: 'my-reports',   icon: 'list',   label: 'My Reports'       },
    { id: 'profile',      icon: 'user',   label: 'My Profile'       },
  ];

  const adminLinks = [
    { id: 'admin-dashboard',  icon: 'home',   label: 'Dashboard'       },
    { id: 'admin-documents',  icon: 'file',   label: 'All Documents'   },
    { id: 'admin-found',      icon: 'inbox',  label: 'Found Items Mgmt'},
    { id: 'admin-lost',       icon: 'list',   label: 'Lost Reports'    },
    { id: 'admin-users',      icon: 'user',   label: 'Users'           },
  ];

  const links = user.role === 'admin' ? adminLinks : citizenLinks;
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const handleNav = (id) => {
    onChange(id);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#0a5c36', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="shield" size={16} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>GovTrack</div>
            <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>Kenya · {user.role === 'admin' ? 'Admin' : 'Citizen'}</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ padding: '12px 10px', flex: 1 }}>
        {links.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => handleNav(id)}
            className={`nav-link ${active === id ? 'active' : ''}`}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: 'none', borderRadius: 10, cursor: 'pointer', background: 'none', fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: active === id ? 700 : 400, marginBottom: 2, textAlign: 'left', transition: 'all 0.15s' }}
          >
            <Icon name={icon} size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* User + Logout */}
      <div className="sidebar-user" style={{ padding: '16px 14px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 99, background: '#e8f5ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0a5c36', fontSize: 11, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#ef4444', fontSize: 13, cursor: 'pointer', fontFamily: "'Sora',sans-serif", padding: '6px 4px' }}>
          <Icon name="x" size={14} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <div className="desktop-sidebar">
        <SidebarContent />
      </div>

      {/* ── Mobile Hamburger Button ── */}
      <button
        className="hamburger-btn"
        onClick={() => setMobileOpen(true)}
        style={{ position: 'fixed', top: 12, left: 12, zIndex: 1001, width: 40, height: 40, borderRadius: 10, background: '#0a5c36', border: 'none', cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(10,92,54,0.3)' }}
      >
        <span style={{ color: 'white', fontSize: 20, lineHeight: 1 }}>☰</span>
      </button>

      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1002 }}
        />
      )}

      {/* ── Mobile Slide-out Sidebar ── */}
      <div
        className="mobile-sidebar"
        style={{ position: 'fixed', top: 0, left: mobileOpen ? 0 : '-280px', width: 260, height: '100vh', zIndex: 1003, transition: 'left 0.3s ease', background: 'white', boxShadow: '4px 0 20px rgba(0,0,0,0.15)', display: 'none' }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }}>
          <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#6b7280' }}>✕</button>
        </div>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;