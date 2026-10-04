import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { activePromo, siteUrl } from '../../config/promoMeta';
import { getJson } from '../../promo/api';
import { truncAddr } from '../../promo/format';
import { usePromoSession } from '../../promo/usePromoSession';
const MEDALS = ['🥇','🥈','🥉'];

export default function Leaderboard() {
  const { wallet } = usePromoSession();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJson('/leaderboard').then(data => {
      setLeaders((data && data.leaderboard) || []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Head>
        <title>{`Leaderboard - ${activePromo.name}`}</title>
        <meta name="description" content={activePromo.ogDescription} />
        <meta property="og:title" content={`Leaderboard — ${activePromo.shortName || activePromo.name}`} />
        <meta property="og:description" content={activePromo.ogDescription} />
        <meta property="og:url" content={`${siteUrl}/promo/leaderboard`} />
        <meta property="og:image" content={activePromo.ogImage} />
      </Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/promo/predictions" className="text-gray-500 hover:text-white mb-6 block text-sm">&larr; Back to matches</Link>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-gray-500 text-sm">{`Top Promo Credit balances in the ${activePromo.name} · ${activePromo.seasonLabel}`}</p>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-xl bg-[#1C1C1C] p-4 animate-pulse h-16" />
              ))}
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No players yet. Be the first!</div>
          ) : (
            <div className="space-y-3">
              {leaders.map((u, i) => (
                <div key={u.walletAddress || i} className={`rounded-xl p-4 flex items-center justify-between ${i < 3 ? 'shadow-[1px_-1px_4px_1px_#3d3c3ceb] border border-[#333]' : 'bg-[#1C1C1C]'} ${wallet && u.walletAddress?.toLowerCase() === wallet ? 'ring-1 ring-[#1DA1F2]' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-900 text-yellow-400' : i === 1 ? 'bg-gray-700 text-gray-300' : i === 2 ? 'bg-orange-900 text-orange-400' : 'bg-[#1C1C1C] text-gray-500'}`}>
                      {i < 3 ? MEDALS[i] : i + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{truncAddr(u.walletAddress)}{wallet && u.walletAddress?.toLowerCase() === wallet ? <span className="text-[#1DA1F2] text-xs ml-2">You</span> : null}</p>
                      <p className="text-gray-500 text-xs">{u.predictionCount} pick{u.predictionCount !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-white'}`}>{u.credits?.toLocaleString()}</p>
                    <p className="text-gray-600 text-xs">credits</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-center text-xs text-gray-600 mt-10">{activePromo.disclaimer}</p>
        </div>
      </div>
    </>
  );
}
