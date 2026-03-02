import Icon from '../components/Icon';

const LandingPage = ({ onNavigate }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: 'white', fontFamily: "'Sora', sans-serif" }}>
      {/* NAV */}
      <nav style={{ padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0a5c36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="shield" size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18 }}>GovDocTrack <span style={{ color: '#22c55e', fontWeight: 400 }}>Kenya</span></span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.25)' }} onClick={() => onNavigate('login')}>Sign In</button>
          <button className="btn-primary" onClick={() => onNavigate('register')}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: '80px 48px 60px', maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 32 }}>
          {['#0a5c36', '#000000', '#c8102e', '#000000', '#0a5c36'].map((c, i) => (
            <div key={i} style={{ width: 28, height: 6, borderRadius: 99, background: c }} />
          ))}
        </div>

        <div className="fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 99, padding: '6px 16px', fontSize: 13, color: '#4ade80', marginBottom: 24 }}>
          <Icon name="shield" size={13} color="#4ade80" /> Kenya Digital Government Initiative · 2026
        </div>

        <h1 className="fade-in-delay-1" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 20 }}>
          One Dashboard.<br />
          <span style={{ color: '#22c55e' }}>All Your</span> Documents.
        </h1>

        <p className="fade-in-delay-2" style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Track your National ID, Passport, Driving License and KRA PIN — all in one place. Report lost documents and find recovered items instantly.
        </p>

        <div className="fade-in-delay-3" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn-primary" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => onNavigate('register')}>
            <Icon name="user" size={16} /> Create Free Account
          </button>
          <button className="btn-secondary" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.25)', padding: '14px 32px', fontSize: 16 }} onClick={() => onNavigate('found-public')}>
            <Icon name="search" size={16} /> Search Found Items
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 48, padding: '40px 48px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {[['4', 'Document Types'], ['Real-time', 'Status Tracking'], ['JWT Secure', 'Authentication'], ['Centralized', 'Lost & Found']].map(([val, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e' }}>{val}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{ padding: '60px 48px', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 8, letterSpacing: '-1px' }}>Why GovDocTrack?</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 40, fontSize: 15 }}>Solving Kenya's document tracking fragmentation problem</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { icon: 'eye',    title: 'Unified Tracking',   desc: 'Check status of all government documents from a single dashboard. No more juggling multiple portals.' },
            { icon: 'flag',   title: 'Lost & Found System', desc: 'Report lost documents or search recovered items deposited at Huduma Centres and Police Stations.' },
            { icon: 'shield', title: 'Secure & Private',   desc: 'JWT authentication and role-based access ensures only you can see your sensitive document information.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon name={icon} size={20} color="#22c55e" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 48px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
        © 2026 GovDocumentTracker · Developed by Victor Mauti Cosmas
      </div>
    </div>
  );
};

export default LandingPage;
