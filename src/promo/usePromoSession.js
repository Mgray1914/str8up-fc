import { useCallback, useEffect, useState } from 'react';
import { useEvmAddress, useIsSignedIn, useSignEvmMessage } from '@coinbase/cdp-hooks';
import { createPromoSession } from './session';
import { apiUrl } from './api';
import { activePromo } from '../config/promoMeta';

// One session manager per page load, shared by every page (client-side navigation
// keeps it). The signer is swapped in by whichever component renders the hook.
let manager = null;
let currentSigner = null;
function getManager() {
  if (!manager) {
    manager = createPromoSession({
      apiUrl,
      fetchImpl: (...a) => fetch(...a),
      storage: typeof window !== 'undefined' ? window.sessionStorage : { getItem: () => null, setItem() {}, removeItem() {} },
      signMessage: (wallet, message) => {
        if (!currentSigner) throw new Error('Wallet signer not ready');
        return currentSigner(wallet, message);
      },
      storageKey: `promoSession:${activePromo.apiPromoParam}`,
    });
  }
  return manager;
}

// Promo wallet session for the signed-in CDP user. Signs in automatically (one
// silent signature by the user's CDP EOA - no prompt) right after email login,
// re-signs when the wallet changes, and clears on CDP sign-out.
//   wallet       the user's EOA address (lowercase) or null
//   status       'idle' | 'signing' | 'ready' | 'error'
//   authFetch    (path, { method, body }) -> Response, with Authorization + 401 retry
export function usePromoSession() {
  const { evmAddress } = useEvmAddress();
  const { isSignedIn } = useIsSignedIn();
  const { signEvmMessage } = useSignEvmMessage();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const wallet = isSignedIn && evmAddress ? evmAddress.toLowerCase() : null;

  currentSigner = async (account, message) => {
    // CDP signs with the embedded EOA (EIP-191) without showing a prompt.
    const { signature } = await signEvmMessage({ evmAccount: evmAddress, message });
    return signature;
  };

  useEffect(() => {
    const m = getManager();
    if (!wallet) {
      // Signed out (or wallet not created yet): drop any stored session.
      if (isSignedIn === false) m.clear();
      setStatus('idle');
      return;
    }
    m.clear(wallet); // a stored session for a different wallet is discarded
    if (m.currentToken(wallet)) { setStatus('ready'); return; }
    let cancelled = false;
    setStatus('signing');
    m.ensureSession(wallet)
      .then(() => { if (!cancelled) { setStatus('ready'); setError(null); } })
      .catch((err) => { if (!cancelled) { setStatus('error'); setError(err.message || 'Sign-in failed'); } });
    return () => { cancelled = true; };
  }, [wallet, isSignedIn]);

  const authFetch = useCallback((path, opts) => {
    if (!wallet) return Promise.reject(new Error('Sign in first'));
    return getManager().authFetch(wallet, path, opts);
  }, [wallet]);

  const retry = useCallback(() => {
    if (!wallet) return;
    setStatus('signing');
    getManager().signIn(wallet)
      .then(() => { setStatus('ready'); setError(null); })
      .catch((err) => { setStatus('error'); setError(err.message || 'Sign-in failed'); });
  }, [wallet]);

  const clear = useCallback(() => getManager().clear(), []);

  return { wallet, status, error, authFetch, retry, clear };
}
