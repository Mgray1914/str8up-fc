import Image from 'next/image'
import React, { useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function Confirmation({ SetIsModalOpen, isModalOpen, title = "Are you sure", image = "/images/bet.svg", onClickYes }) {
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-active")
    } else {
      document.body.classList.remove("modal-active")
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("modal-active")
    }
  }, [isModalOpen])
  return (
    <>

      {
        isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50">
            <div className="bg-[#090909] rounded-[20px] max-w-[675px] md:w-full w-[90%] p-[30px] border border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative" data-aos="zoom-out-left" data-aos-duration="500">
              <div className="text-center">
                <div className="flex items-center w-[80px] h-[104px] mx-auto">
                  <LazyLoadImage
                    src={image}
                    alt="wallet Logo"
                    width={80}
                    height={104}
                    effect="blur"
                  />
                </div>

                <h3 className=" text-[30px]  text-white font-gambetta max-w-[365px] font-extralight mx-auto leading-normal mb-[30px]">
                  {title}{" "}
                </h3>
                <div className="flex gap-3 justify-center">
                  <button className="px-4  border-2 rounded-[12px] border-white h-[50px] text-[20px] w-[173px] mt-3 hover:text-white hover:bg-themeblue" onClick={() => SetIsModalOpen(false)}>
                    No
                  </button>
                  <button className="px-4  font-semibold text-white rounded-[12px] bg-themeblue h-[50px] text-[20px] w-[173px] mt-3" onClick={() => {
                    onClickYes()
                    SetIsModalOpen(false)
                  }}>
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}


