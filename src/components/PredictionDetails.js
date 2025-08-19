import Matchedwages from "@/components/Matchedwages";
import Openwages from "@/components/Openwages";
import React, { createContext, use, useEffect, useState } from "react";
import { callApi } from "../services/apiServices";
import {
  formatTimestampToDate,
  formatTimestampToTime,
  getTokenInfo,
  isLocalTimePastUtcInput,
  trimWithEllipsis,
} from "../utlis/functions";
import Loader from "../common/Loader";
import { useGlobalStates } from "../contexts/WalletModalContext";
import PlaceWagerModal from "../common/modals/PlaceWagerModal";
import Result from "../common/Result";
import { useRouter } from "next/router";
import BetSuccessfulModal from "../common/modals/BetSuccessfulModal";
import OpenwagerModal from "../common/modals/OpenwagerModal";
import MatchedwagesModal from "../common/modals/MatchwagesModal";
import { set } from "date-fns";
import WalletModal from "../common/modals/WalletModal";
import toast from "react-hot-toast";
import CountDownTimer from "../common/CountDownTimer";
import Betsview from "./Betsview";
import Cookies from 'js-cookie';
export const PredictionDetailContext = createContext();

const PredictionDetails = ({ predictionId }) => {
  const [predictionDetail, setPredictionDetail] = useState("");
  const [firstLoader, setFirstLoader] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const { walletAddress, setWalletAddress, userProfile } = useGlobalStates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [betCount, setBetCount] = useState(null);

  const [walletError, setWalletError] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [openWagers, setOpenWagers] = useState([]);
  const [matchedWagers, setMatchedWagers] = useState([]);
  const [myBetResult, setMyBetResult] = useState([]);
  const [betSuccessModal, setBetSuccessModal] = useState(false);
  const [openWagerModal, setOpenWagerModal] = useState(false);
  const [matchedWagerModal, setMatchedWagerModal] = useState(false);
  const { isWalletModalOpen, setIsWalletModalOpen } = useGlobalStates();
  const [tokenSymbol, setTokenSymbol] = useState("STR8");
  const [betsResultData, setBetsResultData] = useState([]);

  const token = Cookies.get("token")

  const getTokenSymbol = async () => {
    try {
      const symbol = (await getTokenInfo()).symbol;
      setTokenSymbol(symbol);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTokenSymbol();
  }, []);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        setFirstLoader(true);
        if (predictionId) {
          const predictions = await fetchPredictionDetails(predictionId);
          setSelectedOption(predictions.option1);
        }
      } catch (error) {
      } finally {
        setFirstLoader(false);
      }
    })();
  }, [predictionId, userProfile, walletAddress]);

  useEffect(() => {
    (async () => {
      try {
        setisLoading(true);
        if (walletAddress && predictionDetail?.result_txHash && token) {
          await fetchBetsResult(predictionId);
        }
      } catch (error) {
      } finally {
        setisLoading(false);
      }
    })();
  }, [predictionDetail, walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      setWalletError(false);
    }
  }, [walletAddress]);

  const fetchPredictionDetails = async (id) => {
    try {
      setisLoading(true);
      const response = await callApi({
        method: "get",
        url: `/users/predictions/${predictionId}`,
      });
      setPredictionDetail(response?.data?.prediction);
      setBetCount(response?.data?.my_total_bets);
      setOpenWagers(response?.data?.open_wagers);
      setMatchedWagers(response?.data?.matched_wagers);
      setMyBetResult(response?.data?.my_bet_results);
      return response.data.prediction;
    } catch (error) {
      console.log("PredictionDetail error", error);
    } finally {
      setisLoading(false);
    }
  };
  const isLive = () => {
    if (!predictionDetail?.startTimestamp || !predictionDetail?.endTimestamp)
      return false;
    const now = new Date();
    const startTime = new Date(predictionDetail.startTimestamp);
    const endTime = new Date(predictionDetail.endTimestamp);
    const threeMinBeforeStart = new Date(startTime.getTime() - 3 * 60 * 1000);
    return now >= threeMinBeforeStart && now <= endTime;
  };

  const handlePlaceWager = () => {
    if (isLive()) {
      toast.error("Prediction is live cannot place bet", { id: "place-bet" });
      return;
    }
    if (!walletAddress) {
      setIsWalletModalOpen(true);
      setWalletError(true);
    } else {
      if (isLocalTimePastUtcInput(predictionDetail?.endTimestamp)) {
        toast.error("Bet has Ended", { id: "bet-ended-toast" });
        return;
      }
      setWalletError(false);
      setIsModalOpen(true);
    }
  };

  const fetchBetsResult = async () => {
    try {
      setisLoading(true);
      const response = await callApi({
        method: "get",
        url: `/users/predictions/${predictionId}/wagers`,
      });

      // console.log("fetchResults", response)
      setBetsResultData(response.data);
    } catch (error) {
      console.log("fetch bet Result error", error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <PredictionDetailContext.Provider
      value={{
        matchedWagers,
        openWagers,
        fetchPredictionDetails,
        predictionDetail,
        setSelectedOption,
        selectedOption,
        setBetSuccessModal,
      }}
    >
      {firstLoader ? (
        <Loader />
      ) : (
        <div className="pt-[110px] bg-[#050505]">
          {isLoading && <Loader />}
          <section className="bg-commonbg bg-cover bg-no-repeat h-[255px] items-center flex bg-center">
            <div className="container mx-auto px-2">
              <h2 className="text-white md:text-[40px] text-[32px] text-center font-gambetta font-semibold">
                Where Every Second Counts –{" "}
              </h2>
              <h3 className="text-themeblue md:text-[50px] text-[40px] text-center font-gambetta font-bold">
                Live 1v1 Battles
              </h3>
            </div>
          </section>

          <section className="py-[40px] md:py-[60px]">
            <div className="container mx-auto px-3 md:px-2">
              <div className="flex mb-10 items-center">
                <a href="#" className=" inline-block">
                  <img
                    src="/images/back.svg"
                    alt="Baltimore Ravens Logo"
                    onClick={() => router.back()}
                  />
                </a>
                  {predictionDetail?.result_txHash && <p className="text-center text-white text-[30px] mx-auto bg-gradient-to-r from-themeblue to-green px-6 py-2 rounded-[18px]">
                    Result : {" "}
                    <span className="teamName font-bold">{predictionDetail?.winningOption}</span>
                  </p>}
              </div>
              <div className="p-3 md:p-[40px] bg-[#090909] text-white rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] md:max-w-[1000px] w-[95%] md:w-[100%] mx-auto relative">
                {/* ---This is for Declared bet--- */}
                {predictionDetail?.result_txHash ? (
                  <img
                    src="/images/betdeclared.svg"
                    alt="endedBet"
                    className="md:w-[133px] w-[77px] h-[142px] absolute right-[-15px] top-[-50px] animate-pulse"
                  />
                ) : (
                  isLocalTimePastUtcInput(predictionDetail?.endTimestamp) && (
                    <img
                      src="/images/betended.svg"
                      alt="endedBet"
                      className="md:w-[133px] w-[77px] h-[142px] absolute right-[-15px] top-[-50px] animate-pulse"
                    />
                  )
                )}

                <div className="md:block flex justify-between">
                  {/* -----Match Category----- */}
                  <span className="md:text-[17px] text-[13px] rounded-[26px] px-4 py-2 border border-white md:absolute static top-[40px] left-[40px] md:flex mb-3">
                    {predictionDetail?.category?.name || "User"}
                  </span>
                  {/* ---Timer--- */}
                  {predictionDetail?.startTimestamp &&
                    predictionDetail?.endTimestamp && (
                      <CountDownTimer
                        startTimestamp={predictionDetail?.startTimestamp}
                        endTimestamp={predictionDetail?.endTimestamp}
                      />
                    )}
                </div>
                <div className="flex justify-center items-center gap-4 mb-6">
                  <div className="text-center space-y-4">
                    <div className="bg-gray-800 rounded-full h-[60px] md:h-[92px] w-[60px] md:w-[92px] border border-[#fff] shadow-[0px_0px_15px_0px_#8C8C8C] overflow-hidden mx-auto">
                      <img
                        src={
                          predictionDetail?.team1?.image
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${predictionDetail?.team1?.image}`
                            : "/images/cowboys.svg"
                        }
                        alt="Baltimore Ravens Logo"
                        className="w-full h-full"
                      />
                    </div>
                    <p
                      title={predictionDetail?.team1?.name}
                      className="line-clamp-1 max-w-[190px]"
                    >
                      {predictionDetail?.team1?.name || "-"}
                    </p>
                  </div>

                  <span className="text-[22px] font-regular">VS</span>
                  <div className="text-center space-y-4">
                    <div className="bg-gray-800 rounded-full h-[60px] md:h-[92px] w-[60px] md:w-[92px] border border-[#fff] shadow-[0px_0px_15px_0px_#8C8C8C] overflow-hidden mx-auto">
                      <img
                        src={
                          predictionDetail?.team2?.image
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${predictionDetail?.team2?.image}`
                            : "/images/eagles.svg"
                        }
                        alt="Atlanta Falcons Logo"
                        className="w-full h-full"
                      />
                    </div>
                    <p
                      title={predictionDetail?.team2?.name}
                      className="line-clamp-1 max-w-[190px]"
                    >
                      {predictionDetail?.team2?.name || "-"}
                    </p>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-[22px] md:text-[35px] leading-tight text-center font-normal max-w-[700px] mx-auto mb-[10px]">
                    {predictionDetail?.question}
                  </h2>
                  <p className="text-[18px] md:text-[20px] text-[#828282] text-center">
                    Location: {predictionDetail?.location || "N/A"}
                  </p>
                </div>

                {/* ---Teams Selection--- */}
                <div className="flex justify-center max-w-[615px] mx-auto mb-6">
                  <ul className="flex flex-wrap text-sm md:text-xl  font-medium text-center text-gray-500 w-full rounded-[8px] border border-[#828282] overflow-hidden">
                    <li
                      className="w-1/2"
                      onClick={() =>
                        setSelectedOption(predictionDetail?.option1)
                      }
                    >
                      <a
                        className={`block px-3 md:px-4 py-3 md:py-3 hover:text-white hover:bg-themeblue rounded-l-[8px] ${
                          selectedOption == predictionDetail?.option1
                            ? "text-white bg-themeblue "
                            : ""
                        }`}
                      >
                        {predictionDetail?.option1}
                      </a>
                    </li>
                    <li
                      className="w-1/2"
                      onClick={() =>
                        setSelectedOption(predictionDetail?.option2)
                      }
                    >
                      <a
                        className={`block px-3 md:px-4 py-3 md:py-3 hover:text-white hover:bg-themeblue rounded-r-[8px]  ${
                          selectedOption == predictionDetail?.option2
                            ? "text-white bg-themeblue "
                            : ""
                        }`}
                      >
                        {" "}
                        {predictionDetail?.option2}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-between gap-4 mb-8 max-w-[580px] mx-auto">
                  <div className="flex-1 bg-[#1C1C1C] p-4 rounded-md">
                    <p className="text-gray-400 text-sm mb-1">START DATE</p>
                    <p className="text-[19px]">
                      {formatTimestampToDate(predictionDetail?.startTimestamp)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatTimestampToTime(predictionDetail?.startTimestamp)}
                    </p>
                  </div>
                  <div className="flex-1 bg-[#1C1C1C] p-4 rounded-md">
                    <p className="text-gray-400 text-sm mb-1">END DATE</p>
                    <p className="text-[19px]">
                      {formatTimestampToDate(predictionDetail?.endTimestamp)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatTimestampToTime(predictionDetail?.endTimestamp)}
                    </p>
                  </div>
                </div>
                {/* {!isLocalTimePastUtcInput(predictionDetail?.endTimestamp) ? (
                  <div className="text-center">
                    <button
                      className={`max-w-[436px] commom-btn w-full ${
                        !selectedOption ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!selectedOption}
                      onClick={handlePlaceWager}
                    >
                      Place a Wager
                    </button> */}
                {/* ---connect mssg alert-- */}
                {/* {walletError && (
                      <div
                        className="text-[#FF0000] text-sm bg-[#FFD9D9E3] rounded-lg flex items-center mt-[30px] max-w-[520px] mx-auto justify-center h-[40px] gap-2 font-medium
"
                      >
                        {" "}
                        <img src="/images/alert.svg" alt="alert" />
                        <span>
                          To place a wager, please connect your{" "}
                          <a onClick={() => setIsWalletModalOpen(true)}>
                            <i className="underline cursor-pointer">wallet</i>{" "}
                          </a>{" "}
                          first.
                        </span>
                      </div>
                    )} */}
                {/* </div>
                ) : (
                  <div className="text-center">Bet Ended</div>
                )} */}

                {isLocalTimePastUtcInput(predictionDetail?.endTimestamp) ? (
                  <div className="text-center text-lg font-semibold text-red-500"></div>
                ) : isLive() ? (
                  <div className="text-center">
                    <button
                      className="max-w-[436px] commom-btn w-full cursor-not-allowed"
                      disabled
                    >
                      Live
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      className={`max-w-[436px] commom-btn w-full ${
                        !selectedOption ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!selectedOption}
                      onClick={handlePlaceWager}
                    >
                      Place a Wager
                    </button>
                  </div>
                )}
              </div>
              {predictionDetail?.result_txHash == null ? (
                <>
                  {/* -----matches lists--- */}
                  <div className="matchGrid grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-7">
                    {/* ---Open Wagers--- */}
                    <div className="openWagers">
                      <div className="flex justify-between">
                        <h6 className="text-white text-[20px] font-manrope font-normal">
                          Open Wagers
                        </h6>
                        <a
                          className={`grey cursor-pointer ${
                            openWagers.length === 0
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                          onClick={() => {
                            if (openWagers.length > 0) {
                              setOpenWagerModal(true);
                            }
                          }}
                        >
                          {openWagers?.length > 4 && "View all"}
                        </a>
                      </div>
                      <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-[25px] mt-6 md:h-[410px] h-auto justify-center flex items-center">
                        <Openwages
                          setSelectedOption={setSelectedOption}
                          selectedOption={selectedOption}
                          setBetSuccessModal={setBetSuccessModal}
                          fetchPredictionDetails={fetchPredictionDetails}
                          predictionId={predictionId}
                          tokenSymbol={tokenSymbol}
                        />
                      </div>
                    </div>
                    {/* ---Matched Wagers--- */}
                    <div className="matchedWagers">
                      <div className="flex justify-between">
                        <h6 className="text-white text-[20px] font-manrope font-normal">
                          Matched Wagers
                        </h6>
                        <a
                          className={`grey cursor-pointer ${
                            matchedWagers.length === 0
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                          onClick={() => {
                            if (matchedWagers?.length > 0) {
                              setMatchedWagerModal(true);
                            }
                          }}
                        >
                          {matchedWagers?.length > 0 && "View all"}
                        </a>
                      </div>
                      <div className="rounded-[20px] shadow-[1px_-1px_4px_1px_#3d3c3ceb] md:p-[25px] p-[10px] mt-6 md:h-[410px] h-auto  justify-center flex items-center">
                        <Matchedwages matchedWagers={matchedWagers} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* ----Result----- */}
                  {/* {myBetResult?.map((result, index)=>{
                return ( */}
                  {walletAddress && <>
                    {betCount < 2 ? (
                      // <>
                      //   <Result data={myBetResult[0]} />
                      // </>

                      myBetResult && myBetResult.length > 0 ? (
                        <Result data={myBetResult[0]} />
                      ) : (
                        <p>  </p>
                      )
                    ) : (
                      <>
                        {/* ----Bets List View--- */}
                        <Betsview data={betsResultData} />
                      </>
                    )}
                  </>}

                  {/* )
              })} */}
                </>
              )}
            </div>
          </section>
          {/* -----Place A Wager Modal---- */}
          <PlaceWagerModal
            isOpen={isModalOpen}
            onClose={setIsModalOpen}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            predictionDetail={predictionDetail}
            setBetSuccessModal={setBetSuccessModal}
            mode={"new"}
            fetchPredictionDetails={fetchPredictionDetails}
          />
        </div>
      )}
      <BetSuccessfulModal
        isModalOpen={betSuccessModal}
        isCloseModal={setBetSuccessModal}
      />

      <OpenwagerModal
        onClose={() => setOpenWagerModal(false)}
        isModalOpen={openWagerModal}
        isCloseModal={setOpenWagerModal}
        setIsModalOpen={setOpenWagerModal}
        tokenSymbol={tokenSymbol}
      />

      <MatchedwagesModal
        onclose={() => setMatchedWagerModal(false)}
        isModalOpen={matchedWagerModal}
        isCloseModal={setMatchedWagerModal}
        setIsModalOpen={setMatchedWagerModal}
      />
    </PredictionDetailContext.Provider>
  );
};

export default PredictionDetails;
