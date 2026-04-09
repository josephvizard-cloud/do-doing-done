import { CATEGORIES } from '../config/routing';
import { font, shared } from '../config/styles';

export default function CategoryPick({ onSelect, onBack }) {
  return (
    <div style={shared.screen}>
      <div style={shared.topBar}>
        <button onClick={onBack} style={shared.backBtn}>← Back</button>
        <span style={shared.step}>Step 1 of 3</span>
      </div>
      <h2 style={shared.title}>What's the issue?</h2>
      <p style={shared.sub}>Tap the category that best fits. We'll route it to the right department head automatically.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => onSelect(c)} style={{
            background: '#fff', border: '2px solid #E8ECF1', borderRadius: 16,
            padding: '16px 8px 12px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            fontFamily: font,
          }}>
            <span style={{ fontSize: 28 }}>{c.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1a2744', textAlign: 'center' }}>{c.label}</span>
            <span style={{ fontSize: 9, color: '#8896AB', textAlign: 'center', lineHeight: 1.3 }}>{c.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
