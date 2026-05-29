import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCurrentUser, useEvmAddress } from '@coinbase/cdp-hooks';

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

function MatchCard({ match, onPredict, predictions }) {
  const existing = predictions[match.id];
  const kickoff = new Date(match.kickoff);
  const isUpcoming = kickoff > new Date();
  const dateStr = kickoff.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  const timeStr = kickoff.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 mb-3 hover:border-gray-600 transition">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-600 font-medium">Group {match.group}</span>
        <span className="text-xs text-gray-600">{dateStr} · {timeStr}</span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <p className="flex-1 text-center font-bold text-white text-sm">{match.home}</p>
        <span className="text-gray-700 font-bold px-2">VS</span>
        <p className="flex-1 text-center font-bold text-white text-sm">{match.away}</p>
      </div>
      {existing ? (
        <div className="bg-[#0d2b0d] border border-green-900 rounded-lg p-2 text-center">
          <p className="text-green-400 text-xs font-semibold">
            Predicted: {existing.pick==='home'?match.home:existing.pick==='away'?match.away:'Draw'} · {existing.stake.toLocaleString()} credits
          </p>
        </div>
      ) : isUpcoming ? (
        <button onClick={()=>onPredict(match)} className="w-full bg-[#1DA1F2] text-white font-semibold py-2 rounded-lg text-sm hover:opacity-90 transition">
          Make Prediction
        </button>
      ) : (
        <div className="text-center text-gray-700 text-xs py-1">Predictions closed</div>
      )}
    </div>
  );
}

function PredictionModal({ match, onClose, onSubmit, balance }) {
  const [pick, setPick] = useState(null);
  const [stake, setStake] = useState(1000);
  if (!match) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-end sm:items-center justify-center px-4 pb-6">
      <div className="bg-[#141414] border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-white">Place Prediction</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-white">✕</button>
        </div>
        <p className="text-gray-500 text-xs text-center mb-4">{match.home} vs {match.away}</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[{v:'home',l:match.home},{v:'draw',l:'Draw'},{v:'away',l:match.away}].map(o=>(
            <button key={o.v} onClick={()=>setPick(o.v)}
              className={"py-3 rounded-xl text-xs font-semibold border transition "+(pick===o.v?'bg-[#1DA1F2] border-[#1DA1F2] text-white':'border-gray-700 text-gray-400 hover:border-gray-500')}>
              {o.l}
            </button>
          ))}
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">Stake</span>
            <span className="text-xs text-gray-600">Bal: {balance.toLocaleString()}</span>
          </div>
          <input type="number" value={stake} min={100} max={balance} step={100}
            onChange={e=>setStake(Math.min(Math.max(100,Number(e.target.value)),balance))}
            className="w-full bg-[#0d0d0d] border border-gray-700 text-white px-4 py-3 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-blue-500"/>
          <div className="flex gap-1.5 mt-2">
            {[500,1000,5000,10000].map(a=>(
              <button key={a} onClick={()=>setStake(Math.min(a,balance))}
                className="flex-1 text-xs py-1.5 rounded-lg border border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white transition">
                {a>=1000?a/1000+'k':a}
              </button>
            ))}
          </div>
        </div>
        <button onClick={()=>onSubmit({matchId:match.id,pick,stake})} disabled={!pick||stake<100}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-30">
          Confirm · {stake.toLocaleString()} Credits
        </button>
        <p className="text-xs text-gray-700 text-center mt-2">No monetary value · Non-transferable</p>
      </div>
    </div>
  );
}

export default function Predictions() {
  const { currentUser: user } = useCurrentUser();
  const { evmAddress } = useEvmAddress();
  const router = useRouter();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [predictions, setPredictions] = useState({});
  const [balance, setBalance] = useState(50000);
  const [activeGroup, setActiveGroup] = useState('A');
  const [showUpcoming, setShowUpcoming] = useState(false);

  useEffect(()=>{ if(!user) router.push('/promo'); },[user]);

  const handleSubmit = async ({matchId,pick,stake}) => {
    const wallet = evmAddress;
    if (!wallet) { alert("Wallet not ready yet. Go back to /promo to register first."); return; }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/predictions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: wallet, matchId, pick, stake })
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to submit prediction');
        return;
      }
      setPredictions(prev=>({...prev,[matchId]:{pick,stake,status:data.status}}));
      setBalance(prev=>prev-stake);
      setSelectedMatch(null);
      if (data.status === 'MATCHED') {
        alert('Bet matched! Opponent found. Credits locked on-chain.');
      }
    } catch (err) {
      console.error('Submit prediction error:', err);
      // Fallback to local state if backend not available
      setPredictions(prev=>({...prev,[matchId]:{pick,stake,status:'UNMATCHED'}}));
      setBalance(prev=>prev-stake);
      setSelectedMatch(null);
    }
  };

  const displayed = showUpcoming
    ? FIXTURES.filter(f=>new Date(f.kickoff)>new Date()).slice(0,8)
    : FIXTURES.filter(f=>f.group===activeGroup);

  return (
    <>
      <Head><title>Predictions - Global Soccer Challenge 2026</title></Head>
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
          <div className="flex justify-between items-start mb-5">
            <div>
              <button onClick={()=>router.push('/promo')} className="text-xs text-gray-600 hover:text-white mb-1 block">← Back</button>
              <h1 className="text-xl font-bold">Predictions</h1>
              <p className="text-gray-600 text-xs">48 Group Stage Matches · World Cup 2026</p>
            </div>
            <div className="text-right bg-[#1a1a1a] rounded-xl px-3 py-2 border border-gray-800">
              <p className="text-xs text-gray-500">Balance</p>
              <p className="text-lg font-bold text-green-400">{balance.toLocaleString()}</p>
              <p className="text-xs text-gray-600">{Object.keys(predictions).length} picks made</p>
            </div>
          </div>
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            <button onClick={()=>setShowUpcoming(true)}
              className={"flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition "+(showUpcoming?'bg-[#1DA1F2] border-[#1DA1F2] text-white':'border-gray-700 text-gray-500')}>
              Upcoming
            </button>
            {GROUPS.map(g=>(
              <button key={g} onClick={()=>{setActiveGroup(g);setShowUpcoming(false);}}
                className={"flex-shrink-0 w-8 h-8 rounded-full text-xs font-bold border transition "+((!showUpcoming&&activeGroup===g)?'bg-[#1DA1F2] border-[#1DA1F2] text-white':'border-gray-700 text-gray-500 hover:border-gray-500')}>
                {g}
              </button>
            ))}
          </div>
          {displayed.map(m=>(
            <MatchCard key={m.id} match={m} onPredict={setSelectedMatch} predictions={predictions}/>
          ))}
        </div>
      </div>
      <PredictionModal match={selectedMatch} onClose={()=>setSelectedMatch(null)} onSubmit={handleSubmit} balance={balance}/>
    </>
  );
}
