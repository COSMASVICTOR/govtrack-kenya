import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import API from '../api/axios';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updatePwd = (k, v) => setPasswordForm(f => ({ ...f, [k]: v }));

  const handleUpdateInfo = async () => {
    setError(''); setSuccess('');
    if (!form.name || !form.phone) {
      setError('Name and phone are required.'); return;
    }
    setLoading(true);
    try {
      const res = await API.patch('/auth/profile', form);
      login(localStorage.getItem('govtrack_token'), res.data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError(''); setSuccess('');
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setError('All password fields are required.'); return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match.'); return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      await API.patch('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="fade-in" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>My Profile</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
        Manage your account information and password
      </p>

      {/* Avatar Card */}
      <div className="card" style={{ padding: 24, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 99, background: '#e8f5ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0a5c36', fontSize: 22, flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{user?.name}</div>
          <div style={{ color: '#6b7280', fontSize: 14, marginTop: 2 }}>{user?.email}</div>
          <div style={{ marginTop: 6 }}>
            <span className="badge badge-ready">
              <Icon name="shield" size={11} /> {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 10, padding: 4, marginBottom: 20 }}>
        {['info', 'password'].map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setError(''); setSuccess(''); }}
            style={{ flex: 1, padding: '9px', border: 'none', borderRadius: 8, fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? '#0a5c36' : '#6b7280',
              boxShadow: activeTab === tab ? '0 1px 6px rgba(0,0,0,0.1)' : 'none'
            }}>
            {tab === 'info' ? '👤 Personal Info' : '🔒 Change Password'}
          </button>
        ))}
      </div>

      {success && (
        <div className="alert alert-success">
          <Icon name="check" size={14} /> {success}
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <Icon name="x" size={14} /> {error}
        </div>
      )}

      {/* Personal Info Tab */}
      {activeTab === 'info' && (
        <div className="card fade-in" style={{ padding: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Full Name</label>
              <input className="input-field" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input className="input-field" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input className="input-field" value={user?.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Email cannot be changed.</p>
            </div>
            <div>
              <label className="label">National ID</label>
              <input className="input-field" value={user?.nationalId} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>National ID cannot be changed.</p>
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center', padding: 14 }} onClick={handleUpdateInfo} disabled={loading}>
              {loading ? 'Saving...' : <><Icon name="check" size={15} /> Save Changes</>}
            </button>
          </div>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="card fade-in" style={{ padding: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Current Password</label>
              <input className="input-field" type="password" placeholder="Enter current password" value={passwordForm.currentPassword} onChange={e => updatePwd('currentPassword', e.target.value)} />
            </div>
            <div>
              <label className="label">New Password</label>
              <input className="input-field" type="password" placeholder="Min 6 characters" value={passwordForm.newPassword} onChange={e => updatePwd('newPassword', e.target.value)} />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input className="input-field" type="password" placeholder="Repeat new password" value={passwordForm.confirmPassword} onChange={e => updatePwd('confirmPassword', e.target.value)} />
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center', padding: 14 }} onClick={handleChangePassword} disabled={loading}>
              {loading ? 'Changing...' : <><Icon name="key" size={15} /> Change Password</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;