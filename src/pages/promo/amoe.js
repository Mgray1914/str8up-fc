import Head from 'next/head';
import Link from 'next/link';
import { activePromo } from '../../config/promoMeta';
import EligibilityNotice from '../../components/promo/EligibilityNotice';

const PLACEHOLDER = '[PLACEHOLDER — final text from counsel]';

// Alternative Method of Entry. Whether an AMOE is needed for the EPL Challenge, and
// its terms (method, address, dates, limits), are pending counsel: nothing here is final.
export default function AMOE() {
  return (
    <>
      <Head><title>{`Alternative Method of Entry - ${activePromo.name}`}</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white px-4 pt-28 pb-16">
        <div className="max-w-lg mx-auto">
          <Link href="/promo" className="text-xs text-gray-600 hover:text-white mb-4 block">&larr; Back to the Challenge</Link>
          <h1 className="text-3xl font-bold mb-2">Alternative Method of Entry</h1>
          <p className="text-gray-400 mb-6">Str8Up {activePromo.name} · {activePromo.seasonLabel}</p>

          <div className="bg-[#2a1f00] border border-yellow-700 rounded-xl p-4 mb-6 text-sm text-yellow-200">
            DRAFT. The alternative method of entry for this Challenge has not been finalised.
          </div>
          <EligibilityNotice className="mb-6" />

          {['How to enter without an account', 'Where to send your entry', 'What each entry receives', 'Entry dates', 'Entry requirements'].map(title => (
            <div key={title} className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 mb-4">
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-yellow-500/80">{PLACEHOLDER}</p>
            </div>
          ))}

          <div className="mt-8 text-center text-xs text-gray-600 space-y-1">
            <p>{activePromo.disclaimer}</p>
            <Link href="/promo/rules" className="text-gray-500 hover:text-white underline">Official Rules</Link>
          </div>
        </div>
      </div>
    </>
  );
}
