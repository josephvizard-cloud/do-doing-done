import { useState, useEffect } from 'react';
import { findDuplicates } from '../lib/tickets';
import { colors, font } from '../config/styles';

export default function DuplicateCheck({ categoryId, address, onAddToExisting }) {
  const [dupes, setDupes] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!categoryId || !address || address.length < 5) {
      setDupes([]);
      setChecked(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const found = await findDuplicates(categoryId, address);
        setDupes(found);
      } catch {
        setDupes([]);
      }
      setChecked(true);
    }, 800); // Debounce

    return () => clearTimeout(timer);
  }, [categoryId, address]);

  if (!checked || dupes.length === 0) return null;

  return (
    <div style={{
      background: '#EBF4FF', border: '1px solid #BEE3F8',
      borderRadius: 12, padding: '12px 14px', marginBottom: 16,
    }}>
      <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: colors.navy, fontFamily: font }}>
        📋 Similar report already open
      </p>
      <p style={{ margin: '0 0 10px', fontSize: 13, color: colors.gray, lineHeight: 1.5 }}>
        There's already an open ticket for <strong>{dupes[0].address}</strong> — submitted {new Date(dupes[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}. Your report will add weight so the city knows multiple people are affected.
      </p>
      <p style={{ margin: 0, fontSize: 12, color: colors.blue, fontWeight: 600 }}>
        You can still submit — it helps confirm the issue.
      </p>
    </div>
  );
}
