import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { activePromo } from '../../config/promoMeta';
import { getJson } from '../../promo/api';
import { usePromoSession } from '../../promo/usePromoSession';
import { useRequireSignIn } from '../../promo/useRequireSignIn';
import { outcomeLabel } from '../../promo/format';
import StockPicker from '../../components/promo/StockPicker';

const money = (n) => (n == null ? '—' : n.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const shareFmt = (n) => (n == null ? '—' : n.toLocaleString(undefined, { maximumFractionDigits: 6 }));
// "Fri Oct 16, 4:00 PM ET" - always US Eastern, whatever the viewer's time zone.
function etStamp(when) {
  const d = new Date(when);
  if (Number.isNaN(d.getTime())) return null;
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(d).map(x => [x.type, x.value]));
  return `${p.weekday} ${p.month} ${p.day}, ${p.hour}:${p.minute} ${p.dayPeriod} ET`;
}
const REWARD_LIST_LIMIT = 200;
const dateFmt = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');

// Friendly copy for each reward state. FAILED is still awarded: an admin retries
// the purchase, so users see it as pending.
const STATUS_COPY = {
  PRICE_PENDING: { label: 'Awaiting price', cls: 'bg-[#1f1a0a] text-yellow-400', help: 'Your share amount is set from the last official market close before kickoff. We’ll fill it in once that price is available.' },
  PENDING_PURCHASE: { label: 'Pending purchase', cls: 'bg-cyan-900 text-cyan-300', help: 'Your share amount is locked. Str8Up buys rewards in batches, so this will show as purchased soon.' },
  IN_BATCH: { label: 'Being purchased', cls: 'bg-cyan-900 text-cyan-300', help: 'This reward is part of a purchase in progress.' },
  FAILED: { label: 'Pending purchase', cls: 'bg-cyan-900 text-cyan-300', help: 'The purchase is taking longer than usual. Your reward is safe and we’ll retry it.' },
  PURCHASED: { label: 'Purchased', cls: 'bg-green-900 text-green-400', help: 'These shares have been bought and are held by Str8Up on your behalf.' },
  SKIPPED: { label: 'No reward', cls: 'bg-gray-800 text-gray-400' },
};
const SKIP_COPY = {
  ONE_PER_MATCH: 'Only one bet per match earns a stock reward.',
  DAILY_CAP: 'You reached today’s reward limit. Rewards start again tomorrow (UTC).',
};

function RewardRow({ r, match }) {
  const s = STATUS_COPY[r.status] || { label: r.status, cls: 'bg-gray-800 text-gray-400' };
  const title = match ? `${match.home} vs ${match.away}` : r.matchId;
  const help = r.status === 'SKIPPED' ? (SKIP_COPY[r.skipReason] || 'This bet did not earn a stock reward.') : s.help;
  return (
    <div className="rounded-xl bg-[#1C1C1C] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/promo/match/${encodeURIComponent(r.matchId)}`} className="text-white font-semibold text-sm hover:text-[#1DA1F2] truncate block">{title}</Link>
          <p className="text-gray-500 text-xs mt-0.5">
            {dateFmt(r.settledAt)} · {r.role === 'WINNER' ? 'Winning pick' : 'Matched pick'}
            {match && match.winner ? ` · Result: ${match.winner === 'draw' ? 'Draw' : `${outcomeLabel(match.winner, match)} won`}` : ''}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${s.cls}`}>{s.label}</span>
      </div>
      {r.status !== 'SKIPPED' && (
        <p className="text-sm text-white mt-2">
          {money(r.usd)} of {r.ticker}
          {r.shares != null && <span className="text-gray-400"> · {shareFmt(r.shares)} shares</span>}
          {r.lockedClose != null && <span className="text-gray-500 text-xs"> at {money(r.lockedClose)} ({r.lockedBarDate} close)</span>}
        </p>
      )}
      {help && <p className="text-xs text-gray-500 mt-1">{help}</p>}
    </div>
  );
}

// "The Vault": stock rewards earned in the promo, held by Str8Up on the user's behalf.
export default function Vault() {
  const signedIn = useRequireSignIn();
  const { wallet, authFetch } = usePromoSession();
  const [vault, setVault] = useState(null);
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    if (!wallet) return;
    const [v, ms] = await Promise.all([getJson(`/rewards/vault/${wallet}?limit=${REWARD_LIST_LIMIT}`), getJson(`/matches?promo=${activePromo.apiPromoParam}`)]);
    setFailed(!v);
    if (v) setVault(v);
    const byId = {};
    for (const m of (ms && ms.matches) || []) byId[m.matchId] = { home: m.homeTeam, away: m.awayTeam, winner: m.winner };
    setMatches(byId);
    setLoading(false);
  }, [wallet]);
  useEffect(() => { load(); }, [load]);

  const holdings = (vault && vault.holdings) || [];
  const rewards = (vault && vault.rewards) || [];
  const awaitingPrice = holdings.reduce((s, h) => s + (h.usdAwaitingPriceLock || 0), 0);
  // The quote timestamp the values are based on (Dinari's latest price, not when we fetched it).
  const priceTimes = holdings.map(h => h.priceAsOf && new Date(h.priceAsOf).getTime()).filter(t => t > 0);
  const priceStamp = priceTimes.length ? etStamp(Math.max(...priceTimes)) : null;
  const rewardCount = rewards.filter(r => r.status !== 'SKIPPED').length;
  const rewardCountLabel = `${rewardCount}${rewards.length >= REWARD_LIST_LIMIT ? '+' : ''} reward${rewardCount === 1 ? '' : 's'}`;

  return (
    <>
      <Head><title>{`The Vault - ${activePromo.name}`}</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/promo/predictions" className="text-gray-500 hover:text-white mb-6 block text-sm">&larr; Back to matches</Link>
          <h1 className="text-3xl font-bold mb-2">The Vault</h1>
          <p className="text-gray-400 text-sm mb-6">Stock rewards you have earned in the {activePromo.name}.</p>

          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 mb-8 text-sm text-gray-300">
            <p className="font-semibold text-white mb-1">Where your stock is held</p>
            <p>
              Your rewards are held by Str8Up on your behalf until you claim them. They are not in your wallet.
              Claiming will require identity verification — <span className="text-white">coming soon</span>.
            </p>
          </div>

          {loading || !signedIn ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-[#1C1C1C] animate-pulse" />)}</div>
          ) : failed && !vault ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-3">We couldn&apos;t load The Vault right now.</p>
              <button onClick={load} className="text-[#1DA1F2] underline text-sm">Try again</button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 text-center">
                  <p className="text-gray-400 text-sm mb-1">Current value</p>
                  <p className="text-[#1DA1F2] text-3xl font-bold">{money(vault.totals && vault.totals.currentValueUsd)}</p>
                  {priceStamp && <p className="text-gray-600 text-xs mt-1">Based on latest price · {priceStamp}</p>}
                </div>
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 text-center">
                  <p className="text-gray-400 text-sm mb-1">Total rewards earned</p>
                  <p className="text-white text-3xl font-bold">{money(vault.totals && vault.totals.usdAwarded)}<span className="text-gray-400 text-base font-normal"> · {rewardCountLabel}</span></p>
                  {awaitingPrice > 0 && <p className="text-yellow-500 text-xs mt-1">{money(awaitingPrice)} awaiting a share price</p>}
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-3">Holdings</h2>
              {holdings.length === 0 ? (
                <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-8 text-center mb-8">
                  <p className="text-gray-400">No stock rewards yet.</p>
                  <p className="text-gray-600 text-sm mt-1">Matched picks earn a small stock reward when the match is settled (limits apply).</p>
                  <Link href="/promo/predictions" className="mt-3 inline-block text-[#1DA1F2] text-sm hover:underline">Make a prediction</Link>
                </div>
              ) : (
                <div className="space-y-3 mb-8">
                  {holdings.map(h => (
                    <div key={h.ticker} className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-white font-semibold">{h.name} <span className="text-gray-500">({h.ticker})</span></p>
                          <p className="text-gray-500 text-xs">{h.currentPrice != null ? `${money(h.currentPrice)} per share` : 'Price unavailable right now'}</p>
                        </div>
                        <p className="text-[#1DA1F2] text-xl font-bold">{money(h.currentValueUsd)}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-[#1C1C1C] rounded-lg p-2">
                          <p className="text-green-400 font-semibold">{shareFmt(h.sharesPurchased)}</p>
                          <p className="text-gray-500 text-[11px]">Purchased</p>
                        </div>
                        {/* Zero tiles are greyed out, never in a warning colour. */}
                        <div className={`bg-[#1C1C1C] rounded-lg p-2 ${h.sharesPending ? '' : 'opacity-50'}`}>
                          <p className={`font-semibold ${h.sharesPending ? 'text-cyan-300' : 'text-gray-500'}`}>{shareFmt(h.sharesPending)}</p>
                          <p className="text-gray-500 text-[11px]">Pending purchase</p>
                        </div>
                        <div className={`bg-[#1C1C1C] rounded-lg p-2 ${h.usdAwaitingPriceLock ? '' : 'opacity-50'}`}>
                          <p className={`font-semibold ${h.usdAwaitingPriceLock ? 'text-yellow-400' : 'text-gray-500'}`}>{money(h.usdAwaitingPriceLock)}</p>
                          <p className="text-gray-500 text-[11px]">Awaiting price</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2 className="text-xl font-semibold mb-3">Choose your reward stock</h2>
              <div className="mb-8"><StockPicker wallet={wallet} authFetch={authFetch} /></div>

              <h2 className="text-xl font-semibold mb-3">Reward history</h2>
              {rewards.length === 0 ? (
                <p className="text-gray-500 text-sm mb-8">Your rewards will appear here after your matched picks are settled.</p>
              ) : (
                <div className="space-y-3 mb-8">
                  {rewards.map((r, i) => <RewardRow key={`${r.betId}-${r.role}-${i}`} r={r} match={matches[r.matchId]} />)}
                </div>
              )}
            </>
          )}

          <div className="text-xs text-gray-600 space-y-1 border-t border-gray-800 pt-6">
            <p>[PLACEHOLDER] Stock reward terms, including claiming, will be set out in the Official Rules.</p>
            <p>Share amounts are fixed from the last official market close before kickoff. Current values are indicative and change with the market.</p>
            <p>{activePromo.disclaimer}</p>
          </div>
        </div>
      </div>
    </>
  );
}
