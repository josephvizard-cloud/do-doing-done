import { useState } from 'react';
import { font, colors } from '../config/styles';

// Staff PINs — one per department head
// In production, store these in Supabase or env vars
const VALID_PINS = {
  '1234': { name: 'Staff', headId: 'all' },        // Master PIN for demo
  '3140': { name: 'Chiasson', headId: 'chiasson' }, // Last 4 of phone
  '3175': { name: 'Kelly', headId: 'kelly' },
  '3285': { name: 'Bower', headId: 'bower' },
  '3475': { name: 'Hebert', headId: 'hebert' },
};

export default function StaffPinGate({ onAuth }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError(false);

    if (next.length === 4) {
      const staff = VALID_PINS[next];
      if (staff) {
        onAuth(staff);
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => { setPin(''); setShake(false); }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPin(p => p.slice(0, -1));
    setError(false);
  };

  const dots = Array.from({ length: 4 }).map((_, i) => (
    <div key={i} style={{
      width: 16, height: 16, borderRadius: 8,
      background: i < pin.length ? colors.navy : 'transparent',
      border: `2px solid ${error ? colors.red : i < pin.length ? colors.navy : '#CBD5E0'}`,
      transition: 'all 0.15s ease',
    }} />
  ));

  const numpad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['', 0, '⌫'],
  ];

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px',
      background: `linear-gradient(170deg, ${colors.navy} 0%, ${colors.navyMid} 40%, ${colors.navyLight} 100%)`,
      minHeight: 'calc(100vh - 80px)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <span style={{ fontSize: 26 }}>👷</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 6px', fontFamily: font }}>Staff Access</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Enter your 4-digit PIN</p>
      </div>

      {/* PIN dots */}
      <div style={{
        display: 'flex', gap: 16, marginBottom: 8,
        animation: shake ? 'pinShake 0.4s ease' : 'none',
      }}>
        {dots}
      </div>

      {error && (
        <p style={{ fontSize: 13, color: '#FC8181', margin: '8px 0 0', fontWeight: 600 }}>Wrong PIN — try again</p>
      )}

      {/* Numpad */}
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {numpad.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            {row.map((key, ki) => (
              <button
                key={ki}
                onClick={() => {
                  if (key === '⌫') handleDelete();
                  else if (key !== '') handleDigit(String(key));
                }}
                disabled={key === ''}
                style={{
                  width: 72, height: 56, borderRadius: 14,
                  background: key === '' ? 'transparent' : 'rgba(255,255,255,0.12)',
                  border: key === '' ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', fontSize: key === '⌫' ? 20 : 24, fontWeight: 600,
                  cursor: key === '' ? 'default' : 'pointer',
                  fontFamily: font,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 32, textAlign: 'center' }}>
        Demo PIN: 1234
      </p>
    </div>
  );
}
