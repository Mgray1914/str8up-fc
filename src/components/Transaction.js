import React, { useEffect, useState } from "react";
import Image from "next/image";
import {callApi} from "../services/apiServices"
import {copyToClipboard, formatDollarSTR8, formatFromWei} from "../utlis/functions"
import Pagination from 'rc-pagination';

const Transaction = () => {

  const [transactions, setTransactions] = useState();
 const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(5);
const [totalItems, setTotalItems] = useState(50);

  function formatUTCToLocal(utcString) {
  const date = new Date(utcString);

  const options = {
    month: 'short',    // "Jun"
    day: 'numeric',    // "6"
    year: 'numeric',   // "2025"
    hour: 'numeric',   // "11"
    minute: '2-digit', // "40"
    hour12: true       // "AM/PM"
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(date);

  // Extract parts for custom formatting
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  const year = parts.find(p => p.type === 'year').value;
  const hour = parts.find(p => p.type === 'hour').value;
  const minute = parts.find(p => p.type === 'minute').value;
  const dayPeriod = parts.find(p => p.type === 'dayPeriod').value;

  return `${month} ${day},${year} at ${hour}:${minute}${dayPeriod}`;
}

  const fetchTxs = async (page = 0) => {
    try {
      const response = await callApi({
        method: "get",
        url: `/users/transactions?page=${page}&limit=${itemsPerPage}`,
      });

      setTransactions(response.data?.transactions)
      setTotalItems(response.data.pagination?.total);
      setItemsPerPage(response.data?.pagination.limit);
      setCurrentPage(response.data?.pagination.page + 1);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchTxs()
  },[])

  const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
fetchTxs(pageNumber-1)
};
  return (
    <>
      <div className=" min-h-[50vh]">
        <div className="scrollbar-gradient-x rounded-[20px]   ">
          <table className="w-full list-table overflow-x-scroll">
            <thead className="bg-head px-[17px] py-[20px] text-white font-normal font-manrope text-[14px] text-left">
              <tr>
                <th className="px-[17px] py-[20px] whitespace-nowrap ">
                  Date & Time
                </th>
                <th className="px-[17px] py-[20px] whitespace-nowrap ">
                  Prediction Name
                </th>
                <th className="px-[17px] py-[20px] whitespace-nowrap ">
                  Selected Option
                </th>
                <th className="px-[17px] py-[20px] whitespace-nowrap ">
                  Transaction Hash
                </th>
                <th className="px-[17px] py-[20px] whitespace-nowrap ">
                  Amount
                </th>
                <th className="px-[17px] py-[20px] whitespace-nowrap ">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#0A0A0A]">
              {transactions?.length > 0 ? (
                transactions?.map((tx) => {
                  return (
                    <tr className="text-[12px] font-manrope font-normal">
                      <td className="px-[17px] py-[20px] ">
                        {formatUTCToLocal(tx?.createdAt)}
                      </td>
                      <td className="px-[17px] py-[20px] ">
                        <div className="line-clamp-2">
                          {tx?.prediction?.question}
                        </div>
                      </td>
                      <td className="px-[17px] py-[20px]">
                        {tx?.selected_option || "-"}
                      </td>
                      <td className="px-[17px] py-[20px]">
                        <div className="flex items-center gap-2">
                          <span className="w-[80%] truncate">{tx?.txHash}</span>
                          <a
                            onClick={() => {
                              copyToClipboard(tx?.txHash);
                            }}
                          >
                            <Image
                              src="/images/copy.svg"
                              alt="copy Logo"
                              width={16}
                              height={16}
                            />
                          </a>
                        </div>
                      </td>
                      <td className="px-[17px] py-[20px] whitespace-nowrap">
                        {formatDollarSTR8(formatFromWei(tx?.amount))}
                        {/* $50.00 STR8 */}
                      </td>
                      <td className="px-[17px] py-[20px] ">{tx?.wagerStatus || "-"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr className="h-[20vh]"><td colSpan={6} className="text-center">No Transaction Found</td></tr>
              )}
              
            </tbody>
          </table>
        </div>
      </div>

{ totalItems > itemsPerPage && transactions?.length > 0 &&(
  <div className="mt-6 flex justify-end pagination-cmp">
    <Pagination
      current={currentPage}
      total={totalItems}
      pageSize={itemsPerPage}
      onChange={handlePageChange}
      showTitle={false}
      pageBufferSize={2}
      showLessItems
    />
  </div>
)}

    </>
  );
};

export default Transaction;




{/* <tr className="text-[12px] font-manrope font-normal">
                <td className="px-[17px] py-[20px] ">Jun 6,2025 at 11:40AM</td>
                <td className="px-[17px] py-[20px] ">
                  <div className="line-clamp-2">
                    Will the total combined score in the Bengals vsWill the
                    total combined score in the Bengals vsWill the total
                    combined score in the Bengals vsWill the total combined
                    score in the Bengals vsWill the total combined score in the
                    Bengals vsWill the total combined score in the Bengals
                    vsWill the total combined score in the Bengals vs
                  </div>
                </td>
                <td className="px-[17px] py-[20px]">Bengals</td>
                <td className="px-[17px] py-[20px]">
                  <div className="flex items-center gap-2">
                    <span className="w-[80%] truncate">
                      0x5e2b4f1a6c37a8423b3cd4e894d5d2d6e3f6c92ab63460f3
                    </span>
                    <a href="#">
                      <Image
                        src="/images/copy.svg"
                        alt="copy Logo"
                        width={16}
                        height={16}
                      />
                    </a>
                  </div>
                </td>
                <td className="px-[17px] py-[20px] whitespace-nowrap">
                  $50.00 STR8
                </td>
                <td className="px-[17px] py-[20px] ">Win</td>
              </tr> */}


      {/* <nav aria-label="Page navigation example">
        <ul className=" -space-x-px text-sm flex justify-end pt-4">
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight  active:bg-white text-white bg-transparent  hover:bg-white hover:text-black hover:rounded-[8px] "
            >
              {" "}
              <svg
                className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>{" "}
              Prev{" "}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight active text-white bg-transparent  active:bg-white  hover:bg-white hover:text-black hover:rounded-[8px] "
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-white bg-transparent  active:bg-white hover:bg-white hover:text-black hover:rounded-[8px]"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-white bg-transparent  active:bg-white hover:bg-white hover:text-black hover:rounded-[8px]"
            >
              3
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-white bg-transparent  active:bg-white hover:bg-white hover:text-black hover:rounded-[8px] "
            >
              Next{" "}
              <svg
                className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav> */}