import Link from 'next/link';
import { activePromo } from '../../config/promoMeta';

// Footer for the promo-only build: disclaimer and promo legal links only.
export default function PromoFooter() {
  return (
    <footer className="border-t border-[#1f1f1f] bg-[#0D0D0D] text-xs text-gray-600">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-2 text-center">
        {activePromo.disclaimer && <p>{activePromo.disclaimer}</p>}
        <p>
          <Link href="/promo/rules" className="hover:text-white underline">Official Rules</Link>
          {' · '}
          <Link href="/promo/amoe" className="hover:text-white underline">Mail-In Entry (AMOE)</Link>
        </p>
        <p>© Str8Up Gaming</p>
      </div>
    </footer>
  );
}
