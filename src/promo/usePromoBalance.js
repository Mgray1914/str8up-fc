import { useCallback, useEffect, useRef, useState } from 'react';
import { apiUrl } from './api';

const TIMEOUT_MS = 15000;
const cache = new Map(); // wallet -> last { free, locked, total }, shared across pages

// The user's Promo Credit balance from GET /balance/:wallet - the one balance source
// for every promo page. status: 'idle' (no wallet) | 'loading' | 'ready' | 'error'.
// Never loads forever: the request times out after 15s and becomes 'error'
// (callers show "—" with refresh() as retry). The last known value stays on screen
// while a refresh is in flight.
export function usePromoBalance(wallet) {
  const [state, setState] = useState({ wallet: null, balance: null, status: 'idle', error: null });
  const seq = useRef(0);

  const refresh = useCallback(async () => {
    const id = ++seq.current;
    if (!wallet) { setState({ wallet: null, balance: null, status: 'idle', error: null }); return null; }
    setState(s => {
      const balance = s.wallet === wallet && s.balance ? s.balance : cache.get(wallet) || null;
      return { wallet, balance, status: balance ? 'ready' : 'loading', error: null };
    });
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(apiUrl(`/balance/${wallet}`), { signal: ctrl.signal });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.free === undefined) throw new Error((data && data.message) || `Balance request failed (${res.status})`);
      const balance = { free: Number(data.free), locked: Number(data.locked || 0), total: Number(data.total ?? data.free) };
      cache.set(wallet, balance);
      if (id === seq.current) setState({ wallet, balance, status: 'ready', error: null });
      return balance;
    } catch (err) {
      const error = err.name === 'AbortError' ? 'Balance request timed out' : err.message || 'Could not load balance';
      if (id === seq.current) setState(s => ({ ...s, wallet, status: 'error', error }));
      return null;
    } finally {
      clearTimeout(timer);
    }
  }, [wallet]);

  useEffect(() => { refresh(); }, [refresh]);

  const current = state.wallet === wallet ? state : { ...state, balance: (wallet && cache.get(wallet)) || null, status: wallet ? 'loading' : 'idle' };
  return { balance: current.balance, status: current.status, error: current.error, refresh };
}
