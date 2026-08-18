import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { activePromo } from '../../config/promoMeta';

const truncAddr = (a) => a ? a.slice(0,6) + '...' + a.slice(-4) : '';
const MEDALS = ['🥇','🥈','🥉'];

export default function Leaderboard() {
  const router = useRouter();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/leaderboard`)
      .then(r => r.json())
      .then(data => setLeaders(data.leaderboard || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head><title>{`Leaderboard - ${activePromo.name}`}</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <button onClick={() => router.push('/promo/predictions')} className="text-gray-500 hover:text-white mb-6 block text-sm">&larr; Back to Predictions</button>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-gray-500 text-sm">{`Top performers in the ${activePromo.name}`}</p>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-xl bg-[#1C1C1C] p-4 animate-pulse h-16" />
              ))}
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No data yet.</div>
          ) : (
            <div className="space-y-3">
              {leaders.map((u, i) => (
                <div key={i} className={`rounded-xl p-4 flex items-center justify-between ${i < 3 ? 'shadow-[1px_-1px_4px_1px_#3d3c3ceb] border border-[#333]' : 'bg-[#1C1C1C]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-900 text-yellow-400' : i === 1 ? 'bg-gray-700 text-gray-300' : i === 2 ? 'bg-orange-900 text-orange-400' : 'bg-[#1C1C1C] text-gray-500'}`}>
                      {i < 3 ? MEDALS[i] : i + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{truncAddr(u.walletAddress)}</p>
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
        </div>
      </div>
    </>
  );
}
