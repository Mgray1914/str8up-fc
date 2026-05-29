import Layout from "../components/Layout";
import { useEffect } from 'react'
import '../styles/globals.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { WalletModalProvider } from "../contexts/WalletModalContext";
import 'rc-pagination/assets/index.css';
import { Toaster } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const CDPHooksProvider = dynamic(
  () => import('@coinbase/cdp-hooks').then(mod => mod.CDPHooksProvider),
  { ssr: false }
);

function App({ Component, pageProps }) {
  const router = useRouter();
  const isPromo = router.pathname.startsWith('/promo');

  useEffect(() => {
    AOS.init({ duration: 800, once: false })
  }, [])

  const appContent = (
    <WalletModalProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletModalProvider>
  );

  return (
    <>
      {isPromo ? (
        <CDPHooksProvider config={{ projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID }}>
          {appContent}
        </CDPHooksProvider>
      ) : appContent}
      <Toaster />
    </>
  );
}

export default App
