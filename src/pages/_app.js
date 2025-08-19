import Layout from "../components/Layout";
import {  useEffect } from 'react'
import '../styles/globals.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { WalletModalProvider } from "../contexts/WalletModalContext";
import 'rc-pagination/assets/index.css';
import { Toaster } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";


function App({ Component, pageProps } ) {

   useEffect(() => {
     AOS.init({
          duration: 800,
          once: false,
        })
  }, [])
  return (
    <>
    <WalletModalProvider>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </WalletModalProvider>
    <Toaster />
    </>
  );
}
export default App
