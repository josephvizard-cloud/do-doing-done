import { useState } from 'react';
import { fetchMyTickets } from '../lib/tickets';
import { CATEGORIES, STATUSES } from '../config/routing';
import { font, colors, shared } from '../config/styles';

export default function MyReports({ onBack }) {
  const [email, setEmail] = useState('');
  const [tickets, setTickets] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!email.includes('@')) return;
    setLoading(true);
    try {
      const data = await fetchMyTickets(email);
      setTickets(data);
    } catch {
      setTickets([]);
    }
    setLoading(false);
  };

  const getStatus = (s) => STATUSES[s] || { label: s, color: colors.gray, bg: '#F0F3F7' };

  return (
    <div style={shared.screen}>
      <div style={shared.topBar}>
        <button onClick={onBack} style={shared.backBtn}>← Back</button>
        <span style={shared.step}>My Reports</span>
      </div>

      <h2 style={shared.title}>My Reports</h2>
      <p style={shared.sub}>Enter the email you used when submitting to see your reports and their status.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLookup()}
          placeholder="you@email.com"
          style={{
            flex: 1, padding: '12px 14px', borderRadius: 12,
            border: `2px solid ${colors.grayBorder}`, fontSize: 14,
            fontFamily: font, color: colors.navy, boxSizing: 'border-box',
            outline: 'none',
          }}
        />
        <button
          onClick={handleLookup}
          disabled={loading || !email.includes('@')}
          style={{
            padding: '12px 20px', borderRadius: 12,
            background: colors.navy, border: 'none',
            color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: font,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '...' : 'Look Up'}
        </button>
      </div>

      {/* Results */}
      {tickets !== null && tickets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <span style={{ fontSize: 40 }}>📭</span>
          <p style={{ fontSize: 15, color: colors.grayLight, marginTop: 8 }}>No reports found for this email.</p>
          <p style={{ fontSize: 13, color: colors.grayLight }}>Make sure it matches what you entered when reporting.</p>
        </div>
      )}

      {tickets && tickets.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tickets.map(t => {
            const cat = CATEGORIES.find(c => c.id === t.category_id) || { icon: '📋', label: 'Other' };
            const status = getStatus(t.status);
            const date = new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <div key={t.id} style={{
                background: '#fff', borderRadius: 14,
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${status.color}`,
                padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 20 }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>{cat.label}</div>
                      <div style={{ fontSize: 12, color: colors.gray }}>📍 {t.address}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, borderRadius: 6,
                    padding: '3px 10px', textTransform: 'uppercase',
                    color: status.color, background: status.bg,
                    letterSpacing: 0.5,
                  }}>
                    {status.label}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: colors.grayLight }}>
                  <span>{t.id}</span>
                  <span>{date}</span>
                  {t.description && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{t.description}</span>}
                </div>

                {/* Show resolve photo if done */}
                {t.status === 'resolved' && (
                  <div style={{
                    marginTop: 8, padding: '8px 10px', background: '#F0FFF4',
                    borderRadius: 8, fontSize: 13, color: colors.green, fontWeight: 600,
                  }}>
                    ✓ Done — {t.resolved_at ? `Fixed on ${new Date(t.resolved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Resolved'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
