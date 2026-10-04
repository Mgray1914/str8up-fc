import Head from 'next/head';
import Link from 'next/link';
import { activePromo } from '../../config/promoMeta';
import EligibilityNotice from '../../components/promo/EligibilityNotice';

const PLACEHOLDER = '[PLACEHOLDER — final text from counsel]';

// Section headings only. The legal text of every section is pending counsel and
// must not be filled in from the NFL rules or written here without their sign-off.
const SECTIONS = [
  'Sponsor',
  'Eligibility',
  'Challenge period',
  'How to enter',
  'Gameplay',
  'Promo Credits',
  'Stock rewards',
  'Prizes',
  'Winner determination and tie-breakers',
  'Taxes',
  'Disqualification',
  'Privacy',
  'Disclaimers and limitation of liability',
  'Governing law and disputes',
  'General conditions',
  'Intellectual property',
];

export default function Rules() {
  return (
    <>
      <Head><title>{`Official Rules - ${activePromo.name}`}</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white px-4 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          <Link href="/promo" className="text-xs text-gray-600 hover:text-white mb-4 block">&larr; Back to the Challenge</Link>
          <h1 className="text-3xl font-bold mb-1">OFFICIAL RULES</h1>
          <h2 className="text-lg text-gray-400 mb-2">Str8Up {activePromo.name}</h2>
          <p className="text-sm text-gray-500 mb-6">Free-to-play prediction challenge · {activePromo.seasonLabel}</p>

          <div className="bg-[#2a1f00] border border-yellow-700 rounded-xl p-4 mb-6 text-sm text-yellow-200">
            DRAFT. These Official Rules have not been finalised. Every section below is a placeholder until counsel supplies the final text.
          </div>
          <EligibilityNotice className="mb-8" />

          <div className="space-y-6">
            {SECTIONS.map((title, i) => (
              <div key={title}>
                <h3 className="text-base font-bold text-white mb-2">{`${i + 1}. ${title.toUpperCase()}`}</h3>
                <p className="text-sm text-yellow-500/80 leading-relaxed">{PLACEHOLDER}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-600 space-y-1">
            <p>{activePromo.disclaimer}</p>
            <p><Link href="/promo/amoe" className="underline hover:text-white">Alternative Method of Entry</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
