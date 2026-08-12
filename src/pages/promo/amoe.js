import Head from 'next/head';
import { useRouter } from 'next/router';
export default function AMOE() {
  const router = useRouter();
  return (
    <>
      <Head><title>Alternative Method of Entry — NFL Preseason Challenge</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full">
          <button onClick={() => router.push('/promo')} className="text-xs text-gray-600 hover:text-white mb-4 block">← Back to Challenge</button>
          <h1 className="text-3xl font-bold mb-2">Alternative Method of Entry</h1>
          <p className="text-gray-400 mb-6">No purchase or digital account necessary.</p>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-300 mb-4">
              To enter the Str8Up NFL Preseason Challenge 2026 without creating a digital account,
              hand-print your name, complete mailing address, email address, date of birth, and
              the words "Str8Up NFL Preseason Challenge Entry" on a 3" x 5" card or piece of paper.
            </p>
            <p className="text-sm text-gray-300 mb-4">
              Mail your entry in a hand-addressed #10 envelope with proper postage to:
            </p>
            <div className="bg-[#0d0d0d] rounded-lg p-4 border border-gray-800 mb-4">
              <p className="font-semibold text-white">Str8Up Gaming Holdings, Inc.</p>
              <p className="text-gray-400 text-sm">NFL Preseason Challenge 2026 — AMOE</p>
              <p className="text-gray-400 text-sm">Attn: Promotions Department</p>
              <p className="text-gray-400 text-sm">Miami, FL</p>
              <p className="text-xs text-gray-600 mt-2 italic">Full mailing address available in Official Rules</p>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Each mail-in entry will receive one (1) entry into the Challenge equivalent to the
              standard 50,000 Promo Credits signup grant. Limit one (1) mail-in entry per person
              per envelope. Mail-in entries must be postmarked by August 18, 2026 and received by
              August 24, 2026.
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-3">Entry Requirements</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Must be 18 years or older</p>
              <p>• One entry per person per envelope</p>
              <p>• Must be hand-written on a 3" x 5" card</p>
              <p>• Must include: full name, mailing address, email, date of birth</p>
              <p>• Must include the words: "Str8Up NFL Preseason Challenge Entry"</p>
              <p>• Postmarked by August 18, 2026</p>
              <p>• Received by August 24, 2026</p>
              <p>• Syndicates, mechanical reproductions, and mass entries will be disqualified</p>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-600 space-y-1">
            <p>This promotion is not affiliated with the National Football League (NFL) or any NFL team.</p>
            <a href="/promo/rules" className="text-gray-500 hover:text-white underline">Official Rules</a>
          </div>
        </div>
      </div>
    </>
  );
}
