import React from "react";
import Image from "next/image";
import Header from "./Header";
import { useGlobalStates } from "../contexts/WalletModalContext";
import { useRouter } from "next/router";

const Hero = () => {
  const { isWalletModalOpen, setIsWalletModalOpen } = useGlobalStates();
  const {isWalletConnected, setIsWalletConnected} = useGlobalStates();
  // console.log("pp",isWalletConnected)
  const router = useRouter();
  return (
    // --Banner-----
    <section className=" text-white md:py-20 pt-24 relative overflow-hidden hero-section bg-cover bg-fixed flex items-center h-auto lg:h-[73vh] md:h-[52vh]">
      <img src="/images/hero.png" alt="hero-bg" className='absolute top-0 left-0 w-full z-[-1] md:h-[50vh] h-[70vh]  object-cover'  />
      <div className="hidden xl:block absolute left-0">
          <img src="/images/bannerElement.svg" alt="Bet Icon"/>
        </div>
      <div className="hidden xl:block absolute right-0 top-0" data-aos="fade-up-left"> 
          <img src="/images/cup.svg" alt="Bet Icon" className=''/>
        </div>
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
        {/* Left Image */}

        {/* Center Content */}
        <div className="text-center md:text-center max-w-[934px]">
          <h1 className=" font-extrabold leading-tight mb-6 text-center font-gambetta text-[40px] md:text-[72px]">
            1v1 Predictions. No House. Just You vs Them.
          </h1>
          <p className="text-subheading mb-8 text-center text-[20px] md:max-w-[70%] max-w-full  w-full mx-auto">
            Put your skills to the test and win with STR8 token. Escrow,
            payouts, and fairness — all automated by smart contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {
              !isWalletConnected &&
            <button className="commom-btn" onClick={() => setIsWalletModalOpen(true)}>
              Connect Wallet
            </button>
            }

            <button
              className="bg-gradient-to-r from-themeblue to-green text-white font-medium px-6 py-2 rounded-[18px] hover:opacity-80 transition duration-800 text-[19px]"
              onClick={() => router.push("/prediction")}
            >
              Explore Prediction
            </button>
          </div>
        </div>

        {/* Right Image */}
        {/* <div className="hidden md:block md:w-1/4">
          <Image src="/win.png" alt="Win Icon" width={200} height={200} />
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
