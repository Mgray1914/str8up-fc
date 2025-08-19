import React, { useEffect, useState } from "react";
import { useGlobalStates } from "../contexts/WalletModalContext";
import { formatFromWei } from "../utlis/functions";

const Result = ({ data, type }) => {
  const { userProfile } = useGlobalStates();
  const [mybet, setMybet] = useState();
  const [opponentBet, setOpponentBet] = useState();
  const [resultStatus, setResultStatus] = useState();
  
  const resultType = {
    WINNER : "WINNER",
    LOSER : "LOSER",
    NOT_MATCHED : "NOT_MATCHED"
  }
  console.log("opp",  data)

  const myBetPlace = () => {
    if (data) {
      if (data?.participant1) {
        if (data?.participant1._id == userProfile._id) {
          const betData = data?.participant1
          betData.option = data?.option_participant_1
          // console.log("berData", betData)
          setMybet(betData);
        } else {
           const betData = data?.participant1
          betData.option = data?.option_participant_1
          setOpponentBet(betData);
        }
      }

      if (data?.participant2) {
        if (data?.participant2._id == userProfile._id) {
           const betData = data?.participant2
           betData.option = data?.option_participant_2
          //  console.log("berData", betData)
          setMybet(betData);
        } else {
           const betData = data?.participant2
          betData.option = data?.option_participant_2
          setOpponentBet(betData);
        }
      }
    }
  };

  const setWinnerStatus = ()=>{
    if(mybet){
      if(mybet?._id == data.winner){
        setResultStatus(resultType.WINNER)
      }else if(!opponentBet?._id){
        setResultStatus(resultType.NOT_MATCHED)
      }else if (opponentBet?._id == data.winner){
        setResultStatus(resultType.LOSER)
      }
    }
  }
  useEffect(() => {
    myBetPlace();
  }, [data]);

  useEffect(()=>{
    setWinnerStatus()
  },[mybet, opponentBet])

    console.log("Winner user detail", resultStatus);


  const getBgColor = (type) => {
    switch (type) {
      case resultType.WINNER:
        return "bg-[#419E3F]";
      case resultType.LOSER:
        return "bg-[#FF3D3D]";
      case resultType.NOT_MATCHED:
        return "bg-[#736388]";
      default:
        return "bg-[#490BE]";
    }
  };

  const getBetAmountColor = (type) => {
    switch (type) {
      case resultType.WINNER:
        return "bg-[#67E665]";
      case resultType.LOSER:
        return "bg-[#FF8E8E] ";
      case resultType.NOT_MATCHED:
        return "bg-[#AEA4BA]";
      default:
        return "bg-[#95D1D9] ";
    }
  };

   const getBetAmountShadow = (type) => {
    switch (type) {
      case resultType.WINNER:
        return "#0C740A";
      case resultType.LOSER:
        return "#AD0000";
      case resultType.NOT_MATCHED:
        return "#3C1D65";
      default:
        return "#1A8593";
    } 
  };

   const getMessage = (type) => {
    switch (type) {
      case resultType.WINNER:
        return "Winner";
      case resultType.LOSER:
        return "Better luck next time";
      case resultType.NOT_MATCHED:
        return "No match found";
      default:
        return "bg-gray-300 ";
    }
  };
  const bgColor = getBgColor(resultStatus);
  const amountBgcolor = getBetAmountColor(resultStatus);
  return (
    <>
      <div
        className={`flex rounded-xl py-4 md:py-5 md:px-9 px-4 ${bgColor} justify-between items-center mt-7 gap-[15px] md:gap-0`}
      >
        {/* ---Player1--- */}
        <div className={`player1 text-center max-w-[329px] md:w-full w-auto ${resultStatus == resultType.WINNER && "winner"}`}>
          <img
            src={mybet?.profile_image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${mybet?.profile_image}` : "/images/no-profile-picture.svg"}
            alt="myself"
            className="w-[65px] md:w-[118px] h-[65px] md:h-[118px] rounded-full mb-4 mx-auto"
          />
          <h3 className="text-white text-[24px] md:text-[30px] font-medium">
           {mybet?.name || "You"}
          </h3>
          <p className="text-white text-20px md:text-[24px] mt-2">{mybet?.option}</p>
        </div>
        {/* --Status-- */}
        <div className="text-center grid gap-4">
          <img src="/images/stars.svg" alt="ratings" data-aos="zoom-in-up" />
          <h3 className="text-white text-[26px]">{getMessage(resultStatus)}</h3>
          {/* ---Bet Amount--- */}
          <span
            className={`text-[#012B00] font-bold md:text-2xl text-[13px] h-[40px] md:h-[50px] px-[10px] md:px-[20px] rounded-xl ${amountBgcolor} shadow-[4px_2px_9px_1px_${getBetAmountShadow(resultStatus)}] flex items-center justify-center`}
          >
            Bet Amount: {Number(formatFromWei(data?.bet_amount || "0")).toFixed(2)}

          </span>
        </div>

        {/* ---Opposition--- */}
        {opponentBet?._id ? <>
          <div className={`player1 text-center max-w-[329px] md:w-full w-auto ${resultStatus == resultType.LOSER && "crown relative before:absolute before:content-[''] before:bg-no-repeat before:bg-[url('../../public/images/winnerCrown.svg')] before:w-[75px] before:h-[75px] before:top-[-22px] before:left-1/2 before:transform before:-translate-x-1/2"} `}>
          <img
            src={opponentBet?.profile_image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${opponentBet?.profile_image}` : "/images/no-profile-picture.svg"}
            alt="myself"
            className="w-[65px] md:w-[118px] h-[65px] md:h-[118px] rounded-full mb-4 mx-auto"
          />
          <h3 className="text-white text-[24px] md:text-[30px] font-medium">
            {opponentBet?.name || "Opponent"}
          </h3>
          <p className="text-white text-20px md:text-[24px] mt-2">{opponentBet?.option}</p>
        </div>
        </> : <>
        
      <div className={`player1 text-center max-w-[329px] md:w-full w-auto ${resultStatus == resultType.LOSER && "winner"} `}>
          <p className="text-white text-[20px]"> No Match found</p>
          <span className="">Refunded</span>
        </div>
        </>}
      </div>
    </>
  );
};

export default Result;
