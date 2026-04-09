// /api/archive.js
// Runs daily via Vercel Cron — archives tickets resolved > 48 hours ago
// No manual cleanup needed — self-running philosophy

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow cron or manual trigger with secret
  const authHeader = req.headers.authorization;
  const cronSecret = req.headers['x-vercel-cron'];

  if (!cronSecret && authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('tickets')
      .update({ status: 'archived', archived_at: new Date().toISOString() })
      .eq('status', 'resolved')
      .lt('resolved_at', cutoff)
      .is('archived_at', null)
      .select('id');

    if (error) throw error;

    const count = data?.length || 0;
    console.log(`Archived ${count} tickets`);

    return res.status(200).json({ archived: count });
  } catch (err) {
    console.error('Archive error:', err);
    return res.status(500).json({ error: err.message });
  }
}
