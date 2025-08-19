import Image from "next/image";
import React, { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function StepsModal({
  isModalOpen,
  isCloseModal,
  stepOneloader,
  steptwoloader,
}) {
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-active");
    } else {
      document.body.classList.remove("modal-active");
    }

    return () => {
      document.body.classList.remove("modal-active");
    };
  }, [isModalOpen]);


  const loader = (
    <div
      class="w-7 h-7 rounded-full animate-spin
  border-y-4 border-solid border-green border-t-transparent shadow-md"
    ></div>
  );

  const stepCount = (num) => {
    return (
      <div className="w-7 h-7 flex items-center justify-center bg-gradient-to-r from-[#13A6D4] to-[#17C047] text-white rounded-full text-sm">
        {num}
      </div>
    );
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50">
          <div
            className="bg-[#090909] rounded-[20px] max-w-[400px] md:w-full w-[90%] p-[30px] border border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative"
            data-aos="zoom-out-left"
            data-aos-duration="500"
          >
            <button
              type="button"
              onClick={() => isCloseModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 w-[40px] h-[40px]"
            >
              <img
                src="/images/cross.svg"
                alt="Close"
                width={100}
                height={100}
                effect="blur"
              />
            </button>
            <h3 className="text-[30px] font-semibold mb-4 font-gambetta text-white">
              Follow Steps
            </h3>

            {/* Step 1 */}
            <div className="flex items-center space-x-3">
              {/* Count Here */}
              {stepOneloader === true && steptwoloader == null
                ? loader
                : stepCount(1)}
              {!stepOneloader && steptwoloader ? (
                <span className="text-sm text-white">Tokens Approved</span>
              ) : (
                <div>
                  <p className="text-sm font-medium text-white">Approve</p>
                  {stepOneloader && (
                    <p className="text-xs text-gray-400">STR8 Tokens</p>
                  )}
                </div>
              )}
            </div>
            <div className="h-[40px] w-[2px] border-l border-dashed border-green ml-3 my-3"></div>
            {/* Step 2 */}
            <div className="flex items-center space-x-3 mb-5">
              {/* Loader Here */}
              {/* -----When Loading Remove---- */}
              {stepOneloader === false && steptwoloader == true
                ? loader
                : stepCount(2)}
              {/* <div className="w-7 h-7 flex items-center justify-center bg-gradient-to-r from-[#13A6D4] to-[#17C047] text-white rounded-full text-sm">
                2
                </div> */}
              {stepOneloader && !steptwoloader ? (
                <span className="text-sm text-white">Bet</span>
              ) : (
                <div>
                  <p className="text-sm font-medium text-white">Bet</p>
                  <p className="text-xs text-gray-400">Placing Bet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StepsModal;
