import { generateDocumentReport } from '../api/generatePDF';
import { useState, useEffect } from 'react';
import { getMyDocuments, getMyLostReports, getFoundItems } from '../api/axios';
import { StatusBadge, DocTypeIcon } from '../components/StatusBadge';
import Icon from '../components/Icon';

const Dashboard = ({ user, onNavigate }) => {
  const [docs, setDocs] = useState([]);
  const [lostReports, setLostReports] = useState([]);
  const [foundMatches, setFoundMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [docsRes, reportsRes] = await Promise.all([
          getMyDocuments(),
          getMyLostReports(),
        ]);
        setDocs(docsRes.data);
        setLostReports(reportsRes.data);

        // Check for matches
        const matches = reportsRes.data.filter(r => r.matchedItem);
        setFoundMatches(matches);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading...</div>;

  const statuses = {
    Processing: docs.filter(d => d.status === 'Processing').length,
    Ready: docs.filter(d => d.status === 'Ready for Collection').length,
    Collected: docs.filter(d => d.status === 'Collected').length,
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
  <div>
    <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>Good day, {user.name.split(' ')[0]} 👋</h1>
    <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>Here's an overview of your government documents</p>
  </div>
  <button
    className="btn-secondary"
    style={{ padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
    onClick={() => generateDocumentReport(user, docs, lostReports)}
  >
    🖨️ Download Report
  </button>
</div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Documents',   value: docs.length,          icon: 'file',    color: '#0a5c36', bg: '#e8f5ef' },
          { label: 'Processing',        value: statuses.Processing,  icon: 'refresh', color: '#d97706', bg: '#fef3c7' },
          { label: 'Ready to Collect',  value: statuses.Ready,       icon: 'check',   color: '#059669', bg: '#d1fae5' },
          { label: 'Lost Reports',      value: lostReports.length,   icon: 'alert',   color: '#c8102e', bg: '#fdf0f2' },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>{value}</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={icon} size={18} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {statuses.Ready > 0 && (
        <div className="alert alert-success">
          <Icon name="check" size={16} color="#15803d" />
          <strong>{statuses.Ready} document(s) ready for collection!</strong> Visit your respective Huduma Centre.
        </div>
      )}
      {foundMatches.length > 0 && (
        <div className="alert" style={{ background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e' }}>
          <Icon name="inbox" size={16} color="#92400e" />
          <strong>{foundMatches.length} of your lost document(s) may have been found!</strong> Check My Reports for details.
        </div>
      )}

      {/* My Documents */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontWeight: 700, fontSize: 17 }}>My Documents</h2>
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => onNavigate('documents')}>View All</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {docs.slice(0, 3).map(doc => (
            <div key={doc._id} className="doc-card">
              <DocTypeIcon type={doc.type} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.type}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', fontFamily: "'DM Mono',monospace", marginTop: 2 }}>{doc.docNumber}</div>
                  </div>
                  <StatusBadge status={doc.status} />
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>📍 {doc.office}</div>
              </div>
            </div>
          ))}
          {docs.length === 0 && <p style={{ color: '#9ca3af', fontSize: 14, padding: '12px 0' }}>No documents registered yet.</p>}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: 'search', label: 'Track by Document Number', action: 'track',        color: '#0a5c36' },
            { icon: 'alert',  label: 'Report a Lost Document',   action: 'report-lost',  color: '#c8102e' },
            { icon: 'inbox',  label: 'Search Found Items',       action: 'found-items',  color: '#1d4ed8' },
            { icon: 'list',   label: 'View My Reports',          action: 'my-reports',   color: '#7c3aed' },
          ].map(({ icon, label, action, color }) => (
            <button key={action} onClick={() => onNavigate(action)}
              style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', fontFamily: "'Sora',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={icon} size={16} color={color} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
