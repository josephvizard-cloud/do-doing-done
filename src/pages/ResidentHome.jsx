import { useState, useEffect } from 'react';
import { font, colors } from '../config/styles';

export default function ResidentHome({ onStart, onMyReports }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 2200); return () => clearInterval(t); }, []);

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(170deg, ${colors.navy} 0%, ${colors.navyMid} 40%, ${colors.navyLight} 100%)` }} />
      <div style={{ position: 'relative', zIndex: 1, padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${colors.orange}, #FF8A5C)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(240,101,47,0.35)' }}>
            <span style={{ fontSize: 30 }}>⚡</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: -1, fontFamily: font }}>Do, Doing, Done.</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontWeight: 500 }}>Waltham's Action Line</p>
        </div>

        {/* Hero button */}
        <button onClick={onStart} style={{
          width: '100%', padding: '24px 20px', borderRadius: 20,
          background: `linear-gradient(135deg, ${colors.orange}, ${colors.orangeDk})`,
          border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          boxShadow: '0 12px 32px rgba(240,101,47,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          transform: pulse ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
          fontFamily: font,
        }}>
          <span style={{ fontSize: 32 }}>📍</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>Report an Issue</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Takes less than 30 seconds</span>
        </button>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          {[{ n: '127', l: 'Fixed This Month' }, { n: '1,204', l: 'Residents Helping' }].map((s, i) => (
            <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 8px', textAlign: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.n}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* My Reports */}
        <button onClick={onMyReports} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 24px', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: font }}>
          <span>📂</span> My Reports
        </button>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 8 }}>City of Waltham, MA · Powered by residents like you</p>
      </div>
    </div>
  );
}
