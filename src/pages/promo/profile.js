import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { activePromo } from '../../config/promoMeta';
import { getJson } from '../../promo/api';
import { usePromoSession } from '../../promo/usePromoSession';
import { useRequireSignIn } from '../../promo/useRequireSignIn';
import { formatKickoff, outcomeLabel, roundLabel, truncAddr } from '../../promo/format';

const statusChip = (p) => {
  if (p.status === 'SETTLED') return p.outcome === 'WIN' ? ['Won', 'bg-yellow-900 text-yellow-400'] : ['Lost', 'bg-red-900 text-red-400'];
  if (p.status === 'CANCELLED') return ['Returned', 'bg-gray-800 text-gray-400'];
  if (p.status === 'MATCHED') return ['Matched', 'bg-green-900 text-green-400'];
  return ['Waiting', 'bg-cyan-900 text-cyan-400'];
};

// "My Picks": the signed-in user's balance and predictions.
export default function PromoProfile() {
  const router = useRouter();
  const signedIn = useRequireSignIn();
  const { wallet } = usePromoSession();
  const [balance, setBalance] = useState({ free: 0, locked: 0, total: 0 });
  const [predictions, setPredictions] = useState([]);
  const [matches, setMatches] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet) return;
    let cancelled = false;
    Promise.all([
      getJson(`/balance/${wallet}`),
      getJson(`/predictions/${wallet}`),
      getJson(`/user/${wallet}`),
      getJson(`/matches?promo=${activePromo.apiPromoParam}`),
    ]).then(([bal, preds, user, ms]) => {
      if (cancelled) return;
      if (bal) setBalance(bal);
      setPredictions((preds && preds.predictions) || []);
      setUserInfo(user && user.user);
      const byId = {};
      for (const m of (ms && ms.matches) || []) {
        byId[m.matchId] = { id: m.matchId, home: m.homeTeam, away: m.awayTeam, round: m.round, kickoff: m.kickoffTime };
      }
      setMatches(byId);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [wallet]);

  const count = (s) => predictions.filter(p => p.status === s).length;

  return (
    <>
      <Head><title>{`My Picks - ${activePromo.name}`}</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/promo/predictions" className="text-gray-500 hover:text-white mb-6 block text-sm">&larr; Back to matches</Link>
          <h1 className="text-3xl font-bold mb-6">My Picks</h1>

          {loading || !signedIn ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 text-center">
                  <p className="text-gray-400 text-sm mb-1">Account</p>
                  <p className="text-green-400 font-mono text-sm">{truncAddr(wallet)}</p>
                  {userInfo?.email && <p className="text-gray-600 text-xs mt-1">{userInfo.email}</p>}
                </div>
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 text-center">
                  <p className="text-gray-400 text-sm mb-1">Available</p>
                  <p className="text-[#1DA1F2] text-2xl font-bold">{balance.free?.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs mt-1">Promo Credits</p>
                </div>
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 text-center">
                  <p className="text-gray-400 text-sm mb-1">In open picks</p>
                  <p className="text-yellow-400 text-2xl font-bold">{balance.locked?.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs mt-1">Returned or paid out at full time</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[['Total picks', predictions.length, 'text-white'], ['Waiting', count('UNMATCHED'), 'text-cyan-400'],
                  ['Matched', count('MATCHED'), 'text-green-400'], ['Settled', count('SETTLED'), 'text-purple-400']].map(([label, n, cls]) => (
                  <div key={label} className="bg-[#1C1C1C] rounded-xl p-4 text-center">
                    <p className={`text-2xl font-bold ${cls}`}>{n}</p>
                    <p className="text-gray-500 text-xs">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">My predictions</h2>
                <Link href="/promo/vault" className="text-sm text-[#1DA1F2] hover:underline">Stock rewards → The Vault</Link>
              </div>
              {predictions.length === 0 ? (
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-8 text-center">
                  <p className="text-gray-500">No predictions yet.</p>
                  <Link href="/promo/predictions" className="mt-3 inline-block text-[#1DA1F2] text-sm hover:underline">Make your first prediction</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((p, i) => {
                    const m = matches[p.matchId];
                    const [chip, chipCls] = statusChip(p);
                    const k = m ? formatKickoff(m.kickoff) : null;
                    return (
                      <div key={p._id || i} role="link" tabIndex={0}
                        className="rounded-xl shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-4 flex items-center justify-between gap-3 cursor-pointer"
                        onClick={() => router.push(`/promo/match/${encodeURIComponent(p.matchId)}`)}
                        onKeyDown={e => e.key === 'Enter' && router.push(`/promo/match/${encodeURIComponent(p.matchId)}`)}>
                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate">{m ? `${m.home} vs ${m.away}` : p.matchId}</p>
                          {m && <p className="text-gray-600 text-xs">{roundLabel(m.round)} · {k.date} {k.time} {k.tz}</p>}
                          <p className="text-gray-500 text-xs mt-1">
                            Pick: <span className="text-white">{m ? outcomeLabel(p.pick, m) : p.pick}</span> &middot; {p.stake?.toLocaleString()} Credits
                            {p.opponentWallet ? <> &middot; vs {truncAddr(p.opponentWallet)}</> : null}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${chipCls}`}>{chip}</span>
                          {p.txHash && (
                            <a href={`https://basescan.org/tx/${p.txHash}`} target="_blank" rel="noopener noreferrer"
                              className="block text-gray-600 text-xs mt-1 hover:text-[#1DA1F2]" onClick={e => e.stopPropagation()}>View on BaseScan</a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
          <p className="text-center text-xs text-gray-600 mt-10">{activePromo.creditsNote}</p>
        </div>
      </div>
    </>
  );
}
