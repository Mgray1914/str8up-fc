import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { detectWallet, getTokenBalance } from '../../utlis/functions';
import { ethers } from 'ethers';
import { useGlobalStates } from '../../contexts/WalletModalContext';
import { callApi } from '../../services/apiServices';
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';



export default function WalletModal({ setWalletAddress, setIsWalletModalOpen, setIsWalletConnected, walletAddress }) {

  const [loadingMetaMask, setLoadingMetaMask] = useState(false);
  const [loadingCoinbase, setLoadingCoinbase] = useState(false);
  const [balane, setBalance] = useState("")
  const { provider, setProvider } = useGlobalStates()
  const [ShowNotWallet, setshowNotwallet] = useState(null);

  useEffect(() => {
    if (setIsWalletModalOpen || ShowNotWallet) {
      document.body.classList.add("modal-active");
    } else {
      document.body.classList.remove("modal-active");
    }

    return () => {
      document.body.classList.remove("modal-active");
    };
  }, [setIsWalletModalOpen, ShowNotWallet]);

  const connectMetaMask = async () => {
    setLoadingMetaMask(true)
    try {
      if (!window.ethereum) {
        // throw new Error('No wallet extension detected.')
        setshowNotwallet('metamask');
      };
      const metaProvider = detectWallet('metamask')
      console.log("metaProvider", metaProvider)
      if (!metaProvider) {
        setshowNotwallet('metamask')
      }
      // if (!metaProvider) throw new Error('MetaMask is not installed');
      await metaProvider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      const provider = new ethers.BrowserProvider(metaProvider);
      const signer = await provider.getSigner();
      const add = await signer.getAddress();
      const chainid = await metaProvider.request({ method: 'eth_chainId' });
      console.log("chain id ", parseInt(chainid))
      setIsWalletConnected(true)
      console.log('Connected:', metaProvider);
      setWalletAddress(add)
      setProvider(metaProvider)
      localStorage.setItem("walletType", "metamask");
      setIsWalletModalOpen(false);
      // try{
      //   const res = await axios.post('/api/login');
      // }catch(err){
      //   console.log(err)
      //   toast.error("Authencation Failed")
      // }

      await loginWithWallet("metamask", add)
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMetaMask(false)
    }
  }

  const connectCoinBase = async () => {
    setLoadingCoinbase(true);
    try {
      if (!window.ethereum) { setshowNotwallet('coinbase') };
      const coinProvider = detectWallet('coinbase')
      console.log("coinProvider", coinProvider)
      // if (!coinProvider) throw new Error('CoinBase is not installed');
      if (!coinProvider) {
        setshowNotwallet('coinbase')
      }
      await coinProvider.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(coinProvider);
      const signer = await provider.getSigner();
      const add = await signer.getAddress();
      console.log('Connected:', add);
      setWalletAddress(add)
      localStorage.setItem("walletType", "coinbase")
      setProvider(coinProvider);
      setIsWalletConnected(true);
      setIsWalletModalOpen(false);
      await loginWithWallet("coinbase", add)
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoinbase(false)
    }
  }



  const loginWithWallet = async (Type, Address) => {
    try {
      const response = await callApi({
        method: "post",
        url: "/users",
        data: {
          walletType: Type,
          walletAddress: Address
        }
      })
      if (response.status == 200) {
        Cookies.set("token", response.data.token, { expires: 7 })
        // console.log("token",response.data.token)
      }
      console.log("User Created ", response)
    } catch (error) {
      console.log("user Create Error", error)
    }
  }
  return (
    <>

      <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50">
        <div className="bg-[#090909]  rounded-[20px] max-w-[675px] w-[90%] md:w-full mx-auto p-[30px] border-2 border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative " data-aos="zoom-out-left" data-aos-duration="500">

          <button
            type="button"
            onClick={() => { setIsWalletModalOpen(false) }}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white w-[40px] h-[40px]"
          >
            <Image src="/images/cross.svg" alt="wallet Logo" width={100} height={100} />
          </button>

          <div className="text-center">
            <div className="flex items-center w-[80px] h-[104px] mx-auto">
              <img src="/images/connect-wallet.png" alt="wallet Logo" className='h-[77px] w-[70px]' />
            </div>

            <h3 className="mb-5 text-[30px] font-semibold text-white font-gambetta">
              Connect your Wallet
            </h3>
            <p className='font-regular text-[#828282] pb-3 text-[20px]'>Choose your preferred wallet to continue</p>
            <p className='font-regular text-[#828282] pb-4 text-[20px]'>Secure connection required to purchase STR8 token and
              start predicting.</p>
            {/* ---Loader--- */}{
              (loadingMetaMask || loadingCoinbase) && (
                <div className='loader relative h-[4px] w-full overflow-hidden rounded-full bg-[#181819]'>
                  <span className="loader-bar absolute top-0 left-0 h-full w-0 bg-gradient rounded-full animate-loader  mb-5"></span>
                </div>
              )
            }
            <div className='w-full p-2 flex justify-between rounded-[8px] border border-[#828282] mt-5 bg-[#181818] bg-opacity-50'>
              <div className='flex'>
                <div className='w-[60px] h-[60px]'>
                  <Image src="/images/meta.svg" alt="wallet Logo" width={100} height={100} />
                </div>
                <div className='text-left pt-2 pl-2'>
                  <p className='font-semibold text-[17px] text-white font-gambetta'>MetaMask</p>
                  <p className='font-regular text-[12px] text-maingrey '>Connect using browser extension.</p></div>
              </div>
              <button className="shadowcustome border rounded-xl mt-3 text-white text-[12px] h-[32px] w-[111px] font-normal" onClick={connectMetaMask}>
                {loadingMetaMask ? "CONNECTING...." : "CONNECT"}
              </button>
            </div>
            <div className='w-full p-2 flex justify-between rounded-[8px] border border-[#828282] mt-4 bg-[#181818] bg-opacity-50'>
              <div className='flex '>
                <div className='w-[60px] h-[60px]'>
                  <Image src="/images/coinbase.svg" alt="wallet Logo" width={100} height={100} />
                </div>
                <div className='text-left pt-2 pl-2'>
                  <p className='font-semibold text-[17px] text-white font-gambetta'>Coinbase Wallet</p>
                  <p className='font-regular text-[12px] text-maingrey '>Connect with Coinbase wallet.</p></div>
              </div>
              <button className="px-4  font-normal text-white rounded-[12px] bg-themeblue h-[32px] text-[12px] mt-3 w-[111px]" onClick={connectCoinBase}>
                {loadingCoinbase ? "CONNECTING...." : "CONNECT"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {ShowNotWallet && (
        <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50">
          <div className="bg-[#090909] dark:bg-gray-700 rounded-[20px] max-w-[600px] w-full p-[30px] border-2 border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative">
            <div className="text-center">
              <div className="flex items-center w-[70px] h-[70px] mx-auto mb-4">
                <Image src={`/images/${ShowNotWallet === 'coinbase' ? 'coinbase' : 'meta'}.svg`} alt="logout" width={70} height={70} />
              </div>

              <h3 className=" text-[30px]  text-white font-gambetta max-w-[365px] font-semibold mx-auto leading-normal mb-1">
                STR8UP
              </h3>
              <p className='text-[20px] font-thin leading-[30px] mb-4'>Please Install <a href={ShowNotWallet == "metamask" ? "https://metamask.io/en-GB/download" : "https://www.coinbase.com/en-in/wallet/downloads"} target='_blank' className='font-semibold text-themeblue underline'>{ShowNotWallet}</a></p>

              <div className='flex gap-3 justify-center'>

                <button className="px-4  font-semibold text-white rounded-[12px] bg-themeblue h-[50px] text-[20px] w-[173px] mt-3" onClick={() => setshowNotwallet(null)}>
                  ok
                </button></div>
            </div>
          </div>
        </div>
      )}



    </>
  )
}
