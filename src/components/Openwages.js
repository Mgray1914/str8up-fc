import React, { useContext, useEffect, useState } from "react";
import OpenWagerAcceptModal from "../common/modals/Confirmation";
import Confirmation from "../common/modals/Confirmation";
import PlaceWagerModal from "../common/modals/PlaceWagerModal";
import { callApi } from "../services/apiServices";
import { PredictionDetailContext } from "./PredictionDetails";
import { formatFromWei, getTokenInfo } from "../utlis/functions";
import { useGlobalStates } from "../contexts/WalletModalContext";
import toast from "react-hot-toast";

const Openwages = ({
  showAll,
  tokenSymbol,
  setCloseModal,
}) => {
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const [selectedOpneWagers, setSelectedOpenWagers] = useState();
  const [openPlaceWager, setOpenPlaceWager] = useState(false);
  const { walletAddress, userProfile } = useGlobalStates();
  const {
    openWagers,
    predictionDetail,
    setSelectedOption,
    selectedOption,
    setBetSuccessModal,
  } = useContext(PredictionDetailContext);
  const { isWalletModalOpen, setIsWalletModalOpen } = useGlobalStates();

  const handleClosePlaceWager = () => {
    setOpenPlaceWager(false);
    setSelectedOpenWagers(null);
  };

  const isLive = () => {
      if (!predictionDetail?.startTimestamp || !predictionDetail?.endTimestamp)
        return false;
      const now = new Date();
      const startTime = new Date(predictionDetail.startTimestamp);
      const endTime = new Date(predictionDetail.endTimestamp);
      const threeMinBeforeStart = new Date(startTime.getTime() - 3 * 60 * 1000);
      return now >= threeMinBeforeStart && now <= endTime;
    }

  return (
    <>
      {openWagers?.length == 0 ? (
        <div className="text-center max-w-[300px]">
          <img src="/images/nobets.svg" alt="no-bets" className="mx-auto" />
          <p className="text-sm text-center text-white tracking-[0.5px] mt-5">
            No one has placed a bet yet. Place your bet now and join the action.
          </p>
        </div>
      ) : (
        <>
          <div className=" text-white space-y-4 w-full mx-auto">
            {openWagers?.map((data, index) => {
              if (showAll) {
                return (
                  <div
                    key={data._id}
                    className="flex items-center justify-between border-b border-dashed border-gray-600 pb-4 last:border-none"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          data?.participant1.profile_image
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.participant1.profile_image}`
                            : "/images/no-profile-picture.svg"
                        }
                        alt="John"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-regular text-sm">
                          {data?.participant1.name || "User"}
                        </p>
                        <p className="font-regular text-xs">
                          Wager : {data?.option_participant_1}
                        </p>
                        <p className="text-themeblue text-xs">
                          {` + ${formatFromWei(
                            data?.bet_amount
                          )} ${tokenSymbol}`}
                        </p>
                      </div>
                    </div>
                    {(predictionDetail?.status == "ACTIVE" && !isLive()) &&  
                      data?.participant1?._id !== userProfile?._id && (
                        <button
                          className="bg-themeblue text-white text-xs px-4 py-2 rounded-lg hover:bg-themeblue-500 transition"
                          onClick={() => {
                            if (!walletAddress) {
                              setIsWalletModalOpen(true);
                              if(setCloseModal){
                            
                                setCloseModal(false)
                              }
                            } else {
                      
                              SetIsModalOpen(true);
                              setSelectedOpenWagers(data);
                            }
                          }}
                        >
                          Accept Now
                        </button>
                      )}
                  </div>
                );
              } else if (index <= 3)
                return (
                  <div
                    key={data._id}
                    className="flex items-center justify-between border-b border-dashed border-gray-600 pb-4 last:border-none"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          data?.participant1.profile_image
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.participant1.profile_image}`
                            : "/images/no-profile-picture.svg"
                        }
                        alt="John"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-regular text-sm">
                          {data?.participant1.name || "User"}
                        </p>
                        <p className="font-regular text-xs">
                          Wager : {data?.option_participant_1}
                        </p>
                        <p className="text-themeblue text-xs">
                          {` + ${formatFromWei(
                            data?.bet_amount
                          )} ${tokenSymbol}`}
                        </p>
                      </div>
                    </div>
                    {(predictionDetail.status == "ACTIVE" && !isLive()) &&
                      data?.participant1?._id !== userProfile?._id && (
                        <button
                          className="bg-themeblue text-white text-xs px-4 py-2 rounded-lg hover:bg-themeblue-500 transition"
                          onClick={() => {
                            if (!walletAddress) {
                              setIsWalletModalOpen(true);

                              return;
                            }
                            SetIsModalOpen(true);
                            setSelectedOpenWagers(data);
                          }}
                        >
                          Accept Now
                        </button>
                      )}
                  </div>
                );
            })}
            <Confirmation
              SetIsModalOpen={SetIsModalOpen}
              isModalOpen={isModalOpen}
              title={`Are you sure you want to accept ${
                selectedOpneWagers?.participant1?.name ?
                selectedOpneWagers?.participant1?.name + "'s" : "this"
              }  challenge ?`}
              image={"/images/betAccept.svg"}
              onClickYes={() => setOpenPlaceWager(true)}
            />
            <PlaceWagerModal
              isOpen={openPlaceWager}
              onClose={handleClosePlaceWager}
              selectedOpneWagers={selectedOpneWagers}
              predictionDetail={predictionDetail}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
              mode={"accept"}
              setBetSuccessModal={setBetSuccessModal}
              // fetchPredictionDetails={fetchPredictionDetails}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Openwages;
