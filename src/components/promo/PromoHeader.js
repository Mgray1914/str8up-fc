import Link from 'next/link';
import { useRouter } from 'next/router';
import { activePromo } from '../../config/promoMeta';

// Header for the promo-only build: no links into the main Str8Up app.
const NAV = [
  { href: '/promo/predictions', label: 'Matches' },
  { href: '/promo/leaderboard', label: 'Leaderboard' },
  { href: '/promo/profile', label: 'My Picks' },
];

export default function PromoHeader() {
  const router = useRouter();
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0D0D0D]/90 backdrop-blur border-b border-[#1f1f1f]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/promo" className="flex items-center gap-2 shrink-0" aria-label={`${activePromo.name} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.svg" alt="Str8Up" className="h-7 w-auto" />
          <span className="hidden sm:inline text-sm text-gray-400">{activePromo.shortName || activePromo.name}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm overflow-x-auto">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`whitespace-nowrap hover:text-white ${router.pathname.startsWith(href) ? 'text-white font-semibold' : 'text-gray-400'}`}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
