import { useState, useEffect } from 'react';
import { CATEGORIES } from '../config/routing';
import { fetchTickets, subscribeToTickets } from '../lib/tickets';
import TicketCard from '../components/TicketCard';
import { font, colors } from '../config/styles';

const FILTERS = [
  { id: 'all',      label: 'All',      icon: '📋' },
  { id: 'chiasson', label: 'Chiasson', icon: '🛣️' },
  { id: 'kelly',    label: 'Kelly',    icon: '💡' },
  { id: 'bower',    label: 'Bower',    icon: '🏗️' },
  { id: 'hebert',   label: 'Hebert',   icon: '⛲' },
];

export default function StaffDashboard({ staffFilter = 'all', staffName = 'Staff', onLogout }) {
  const [filter, setFilter] = useState(staffFilter !== 'all' ? staffFilter : 'all');
  const [view, setView] = useState('active');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tickets from Supabase
  useEffect(() => {
    loadTickets();
    const unsub = subscribeToTickets((payload) => {
      // Real-time update: refresh the list
      loadTickets();
    });
    return unsub;
  }, []);

  const loadTickets = async () => {
    try {
      const data = await fetchTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      // Keep whatever we have locally
    }
    setLoading(false);
  };

  const handleUpdate = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, status: newStatus } : t
    ));
  };

  // Filter
  const filtered = tickets.filter(t => {
    const cat = CATEGORIES.find(c => c.id === t.category_id);
    const headMatch = filter === 'all' || (cat && cat.head === filter);
    const statusMatch = view === 'active' ? t.status !== 'resolved' : t.status === 'resolved';
    return headMatch && statusMatch;
  });

  const activeCount = tickets.filter(t => t.status !== 'resolved').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.bgStaff }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(170deg, ${colors.navy}, ${colors.navyMid})`, padding: '16px 20px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: -0.5, fontFamily: font }}>Do, Doing, Done.</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '2px 0 0', fontWeight: 500 }}>
              Logged in: {staffName}
              {onLogout && <span onClick={onLogout} style={{ marginLeft: 8, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 11 }}>Log out</span>}
            </p>
          </div>
          <div style={{ background: 'rgba(240,101,47,0.9)', borderRadius: 14, padding: '8px 14px', textAlign: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1, display: 'block' }}>{activeCount}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 1 }}>Open</span>
          </div>
        </div>

        {/* Department head filters */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {FILTERS.map(f => {
            const cnt = f.id === 'all' ? activeCount : tickets.filter(t => {
              const c = CATEGORIES.find(x => x.id === t.category_id);
              return c && c.head === f.id && t.status !== 'resolved';
            }).length;
            const active = filter === f.id;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '7px 12px', borderRadius: 10,
                background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
                color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap', fontFamily: font, flexShrink: 0,
              }}>
                <span>{f.icon}</span><span>{f.label}</span>
                {cnt > 0 && <span style={{ fontSize: 10, fontWeight: 800, borderRadius: 8, padding: '1px 6px', minWidth: 16, textAlign: 'center', background: active ? '#fff' : '#E8ECF1', color: active ? colors.navy : colors.gray }}>{cnt}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active / Resolved toggle */}
      <div style={{ display: 'flex', gap: 0, margin: '12px 20px 0', background: '#E8ECF1', borderRadius: 10, padding: 3 }}>
        {['active', 'resolved'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: '8px 0', borderRadius: 8,
            background: view === v ? '#fff' : 'transparent',
            border: 'none', fontSize: 13, fontWeight: 600,
            color: view === v ? colors.navy : colors.gray,
            cursor: 'pointer', fontFamily: font,
            boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          }}>
            {v === 'active' ? `Active (${activeCount})` : `Resolved (${resolvedCount})`}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div style={{ padding: '12px 16px 80px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: 15, color: colors.grayLight }}>Loading tickets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <span style={{ fontSize: 40 }}>{view === 'active' ? '🎉' : '📂'}</span>
            <p style={{ fontSize: 15, color: colors.grayLight, marginTop: 8 }}>{view === 'active' ? "All clear — no open tickets!" : 'No resolved tickets yet'}</p>
          </div>
        ) : (
          filtered.map(t => <TicketCard key={t.id} ticket={t} onUpdate={handleUpdate} />)
        )}
      </div>

      {/* Bottom hint */}
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 20px', textAlign: 'center', fontSize: 11, color: colors.grayLight, fontWeight: 500, background: `linear-gradient(transparent, ${colors.bgStaff} 30%)`, paddingTop: 24 }}>
        Tickets auto-route to department heads · No manual triage needed
      </div>
    </div>
  );
}
