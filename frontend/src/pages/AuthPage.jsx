import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../api/axios';
import API from '../api/axios';
import Icon from '../components/Icon';

const AuthPage = ({ mode = 'login', onNavigate }) => {
  const { login } = useAuth();
  const [tab, setTab] = useState(mode);
  const [form, setForm] = useState({ name: '', email: '', phone: '', nationalId: '', password: '', confirmPassword: '' });
  const [forgotForm, setForgotForm] = useState({ email: '', nationalId: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updateForgot = (k, v) => setForgotForm(f => ({ ...f, [k]: v }));

  const handleLogin = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    setError('');
    if (!form.name || !form.email || !form.phone || !form.nationalId || !form.password) {
      setError('All fields are required.'); return;
    }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, phone: form.phone, nationalId: form.nationalId, password: form.password });
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async () => {
    setError(''); setSuccess('');
    if (!forgotForm.email || !forgotForm.nationalId || !forgotForm.newPassword) {
      setError('All fields are required.'); return;
    }
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    if (forgotForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', {
        email: forgotForm.email,
        nationalId: forgotForm.nationalId,
        newPassword: forgotForm.newPassword,
      });
      setSuccess(res.data.message);
      setTimeout(() => {
        setShowForgot(false);
        setSuccess('');
        setForgotForm({ email: '', nationalId: '', newPassword: '', confirmPassword: '' });
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2ef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: '#0a5c36', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Icon name="shield" size={26} color="white" />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 22 }}>GovDocTrack Kenya</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Integrated Document Tracking System</p>
        </div>

        {/* Forgot Password Modal */}
        {showForgot ? (
          <div className="card fade-in" style={{ padding: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <button onClick={() => { setShowForgot(false); setError(''); setSuccess(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
                <Icon name="x" size={18} />
              </button>
              <h2 style={{ fontWeight: 800, fontSize: 18 }}>Reset Password</h2>
            </div>

            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>
              Enter your registered email and National ID to verify your identity, then set a new password.
            </p>

            {success && <div className="alert alert-success"><Icon name="check" size={14} /> {success}</div>}
            {error && <div className="alert alert-error"><Icon name="x" size={14} /> {error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Registered Email</label>
                <input className="input-field" type="email" placeholder="your@email.com" value={forgotForm.email} onChange={e => updateForgot('email', e.target.value)} />
              </div>
              <div>
                <label className="label">National ID Number</label>
                <input className="input-field" placeholder="Your National ID" value={forgotForm.nationalId} onChange={e => updateForgot('nationalId', e.target.value)} />
              </div>
              <div>
                <label className="label">New Password</label>
                <input className="input-field" type="password" placeholder="Min 6 characters" value={forgotForm.newPassword} onChange={e => updateForgot('newPassword', e.target.value)} />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input className="input-field" type="password" placeholder="Repeat new password" value={forgotForm.confirmPassword} onChange={e => updateForgot('confirmPassword', e.target.value)} />
              </div>
              <button className="btn-primary" style={{ justifyContent: 'center', padding: 14 }} onClick={handleForgotPassword} disabled={loading}>
                {loading ? 'Resetting...' : <><Icon name="key" size={15} /> Reset Password</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="card fade-in" style={{ padding: 36 }}>
            {/* Tabs */}
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 10, padding: 4, marginBottom: 28 }}>
              {['login', 'register'].map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); }}
                  style={{ flex: 1, padding: '9px', border: 'none', borderRadius: 8, fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                    background: tab === t ? 'white' : 'transparent',
                    color: tab === t ? '#0a5c36' : '#6b7280',
                    boxShadow: tab === t ? '0 1px 6px rgba(0,0,0,0.1)' : 'none'
                  }}>
                  {t === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {error && <div className="alert alert-error"><Icon name="alert" size={14} /> {error}</div>}

            {tab === 'login' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label">Email Address</label>
                  <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                </div>

                {/* Forgot Password Link */}
                <div style={{ textAlign: 'right', marginTop: -8 }}>
                  <button onClick={() => { setShowForgot(true); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#0a5c36', fontSize: 13, cursor: 'pointer', fontWeight: 600, fontFamily: "'Sora',sans-serif" }}>
                    Forgot password?
                  </button>
                </div>

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={handleLogin} disabled={loading}>
                  {loading ? 'Authenticating...' : <><Icon name="key" size={15} /> Sign In Securely</>}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="label">Full Name</label>
                  <input className="input-field" placeholder="Your full name" value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="label">Phone Number</label>
                    <input className="input-field" placeholder="07XXXXXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">National ID No.</label>
                    <input className="input-field" placeholder="XXXXXXXX" value={form.nationalId} onChange={e => update('nationalId', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Password</label>
                  <input className="input-field" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => update('password', e.target.value)} />
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input className="input-field" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={handleRegister} disabled={loading}>
                  {loading ? 'Creating Account...' : <><Icon name="user" size={15} /> Create Account</>}
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={() => onNavigate('landing')} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 13, cursor: 'pointer' }}>← Back to Homepage</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;