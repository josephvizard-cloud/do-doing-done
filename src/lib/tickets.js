import { supabase } from './supabase';
import { CATEGORIES, DEPT_HEADS } from '../config/routing';

// ─── Generate Ticket ID ────────────────────────────────────
export function generateTicketId() {
  const now = new Date();
  const y = String(now.getFullYear()).slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const r = Math.floor(1000 + Math.random() * 9000);
  return `DDW-${y}${m}${d}-${r}`;
}

// ─── Submit a new ticket ───────────────────────────────────
export async function submitTicket({ categoryId, address, latitude, longitude, description, photoUrls, reporterEmail, reporterPhone }) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) throw new Error(`Unknown category: ${categoryId}`);

  const ticket = {
    id: generateTicketId(),
    category_id: categoryId,
    head_id: category.head,
    division: category.division,
    status: 'new',
    urgent: category.urgent || false,
    address,
    latitude: latitude || null,
    longitude: longitude || null,
    description: description || null,
    photo_urls: photoUrls || [],
    reporter_email: reporterEmail || null,
    reporter_phone: reporterPhone || null,
  };

  const { data, error } = await supabase
    .from('tickets')
    .insert(ticket)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Fetch tickets for staff dashboard ─────────────────────
export async function fetchTickets({ headId, status } = {}) {
  let query = supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })
    .neq('status', 'archived');

  if (headId && headId !== 'all') {
    query = query.eq('head_id', headId);
  }
  if (status === 'active') {
    query = query.neq('status', 'resolved');
  } else if (status === 'resolved') {
    query = query.eq('status', 'resolved');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ─── Update ticket status ──────────────────────────────────
export async function updateTicketStatus(ticketId, newStatus, resolvePhotoUrl) {
  const updates = { status: newStatus };

  if (newStatus === 'assigned') updates.assigned_at = new Date().toISOString();
  if (newStatus === 'resolved') {
    updates.resolved_at = new Date().toISOString();
    if (resolvePhotoUrl) updates.resolve_photo = resolvePhotoUrl;
  }

  const { data, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', ticketId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Upload photo to Supabase Storage ──────────────────────
export async function uploadPhoto(file, ticketId) {
  const ext = file.name.split('.').pop();
  const path = `${ticketId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('ticket-photos')
    .upload(path, file, { contentType: file.type });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('ticket-photos')
    .getPublicUrl(path);

  return urlData.publicUrl;
}

// ─── Fetch tickets for a specific reporter ─────────────────
export async function fetchMyTickets(email) {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('reporter_email', email)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ─── Duplicate Detection ───────────────────────────────────
// Finds open tickets in the same category near the same address
export async function findDuplicates(categoryId, address) {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('id, category_id, address, description, created_at, status')
      .eq('category_id', categoryId)
      .in('status', ['new', 'assigned', 'on_site'])
      .order('created_at', { ascending: false })
      .limit(5);

    if (error || !data) return [];

    // Simple text match — check if addresses share key words
    const inputWords = address.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    return data.filter(t => {
      const ticketWords = t.address.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
      const matches = inputWords.filter(w => ticketWords.includes(w));
      return matches.length >= 2; // At least 2 words in common (e.g. "Moody" + "St")
    });
  } catch {
    return [];
  }
}

// ─── Subscribe to real-time ticket updates ─────────────────
export function subscribeToTickets(callback) {
  const channel = supabase
    .channel('tickets-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, callback)
    .subscribe();

  return () => supabase.removeChannel(channel);
}
