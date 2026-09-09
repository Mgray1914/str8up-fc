import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCurrentUser, useEvmAddress } from '@coinbase/cdp-hooks';
import { activePromo } from '../../config/promoMeta';

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

const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"];
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {month:'short', day:'2-digit'});
const formatTime = (d) => new Date(d).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});

const weekOrder = (round) => parseInt((round || '').replace(/\D/g, ''), 10) || 0;
const formatWeekLabel = (round) => {
  const wk = /^WK(\d+)$/.exec(round || '');
  if (wk) return `Week ${wk[1]}`;
  const pre = /^PRE(\d+)$/.exec(round || '');
  if (pre) return `Preseason ${pre[1]}`;
  return round;
};

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const bg = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-[#1DA1F2]';
  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] ${bg} text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse max-w-sm text-center`}>
      {message}
    </div>
  );
}

function MatchCard({ match, prediction, onPredict, matchStatus }) {
  const kickoff = new Date(match.kickoff);
  const isUpcoming = kickoff > new Date();
  return (
    <div className="text-white rounded-[20px] w-full shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5">
      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="h-[58px] w-[58px] border border-[#333] shadow-[0px_0px_15px_0px_#8C8C8C] rounded-full flex items-center justify-center bg-[#1C1C1C] overflow-hidden">
          <FlagImg team={match.home} size={36} />
        </div>
        <span className="text-[22px] font-regular text-gray-500">VS</span>
        <div className="h-[58px] w-[58px] border border-[#333] shadow-[0px_0px_15px_0px_#8C8C8C] rounded-full flex items-center justify-center bg-[#1C1C1C] overflow-hidden">
          <FlagImg team={match.away} size={36} />
        </div>
      </div>
      <div className="text-center mb-4 cursor-pointer" onClick={() => window.location.href = `/promo/match/${match.id}`}>
        <h2 className="text-[16px] sm:text-[18px] font-semibold leading-tight hover:text-[#1DA1F2] transition">{match.home} vs {match.away}</h2>
        <p className="text-xs text-gray-500 mt-1">{match.group ? `Group ${match.group}` : match.round} &middot; {formatDate(match.kickoff)} &middot; {formatTime(match.kickoff)}</p>
      </div>
      {prediction ? (
        <div className={`text-center py-3 rounded-[18px] ${prediction.status === 'SETTLED' && prediction.outcome === 'WIN' ? 'border border-yellow-600 bg-[#1a1a0a]' : prediction.status === 'SETTLED' && prediction.outcome === 'LOSS' ? 'border border-red-800 bg-[#1a0a0a]' : 'border border-green-800 bg-[#0a1f0a]'}`}>
          <p className="text-green-400 text-sm font-semibold">{prediction.pick === 'home' ? match.home : prediction.pick === 'away' ? match.away : 'Draw'}</p>
          <p className="text-xs text-gray-500">{prediction.stake?.toLocaleString()} credits &middot; {prediction.status === 'SETTLED' ? (prediction.outcome === 'WIN' ? '🏆 Won' : '❌ Lost') : prediction.status === 'CANCELLED' ? '↩️ Returned' : prediction.status === 'MATCHED' ? '✅ Matched' : '⏳ Waiting'}</p>
        </div>
) : matchStatus?.status === 'COMPLETED' ? (
        <div className="text-center py-3 border border-[#333] rounded-[18px]">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-xs text-gray-600">{matchStatus.winner === 'home' ? match.home : matchStatus.winner === 'away' ? match.away : 'Draw'} won</p>
        </div>
      ) : isUpcoming ? (
        <button onClick={() => onPredict({ ...match, league: matchStatus?.league })} className="btn-gradient group hover:from-green hover:to-themeblue w-full">
          <span className="btn-inner group-hover:bg-transparent group-hover:dark:bg-transparent">Make Prediction</span>
        </button>
      ) : (
        <div className="text-center py-3 border border-[#333] rounded-[18px]">
          <p className="text-gray-600 text-sm">Closed</p>
        </div>
      )}
    </div>
  );
}function MatchCardSkeleton() {
  return (
    <div className="text-white rounded-[20px] w-full shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 animate-pulse">
      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="h-[58px] w-[58px] rounded-full bg-[#1C1C1C]" />
        <span className="text-[22px] text-gray-700">VS</span>
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

function WagerModal({ match, onClose, onSubmit, balance, submitting }) {
  const [pick, setPick] = useState(null);
  const [stake, setStake] = useState(1000);
  const [step, setStep] = useState('pick');
  if (!match) return null;

  const handleConfirm = () => {
    if (step === 'pick') { setStep('confirm'); return; }
    if (step === 'confirm') { onSubmit({ matchId: match.id, pick, stake }); setStep('success'); return; }
    if (step === 'success') { onClose(); setStep('pick'); setPick(null); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4" onClick={() => { onClose(); setStep('pick'); setPick(null); }}>
      <div className="bg-[#111] border border-[#333] rounded-[20px] p-6 w-full max-w-md relative shadow-[1px_-1px_4px_1px_#3d3c3ceb]" onClick={e => e.stopPropagation()}>
        <button onClick={() => { onClose(); setStep('pick'); setPick(null); }} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">&times;</button>

        {step === 'pick' && (
          <>
            <h3 className="text-center text-xl font-semibold text-white mb-1">Place Prediction</h3>
            <p className="text-center text-gray-500 text-sm mb-5">{match.home} vs {match.away}</p>
            <div className="flex gap-3 mb-5">
              {(match.league === 'NFL'
                ? [{v:'home',l:match.home},{v:'away',l:match.away}]
                : [{v:'home',l:match.home},{v:'draw',l:'Draw'},{v:'away',l:match.away}]
              ).map(o => (
                <button key={o.v} onClick={() => setPick(o.v)}
                  className={`flex-1 py-3 rounded-[12px] text-sm font-semibold transition border ${
                    pick === o.v ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white' : 'border-[#333] text-gray-400 hover:border-[#555]'
                  }`}>{o.l}</button>
              ))}
            </div>
            <div className="mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Stake</span>
                <span className="text-gray-600">Bal: {balance.toLocaleString()}</span>
              </div>
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
            <button onClick={handleConfirm} disabled={!pick || stake < 100}
              className="w-full py-3 rounded-[12px] bg-[#1DA1F2] text-white font-bold text-lg disabled:opacity-30 hover:opacity-90 transition">
              Confirm &middot; {stake.toLocaleString()} Credits
            </button>
            <p className="text-center text-gray-600 text-[11px] mt-2">No monetary value &middot; Non-transferable</p>
          </>
        )}

        {step === 'confirm' && (
          <div className="text-center py-4">
            <div className="mb-4"><FlagImg team={pick === 'home' ? match.home : pick === 'away' ? match.away : match.home} size={60} /></div>
            <p className="text-white text-lg mb-2">Confirm your prediction</p>
            <p className="text-[#1DA1F2] text-2xl font-bold mb-1">{stake.toLocaleString()} Credits</p>
            <p className="text-white mb-6">on {pick === 'home' ? match.home : pick === 'away' ? match.away : 'Draw'}</p>
            <div className="flex gap-4">
              <button onClick={() => setStep('pick')} className="flex-1 py-3 rounded-[12px] border border-[#333] text-gray-400 hover:text-white transition">Back</button>
              <button onClick={handleConfirm} disabled={submitting}
                className="flex-1 py-3 rounded-[12px] bg-[#1DA1F2] text-white font-semibold hover:opacity-90 transition disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">Prediction Placed!</h3>
            <p className="text-gray-400 text-sm mb-6">Your prediction is live. Good luck!</p>
            <button onClick={handleConfirm}
              className="w-full py-3 rounded-[12px] bg-[#1DA1F2] text-white font-semibold hover:opacity-90 transition">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Predictions() {
  const { currentUser: user } = useCurrentUser();
  const { evmAddress: cdpAddress } = useEvmAddress();
  const [evmAddress, setEvmAddr] = useState(null);
  const router = useRouter();
  const { promo: promoParam } = router.query;
  const isNfl = promoParam !== 'WC_2026';
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [predictions, setPredictions] = useState({});
  const [balance, setBalance] = useState(50000);
  const [activeGroup, setActiveGroup] = useState('A');
  const [activeWeek, setActiveWeek] = useState(null);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchStatuses, setMatchStatuses] = useState({});
  const [nflMatches, setNflMatches] = useState([]);

  useEffect(() => {
    const w = cdpAddress || (typeof window !== 'undefined' && localStorage.getItem('wc_wallet'));
    if (w) setEvmAddr(w);
  }, [cdpAddress]);

  // Fetch balance and predictions (once)
  useEffect(() => {
    const wallet = evmAddress;
    if (!wallet) { setLoading(false); return; }
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/balance/${wallet}`).then(r => r.json()).catch(() => null),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/predictions/${wallet}`).then(r => r.json()).catch(() => null),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/matches${isNfl ? `?promo=${activePromo.apiPromoParam}` : ''}`).then(r => r.json()).catch(() => null),
    ]).then(([bal, preds, matchData]) => {
      if (bal && bal.free !== undefined) setBalance(bal.free);
      if (preds && preds.predictions) {
        const map = {};
        preds.predictions.forEach(p => {
          const prev = map[p.matchId];
          if (!prev || p.status === 'SETTLED' || p.status === 'MATCHED' || !prev.status || prev.status === 'CANCELLED') {
            map[p.matchId] = { pick: p.pick, stake: p.stake, status: p.status, outcome: p.outcome };
          }
        });
        setPredictions(map);
      }
if (matchData && matchData.matches) {
        const sMap = {};
        matchData.matches.forEach(m => { sMap[m.matchId] = { status: m.status, winner: m.winner, league: m.league }; });
        setMatchStatuses(sMap);
        if (isNfl) {
          setNflMatches(matchData.matches.map(m => ({
            id: m.matchId, home: m.homeTeam, away: m.awayTeam, group: m.group, round: m.round, kickoff: m.kickoffTime, league: m.league
          })));
        }
      }
      setLoading(false);
    });
  }, [evmAddress, isNfl]);
  useEffect(() => { if (!user && typeof window !== 'undefined') router.push('/promo'); }, [user]);

  const weeks = [...new Set(nflMatches.map(m => m.round).filter(Boolean))].sort((a, b) => weekOrder(a) - weekOrder(b));

  // Default to the current/upcoming week once matches load
  useEffect(() => {
    if (!isNfl || activeWeek || weeks.length === 0) return;
    const now = new Date();
    const upcoming = weeks.find(w => nflMatches.some(m => m.round === w && new Date(m.kickoff) > now));
    setActiveWeek(upcoming || weeks[weeks.length - 1]);
  }, [isNfl, activeWeek, weeks, nflMatches]);
// Poll for status changes (matched/settled)
  useEffect(() => {
    const wallet = evmAddress;
    if (!wallet || loading) return;
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/predictions/${wallet}`);
        const data = await res.json();
        if (data?.predictions) {
          const updated = {};
          data.predictions.forEach(p => {
            const prev = predictions[p.matchId];
            if (prev && prev.status === 'UNMATCHED' && p.status === 'MATCHED') {
              const fix = FIXTURES.find(f => f.id === p.matchId);
              showToast(`Prediction matched! ${fix ? fix.home + ' vs ' + fix.away : p.matchId}`, 'success');
            }
            if (prev && prev.status !== 'SETTLED' && p.status === 'SETTLED') {
              showToast(`Bet settled! Check your balance.`, 'info');
            }
            updated[p.matchId] = { pick: p.pick, stake: p.stake, status: p.status, outcome: p.outcome };
          });
          setPredictions(updated);
        }
      } catch (_) {}
    }, 30000);
    return () => clearInterval(poll);
  }, [evmAddress, loading, predictions]);
  const showToast = (message, type = 'info') => setToast({ message, type });

  const handleSubmit = async ({ matchId, pick, stake }) => {
    const wallet = evmAddress;
    if (!wallet) { showToast('Wallet not ready. Go back to /promo first.', 'error'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/predictions`,
        { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ walletAddress: wallet, matchId, pick, stake }) }
      );
      const data = await res.json();
      if (!res.ok) { showToast(data.message || 'Failed to place prediction', 'error'); return; }
      setPredictions(prev => ({ ...prev, [matchId]: { pick, stake, status: data.status || 'UNMATCHED' } }));
      setBalance(prev => prev - stake);
      showToast('Prediction placed!', 'success');
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Network error. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const groupFixtures = isNfl
    ? nflMatches.filter(m => !activeWeek || m.round === activeWeek)
    : FIXTURES.filter(f => f.group === activeGroup);
  const predCount = Object.keys(predictions).length;

  return (
    <>
      <Head>
  <title>{isNfl ? `Predictions - ${activePromo.name}` : 'Predictions - Global Soccer Challenge 2026'}</title>
  <meta name="description" content={isNfl ? activePromo.ogDescription : 'Free-to-play P2P prediction contest. Win prizes predicting World Cup 2026 match outcomes.'} />
  <meta property="og:title" content={isNfl ? activePromo.title : 'Global Soccer Challenge — Str8Up Gaming'} />
  <meta property="og:description" content={isNfl ? activePromo.ogDescription : 'Free-to-play peer-to-peer prediction contest. $1,400 in prizes. World Cup 2026.'} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://str8upgaming.com/promo/predictions" />
  <meta property="og:image" content={isNfl ? activePromo.ogImage : 'https://str8upgaming.com/og-promo.png'} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={isNfl ? activePromo.title : 'Global Soccer Challenge — Str8Up Gaming'} />
  <meta name="twitter:description" content={isNfl ? activePromo.ogDescription : 'Free-to-play P2P prediction contest. $1,400 in prizes. World Cup 2026.'} />
  <meta name="twitter:image" content={isNfl ? activePromo.ogImage : 'https://str8upgaming.com/og-promo.png'} />
</Head>
{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">{isNfl ? `${groupFixtures.length} ${activePromo.seasonLabel} Matches${activeWeek ? ` · ${formatWeekLabel(activeWeek)}` : ''}` : `${FIXTURES.length} Group Stage Matches · World Cup 2026`}</p>
            <div className="flex justify-center items-center gap-3 flex-wrap">
              <span className="bg-[#1C1C1C] rounded-xl px-4 py-2 text-sm">
                <span className="text-gray-400">Balance: </span>
                <span className="text-[#1DA1F2] font-bold">{loading ? <span className="inline-block w-16 h-4 bg-[#1C1C1C] rounded animate-pulse align-middle" /> : balance.toLocaleString()}</span>
              </span>
              <span className="bg-[#1C1C1C] rounded-xl px-4 py-2 text-sm">
                <span className="text-gray-400">Picks: </span>
                <span className="text-white font-bold">{predCount}</span>
              </span>
               <span className="bg-[#1C1C1C] rounded-xl px-4 py-2 text-sm cursor-pointer hover:bg-[#252525] transition" onClick={() => router.push('/promo/profile')}>
                <span className="text-gray-400">📊 </span>
                <span className="text-white font-bold">Profile</span>
              </span>
                <span className="bg-[#1C1C1C] rounded-xl px-4 py-2 text-sm cursor-pointer hover:bg-[#252525] transition" onClick={() => router.push('/promo/leaderboard')}>
                <span className="text-gray-400">🏆 </span>
                <span className="text-white font-bold">Leaderboard</span>
              </span>
            </div>
          </div>

          {!isNfl && (
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-8 flex-wrap px-2">
              {GROUPS.map(g => (
                <button key={g} onClick={() => setActiveGroup(g)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full text-sm font-bold transition border ${
                    activeGroup === g ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white' : 'border-[#333] text-gray-500 hover:border-[#555]'
                  }`}>{g}</button>
              ))}
            </div>
          )}
          {isNfl && weeks.length > 1 && (
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-8 flex-wrap px-2">
              {weeks.map(w => (
                <button key={w} onClick={() => setActiveWeek(w)}
                  className={`px-3 h-9 sm:h-10 rounded-full text-xs sm:text-sm font-bold transition border whitespace-nowrap ${
                    activeWeek === w ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white' : 'border-[#333] text-gray-500 hover:border-[#555]'
                  }`}>{formatWeekLabel(w)}</button>
              ))}
            </div>
          )}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
              {[...Array(6)].map((_, i) => <MatchCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
              {groupFixtures.map(m => (
                <MatchCard key={m.id} match={m} prediction={predictions[m.id]} onPredict={setSelectedMatch} matchStatus={matchStatuses[m.id]} />
              ))}
            </div>
          )}
        </div>
      </div>
      <WagerModal match={selectedMatch} onClose={() => setSelectedMatch(null)} onSubmit={handleSubmit} balance={balance} submitting={submitting} />
    </>
  );
}
