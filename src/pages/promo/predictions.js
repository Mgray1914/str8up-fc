import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCurrentUser, useEvmAddress } from '@coinbase/cdp-hooks';

const FLAGS = {
  "Mexico":"\u{1F1F2}\u{1F1FD}","South Africa":"\u{1F1FF}\u{1F1E6}","Korea Republic":"\u{1F1F0}\u{1F1F7}","Czechia":"\u{1F1E8}\u{1F1FF}",
  "Canada":"\u{1F1E8}\u{1F1E6}","Bosnia & Herzegovina":"\u{1F1E7}\u{1F1E6}","Qatar":"\u{1F1F6}\u{1F1E6}","Switzerland":"\u{1F1E8}\u{1F1ED}",
  "Brazil":"\u{1F1E7}\u{1F1F7}","Morocco":"\u{1F1F2}\u{1F1E6}","Haiti":"\u{1F1ED}\u{1F1F9}","Scotland":"\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  "USA":"\u{1F1FA}\u{1F1F8}","Paraguay":"\u{1F1F5}\u{1F1FE}","Australia":"\u{1F1E6}\u{1F1FA}","Turkiye":"\u{1F1F9}\u{1F1F7}",
  "Germany":"\u{1F1E9}\u{1F1EA}","Curacao":"\u{1F1E8}\u{1F1FC}","Cote d'Ivoire":"\u{1F1E8}\u{1F1EE}","Ecuador":"\u{1F1EA}\u{1F1E8}",
  "Netherlands":"\u{1F1F3}\u{1F1F1}","Japan":"\u{1F1EF}\u{1F1F5}","Sweden":"\u{1F1F8}\u{1F1EA}","Tunisia":"\u{1F1F9}\u{1F1F3}",
  "Belgium":"\u{1F1E7}\u{1F1EA}","Egypt":"\u{1F1EA}\u{1F1EC}","IR Iran":"\u{1F1EE}\u{1F1F7}","New Zealand":"\u{1F1F3}\u{1F1FF}",
  "Spain":"\u{1F1EA}\u{1F1F8}","Cabo Verde":"\u{1F1E8}\u{1F1FB}","Saudi Arabia":"\u{1F1F8}\u{1F1E6}","Uruguay":"\u{1F1FA}\u{1F1FE}",
  "France":"\u{1F1EB}\u{1F1F7}","Senegal":"\u{1F1F8}\u{1F1F3}","Iraq":"\u{1F1EE}\u{1F1F6}","Norway":"\u{1F1F3}\u{1F1F4}",
  "Argentina":"\u{1F1E6}\u{1F1F7}","Algeria":"\u{1F1E9}\u{1F1FF}","Austria":"\u{1F1E6}\u{1F1F9}","Jordan":"\u{1F1EF}\u{1F1F4}",
  "Portugal":"\u{1F1F5}\u{1F1F9}","Congo DR":"\u{1F1E8}\u{1F1E9}","Uzbekistan":"\u{1F1FA}\u{1F1FF}","Colombia":"\u{1F1E8}\u{1F1F4}",
  "England":"\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}","Croatia":"\u{1F1ED}\u{1F1F7}","Ghana":"\u{1F1EC}\u{1F1ED}","Panama":"\u{1F1F5}\u{1F1E6}"
};

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

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {month:'short', day:'2-digit', year:'numeric'});
const formatTime = (d) => new Date(d).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});

function MatchCard({ match, prediction, router }) {
  const kickoff = new Date(match.kickoff);
  const isUpcoming = kickoff > new Date();
  return (
    <div className="text-white rounded-[20px] w-full shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5">
      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="h-[58px] w-[58px] border border-[#333] shadow-[0px_0px_15px_0px_#8C8C8C] rounded-full flex items-center justify-center text-2xl bg-[#1C1C1C]">
          {FLAGS[match.home] || match.home.slice(0,2)}
        </div>
        <span className="text-[22px] font-regular">VS</span>
        <div className="h-[58px] w-[58px] border border-[#333] shadow-[0px_0px_15px_0px_#8C8C8C] rounded-full flex items-center justify-center text-2xl bg-[#1C1C1C]">
          {FLAGS[match.away] || match.away.slice(0,2)}
        </div>
      </div>
      <div className="text-center mb-4">
        <h2 className="text-[18px] font-semibold leading-tight">{match.home} vs {match.away}</h2>
        <p className="text-xs text-gray-500 mt-1">Group {match.group}</p>
      </div>
      <div className="flex justify-between gap-3 mb-5">
        <div className="flex-1 bg-[#1C1C1C] p-3 rounded-md">
          <p className="text-gray-400 text-[11px] mb-0.5">KICKOFF</p>
          <p className="text-[15px]">{formatDate(match.kickoff)}</p>
          <p className="text-sm text-gray-400">{formatTime(match.kickoff)}</p>
        </div>
        <div className="flex-1 bg-[#1C1C1C] p-3 rounded-md text-center">
          <p className="text-gray-400 text-[11px] mb-0.5">STATUS</p>
          {prediction ? (
            <p className="text-sm mt-1">
              <span className={prediction.status === 'MATCHED' ? 'open' : 'unmatched'}>
                {prediction.status === 'MATCHED' ? 'Matched' : 'Open'}
              </span>
            </p>
          ) : (
            <p className="text-[15px] text-gray-500">{isUpcoming ? 'Open' : 'Closed'}</p>
          )}
        </div>
      </div>
      {prediction ? (
        <div className="text-center py-2 border border-green-800 rounded-[18px] bg-[#0a1f0a]">
          <p className="text-green-400 text-sm">Predicted: {prediction.pick === 'home' ? match.home : prediction.pick === 'away' ? match.away : 'Draw'}</p>
          <p className="text-xs text-gray-500">{prediction.stake?.toLocaleString()} WC Credits</p>
        </div>
      ) : isUpcoming ? (
        <button className="btn-gradient group hover:from-green hover:to-themeblue" onClick={() => router.push("/promo/match/" + match.id)}>
          <span className="btn-inner group-hover:bg-transparent group-hover:dark:bg-transparent">Place a Wager</span>
        </button>
      ) : (
        <button className="btn-gradient opacity-50 cursor-not-allowed">
          <span className="btn-inner">Closed</span>
        </button>
      )}
    </div>
  );
}

function WagerModal({ match, onClose, onSubmit, balance }) {
  const [pick, setPick] = useState(null);
  const [stake, setStake] = useState(1000);
  const [step, setStep] = useState('pick');
  if (!match) return null;

  const handleConfirm = () => {
    if (step === 'pick') { setStep('confirm'); return; }
    if (step === 'confirm') { onSubmit({ matchId: match.id, pick, stake }); setStep('success'); return; }
    if (step === 'success') { onClose(); setStep('pick'); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-[#333] rounded-[20px] p-6 w-full max-w-md relative shadow-[1px_-1px_4px_1px_#3d3c3ceb]">
        <button onClick={() => { onClose(); setStep('pick'); }} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">&times;</button>

        {step === 'pick' && (
          <>
            <h3 className="text-center text-xl font-semibold text-white mb-2">Place a Wager</h3>
            <p className="text-center text-gray-500 text-sm mb-6">Choose a team to place a prediction</p>
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="text-3xl">{FLAGS[match.home]}</div>
              <span className="text-gray-500">VS</span>
              <div className="text-3xl">{FLAGS[match.away]}</div>
            </div>
            <div className="flex gap-3 mb-6">
              {[{v:'home',l:match.home},{v:'draw',l:'Draw'},{v:'away',l:match.away}].map(o => (
                <button key={o.v} onClick={() => setPick(o.v)}
                  className={`flex-1 py-3 rounded-[12px] text-sm font-semibold transition border ${
                    pick === o.v ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white' : 'border-[#333] text-gray-400 hover:border-[#555]'
                  }`}>{o.l}</button>
              ))}
            </div>
            <div className="mb-6">
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
            <button onClick={handleConfirm} disabled={!pick || stake < 100}
              className="btn-gradient group hover:from-green hover:to-themeblue disabled:opacity-30">
              <span className="btn-inner group-hover:bg-transparent">Submit</span>
            </button>
          </>
        )}

        {step === 'confirm' && (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">{FLAGS[pick === 'home' ? match.home : pick === 'away' ? match.away : match.home]}</div>
            <p className="text-white text-lg mb-2">Are you sure you want to bet</p>
            <p className="text-[#1DA1F2] text-2xl font-bold mb-1">{stake.toLocaleString()} WC Credits</p>
            <p className="text-white text-lg mb-6">on {pick === 'home' ? match.home : pick === 'away' ? match.away : 'Draw'}?</p>
            <div className="flex gap-4">
              <button onClick={() => setStep('pick')} className="flex-1 py-3 rounded-[12px] border border-[#333] text-gray-400 hover:text-white transition">No</button>
              <button onClick={handleConfirm} className="flex-1 py-3 rounded-[12px] bg-[#1DA1F2] text-white font-semibold hover:opacity-90 transition">Yes</button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">&#9989;</div>
            <h3 className="text-xl font-bold text-white mb-2">Bet Successfully!!!</h3>
            <p className="text-gray-400 text-sm mb-6">Your bet is live and locked in. Goodluck!</p>
            <button onClick={handleConfirm}
              className="btn-gradient group hover:from-green hover:to-themeblue">
              <span className="btn-inner group-hover:bg-transparent">Ok</span>
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
  useEffect(() => { const w = cdpAddress || (typeof window !== 'undefined' && localStorage.getItem('wc_wallet')); if (w) setEvmAddr(w); }, [cdpAddress]);
  const router = useRouter();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [predictions, setPredictions] = useState({});
  const [balance, setBalance] = useState(50000);

  const [predCount, setPredCount] = useState(0);
  useEffect(() => {
    const wallet = evmAddress || (typeof window !== 'undefined' && localStorage.getItem('wc_wallet'));
    if (wallet) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/user/${wallet}`)
        .then(r => r.json())
        .then(data => { if (data.predictionCount) setPredCount(data.predictionCount); })
        .catch(() => {});
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/balance/${wallet}`)
        .then(r => r.json())
        .then(data => { if (data.free !== undefined) setBalance(data.free); })
        .catch(err => console.error('Balance error:', err));
    }
  }, [evmAddress]);

    useEffect(() => {
    const wallet = evmAddress || (typeof window !== 'undefined' && localStorage.getItem('wc_wallet'));
    if (wallet) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/user/${wallet}`)
        .then(r => r.json())
        .then(data => { if (data.predictionCount) setPredCount(data.predictionCount); })
        .catch(() => {});
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/balance/${wallet}`)
        .then(r => r.json())
        .then(data => { if (data.free !== undefined) setBalance(data.free); })
        .catch(err => console.error('Balance error:', err));
    }
  }, [evmAddress]);

    useEffect(() => {
    const wallet = evmAddress || (typeof window !== 'undefined' && localStorage.getItem('wc_wallet'));
    if (wallet) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/user/${wallet}`)
        .then(r => r.json())
        .then(data => { if (data.predictionCount) setPredCount(data.predictionCount); })
        .catch(() => {});
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/balance/${wallet}`)
        .then(r => r.json())
        .then(data => { if (data.free !== undefined) setBalance(data.free); })
        .catch(err => console.error('Balance error:', err));
    }
  }, [evmAddress]);
  const [activeGroup, setActiveGroup] = useState('A');

  useEffect(() => { if (!user) router.push('/promo'); }, [user]);

  const handleSubmit = async ({ matchId, pick, stake }) => {
    const wallet = evmAddress;
    if (!wallet) { alert('Wallet not ready. Go back to /promo first.'); return; }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/predictions`,
        { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ walletAddress: wallet, matchId, pick, stake }) }
      );
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Failed'); return; }
      setPredictions(prev => ({ ...prev, [matchId]: { pick, stake, status: data.status } }));
      setBalance(prev => prev - stake);
    } catch (err) {
      console.error('Submit error:', err);
      setPredictions(prev => ({ ...prev, [matchId]: { pick, stake, status: 'UNMATCHED' } }));
      setBalance(prev => prev - stake);
    }
  };

  const groupFixtures = FIXTURES.filter(f => f.group === activeGroup);

  return (
    <>
      <Head><title>Predictions - Global Soccer Challenge 2026</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-1">World Cup 2026 Predictions</h1>
            <p className="text-gray-500">Pick your side. 48 Group Stage matches.</p>
            <div className="mt-3 inline-block bg-[#1C1C1C] rounded-xl px-4 py-2">
              <span className="text-gray-400 text-sm">WC Credits: </span>
              <span className="text-[#1DA1F2] font-bold text-lg">{balance.toLocaleString()}</span>
              <span className="text-gray-600 text-sm ml-3">{predCount + Object.keys(predictions).length} predictions</span>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {GROUPS.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                className={`w-10 h-10 rounded-full text-sm font-bold transition border ${
                  activeGroup === g ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white' : 'border-[#333] text-gray-500 hover:border-[#555]'
                }`}>{g}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
            {groupFixtures.map(m => (
              <MatchCard key={m.id} match={m} prediction={predictions[m.id]} router={router} />
            ))}
          </div>

        </div>
      </div>

    </>
  );
}
