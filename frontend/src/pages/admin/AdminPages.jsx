import { useState, useEffect } from 'react';
import {
  getAdminStats, getAdminDocuments, updateDocumentStatus,
  getAdminLostReports, getAdminFoundItems, logFoundItem,
  updateFoundItemStatus, getAdminUsers
} from '../../api/axios';
import { StatusBadge, DocTypeIcon } from '../../components/StatusBadge';
import Icon from '../../components/Icon';

// ─── AdminDashboard ───────────────────────────────────────────────────────────
export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    getAdminStats().then(res => setStats(res.data));
    getAdminDocuments().then(res => setDocs(res.data.slice(0, 8)));
  }, []);

  if (!stats) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading...</div>;

  const statCards = [
    { label: 'Total Documents',  value: stats.totalDocs,  icon: 'file',    color: '#0a5c36', bg: '#e8f5ef' },
    { label: 'Processing',       value: stats.processing, icon: 'refresh', color: '#d97706', bg: '#fef3c7' },
    { label: 'Ready to Collect', value: stats.ready,      icon: 'check',   color: '#059669', bg: '#d1fae5' },
    { label: 'Lost Reports',     value: stats.lostReports,icon: 'alert',   color: '#c8102e', bg: '#fdf0f2' },
    { label: 'Found Items',      value: stats.foundItems, icon: 'inbox',   color: '#1d4ed8', bg: '#eff6ff' },
    { label: 'Citizens',         value: stats.users,      icon: 'user',    color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Admin Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>System overview and management panel</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {statCards.map(({ label, value, icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-1px' }}>{value}</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={icon} size={18} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Recent Documents</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Type</th><th>Document No.</th><th>Owner</th><th>Status</th><th>Updated</th></tr></thead>
          <tbody>
            {docs.map(doc => (
              <tr key={doc._id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><DocTypeIcon type={doc.type} /><span style={{ fontSize: 13 }}>{doc.type}</span></div></td>
                <td><span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>{doc.docNumber}</span></td>
                <td>{doc.owner?.name || '—'}</td>
                <td><StatusBadge status={doc.status} /></td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{doc.updatedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── AdminDocuments ───────────────────────────────────────────────────────────
export const AdminDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDocuments().then(res => setDocs(res.data)).finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (docId) => {
    try {
      const res = await updateDocumentStatus(docId, newStatus);
      setDocs(prev => prev.map(d => d._id === docId ? res.data : d));
      setSaved(docId);
      setEditing(null);
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Document Management</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>View and update document statuses</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Type</th><th>Doc Number</th><th>Owner</th><th>Office</th><th>Status</th><th>Updated</th><th>Action</th></tr></thead>
          <tbody>
            {docs.map(doc => (
              <tr key={doc._id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><DocTypeIcon type={doc.type} /><span style={{ fontSize: 12 }}>{doc.type}</span></div></td>
                <td><span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>{doc.docNumber}</span></td>
                <td>{doc.owner?.name || '—'}</td>
                <td style={{ fontSize: 12, color: '#6b7280' }}>{doc.office}</td>
                <td>
                  {saved === doc._id
                    ? <span className="badge badge-found"><Icon name="check" size={11} />Saved!</span>
                    : editing === doc._id
                      ? <div style={{ display: 'flex', gap: 6 }}>
                          <select className="select-field" style={{ width: 160, padding: '6px 10px', fontSize: 13 }} value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                            {['Processing', 'Ready for Collection', 'Collected'].map(s => <option key={s}>{s}</option>)}
                          </select>
                          <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleUpdate(doc._id)}>Save</button>
                          <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setEditing(null)}>✕</button>
                        </div>
                      : <StatusBadge status={doc.status} />
                  }
                </td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{doc.updatedDate}</td>
                <td>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => { setEditing(doc._id); setNewStatus(doc.status); }}>
                    <Icon name="edit" size={12} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── AdminFound ───────────────────────────────────────────────────────────────
export const AdminFound = () => {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ docType: '', docNumber: '', ownerName: '', foundDate: '', foundLocation: '', depositedAt: '', foundBy: '' });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminFoundItems().then(res => setItems(res.data)).finally(() => setLoading(false));
  }, []);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    try {
      const res = await logFoundItem(form);
      setItems(prev => [res.data, ...prev]);
      setShowAdd(false);
      setSuccess('Found item logged. Matching lost reports have been notified.');
      setForm({ docType: '', docNumber: '', ownerName: '', foundDate: '', foundLocation: '', depositedAt: '', foundBy: '' });
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Found Items Management</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Log recovered documents into the registry</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><Icon name="plus" size={15} /> Log Found Item</button>
      </div>

      {success && <div className="alert alert-success"><Icon name="check" size={14} />{success}</div>}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Log Found Document</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">Document Type</label>
                  <select className="select-field" value={form.docType} onChange={e => update('docType', e.target.value)}>
                    <option value="">Select</option><option>National ID</option><option>Passport</option><option>Driving License</option><option>KRA PIN Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="label">Document Number</label>
                  <input className="input-field" value={form.docNumber} onChange={e => update('docNumber', e.target.value)} />
                </div>
              </div>
              <div><label className="label">Owner Name (as on document)</label><input className="input-field" value={form.ownerName} onChange={e => update('ownerName', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="label">Date Found</label><input className="input-field" type="date" value={form.foundDate} onChange={e => update('foundDate', e.target.value)} /></div>
                <div><label className="label">Location Found</label><input className="input-field" value={form.foundLocation} onChange={e => update('foundLocation', e.target.value)} /></div>
              </div>
              <div><label className="label">Deposited At</label><input className="input-field" placeholder="e.g. Machakos Police Station" value={form.depositedAt} onChange={e => update('depositedAt', e.target.value)} /></div>
              <div><label className="label">Found By</label><input className="input-field" placeholder="e.g. Police Officer" value={form.foundBy} onChange={e => update('foundBy', e.target.value)} /></div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAdd}><Icon name="plus" size={15} /> Log Item</button>
                <button className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead><tr><th>Type</th><th>Document No.</th><th>Owner</th><th>Found At</th><th>Deposited At</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><DocTypeIcon type={item.docType} /></div></td>
                <td><span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>{item.docNumber}</span></td>
                <td>{item.ownerName}</td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{item.foundLocation}</td>
                <td style={{ fontSize: 13 }}>{item.depositedAt}</td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{item.foundDate}</td>
                <td><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── AdminLost ────────────────────────────────────────────────────────────────
export const AdminLost = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminLostReports().then(res => setReports(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Lost Document Reports</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>All citizen reports submitted to the system</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Type</th><th>Doc Number</th><th>Reported By</th><th>Lost Location</th><th>Date</th><th>Status</th><th>Match?</th></tr></thead>
          <tbody>
            {reports.map(r => (
              <tr key={r._id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><DocTypeIcon type={r.docType} /><span style={{ fontSize: 12 }}>{r.docType}</span></div></td>
                <td><span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>{r.docNumber}</span></td>
                <td>{r.reportedBy?.name || '—'}<div style={{ fontSize: 11, color: '#9ca3af' }}>{r.reportedBy?.phone}</div></td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{r.lostLocation}</td>
                <td style={{ fontSize: 13 }}>{r.lostDate}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>{r.matchedItem ? <span className="badge badge-found"><Icon name="check" size={11} />Yes</span> : <span className="badge badge-pending">No</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── AdminUsers ───────────────────────────────────────────────────────────────
export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers().then(res => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Registered Citizens</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>{users.length} registered citizens in the system</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>National ID</th><th>Documents</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 99, background: '#e8f5ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0a5c36', fontSize: 12 }}>
                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{u.email}</td>
                <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>{u.phone}</td>
                <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>{u.nationalId}</td>
                <td><span className="badge badge-ready">{u.docCount} docs</span></td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
