import { clubFor } from './clubs';

// Club badge: the crest when one is configured (clubs.js crestUrl), otherwise the
// club's short code on its colours. No crests are shown until they are approved.
export default function TeamBadge({ team, size = 48 }) {
  const club = clubFor(team);
  if (club.crestUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={club.crestUrl} alt={team} width={size} height={size} className="rounded-full object-contain" style={{ width: size, height: size }} />;
  }
  return (
    <span
      role="img"
      aria-label={team}
      title={team}
      className="inline-flex items-center justify-center rounded-full font-bold tracking-tight select-none"
      style={{ width: size, height: size, background: club.bg, color: club.fg, fontSize: Math.max(10, Math.round(size * 0.3)), boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15)' }}
    >
      {club.code}
    </span>
  );
}
