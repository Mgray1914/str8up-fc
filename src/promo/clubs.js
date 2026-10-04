// 2026/27 Premier League clubs. Names match the backend seed
// (scripts/seedEplMatchweek.js CLUBS) exactly, since matches carry full names.
// No crests yet (pending approval): TeamBadge renders the short code on the club's
// colours. To add crests later, set crestUrl per club - TeamBadge uses it when present.
// Colours are approximate kit colours: bg = primary, fg = text colour chosen for contrast.
export const CLUBS = {
  'Arsenal':                { code: 'ARS', short: 'Arsenal',     bg: '#EF0107', fg: '#FFFFFF', crestUrl: null },
  'Aston Villa':            { code: 'AVL', short: 'Aston Villa', bg: '#670E36', fg: '#95BFE5', crestUrl: null },
  'Bournemouth':            { code: 'BOU', short: 'Bournemouth', bg: '#DA291C', fg: '#000000', crestUrl: null },
  'Brentford':              { code: 'BRE', short: 'Brentford',   bg: '#E30613', fg: '#FFFFFF', crestUrl: null },
  'Brighton & Hove Albion': { code: 'BHA', short: 'Brighton',    bg: '#0057B8', fg: '#FFFFFF', crestUrl: null },
  'Chelsea':                { code: 'CHE', short: 'Chelsea',     bg: '#034694', fg: '#FFFFFF', crestUrl: null },
  'Coventry City':          { code: 'COV', short: 'Coventry',    bg: '#59CBE8', fg: '#0B2A4A', crestUrl: null },
  'Crystal Palace':         { code: 'CRY', short: 'Palace',      bg: '#1B458F', fg: '#FFFFFF', crestUrl: null },
  'Everton':                { code: 'EVE', short: 'Everton',     bg: '#003399', fg: '#FFFFFF', crestUrl: null },
  'Fulham':                 { code: 'FUL', short: 'Fulham',      bg: '#FFFFFF', fg: '#000000', crestUrl: null },
  'Hull City':              { code: 'HUL', short: 'Hull',        bg: '#F5A12D', fg: '#000000', crestUrl: null },
  'Ipswich Town':           { code: 'IPS', short: 'Ipswich',     bg: '#3A64A3', fg: '#FFFFFF', crestUrl: null },
  'Leeds United':           { code: 'LEE', short: 'Leeds',       bg: '#FFFFFF', fg: '#1D428A', crestUrl: null },
  'Liverpool':              { code: 'LIV', short: 'Liverpool',   bg: '#C8102E', fg: '#FFFFFF', crestUrl: null },
  'Manchester City':        { code: 'MCI', short: 'Man City',    bg: '#6CABDD', fg: '#1C2C5B', crestUrl: null },
  'Manchester United':      { code: 'MUN', short: 'Man Utd',     bg: '#DA291C', fg: '#FBE122', crestUrl: null },
  'Newcastle United':       { code: 'NEW', short: 'Newcastle',   bg: '#241F20', fg: '#FFFFFF', crestUrl: null },
  'Nottingham Forest':      { code: 'NFO', short: "Nott'm Forest", bg: '#DD0000', fg: '#FFFFFF', crestUrl: null },
  'Sunderland':             { code: 'SUN', short: 'Sunderland',  bg: '#EB172B', fg: '#FFFFFF', crestUrl: null },
  'Tottenham Hotspur':      { code: 'TOT', short: 'Spurs',       bg: '#FFFFFF', fg: '#132257', crestUrl: null },
};

// Club info by full name; unknown teams get initials on a neutral badge.
export function clubFor(team) {
  if (CLUBS[team]) return CLUBS[team];
  const initials = String(team || '?').split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 3).toUpperCase();
  return { code: initials || '?', short: team || '?', bg: '#1C1C1C', fg: '#FFFFFF', crestUrl: null };
}
