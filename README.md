# Do, Doing, Done. — Waltham's Action Line

Self-running civic issue reporting app for the City of Waltham, MA.
Residents report → system auto-routes to department heads → crews fix with one tap.

## Quick Start

```bash
# 1. Clone or copy this folder
cd ddd

# 2. Install dependencies
npm install

# 3. Copy env file and add your Supabase keys
cp .env.example .env
# Edit .env with your Supabase URL and anon key

# 4. Run locally
npm run dev
```

Opens at http://localhost:5173

## Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com) → New Project → name it `do-doing-done`
2. Once created, go to **Settings → API** and copy:
   - Project URL → paste into `.env` as `VITE_SUPABASE_URL`
   - `anon` public key → paste into `.env` as `VITE_SUPABASE_ANON_KEY`
3. Go to **SQL Editor** → paste the contents of `supabase-schema.sql` → Run
4. Go to **Storage** → Create bucket called `ticket-photos` → Set to Public

The app works without Supabase (falls back to local state) so you can develop the UI first.

## Deploy to Vercel

```bash
# Same process as MapoliClaw
npm run build
# Push to GitHub, connect repo in Vercel
# Add env vars in Vercel project settings
```

## Routing Table

| Category | Routes To | Department Head |
|----------|-----------|-----------------|
| Pothole, Sidewalk, Graffiti | CPW Street Division | Michael Chiasson |
| Tree / Branch | CPW Park & Forestry | Michael Chiasson |
| Trash / Debris | CPW Public Vehicles | Michael Chiasson |
| Water / Sewer (PRIORITY) | CPW Water & Sewer | Michael Chiasson |
| Street Light / Traffic Signal | Wires Department | Timothy P. Kelly |
| Building / Code / Zoning | Building Department | Brian J. Bower |
| Park / Playground | Recreation Department | Kimberly Hebert |

## Project Structure

```
ddd/
├── index.html
├── package.json
├── vite.config.js
├── supabase-schema.sql        # Run in Supabase SQL Editor
├── .env.example                # Copy to .env, add keys
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                # Entry point
    ├── App.jsx                 # Role toggle + screen routing
    ├── config/
    │   ├── routing.js          # Department heads, categories, response times
    │   └── styles.js           # Shared colors, fonts, component styles
    ├── lib/
    │   ├── supabase.js         # Supabase client
    │   └── tickets.js          # All ticket CRUD operations
    ├── components/
    │   └── TicketCard.jsx      # Staff ticket card with one-tap actions
    └── pages/
        ├── ResidentHome.jsx    # Home screen with Report button
        ├── CategoryPick.jsx    # Category grid (10 categories)
        ├── ReportDetails.jsx   # Location, photos, description
        ├── Confirmation.jsx    # Ticket confirmation + confetti
        └── StaffDashboard.jsx  # Staff view with filters + ticket list
```

## Architecture: Self-Running Philosophy

- **Zero FTEs**: System runs on autopilot after initial config
- **Auto-routing**: Category → department head mapping in `routing.js`
- **Auto-notifications**: Supabase Edge Functions (Sprint 2) send email on status change
- **Auto-archive**: Resolved tickets archive after 48 hours via DB function
- **Help, don't hurt**: Staff see clean lists, one-tap actions, no complex software

## Sprint Plan

- [x] Sprint 1: Scaffold + resident flow + Supabase schema
- [ ] Sprint 2: Staff auth + live tickets from DB + email notifications
- [ ] Sprint 3: Duplicate detection + auto-archive cron + PWA install
- [ ] Sprint 4: Junior staff assignment + map view + pitch deck + deploy
