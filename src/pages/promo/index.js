import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { activePromo, siteUrl } from '../../config/promoMeta';
import {
  useSignInWithEmail,
  useVerifyEmailOTP,
  useCurrentUser,
  useSignOut,
  useEvmAddress,
  useIsInitialized,
  useCreateEvmEoaAccount
} from '@coinbase/cdp-hooks';
import { usePromoSession } from '../../promo/usePromoSession';
import { getJson } from '../../promo/api';
import EligibilityNotice from '../../components/promo/EligibilityNotice';

export default function PromoHome() {
  const { signInWithEmail, isPending: sendPending } = useSignInWithEmail();
  const { verifyEmailOTP, isPending: verifyPending } = useVerifyEmailOTP();
  const { currentUser: user } = useCurrentUser();
  const { signOut } = useSignOut();
  const { evmAddress } = useEvmAddress();
  const { isInitialized } = useIsInitialized();
  // Users always get an EOA (wallet sign-in depends on EOAs): never smart accounts.
  const { createEvmEoaAccount } = useCreateEvmEoaAccount();
  const session = usePromoSession();
  const { status: sessionStatus, wallet: sessionWallet, authFetch } = session;
  const router = useRouter();

  const [walletCreating, setWalletCreating] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [flowId, setFlowId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [registeredWallet, setRegisteredWallet] = useState(null);
  const [balance, setBalance] = useState(null);

  // Create the user's EVM EOA right after email sign-in if they don't have one yet.
  useEffect(() => {
    if (user && !evmAddress && !walletCreating) {
      setWalletCreating(true);
      createEvmEoaAccount()
        .catch(err => console.error('EVM wallet creation error:', err))
        .finally(() => setWalletCreating(false));
    }
  }, [user, evmAddress, walletCreating, createEvmEoaAccount]);

  // Once the wallet session is ready (silent signature), register for the promo.
  // Registration is idempotent server-side; the wallet comes from the session token.
  useEffect(() => {
    if (sessionStatus !== 'ready' || !sessionWallet || registeredWallet === sessionWallet) return;
    let cancelled = false;
    authFetch('/register', { method: 'POST', body: { email: (user && user.email) || '' } })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.message || 'Registration failed. Please try again.');
          return;
        }
        setRegisteredWallet(sessionWallet);
        const bal = await getJson(`/balance/${sessionWallet}`);
        if (!cancelled && bal && bal.total !== undefined) setBalance(bal.total);
      })
      .catch(err => { if (!cancelled) setError(err.message || 'Registration failed. Please try again.'); });
    return () => { cancelled = true; };
  }, [sessionStatus, sessionWallet, authFetch, registeredWallet, user]);

  const handleSendOtp = async () => {
    try {
      setError('');
      const result = await signInWithEmail({ email });
      setFlowId(result.flowId);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send code. Try again.');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    verifyEmailOTP({ flowId, otp }).catch(err => {
      setError(err.message || 'Invalid code. Try again.');
    });
  };

  const handleSignOut = async () => {
    session.clear();
    setRegisteredWallet(null);
    setBalance(null);
    await signOut();
  };

  const ready = session.status === 'ready' && registeredWallet === session.wallet;
  const statusLine = !evmAddress ? 'Creating your wallet...'
    : session.status === 'signing' ? 'Securing your session...'
    : session.status === 'error' ? null
    : !ready ? 'Setting up your account...' : null;

  return (
    <>
      <Head>
        <title>{activePromo.title}</title>
        <meta name="description" content={activePromo.ogDescription} />
        <meta property="og:title" content={activePromo.title} />
        <meta property="og:description" content={activePromo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/promo`} />
        <meta property="og:image" content={activePromo.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={activePromo.title} />
        <meta name="twitter:description" content={activePromo.ogDescription} />
        <meta name="twitter:image" content={activePromo.ogImage} />
      </Head>

      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center px-4 pt-28 pb-16">
        <div className="max-w-lg w-full text-center">

          <p className="text-sm text-gray-500 uppercase tracking-widest mb-3">Str8Up Gaming Presents</p>
          <h1 className="text-4xl font-bold mb-2">{activePromo.name}</h1>
          <p className="text-gray-400 mb-2">Free-to-play prediction challenge · {activePromo.seasonLabel}</p>
          <p className="text-green-400 font-semibold mb-8">Pick home, draw or away — earn stock rewards</p>

          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 mb-6 text-sm text-gray-400 text-left">
            <p className="font-semibold text-white mb-2">How it works</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Sign up free with your email and get Promo Credits</li>
              <li>Pick home, draw or away on Premier League matches and back your pick with credits against other players</li>
              <li>Matched picks earn a small stock reward in the company of your choice when the match is settled (limits apply), held by Str8Up on your behalf</li>
            </ol>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 mb-6 text-sm text-left">
            <p className="font-semibold text-white mb-2">Prizes</p>
            <p className="text-gray-400">{activePromo.prizesNote}</p>
          </div>

          <EligibilityNotice className="mb-8" />

          {!isInitialized ? (
            <div className="text-gray-500 text-sm py-8">Loading...</div>
          ) : user ? (
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] border border-green-500 rounded-xl p-6">
                <p className="text-sm text-gray-400 mb-1">Your account</p>
                <p className="text-green-400 font-mono text-sm">{evmAddress ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}` : 'Creating wallet...'}</p>
                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
              </div>
              {statusLine && <p className="text-sm text-gray-500">{statusLine}</p>}
              {session.status === 'error' && (
                <div className="text-sm text-red-400">
                  <p>{session.error || 'Could not secure your session.'}</p>
                  <button onClick={session.retry} className="underline mt-1">Try again</button>
                </div>
              )}
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6">
                <p className="text-sm text-gray-400 mb-2">Promo Credit Balance</p>
                <p className="text-5xl font-bold">{balance == null ? '—' : balance.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-2">{activePromo.creditsNote}</p>
              </div>
              <button
                onClick={() => router.push('/promo/predictions')}
                disabled={!ready}
                className="w-full bg-green-600 text-white font-semibold py-4 rounded-xl text-lg hover:opacity-90 transition disabled:opacity-50"
              >
                Start Predicting →
              </button>
              <button onClick={() => router.push('/promo/vault')} disabled={!ready}
                className="w-full border border-gray-600 text-white font-semibold py-3 rounded-xl hover:border-gray-400 transition disabled:opacity-50">
                Open The Vault
              </button>
              <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-white transition">
                Sign Out
              </button>
            </div>
          ) : !otpSent ? (
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                placeholder="Enter your email address"
                className="w-full bg-[#1a1a1a] border border-gray-600 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleSendOtp}
                disabled={sendPending || !email}
                className="w-full bg-[#1DA1F2] text-white font-semibold py-4 rounded-xl text-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {sendPending ? 'Sending...' : 'Sign Up Free'}
              </button>
              <p className="text-xs text-gray-600">
                NO PURCHASE NECESSARY · No crypto wallet required · Not available to US residents
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Code sent to <span className="text-white">{email}</span></p>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full bg-[#1a1a1a] border border-gray-600 text-white px-4 py-3 rounded-xl text-center text-2xl tracking-widest focus:outline-none focus:border-blue-500"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleVerifyOtp}
                disabled={verifyPending || otp.length < 6}
                className="w-full bg-[#1DA1F2] text-white font-semibold py-4 rounded-xl text-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {verifyPending ? 'Verifying...' : 'Verify & Create Account'}
              </button>
              <button onClick={() => { setOtpSent(false); setError(''); }} className="text-sm text-gray-500 hover:text-white transition">
                Use a different email
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-800 text-xs text-gray-600 space-y-1">
            <p>{activePromo.creditsNote}</p>
            <p>{activePromo.disclaimer}</p>
            <p>Not related to STR8 tokens or any Str8Up digital asset.</p>
            <Link href="/promo/rules" className="text-gray-500 hover:text-white underline">Official Rules</Link> · <Link href="/promo/amoe" className="text-gray-500 hover:text-white underline">Mail-In Entry (AMOE)</Link>
          </div>

        </div>
      </div>
    </>
  );
}
