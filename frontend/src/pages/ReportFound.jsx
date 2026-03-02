import { useState } from 'react';
import Icon from '../components/Icon';
import { reportFoundItem } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const DROPOFF_LOCATIONS = [
  'Machakos Huduma Centre',
  'Machakos Police Station',
  'Athi River Huduma Centre',
  'Athi River Police Station',
  'Mlolongo Huduma Centre',
  'Kathiani Huduma Centre',
  'Mavoko Sub-County Office',
  'Matungulu Huduma Centre',
];

const ReportFound = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    docType: '', docNumber: '', ownerName: '',
    foundDate: '', foundLocation: '', depositedAt: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matchFound, setMatchFound] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    if (!form.docType || !form.docNumber || !form.ownerName ||
        !form.foundDate || !form.foundLocation || !form.depositedAt) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true);
    try {
      const res = await reportFoundItem(form);
      setMatchFound(res.matchFound);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="fade-in" style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: 99, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon name="check" size={28} color="#059669"/>
      </div>
      <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Thank You! 🙏</h2>
      <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 16 }}>
        Your found document report has been logged. You're helping a fellow citizen!
      </p>
      {matchFound && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: '#15803d', marginBottom: 4 }}>🎉 Owner Located!</div>
          <p style={{ fontSize: 14, color: '#374151' }}>
            The owner has an active lost report and will be notified to collect from <strong>{form.depositedAt}</strong>.
          </p>
        </div>
      )}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
        <div style={{ fontWeight: 700, color: '#1d4ed8', marginBottom: 8 }}>📋 Next Step — Drop Off the Document</div>
        <p style={{ fontSize: 14, color: '#374151' }}>
          Please physically take the document to:<br/>
          <strong style={{ fontSize: 15 }}>{form.depositedAt}</strong><br/>
          <span style={{ fontSize: 13, color: '#6b7280' }}>Present this report when dropping off.</span>
        </p>
      </div>
      <button className="btn-primary" onClick={() => {
        setSubmitted(false);
        setForm({ docType: '', docNumber: '', ownerName: '', foundDate: '', foundLocation: '', depositedAt: '' });
      }}>
        <Icon name="plus" size={15}/> Report Another Found Document
      </button>
    </div>
  );

  return (
    <div className="fade-in" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Report a Found Document</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
        Found someone's document? Report it here and drop it at your nearest Huduma Centre or Police Station.
      </p>

      <div className="alert alert-info">
        <Icon name="alert" size={14}/> After submitting, please physically drop the document at your chosen location within 24 hours.
      </div>

      {error && <div className="alert alert-error"><Icon name="x" size={14}/> {error}</div>}

      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Document Type *</label>
              <select className="select-field" value={form.docType} onChange={e => update('docType', e.target.value)}>
                <option value="">Select type</option>
                <option>National ID</option>
                <option>Passport</option>
                <option>Driving License</option>
                <option>KRA PIN Certificate</option>
              </select>
            </div>
            <div>
              <label className="label">Document Number *</label>
              <input className="input-field" placeholder="Number on the document" value={form.docNumber} onChange={e => update('docNumber', e.target.value)}/>
            </div>
          </div>

          <div>
            <label className="label">Owner's Name (as on document) *</label>
            <input className="input-field" placeholder="Full name on the document" value={form.ownerName} onChange={e => update('ownerName', e.target.value)}/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Date Found *</label>
              <input className="input-field" type="date" value={form.foundDate} onChange={e => update('foundDate', e.target.value)}/>
            </div>
            <div>
              <label className="label">Location Found *</label>
              <input className="input-field" placeholder="e.g. Machakos Bus Stage" value={form.foundLocation} onChange={e => update('foundLocation', e.target.value)}/>
            </div>
          </div>

          <div>
            <label className="label">Where will you drop it off? *</label>
            <select className="select-field" value={form.depositedAt} onChange={e => update('depositedAt', e.target.value)}>
              <option value="">Select nearest location</option>
              {DROPOFF_LOCATIONS.map(loc => <option key={loc}>{loc}</option>)}
            </select>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
              Please drop the document at this location within 24 hours.
            </p>
          </div>

          <div style={{ background: '#f9fafb', borderRadius: 10, padding: '14px 16px', fontSize: 13 }}>
            <strong>Reporting as:</strong> {user?.name} · {user?.phone}
          </div>

          <button className="btn-primary" style={{ justifyContent: 'center', padding: 14 }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : <><Icon name="inbox" size={15}/> Submit Found Document Report</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFound;