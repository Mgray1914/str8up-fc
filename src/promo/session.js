// Wallet sign-in sessions for promo endpoints that change state (register,
// predictions, reward ticker). Backend contract (epl-promo-backend):
//   POST /auth/nonce {walletAddress}                -> {nonce, message, expiresAt}
//   sign `message` exactly as given (EIP-191 personal_sign by the user's CDP EOA)
//   POST /auth/login {walletAddress, nonce, signature} -> {token, expiresAt}
//   then send Authorization: Bearer <token>. Nonce: 5 min, single use. Token: ~2h.
//
// Framework-free so it can be tested without React: fetch, storage, the signer and
// the clock are injected. usePromoSession (./usePromoSession.js) wires it to CDP.
//
// - Tokens are kept per wallet in sessionStorage (cleared when the tab closes) and
//   refreshed a minute before they expire.
// - Concurrent callers share a single in-flight sign-in.
// - A 401 from an authenticated call triggers one fresh sign-in and one retry.
// - A token is only ever used for the wallet it was issued to; a different wallet
//   signs in again.
const REFRESH_MARGIN_MS = 60 * 1000;

export class PromoAuthError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'PromoAuthError';
    this.status = status;
  }
}

export function createPromoSession({ apiUrl, fetchImpl, storage, signMessage, now = () => Date.now(), storageKey = 'promoSession' }) {
  const inFlight = new Map(); // wallet -> Promise<token>
  const norm = (w) => String(w || '').toLowerCase();

  const read = () => {
    try {
      return JSON.parse(storage.getItem(storageKey) || 'null');
    } catch {
      return null;
    }
  };
  const write = (value) => {
    try {
      if (value) storage.setItem(storageKey, JSON.stringify(value));
      else storage.removeItem(storageKey);
    } catch {
      // storage unavailable (private mode): the session lives only in memory for this page
    }
  };

  function currentToken(wallet) {
    const s = read();
    if (!s || s.wallet !== norm(wallet)) return null;
    if (new Date(s.expiresAt).getTime() - REFRESH_MARGIN_MS <= now()) return null;
    return s.token;
  }

  async function postJson(path, body) {
    const res = await fetchImpl(apiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    let data = null;
    try { data = await res.json(); } catch { /* empty body */ }
    if (!res.ok) throw new PromoAuthError((data && data.message) || `Sign-in failed (${res.status})`, res.status);
    return data;
  }

  async function doSignIn(wallet) {
    const walletAddress = norm(wallet);
    const { nonce, message } = await postJson('/auth/nonce', { walletAddress });
    const signature = await signMessage(walletAddress, message);
    const { token, expiresAt } = await postJson('/auth/login', { walletAddress, nonce, signature });
    write({ wallet: walletAddress, token, expiresAt });
    return token;
  }

  // Signs in (once, shared by concurrent callers) and returns the token.
  function signIn(wallet) {
    const key = norm(wallet);
    if (!key) return Promise.reject(new PromoAuthError('Wallet not ready yet'));
    if (!inFlight.has(key)) {
      const p = doSignIn(key).finally(() => inFlight.delete(key));
      inFlight.set(key, p);
    }
    return inFlight.get(key);
  }

  // A valid token for this wallet, signing in if needed.
  async function ensureSession(wallet) {
    return currentToken(wallet) || signIn(wallet);
  }

  // fetch with Authorization for this wallet; on 401 signs in again once and retries.
  async function authFetch(wallet, path, { method = 'GET', body, headers = {} } = {}) {
    const send = (token) => fetchImpl(apiUrl(path), {
      method,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers, Authorization: `Bearer ${token}` },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let res = await send(await ensureSession(wallet));
    if (res.status === 401) {
      write(null);
      res = await send(await signIn(wallet));
    }
    return res;
  }

  // Forget the stored session (sign-out, or a wallet that no longer matches).
  function clear(wallet) {
    const s = read();
    if (!wallet || (s && s.wallet !== norm(wallet))) write(null);
  }

  return { ensureSession, signIn, authFetch, clear, currentToken };
}
