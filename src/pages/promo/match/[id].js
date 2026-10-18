import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { activePromo, siteUrl } from '../../../config/promoMeta';
import TeamBadge from '../../../promo/TeamBadge';
import PickModal from '../../../components/promo/PickModal';
import { getJson } from '../../../promo/api';
import { usePromoSession } from '../../../promo/usePromoSession';
import { useRequireSignIn } from '../../../promo/useRequireSignIn';
import { usePromoBalance } from '../../../promo/usePromoBalance';
import { formatKickoff, outcomeLabel, pickOptions, roundLabel, truncAddr } from '../../../promo/format';

// Taking an open pick: equal-stake matching, so the stake is that pick's amount.
const takeNote = (w, match) => `You're taking ${outcomeLabel(w.pick, match)} ${w.stake.toLocaleString()} from ${truncAddr(w.walletAddress)}. Picks only match at the same amount.`;

function WagerRow({ w, match, right }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#1C1C1C]">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 shrink-0 rounded-full bg-[#333] flex items-center justify-center text-xs text-gray-400">
          {w.walletAddress?.slice(2, 4).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-white truncate">
            {truncAddr(w.walletAddress)}{w.opponentWallet ? ` vs ${truncAddr(w.opponentWallet)}` : ''}
          </p>
          <p className="text-xs text-gray-500">{w.stake?.toLocaleString()} Credits &middot; {outcomeLabel(w.pick, match)}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

function statusChip(w) {
  if (w.status === 'SETTLED') {
    return w.outcome === 'WIN'
      ? <span className="text-xs px-3 py-1 rounded-full font-semibold bg-yellow-900 text-yellow-400">Won</span>
      : <span className="text-xs px-3 py-1 rounded-full font-semibold bg-red-900 text-red-400">Lost</span>;
  }
  return <span className="text-xs px-3 py-1 rounded-full font-semibold bg-green-900 text-green-400">Matched</span>;
}

export default function MatchDetail() {
  const router = useRouter();
  const { id } = router.query;
  const signedIn = useRequireSignIn();
  const { wallet, authFetch } = usePromoSession();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const { balance: bal, refresh: loadBalance } = usePromoBalance(wallet);
  const balance = bal ? bal.free : null;
  const [openWagers, setOpenWagers] = useState([]);
  const [matchedWagers, setMatchedWagers] = useState([]);
  const [pick, setPick] = useState(null);
  // Prediction modal: { initialPick, options?, title?, note?, take? } or null; take = the open pick being taken
  const [modal, setModal] = useState(null);

  const loadWagers = useCallback(async () => {
    if (!id) return;
    const data = await getJson(`/predictions/match/${encodeURIComponent(id)}`);
    setOpenWagers((data && data.open) || []);
    setMatchedWagers((data && data.matched) || []);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    Promise.all([getJson(`/matches?promo=${activePromo.apiPromoParam}`), loadWagers()]).then(([data]) => {
      if (cancelled) return;
      const m = ((data && data.matches) || []).find(x => x.matchId === id);
      setMatch(m ? { id: m.matchId, home: m.homeTeam, away: m.awayTeam, round: m.round, kickoff: m.kickoffTime, status: m.status, winner: m.winner } : null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id, loadWagers]);

  const submit = async ({ matchId, pick: p, stake }) => {
    try {
      const take = modal && modal.take;
      const body = take ? { matchId, pick: p, stake: take.stake, takePredictionId: take._id } : { matchId, pick: p, stake };
      const res = await authFetch('/predictions', { method: 'POST', body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) loadWagers(); // someone else took it first: refresh the list
        return { ok: false, message: data.message || 'Could not place your prediction.' };
      }
      loadWagers();
      loadBalance();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || 'Network error. Try again.' };
    }
  };

  if (loading || !signedIn) return <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 text-center">Loading...</div>;
  if (!match) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 text-center">
        <p className="mb-4">Match not found.</p>
        <Link href="/promo/predictions" className="text-[#1DA1F2] underline">Back to matches</Link>
      </div>
    );
  }

  const k = formatKickoff(match.kickoff);
  const isOpen = new Date(match.kickoff) > new Date() && match.status !== 'COMPLETED' && match.status !== 'CANCELLED';
  const options = pickOptions(match, activePromo.allowDraw);
  const mine = (w) => Boolean(wallet) && w.walletAddress?.toLowerCase() === wallet;

  return (
    <>
      <Head>
        <title>{`${match.home} vs ${match.away} - ${activePromo.name}`}</title>
        <meta name="description" content={activePromo.ogDescription} />
        <meta property="og:title" content={`${match.home} vs ${match.away} — ${activePromo.shortName || activePromo.name}`} />
        <meta property="og:description" content={activePromo.ogDescription} />
        <meta property="og:url" content={`${siteUrl}/promo/match/${encodeURIComponent(match.id)}`} />
        <meta property="og:image" content={activePromo.ogImage} />
      </Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/promo/predictions" className="text-gray-500 hover:text-white mb-6 block text-sm">&larr; Back to matches</Link>

          <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-6 sm:p-8 mb-8">
            <div className="flex justify-center items-center gap-6 mb-4">
              <TeamBadge team={match.home} size={72} />
              <span className="text-[24px] text-gray-500">vs</span>
              <TeamBadge team={match.away} size={72} />
            </div>
            <h1 className="text-center text-xl font-semibold mb-1">{match.home} vs {match.away}</h1>
            <p className="text-center text-gray-500 text-sm mb-6">{roundLabel(match.round)} · {activePromo.seasonLabel}</p>

            <div className="flex justify-center gap-4 mb-6 max-w-md mx-auto">
              <div className="flex-1 bg-[#1C1C1C] p-3 rounded-md">
                <p className="text-gray-400 text-[11px]">KICKOFF ({k.tz})</p>
                <p className="text-[16px]">{k.date}</p>
                <p className="text-sm text-gray-400">{k.time}</p>
              </div>
              <div className="flex-1 bg-[#1C1C1C] p-3 rounded-md">
                <p className="text-gray-400 text-[11px]">MATCHWEEK</p>
                <p className="text-[16px]">{roundLabel(match.round)}</p>
                <p className="text-sm text-gray-400">{activePromo.seasonLabel}</p>
              </div>
            </div>

            {match.status === 'COMPLETED' ? (
              <div className="text-center max-w-md mx-auto bg-[#0a1f0a] border border-green-800 rounded-[16px] p-6">
                <p className="text-gray-400 text-sm mb-2">Full time</p>
                <p className="text-2xl font-bold text-green-400">{match.winner === 'draw' ? 'Draw' : `${outcomeLabel(match.winner, match)} won`}</p>
              </div>
            ) : isOpen ? (
              <>
                <div className="flex gap-2 sm:gap-3 mb-6 max-w-md mx-auto">
                  {options.map(o => (
                    <button key={o.v} onClick={() => setPick(o.v)}
                      className={`flex-1 py-3 px-1 rounded-[12px] text-sm font-semibold transition border ${
                        pick === o.v ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white' : 'border-[#333] text-gray-400 hover:border-[#555]'
                      }`}>{o.l}</button>
                  ))}
                </div>
                <div className="max-w-sm mx-auto">
                  <button onClick={() => { loadBalance(); setModal({ initialPick: pick }); }} disabled={!pick}
                    className="btn-gradient group hover:from-green hover:to-themeblue disabled:opacity-30 disabled:cursor-not-allowed w-full">
                    <span className="btn-inner group-hover:bg-transparent">Make Prediction</span>
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 text-sm">
                {match.status === 'CANCELLED' ? 'This match was postponed or cancelled; stakes are returned.' : 'Kicked off — predictions are closed.'}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Open picks</h3>
                <span className="text-gray-500 text-sm">{openWagers.length} open</span>
              </div>
              <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-4 min-h-[200px]">
                {openWagers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-sm">No open picks yet.</p>
                    <p className="text-gray-700 text-xs mt-1">Make yours to get things going.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {openWagers.map((w, i) => (
                      <WagerRow key={w._id || i} w={w} match={match} right={
                        isOpen && !mine(w) ? (
                          // Three outcomes: either different outcome can take this pick, at its exact stake.
                          <div className="flex flex-col gap-1 shrink-0">
                            {options.filter(o => o.v !== w.pick).map(o => (
                              <button key={o.v} onClick={() => {
                                  loadBalance();
                                  setModal({ initialPick: o.v, options: options.filter(x => x.v !== w.pick), title: 'Take this pick', note: takeNote(w, match), take: w });
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#1DA1F2] text-white text-xs font-semibold hover:opacity-90 transition whitespace-nowrap">
                                Take {w.stake?.toLocaleString()} on {o.l}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="unmatched text-xs shrink-0">{mine(w) ? 'Yours' : 'Open'}</span>
                        )
                      } />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Matched picks</h3>
                <span className="text-gray-500 text-sm">{matchedWagers.length} matched</span>
              </div>
              <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-4 min-h-[200px]">
                {matchedWagers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-sm">No matched picks yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matchedWagers.map((w, i) => <WagerRow key={w._id || i} w={w} match={match} right={statusChip(w)} />)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-600 mt-10">Kickoff time is shown in your local time zone. {activePromo.disclaimer}</p>
        </div>
      </div>

      {modal && (
        <PickModal
          key={modal.take ? `take-${modal.take._id}` : 'pick'}
          match={match}
          balance={balance || 0}
          initialPick={modal.initialPick}
          options={modal.options}
          title={modal.title}
          note={modal.note}
          lockedStake={modal.take ? modal.take.stake : null}
          onClose={() => setModal(null)}
          onSubmit={submit}
        />
      )}
    </>
  );
}
