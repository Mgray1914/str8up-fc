import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  useSignInWithEmail,
  useVerifyEmailOTP,
  useCurrentUser,
  useSignOut,
  useEvmAddress,
  useIsInitialized,
  useIsSignedIn,
  useCreateEvmEoaAccount
} from '@coinbase/cdp-hooks';

export default function PromoPage() {
  const { signInWithEmail, isPending: sendPending } = useSignInWithEmail();
  const { verifyEmailOTP, isPending: verifyPending } = useVerifyEmailOTP();
  const { currentUser: user } = useCurrentUser();
  const { signOut } = useSignOut();
  const { evmAddress } = useEvmAddress();
  const isInitialized = useIsInitialized();

  const isSignedIn = useIsSignedIn();
  const { createEvmEoaAccount } = useCreateEvmEoaAccount();
  const [walletCreating, setWalletCreating] = useState(false);

  // Auto-create EVM wallet when user signs in but has no address
  useEffect(() => {
    if (user && !evmAddress && !walletCreating) {
      setWalletCreating(true);
      console.log('Creating EVM wallet...');
      createEvmEoaAccount()
        .then(result => {
          console.log('EVM wallet created:', result);
        })
        .catch(err => {
          console.error('EVM wallet creation error:', err);
        })
        .finally(() => setWalletCreating(false));
    }
  }, [user, evmAddress, walletCreating]);

  // Debug CDP state
  useEffect(() => {
    if (evmAddress && typeof window !== 'undefined') localStorage.setItem('wc_wallet', evmAddress);
    const walletForBal = evmAddress || (typeof window !== 'undefined' && localStorage.getItem('wc_wallet'));
    if (walletForBal && !realBalance) fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/balance/${walletForBal}`).then(r=>r.json()).then(d=>{if(d.free!==undefined)setRealBalance(d.free)}).catch(()=>{});
    console.log('CDP Debug:', { user: !!user, evmAddress, isInitialized, isSignedIn });
  }, [user, evmAddress, isInitialized, isSignedIn]);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [flowId, setFlowId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [realBalance, setRealBalance] = useState(null);

  // Auto-register with backend when CDP wallet is ready
  useEffect(() => {
    if (user && evmAddress && !registered && !registering) {
      setRegistering(true);
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: evmAddress, email: user.email || '' })
      })
        .then(r => r.json())
        .then(data => {
          console.log('Promo registration:', data);
          setRegistered(true);
          // Fetch real balance
          return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/promo/balance/${evmAddress}`);
        })
        .then(r => r.json())
        .then(bal => {
          if (bal.total) setRealBalance(bal.total);
        })
        .catch(err => console.error('Registration error:', err))
        .finally(() => setRegistering(false));
    }
  }, [user, evmAddress, registered, registering]);

  const handleSendOtp = async () => {
    try {
      setError('');
      const result = await signInWithEmail({ email });
      console.log('Full result:', JSON.stringify(result));
      console.log('flowId received:', result.flowId);
      setFlowId(result.flowId);
      setOtpSent(true);
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send code. Try again.');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    console.log('Verifying with flowId:', flowId);
    console.log('OTP value:', otp);
    console.log('OTP type:', typeof otp);
    verifyEmailOTP({ flowId, otp }).catch(err => {
      console.error('Verify OTP error:', err);
      console.error('Error details:', JSON.stringify(err));
      setError(err.message || 'Invalid code. Try again.');
    });
  };

  return (
    <>
      <Head>
        <title>Global Soccer Challenge — Str8Up Gaming</title>
        <meta name="description" content="Free-to-play P2P prediction contest. Win prizes predicting World Cup 2026 match outcomes." />
      </Head>

      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center px-4 pt-28 pb-16">
        <div className="max-w-lg w-full text-center">

          <p className="text-sm text-gray-500 uppercase tracking-widest mb-3">Str8Up Gaming Presents</p>
          <h1 className="text-4xl font-bold mb-2">Global Soccer Challenge</h1>
          <p className="text-gray-400 mb-2">Free-to-play peer-to-peer prediction contest</p>
          <p className="text-green-400 font-semibold mb-8">$1,650 in prizes · World Cup 2026</p>

          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 mb-8 text-sm text-gray-400 text-left">
            <p className="font-semibold text-white mb-2">How it works</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Sign up free — get 50,000 WC Credits instantly</li>
              <li>Predict match winners and bet credits against other users</li>
              <li>Top predictors win real prizes at the end of each round</li>
            </ol>
          </div>

          {!isInitialized ? (
            <div className="text-gray-500 text-sm py-8">Loading...</div>
          ) : user ? (
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] border border-green-500 rounded-xl p-6">
                <p className="text-sm text-gray-400 mb-1">Connected Wallet</p>
                <p className="text-green-400 font-mono text-sm">{evmAddress ? evmAddress.slice(0,6) + "..." + evmAddress.slice(-4) : "Loading..."}</p>
                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6">
                <p className="text-sm text-gray-400 mb-2">WC Credits Balance</p>
                <p className="text-5xl font-bold">{registering ? 'Loading...' : (realBalance || 50000).toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-2">
                  No monetary value · Expires July 15, 2026 · Not related to STR8 tokens
                </p>
              </div>
              <button
                onClick={() => router.push('/promo/predictions')}
                className="w-full bg-green-600 text-white font-semibold py-4 rounded-xl text-lg hover:opacity-90 transition"
              >
                Start Predicting →
              </button>
              <button onClick={signOut} className="text-sm text-gray-500 hover:text-white transition">
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
                {sendPending ? 'Sending...' : 'Sign Up Free — Get 50,000 WC Credits'}
              </button>
              <p className="text-xs text-gray-600">
                NO PURCHASE NECESSARY · Gas fees sponsored by Str8Up · No crypto wallet required
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
                {verifyPending ? 'Verifying...' : 'Verify & Create Wallet'}
              </button>
              <button onClick={() => { setOtpSent(false); setError(''); }} className="text-sm text-gray-500 hover:text-white transition">
                Use a different email
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-800 text-xs text-gray-600 space-y-1">
            <p>WC Credits have no monetary value, are non-transferable, and expire July 15, 2026.</p>
            <p>Not affiliated with FIFA or any national soccer federation.</p>
            <p>Not related to STR8 tokens or any Str8Up digital asset.</p>
            <a href="/promo/rules" className="text-gray-500 hover:text-white underline">Official Rules</a> · <a href="/promo/amoe" className="text-gray-500 hover:text-white underline">Mail-In Entry (AMOE)</a>
          </div>

        </div>
      </div>
    </>
  );
}
