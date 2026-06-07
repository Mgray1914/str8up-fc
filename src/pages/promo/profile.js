import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {month:'short', day:'2-digit', year:'numeric'});
const truncAddr = (a) => a ? a.slice(0,6) + '...' + a.slice(-4) : '';

export default function PromoProfile() {
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState({ free: 0, locked: 0, total: 0 });
  const [predictions, setPredictions] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const w = typeof window !== 'undefined' && localStorage.getItem('wc_wallet');
    if (!w) { router.push('/promo'); return; }
    setWallet(w);

    Promise.all([
      fetch(`${API}/api/v1/promo/balance/${w}`).then(r => r.json()),
      fetch(`${API}/api/v1/promo/predictions/${w}`).then(r => r.json()),
      fetch(`${API}/api/v1/promo/user/${w}`).then(r => r.json()),
    ]).then(([bal, preds, user]) => {
      setBalance(bal);
      setPredictions(preds.predictions || []);
      setUserInfo(user);
    }).catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  const open = predictions.filter(p => p.status === 'UNMATCHED');
  const matched = predictions.filter(p => p.status === 'MATCHED');
  const settled = predictions.filter(p => p.status === 'SETTLED');

  return (
    <>
      <Head><title>My Profile - Global Soccer Challenge</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4">

          <button onClick={() => router.push('/promo/predictions')} className="text-gray-500 hover:text-white mb-6 block text-sm">&larr; Back to Predictions</button>

          <h1 className="text-3xl font-bold mb-6">My Profile</h1>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              {/* Wallet & Balance */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 text-center">
                  <p className="text-gray-400 text-sm mb-1">Wallet</p>
                  <p className="text-green-400 font-mono text-sm">{truncAddr(wallet)}</p>
                  {userInfo?.email && <p className="text-gray-600 text-xs mt-1">{userInfo.email}</p>}
                </div>
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 text-center">
                  <p className="text-gray-400 text-sm mb-1">Available Balance</p>
                  <p className="text-[#1DA1F2] text-2xl font-bold">{balance.free?.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs mt-1">WC Credits</p>
                </div>
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 text-center">
                  <p className="text-gray-400 text-sm mb-1">Locked in Bets</p>
                  <p className="text-yellow-400 text-2xl font-bold">{balance.locked?.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs mt-1">In escrow</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-[#1C1C1C] rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{predictions.length}</p>
                  <p className="text-gray-500 text-xs">Total Bets</p>
                </div>
                <div className="bg-[#1C1C1C] rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-cyan-400">{open.length}</p>
                  <p className="text-gray-500 text-xs">Open</p>
                </div>
                <div className="bg-[#1C1C1C] rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">{matched.length}</p>
                  <p className="text-gray-500 text-xs">Matched</p>
                </div>
                <div className="bg-[#1C1C1C] rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-purple-400">{settled.length}</p>
                  <p className="text-gray-500 text-xs">Settled</p>
                </div>
              </div>

              {/* Predictions List */}
              <h2 className="text-xl font-semibold mb-4">My Predictions</h2>
              {predictions.length === 0 ? (
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-8 text-center">
                  <p className="text-gray-500">No predictions yet.</p>
                  <button onClick={() => router.push('/promo/predictions')} className="mt-3 text-[#1DA1F2] text-sm hover:underline">Place your first prediction</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((p, i) => (
                    <div key={i} className="rounded-xl shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-4 flex items-center justify-between"
                      onClick={() => router.push(`/promo/match/${p.matchId}`)} style={{cursor:'pointer'}}>
                      <div>
                        <p className="text-white font-semibold">{p.matchId?.replace('GS_','Group ').replace('_',' - Match ')}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Picked: <span className="text-white">{p.pick}</span> &middot; {p.stake?.toLocaleString()} Credits &middot; {formatDate(p.createdAt)}
                        </p>
                        {p.opponentWallet && (
                          <p className="text-gray-600 text-xs mt-0.5">vs {truncAddr(p.opponentWallet)}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          p.status === 'SETTLED' && p.outcome === 'WIN' ? 'bg-yellow-900 text-yellow-400' :
                          p.status === 'SETTLED' && p.outcome === 'LOSS' ? 'bg-red-900 text-red-400' :
                          p.status === 'MATCHED' ? 'bg-green-900 text-green-400' :
                          p.status === 'CANCELLED' ? 'bg-gray-800 text-gray-400' :
                          'bg-cyan-900 text-cyan-400'
                        }`}>{p.status === 'SETTLED' ? (p.outcome === 'WIN' ? 'Won' : 'Lost') : p.status === 'CANCELLED' ? 'Returned' : p.status === 'MATCHED' ? 'Matched' : 'Waiting'}</span>
                        {p.txHash && (
                          <a href={`https://basescan.org/tx/${p.txHash}`} target="_blank" rel="noopener noreferrer"
                            className="block text-gray-600 text-xs mt-1 hover:text-[#1DA1F2]" onClick={e => e.stopPropagation()}>View on BaseScan</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
