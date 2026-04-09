import { useState, useRef } from 'react';
import { CATEGORIES, DEPT_HEADS, STATUSES } from '../config/routing';
import { updateTicketStatus, uploadPhoto } from '../lib/tickets';
import { font, colors } from '../config/styles';
import { supabase } from '../lib/supabase';

const ACTION_META = {
  new:      { next: 'assigned', btn: 'Assign to Me', bg: `linear-gradient(135deg, ${colors.yellow}, #B7791F)` },
  assigned: { next: 'on_site',  btn: 'On My Way',    bg: `linear-gradient(135deg, ${colors.blue}, #2C5282)` },
  on_site:  { next: 'resolved', btn: 'Mark Resolved', bg: `linear-gradient(135deg, ${colors.green}, ${colors.greenDk})` },
  resolved: { next: null, btn: null, bg: null },
};

export default function TicketCard({ ticket, onUpdate, staffName }) {
  const cat = CATEGORIES.find(c => c.id === ticket.category_id) || CATEGORIES[CATEGORIES.length - 1];
  const head = DEPT_HEADS[cat.head];
  const status = STATUSES[ticket.status] || STATUSES.new;
  const action = ACTION_META[ticket.status];

  const [expanded, setExpanded] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assignName, setAssignName] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef(null);

  const handleNext = async () => {
    if (action.next === 'resolved') {
      setShowResolve(true);
      return;
    }
    if (action.next === 'assigned') {
      // Assign to self by default
      await handleAssign(staffName || head.name);
      return;
    }
    setProcessing(true);
    try {
      await updateTicketStatus(ticket.id, action.next);
      onUpdate(ticket.id, action.next);
    } catch {
      onUpdate(ticket.id, action.next);
    }
    setProcessing(false);
  };

  const handleAssign = async (name) => {
    setProcessing(true);
    try {
      await supabase
        .from('tickets')
        .update({ status: 'assigned', assigned_to: name, assigned_at: new Date().toISOString() })
        .eq('id', ticket.id);
    } catch {}
    onUpdate(ticket.id, 'assigned', name);
    setShowAssign(false);
    setAssignName('');
    setProcessing(false);
  };

  const handleResolve = async (photoFile) => {
    setProcessing(true);
    try {
      let photoUrl = null;
      if (photoFile) {
        try { photoUrl = await uploadPhoto(photoFile, ticket.id); } catch {}
      }
      await updateTicketStatus(ticket.id, 'resolved', photoUrl);
    } catch {}
    onUpdate(ticket.id, 'resolved');
    setShowResolve(false);
    setProcessing(false);
  };

  const timeAgo = ticket.created_at
    ? new Date(ticket.created_at).toLocaleDateString()
    : ticket.time || '';

  return (
    <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden', borderLeft: `4px solid ${status.color}` }}>
      {/* Header */}
      <div onClick={() => setExpanded(!expanded)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 14px 0', cursor: 'pointer' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 24 }}>{cat.icon}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: colors.navy }}>{cat.label}</div>
            <div style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>📍 {ticket.address}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 6, padding: '3px 8px', textTransform: 'uppercase', letterSpacing: 0.5, color: status.color, background: status.bg }}>{status.label}</span>
          {cat.urgent && <span style={{ fontSize: 10, fontWeight: 800, color: colors.red, letterSpacing: 0.5 }}>⚠️ URGENT</span>}
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 12, padding: '8px 14px 10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: colors.grayLight }}>🕐 {timeAgo}</span>
        <span style={{ fontSize: 11, color: colors.grayLight }}>📸 {ticket.photo_urls?.length || 0}</span>
        <span style={{ fontSize: 11, color: colors.grayLight }}>{ticket.id}</span>
        {ticket.assigned_to && (
          <span style={{ fontSize: 11, color: colors.blue, fontWeight: 600 }}>👤 {ticket.assigned_to}</span>
        )}
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: '0 14px 12px', borderTop: '1px solid #F0F3F7' }}>
          <p style={{ fontSize: 13, color: '#4A5568', fontStyle: 'italic', margin: '10px 0 8px', lineHeight: 1.5 }}>
            {ticket.description || 'No description provided.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ fontSize: 12, color: colors.grayLight, fontWeight: 600 }}>Routed to</span>
            <span style={{ fontSize: 12, color: colors.navy, fontWeight: 600 }}>{head.name}</span>
          </div>
          {ticket.assigned_to && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ fontSize: 12, color: colors.grayLight, fontWeight: 600 }}>Assigned to</span>
              <span style={{ fontSize: 12, color: colors.blue, fontWeight: 600 }}>{ticket.assigned_to}</span>
            </div>
          )}
          {ticket.photo_urls?.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {ticket.photo_urls.map((url, i) => (
                <img key={i} src={url} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assign to crew overlay */}
      {showAssign && (
        <div style={{ padding: '12px 14px', background: '#F7FAFC', borderTop: '1px solid #E8ECF1' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: colors.navy, margin: '0 0 8px' }}>Send to crew member</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={assignName}
              onChange={e => setAssignName(e.target.value)}
              placeholder="Name"
              autoFocus
              style={{
                flex: 1, padding: '10px 12px', borderRadius: 10,
                border: '2px solid #E8ECF1', fontSize: 14,
                fontFamily: font, color: colors.navy, outline: 'none',
              }}
            />
            <button
              onClick={() => handleAssign(assignName || staffName || head.name)}
              disabled={processing}
              style={{
                padding: '10px 16px', borderRadius: 10,
                background: colors.navy, border: 'none',
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: font,
              }}
            >
              Go
            </button>
          </div>
          <button onClick={() => setShowAssign(false)} style={{ marginTop: 8, background: 'none', border: 'none', color: colors.gray, fontSize: 12, cursor: 'pointer', fontFamily: font }}>Cancel</button>
        </div>
      )}

      {/* Resolve overlay */}
      {showResolve && (
        <div style={{ padding: '12px 14px 14px', background: '#F7FAFC', borderTop: '1px solid #E8ECF1' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: colors.navy, margin: '0 0 4px' }}>📸 Take a completion photo</p>
          <p style={{ fontSize: 12, color: colors.gray, margin: '0 0 10px' }}>This photo auto-notifies the resident and closes the ticket.</p>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) handleResolve(e.target.files[0]); }} />
          <div onClick={() => fileRef.current?.click()} style={{ width: '100%', height: 80, borderRadius: 12, border: '2px dashed #CBD5E0', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', marginBottom: 10 }}>
            <span style={{ fontSize: 32 }}>📷</span>
            <span style={{ fontSize: 12, color: colors.grayLight, fontWeight: 600 }}>Tap to capture</span>
          </div>
          <button onClick={() => handleResolve(null)} disabled={processing} style={{ width: '100%', padding: '12px', borderRadius: 10, background: `linear-gradient(135deg, ${colors.green}, ${colors.greenDk})`, border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: font, marginBottom: 8 }}>
            {processing ? 'Closing...' : '✓ Resolved — Send to Resident'}
          </button>
          <button onClick={() => setShowResolve(false)} style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'transparent', border: '1px solid #E8ECF1', color: colors.gray, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: font }}>Cancel</button>
        </div>
      )}

      {/* Action buttons */}
      {action.next && !showResolve && !showAssign && (
        <div style={{ padding: '0 14px 14px' }}>
          <button onClick={handleNext} disabled={processing} style={{ width: '100%', padding: '12px', borderRadius: 10, background: action.bg, border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: font, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', opacity: processing ? 0.7 : 1 }}>
            {processing ? 'Updating...' : `${action.btn} →`}
          </button>
          {ticket.status === 'new' && (
            <button onClick={() => setShowAssign(true)} style={{ width: '100%', marginTop: 6, padding: '8px', borderRadius: 8, background: 'transparent', border: 'none', color: colors.blue, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
              Send to crew member instead →
            </button>
          )}
        </div>
      )}

      {/* Resolved state */}
      {ticket.status === 'resolved' && (
        <div style={{ padding: '10px 14px', background: '#F0FFF4', fontSize: 13, color: colors.green, fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          ✓ Resolved — resident notified
          <span style={{ fontSize: 10, color: '#9AE6B4', fontWeight: 500 }}>Auto-archives in 48 hrs</span>
        </div>
      )}
    </div>
  );
}
