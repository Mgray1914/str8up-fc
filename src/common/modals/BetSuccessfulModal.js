import Image from 'next/image'
import React, { useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css';

function BetSuccessfulModal({isModalOpen, isCloseModal}) {
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
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50">
          <div className="bg-[#090909] rounded-[20px] max-w-[675px] md:w-full w-[90%] p-[30px] border-2 border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative" data-aos="zoom-out-left"  data-aos-duration="500">
            <div className="text-center">
              <div className="flex items-center w-[80px] h-[104px] mx-auto">
                <LazyLoadImage src="/images/bet.svg" alt="wallet Logo" width={80} height={104} effect="blur" />
              </div>
 
              <h3 className=" text-[30px]  text-white font-gambetta max-w-[365px] font-semibold mx-auto leading-normal ">
                Bet Placed Successfully!!! </h3>
                {/* <p className='text-[20px] font-extralight leading-[30px] mt-2'>Your bet is live and locked in. Good luck!</p> */}
                   <button className=" text-white rounded-[12px] bg-themeblue h-[40px] md:h-[50px] text-[20px] w-[173px] mt-[40px]" onClick={()=>isCloseModal(false)}>
                    Ok
                  </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BetSuccessfulModal
