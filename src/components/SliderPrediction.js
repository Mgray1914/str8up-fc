import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Manrope } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Hero from "../components/Hero";
import FAQSection from "../components/Faqs";
import "swiper/css";
import "swiper/css/navigation";
import Matchcard from "../components/Matchcard";
import { callApi } from "../services/apiServices";
import {
  formatTimestampToDate,
  formatTimestampToTime,
  isLocalTimePastUtcInput,
} from "../utlis/functions";
import { useRouter } from "next/router";
import { useGlobalStates } from "../contexts/WalletModalContext";
export default function SliderPrediction() {
  const [predictionList, setPredictionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // 👈 Track if more pages exist
  const [swiperRef, setSwiperRef] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const limit = 6;
  const router = useRouter();
  const { walletAddress } = useGlobalStates();

  useEffect(() => {
    fetchPrediction();
  }, []);

  const fetchPrediction = async (currentPage = 1) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await callApi({
        method: "get",
        url: "/users/predictions",
        params: {
          page: currentPage,
          limit,
        },
      });

      const newData = response?.data || [];
      if (newData.length < limit) {
        setHasMore(false); // No more data
      }

      setPredictionList((prev) => [...prev, ...newData]); // Append
      setPage(currentPage); // Update page
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const isLive = (start, end) => {
  if (!start || !end) return false;
  const now = new Date();
  const startTime = new Date(start);
  const endTime = new Date(end);
  const threeMinBeforeStart = new Date(startTime.getTime() - 3 * 60 * 1000);
  return now >= threeMinBeforeStart && now <= endTime;
};

  console.log("--------------Prediction list", predictionList);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    const currentIndex = swiper.activeIndex;
    const totalSlides = swiper.slides.length;

    // Trigger fetch when near end
    if (totalSlides - currentIndex <= 4 && hasMore && !loading) {
      fetchPrediction(page + 1);
    }
  };

  return (
    <section className="challenge pt-[80px] pb-[50px] bg-[#0D1010]">
      <div className="container mx-auto px-2">
        <div className="flex justify-between flex-col md:flex-row">
          <div>
            <h3 className="sectionHeading">Real-Time On-Chain Challenges</h3>
            <p className="text-xl text-subheading">
              All bets are live . Ready to predict?
            </p>
          </div>

          <div className="navigation relative flex md:block justify-between mt-5 md:mt-0">
            {/* Custom Navigation Buttons */}
            <button
              disabled={isBeginning}
              className={`custom-prev relative inline-flex items-center justify-center p-0.5 mb-2 me-3 overflow-hidden text-sm font-medium text-white rounded-[18px] group bg-gradient-to-br from-themeblue to-green group-hover:from-themeblue group-hover:to-green hover:text-white  focus:outline-none ${
                isBeginning ? "disabled-swipper-pagination-btn" : ""
              } `}
            >
              <span className="relative px-[8px] py-[16px] transition-all ease-in duration-75 bg-[#0D0D0D] rounded-[18px] group-hover:bg-transparent group-hover:dark:bg-transparent">
                <img src="/images/prev.svg" alt="" />
              </span>
            </button>

            <button
              disabled={isEnd && !hasMore}
              className={`custom-next relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-[18px] group bg-gradient-to-br from-themeblue to-green group-hover:from-themeblue group-hover:to-green hover:text-white  focus:outline-none ${
                isEnd && !hasMore ? "disabled-swipper-pagination-btn" : ""
              }`}
            >
              <span className="relative px-[8px] py-[16px] transition-all ease-in duration-75 bg-[#0D0D0D] rounded-[18px] group-hover:bg-transparent group-hover:dark:bg-transparent">
                <img src="/images/next.svg" alt="" />
              </span>
            </button>
          </div>
        </div>
        <div>
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            onSlideChange={handleSlideChange}
            // centeredSlides={true}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            loop={false}
            pagination={{
              clickable: true,
            }}
            modules={[Navigation, Pagination]}
            className="mySwiper md:mt-8 mt-3 !px-2 !py-3"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
                // centeredSlides: true,
              },
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
                // centeredSlides: true,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
                // centeredSlides: true,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
                // centeredSlides: true,
              },
            }}
          >
            {/* ---Loop */}
            {predictionList.map((item, index) => (
              <SwiperSlide
                key={item._id || index}
                className="transition-transform duration-500 ease-in-out mt-3"
              >
                <div className="text-white rounded-[20px] md:w-full w-[95%] shadow-[1px_-1px_4px_1px_#3d3c3ceb] p-5 mx-auto bg-[#090909]">
                  <div className="flex justify-center items-center gap-4 mb-6">
                    <div className="h-[58px] w-[58px] border border-[#fff] shadow-[0px_0px_15px_0px_#8C8C8C] rounded-full overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.team1?.image}`}
                        alt={item.team1?.name}
                        className="w-full h-full"
                      />
                    </div>
                    <span className="text-[22px] font-regular">VS</span>
                    <div className="rounded-full h-[58px] w-[58px] border border-[#fff] shadow-[0px_0px_15px_0px_#8C8C8C] overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.team2?.image}`}
                        alt={item.team2?.name}
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Match Status */}
                  <div className="text-center pb-5 pt-4">
                    <span
                      className={`${
                        item?.status?.toUpperCase() == "ACTIVE"
                          ? "open"
                          : "unmatched"
                      } text-white text-[15px] font-manrope text-capitalize font-bold`}
                    >
                      {item?.status?.toUpperCase() == "ACTIVE"
                        ? "OPEN"
                        : item?.status?.toUpperCase()}
                    </span>
                  </div>

                  {/* <span
                    className={`text-white text-[15px] font-manrope text-capitalize font-bold ${
                      item.status?.toLowerCase() === "open"
                        ? "open"
                        : item.status?.toLowerCase() === "unmatched"
                        ? "unmatched"
                        : ""
                    }`}
                  >
                    {item?.status}
                  </span> */}
                  {/* 
                  <span className={`${item.status=="OPEN" ? "open" : item.status ="COMPLETED" ? "unmatched" : ""} text-white text-[15px] font-manrope text-capitalize font-bold`}>
                      {item?.status}
                    </span> */}

                  {/* <div className="text-center pb-5 pt-4">
                  <span className="unmatched text-white text-[15px] font-manrope text-capitalize font-bold">
                    UNMATCHED
                    </span>
                </div> */}

                  {/* Question */}
                  <div className="text-center mb-6">
                    <h2 className="text-[22px] leading-tight line-clamp-1">
                      {item?.question}
                    </h2>
                  </div>

                  {/* Dates */}
                  <div className="flex justify-between gap-4 mb-8">
                    <div className="flex-1 bg-[#1C1C1C] p-4 rounded-md">
                      <p className="text-gray-400 text-sm mb-1">START DATE</p>
                      <p className="text-[19px]">
                        {formatTimestampToDate(item?.startTimestamp)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatTimestampToTime(item?.startTimestamp)}
                      </p>
                    </div>
                    <div className="flex-1 bg-[#1C1C1C] p-4 rounded-md">
                      <p className="text-gray-400 text-sm mb-1">END DATE</p>
                      <p className="text-[19px]">
                        {formatTimestampToDate(item?.endTimestamp)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatTimestampToTime(item?.endTimestamp)}
                      </p>
                    </div>
                  </div>

                  <button className="btn-gradient group hover:from-green hover:to-themeblue">
                    <span
                      className="btn-inner group-hover:bg-transparent group-hover:dark:bg-transparent"
                      onClick={() =>
                        walletAddress
                          ? router.push(`/prediction-details/${item._id}`)
                          : router.push(`/prediction`)
                      }
                    >
                      {isLocalTimePastUtcInput(item?.endTimestamp)
                        ? "View"
                        : isLive(item?.startTimestamp, item?.endTimestamp)
                        ? "Live"
                        : "Place a Wager"}
                    </span>
                  </button>

                 
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
