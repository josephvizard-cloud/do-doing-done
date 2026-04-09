export const font = "'Avenir Next', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const colors = {
  navy:      '#1a2744',
  navyMid:   '#2B4570',
  navyLight: '#3A6EA5',
  orange:    '#F0652F',
  orangeDk:  '#E8521A',
  green:     '#38A169',
  greenDk:   '#2F855A',
  blue:      '#2B6CB0',
  yellow:    '#D69E2E',
  red:       '#E53E3E',
  gray:      '#6B7A8D',
  grayLight: '#8896AB',
  grayBorder:'#E8ECF1',
  bg:        '#FAFBFC',
  bgStaff:   '#F2F4F7',
};

export const shared = {
  statusBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 20px', fontSize: 13, fontWeight: 600,
    color: colors.navy, background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100,
    fontFamily: font,
  },
  screen: { flex: 1, padding: '0 20px 24px', background: colors.bg },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 8px' },
  backBtn: { background: 'none', border: 'none', fontSize: 15, fontWeight: 600, color: colors.blue, cursor: 'pointer', padding: '4px 0', fontFamily: font },
  step: { fontSize: 12, fontWeight: 700, color: colors.grayLight, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: 800, color: colors.navy, margin: '8px 0 4px', letterSpacing: -0.5, fontFamily: font },
  sub: { fontSize: 14, color: colors.gray, margin: '0 0 18px', lineHeight: 1.5 },
  label: { fontSize: 14, fontWeight: 700, color: colors.navy, display: 'block', marginBottom: 8 },
  optional: { fontWeight: 400, color: colors.grayLight, fontSize: 12 },
  submitBtn: {
    width: '100%', padding: '16px', borderRadius: 14,
    background: `linear-gradient(135deg, ${colors.orange}, ${colors.orangeDk})`,
    border: 'none', color: '#fff', fontSize: 17, fontWeight: 800,
    cursor: 'pointer', boxShadow: '0 8px 20px rgba(240,101,47,0.3)',
    fontFamily: font, letterSpacing: -0.2,
  },
};
