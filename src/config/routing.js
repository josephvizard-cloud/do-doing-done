// ─── Department Heads ──────────────────────────────────────
// These four people receive all ticket notifications.
// They delegate internally to their crews — the app doesn't manage that (yet).

export const DEPT_HEADS = {
  chiasson: {
    name: 'Michael Chiasson',
    role: 'Director of Public Works',
    phone: '781-314-3140',
    email: 'mchiasson@city.waltham.ma.us',
    dept: 'Consolidated Public Works',
  },
  kelly: {
    name: 'Timothy P. Kelly',
    role: 'Inspector of Wires',
    phone: '781-314-3175',
    email: 'tkelly@city.waltham.ma.us',
    dept: 'Wires Department',
  },
  bower: {
    name: 'Brian J. Bower',
    role: 'Chief Inspector of Buildings',
    phone: '781-314-3285',
    email: 'bbower@city.waltham.ma.us',
    dept: 'Building Department',
  },
  hebert: {
    name: 'Kimberly Hebert',
    role: 'Director of Recreation',
    phone: '781-314-3475',
    email: 'khebert@city.waltham.ma.us',
    dept: 'Recreation Department',
  },
};

// ─── Issue Categories ──────────────────────────────────────
// Each category maps to exactly one department head.
// `urgent` triggers priority routing (SMS + faster response window).

export const CATEGORIES = [
  { id: 'pothole',     label: 'Pothole',         icon: '🕳️', desc: 'Road damage, cracks, sinkholes',       head: 'chiasson', division: 'Street Division' },
  { id: 'sidewalk',    label: 'Sidewalk',        icon: '🚶', desc: 'Cracked, trip hazard, curb damage',     head: 'chiasson', division: 'Street Division' },
  { id: 'graffiti',    label: 'Graffiti',        icon: '🎨', desc: 'Tagging, vandalism, illegal posting',   head: 'chiasson', division: 'Street Division' },
  { id: 'streetlight', label: 'Light / Signal',  icon: '💡', desc: 'Street light out, traffic signal',      head: 'kelly',    division: 'Wires' },
  { id: 'tree',        label: 'Tree / Branch',   icon: '🌳', desc: 'Fallen, overhanging, dead tree',        head: 'chiasson', division: 'Park & Forestry' },
  { id: 'trash',       label: 'Trash / Debris',  icon: '🗑️', desc: 'Missed pickup, dumping, bulky item',   head: 'chiasson', division: 'Public Vehicles' },
  { id: 'water',       label: 'Water / Sewer',   icon: '💧', desc: 'Leak, flooding, sewer smell',           head: 'chiasson', division: 'Water & Sewer', urgent: true },
  { id: 'park',        label: 'Park Issue',      icon: '⛲', desc: 'Equipment, overgrown, playground',      head: 'hebert',   division: 'Recreation' },
  { id: 'building',    label: 'Building / Code', icon: '🏗️', desc: 'Code violation, zoning, nuisance',     head: 'bower',    division: 'Building' },
  { id: 'other',       label: 'Other',           icon: '📋', desc: 'Something else — describe below',       head: 'chiasson', division: "CPW Director's Office" },
];

// ─── Response Time Estimates ───────────────────────────────
// Shown to residents on confirmation. Kept conservative so we over-deliver.

export const RESPONSE_TIMES = {
  pothole:     '3–7 business days',
  sidewalk:    '5–10 business days',
  graffiti:    '3–5 business days',
  streetlight: '5–10 business days',
  tree:        '3–7 business days',
  trash:       '1–3 business days',
  water:       'Priority — 1–2 business days',
  park:        '3–7 business days',
  building:    '5–10 business days',
  other:       '3–7 business days',
};

// ─── Ticket Statuses ───────────────────────────────────────
// Maps to the brand: Do → Doing → Done

export const STATUSES = {
  new:       { label: 'Do',     color: '#E53E3E', bg: '#FFF5F5' },
  assigned:  { label: 'Do',     color: '#D69E2E', bg: '#FFFFF0' },
  on_site:   { label: 'Doing',  color: '#2B6CB0', bg: '#EBF8FF' },
  resolved:  { label: 'Done',   color: '#38A169', bg: '#F0FFF4' },
};
