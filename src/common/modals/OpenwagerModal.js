import Image from "next/image";
import React, { useEffect } from "react";
import Openwages from "../../components/Openwages";

function OpenwagerModal({ isModalOpen, isCloseModal, tokenSymbol }) {
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }

    // Clean up on unmount (just in case)
    return () => {
      document.body.classList.remove("active-modal");
    };
  }, [isModalOpen]);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50">
          <div
            className="bg-[#090909]  rounded-[20px] max-w-[1000px] md:w-full w-[90%] px-[20px] md:px-[40px] py-[20px] md:py-[30px] border border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative"
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
            <h3 className="text-white md:text-[40px] text-[28px]  font-gambetta font-semibold mb-5">
              Open Wagers
            </h3>
            <div className="overflow-auto max-h-[60vh] modalScroll pr-[20px] md:pr-[30px]">
              {/* ---You can call common component of Openwagers--- */}
              <Openwages
                showAll={true}
                tokenSymbol={tokenSymbol}
                setCloseModal={isCloseModal}
              />
              {/* -------------- */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OpenwagerModal;
