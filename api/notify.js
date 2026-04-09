// /api/notify.js
// Supabase Database Webhook → this function → Resend email to department head
//
// Setup:
// 1. Sign up at resend.com (free: 100 emails/day)
// 2. Get API key, add as RESEND_API_KEY in Vercel env vars
// 3. In Supabase: Database → Webhooks → Create →
//    Table: tickets, Events: INSERT
//    URL: https://do-doing-done.vercel.app/api/notify
//    Method: POST, add header: x-webhook-secret = your-secret

const DEPT_HEADS = {
  chiasson: { name: 'Michael Chiasson', email: 'mchiasson@city.waltham.ma.us', dept: 'Consolidated Public Works' },
  kelly:    { name: 'Timothy P. Kelly', email: 'tkelly@city.waltham.ma.us',    dept: 'Wires Department' },
  bower:    { name: 'Brian J. Bower',   email: 'bbower@city.waltham.ma.us',    dept: 'Building Department' },
  hebert:   { name: 'Kimberly Hebert',  email: 'khebert@city.waltham.ma.us',   dept: 'Recreation Department' },
};

const CATEGORIES = {
  pothole:     { label: 'Pothole / Road Damage', icon: '🕳️' },
  sidewalk:    { label: 'Sidewalk / Curb', icon: '🚶' },
  graffiti:    { label: 'Graffiti / Vandalism', icon: '🎨' },
  streetlight: { label: 'Street Light / Signal', icon: '💡' },
  tree:        { label: 'Tree / Branch', icon: '🌳' },
  trash:       { label: 'Trash / Debris', icon: '🗑️' },
  water:       { label: 'Water / Sewer', icon: '💧' },
  park:        { label: 'Park Issue', icon: '⛲' },
  building:    { label: 'Building / Code', icon: '🏗️' },
  other:       { label: 'Other', icon: '📋' },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  // Verify webhook secret
  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { type, record } = req.body || {};

  if (type !== 'INSERT' || !record) {
    return res.status(200).json({ skipped: true });
  }

  const ticket = record;
  const head = DEPT_HEADS[ticket.head_id];
  const cat = CATEGORIES[ticket.category_id] || CATEGORIES.other;

  if (!head) {
    return res.status(200).json({ error: 'Unknown head_id', head_id: ticket.head_id });
  }

  // Build email
  const subject = `${ticket.urgent ? '⚠️ URGENT: ' : ''}New report: ${cat.label} at ${ticket.address}`;

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a2744; border-radius: 12px; padding: 20px; color: #fff; margin-bottom: 16px;">
        <h1 style="margin: 0 0 4px; font-size: 20px;">Do, Doing, Done.</h1>
        <p style="margin: 0; opacity: 0.6; font-size: 13px;">New report routed to you</p>
      </div>

      ${ticket.urgent ? '<div style="background: #FFF5E6; border: 1px solid #FBBF24; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; color: #92400E; font-weight: 600; font-size: 14px;">⚠️ PRIORITY — Water/Sewer issue</div>' : ''}

      <div style="background: #fff; border: 1px solid #E8ECF1; border-radius: 12px; padding: 16px;">
        <div style="font-size: 28px; margin-bottom: 8px;">${cat.icon}</div>
        <h2 style="margin: 0 0 12px; color: #1a2744; font-size: 18px;">${cat.label}</h2>

        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="color: #8896AB; padding: 6px 0;">Ticket</td>
            <td style="text-align: right; font-weight: 600; color: #1a2744; padding: 6px 0;">${ticket.id}</td>
          </tr>
          <tr>
            <td style="color: #8896AB; padding: 6px 0; border-top: 1px solid #F0F3F7;">Location</td>
            <td style="text-align: right; font-weight: 600; color: #1a2744; padding: 6px 0; border-top: 1px solid #F0F3F7;">📍 ${ticket.address}</td>
          </tr>
          ${ticket.description ? `<tr><td style="color: #8896AB; padding: 6px 0; border-top: 1px solid #F0F3F7;">Description</td><td style="text-align: right; color: #4A5568; padding: 6px 0; border-top: 1px solid #F0F3F7;">${ticket.description}</td></tr>` : ''}
          <tr>
            <td style="color: #8896AB; padding: 6px 0; border-top: 1px solid #F0F3F7;">Photos</td>
            <td style="text-align: right; color: #1a2744; padding: 6px 0; border-top: 1px solid #F0F3F7;">${ticket.photo_urls?.length || 0} attached</td>
          </tr>
          <tr>
            <td style="color: #8896AB; padding: 6px 0; border-top: 1px solid #F0F3F7;">Routed to</td>
            <td style="text-align: right; font-weight: 600; color: #1a2744; padding: 6px 0; border-top: 1px solid #F0F3F7;">${head.name}</td>
          </tr>
        </table>
      </div>

      <a href="https://do-doing-done.vercel.app" style="display: block; text-align: center; background: #F0652F; color: #fff; text-decoration: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 16px; margin-top: 16px;">
        Open Dashboard →
      </a>

      <p style="font-size: 11px; color: #8896AB; text-align: center; margin-top: 16px;">
        Do, Doing, Done. — Waltham's Action Line<br/>
        This is an automated notification. No action needed until you're ready.
      </p>
    </div>
  `;

  // Send via Resend
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Do, Doing, Done <onboarding@resend.dev>',
        to: ["josephvizard@gmail.com"],
        subject,
        html,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend error:', result);
      return res.status(200).json({ error: 'Email failed', details: result });
    }

    return res.status(200).json({ sent: true, to: head.email, ticket: ticket.id });
  } catch (err) {
    console.error('Notify error:', err);
    return res.status(200).json({ error: err.message });
  }
}
