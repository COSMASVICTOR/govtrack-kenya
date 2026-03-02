import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyLostReports, getMyDocuments } from '../api/axios';
import Icon from './Icon';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = async () => {
    try {
      const [reportsRes, docsRes] = await Promise.all([
        getMyLostReports(),
        getMyDocuments(),
      ]);

      const notifs = [];

      // Check lost reports for matches
      reportsRes.data.forEach(r => {
        if (r.matchedItem) {
          notifs.push({
            id: `match-${r._id}`,
            type: 'match',
            icon: '🎉',
            title: 'Document Found!',
            message: `Your ${r.docType} (${r.docNumber}) was found and is at ${r.matchedItem.depositedAt}.`,
            time: new Date(r.updatedAt).toLocaleDateString(),
          });
        }
      });

      // Check documents ready for collection
      docsRes.data.forEach(d => {
        if (d.status === 'Ready for Collection') {
          notifs.push({
            id: `ready-${d._id}`,
            type: 'ready',
            icon: '✅',
            title: 'Ready for Collection!',
            message: `Your ${d.type} (${d.docNumber}) is ready at ${d.office}.`,
            time: d.updatedDate,
          });
        }
      });

      setNotifications(notifs);

      // Count unread (not seen before)
      const seenIds = JSON.parse(localStorage.getItem('govtrack_seen_notifs') || '[]');
      const unreadCount = notifs.filter(n => !seenIds.includes(n.id)).length;
      setUnread(unreadCount);
    } catch (err) {
      console.error('Notification fetch error:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Auto-check every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleOpen = () => {
    setOpen(!open);
    if (!open) {
      // Mark all as read
      const ids = notifications.map(n => n.id);
      localStorage.setItem('govtrack_seen_notifs', JSON.stringify(ids));
      setUnread(0);
    }
  };

  const colorMap = {
    match: { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
    ready: { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        style={{ width: 34, height: 34, borderRadius: 10, border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.2s' }}
        title="Notifications"
      >
        <Icon name="bell" size={16} color={unread > 0 ? '#e69926ff' : '#6b7280'} />
        {unread > 0 && (
          <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 99, background: '#c8102e', color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
            {unread > 9 ? '9+' : unread}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position: 'absolute', top: 42, right: 0, width: 320, background: 'white', borderRadius: 14, border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 999 }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Notifications</span>
            <span style={{ fontSize: 12, color: '#6b7280' }}>{notifications.length} total</span>
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
                <p style={{ color: '#6b7280', fontSize: 13 }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => {
                const { bg, border, color } = colorMap[n.type] || colorMap.ready;
                return (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', background: bg, borderLeft: `3px solid ${border}` }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 18 }}>{n.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: '#374151', marginTop: 2, lineHeight: 1.5 }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{n.time}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 12, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;