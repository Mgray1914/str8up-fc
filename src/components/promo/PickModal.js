import { useState } from 'react';
import TeamBadge from '../../promo/TeamBadge';
import { outcomeLabel, pickOptions, formatKickoff } from '../../promo/format';
import { activePromo } from '../../config/promoMeta';

const MIN_STAKE = 100;

// Place a prediction: pick (home / draw / away), stake, confirm. onSubmit resolves
// to { ok, message }; success is shown only when the backend accepted the pick.
export default function PickModal({ match, balance, onClose, onSubmit, initialPick = null, options, title = 'Place Prediction', note }) {
  const [pick, setPick] = useState(initialPick);
  const [stake, setStake] = useState(Math.min(1000, Math.max(MIN_STAKE, balance || MIN_STAKE)));
  const [step, setStep] = useState('pick');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  if (!match) return null;

  const choices = options || pickOptions(match, activePromo.allowDraw);
  const k = formatKickoff(match.kickoff);
  const close = () => { if (!submitting) onClose(); };
  const confirm = async () => {
    setSubmitting(true);
    setError('');
    const result = await onSubmit({ matchId: match.id, pick, stake });
    setSubmitting(false);
    if (result && result.ok) setStep('success');
    else setError((result && result.message) || 'Could not place your prediction. Try again.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4" onClick={close}>
      <div className="bg-[#111] border border-[#333] rounded-[20px] p-6 w-full max-w-md relative shadow-[1px_-1px_4px_1px_#3d3c3ceb]" onClick={e => e.stopPropagation()}>
        <button onClick={close} aria-label="Close" className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">&times;</button>

        {step === 'pick' && (
          <>
            <h3 className="text-center text-xl font-semibold text-white mb-1">{title}</h3>
            <p className="text-center text-gray-500 text-sm mb-1">{match.home} vs {match.away}</p>
            <p className="text-center text-gray-600 text-xs mb-5">{k.date} · {k.time} {k.tz}</p>
            {note && <p className="text-center text-gray-400 text-xs mb-4">{note}</p>}
            <div className="flex gap-2 mb-5">
              {choices.map(o => (
                <button key={o.v} onClick={() => setPick(o.v)}
                  className={`flex-1 py-3 px-1 rounded-[12px] text-sm font-semibold transition border ${
                    pick === o.v ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white' : 'border-[#333] text-gray-400 hover:border-[#555]'
                  }`}>{o.l}</button>
              ))}
            </div>
            <div className="mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Stake</span>
                <span className="text-gray-600">Balance: {(balance || 0).toLocaleString()}</span>
              </div>
              <input type="number" value={stake} min={MIN_STAKE} max={balance} step={100}
                onChange={e => setStake(Math.min(Math.max(MIN_STAKE, Number(e.target.value) || MIN_STAKE), balance || MIN_STAKE))}
                className="w-full bg-[#1C1C1C] border border-[#333] text-white px-4 py-3 rounded-[12px] text-center text-xl font-bold focus:outline-none focus:border-[#1DA1F2]" />
              <div className="flex gap-2 mt-2">
                {[500, 1000, 5000, 10000].map(a => (
                  <button key={a} onClick={() => setStake(Math.min(a, balance || a))}
                    className="flex-1 text-xs py-1.5 rounded-lg border border-[#333] text-gray-500 hover:border-[#555] hover:text-white transition">
                    {a >= 1000 ? `${a / 1000}k` : a}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep('confirm')} disabled={!pick || stake < MIN_STAKE || stake > (balance || 0)}
              className="w-full py-3 rounded-[12px] bg-[#1DA1F2] text-white font-bold text-lg disabled:opacity-30 hover:opacity-90 transition">
              Continue · {stake.toLocaleString()} Credits
            </button>
            <p className="text-center text-gray-600 text-[11px] mt-2">Promo Credits have no monetary value</p>
          </>
        )}

        {step === 'confirm' && (
          <div className="text-center py-4">
            <div className="mb-4 flex justify-center">
              {pick === 'draw' ? <span className="text-4xl" aria-hidden>🤝</span> : <TeamBadge team={pick === 'home' ? match.home : match.away} size={60} />}
            </div>
            <p className="text-white text-lg mb-2">Confirm your prediction</p>
            <p className="text-[#1DA1F2] text-2xl font-bold mb-1">{stake.toLocaleString()} Credits</p>
            <p className="text-white mb-4">on {outcomeLabel(pick, match)}</p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <div className="flex gap-4">
              <button onClick={() => { setStep('pick'); setError(''); }} disabled={submitting} className="flex-1 py-3 rounded-[12px] border border-[#333] text-gray-400 hover:text-white transition">Back</button>
              <button onClick={confirm} disabled={submitting}
                className="flex-1 py-3 rounded-[12px] bg-[#1DA1F2] text-white font-semibold hover:opacity-90 transition disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">Prediction placed</h3>
            <p className="text-gray-400 text-sm mb-6">You&apos;ll be matched with an open pick or the house.</p>
            <button onClick={onClose} className="w-full py-3 rounded-[12px] bg-[#1DA1F2] text-white font-semibold hover:opacity-90 transition">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
