import React, { useState } from "react";
import MyBetResultCard from "../common/MyBetResultCard";

const Betsview = ({ data }) => {
  const wonWagers = data.wagers_won || [];
  const lostWagers = data.wagers_lost || [];
  const unmatchedWagers = data.unmatched_wagers || [];

  const INITIAL_COUNT = 3;
  const [visibleWinners, setVisibleWinners] = useState(INITIAL_COUNT);
  const [visibleLosers, setVisibleLosers] = useState(INITIAL_COUNT);
  const [visibleUnmatched, setVisibleUnmatched] = useState(INITIAL_COUNT);

    const toggleVisibility = (type, total, setFn, currentCount) => {
    if (currentCount >= total) {
      setFn(INITIAL_COUNT);
    } else {
      setFn(currentCount + INITIAL_COUNT);
    }
  };

  return (
    <>
      <div className="container mx-auto mt-[34px] px-3 md:px-2">
        {/* ---Win Matches--- */}
        {wonWagers.length > 0 && (
          <>
            <div className="winMatches" data-aos="fade-up">
              <h4 className="font-gambetta text-[24px] text-white">
                Win match{" "}
              </h4>
              <div className="grid mt-[20px] mb-[30px] gap-3">
                {/* ---Match Row--- */}

                     {wonWagers.slice(0, visibleWinners).map((won, index) => (
              <MyBetResultCard key={index} type="winner" data={won} />
            ))}
              </div>
              {/* ---View More--- */}
            { wonWagers.length > INITIAL_COUNT && (
            <div className="flex justify-end">
              <button
                onClick={() => 
                  // setVisibleWinners(visibleWinners + 3)
                  toggleVisibility("winner", wonWagers.length, setVisibleWinners, visibleWinners)

                }
                className="text-white text-[17px]"
              >
                {visibleWinners >= wonWagers.length ? "View Less" : "View More"}
              </button>
            </div>
          )}
            </div>
          </>
        )}

        {/* ---Loss Matches--- */}
        {lostWagers.length > 0 && (
          <>
            <div className="LossMatch" data-aos="fade-up">
              <h4 className="font-gambetta text-[24px] text-white">
                Loss match{" "}
              </h4>
              <div className="grid mt-[20px] mb-[30px] gap-3">
                {/* {lostWagers?.map((loss, index) => {
                  return <MyBetResultCard type="loser" data={loss} />;
                })} */}

                {lostWagers.slice(0, visibleLosers).map((loss, index) => (
              <MyBetResultCard key={index} type="loser" data={loss} />
            ))}
              </div>
              {/* ---View More--- */}
            { lostWagers.length > INITIAL_COUNT &&(
            <div className="flex justify-end">
              <button
                onClick={()=>
                  // () => setVisibleLosers(visibleLosers + 3)
                   toggleVisibility("loser", lostWagers.length, setVisibleLosers, visibleLosers)
                }
                className="text-white text-[17px]"
              >
               {visibleLosers >= lostWagers.length ? "View Less" : "View More"}
              </button>
            </div>
          )}
            </div>
          </>
        )}

        {/* ---No Match Found--- */}

        {unmatchedWagers.length > 0 && (
          <>
            <div className="noMatch" data-aos="fade-up">
              <h4 className="font-gambetta text-[24px] text-white">
                No match found{" "}
              </h4>
              <div className="grid mt-[20px] mb-[30px] gap-3">
                {/* {unmatchedWagers?.map((noMatch, index) => {
                  return <MyBetResultCard type="no_match" data={noMatch} />;
                })} */}
                 {unmatchedWagers.slice(0, visibleUnmatched).map((noMatch, index) => (
              <MyBetResultCard key={index} type="no_match" data={noMatch} />
            ))}
              </div>
              {/* ---View More--- */}
               {  unmatchedWagers.length > INITIAL_COUNT && (
            <div className="flex justify-end">
              <button
                onClick={()=>
                  // () => setVisibleUnmatched(visibleUnmatched + 3)
                   toggleVisibility("no_match", unmatchedWagers.length, setVisibleUnmatched, visibleUnmatched)
                }
                className="text-white text-[17px]"
              >
                {visibleUnmatched >= unmatchedWagers.length ? "View Less" : "View More"}
              </button>
            </div>
          )}
            </div>
          </>
        )}

        {/* ---Waiting for match --- */}
        {/* <div className='waitFormatch' data-aos="fade-up">
                    <h4 className='font-gambetta text-[24px] text-white'>Waiting for match </h4>
                    <div className='grid mt-[20px] mb-[30px] gap-3'>
                        <div className="bg-[#090909] rounded-[12px] flex flex-col md:flex-row  items-center justify-between px-4 py-2 border border-themeblue shadow-[1px_-1px_4px_1px_#3d3c3ceb]">
                            <div className="flex items-center">
                                <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
                                    <img src="/images/myimg.svg" alt="Adrian's Profile" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex items-center ms-3">
                                    <span className="text-white text-[18px]">Adrian</span>
                                </div>
                                <span className="text-white text-sm mx-2 md:w-[180px] w-[40px] text-center">VS</span>
                                <span className="text-themeblue md:text-[20px] text-[16px] ms-3">Wait for match</span>
                            </div>
                            <button className="text-white font-medium px-[20px] md:py-[10px] py-[5px] rounded-[18px] border border-[#17C047] relative z-10 shadow-[1px_-1px_4px_1px_#13A6D4] text-[16px]">
                                Bet Amount: 50.00
                            </button>
                        </div>
                    </div>
                     <div className='flex justify-end'>
                    <a href="#" className='text-white text-[17px]'>View More</a>
                    </div>
                </div> */}
      </div>
    </>
  );
};

export default Betsview;

{
  /* <div className="bg-[#090909] rounded-[12px] flex flex-col md:flex-row items-center justify-between px-4 py-2 border border-black shadow-[1px_-1px_4px_1px_#3d3c3ceb]">
     <div className="flex items-center">
         <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
             <img src="/images/myimg.svg" alt="Adrian's Profile" className="w-full h-full object-cover" />
         </div>
         <div className="flex items-center ms-3">
             <span className="text-white text-[18px]">Adrian</span>
             <span className="text-yellow-500 text-xs ml-1"><img src="/images/smallstar.svg" alt="star" /></span>
         </div>
         <span className="text-white text-sm mx-2 md:w-[180px] w-[40px] text-center">VS</span>
         <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
             <img src="/images/myimg.svg" alt="Adrian's Profile" className="w-full h-full object-cover" />
         </div>
         <span className="text-white text-[18px] ms-3">Alex</span>
     </div>
     <button className="text-white font-medium px-[20px] md:py-[10px] py-[5px] rounded-[18px] border border-[#17C047] relative z-10 shadow-[1px_-1px_4px_1px_#13A6D4] text-[16px]">
         Bet Amount: 50.00
     </button>
 </div> */
}

{
  /* losssssss   */
}

{
  /* <div className="bg-[#090909] rounded-[12px] flex flex-col md:flex-row  items-center justify-between px-4 py-2 border border-black shadow-[1px_-1px_4px_1px_#3d3c3ceb]">
  <div className="flex items-center">
      <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
          <img src="/images/myimg.svg" alt="Adrian's Profile" className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center ms-3">
          <span className="text-white text-[18px]">Adrian</span>
          <span className="ml-1"><img src="/images/lossstart.svg" alt="star" /></span>
      </div>
      <span className="text-white text-sm mx-2 md:w-[180px] w-[40px] text-center">VS</span>
      <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
          <img src="/images/myimg.svg" alt="Adrian's Profile" className="w-full h-full object-cover" />
      </div>
      <span className="text-white text-[18px] ms-3">Alex</span>
  </div>
  <button className="text-white font-medium px-[20px] md:py-[10px] py-[5px] rounded-[18px] border border-[#17C047] relative z-10 shadow-[1px_-1px_4px_1px_#13A6D4] text-[16px]">
      Bet Amount: 50.00
  </button>
</div> */
}

{
  /* ---No Match--- */
}
{
  /* <div className="bg-[#090909] rounded-[12px] flex flex-col md:flex-row items-center justify-between px-4 py-2 border border-[#FF0000] shadow-[1px_-1px_4px_1px_#3d3c3ceb]">
    <div className="flex items-center">
        <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
            <img src="/images/myimg.svg" alt="Adrian's Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center ms-3">
            <span className="text-white text-[18px]">Adrian</span>
        </div>
        <span className="text-white text-sm mx-2 md:w-[180px] w-[40px] text-center">VS</span>
        <span className="text-[#FF0000] md:text-[20px] text-[16px] ms-3">No one has joined yet</span>
    </div>
    <button className="text-white font-medium px-[20px] md:py-[10px] py-[5px] rounded-[18px] border border-[#17C047] relative z-10 shadow-[1px_-1px_4px_1px_#13A6D4] text-[16px]">
        Bet Amount: 50.00
    </button>
</div> */
}
