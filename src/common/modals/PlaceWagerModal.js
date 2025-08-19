// components/PlaceWagerModal.js
"use client";
import React, { useContext, useEffect, useState } from "react";
import { callApi } from "../../services/apiServices";
import { PredictionDetailContext } from "../../components/PredictionDetails";
import { checkAndApproveAllowance, matchBet, placeBet } from "../../utlis/blockChain";
import { useGlobalStates } from "../../contexts/WalletModalContext";
import StepsModal from "./StepsModal";
import { formatFromWei, getTokenBalance, Transaction } from "../../utlis/functions";
import toast from "react-hot-toast";
import Loader from "../Loader";

const PlaceWagerModal = ({
  isOpen,
  onClose,
  selectedOption,
  predictionDetail,
  setSelectedOption,
  setBetSuccessModal,
  selectedOpneWagers,
  mode = "new",
}) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState({
    approval: null,
    betLoader: null,
  });
  const { walletAddress, setWalletAddress } = useGlobalStates();
  const [stepsModalOpen, setStepsModalOpen] = useState(false);    //Steps Modal
  const [tryCount, setTryCount] = useState(0)
  const [showloader, setShowLoader] = useState(false)
  const [balance, setBalance] = useState(0)
  const { fetchPredictionDetails } = useContext(PredictionDetailContext);


    const isLive = React.useMemo(() => {
      if (!predictionDetail?.startTimestamp || !predictionDetail?.endTimestamp)
        return false;
      const now = new Date();
      const startTime = new Date(predictionDetail.startTimestamp);
      const endTime = new Date(predictionDetail.endTimestamp);
      const threeMinBeforeStart = new Date(startTime.getTime() - 3 * 60 * 1000);
      return now >= threeMinBeforeStart && now <= endTime;
    }, [predictionDetail]);
    
  useEffect(()=>{
    const getBal = async () => {
      const tokenBalance = await getTokenBalance(walletAddress)
      setBalance(parseFloat(tokenBalance.balance))
    }
    if(walletAddress){
      getBal()
    }
  },[walletAddress])

console.log("balance", balance)

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const opponentSelectedOption = selectedOpneWagers?.option_participant_1;


  const handleModalClose=()=>{
    onClose(false)
    setTryCount(0)
    setAmount("")
  }

  useEffect(() => {
    console.log("uuu", predictionDetail);

    if (selectedOpneWagers && predictionDetail) {
      const selected = selectedOpneWagers.option_participant_1;
      if (selected === predictionDetail?.option1) {
        setSelectedOption(predictionDetail?.option2);
      } else if (selected === predictionDetail?.option2) {
        setSelectedOption(predictionDetail?.option1);
      }
      if (mode === "accept") {
        const rawAmount = selectedOpneWagers.bet_amount         //selectedOpneWagers.bet_amount?.toString()
        const readableAmount = formatFromWei(rawAmount)
        setAmount(readableAmount);
      }
    }
  }, [selectedOpneWagers, predictionDetail]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-visible");
    } else {
      document.body.classList.remove("modal-visible");
    }
    return () => {
      document.body.classList.remove("modal-visible");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    console.log("islive", isLive)
    if(isLive){
      toast.error("Prediction is live cannot place bet", {id : "place-bet"})
      return;
    }
    const numericAmount = parseFloat(amount);
    if(!walletAddress){
      toast.error("Wallet not connected", {id : "wallet-not-connected"})
      return
    }
    if (!amount) {
      setError("Enter Amount")
      return;
    } else if (isNaN(numericAmount)) {
      setError("Invalid amount")
      return;
    } else if (numericAmount <= 0) {
      setError("Amount must be greater than 0")
      return;
    } else if(amount > balance){
      setError("Insufficient token balance")
      return
    }else {
      setError("");
    }

    try {
      setLoader({
        approval: null,
        betLoader: null,
      })
      setStepsModalOpen(true);
      setLoader((prev) => ({ ...prev, approval: true }));
      await checkAndApproveAllowance(amount, walletAddress);
      setLoader((prev) => ({ ...prev, approval: false }));
      if (mode === "new") {
        setLoader((prev) => ({ ...prev, betLoader: true }));

        const selectedOptionNumber =
          selectedOption === predictionDetail.option1
            ? 1
            : selectedOption === predictionDetail.option2 && 2;
        const BetpredictionId = parseInt(predictionDetail?.predictionId);
        const Betamount = amount;
        // console.log("place Send data",selectedOptionNumber ,BetpredictionId, Betamount)

        const response = await placeBet(
          BetpredictionId,
          selectedOptionNumber,
          Betamount
        );
        console.log("bet response", response);
            if (response?.receipt?.blockNumber || response?.blockNumber) {
        await Transaction(response?.receipt?.blockNumber || response?.blockNumber);
      }
        setLoader((prev) => ({ ...prev, betLoader: false }));       
        ResetStates();
        setStepsModalOpen(false)
        setShowLoader(true)
        await delay(3000)
      await  fetchPredictionDetails();
      setShowLoader(false)
        setBetSuccessModal(true);
        handleModalClose();
      }

      if (mode === "accept") {
        setLoader((prev) => ({ ...prev, betLoader: true }));
        const BetpredictionId = parseInt(predictionDetail?.predictionId);
        console.log("selectedOpneWagers",selectedOpneWagers)
        const BetTargetId = selectedOpneWagers?.betId || selectedOpneWagers?.betAId
        const matchedResponse = await matchBet(BetpredictionId, BetTargetId)
        console.log("matched response", matchedResponse)

         
        await Transaction(matchedResponse.receipt.blockNumber);
     
        setLoader((prev) => ({ ...prev, betLoader: false }));   
        if(matchedResponse) {   
        ResetStates();
        setStepsModalOpen(false)
        setShowLoader(true)
        await delay(3000)
        await fetchPredictionDetails();
        setShowLoader(false)
        setBetSuccessModal(true);
        handleModalClose();

      }}
    } catch (error) {
      console.log("bet Error", error)
      setStepsModalOpen(false); // 🔁 CLOSE modal on failure or cancel
      setTryCount(tryCount+1)

    }finally{
      setShowLoader(false)
    }
  };

  function ResetStates() {
    setAmount("");
    setLoader({
      approval: null,
      betLoader: null,
    })
    // setSelectedOption("")
  }
  console.log("selected", selectedOption);

  return (
    <>
    {showloader &&  <Loader/>}
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <div
          className="bg-[#090909] rounded-[20px] max-w-[675px] w-[90%] md:w-[full] p-[20px] md:p[30px] pt-[30px] md:pt-[60px] border border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative"
          data-aos="zoom-out-left"
          data-aos-duration="500"
        >
          <button
            type="button"
            onClick={handleModalClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 w-[40px] h-[40px]"
          >
            <img src="/images/cross.svg" alt="Close" width={100} height={100} />
          </button>

          <div className="text-center">
            <h3 className="mb-5 text-[30px] font-semibold text-white font-gambetta">
              Place a Wager
            </h3>
            <p className="font-regular text-[#828282] pb-0 text-[20px]">
              Choose a team to place a bet
            </p>

            <div className="flex justify-center m-4">
              <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 w-full rounded-[8px] border border-[#828282] overflow-hidden">
                <li className="w-1/2">
                  <a
                    // onClick={() => setSelectedOption(predictionDetail?.option1)}
                    onClick={() => {
                      if(mode === "accept"){
                        return
                      }
                      if (
                        opponentSelectedOption !== predictionDetail?.option1
                      ) {
                        setSelectedOption(predictionDetail.option1);
                      }
                    }}
                    // className="block px-4 py-3 text-white bg-themeblue active hover:text-white hover:bg-themeblue rounded-l-[8px]"
                    className={`block px-4 py-3  active ${
                      selectedOption === predictionDetail?.option1
                        ? " text-white bg-themeblue "
                        : ""
                    } hover:text-white hover:bg-themeblue rounded-l-[8px]  ${
                      opponentSelectedOption === predictionDetail?.option1
                        ? "opacity-50  cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {predictionDetail?.option1}
                  </a>
                </li>
                <li className="w-1/2">
                  <a
                    // onClick={() => setSelectedOption(predictionDetail?.option2)}
                    onClick={() => {
                      if(mode === "accept"){
                        return
                      }
                      if (
                        opponentSelectedOption !== predictionDetail?.option2
                      ) {
                        setSelectedOption(predictionDetail?.option2);
                      }
                    }}
                    //  className="block px-4 py-3 hover:text-white hover:bg-themeblue rounded-r-[8px]"
                    className={`block px-4 py-3  ${
                      selectedOption === predictionDetail?.option2
                        ? " text-white bg-themeblue"
                        : ""
                    } hover:text-white hover:bg-themeblue rounded-r-[8px] ${
                      opponentSelectedOption === predictionDetail?.option2
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {predictionDetail?.option2}
                  </a>
                </li>
              </ul>
            </div>

            <p className="font-regular text-[#828282] pb-1 text-[20px] mt-[20px] md:mt-[30px]">
              Bet Amount
            </p>
            <input
              type="text"
              id="amount"
              className="bg-[#181818] mt-3 border border-gray-300 text-white text-center rounded-lg max-w-[326px] w-full h-[50px] md:h-[70px] font-bold text-[39px] p-2.5 required  appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^\d*\.?\d{0,4}$/;
                if (!regex.test(value)) return;
                setAmount(value);
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              value={amount}
              readOnly={mode === "accept"}
            />
            {/* Error Message */}

            {error && <p className="text-red-600 mt-3">{error}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              class="btn-gradient group hover:from-green hover:to-themeblue mt-[40px]"
            >
              <span class="btn-inner group-hover:bg-transparent group-hover:dark:bg-transparent">
                {tryCount>0 ? "Try Again" : "SUBMIT"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <StepsModal isModalOpen={stepsModalOpen} isCloseModal={setStepsModalOpen} stepOneloader={loader.approval} steptwoloader={loader.betLoader}/>

    </>
  );
};

export default PlaceWagerModal;
