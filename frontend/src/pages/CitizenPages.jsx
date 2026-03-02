// ─── TrackDocument ───────────────────────────────────────────────────────────
import { useState } from 'react';
import { trackDocument } from '../api/axios';
import { StatusBadge, DocTypeIcon } from '../components/StatusBadge';
import Icon from '../components/Icon';

export const TrackDocument = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setSearched(false); setError('');
    try {
      const res = await trackDocument(query.trim());
      setResult(res.data);
    } catch (err) {
      setResult(null);
      if (err.response?.status === 404) setError('');
      else setError('Search failed. Please try again.');
    } finally {
      setSearched(true); setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Track Document</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Enter your document number to get real-time status</p>

      <div className="card" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
          <div>
            <label className="label">Document Number</label>
            <input className="input-field" placeholder="e.g. 34567890 or AK1234567" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <button className="btn-primary" style={{ height: 46 }} onClick={handleSearch} disabled={loading}>
            <Icon name="search" size={15} /> {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {searched && !result && !error && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <Icon name="search" size={40} color="#d1d5db" />
          <h3 style={{ fontWeight: 700, marginTop: 16 }}>No Document Found</h3>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }}>No document with that number exists. Please verify and try again.</p>
        </div>
      )}

      {result && (
        <div className="card fade-in" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <DocTypeIcon type={result.type} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: 18 }}>{result.type}</h2>
                  <div style={{ fontFamily: "'DM Mono',monospace", color: '#6b7280', fontSize: 14, marginTop: 2 }}>{result.docNumber}</div>
                </div>
                <StatusBadge status={result.status} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[['Applied Date', result.appliedDate], ['Last Updated', result.updatedDate], ['Office', result.office], ['Status', result.status]].map(([l, v]) => (
              <div key={l} style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{l}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Progress Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {result.timeline.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < result.timeline.length - 1 ? 20 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                  <div className={`timeline-dot ${step.done ? '' : 'inactive'}`} style={{ marginTop: 2 }} />
                  {i < result.timeline.length - 1 && <div style={{ width: 2, flex: 1, background: step.done ? '#0a5c36' : '#e5e7eb', marginTop: 4 }} />}
                </div>
                <div>
                  <div style={{ fontWeight: step.done ? 600 : 400, fontSize: 14, color: step.done ? '#0f1117' : '#9ca3af' }}>{step.step}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{step.date || 'Pending'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MyDocuments ─────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { getMyDocuments } from '../api/axios';

export const MyDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMyDocuments().then(res => setDocs(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading documents...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>My Documents</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>All your registered government documents</p>

      {docs.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <Icon name="file" size={40} color="#d1d5db" />
          <p style={{ color: '#6b7280', marginTop: 12 }}>No documents found. Apply through official government portals.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {docs.map(doc => (
            <div key={doc._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="doc-card" style={{ borderRadius: 0, border: 'none', cursor: 'pointer' }} onClick={() => setSelected(selected?._id === doc._id ? null : doc)}>
                <DocTypeIcon type={doc.type} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{doc.type}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", color: '#6b7280', fontSize: 13, marginTop: 2 }}>{doc.docNumber}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {doc.isLost && <span className="badge badge-lost"><Icon name="alert" size={11} />Lost</span>}
                      <StatusBadge status={doc.status} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>📍 {doc.office} · Applied: {doc.appliedDate}</div>
                </div>
                <Icon name="eye" size={16} color="#9ca3af" />
              </div>

              {selected?._id === doc._id && (
                <div className="fade-in" style={{ padding: '0 24px 20px', borderTop: '1px solid var(--border)' }}>
                  <h4 style={{ fontWeight: 700, fontSize: 14, marginTop: 16, marginBottom: 12, color: '#374151' }}>Status Timeline</h4>
                  <div style={{ display: 'flex' }}>
                    {doc.timeline.map((step, i) => (
                      <div key={i} style={{ flex: 1, position: 'relative' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: step.done ? '#0a5c36' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                            {step.done && <Icon name="check" size={12} color="white" />}
                          </div>
                          {i < doc.timeline.length - 1 && (
                            <div style={{ position: 'absolute', top: 11, left: '50%', width: '100%', height: 2, background: step.done ? '#0a5c36' : '#e5e7eb' }} />
                          )}
                          <div style={{ marginTop: 8, textAlign: 'center', maxWidth: 80 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: step.done ? '#0f1117' : '#9ca3af' }}>{step.step}</div>
                            <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{step.date || '—'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ReportLost ───────────────────────────────────────────────────────────────
import { useAuth } from '../context/AuthContext';
import { submitLostReport } from '../api/axios';

export const ReportLost = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ docType: '', docNumber: '', lostDate: '', lostLocation: '', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matchedItem, setMatchedItem] = useState(null);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    if (!form.docType || !form.docNumber || !form.lostDate || !form.lostLocation) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true);
    try {
      const res = await submitLostReport({ ...form, ownerName: user.name });
      setMatchedItem(res.data.matchedItem);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="fade-in" style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: 99, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon name="check" size={28} color="#059669" />
      </div>
      <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Report Submitted!</h2>
      {matchedItem ? (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontWeight: 700, color: '#15803d', marginBottom: 4 }}>🎉 Match Found Immediately!</div>
          <p style={{ fontSize: 14, color: '#374151' }}>Your document was already recovered! It's deposited at <strong>{matchedItem.depositedAt}</strong>. Visit with your original ID to collect.</p>
        </div>
      ) : (
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>We'll notify you when a matching document is found at any Huduma Centre or Police Station.</p>
      )}
      <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ docType: '', docNumber: '', lostDate: '', lostLocation: '', description: '' }); }}>
        <Icon name="plus" size={15} /> Submit Another Report
      </button>
    </div>
  );

  return (
    <div className="fade-in" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Report Lost Document</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>Fill in the details to log your lost document in the system</p>
      <div className="alert alert-info">Protected under Kenya's Data Protection Act, 2019. Your report is only visible to authorized officers.</div>
      {error && <div className="alert alert-error"><Icon name="x" size={14} /> {error}</div>}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Document Type *</label>
              <select className="select-field" value={form.docType} onChange={e => update('docType', e.target.value)}>
                <option value="">Select type</option>
                <option>National ID</option><option>Passport</option><option>Driving License</option><option>KRA PIN Certificate</option>
              </select>
            </div>
            <div>
              <label className="label">Document Number *</label>
              <input className="input-field" placeholder="e.g. 34567890" value={form.docNumber} onChange={e => update('docNumber', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Date Lost *</label>
              <input className="input-field" type="date" value={form.lostDate} onChange={e => update('lostDate', e.target.value)} />
            </div>
            <div>
              <label className="label">Location Lost *</label>
              <input className="input-field" placeholder="e.g. Machakos Town" value={form.lostLocation} onChange={e => update('lostLocation', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Additional Description</label>
            <textarea className="input-field" style={{ height: 80, resize: 'vertical' }} placeholder="Any details that may help identify the document..." value={form.description} onChange={e => update('description', e.target.value)} />
          </div>
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 16px', fontSize: 13 }}>
            <strong>Reporting as:</strong> {user?.name} · ID: {user?.nationalId} · {user?.phone}
          </div>
          <button className="btn-primary" style={{ justifyContent: 'center', padding: 14 }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : <><Icon name="flag" size={15} /> Submit Lost Document Report</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── FoundItems ───────────────────────────────────────────────────────────────
import { getFoundItems } from '../api/axios';

export const FoundItems = () => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (q = '') => {
    setLoading(true);
    try {
      const res = await getFoundItems({ query: q });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchItems(query);

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Found Documents Registry</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Search for documents recovered and deposited at Huduma Centres or Police Stations</p>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <input className="input-field" placeholder="Search by name or document number..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <button className="btn-primary" onClick={handleSearch}><Icon name="search" size={15} /></button>
        </div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <div key={item._id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <DocTypeIcon type={item.docType} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{item.docType}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", color: '#6b7280', fontSize: 13 }}>{item.docNumber}</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Owner: <strong>{item.ownerName}</strong></div>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[['📍 Found At', item.foundLocation], ['🏛 Deposited At', item.depositedAt], ['📅 Found Date', item.foundDate]].map(([l, v]) => (
                  <div key={l} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              {item.status === 'Awaiting Owner' && (
                <div style={{ marginTop: 12, fontSize: 13, color: '#15803d', background: '#f0fdf4', borderRadius: 8, padding: '10px 12px' }}>
                  Visit <strong>{item.depositedAt}</strong> with valid ID to verify ownership and collect.
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <div className="card" style={{ padding: 40, textAlign: 'center' }}><p style={{ color: '#6b7280' }}>No found items match your search.</p></div>}
        </div>
      )}
    </div>
  );
};

// ─── MyReports ────────────────────────────────────────────────────────────────
import { getMyLostReports } from '../api/axios';

export const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLostReports().then(res => setReports(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>My Loss Reports</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Track reports you've submitted for lost documents</p>

      {reports.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <Icon name="list" size={40} color="#d1d5db" />
          <p style={{ color: '#6b7280', marginTop: 12 }}>No reports submitted yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reports.map(r => (
            <div key={r._id} className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <DocTypeIcon type={r.docType} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{r.docType}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#6b7280' }}>{r.docNumber}</div>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                {[['Lost Date', r.lostDate], ['Location', r.lostLocation], ['Reported', new Date(r.createdAt).toLocaleDateString()]].map(([l, v]) => (
                  <div key={l} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              {r.description && <div style={{ fontSize: 13, color: '#6b7280', marginBottom: r.matchedItem ? 12 : 0 }}>Description: {r.description}</div>}
              {r.matchedItem && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#15803d' }}>
                  <strong>🎉 Match Found!</strong> Your document is at <strong>{r.matchedItem.depositedAt}</strong>. Visit with valid ID to collect.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
