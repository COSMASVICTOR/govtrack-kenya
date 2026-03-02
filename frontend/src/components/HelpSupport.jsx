import { useState } from 'react';
import Icon from './Icon';

const FAQS = [
  { q: 'How do I track my document?', a: 'Click "Track Document" in the sidebar and enter your document number. You will see the full status timeline.' },
  { q: 'How long does a National ID take?', a: 'National ID processing typically takes 2-4 weeks after application submission at your nearest Huduma Centre.' },
  { q: 'What do I do if my document is lost?', a: 'Click "Report Lost" in the sidebar, fill in the details and submit. The system will automatically notify you if a matching found item is logged.' },
  { q: 'I found someone\'s document. What do I do?', a: 'Click "Report Found Doc" in the sidebar, fill in the details, then physically drop the document at your nearest Huduma Centre or Police Station.' },
  { q: 'How do I collect my ready document?', a: 'Visit the office shown on your document card with your original National ID for verification. Collection is free of charge.' },
  { q: 'Can I change my email address?', a: 'No. Email cannot be changed once registered. You can update your name and phone number in My Profile.' },
  { q: 'I forgot my password. How do I reset it?', a: 'On the login page, click "Forgot password?" and verify using your registered email and National ID number.' },
];

const HelpSupport = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.subject || !form.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ subject: '', message: '' });
    }, 3000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 52, height: 52,
          borderRadius: 99, background: '#0a5c36', color: 'white', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(10,92,54,0.4)', zIndex: 998, fontSize: 22,
          transition: 'all 0.2s',
        }}
        title="Help & Support"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Support Panel */}
      {open && (
        <div className="fade-in" style={{
          position: 'fixed', bottom: 88, right: 24, width: 340,
          background: 'white', borderRadius: 16, border: '1px solid var(--border)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)', zIndex: 997, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ background: '#0a5c36', padding: '16px 20px' }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>💬 Help & Support</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>GovDocTrack Kenya · How can we help?</div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {['faq', 'contact'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ flex: 1, padding: '10px', border: 'none', background: activeTab === t ? '#f0fdf4' : 'white',
                  color: activeTab === t ? '#0a5c36' : '#6b7280', fontWeight: activeTab === t ? 700 : 400,
                  fontSize: 13, cursor: 'pointer', borderBottom: activeTab === t ? '2px solid #0a5c36' : '2px solid transparent',
                  fontFamily: "'Sora',sans-serif", transition: 'all 0.15s'
                }}>
                {t === 'faq' ? '❓ FAQs' : '📩 Contact Us'}
              </button>
            ))}
          </div>

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, fontFamily: "'Sora',sans-serif" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', lineHeight: 1.4 }}>{faq.q}</span>
                    <span style={{ color: '#6b7280', fontSize: 16, flexShrink: 0 }}>{expandedFaq === i ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === i && (
                    <div style={{ padding: '0 16px 14px', fontSize: 13, color: '#6b7280', lineHeight: 1.6, background: '#f9fafb' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div style={{ padding: 16 }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Message Sent!</div>
                  <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>We'll get back to you shortly.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
                    Having an issue? Send us a message and we'll help you out.
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <select className="select-field" value={form.subject} onChange={e => update('subject', e.target.value)}>
                      <option value="">Select issue type</option>
                      <option>Cannot login to my account</option>
                      <option>Document status not updating</option>
                      <option>Lost report not showing</option>
                      <option>Found item not matching</option>
                      <option>Profile update not saving</option>
                      <option>PDF download not working</option>
                      <option>Other issue</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Message</label>
                    <textarea className="input-field" style={{ height: 90, resize: 'none' }}
                      placeholder="Describe your issue in detail..."
                      value={form.message} onChange={e => update('message', e.target.value)} />
                  </div>
                  <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={handleSubmit}
                    disabled={!form.subject || !form.message}>
                    <Icon name="flag" size={14} /> Send Message
                  </button>
                  <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
                    or email us: govdoctrack@gmail.com 
                    or call us at +254794369733 
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HelpSupport;