import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { activePromo, siteUrl } from '../../config/promoMeta';
import TeamBadge from '../../promo/TeamBadge';
import PickModal from '../../components/promo/PickModal';
import { getJson } from '../../promo/api';
import { usePromoSession } from '../../promo/usePromoSession';
import { useRequireSignIn } from '../../promo/useRequireSignIn';
import { usePromoBalance } from '../../promo/usePromoBalance';
import { formatKickoff, outcomeLabel, roundLabel, roundOrder } from '../../promo/format';

const REFRESH_MS = 30 * 1000;

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-[#1DA1F2]';
  return <div role="status" className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] ${bg} text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm text-center`}>{message}</div>;
}

function predictionSummary(p) {
  if (p.status === 'SETTLED') return p.outcome === 'WIN' ? '🏆 Won' : '❌ Lost';
  if (p.status === 'CANCELLED') return '↩️ Returned';
  if (p.status === 'MATCHED') return '⚔️ Matched';
  return '⏳ Waiting for a match';
}

function MatchCard({ match, prediction, onPredict }) {
  const k = formatKickoff(match.kickoff);
  const isUpcoming = new Date(match.kickoff) > new Date() && match.status !== 'COMPLETED' && match.status !== 'CANCELLED';
  return (
    <div className="text-white rounded-[20px] w-full shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5">
      <Link href={`/promo/match/${encodeURIComponent(match.id)}`} className="block group">
        <div className="flex justify-center items-center gap-4 mb-4">
          <TeamBadge team={match.home} size={58} />
          <span className="text-[18px] text-gray-500">vs</span>
          <TeamBadge team={match.away} size={58} />
        </div>
        <div className="text-center mb-4">
          <h2 className="text-[16px] sm:text-[18px] font-semibold leading-tight group-hover:text-[#1DA1F2] transition">{match.home} vs {match.away}</h2>
          <p className="text-xs text-gray-500 mt-1">{k.date} · {k.time} {k.tz}</p>
        </div>
      </Link>
      {prediction ? (
        <div className={`text-center py-3 rounded-[18px] border ${prediction.status === 'SETTLED' && prediction.outcome === 'WIN' ? 'border-yellow-600 bg-[#1a1a0a]' : prediction.status === 'SETTLED' && prediction.outcome === 'LOSS' ? 'border-red-800 bg-[#1a0a0a]' : 'border-[#333]'}`}>
          <p className="text-green-400 text-sm font-semibold">Your pick: {outcomeLabel(prediction.pick, match)}</p>
          <p className="text-xs text-gray-500">{prediction.stake?.toLocaleString()} credits · {predictionSummary(prediction)}</p>
        </div>
      ) : match.status === 'COMPLETED' ? (
        <div className="text-center py-3 border border-[#333] rounded-[18px]">
          <p className="text-gray-400 text-sm">Full time</p>
          <p className="text-xs text-gray-600">{match.winner === 'draw' ? 'Draw' : `${outcomeLabel(match.winner, match)} won`}</p>
        </div>
      ) : isUpcoming ? (
        <button onClick={() => onPredict(match)} className="btn-gradient group hover:from-green hover:to-themeblue w-full">
          <span className="btn-inner group-hover:bg-transparent group-hover:dark:bg-transparent">Make Prediction</span>
        </button>
      ) : (
        <div className="text-center py-3 border border-[#333] rounded-[18px]">
          <p className="text-gray-600 text-sm">{match.status === 'CANCELLED' ? 'Postponed / cancelled' : 'Kicked off — predictions closed'}</p>
        </div>
      )}
    </div>
  );
}

function MatchCardSkeleton() {
  return (
    <div className="rounded-[20px] w-full shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 animate-pulse">
      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="h-[58px] w-[58px] rounded-full bg-[#1C1C1C]" />
        <span className="text-gray-700">vs</span>
        <div className="h-[58px] w-[58px] rounded-full bg-[#1C1C1C]" />
      </div>
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="h-4 w-48 bg-[#1C1C1C] rounded" />
        <div className="h-3 w-36 bg-[#1C1C1C] rounded" />
      </div>
      <div className="h-12 w-full bg-[#1C1C1C] rounded-[18px]" />
    </div>
  );
}

export default function Predictions() {
  const signedIn = useRequireSignIn();
  const { wallet, authFetch } = usePromoSession();
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const { balance: bal, status: balanceStatus, refresh: refreshBalance } = usePromoBalance(wallet);
  const balance = bal ? bal.free : null;
  const [loading, setLoading] = useState(true);
  const [activeRound, setActiveRound] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [toast, setToast] = useState(null);
  const clearToast = useCallback(() => setToast(null), []);

  // Matches for this promo (public).
  useEffect(() => {
    getJson(`/matches?promo=${activePromo.apiPromoParam}`).then(data => {
      const list = ((data && data.matches) || []).map(m => ({
        id: m.matchId, home: m.homeTeam, away: m.awayTeam, round: m.round, kickoff: m.kickoffTime, status: m.status, winner: m.winner,
      }));
      setMatches(list);
      setLoading(false);
    });
  }, []);

  // The user's predictions and balance; refreshed periodically for match/settle updates.
  const loadMine = useCallback(async () => {
    if (!wallet) return;
    const [, mine] = await Promise.all([refreshBalance(), getJson(`/predictions/${wallet}`)]);
    if (mine && mine.predictions) {
      const byMatch = {};
      // newest first from the API: keep the latest pick per match
      for (const p of mine.predictions) if (!byMatch[p.matchId]) byMatch[p.matchId] = p;
      setPredictions(byMatch);
    }
  }, [wallet, refreshBalance]);
  useEffect(() => {
    loadMine();
    const t = setInterval(loadMine, REFRESH_MS);
    return () => clearInterval(t);
  }, [loadMine]);

  const rounds = useMemo(
    () => [...new Set(matches.map(m => m.round).filter(Boolean))].sort((a, b) => roundOrder(a) - roundOrder(b)),
    [matches]
  );
  // Default to the first matchweek with a match still to kick off (else the last one).
  useEffect(() => {
    if (activeRound || !rounds.length) return;
    const now = new Date();
    setActiveRound(rounds.find(r => matches.some(m => m.round === r && new Date(m.kickoff) > now)) || rounds[rounds.length - 1]);
  }, [rounds, matches, activeRound]);

  const visible = matches
    .filter(m => !activeRound || m.round === activeRound)
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));

  const submit = async ({ matchId, pick, stake }) => {
    try {
      const res = await authFetch('/predictions', { method: 'POST', body: { matchId, pick, stake } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, message: data.message || 'Could not place your prediction.' };
      setToast({ message: data.status === 'MATCHED' ? 'Prediction placed and matched!' : 'Prediction placed!', type: 'success' });
      loadMine();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || 'Network error. Try again.' };
    }
  };

  return (
    <>
      <Head>
        <title>{`Matches - ${activePromo.name}`}</title>
        <meta name="description" content={activePromo.ogDescription} />
        <meta property="og:title" content={activePromo.title} />
        <meta property="og:description" content={activePromo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/promo/predictions`} />
        <meta property="og:image" content={activePromo.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-1">{activePromo.name}</h1>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">
              {activePromo.seasonLabel}{activeRound ? ` · ${roundLabel(activeRound)} · ${visible.length} matches` : ''}
            </p>
            <div className="flex justify-center items-center gap-3 flex-wrap">
              <span className="bg-[#1C1C1C] rounded-xl px-4 py-2 text-sm">
                <span className="text-gray-400">Balance: </span>
                {balance != null ? (
                  <span className="text-[#1DA1F2] font-bold">{balance.toLocaleString()}</span>
                ) : balanceStatus === 'error' ? (
                  <><span className="text-gray-500 font-bold">—</span> <button onClick={refreshBalance} className="text-xs underline text-gray-400 hover:text-white">retry</button></>
                ) : (
                  <span className="inline-block h-3 w-14 rounded bg-[#2a2a2a] animate-pulse align-middle" aria-label="Loading balance" />
                )}
              </span>
              <span className="bg-[#1C1C1C] rounded-xl px-4 py-2 text-sm">
                <span className="text-gray-400">Picks: </span>
                <span className="text-white font-bold">{Object.keys(predictions).length}</span>
              </span>
              <Link href="/promo/vault" className="bg-[#1C1C1C] rounded-xl px-4 py-2 text-sm hover:bg-[#252525] transition">
                <span className="text-gray-400">💼 </span><span className="text-white font-bold">The Vault</span>
              </Link>
              <Link href="/promo/leaderboard" className="bg-[#1C1C1C] rounded-xl px-4 py-2 text-sm hover:bg-[#252525] transition">
                <span className="text-gray-400">🏆 </span><span className="text-white font-bold">Leaderboard</span>
              </Link>
            </div>
          </div>

          {rounds.length > 1 && (
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-8 flex-wrap px-2" role="tablist" aria-label="Matchweek">
              {rounds.map(r => (
                <button key={r} role="tab" aria-selected={activeRound === r} onClick={() => setActiveRound(r)}
                  className={`px-3 h-9 sm:h-10 rounded-full text-xs sm:text-sm font-bold transition border whitespace-nowrap ${
                    activeRound === r ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white' : 'border-[#333] text-gray-500 hover:border-[#555]'
                  }`}>{roundLabel(r)}</button>
              ))}
            </div>
          )}

          {loading || !signedIn ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
              {[...Array(6)].map((_, i) => <MatchCardSkeleton key={i} />)}
            </div>
          ) : visible.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No matches scheduled yet. Check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
              {visible.map(m => (
                <MatchCard key={m.id} match={m} prediction={predictions[m.id]} onPredict={setSelectedMatch} />
              ))}
            </div>
          )}
          <p className="text-center text-xs text-gray-600 mt-10">Kickoff times are shown in your local time zone. {activePromo.disclaimer}</p>
        </div>
      </div>
      {selectedMatch && (
        <PickModal match={selectedMatch} balance={balance || 0} onClose={() => setSelectedMatch(null)} onSubmit={submit} />
      )}
    </>
  );
}
