import React, { useContext } from "react";
import { formatDollarSTR8, formatFromWei, formatWithDollar } from "../utlis/functions";
import { PredictionDetailContext } from "./PredictionDetails";

const Matchedwages = ({ showAll }) => {
  const { matchedWagers } = useContext(PredictionDetailContext);

  const getWinner = (userId, winnerId) => {
    console.log("userId",userId)
    console.log("winnerId",winnerId)
    if(!winnerId){
      return null
    }else if(userId != winnerId){
      return <span className="los text-red-400 bg-[#4B0000] py-[2px] px-[6px] text-[13px] rounded-[10px]">Loser</span>
    }else if(userId == winnerId){
      return <span className="win text-green bg-[#122512] py-[2px] px-[6px] text-[13px] rounded-[10px] ">Winner</span>
    }
  }
  return (
    <>
      {matchedWagers?.length == 0 ? (
        <div className="text-center max-w-[300px]">
          <img src="/images/nomatch.svg" alt="no-bets" className="mx-auto" />
          <p className="text-sm text-center text-white tracking-[0.5px] mt-5">
            No one has placed a wager yet — place yours now to find a match.
          </p>
        </div>
      ) : (
        <>
          <div className=" text-white space-y-4 w-full mx-auto">
            {matchedWagers?.map((data, index) => {
              if (showAll) {
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-dashed border-gray-600 pb-4 last:border-none">
                      {/* <!-- Left User --> */}
                      <div className="flex md:flex-row flex-col items-start md:items-center md:space-x-3 space-y-3 md:w-1/3 w-[40%]">
                        <img
                          src={
                            data?.participant1?.profile_image
                              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.participant1?.profile_image}`
                              : "/images/no-profile-picture.svg"
                          }
                          alt="Nicola"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-regular text-sm">
                            {data?.participant1.name || "User"}{" "}
                            {getWinner(data?.participant1?._id, data?.winner)}
                          </p>
                          <p className="text-maingrey text-xs line-clamp-1">
                            Wager: {data?.option_participant_1}
                          </p>
                          <p className="text-maingrey text-xs">
                            Wager:{" "}
                            {formatDollarSTR8(formatFromWei(data?.bet_amount))}
                            {/* ${data?.bet_amount}STR8 */}
                          </p>
                        </div>
                      </div>

                      {/* <!-- Center Button --> */}
                      <div className="md:w-1/3 w-[20%] text-center">
                        <span className="inline-block bg-themeblue text-white text-sm px-4 py-2 rounded-lg">
                          {formatWithDollar(Number(formatFromWei(data?.total_bet_amount) || 0) 
                          )}
                        </span>
                      </div>

                      {/* <!-- Right User --> */}
                      <div className="flex md:flex-row flex-col items-start md:items-center md:space-x-3 space-y-3 md:w-1/3 w-[40%] justify-end ml-4 md:ml-0">
                        <img
            src={data?.participant2?.profile_image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.participant2?.profile_image}` : "/images/no-profile-picture.svg"}
                           
                          alt="Paul"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <p className="font-regular text-sm">
                            {data?.participant2?.name || "User"}{" "}
                            {getWinner(data?.participant2?._id, data?.winner)}
                          </p>
                          <p className="text-maingrey text-xs line-clamp-1">
                            Wager: {data?.option_participant_2}
                          </p>
                          <p className="text-maingrey text-xs">
                            Wager:
                            {formatDollarSTR8(formatFromWei(data?.bet_amount))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              }
              if (index <= 3)
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-dashed border-gray-600 pb-4 last:border-none">
                      {/* <!-- Left User --> */}
                      <div className="flex md:flex-row flex-col items-start md:items-center md:space-x-3 space-y-3 md:w-1/3 w-[40%]">
                        <img
                          src={
                            data?.participant1?.profile_image
                              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.participant1?.profile_image}`
                              : "/images/no-profile-picture.svg"
                          }
                          alt="Nicola"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-regular text-sm">
                            {data?.participant1?.name || "User"} {getWinner(data?.participant1?._id , data?.winner)}
                          </p>
                          <p className="text-maingrey text-xs line-clamp-1">
                            Wager: {data?.option_participant_1}
                          </p>
                          <p className="text-maingrey text-xs">
                            Wager:{formatDollarSTR8(Number(formatFromWei(data?.bet_amount)))}
                            {/* ${data?.bet_amount}STR8 */}
                          </p>
                        </div>
                      </div>

                      {/* <!-- Center Button --> */}
                      <div className="md:w-1/3 w-[20%] text-center">
                        <span className="inline-block bg-themeblue text-white text-sm px-4 py-2 rounded-lg">
                          {formatWithDollar(Number(formatFromWei(data?.total_bet_amount || 0)))}
                        </span>
                      </div>

                      {/* <!-- Right User --> */}
                      <div className="flex md:flex-row flex-col items-start md:items-center md:space-x-3 space-y-3 md:w-1/3 w-[40%] justify-end ml-4 md:ml-0">
                        <img
                          src={data?.participant2?.profile_image ?
                            `${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.participant2?.profile_image}` :
                           "/images/no-profile-picture.svg"
                          }
                          alt="Paul"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <p className="font-regular text-sm">
                            {data?.participant2?.name || "User"} {getWinner(data?.participant2?._id, data?.winner)}
                          </p>
                          <p className="text-maingrey text-xs line-clamp-1">
                            Wager: {data?.option_participant_2}
                          </p>
                          <p className="text-maingrey text-xs">
                            Wager:{formatDollarSTR8(Number(formatFromWei(data?.bet_amount)))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Matchedwages;
