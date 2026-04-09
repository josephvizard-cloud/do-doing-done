import { useState, useEffect } from 'react';
import { DEPT_HEADS, RESPONSE_TIMES } from '../config/routing';
import { font, colors, shared } from '../config/styles';

export default function Confirmation({ ticket, category, onDone, onViewStaff }) {
  const head = DEPT_HEADS[category.head];
  const [confetti, setConfetti] = useState(true);
  useEffect(() => { const t = setTimeout(() => setConfetti(false), 3000); return () => clearTimeout(t); }, []);

  const rows = [
    ['Ticket', ticket.id],
    ['Category', `${category.icon} ${category.label}`],
    ['Routed To', `${head.name} — ${head.dept}`],
    ['Est. Response', RESPONSE_TIMES[category.id]],
    ['Location', ticket.address],
  ];

  return (
    <div style={shared.screen}>
      {/* Confetti */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: confetti ? 1 : 0, transition: 'opacity 1s ease' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} style={{
            position: 'absolute', width: 8, height: 8, borderRadius: 4,
            left: `${Math.random() * 100}%`, top: -10,
            backgroundColor: [colors.orange, colors.blue, colors.green, colors.yellow, colors.red][i % 5],
            animation: `cfall 2.5s ${Math.random() * 1.5}s ease-in forwards`,
          }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '20px 0' }}>
        {/* Check mark */}
        <div style={{ width: 72, height: 72, borderRadius: 36, background: `linear-gradient(135deg, ${colors.green}, ${colors.greenDk})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#fff', fontWeight: 800, boxShadow: '0 8px 24px rgba(56,161,105,0.35)', marginBottom: 16 }}>✓</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: colors.navy, margin: '0 0 6px', letterSpacing: -0.5, fontFamily: font }}>Report Submitted!</h2>
        <p style={{ fontSize: 15, color: colors.gray, margin: '0 0 20px' }}>Thanks for helping Waltham. We're on it.</p>

        {/* Details card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', textAlign: 'left', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${colors.grayBorder}`, marginBottom: 16 }}>
          {rows.map(([label, val], i) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <span style={{ fontSize: 13, color: colors.grayLight, fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 14, color: label === 'Est. Response' ? colors.green : colors.navy, fontWeight: 700, textAlign: 'right' }}>{val}</span>
              </div>
              {i < rows.length - 1 && <div style={{ height: 1, background: '#F0F3F7' }} />}
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: colors.gray, lineHeight: 1.6, padding: '0 8px', margin: '0 0 20px' }}>
          You'll get email/SMS updates as the status changes. No need to follow up — we'll keep you posted automatically.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onDone} style={{ width: '100%', padding: '14px', borderRadius: 14, background: `linear-gradient(135deg, ${colors.navy}, ${colors.navyMid})`, border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>
            Done — Back Home
          </button>
          {onViewStaff && (
            <button onClick={onViewStaff} style={{ width: '100%', padding: '12px', borderRadius: 14, background: 'transparent', border: `2px solid ${colors.grayBorder}`, color: colors.gray, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
              👷 See Staff View →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
