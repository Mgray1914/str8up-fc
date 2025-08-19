import Image from 'next/image'
import React, { useEffect } from 'react'
import Matchedwages from '../../components/Matchedwages'

function MatchedwagesModal({ isModalOpen, isCloseModal }) {
    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add("modal-active")
        } else {
            document.body.classList.remove("modal-active")
        }

        return () => {
            document.body.classList.remove("modal-active")
        }
    }, [isModalOpen])

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center  bg-black bg-opacity-50">
                    <div className="bg-[#090909]  rounded-[20px] max-w-[1000px] md:w-full w-[90%] px-[10px] md:px-[40px] py-[20px] md:py-[30px] border-2 border-white shadow-[0px_0px_58px_0px_#3d3b3cEB] relative">
                        <button
                            type="button"
                            onClick={() => isCloseModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 w-[40px] h-[40px]"
                        >
                            <img src="/images/cross.svg" alt="Close" width={100} height={100} />
                        </button>
                        <h3 className='text-white md:text-[40px] text-[28px]  font-gambetta font-semibold mb-5'>Matched Wagers</h3>
                        <div className='overflow-auto max-h-[60vh] modalScroll pr-[10px] md:pr-[30px]'>
                            {/* ---You can call common component of Openwagers--- */}
                            <Matchedwages showAll={true} />
                            {/* -------------- */}
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default MatchedwagesModal