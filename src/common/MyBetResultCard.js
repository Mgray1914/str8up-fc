import React, { useEffect, useState } from "react";
import { useGlobalStates } from "../contexts/WalletModalContext";
import { formatFromWei } from "../utlis/functions";

export default function MyBetResultCard({ type, data }) {
    
  const { userProfile } = useGlobalStates();

  const [mybet, setMybet] = useState();
  const [opponentBet, setOpponentBet] = useState();

  useEffect(() => {
    myBetPlace();
  }, [data]);

  const myBetPlace = () => {
    if (data) {
      if (data?.participant1) {
        if (data?.participant1._id == userProfile._id) {
          const betData = data?.participant1;
          betData.option = data?.option_participant_1;
          // console.log("berData", betData)
          setMybet(betData);
        } else {
          const betData = data?.participant1;
          betData.option = data?.option_participant_1;
          setOpponentBet(betData);
        }
      }

      if (data?.participant2) {
        if (data?.participant2._id == userProfile._id) {
          const betData = data?.participant2;
          betData.option = data?.option_participant_2;
          //  console.log("berData", betData)
          setMybet(betData);
        } else {
          const betData = data?.participant2;
          betData.option = data?.option_participant_2;
          setOpponentBet(betData);
        }
      }
    }
  };

  return (
    <>
      <div
        className={`bg-[#090909] rounded-[12px] flex flex-col md:flex-row  items-center justify-between px-4 py-2 border border-${
          type === "no_match" ? "[#FF0000]" : "black"
        } shadow-[1px_-1px_4px_1px_#3d3c3ceb]`}
      >
        <div className="flex items-center">
          <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
            <img
              src={mybet?.profile_image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${mybet?.profile_image}` : "/images/no-profile-picture.svg"}
              alt="Adrian's Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center ms-3">
            <span className="text-white text-[18px]">{mybet?.name || "You"}</span>
            {/* <span className="text-white text-[18px]">{mybet?.option || "You"}</span> */}
            {type !== "no_match" && (
              <span className="ml-1">
                <img
                  src={
                    type == "winner"
                      ? "/images/smallstar.svg"
                      : "/images/lossstart.svg"
                  }
                  alt="star"
                />
              </span>
            )}
          </div>
          <span className="text-white text-sm mx-2 md:w-[180px] w-[40px] text-center">
            VS
          </span>
          {opponentBet?._id ? <>
          <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
            <img
              src={opponentBet?.profile_image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${opponentBet?.profile_image}` : "/images/no-profile-picture.svg"}
              alt="Adrian's Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white text-[18px] ms-3">{opponentBet?.name || "Opponent"}</span>
          </> : 
           <span className="text-[#FF0000] md:text-[20px] text-[16px] ms-3">No one has joined yet</span>
          }
          
        </div>
        <button className="text-white font-medium px-[35px] md:py-[10px] py-[5px] rounded-[18px] border border-[#17C047] relative z-10 shadow-[1px_-1px_4px_1px_#13A6D4] text-[16px]">
          Bet Amount: {Number(formatFromWei(data?.bet_amount || "0")).toFixed(2)}
        </button>
      </div>
    </>
  );
}
