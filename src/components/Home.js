import Image from "next/image";
import React, { useRef, useState } from "react";
import { Manrope } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Hero from "../components/Hero";
import FAQSection from "../components/Faqs";
import "swiper/css";
import "swiper/css/navigation";
import CountUp from 'react-countup';
import Matchcard from "../components/Matchcard";
import SliderPrediction from "./SliderPrediction";
export default function Home() {
  return (
    <>
      <Hero />
      {/* -----Stands Section--- */}
      <section className="stands md:py-20 py-10  bg-bgdark overflow-x-hidden" id="stands">
        <div className="container mx-auto px-2">
          <div className="flex lg:flex-row justify-between items-center flex-col-reverse">
            <div className="max-w-[615px] relative layerBlur">
              <h3 className="sectionHeading">
                Why Str8up Stands Above the Rest
              </h3>
              <p className="mt-4">
                Str8Up represents the future of sports prediction with a fair, transparent platform built for everyone. Unlike traditional betting platforms that profit from house edges and complex odds, Str8Up offers true peer-to-peer prediction battles where you compete directly against other users based purely on skill. The platform simplifies the experience with straightforward win/lose formats, $5 increment wagering, and instant payouts, eliminating the confusion of traditional spreads and odds. Built on Base blockchain, Str8Up ensures complete security and transparency through automated smart contract settlements and visible transactions.
              </p>
              <p className="mt-4">
                The platform's deflationary STR8 token creates long-term value through a burn mechanism that permanently removes tokens from circulation, while token holders benefit from profit sharing through staking rewards and revenue distribution. With only a 5% platform fee compared to traditional platforms' up to 10% fees, built-in social features for challenging friends and tracking performance, and a decentralized architecture that reduces regulatory risks, Str8Up delivers the transparent, user-focused sports prediction experience that the community deserves.
              </p>
            </div>
            <div className="flex justify-center gap-9 sm:gap-2 mb-3 lg:mb-0 px-2">
              <img
                src="/images/leftframe.svg"
                alt="left-Frame"
                className="mr-[-84px] w-[50%] sm:w-auto"
                data-aos="fade-up"
                data-aos-delay="500"
              />
              <img
                src="/images/rightframe.svg"
                alt="right-Frame"
                data-aos="fade-down"
                data-aos-delay="500"
                className="w-[50%] sm:w-auto"
              />
            </div>
          </div>
          {/* ----Stats Row--- */}
          <div className="flex flex-col items-center md:flex-row gap-x-[70px] md:gap-x-[10px] lg:gap-x-[70px] space-y-4 md:space-y-0 mt-16 justify-center">
            <div className="flex-1 text-center max-w-[325px]">
              <Image
                src="/images/icon1.svg"
                alt="usericon"
                width={85}
                height={85}
                className="mx-auto"
              />
              <div className="counter-frame h-[238px] mt-[-12px] py-[40px] px-[53px] bg-cover">
                <h3 className="text-white text-[32px] md:text-[32px] lg:text-[48px] font-manrope font-bold">
                  <CountUp end={98} duration={6} separator="%" suffix="%" prefix="" />
                </h3>
                <p className="text-white text-[18px] md:text-[18px] lg:text-[25px]">of users choose Str8up</p>
              </div>
            </div>
            <div className="flex-1 text-center max-w-[325px]">
              <Image
                src="/images/icon-2.svg"
                alt="usericon"
                width={85}
                height={85}
                className="mx-auto"
              />
              <div className="counter-frame h-[238px] mt-[-12px] py-[40px] px-[53px] bg-cover">
                <h3 className="text-white text-[32px] md:text-[32px] lg:text-[48px] font-manrope font-bold">
                  <CountUp end={2} duration={6} separator="%" suffix="M" prefix="$" />
                </h3>
                <p className="text-white text-[18px] md:text-[18px] lg:text-[25px]">
                  winnings paid out instantly.
                </p>
              </div>
            </div>
            <div className="flex-1 text-center max-w-[325px]">
              <Image
                src="/images/icon-3.svg"
                alt="usericon"
                width={85}
                height={85}
                className="mx-auto"
              />
              <div className="counter-frame h-[238px] mt-[-12px] py-[40px] px-[53px] bg-cover">
                <h3 className="text-white text-[32px] md:text-[32px] lg:text-[48px] font-manrope font-bold">
                  <CountUp end={100} duration={8} separator="%" suffix="%" prefix="" />
                </h3>
                <p className="text-white text-[18px] md:text-[18px] lg:text-[25px]">
                  transactions are on-chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ----steps section--- */}
      <section className="steps bg-[#0D0D0D] py-20 overflow-hidden" id="steps">
        <div className="container mx-auto px-2">
          <h3 className="sectionHeading text-center">
            Make Your Move in 3 Simple Steps
          </h3>
          <p className="text-subheading text-center text-[20px]">
            A simple 3-step process to predict, bet, and win — powered by
            blockchain and STR8 tokens.
          </p>
          {/* ----Loop--- */}
          {/* ---Step 1---- */}
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-center mt-20 flex-col-reverse md:flex-row">
            <div className="w-full md:w-[60%] relative layerBlur mb-5 md:mb-0">
              <div className="max-w-[518px]">
                <h3 className="sectionHeading">Step 1: Connect & Find Opponent</h3>
                <p className="mt-4">
                  Connect your crypto wallet seamlessly to get started. Browse open predictions or challenge other users directly. Match with someone who shares your sports instincts and kick off a fair, secure head-to-head prediction in seconds.
                </p>
               
              </div>
              <img
                src="/images/arrow-down.svg"
                alt="star-1"
                className="absolute right-[0] bottom-[-230px] hidden lg:block"
              />
            </div>
            <div className="w-full md:w-[40%]">
              <div className="stack relative">
                <img
                  src="/images/star-1.svg"
                  alt="star-1"
                  className="absolute left-[10px] top-[40px] animate-pulse"
                />
                <img
                  src="/images/step1.svg"
                  alt="Step1"
                  className="relative z-50 mx-auto w-[72%] md:w-auto"
                  data-aos="fade-up-right"
                />
                <img
                  src="/images/step1bg.svg"
                  alt="Stepbg"
                  className="absolute z-0 md:right-[7px] md:top-[-43px] right-[27px] top-[-22px] w-[72%] md:w-auto"
                  data-aos="fade-up-left"
                />
                <img
                  src="/images/star-2.svg"
                  alt="star-2"
                  className="absolute right-[0] bottom-[80px] animate-pulse"
                />
              </div>
            </div>
          </div>
          {/* ---Step-2 --- */}
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-center mt-20  md:flex-row">
            <div className="w-full md:w-[40%]">
              <div className="stack relative ">
                <img
                  src="/images/star-1.svg"
                  alt="star-1"
                  className="absolute left-[10px] top-[40px] animate-pulse"
                />
                <img
                  src="/images/step2.svg"
                  alt="Step1"
                  className=" relative z-50 mx-auto w-[72%] md:w-auto"
                  data-aos="fade-up-left"
                />
                <img
                  src="/images/step1bg.svg"
                  alt="Stepbg"
                  className="absolute z-0 md:right-[7px] md:top-[-43px] right-[27px] top-[-22px] w-[72%] md:w-auto"
                  data-aos="fade-up-right"
                />
                <img
                  src="/images/star-2.svg"
                  alt="star-2"
                  className="absolute right-[0] bottom-[80px] animate-pulse"
                />
              </div>
            </div>
            <div className="w-full md:w-[60%] relative mb-5 md:mb-0">
              <div className="max-w-[518px] layerBlur after:right-[0] after:z-[-1] md:float-right float-none  relative z-20">
                <h3 className="sectionHeading">
                  Step 2: Set Wager & Auto-Escrow
                </h3>
                <p className="mt-4">
                 Decide how many STR8 tokens you want to stake. Once placed, your tokens are automatically locked in a secure smart contract, ensuring trustless betting and guaranteeing that payouts happen instantly once the game finishes.
                </p>
               
              </div>
            </div>
          </div>
          {/* -----Step 3--- */}
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-center mt-20 flex-col-reverse md:flex-row">
            <div className="w-full md:w-[60%] relative layerBlur mb-5 md:mb-0">
              <div className="max-w-[518px] relative">
                <h3 className="sectionHeading">
                  Step 3:Game Results & Instant Payout
                </h3>
                <p className="mt-4">
                 After the match, the smart contract confirms the result. Winning tokens are released immediately, so you can enjoy your rewards without delays. Celebrate your prediction success and jump straight into the next challenge.
                </p>
               
                <img
                  src="/images/up-arrow.svg"
                  alt="star-1"
                  className="absolute right-[-164px] bottom-[-100px] hidden lg:block"
                />
              </div>
            </div>
            <div className="w-full md:w-[40%]">
              <div className="stack relative ">
                <img
                  src="/images/star-1.svg"
                  alt="star-1"
                  className="absolute left-[10px] top-[40px] animate-pulse"
                />
                <img
                  src="/images/step1.svg"
                  alt="Step1"
                  className=" relative z-50 mx-auto w-[72%] md:w-auto"
                  data-aos="fade-up-right"
                />
                <img
                  src="/images/step1bg.svg"
                  alt="Stepbg"
                  className="absolute z-0 md:right-[7px] md:top-[-43px] right-[27px] top-[-22px] w-[72%] md:w-auto"
                  data-aos="fade-up-left"
                />
                <img
                  src="/images/star-2.svg"
                  alt="star-2"
                  className="absolute right-[0] bottom-[80px] animate-pulse"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ---Chain Challenges--- */}

      {/* ------chalenges matches slider--- */}
      <SliderPrediction />

      {/* -----Buy Str Tokens--- */}
      <section className="buyTokens py-[93px] bg-cover bg-no-repeat overflow-hidden">
        <div className="container mx-auto relative">
          <div className="absolute left-0">
            <span className="layerBlur relative after:right-[auto]"></span>
          </div>
          <div className="absolute right-0">
            <span className="rounded-[320px] opacity-[0.43] bg-[#17C047] blur-[300px] w-[320px] h-[320px] relative block"></span>
          </div>
          {/* --Circle 1--- */}
          <div className="absolute left-0 md:top-0 top-[-66px] motion-safe:animate-bounce w-[80px] md:w-auto ">
            <img src="/images/circle1.png" alt="circle1" />
          </div>
          {/* ----Circle  2--- */}
          <div className="absolute left-20 bottom-0 hidden md:block">
            <img src="/images/circle2.png" alt="circle2" />
          </div>
          {/* --Circle 3--- */}
          <div className="absolute right-0 top-0 hidden md:block">
            <img src="/images/circle1.png" alt="circle1" />
          </div>
          {/* ----Circle  4--- */}
          <div className="absolute right-20 md:bottom-0 bottom-[-66px] motion-safe:animate-bounce delay-300 w-[50px] md:w-auto">
            <img src="/images/circle2.png" alt="circle2" />
          </div>

          <div className="text-center">
            <img src="/images/STR8.svg" className="mx-auto" />
            <h3 className="text-center text-[40px] md:text-[60px] text-white font-bold font-gambetta my-6">
              BUY STR8 TOKEN
            </h3>
            <p className="text-[20px] text-subheading font-extralight mb-[40px]">
              All bets are live. Ready to predict?
            </p>
            <button className="max-w-[225px] text-white w-full md:h-[56px] text-[20px] rounded-[18px] border-2 border-white font-semibold shadowcustome bg-customgradient">
              BUY STR8 NOW
            </button>
          </div>
        </div>
      </section>
      {/* ----Better Grid---- */}
      <section className="better py-[80px] overflow-hidden" id="benefits">
        <div className="container mx-auto px-3">
          <h3 className="sectionHeading text-center">
            What Makes Str8up Better?
          </h3>
          <p className="text-center text-subheading text-xl my-2">
            Discover the key advantages that make Str8up faster, fairer, and
            fully decentralized.
          </p>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
            {/* Peer - to - Peer */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-md group"
              data-aos="fade-right"
            >
              <img
                src="/images/payouts.png"
                alt="Peer - to - Peer"
                className="w-full h-auto object-cover"
              />
              <div className="p-4 text-center bottom-0 w-full absolute text-xl text-white">
                True Peer - to - Peer Competition
              </div>
              <div className="content">
                <h5 className="text-[20px] text-white">True Peer-to-Peer Competition</h5>
                <p className="text-[#C5C5C5] text-[14px] mt-3 leading-[19px]">
                  Face other fans directly with no house edge, no complex spreads, and pure
                  1v1 prediction battles based purely on your skill, not rigged odds
                  designed to favor the platform.
                </p>
              </div>
            </div>


            {/* 1v1 Peer Betting */}
            <div
              className=" rounded-2xl overflow-hidden shadow-md  relative group"
              data-aos="fade-up"
            >
              <img
                src="/images/revenue.png"
                alt="Revenue"
                className="w-full h-[auto] object-cover"
              />
              <div className="p-4 text-center bottom-0 w-full absolute text-xl text-white">
                Comprehensive Revenue Sharing
              </div>
              <div className="content">
                <h5 className="text-[20px] text-white">Comprehensive Revenue Sharing</h5>
                <p className="text-[#C5C5C5] text-[14px] mt-3 leading-[19px]">
                  As a STR8 token holder, you earn a direct share of all platform profits through our staking program, where every transaction fee generates returns for token holders who believe in the platform's growth.
                </p>
              </div>
            </div>

            {/* Deflationary Token Value */}
            <div
              className=" rounded-2xl overflow-hidden shadow-md relative group"
              data-aos="fade-left"
            >
              <img
                src="/images/platformfees.png"
                alt="Deflationary Token Value"
                className="w-full h-[auto] object-cover"
              />
              <div className="p-4 text-center bottom-0 w-full absolute text-xl text-white">
               Deflationary Token Value
              </div>
              <div className="content">
                <h5 className="text-[20px] text-white">Deflationary Token Value</h5>
                <p className="text-[#C5C5C5] text-[14px] mt-3 leading-[19px]">
                   TR8 tokens become more valuable over time through our burn mechanism that permanently removes tokens from circulation while rewarding long-term holders with increasing scarcity.
                </p>
              </div>

            </div>

            {/* Maximum Profit Potential */}
            <div
              className=" rounded-2xl overflow-hidden shadow-md relative group"
              data-aos="fade-right"
            >
              <img
                src="/images/profite.png"
                alt="Maximum Profit Potential"
                className="w-full h-[auto] object-cover"
              />
              <div className="p-4 text-center bottom-0 w-full absolute text-xl text-white">
               Maximum Profit Potential
              </div>
              <div className="content">
                <h5 className="text-[20px] text-white">Maximum Profit Potential</h5>
                <p className="text-[#C5C5C5] text-[14px] mt-3 leading-[19px]">
                    Keep more with our 5% platform fee versus 10% elsewhere, plus earn passive income through STR8 token revenue sharing with bonus multipliers up to 50% for committed stakers.
                </p>
              </div>
            </div>

             {/* Proven Advantages */}
            <div
              className=" rounded-2xl overflow-hidden shadow-md relative group"
              data-aos="fade-up"
            >
              <img
                src="/images/advantages.png"
                alt=" Proven Advantages"
                className="w-full h-[auto] object-cover"
              />
              <div className="p-4 text-center bottom-0 w-full absolute text-xl text-white">
               Proven Advantages
              </div>
               <div className="content">
                <h5 className="text-[20px] text-white">Proven Advantages</h5>
                <p className="text-[#C5C5C5] text-[14px] mt-3 leading-[19px]">
                    5% platform fee vs. 10% elsewhere, 0% house edge, full blockchain transparency, plus instant payouts and up to 50% staking bonuses for active users.
                </p>
              </div>
            </div>

            {/*Three-Way Profit Distribution */}
            <div
              className=" rounded-2xl overflow-hidden shadow-md relative group"
              data-aos="fade-left"
            >
              <img
                src="/images/distribution.png"
                alt="Three-Way Profit"
                className="w-full h-[auto] object-cover"
              />
              <div className="p-4 text-center bottom-0 w-full absolute text-xl text-white">
                Three-Way Profit Distribution
              </div>
               <div className="content">
                <h5 className="text-[20px] text-white">Three-Way Profit Distribution</h5>
                <p className="text-[#C5C5C5] text-[14px] mt-3 leading-[19px]">
                  Platform fees are split transparently: one-third burned to increase token value, one-third distributed as staking rewards to token holders, and one-third allocated for platform development &  growth.
                </p>
              </div>
            </div>

             {/*  Blockchain Security & Instant Payouts */}
            <div
              className=" rounded-2xl overflow-hidden shadow-md relative group"
              data-aos="fade-right"
            >
              <img
                src="/images/Blockchain-security.png"
                alt=" Blockchain Security "
                className="w-full h-[auto] object-cover"
              />
              <div className="p-4 text-center bottom-0 w-full absolute text-xl text-white">
                 Blockchain Security & Instant Payouts
              </div>
              <div className="content">
                <h5 className="text-[20px] text-white">Blockchain Security & Instant Payouts</h5>
                <p className="text-[#C5C5C5] text-[14px] mt-3 leading-[19px]">
                   Smart contracts on Base blockchain provide automated escrow with zero counterparty risk, allowing you to pick your team, set $5 increment wagers, and receive instant transparent payouts.
                </p>
              </div>
            </div>

             {/* Community Ownership Model */}
            <div
              className=" rounded-2xl overflow-hidden shadow-md relative group"
              data-aos="fade-up"
            >
              <img
                src="/images/community-ownership.png"
                alt="Community Ownership Model"
                className="w-full h-[auto] object-cover"
              />
              <div className="p-4 text-center bottom-0 w-full absolute text-xl text-white">
                Community Ownership Model
              </div>
              <div className="content">
                <h5 className="text-[20px] text-white">Community Ownership Model</h5>
                <p className="text-[#C5C5C5] text-[14px] mt-3 leading-[19px]">
                    Unlike platforms that profit when you lose, Str8Up grows stronger when you succeed, with token holders sharing in every success through direct revenue participation and platform governance.
                </p>
              </div>
            </div>

            {/* Simple Social Experience */}
            <div
              className=" rounded-2xl overflow-hidden shadow-md relative group"
              data-aos="fade-left"
            >
              <img
                src="/images/social-experience.png"
                alt="Seamless Experience"
                className="w-full h-[auto] object-cover"
              />
              <div className="p-4 text-center bottom-0 w-full absolute text-xl text-white">
                Simple Social Experience
              </div>
               <div className="content">
                <h5 className="text-[20px] text-white">Simple Social Experience</h5>
                <p className="text-[#C5C5C5] text-[14px] mt-3 leading-[19px]">
                     Challenge friends, track performance, build reputation, and compete in a vibrant community while earning from platform success with no withdrawal delays, hidden fees, or confusion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FAQSection />
    </>
  );
}
