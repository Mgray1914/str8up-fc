import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCurrentUser, useEvmAddress } from '@coinbase/cdp-hooks';
import { activePromo } from '../../../config/promoMeta';

const FLAG_CODES = {"Mexico": "mx", "South Africa": "za", "Korea Republic": "kr", "Czechia": "cz", "Canada": "ca", "Bosnia & Herzegovina": "ba", "Qatar": "qa", "Switzerland": "ch", "Brazil": "br", "Morocco": "ma", "Haiti": "ht", "Scotland": "gb-sct", "USA": "us", "Paraguay": "py", "Australia": "au", "Turkiye": "tr", "Germany": "de", "Curacao": "cw", "Cote d'Ivoire": "ci", "Ecuador": "ec", "Netherlands": "nl", "Japan": "jp", "Sweden": "se", "Tunisia": "tn", "Belgium": "be", "Egypt": "eg", "IR Iran": "ir", "New Zealand": "nz", "Spain": "es", "Cabo Verde": "cv", "Saudi Arabia": "sa", "Uruguay": "uy", "France": "fr", "Senegal": "sn", "Iraq": "iq", "Norway": "no", "Argentina": "ar", "Algeria": "dz", "Austria": "at", "Jordan": "jo", "Portugal": "pt", "Congo DR": "cd", "Uzbekistan": "uz", "Colombia": "co", "England": "gb-eng", "Croatia": "hr", "Ghana": "gh", "Panama": "pa"};
const NFL_LOGO_CODES = {"Arizona Cardinals": "ari", "Atlanta Falcons": "atl", "Baltimore Ravens": "bal", "Buffalo Bills": "buf", "Carolina Panthers": "car", "Chicago Bears": "chi", "Cincinnati Bengals": "cin", "Cleveland Browns": "cle", "Dallas Cowboys": "dal", "Denver Broncos": "den", "Detroit Lions": "det", "Green Bay Packers": "gb", "Houston Texans": "hou", "Indianapolis Colts": "ind", "Jacksonville Jaguars": "jax", "Kansas City Chiefs": "kc", "Las Vegas Raiders": "lv", "Los Angeles Chargers": "lac", "Los Angeles Rams": "lar", "Miami Dolphins": "mia", "Minnesota Vikings": "min", "New England Patriots": "ne", "New Orleans Saints": "no", "New York Giants": "nyg", "New York Jets": "nyj", "Philadelphia Eagles": "phi", "Pittsburgh Steelers": "pit", "San Francisco 49ers": "sf", "Seattle Seahawks": "sea", "Tampa Bay Buccaneers": "tb", "Tennessee Titans": "ten", "Washington Commanders": "wsh"};
const flagUrl = (team) => {
  const code = FLAG_CODES[team];
  if (!code) return null;
  return `https://flagcdn.com/w80/${code}.png`;
};
const nflLogoUrl = (team) => {
  const code = NFL_LOGO_CODES[team];
  if (!code) return null;
  return `https://a.espncdn.com/i/teamlogos/nfl/500/${code}.png`;
};
function FlagImg({ team, size = 40 }) {
  const [nflErrored, setNflErrored] = useState(false);
  const nflUrl = !nflErrored && nflLogoUrl(team);
  if (nflUrl) {
    return <img src={nflUrl} alt={team} width={size} height={size * 0.67} className="rounded-sm object-contain" style={{width: size, height: size * 0.67}} onError={() => setNflErrored(true)} />;
  }
  const url = flagUrl(team);
  if (!url) return <span className="text-lg font-bold text-gray-500">{team.slice(0,3)}</span>;
  return <img src={url} alt={team} width={size} height={size * 0.67} className="rounded-sm object-cover" style={{width: size, height: size * 0.67}} />;
}

const FIXTURES = [
  {id:"GS_A_1",home:"Mexico",away:"South Africa",group:"A",kickoff:"2026-06-11T19:00:00Z"},
  {id:"GS_A_2",home:"Korea Republic",away:"Czechia",group:"A",kickoff:"2026-06-12T02:00:00Z"},
  {id:"GS_A_3",home:"Czechia",away:"South Africa",group:"A",kickoff:"2026-06-18T17:00:00Z"},
  {id:"GS_A_4",home:"Mexico",away:"Korea Republic",group:"A",kickoff:"2026-06-19T01:00:00Z"},
  {id:"GS_A_5",home:"South Africa",away:"Korea Republic",group:"A",kickoff:"2026-06-22T19:00:00Z"},
  {id:"GS_A_6",home:"Czechia",away:"Mexico",group:"A",kickoff:"2026-06-22T19:00:00Z"},
  {id:"GS_B_1",home:"Canada",away:"Bosnia & Herzegovina",group:"B",kickoff:"2026-06-12T19:00:00Z"},
  {id:"GS_B_2",home:"Qatar",away:"Switzerland",group:"B",kickoff:"2026-06-13T01:00:00Z"},
  {id:"GS_B_3",home:"Switzerland",away:"Bosnia & Herzegovina",group:"B",kickoff:"2026-06-17T19:00:00Z"},
  {id:"GS_B_4",home:"Canada",away:"Qatar",group:"B",kickoff:"2026-06-18T22:00:00Z"},
  {id:"GS_B_5",home:"Bosnia & Herzegovina",away:"Qatar",group:"B",kickoff:"2026-06-21T19:00:00Z"},
  {id:"GS_B_6",home:"Switzerland",away:"Canada",group:"B",kickoff:"2026-06-22T03:00:00Z"},
  {id:"GS_C_1",home:"Brazil",away:"Morocco",group:"C",kickoff:"2026-06-13T01:00:00Z"},
  {id:"GS_C_2",home:"Haiti",away:"Scotland",group:"C",kickoff:"2026-06-13T22:00:00Z"},
  {id:"GS_C_3",home:"Morocco",away:"Haiti",group:"C",kickoff:"2026-06-18T17:00:00Z"},
  {id:"GS_C_4",home:"Brazil",away:"Haiti",group:"C",kickoff:"2026-06-19T00:30:00Z"},
  {id:"GS_C_5",home:"Scotland",away:"Morocco",group:"C",kickoff:"2026-06-19T22:00:00Z"},
  {id:"GS_C_6",home:"Scotland",away:"Brazil",group:"C",kickoff:"2026-06-22T22:00:00Z"},
  {id:"GS_D_1",home:"USA",away:"Paraguay",group:"D",kickoff:"2026-06-12T01:00:00Z"},
  {id:"GS_D_2",home:"Australia",away:"Turkiye",group:"D",kickoff:"2026-06-12T04:00:00Z"},
  {id:"GS_D_3",home:"Turkiye",away:"Paraguay",group:"D",kickoff:"2026-06-16T04:00:00Z"},
  {id:"GS_D_4",home:"USA",away:"Australia",group:"D",kickoff:"2026-06-20T19:00:00Z"},
  {id:"GS_D_5",home:"Turkiye",away:"USA",group:"D",kickoff:"2026-06-22T02:00:00Z"},
  {id:"GS_D_6",home:"Paraguay",away:"Australia",group:"D",kickoff:"2026-06-22T23:00:00Z"},
  {id:"GS_E_1",home:"Germany",away:"Curacao",group:"E",kickoff:"2026-06-13T17:00:00Z"},
  {id:"GS_E_2",home:"Cote d'Ivoire",away:"Ecuador",group:"E",kickoff:"2026-06-13T23:00:00Z"},
  {id:"GS_E_3",home:"Germany",away:"Cote d'Ivoire",group:"E",kickoff:"2026-06-19T00:00:00Z"},
  {id:"GS_E_4",home:"Ecuador",away:"Curacao",group:"E",kickoff:"2026-06-19T04:00:00Z"},
  {id:"GS_E_5",home:"Ecuador",away:"Germany",group:"E",kickoff:"2026-06-22T22:00:00Z"},
  {id:"GS_E_6",home:"Curacao",away:"Cote d'Ivoire",group:"E",kickoff:"2026-06-22T20:00:00Z"},
  {id:"GS_F_1",home:"Netherlands",away:"Sweden",group:"F",kickoff:"2026-06-13T04:00:00Z"},
  {id:"GS_F_2",home:"Sweden",away:"Tunisia",group:"F",kickoff:"2026-06-14T02:00:00Z"},
  {id:"GS_F_3",home:"Netherlands",away:"Japan",group:"F",kickoff:"2026-06-18T20:00:00Z"},
  {id:"GS_F_4",home:"Tunisia",away:"Japan",group:"F",kickoff:"2026-06-19T03:00:00Z"},
  {id:"GS_F_5",home:"Tunisia",away:"Netherlands",group:"F",kickoff:"2026-06-22T20:00:00Z"},
  {id:"GS_F_6",home:"Japan",away:"Sweden",group:"F",kickoff:"2026-06-22T23:00:00Z"},
  {id:"GS_G_1",home:"Belgium",away:"Egypt",group:"G",kickoff:"2026-06-15T19:00:00Z"},
  {id:"GS_G_2",home:"IR Iran",away:"New Zealand",group:"G",kickoff:"2026-06-16T01:00:00Z"},
  {id:"GS_G_3",home:"Belgium",away:"IR Iran",group:"G",kickoff:"2026-06-20T17:00:00Z"},
  {id:"GS_G_4",home:"New Zealand",away:"Egypt",group:"G",kickoff:"2026-06-20T19:00:00Z"},
  {id:"GS_G_5",home:"New Zealand",away:"Belgium",group:"G",kickoff:"2026-06-23T02:00:00Z"},
  {id:"GS_G_6",home:"Egypt",away:"IR Iran",group:"G",kickoff:"2026-06-23T02:00:00Z"},
  {id:"GS_H_1",home:"Spain",away:"Cabo Verde",group:"H",kickoff:"2026-06-14T16:00:00Z"},
  {id:"GS_H_2",home:"Saudi Arabia",away:"Uruguay",group:"H",kickoff:"2026-06-14T23:00:00Z"},
  {id:"GS_H_3",home:"Spain",away:"Saudi Arabia",group:"H",kickoff:"2026-06-18T22:00:00Z"},
  {id:"GS_H_4",home:"Uruguay",away:"Cabo Verde",group:"H",kickoff:"2026-06-19T23:00:00Z"},
  {id:"GS_H_5",home:"Cabo Verde",away:"Saudi Arabia",group:"H",kickoff:"2026-06-23T03:00:00Z"},
  {id:"GS_H_6",home:"Uruguay",away:"Spain",group:"H",kickoff:"2026-06-23T00:00:00Z"},
  {id:"GS_I_1",home:"France",away:"Senegal",group:"I",kickoff:"2026-06-15T01:00:00Z"},
  {id:"GS_I_2",home:"Iraq",away:"Norway",group:"I",kickoff:"2026-06-15T22:00:00Z"},
  {id:"GS_I_3",home:"Norway",away:"Senegal",group:"I",kickoff:"2026-06-20T20:00:00Z"},
  {id:"GS_I_4",home:"France",away:"Iraq",group:"I",kickoff:"2026-06-21T21:00:00Z"},
  {id:"GS_I_5",home:"Norway",away:"France",group:"I",kickoff:"2026-06-24T00:00:00Z"},
  {id:"GS_I_6",home:"Senegal",away:"Iraq",group:"I",kickoff:"2026-06-23T21:00:00Z"},
  {id:"GS_J_1",home:"Argentina",away:"Algeria",group:"J",kickoff:"2026-06-15T01:00:00Z"},
  {id:"GS_J_2",home:"Austria",away:"Jordan",group:"J",kickoff:"2026-06-16T04:00:00Z"},
  {id:"GS_J_3",home:"Argentina",away:"Austria",group:"J",kickoff:"2026-06-20T16:00:00Z"},
  {id:"GS_J_4",home:"Jordan",away:"Algeria",group:"J",kickoff:"2026-06-21T01:00:00Z"},
  {id:"GS_J_5",home:"Jordan",away:"Argentina",group:"J",kickoff:"2026-06-24T02:00:00Z"},
  {id:"GS_J_6",home:"Algeria",away:"Austria",group:"J",kickoff:"2026-06-23T23:30:00Z"},
  {id:"GS_K_1",home:"Portugal",away:"Congo DR",group:"K",kickoff:"2026-06-16T17:00:00Z"},
  {id:"GS_K_2",home:"Uzbekistan",away:"Colombia",group:"K",kickoff:"2026-06-16T22:00:00Z"},
  {id:"GS_K_3",home:"Colombia",away:"Congo DR",group:"K",kickoff:"2026-06-17T17:00:00Z"},
  {id:"GS_K_4",home:"Portugal",away:"Uzbekistan",group:"K",kickoff:"2026-06-21T01:00:00Z"},
  {id:"GS_K_5",home:"Colombia",away:"Portugal",group:"K",kickoff:"2026-06-24T21:00:00Z"},
  {id:"GS_K_6",home:"Congo DR",away:"Uzbekistan",group:"K",kickoff:"2026-06-16T23:30:00Z"},
  {id:"GS_L_1",home:"England",away:"Croatia",group:"L",kickoff:"2026-06-16T23:00:00Z"},
  {id:"GS_L_2",home:"Ghana",away:"Panama",group:"L",kickoff:"2026-06-16T23:00:00Z"},
  {id:"GS_L_3",home:"England",away:"Ghana",group:"L",kickoff:"2026-06-21T00:00:00Z"},
  {id:"GS_L_4",home:"Panama",away:"Croatia",group:"L",kickoff:"2026-06-21T20:00:00Z"},
  {id:"GS_L_5",home:"Panama",away:"England",group:"L",kickoff:"2026-06-23T19:00:00Z"},
  {id:"GS_L_6",home:"Croatia",away:"Ghana",group:"L",kickoff:"2026-06-23T21:00:00Z"},
];

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {month:'short', day:'2-digit', year:'numeric'});
const formatTime = (d) => new Date(d).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});
const truncAddr = (a) => a ? a.slice(0,6) + '...' + a.slice(-4) : '';
const formatWeekLabel = (round) => {
  const wk = /^W(\d+)$/.exec(round || '');
  if (wk) return `Week ${wk[1]}`;
  const pre = /^PRE(\d+)$/.exec(round || '');
  if (pre) return `Preseason ${pre[1]}`;
  return round;
};

export default function MatchDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser: user } = useCurrentUser();
  const { evmAddress: cdpAddress } = useEvmAddress();
  const [evmAddress, setEvmAddr] = useState(null);
  useEffect(() => { const w = cdpAddress || (typeof window !== 'undefined' && localStorage.getItem('wc_wallet')); if (w) setEvmAddr(w); }, [cdpAddress]);
  const [pick, setPick] = useState(null);
  const [showWager, setShowWager] = useState(false);
  const [stake, setStake] = useState(1000);
  const [balance, setBalance] = useState(50000);
  const [step, setStep] = useState('pick');
  const [openWagers, setOpenWagers] = useState([]);
  const [matchedWagers, setMatchedWagers] = useState([]);
  const [matchStatus, setMatchStatus] = useState(null);
  const [matchWinner, setMatchWinner] = useState(null);
  const [matchLeague, setMatchLeague] = useState('NFL');
  const [apiMatch, setApiMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchTarget, setMatchTarget] = useState(null);
  const [matching, setMatching] = useState(false);

  const fixture = FIXTURES.find(f => f.id === id);
  const match = fixture || (apiMatch ? {
    id: apiMatch.matchId,
    home: apiMatch.homeTeam,
    away: apiMatch.awayTeam,
    group: apiMatch.group,
    round: apiMatch.round,
    kickoff: apiMatch.kickoffTime,
  } : null);

  useEffect(() => {
    const wallet = evmAddress || (typeof window !== 'undefined' && localStorage.getItem('wc_wallet'));
    if (wallet) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/balance/${wallet}`)
        .then(r => r.json())
        .then(data => { if (data.free !== undefined) setBalance(data.free); })
        .catch(err => console.error('Balance fetch error:', err));
    }
  }, [evmAddress]);

  useEffect(() => {
    const wallet = evmAddress || (typeof window !== 'undefined' && localStorage.getItem('wc_wallet'));
    if (wallet) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/balance/${wallet}`)
        .then(r => r.json())
        .then(data => { if (data.free !== undefined) setBalance(data.free); })
        .catch(err => console.error('Balance fetch error:', err));
    }
  }, [evmAddress]);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/matches`).then(r => r.json()).then(data => {
      const m = data.matches?.find(m => m.matchId === id);
      if (m) { setMatchStatus(m.status); setMatchWinner(m.winner); setMatchLeague(m.league || 'SOCCER'); setApiMatch(m); }
    }).catch(() => {});
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/predictions/match/${id}`)
      .then(r => r.json())
      .then(data => {
        setOpenWagers(data.open || []);
        setMatchedWagers(data.matched || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!evmAddress) { alert('Wallet not ready. Go back to /promo first.'); return; }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/predictions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: evmAddress, matchId: id, pick, stake })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      setStep('success');
      // Refresh wagers
      const r2 = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/predictions/match/${id}`);
      const d2 = await r2.json();
      setOpenWagers(d2.open || []);
      setMatchedWagers(d2.matched || []);
    } catch (err) {
      console.error(err);
      alert('Error submitting prediction');
    }
  };



  const handleMatch = async () => {
    if (!evmAddress || !matchTarget) return;
    setMatching(true);
    const opposingPick = matchTarget.pick === 'home' ? 'away' : matchTarget.pick === 'away' ? 'home' : 'draw';
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/predictions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: evmAddress, matchId: id, pick: opposingPick, stake: matchTarget.stake })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); setMatching(false); return; }
      // Refresh wagers
      const r2 = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/predictions/match/${id}`);
      const d2 = await r2.json();
      setOpenWagers(d2.open || []);
      setMatchedWagers(d2.matched || []);
      setMatchTarget(null);
      setStep('success');
      setShowWager(true);
    } catch (err) {
      console.error(err);
      alert('Error matching prediction');
    }
    setMatching(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 text-center">Loading...</div>;
  if (!match) return <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 text-center">Match not found.</div>;

  const kickoff = new Date(match.kickoff);
  const isUpcoming = kickoff > new Date();

  return (
    <>
      <Head><title>{match.home} vs {match.away} - {matchLeague === 'NFL' ? activePromo.name : 'Global Soccer Challenge'}</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4">

          <button onClick={() => router.push('/promo/predictions')} className="text-gray-500 hover:text-white mb-6 block text-sm">&larr; Back to Predictions</button>

          {/* Match Card */}
          <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-8 mb-8">
            <div className="flex justify-center items-center gap-6 mb-4">
              <div className="h-[72px] w-[72px] border border-[#333] shadow-[0px_0px_15px_0px_#8C8C8C] rounded-full flex items-center justify-center text-3xl bg-[#1C1C1C]">
                <FlagImg team={match.home} size={48} />
              </div>
              <span className="text-[28px] font-regular text-gray-500">VS</span>
              <div className="h-[72px] w-[72px] border border-[#333] shadow-[0px_0px_15px_0px_#8C8C8C] rounded-full flex items-center justify-center text-3xl bg-[#1C1C1C]">
                <FlagImg team={match.away} size={48} />
              </div>
            </div>
            <h1 className="text-center text-xl font-semibold mb-1">{match.home} vs {match.away}</h1>
            <p className="text-center text-gray-500 text-sm mb-6">{matchLeague === 'NFL' ? `${formatWeekLabel(match.round)} · ${activePromo.seasonLabel}` : `Group ${match.group} · World Cup 2026`}</p>

            {matchStatus === 'COMPLETED' ? (
              <div className="text-center mb-6 max-w-md mx-auto">
                <div className="bg-[#0a1f0a] border border-green-800 rounded-[16px] p-6">
                  <p className="text-gray-400 text-sm mb-2">Match Completed</p>
                  <p className="text-2xl font-bold text-green-400">{matchWinner === 'home' ? match.home : matchWinner === 'away' ? match.away : 'Draw'} {matchWinner !== 'draw' ? 'Won' : ''}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Team Selection */}
                <div className="flex gap-3 mb-6 max-w-md mx-auto">
                  {(matchLeague === 'NFL'
                    ? [{v:'home',l:match.home},{v:'away',l:match.away}]
                    : [{v:'home',l:match.home},{v:'draw',l:'Draw'},{v:'away',l:match.away}]
                  ).map(o => (
                    <button key={o.v} onClick={() => setPick(o.v)}
                      className={`flex-1 py-3 rounded-[12px] text-sm font-semibold transition border ${
                        pick === o.v ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white' : 'border-[#333] text-gray-400 hover:border-[#555]'
                      }`}>{o.l}</button>
                  ))}
                </div>
                {/* Date boxes */}
                <div className="flex justify-center gap-4 mb-6 max-w-md mx-auto">
                  <div className="flex-1 bg-[#1C1C1C] p-3 rounded-md">
                    <p className="text-gray-400 text-[11px]">KICKOFF</p>
                    <p className="text-[16px]">{formatDate(match.kickoff)}</p>
                    <p className="text-sm text-gray-400">{formatTime(match.kickoff)}</p>
                  </div>
                  <div className="flex-1 bg-[#1C1C1C] p-3 rounded-md">
                    {matchLeague === 'NFL' ? (
                      <>
                        <p className="text-gray-400 text-[11px]">WEEK</p>
                        <p className="text-[16px]">{formatWeekLabel(match.round)}</p>
                        <p className="text-sm text-gray-400">{activePromo.seasonLabel}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-400 text-[11px]">GROUP</p>
                        <p className="text-[16px]">Group {match.group}</p>
                        <p className="text-sm text-gray-400">Group Stage</p>
                      </>
                    )}
                  </div>
                </div>
                {/* Place a Wager button */}
                {isUpcoming && (
                  <div className="max-w-sm mx-auto">
                    <button onClick={() => {
                      const wallet = evmAddress || (typeof window !== 'undefined' && localStorage.getItem('wc_wallet'));
                      if (wallet) fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/balance/${wallet}`).then(r=>r.json()).then(d=>{if(d.free!==undefined)setBalance(d.free)});
                      setShowWager(true);
                    }} disabled={!pick}
                      className="btn-gradient group hover:from-green hover:to-themeblue disabled:opacity-30 disabled:cursor-not-allowed">
                      <span className="btn-inner group-hover:bg-transparent">Place a Wager</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Open & Matched Wagers */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Open Wagers */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Open Wagers</h3>
                <span className="text-gray-500 text-sm">{openWagers.length} open</span>
              </div>
              <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-4 min-h-[200px]">
                {openWagers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-sm">No open wagers yet.</p>
                    <p className="text-gray-700 text-xs mt-1">Place your bet and join the action.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {openWagers.map((w, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#1C1C1C]">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#333] flex items-center justify-center text-xs text-gray-400">
                            {w.walletAddress?.slice(2,4).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm text-white">{truncAddr(w.walletAddress)}</p>
                            <p className="text-xs text-gray-500">{w.stake?.toLocaleString()} Credits &middot; {w.pick === 'home' ? match.home : w.pick === 'away' ? match.away : 'Draw'}</p>
                          </div>
                        </div>
                        {evmAddress && w.walletAddress?.toLowerCase() !== evmAddress?.toLowerCase() ? (
                          <button onClick={() => setMatchTarget(w)}
                            className="px-4 py-1.5 rounded-lg bg-[#1DA1F2] text-white text-xs font-semibold hover:opacity-90 transition">
                            Match
                          </button>
                        ) : (
                          <span className="unmatched text-xs">Open</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Matched Wagers */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Matched Wagers</h3>
                <span className="text-gray-500 text-sm">{matchedWagers.length} matched</span>
              </div>
              <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-4 min-h-[200px]">
                {matchedWagers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-sm">No matched wagers yet.</p>
                    <p className="text-gray-700 text-xs mt-1">Place yours now to find a match.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matchedWagers.map((w, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#1C1C1C]">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#333] flex items-center justify-center text-xs text-gray-400">
                            {w.walletAddress?.slice(2,4).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm text-white">{truncAddr(w.walletAddress)} vs {truncAddr(w.opponentWallet)}</p>
                            <p className="text-xs text-gray-500">{w.stake?.toLocaleString()} Credits &middot; {w.pick === 'home' ? match.home : w.pick === 'away' ? match.away : 'Draw'}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${w.status === 'SETTLED' ? (w.outcome === 'WIN' ? 'bg-yellow-900 text-yellow-400' : 'bg-red-900 text-red-400') : 'bg-green-900 text-green-400'}`}>{w.status === 'SETTLED' ? (w.outcome === 'WIN' ? 'Won' : 'Lost') : 'Matched'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Match Confirmation Modal */}
      {matchTarget && !showWager && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
          <div className="bg-[#111] border border-[#333] rounded-[20px] p-6 w-full max-w-md relative shadow-[1px_-1px_4px_1px_#3d3c3ceb]">
            <button onClick={() => setMatchTarget(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">&times;</button>
            <div className="text-center py-4">
              <div className="text-4xl mb-4">&#9889;</div>
              <p className="text-white text-lg mb-2">Accept this challenge?</p>
              <div className="bg-[#1C1C1C] rounded-xl p-4 mb-4">
                <p className="text-gray-400 text-sm">{truncAddr(matchTarget.walletAddress)} bet</p>
                <p className="text-[#1DA1F2] text-xl font-bold my-1">{matchTarget.stake?.toLocaleString()} Promo Credits</p>
                <p className="text-gray-400 text-sm">on {matchTarget.pick === 'home' ? match.home : matchTarget.pick === 'away' ? match.away : 'Draw'}</p>
              </div>
              <p className="text-gray-400 text-sm mb-6">You will take the opposing side: <span className="text-white font-semibold">{matchTarget.pick === 'home' ? match.away : matchTarget.pick === 'away' ? match.home : 'Opposite'}</span></p>
              <div className="flex gap-4">
                <button onClick={() => setMatchTarget(null)} className="flex-1 py-3 rounded-[12px] border border-[#333] text-gray-400 hover:text-white">No</button>
                <button onClick={handleMatch} disabled={matching}
                  className="flex-1 py-3 rounded-[12px] bg-[#1DA1F2] text-white font-semibold hover:opacity-90 disabled:opacity-50">
                  {matching ? 'Matching...' : 'Yes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wager Modal */}
      {showWager && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
          <div className="bg-[#111] border border-[#333] rounded-[20px] p-6 w-full max-w-md relative shadow-[1px_-1px_4px_1px_#3d3c3ceb]">
            <button onClick={() => { setShowWager(false); setStep('pick'); }} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">&times;</button>

            {step === 'pick' && (
              <>
                <h3 className="text-center text-xl font-semibold text-white mb-2">Place a Wager</h3>
                <p className="text-center text-gray-500 text-sm mb-4">You picked: <span className="text-[#1DA1F2] font-semibold">{pick === 'home' ? match.home : pick === 'away' ? match.away : 'Draw'}</span></p>
                <div className="mb-5">
                  <p className="text-gray-400 text-sm mb-2">Bet Amount <span className="float-right text-gray-600">Bal: {balance.toLocaleString()}</span></p>
                  <input type="number" value={stake} min={100} max={balance} step={100}
                    onChange={e => setStake(Math.min(Math.max(100, Number(e.target.value)), balance))}
                    className="w-full bg-[#1C1C1C] border border-[#333] text-white px-4 py-3 rounded-[12px] text-center text-xl font-bold focus:outline-none focus:border-[#1DA1F2]" />
                  <div className="flex gap-2 mt-2">
                    {[500,1000,5000,10000].map(a => (
                      <button key={a} onClick={() => setStake(Math.min(a, balance))}
                        className="flex-1 text-xs py-1.5 rounded-lg border border-[#333] text-gray-500 hover:border-[#555] hover:text-white transition">
                        {a >= 1000 ? a/1000+'k' : a}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setStep('confirm')}
                  className="btn-gradient group hover:from-green hover:to-themeblue">
                  <span className="btn-inner group-hover:bg-transparent">Submit</span>
                </button>
              </>
            )}

            {step === 'confirm' && (
              <div className="text-center py-4">
                <div className="mb-4"><FlagImg team={pick === 'home' ? match.home : pick === 'away' ? match.away : match.home} size={60} /></div>
                <p className="text-white text-lg mb-1">Are you sure, you want to</p>
                <p className="text-white text-lg mb-1">bet <span className="text-[#1DA1F2] font-bold">{stake.toLocaleString()} Promo Credits</span></p>
                <p className="text-white text-lg mb-6">on <span className="font-bold">{pick === 'home' ? match.home : pick === 'away' ? match.away : 'Draw'}</span>?</p>
                <div className="flex gap-4">
                  <button onClick={() => setStep('pick')} className="flex-1 py-3 rounded-[12px] border border-[#333] text-gray-400 hover:text-white">No</button>
                  <button onClick={handleSubmit} className="flex-1 py-3 rounded-[12px] bg-[#1DA1F2] text-white font-semibold hover:opacity-90">Yes</button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">&#9989;</div>
                <h3 className="text-xl font-bold text-white mb-2">Bet Successfully!!!</h3>
                <p className="text-gray-400 text-sm mb-6">Your bet is live and locked in. Goodluck!</p>
                <button onClick={() => { setShowWager(false); setStep('pick'); setPick(null); }}
                  className="btn-gradient group hover:from-green hover:to-themeblue">
                  <span className="btn-inner group-hover:bg-transparent">Ok</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
