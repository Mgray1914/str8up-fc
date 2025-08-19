import toast from "react-hot-toast";
import { callApi } from "../services/apiServices";
import Transaction from "./Transaction";
import React, { useEffect, useState } from "react";
import BetsCard from "../common/BetsCard";
import Link from "next/link";
import { useGlobalStates } from "../contexts/WalletModalContext";
import Loader from "../common/Loader";

const Profile = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [savedImage, setSavedImage] = useState(null);
  const [activeBets, setActiveBets] = useState([]);
  const [completedBets, setCompletedBets] = useState([]);
  const { setUserProfile } = useGlobalStates();
  const [selectedTab, setSelectedTab] = useState("bets")
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false)


  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

  useEffect(() => {
    fetchProfile();
    fetchActiveBets("Active");
    fetchActiveBets("Completed");
  }, []);

  useEffect(() => {
  const nameChanged = name.trim() !== (existingProfile?.name?.trim() || "");
  const imageChanged = image !== null;
  setHasChanges(nameChanged || imageChanged);
}, [name, image, existingProfile]);


  const fetchProfile = async () => {
    // Simulate API fetch
    try {
      const response = await callApi({
        method: "get",
        url: "/users",
      });
      console.log("fetch Profile details", response);
      // setExistingProfile(response); // Assume response = { name, profile_image_url }
      // setName(response.data.user.name || "");
      // setImagePreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}${response.data.user.profile_image}` || null);
      // setSavedImage(`${process.env.NEXT_PUBLIC_IMAGE_URL}${response.data.user.profile_image}`)

      const user = response.data.user;
      setUserProfile(user);
      setExistingProfile(user);

      const hasName = user.name && user.name.trim().length > 0;
      const hasImage =
        user.profile_image && user.profile_image.trim().length > 0;

      setName(user.name || "");

      if (hasImage) {
        const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${user.profile_image}`;
        console.log("env url", process.env.NEXT_PUBLIC_IMAGE_URL)
        console.log("Image Url", imageUrl)
        setImagePreview(imageUrl);
        setSavedImage(imageUrl);
      } else {
        setImagePreview(null);
        setSavedImage(null);
      }

      // If profile is incomplete, auto-enable editing mode
      if (!hasName || !hasImage) {
        setIsEditing(true);
      }
    } catch (error) {
      console.log("fetch Profile error", error);
    }
  };

  const handleSave = async () => {
    let validationErrors = {};

    // Name validation
    if (!name.trim()) {
      validationErrors.name = "Name is required";
    }

    // Image validation
    if (image) {
      if (image.size > MAX_IMAGE_SIZE) {
        validationErrors.image = "Image must be less than 1MB";
      } else if (!ALLOWED_TYPES.includes(image.type)) {
        validationErrors.image = "Only JPG and PNG images are allowed";
      }
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Proceed with API call or other logic
      setLoading(true)
      try {
        const formData = new FormData();
        formData.append("name", name);
        if (image) {
          formData.append("profile_image", image);
        }

        const response = await callApi({
          method: "patch",
          url: "/users",
          data: formData,
        });
        if (response.status >= 200 && response.status <= 299) {
          console.log("profile updated", response);
          resetFields();
          setIsEditing(false);
          toast.success(response.message || "Profile Update Successfully");
          fetchProfile();
        }
      } catch (error) {
        console.log("Profile Create error", error);
      }finally{
        setLoading(false)
      }
    }
  };

  function resetFields() {
    setName("");
    setImage(null);
    setImagePreview(null);
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG and PNG images are allowed",
        }));
        setImage(null);
        setImagePreview(null);
      } else if (file?.size > MAX_IMAGE_SIZE) {
        setErrors((prev) => ({
          ...prev,
          image: "Image must be less than 1MB",
        }));
        setImage(null);
        setImagePreview(null);
      } else {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, image: null }));
        setSavedImage(null);
      }
    }
  };

  const fetchActiveBets = async (type = "Active") => {
    try {
      const response = await callApi({
        method: "get",
        url: "/users/bets",
        params: {
          betType: type,
        },
      });
      console.log("fetch active Details", response);
      if (type == "Active") {
        setActiveBets(response.data.bets || []);
      } else if (type == "Completed") {
        setCompletedBets(response.data.bets || []);
      }
    } catch (error) {
      console.log("fetch Profile error", error);
    }
  };
  return (
    <>
    {loading && <Loader/>}
    <div className="pt-[110px] bg-[#050505] min-h-screen pb-[80px]">
      <div className="container mx-auto px-3 md:px-2">
        <div className="flex justify-between items-center">
          <h3 className="sectionHeading">My Profile</h3>
          {/* {existingProfile && !isEditing ? (
            <a  onClick={() => {setIsEditing(true)
              setImagePreview(null)
            }} className="text-white text-[17px] cursor-pointer" >
            Edit
          </a>) :
          (<button
            className="w-[173px] h-[50px] border text-white  hover:bg-green-400 hover:text-white transition shadowcustome text-[20px] text-center font-semibold py-[10px] rounded-[19px]"
            onClick={handleSave}
          >
            Save
          </button>)} */}

          {!isEditing ? (
            <a
              onClick={() => {
                setIsEditing(true);
                if (savedImage) setImagePreview(null); // only clear preview if there's no saved image
              }}
              className="text-white text-[17px] cursor-pointer"
            >
              Edit
            </a>
          ) : (
            <button
              className="w-[173px] h-[50px] border text-white hover:bg-green-400 hover:text-white transition shadowcustome text-[20px] text-center font-semibold py-[10px] rounded-[19px]"
              onClick={handleSave}
              disabled={!hasChanges}
              style={{
                opacity: hasChanges ? 1 : 0.5,
                cursor: hasChanges ? "pointer" : "not-allowed",
              }}
            >
              Save
            </button>
          )}
        </div>
        <div className="md:flex flex md:gap-5 gap-3 pb-4 items-center md:mt-3 mt-6">
          <div className="md:w-[40%] w-full">
            <input
              type="text"
              id="amount"
              className={` bg-[#181818] ${
                isEditing
                  ? "border border-gray-300"
                  : "border border-[#2c2c2c] cursor-not-allowed opacity-60"
              } text-white  rounded-lg w-full h-[43px] font-normal text-[14px] p-2.5`}
              placeholder="Enter Name..."
              value={name}
              disabled={!isEditing}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          {/* ----Hide this div when image is uploded--- */}
          {imagePreview ? (
            <>
              <div className="uoloadedImage overflow-hidden rounded-full ms-2">
                <img
                  src={imagePreview || "/images/uploaded.svg"}
                  alt=""
                  className="w-[43px] h-[43px] object-cover"
                />
              </div>
              {!savedImage && (
                <button
                className="editImage currentDate h-[35px] w-[80px] rounded-lg text-white"
                  onClick={() => {
                    setImagePreview(null);
                    setImage(null);
                    setErrors((prev) => ({ ...prev, image: null }));
                  }}
                >
                  Edit
                </button>
              )}
            </>
          ) : (
            <div
              className={`relative bg-[#181818] ${
                isEditing
                  ? "border border-gray-300"
                  : "border border-[#2c2c2c] cursor-not-allowed opacity-60"
              } text-white rounded-lg md:w-[40%] w-full h-[43px] font-normal text-[14px] p-2.5`}
            >
              <span className="flex justify-between items-center">
                Upload Profile Image{" "}
                <img src="/images/upload.svg" alt="upload" />
              </span>
              <input
                type="file"
                id="amount"
                disabled={!isEditing}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageChange}
              />
              {errors.image && (
                <span className="text-red-500 ">{errors.image}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex  my-4">
          <ul
            className="flex flex-wrap text-sm font-medium text-center text-gray-500  md:w-[45%] w-full  rounded-[8px] border border-[#828282] "
            data-tabs-toggle="#default-styled-tab-content"
            data-tabs-active-classes="text-white-600 hover:text-white-600 dark:text-white-500 dark:hover:text-white-500 border-white-600 dark:border-white-500"
            data-tabs-inactive-classes="dark:border-transparent text-gray-500 hover:text-white dark:text-white border-gray-100 hover:border-white dark:border-white dark:hover:text-white"
            role="tablist"
          >
            <li className="w-1/2 " role="presentation">
              <button
                onClick={() => {
                  setSelectedTab("bets");
                }}
                // className="block px-4 py-3 w-full hover:text-white hover:bg-themeblue rounded-l-[8px] md:text-xl"
                className={`block px-4 py-3 w-full md:text-xl rounded-l-[8px] hover:text-white hover:bg-themeblue ${
                  selectedTab === "bets"
                    ? "bg-themeblue text-white "
                    : "text-gray-500"
                }`}
                id="profile-styled-tab"
                data-tabs-target="#styled-profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                My Bets
              </button>
            </li>
            <li className="w-1/2 " role="presentation">
              <button
                onClick={() => {
                  setSelectedTab("transaction");
                }}
                // className=" block px-4 py-3 w-full hover:text-white  hover:bg-themeblue rounded-r-[8px] md:text-xl"
                className={`block px-4 py-3 w-full md:text-xl rounded-r-[8px] hover:text-white hover:bg-themeblue ${
                  selectedTab === "transaction"
                    ? "bg-themeblue text-white "
                    : "text-gray-500"
                }`}
                id="dashboard-styled-tab"
                data-tabs-target="#styled-dashboard"
                type="button"
                role="tab"
                aria-controls="dashboard"
                aria-selected="false"
              >
                Transactions
              </button>
            </li>
          </ul>
        </div>
        <div id="default-styled-tab-content">
          {selectedTab == "bets" && (
            <div id="styled-profile">
              <div className="flex justify-between items-center pt-[30px]">
                <h3 className="sectionHeading">Active Bets</h3>
                <Link
                  href="/bets?type=Active"
                  className="text-white text-[17px]"
                >
                  Browse All
                </Link>
              </div>
              {/* ---Grid Cards-- */}
              <BetsCard data={activeBets} type="active" size={3} />
              <div className="flex justify-between items-center pt-[30px]">
                <h3 className="sectionHeading">Completed Bets</h3>
                <Link
                  href="/bets?type=Completed"
                  className="text-white text-[17px]"
                >
                  Browse All
                </Link>
              </div>
              {/* ---Grid Cards-- */}
              <BetsCard data={completedBets} type="completed" size={3} />
            </div>
          )}
          {selectedTab == "transaction" && (
            <div id="styled-dashboard">
              <Transaction />
            </div>
          )}
        </div>

        {/* pagination */}
      </div>
    </div>
    </>
  );
};

export default Profile;
