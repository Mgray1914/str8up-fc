import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useIsInitialized, useIsSignedIn } from '@coinbase/cdp-hooks';

// Sends signed-out visitors back to /promo (where they sign in). Returns true once
// the CDP state is known and the user is signed in.
export function useRequireSignIn() {
  const router = useRouter();
  const { isInitialized } = useIsInitialized();
  const { isSignedIn } = useIsSignedIn();
  useEffect(() => {
    if (isInitialized && !isSignedIn) router.replace('/promo');
  }, [isInitialized, isSignedIn, router]);
  return isInitialized && isSignedIn;
}
