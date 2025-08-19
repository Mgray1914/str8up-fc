import Matchcard from "../components/Matchcard";
import React, { useEffect, useState } from "react";
import { callApi } from "../services/apiServices";
import Pagination from "rc-pagination";
import { format, addDays } from "date-fns";
import Loader from "../common/Loader";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useGlobalStates } from "../contexts/WalletModalContext";
import Modal from "../common/modals/Modal";
const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#0e0e0e",
    borderColor: state.isFocused ? "#ffffff" : "#555",
    boxShadow: "none",
    padding: "0px 10px",
    borderRadius: "8px",
    minWidth: "155px", // Add this line
    cursor: "pointer",
    "&:hover": {
      borderColor: "#aaa",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#aaa",
    fontSize: "13px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
    fontSize: "13px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#fff",
    paddingRight: "5px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#0e0e0e",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "8px",
    marginTop: "4px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#222"
      : state.isFocused
      ? "#333"
      : "#0e0e0e",
    color: "#fff",
    cursor: "pointer",
    padding: "10px",
  }),
};


const Prediction = () => {

  


     const [showloader, setShowloader] = useState(false);
  //   const [predictionList, setPredictionList] = useState([]);
  //   const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [predictionList, setPredictionList] = useState([]);
  const [loading, setLoading] = useState(false); // avoid initial load flicker
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // to track if more data exists
  const [showFirstLoader, setShowFirstLoader] = useState(false)
 const limit = 9
const [showDatePicker, setShowDatePicker] = useState(false);
const[categoryList, setCategoryList] = useState()
const [selectedCategory, setSelectedCategory] = useState("");

console.log("loading", loading)

useEffect(()=>{
  fetchCategories()
},[])

   const fetchCategories = async () => {
        try {
          const response = await callApi({
            method: "get",
            url: "/users/category",
          })
    
          if (Array.isArray(response.data?.categories)) {
            setCategoryList(response.data?.categories)
          }
          console.log("categories", response)
        } catch (error) {
          console.error("Failed to fetch categories", error)
        }
      }
  const fetchPrediction = async (date, currentPage = page, category = selectedCategory) => {
    setLoading(true);

    const params = {
      page: currentPage,
      limit: 9,
    };

    if (date) {
      const formattedDate = format(date, "d/M/yy");
      params.date = String(formattedDate);
    }
     
     if (category) {
    params.category = category;
  }
    try {
      const response = await callApi({
        method: "get",
        url: "/users/predictions",
        params,
      });

      if (response) {
        const newData = response.data || [];
        setPredictionList((prev) =>
          currentPage === 1 ? newData : [...prev, ...newData]
        );

        // Check if more data is available
        const totalItems = response.pagination?.total || 0;
        setHasMore(currentPage * limit < totalItems);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
   

  const handleViewMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPrediction(selectedDate, nextPage);
  };
  function onReset() {
    setSelectedDate(null);
    setPage(1);
    setHasMore(true);
    fetchPrediction(null, 1);
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setPage(1);
    setHasMore(true);
    fetchPrediction(date, 1);
  };

  useEffect(() => {
    (async ()=>{
      try {
        setShowFirstLoader(true)
        await fetchPrediction();
      } catch (error) {
        console.log(error)
      } finally{
        setShowFirstLoader(false)
      }
    })()
  }, []);

  const dateRange = Array.from({ length: 30 }, (_, i) =>
    addDays(new Date(), i)
  );
  const today = new Date();

  //   function onReset (){
  //     setSelectedDate(null)
  //     fetchPrediction(null, 1);
  //     setPage(1);
  //   }

  //   const handlePageChange = (pageNumber) => {
  //   setPage(pageNumber);
  //   fetchPrediction(selectedDate, pageNumber);
  // };

  // const handleDateSelect = (date) => {
  //   setSelectedDate(date);
  //   setPage(1); // reset to first page on new date
  //   fetchPrediction(date, 1);
  // };

  const categoryOptions = [
  { value: "", label: "All" },
  ...(categoryList || []).map((cat) => ({
    value: cat._id,
    label: cat.name,
  })),
];

const handleCategoryChange = (selectedOption) => {
  const categoryId = selectedOption.value;
  setSelectedCategory(categoryId);
  setPage(1);
  setHasMore(true);
  fetchPrediction(selectedDate, 1, categoryId);
};

  return (
    <>
    {(loading && !showFirstLoader) && <Loader />}


  {showFirstLoader ? <Loader /> : <div className="pt-[110px] bg-[#050505]">
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
      <section className="pt-5 pb-[60px]">
        <div className="container mx-auto px-2">
          <h3 className="sectionHeading p">Explore Predictions</h3>
          {/* --calender Row---- */}
          <div className="date flex gap-2 items-center justify-between  my-5">
           <div className="flex items-center gap-2">
                <span
                  className="cursor-ponter"
                  onClick={() => setShowDatePicker((prev) => !prev)}
                >
                  <img src="/images/calender.svg" alt="" />
                </span>
                {showDatePicker && (
                  <div className="absolute z-50 mt-2">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        handleDateSelect(date);
                        setShowDatePicker(false);
                      }}
                      open
                      customInput={<></>}
                      onClickOutside={() => setShowDatePicker(false)}
                      popperPlacement="bottom-start"
                    />
                  </div>
                )}
                <p className="text-white text-[20px] tracking-[1.406px]">
                  {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : format(new Date(), "MMMM dd, yyyy")}
                </p>
              </div>
              <div className="filers flex gap-3 items-center">
       <Select
  options={categoryOptions}
  value={categoryOptions.find((opt) => opt.value === selectedCategory)}
  onChange={handleCategoryChange}
  styles={customStyles}
  placeholder="Select Sports"
  isSearchable={false}
/>
                 
                {selectedDate && (
                  <button
                    onClick={onReset}
                    className="btn-gradient !w-fit !px-4 !text-sm m-0"
                  >
                    Reset
                  </button>
                )}
              </div>
          </div>
         
          {/* Date Strip */}
          <div className="clenderline mt-5 scrollbar-gradient-x flex gap-[20px] py-3 overflow-x-auto">
            {dateRange.map((date, idx) => {
              const isSelected =
                selectedDate &&
                format(date, "yyyy-MM-dd") ===
                  format(selectedDate, "yyyy-MM-dd");
              return (
                <div
                  key={idx}
                  onClick={() => handleDateSelect(date)}
                  className={`datebox text-center min-w-[53px] rounded-[5px] cursor-pointer border px-1
                    ${
                      isSelected
                        ? "currentDate"
                        : "hoverShadow border-transparent"
                    }`}
                >
                  <span className="text-[24px] text-[#FEFEFE]">
                    {format(date, "dd")}
                  </span>
                  <p className="text-[20px] text-primaryGrey">
                    {format(date, "EEE")}
                  </p>
                </div>
              );
            })}
          </div>

          { predictionList.length === 0 ? (
            <div className="text-center pt-16 opacity-70 ">
              <img
                src="/images/no-datafound.svg"
                alt=""
                className="w-[150px] mx-auto mb-3"
              />
              <span className="text-lg"></span>
            </div>
          ) : (
            ""
          )}

          <div className="cardsGrid grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 mt-10">
            {/* -----Loop From here---- */}

            {predictionList.length > 0
              ? predictionList.map((data, idx) => (
                  <Matchcard key={idx} data={data} />
                  
                ))
              : ""}
          </div>

          <div>
            {/* <Pagination
            className="pagination-cmp mt-3"
              current={page}
              pageSize={limit}
              total={total}
              onChange={handlePageChange}
              hideOnSinglePage={true}
            /> */}
            {hasMore && !loading && (
              <div className="text-center mt-6">
                <button
                  onClick={handleViewMore}
                  className="btn-gradient !px-6 !py-2 !w-fit"
                >
                  View More
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>}
   


   </> 
  );
};

export default Prediction;
