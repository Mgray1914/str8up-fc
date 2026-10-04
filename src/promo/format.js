// Display helpers for the promo pages.

// Kickoff in the viewer's own locale and time zone, with the zone shown
// (e.g. "Sat 4 Oct", "15:00", "BST").
export function formatKickoff(when) {
  const d = new Date(when);
  if (Number.isNaN(d.getTime())) return { date: '', time: '', tz: '' };
  const date = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  const parts = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).formatToParts(d);
  const time = parts.filter(p => p.type !== 'timeZoneName').map(p => p.value).join('').trim();
  const tz = (parts.find(p => p.type === 'timeZoneName') || {}).value || '';
  return { date, time, tz };
}

// Round labels: MW12 -> "Matchweek 12"; NFL W3 -> "Week 3"; PRE1 -> "Preseason 1".
export function roundLabel(round) {
  const mw = /^MW(\d+)$/.exec(round || '');
  if (mw) return `Matchweek ${mw[1]}`;
  const wk = /^W(\d+)$/.exec(round || '');
  if (wk) return `Week ${wk[1]}`;
  const pre = /^PRE(\d+)$/.exec(round || '');
  if (pre) return `Preseason ${pre[1]}`;
  return round || '';
}

export const roundOrder = (round) => parseInt(String(round || '').replace(/\D/g, ''), 10) || 0;

// Label for a pick or result: the team name, or "Draw".
export function outcomeLabel(outcome, match) {
  if (outcome === 'home') return match.home;
  if (outcome === 'away') return match.away;
  if (outcome === 'draw') return 'Draw';
  return outcome || '';
}

// Picks offered for a match: home / draw / away when the promo allows draws.
export function pickOptions(match, allowDraw) {
  return allowDraw
    ? [{ v: 'home', l: match.home }, { v: 'draw', l: 'Draw' }, { v: 'away', l: match.away }]
    : [{ v: 'home', l: match.home }, { v: 'away', l: match.away }];
}

export const truncAddr = (a) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '');
