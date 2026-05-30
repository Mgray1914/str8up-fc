import Head from 'next/head';
import { useRouter } from 'next/router';

const sections = [
  { title: "1. SPONSOR", content: "The Str8Up Global Soccer Challenge (the \"Contest\") is sponsored by Str8Up Gaming Holdings, Inc., a Delaware corporation (\"Sponsor\"). For questions, contact: legal@str8upgaming.com." },
  { title: "2. ELIGIBILITY", content: "The Contest is open only to individuals who are eighteen (18) years of age or older at the time of entry and who are legal residents of an eligible jurisdiction. The Contest is void in Washington State and all U.S. states or territories where free predictive sports contests are prohibited by law. It is the entrant's responsibility to verify that participation is lawful in their jurisdiction." },
  { title: "3. CONTEST PERIOD", content: "The Contest begins on June 11, 2026 at 12:00 PM EDT and ends on July 15, 2026 at 11:59 PM EDT, corresponding to the 2026 international soccer tournament." },
  { title: "4. HOW TO ENTER (FREE)", content: "Online Entry: Visit str8upgaming.com/promo and authenticate using a valid email address. A blockchain wallet will be automatically generated. All gas fees are sponsored by Str8Up. Limit one account per person.\n\nAlternative Method of Entry (AMOE): Hand-print your name, mailing address, email, date of birth, and the words \"Str8Up Global Soccer Challenge Entry\" on a 3\" x 5\" card. Mail in a hand-addressed #10 envelope to: Str8Up Gaming Holdings, Inc., Global Soccer Challenge 2026 - AMOE, Attn: Promotions Department, Miami, FL. Postmarked by July 10, 2026. Received by July 15, 2026." },
  { title: "5. GAMEPLAY & SCORING", content: "Entrants predict match outcomes during the Contest Period. WC Credits are a promotional mechanic with no monetary value, no cash equivalent, and no relationship to STR8 tokens. They are soulbound (non-transferable), expire at the end of the Contest, and cannot be redeemed for anything of value." },
  { title: "6. PRIZES (TOTAL ARV: $1,650)", content: "Grand Prize (1 winner): $500\nSecond Place (1 winner): $300\nThird Place (1 winner): $100\nRound Winners (5 winners): $100 each / $500 total\nReferral King (1 winner): $250\n\nAll prizes fulfilled via digital Visa Gift Card. No cryptocurrency payments." },
  { title: "7. REFERRAL KING PRIZE", content: "Awarded to the entrant with the most verified referrals. A referral is verified when the referred user creates an account, completes identity verification, and submits at least 10 predictions." },
  { title: "8. TIE-BREAKERS", content: "Ties are broken by the earliest blockchain timestamp of the entrant's final correct prediction. Blockchain timestamps are final and binding." },
  { title: "9. TAXES", content: "All taxes on prizes are the sole responsibility of the winner. Sponsor will issue IRS Form 1099-MISC where required." },
  { title: "10. DISQUALIFICATION", content: "Sponsor may disqualify entrants for tampering, multiple accounts, bots, false information, or any conduct harmful to Contest integrity." },
  { title: "11. PRIVACY", content: "By entering, entrants consent to collection of personal data for Contest administration. Sponsor will not sell personal data to third parties." },
  { title: "12. DISCLAIMERS", content: "Sponsor is not responsible for network outages, blockchain congestion, or technical failures. Sponsor's total liability shall not exceed the prize value the entrant is eligible to win." },
  { title: "13. GOVERNING LAW", content: "Governed by Delaware law. Disputes resolved by binding individual arbitration under AAA Consumer Arbitration Rules. Class action waiver applies." },
  { title: "14. GENERAL CONDITIONS", content: "Sponsor may cancel, suspend, or modify the Contest if integrity is impaired. These Official Rules constitute the entire agreement." },
  { title: "15. INTELLECTUAL PROPERTY", content: "This promotion is not sponsored by, endorsed by, or associated with FIFA, any national soccer federation, or any tournament organizing body. All trademarks belong to their respective owners." }
];

export default function Rules() {
  const router = useRouter();
  return (
    <>
      <Head><title>Official Rules - Global Soccer Challenge 2026</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white px-4 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => router.push('/promo')} className="text-xs text-gray-600 hover:text-white mb-4 block">\u2190 Back to Challenge</button>
          <h1 className="text-3xl font-bold mb-1">OFFICIAL RULES</h1>
          <h2 className="text-lg text-gray-400 mb-2">Str8Up Global Soccer Challenge</h2>
          <p className="text-sm text-gray-500 mb-6">Free-to-Play Prediction Contest | World Cup 2026</p>
          <div className="bg-[#1a1a1a] border border-yellow-800 rounded-xl p-4 mb-8 text-sm text-yellow-200">
            NO PURCHASE OR PAYMENT OF ANY KIND IS NECESSARY TO ENTER OR WIN. VOID WHERE PROHIBITED BY LAW.
          </div>
          <div className="space-y-6">
            {sections.map((s, i) => (
              <div key={i}>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-600">
            <p>Str8Up Gaming Holdings, Inc. | legal@str8upgaming.com</p>
          </div>
        </div>
      </div>
    </>
  );
}
