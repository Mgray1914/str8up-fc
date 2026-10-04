import { useState, useEffect } from 'react';
import { getJson } from '../../promo/api';

function StockLogo({ stock, size = 28 }) {
  const [failed, setFailed] = useState(false);
  if (stock.logoUrl && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={stock.logoUrl} alt="" width={size} height={size} onError={() => setFailed(true)}
      className="rounded-full bg-white object-contain shrink-0" style={{ width: size, height: size }} />;
  }
  return (
    <span className="rounded-full bg-[#333] text-gray-300 font-bold flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.32 }} aria-hidden>{stock.symbol.slice(0, 4)}</span>
  );
}

// Which stock the user's future rewards are bought in. Reads the allowlist
// (GET /rewards/tickers) and the user's choice (GET /rewards/ticker/:wallet);
// saves with PUT /rewards/ticker through the wallet session.
export default function StockPicker({ wallet, authFetch }) {
  const [tickers, setTickers] = useState([]);
  const [current, setCurrent] = useState(null); // { ticker, isDefault }
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  useEffect(() => {
    if (!wallet) return;
    let cancelled = false;
    Promise.all([getJson('/rewards/tickers'), getJson(`/rewards/ticker/${wallet}`)]).then(([list, mine]) => {
      if (cancelled) return;
      setTickers((list && list.tickers) || []);
      const cur = mine && mine.ticker ? mine : list && list.defaultTicker ? { ticker: list.defaultTicker, isDefault: true } : null;
      setCurrent(cur);
      setSelected(cur && cur.ticker);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [wallet]);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await authFetch('/rewards/ticker', { method: 'PUT', body: { ticker: selected } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Could not save your choice.');
      setCurrent({ ticker: data.ticker, isDefault: false });
      setMessage({ type: 'ok', text: `Saved. Your future rewards will be in ${data.ticker}.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not save your choice.' });
    }
    setSaving(false);
  };

  if (loading) return <div className="h-32 rounded-[20px] bg-[#1C1C1C] animate-pulse" />;
  if (!tickers.length) return <p className="text-gray-500 text-sm">Reward stocks are not available right now. Please check back later.</p>;

  const currentStock = current && tickers.find(t => t.symbol === current.ticker);
  return (
    <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5">
      <div className="flex items-center gap-3 mb-4">
        {currentStock && <StockLogo stock={currentStock} size={36} />}
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider">Your reward stock</p>
          <p className="text-white font-semibold">
            {currentStock ? `${currentStock.name} (${currentStock.symbol})` : current ? current.ticker : '—'}
            {current && current.isDefault && <span className="text-gray-500 text-xs font-normal ml-2">default</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4" role="radiogroup" aria-label="Reward stock">
        {tickers.map(t => (
          <button key={t.symbol} role="radio" aria-checked={selected === t.symbol} onClick={() => { setSelected(t.symbol); setMessage(null); }}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
              selected === t.symbol ? 'border-[#1DA1F2] bg-[#0f1e2a]' : 'border-[#333] hover:border-[#555]'
            }`}>
            <StockLogo stock={t} />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-white">{t.symbol}</span>
              <span className="block text-xs text-gray-500 truncate">{t.name}</span>
            </span>
          </button>
        ))}
      </div>

      <button onClick={save} disabled={saving || !selected || (current && selected === current.ticker && !current.isDefault)}
        className="w-full py-3 rounded-[12px] bg-[#1DA1F2] text-white font-semibold hover:opacity-90 transition disabled:opacity-40">
        {saving ? 'Saving...' : 'Save choice'}
      </button>
      {message && <p className={`text-sm mt-3 ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</p>}
      <p className="text-xs text-gray-500 mt-3">
        Changes apply to future rewards only. Rewards you have already earned stay in the stock they were earned in.
      </p>
    </div>
  );
}
