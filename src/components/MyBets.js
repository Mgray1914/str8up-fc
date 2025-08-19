import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { callApi } from "../services/apiServices";
import BetsCard from "../common/BetsCard";
import Pagination from "rc-pagination";

const MyBets = () => {
  const [activeBets, setActiveBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); 
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const { type = "Active" } = router.query;

  useEffect(() => {
    fetchActiveBets(type, currentPage-1 );
  }, [type, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchActiveBets = async (type, page = 0) => {
    try {
      const res = await callApi({
        method: "get",
        url: "/users/bets",
        params: {
          betType: type,
          page: page,
          limit: itemsPerPage,
        },
      });

      setActiveBets(res.data.bets || []);
      setTotalItems(res.data.pagination?.total || 0);
      setItemsPerPage(res.data.pagination?.limit || 6);
      setCurrentPage(res.data.pagination?.page + 1); // API is 0-indexed
    } catch (err) {
      console.log("Error fetching active bets:", err);
    }
  };


  return (
    <div className="pt-[110px] bg-[#050505]">
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
      <div className="container mx-auto px-2">
        <div className="pt-[30px] flex gap-4 items-center">
          <a onClick={() => router.back()} className="cursor-pointer">
            <img src="/images/back.svg" alt="Baltimore Ravens Logo" />
          </a>
          <h3 className="sectionHeading">{type} Bets</h3>
        </div>
        <div className="min-h-[60vh] pb-20">
          {/* ---Grid Cards-- */}
          <BetsCard data={activeBets} type="active" />
        </div>
        {/* pagination  */}
        {/* <nav aria-label="Page navigation example">
          <ul className=" -space-x-px text-sm flex justify-end pt-5 pb-4">
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

        {totalItems > itemsPerPage && (
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
      </div>
    </div>
  );
};

export default MyBets;
