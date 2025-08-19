// components/common/BetsCard.js
import React from "react";
import {
  formatTimestampToDate,
  formatTimestampToTime,
  isLocalTimePastUtcInput,
} from "../utlis/functions";
import { useRouter } from "next/router";

export default function BetsCard({ data = [], type = "active", size }) {
  const router = useRouter();
  if (!data.length) {
    return (
      <p className="text-white text-center col-span-full mt-10">
        <img
          src="/images/no-datafound.svg"
          alt=""
          className="w-[150px] mx-auto mb-4"
        />
        No {type === "active" ? "active" : "completed"} bets found.
      </p>
    );
  }

  return (
    <div className="cardsGrid grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 mt-10">
      {data.map((bet, index) => {
        const pred = bet.prediction;
        const team1 = pred.team1 || {};
        const team2 = pred.team2 || {};

        const isWin = bet.participant1 === bet.winner;
          const now = new Date();
const startTime = new Date(pred.startTimestamp);
const endTime = new Date(pred.endTimestamp);
const threeMinBeforeStart = new Date(startTime.getTime() - 3 * 60 * 1000);
const isLive = now >= threeMinBeforeStart && now <= endTime;
        // const statusLabel =
        //   type === "active" ? "• Place a Wager" : isWin ? "• Win" : "• Loss";
        // const statusColor =
        //   type === "active"
        //     ? "text-white"
        //     : isWin
        //     ? "text-[#00FF00]"
        //     : "text-[#FF0000]";
        let statusLabel = "";
        let statusColor = "text-white";

        // if (type === "active") {
        //   const isBettingClosed = isLocalTimePastUtcInput(pred.endTimestamp);
        //   statusLabel = isBettingClosed ? "View" : "Place a Wager";
        // } else {
        //   const isWin = bet.participant1 === bet.winner;
        //   statusLabel = isWin ? "• Win" : "• Loss";
        //   statusColor = isWin ? "text-[#00FF00]" : "text-[#FF0000]";
        // }

        if (type === "active") {
  const isBettingClosed = isLocalTimePastUtcInput(pred.endTimestamp);
  if (isBettingClosed) {
    statusLabel = "View";
  } else if (isLive) {
    statusLabel = "Live";
    // statusColor = "text-red-500";
  } else {
    statusLabel = "Place a Wager";
  }
} else {
  const isWin = bet.participant1 === bet.winner;
  statusLabel = isWin ? "• Win" : "• Loss";
  statusColor = isWin ? "text-[#00FF00]" : "text-[#FF0000]";
}


        if (size) {
          if (index < size)
            return (
              <div
                key={bet._id}
                className="text-white rounded-[20px] md:w-full w-[95%] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-3 md:p-5 mx-auto"
              >
                <div className="flex justify-center items-center gap-4 mb-6">
                  <div className="h-[58px] w-[58px] border border-[#fff] shadow-[0px_0px_15px_0px_#8C8C8C] rounded-full overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${team1.image}`}
                      alt={team1.name}
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-[22px] font-regular">VS</span>
                  <div className="bg-gray-800 rounded-full h-[58px] w-[58px] border border-[#fff] shadow-[0px_0px_15px_0px_#8C8C8C] overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${team2.image}`}
                      alt={team2.name}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <div className="text-center mb-6">
                  {/* ----Question----- */}
                  <h2 className="text-[20px] md:text-[22px] font-semibold leading-tight h-[56px]">
                    {pred?.question}
                  </h2>
                </div>

                <div className="flex justify-between gap-4 mb-8">
                  <div className="flex-1 bg-[#1C1C1C] p-4 rounded-md">
                    <p className="text-gray-400 text-sm mb-1">START DATE</p>
                    <p className="text-[16px] md:text-[19px]">
                      {formatTimestampToDate(pred.startTimestamp)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatTimestampToTime(pred.startTimestamp)}
                    </p>
                  </div>
                  <div className="flex-1 bg-[#1C1C1C] p-4 rounded-md">
                    <p className="text-gray-400 text-sm mb-1">END DATE</p>
                    <p className="text-[16px] md:text-[19px]">
                      {formatTimestampToDate(pred.endTimestamp)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatTimestampToTime(pred.endTimestamp)}
                    </p>
                  </div>
                </div>

                <button className="btn-gradient group hover:from-green hover:to-themeblue">
                  <span
                    onClick={() =>
                      router.push(`/prediction-details/${pred._id}`)
                    }
                    className={`btn-inner group-hover:bg-transparent text-[20px] ${statusColor}`}
                  >
                    {statusLabel}
                  </span>
                </button>
              </div>
            );
        } else {
          return (
            <div
              key={bet._id}
              className="text-white rounded-[20px] md:w-full w-[95%] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-3 md:p-5 mx-auto"
            >
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="h-[58px] w-[58px] border border-[#fff] shadow-[0px_0px_15px_0px_#8C8C8C] rounded-full overflow-hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${team1.image}`}
                    alt={team1.name}
                    className="w-full h-full"
                  />
                </div>
                <span className="text-[22px] font-regular">VS</span>
                <div className="bg-gray-800 rounded-full h-[58px] w-[58px] border border-[#fff] shadow-[0px_0px_15px_0px_#8C8C8C] overflow-hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${team2.image}`}
                    alt={team2.name}
                    className="w-full h-full"
                  />
                </div>
              </div>

              <div className="text-center mb-6">
                {/* ---Question--- */}
                <h2 className="text-[20px] md:text-[22px] font-semibold leading-tight h-[56px]">
                  {pred?.question}
                </h2>
              </div>

              <div className="flex justify-between gap-4 mb-8">
                <div className="flex-1 bg-[#1C1C1C] p-4 rounded-md">
                  <p className="text-gray-400 text-sm mb-1">START DATE</p>
                  <p className="text-[16px] md:text-[19px]">
                    {formatTimestampToDate(pred.startTimestamp)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatTimestampToTime(pred.startTimestamp)}
                  </p>
                </div>
                <div className="flex-1 bg-[#1C1C1C] p-4 rounded-md">
                  <p className="text-gray-400 text-sm mb-1">END DATE</p>
                  <p className="text-[16px] md:text-[19px]">
                    {formatTimestampToDate(pred.endTimestamp)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatTimestampToTime(pred.endTimestamp)}
                  </p>
                </div>
              </div>

              <button className="btn-gradient group hover:from-green hover:to-themeblue">
                <span
                onClick={() =>
                      router.push(`/prediction-details/${pred._id}`)
                    }
                  className={`btn-inner group-hover:bg-transparent text-[20px] ${statusColor}`}
                >
                  {statusLabel}
                </span>
              </button>
            </div>
          );
        }
      })}
    </div>
  );
}
