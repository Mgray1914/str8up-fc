import React, { act, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGlobalStates } from "../contexts/WalletModalContext";
import { ethers } from "ethers";
import { Menu, X } from 'lucide-react';
import {
  copyToClipboard,
  detectWallet,
  getTokenBalance,
  trimAddress,
} from "../utlis/functions";
import WalletModal from "../common/modals/WalletModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Cookies from "js-cookie"
import { LazyLoadImage } from "react-lazy-load-image-component";

const Header = () => {

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { isWalletModalOpen, setIsWalletModalOpen } = useGlobalStates();
  const { walletAddress, setWalletAddress } = useGlobalStates();
  const { isWalletConnected, setIsWalletConnected } = useGlobalStates();
  const { provider, setProvider } = useGlobalStates();
  const { balance, setBalance } = useGlobalStates();
  const [symbol, setSymbol] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null)
  const [showloader, setShowloader] = useState(false);
  const [walletDisconnectPopUp, setWalletDisconnectPopUp] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  // console.log(typeof balance)
  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const lastWallet = localStorage.getItem("walletType");
          if (!lastWallet) return;
          const provider = detectWallet(lastWallet);
          if (!provider) return;

          const accounts = await provider.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsWalletConnected(true);
            console.log(`Reconnected to ${lastWallet}:`, accounts[0]);
          }
        } catch (err) {
          console.error("Failed to reconnect wallet:", err);
        }
      }
    };
    checkConnectedWallet();
  }, []);

  useEffect(() => {
      if (walletDisconnectPopUp) {
        document.body.classList.add("modal-active");
      } else {
        document.body.classList.remove("modal-active");
      }
      return () => {
        document.body.classList.remove("modal-active");
      };
    }, [walletDisconnectPopUp]);

  useEffect(() => {
    function handleClickOutside(event) {
      // console.log("event", dropdownRef?.current?.contains(event.target))
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setIsMobileDropdownOpen(false);
      }
    } 
  document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

    useEffect(() => {
    setActiveSection("");
  }, [router.pathname]);

  const fetchBalance = async () => {
    try {
      const { balance, symbol } = await getTokenBalance(walletAddress);
      // console.log("bal", balance);
      setBalance(balance);
      setSymbol(symbol);
      // console.log("symbol", symbol);
    } catch (error) {
      console.log("balnce errror", error);
    }
  };

  useEffect(() => {
    // console.log("+++", walletAddress, provider);
    if (walletAddress) {
      fetchBalance(walletAddress);
    }
  }, [walletAddress]);

  const handleDisconnectConfirmation = () => {
    setWalletDisconnectPopUp(true);
  };
  const onDisconnect = () => {
    setWalletAddress("");
    Cookies.remove("token")
    setIsWalletConnected(false);
    localStorage.removeItem("walletType");
    setWalletDisconnectPopUp(false);
    window.location.reload();
    };
    

  return (
    <>
      
      <header className="text-primary-blue  fixed top-[10px] md:top-[20px] left-0 right-0  w-[97%] md:w-full mx-auto z-[9999]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between bg-[#1A1818] rounded-[12px] shadow-md">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            <Image
              src="/images/logo.svg"
              alt="STR8UP Logo"
              width={100}
              height={30}
            />
          </div>
          {/* <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button> */}

          {/* Nav Links */}
          <nav className="hidden lg:flex space-x-6 text-sm font-medium" id="navbar-default">
            <Link href="/prediction"
             className={`hover:text-white ${router.pathname === "/prediction" ? "text-white " : ""}`}
             >
              Live Predictions
            </Link>
            <Link href="/#stands" className={`hover:text-white ${router.asPath === "/#stands" ? "text-white" : "text-gray-400"}`}>
              Why STR8UP
            </Link>
            <Link href="/#steps" className={`hover:text-white ${router.asPath === "/#steps" ? "text-white" : "text-gray-400"}`}>
              How it Works
            </Link>
            <Link href="/#benefits" onClick={() => {
              setActiveSection("benefits");
              setIsMenuOpen(false);
            }}   className={`hover:text-white ${router.asPath === "/#benefits" ? "text-white" : "text-gray-400"}`}>
              Benefits
            </Link>
            <Link href="/#faqs" className={`hover:text-white ${router.asPath === "/#faqs" ? "text-white " : "text-gray-400"}`}>
              FAQs
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="lg:flex space-x-2 hidden">
            <button className="w-[113px] h-[32px] border text-white rounded-xl hover:bg-green-400 hover:text-white transition shadowcustome text-[13px] text-center">
              Buy STR8 Token
            </button>
            {isWalletConnected ? (
              <div className="relative">
                <button
                  id="dropdownDefaultButton"
                  onClick={() => {setIsDropdownOpen((prev)=> !prev)}}
                  className="text-white text-[13px] bg-[#1A1818] shadowcustome font-medium rounded-[12px] border h-[32px] border-white px-2 py-2.5 text-center inline-flex items-center overflow-hidden"
                  type="button"
                >
                  {trimAddress(walletAddress)}&nbsp;
                  <button>
                    {" "}
                    <FontAwesomeIcon
                      className="ms-2"
                      icon={faCopy}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(walletAddress);
                      }}
                    />
                  </button>
                  <svg
                    className="w-2.5 h-2.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 bg-[#1A1818] shadow-[-1px_0px_28px_0px_#ffffff80] w-fit rounded-[12px] p-[12px] z-50"
                  >
                    <ul className="text-sm text-white">
                      <li className="border-b border-dashed border-white pb-2">
                        <span className="block text-[12px]">
                          {`${balance} ${symbol}`}
                        </span>
                      </li>
                      <li className='border-b border-dashed border-white flex'>
                   <Image src="/images/myprofile.svg" alt="STR8UP Logo" width={20} height={20} />
                  <a onClick={()=>{router.push("/profile")
                     setIsDropdownOpen(false)}} className="block px-4 py-2 text-[12px]  text-white cursor-pointer">My Profile</a>
                </li>
                      <li className="pt-2">
                        <button
                          onClick={handleDisconnectConfirmation}
                          className="block w-full text-left text-[12px] bg-red-600 px-2 py-1 rounded"
                        >
                          Disconnect Wallet
                        </button>
                      </li>
                     
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowloader(true);
                  setIsWalletModalOpen(true);
                }}
                className=" block text-white bg-themeblue transition rounded-[12px]  font-medium text-[13px] text-center w-[113px] h-[32px]"
                type="button"
              >
                Connect Wallet
              </button>
            )}
            {/* dropdown button */}

            {/* <button id="profile" data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown button <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
          </button>
  */}

            
          </div>
        
        {/* ----Mobile---- */}
        {/* Mobile Menu Icon */}
        <button className="lg:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Offcanvas */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-[300px] md:w-[50%] bg-[linear-gradient(180deg,rgba(28,28,28,1)_23%,rgba(23,192,71,1)_100%)] text-white z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        {/* <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
          <button onClick={toggleMenu}><X size={24} /></button>
        </div> */}
        <nav className="flex flex-col p-4 space-y-4">
          <Link href="/prediction" className="hover:text-white md:text-xl text-lg">
            <span onClick={() => setIsMenuOpen(false)}> Live Predictions</span>
          </Link>
          <Link href="#stands" className="hover:text-white md:text-xl text-lg">
            <span onClick={() => setIsMenuOpen(false)}>Why STR8UP</span>
          </Link>
          <Link href="#steps" className="hover:text-white md:text-xl text-lg">
            <span onClick={() => setIsMenuOpen(false)}>How it Works</span>
          </Link>
          <Link href="#benefits" className="hover:text-white md:text-xl text-lg">
            <span onClick={() => setIsMenuOpen(false)}>Benefits</span>
          </Link>
          <Link href="#" className="hover:text-white md:text-xl text-lg">
            <span onClick={() => setIsMenuOpen(false)}>FAQs</span>
          </Link>
          <hr className="border-gray-600" />
          <div className="flex space-x-3 items-center">
          <button className="w-[113px] h-[32px] border text-white rounded-xl hover:bg-green-400 hover:text-white transition shadowcustome text-[14px] text-center">
              Buy STR8 Token
            </button>
           {isWalletConnected ? (
              <div className="relative">
                <button
                  id="dropdownDefaultButton"
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className="text-white text-[14px] bg-[#1A1818] shadowcustome font-medium rounded-[12px] border h-[32px] border-white px-2 py-2.5 text-center inline-flex items-center overflow-hidden"
                  type="button"
                >
                  {trimAddress(walletAddress)}&nbsp;
                  <button>
                    {" "}
                    <FontAwesomeIcon
                      className="ms-2"
                      icon={faCopy}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(walletAddress);
                      }}
                    />
                  </button>
                  <svg
                    className="w-2.5 h-2.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                {isMobileDropdownOpen && (
                  <div
                    ref={mobileDropdownRef}
                    className="absolute right-0 mt-2 bg-[#1A1818] shadow-[-1px_0px_28px_0px_#ffffff80] w-fit rounded-[12px] p-[12px] z-50"
                  >
                    <ul className="text-sm text-white">
                      <li className="border-b border-dashed border-white pb-2">
                        <span className="block text-[12px]">
                          {`${balance} ${symbol}`}
                        </span>
                      </li>
                      <li className='border-b border-dashed border-white flex'>
                   <Image src="/images/myprofile.svg" alt="STR8UP Logo" width={20} height={20} />
                  <a onClick={()=>{router.push("/profile")
                setIsMobileDropdownOpen(false)
                setIsMenuOpen(false)
                }} className="block px-4 py-2 text-[14px]  text-white cursor-pointer">My Profile</a>
                </li>
                      <li className="pt-2">
                        <button
                          onClick={()=>{handleDisconnectConfirmation()
                            setIsMenuOpen(false)
                          }}
                          className="block w-full text-left text-[12px] bg-red-600 px-2 py-1 rounded"
                        >
                          Disconnect Wallet
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
             
            ) : (
              <button
                onClick={() => {
                  setShowloader(true);
                  setIsWalletModalOpen(true);
                  setIsMenuOpen(false)

                }}
                className=" block text-white bg-themeblue transition rounded-[12px]  font-medium text-[14px] text-center w-[113px] h-[32px]"
                type="button"
              >
                Connect Wallet
              </button>
            )}
             </div>
        </nav>
      </div>
      </header>

      {/* Connect Modal */}
      {isWalletModalOpen && (
        <WalletModal
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          setIsWalletModalOpen={setIsWalletModalOpen}
          setIsWalletConnected={setIsWalletConnected}
        />
      )}

      {/* Place a wager modal */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50 ">
          <div className="bg-[#090909] dark:bg-gray-700 rounded-[20px]  max-w-[675px]  p-[30px] pt-[80px] border-2 border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white w-[40px] h-[40px]"
            >
              <Image src="/images/cross.svg" alt="wallet Logo" width={100} height={100} />
            </button>
 
         
            <div className="text-center">
 
              <h3 className="mb-5 text-[30px] font-semibold text-white font-gambetta">
                Place a Wager
              </h3>
              <p className='font-regular text-[#828282] pb-3 text-[20px]'>Choose a team to place a bet</p>
 
 
               <div className='flex justify-center m-4'>
              <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 w-full rounded-[8px]">
                <li className="w-1/2 ">
                  <a href="#" className="block px-4 py-3 text-white bg-themeblue  active hover:text-white hover:bg-themeblue rounded-l-[8px]" aria-current="page">Bangals</a>
                </li>
                <li className="w-1/2 ">
                  <a href="#" className="block px-4 py-3  hover:text-white hover:bg-themeblue rounded-r-[8px]">Browns</a>
                </li>
              </ul></div>
 
 
              <p className='font-regular text-[#828282] pb-4 text-[20px] mt-[40px]'>Bet Amount</p>
              <input type="text" id="amount" className=" bg-[#181818] mt-3 border border-gray-300 text-white text-center rounded-lg w-[326px] h-[70px] font-bold text-[39px] p-2.5 required" />
              <button type='button' className='w-[436px] h-[52px]  text-white font-normal text-[20px] p-2 mt-[50px] rounded-[18px] border border-white'>SUBMIT</button>
 
 
            </div>
 
          </div>
        </div>
      )} */}

      {/* bet sure modal */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50">
          <div className="bg-[#090909] dark:bg-gray-700 rounded-[20px] max-w-[675px] w-full p-[30px] border-2 border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative">
            <div className="text-center">
              <div className="flex items-center w-[80px] h-[104px] mx-auto">
                <Image src="/images/bet.svg" alt="wallet Logo" width={80} height={104} />
              </div>
 
              <h3 className=" text-[30px]  text-white font-gambetta max-w-[365px] font-extralight mx-auto leading-normal mb-[30px]">
                Are you sure, you want to
                    bet <span className='font-semibold'> $20.00STR8</span> on <span className='font-semibold'>Bengals</span> ?
              </h3>
                  <div className='flex gap-3 justify-center'>
                   <button className="px-4  border-2 rounded-[12px] border-white h-[50px] text-[20px] w-[173px] mt-3 hover:text-white hover:bg-themeblue">
                    No
                  </button>
                   <button className="px-4  font-semibold text-white rounded-[12px] bg-themeblue h-[50px] text-[20px] w-[173px] mt-3">
                    Yes
                  </button></div>
            </div>
          </div>
        </div>
      )} */}

      {/* bet sucessfull modal */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50">
          <div className="bg-[#090909] dark:bg-gray-700 rounded-[20px] max-w-[675px] w-full p-[30px] border-2 border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative">
            <div className="text-center">
              <div className="flex items-center w-[80px] h-[104px] mx-auto">
                <Image src="/images/bet.svg" alt="wallet Logo" width={80} height={104} />
              </div>
 
              <h3 className=" text-[30px]  text-white font-gambetta max-w-[365px] font-semibold mx-auto leading-normal ">
                Bet Successfully!!! </h3>
                <p className='text-[20px] font-extralight leading-[30px] mt-2'>Your bet is live and locked in. Good luck!</p>
                   <button className="px-4  font-semibold text-white rounded-[12px] bg-themeblue h-[50px] text-[20px] w-[173px] mt-[40px]">
                    Yes
                  </button>
            </div>
          </div>
        </div>
      )} */}

      {/* logout modal */}
      {walletDisconnectPopUp && (
        <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50">
          <div className="bg-[#090909] rounded-[20px] max-w-[675px] w-full p-[30px] border-2 border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative">
            <div className="text-center">
              <div className="flex items-center w-[70px] h-[70px] mx-auto">
                <LazyLoadImage
                  src="/images/logout.svg"
                  alt="logout"
                  width={70}
                  height={70}
                />
              </div>

              <h3 className=" text-[30px]  text-white font-gambetta max-w-[365px] font-semibold mx-auto leading-normal mb-2">
                Disconnect Wallet
                {/* logout */}
              </h3>
              <p className="text-[20px] font-thin leading-[30px] mb-4">
                Are you sure you want to disconnect your wallet
                {/* Logged out safely. Thanks for using Str8up. */}
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  className="px-4  border-2 rounded-[12px] border-white h-[50px] text-[20px] w-[173px] mt-3 hover:text-white hover:bg-themeblue"
                  onClick={() => setWalletDisconnectPopUp(false)}
                >
                  No
                </button>
                <button
                  className="px-4  font-semibold text-white rounded-[12px] bg-themeblue h-[50px] text-[20px] w-[173px] mt-3"
                  onClick={onDisconnect}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
