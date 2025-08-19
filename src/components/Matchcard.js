import React from 'react'
import {formatTimestampToDate, formatTimestampToTime, isLocalTimePastUtcInput, trimWithEllipsis} from "../utlis/functions"
import { useRouter } from 'next/router'

const Matchcard = ({data}) => {
    const router = useRouter()
  return (
      <div className=" text-white rounded-[20px] md:w-full w-[95%] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 mx-auto" onClick={()=>router.push(`/prediction-details/${data._id}`)}>
          <div className="flex justify-center items-center gap-4 mb-6">
              <div className=" h-[58px] w-[58px] border border-[#fff] shadow-[0px_0px_15px_0px_#8C8C8C] rounded-full overflow-hidden">
                  <img src={`${data?.team1?.image}`}
                   alt="Baltimore Ravens Logo" className="w-full h-full" />
              </div>
              <span className="text-[22px] font-regular">VS</span>
              <div className=" rounded-full h-[58px] w-[58px] border border-[#fff] shadow-[0px_0px_15px_0px_#8C8C8C] overflow-hidden">
                  <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.team2?.image}`}
                   alt="Atlanta Falcons Logo" className="w-full h-full" />
              </div>
          </div>

          <div className="text-center mb-6">
              <h2 className="text-[22px] font-semibold leading-tight">{trimWithEllipsis(data.question, 25)}</h2>
              {/* <p className="text-2xl font-bold">Atlanta</p> */}
          </div>

          <div className="flex justify-between gap-4 mb-8">
              <div className="flex-1 bg-[#1C1C1C] p-4 rounded-md">
                  <p className="text-gray-400 text-sm mb-1">START DATE</p>
                  <p className="text-[19px]">{formatTimestampToDate(data?.startTimestamp)}</p>
                  <p className="text-sm text-gray-400">{formatTimestampToTime(data?.startTimestamp)}</p>
              </div>
              <div className="flex-1 bg-[#1C1C1C] p-4 rounded-md">
                  <p className="text-gray-400 text-sm mb-1">END DATE</p>
                  <p className="text-[19px]">{formatTimestampToDate(data?.endTimestamp)}</p>
                  <p className="text-sm text-gray-400">{formatTimestampToTime(data?.endTimestamp)}</p>
              </div>
          </div>
         <button className="btn-gradient group hover:from-green hover:to-themeblue">
  <span className="btn-inner group-hover:bg-transparent group-hover:dark:bg-transparent" >
    {/* {isLocalTimePastUtcInput(data?.endTimestamp) ? "View" : "Place a Wager"} */}
        {(() => {
      const now = new Date();
      const startTime = new Date(data?.startTimestamp);
      const endTime = new Date(data?.endTimestamp);
      const threeMinBeforeStart = new Date(startTime.getTime() - 3 * 60 * 1000);

      if (now >= threeMinBeforeStart && now <= endTime) {
        return "Live";
      } else if (now > endTime) {
        return "View";
      } else {
        return "Place a Wager";
      }
    })()}
  </span>
</button>
      </div>
  )
}

export default Matchcard
