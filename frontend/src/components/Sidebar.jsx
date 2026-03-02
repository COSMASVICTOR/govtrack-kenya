import Icon from './Icon';

const Sidebar = ({ active, onChange, user, onLogout }) => {
  const citizenLinks = [
    { id: 'dashboard',    icon: 'home',    label: 'Dashboard'       },
    { id: 'track',        icon: 'search',  label: 'Track Document'  },
    { id: 'documents',    icon: 'file',    label: 'My Documents'    },
    { id: 'report-lost',  icon: 'alert',   label: 'Report Lost'     },
    { id: 'found-items',  icon: 'inbox',   label: 'Found Items'     },
    { id: 'report-found', icon: 'flag',  label: 'Report Found Doc' },
    { id: 'my-reports',   icon: 'list',    label: 'My Reports'      },
    { id: 'profile',      icon: 'user',  label: 'My Profile'        },
  ];

  const adminLinks = [
    { id: 'admin-dashboard',  icon: 'home',    label: 'Dashboard'         },
    { id: 'admin-documents',  icon: 'file',    label: 'All Documents'     },
    { id: 'admin-found',      icon: 'inbox',   label: 'Found Items Mgmt'  },
    { id: 'admin-lost',       icon: 'list',    label: 'Lost Reports'      },
    { id: 'admin-users',      icon: 'user',    label: 'Users'             },
  ];

  const links = user.role === 'admin' ? adminLinks : citizenLinks;
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#0a5c36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="shield" size={16} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>GovDocTrack</div>
            <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>Kenya · {user.role === 'admin' ? 'Admin' : 'Citizen'}</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ padding: '12px 10px', flex: 1 }}>
        {links.map(({ id, icon, label }) => (
          <button
            key={id}
            className={`nav-link ${active === id ? 'active' : ''}`}
            onClick={() => onChange(id)}
          >
            <Icon name={icon} size={16} color={active === id ? '#0a5c36' : '#6b7280'} />
            {label}
          </button>
        ))}
      </div>

      {/* User Profile + Logout */}
      <div className="sidebar-user" style={{ padding: '16px 14px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 99, background: '#e8f5ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0a5c36', fontSize: 13 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{user.email}</div>
          </div>
        </div>
        <button className="nav-link" onClick={onLogout} style={{ color: '#c8102e' }}>
          <Icon name="logout" size={16} color="#c8102e" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
