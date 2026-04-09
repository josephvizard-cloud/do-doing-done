import { useState } from 'react';
import { submitTicket, generateTicketId } from './lib/tickets';
import { font, colors } from './config/styles';

import ResidentHome from './pages/ResidentHome';
import CategoryPick from './pages/CategoryPick';
import ReportDetails from './pages/ReportDetails';
import Confirmation from './pages/Confirmation';
import StaffDashboard from './pages/StaffDashboard';

function StatusBar() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 20px', fontSize: 13, fontWeight: 600,
      color: colors.navy, background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100,
      fontFamily: font,
    }}>
      <span>9:41</span>
      <span style={{ fontSize: 12, letterSpacing: 4 }}>📶 🔋</span>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState('resident'); // resident | staff
  const [screen, setScreen] = useState('home');
  const [category, setCategory] = useState(null);
  const [ticket, setTicket] = useState(null);

  const goHome = () => {
    setScreen('home');
    setCategory(null);
    setTicket(null);
  };

  const handleSubmit = async (details) => {
    try {
      // Try submitting to Supabase
      const saved = await submitTicket({
        categoryId: category.id,
        address: details.address,
        latitude: details.latitude,
        longitude: details.longitude,
        description: details.description,
        photoUrls: details.photoUrls,
      });
      setTicket(saved);
    } catch (err) {
      console.error('Supabase submit failed, using local fallback:', err);
      // Fallback: create ticket locally so the flow still works
      setTicket({
        id: generateTicketId(),
        category_id: category.id,
        head_id: category.head,
        address: details.address,
        description: details.description,
        status: 'new',
      });
    }
    setScreen('confirm');
  };

  return (
    <div style={{
      width: '100%', maxWidth: 420, minHeight: '100vh',
      margin: '0 auto', fontFamily: font, position: 'relative',
      background: role === 'staff' ? colors.bgStaff : colors.bg,
    }}>
      <StatusBar />

      {/* Role toggle */}
      <div style={{ display: 'flex', gap: 0, margin: '0 16px', background: '#E8ECF1', borderRadius: 10, padding: 3, position: 'relative', zIndex: 50 }}>
        {[
          { id: 'resident', label: '👤 Resident' },
          { id: 'staff', label: '👷 Staff' },
        ].map(r => (
          <button key={r.id} onClick={() => { setRole(r.id); if (r.id === 'resident') goHome(); }} style={{
            flex: 1, padding: '10px 0', borderRadius: 8,
            background: role === r.id ? '#fff' : 'transparent',
            border: 'none', fontSize: 14, fontWeight: 700,
            color: role === r.id ? colors.navy : colors.gray,
            cursor: 'pointer', fontFamily: font,
            boxShadow: role === r.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.2s ease',
          }}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Screens */}
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        {role === 'resident' && (
          <>
            {screen === 'home' && <ResidentHome onStart={() => setScreen('category')} />}
            {screen === 'category' && <CategoryPick onSelect={c => { setCategory(c); setScreen('details'); }} onBack={goHome} />}
            {screen === 'details' && category && <ReportDetails category={category} onSubmit={handleSubmit} onBack={() => setScreen('category')} />}
            {screen === 'confirm' && category && ticket && <Confirmation ticket={ticket} category={category} onDone={goHome} onViewStaff={() => setRole('staff')} />}
          </>
        )}
        {role === 'staff' && <StaffDashboard />}
      </div>
    </div>
  );
}
