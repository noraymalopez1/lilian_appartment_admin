"use client";
import {
  ChevronRight,
  CirclePlus,
  EllipsisVertical,
  Funnel,
  Star,
} from "lucide-react";
import React from "react";
import { FaCircleChevronDown } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const reviewData = {
  avatar: "https://via.placeholder.com/40x40?text=PC", // Placeholder for avatar
  postedBy: "Paul Cooper",
  apartmentName: "Lillians apartment",
  reviewTitle: "This is so amazing apartment",
  rating: 4, // Out of 5 stars
  date: "20/10/2025",
  reviewText:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
};

const Reviews = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const totalPages = 3;
  const currentPage = 1;
  const entries = 10;

  // Array of page numbers to display
  const pages = [...Array(totalPages).keys()].map((i) => i + 1);

  // Base button classes for common styling
  const baseButtonClass =
    "px-4 py-2 border rounded-lg font-medium transition duration-150 ease-in-out shadow-sm";

  // Page number button classes
  const pageNumButtonClass =
    "w-10 h-10 flex items-center justify-center border rounded-lg text-sm font-medium transition";

  return (
    <div className="w-full md:w-4xl mx-auto pt-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Reviews</h2>
          <p className="flex items-center gap-2">
            <a href="/">Managment</a> <ChevronRight size={16} /> Reveiws{" "}
            <ChevronRight size={16} />
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="py-2 px-4 rounded border border-gray-300 flex items-center gap-2">
            Filter
            <span className="border border-[#99582A] rounded p-1">
              <Funnel size={20} />
            </span>
          </button>
        </div>
      </div>
      <div>
        <div className="relative mx-auto my-8 py-6 px-12 bg-white rounded-xl shadow-lg border border-gray-100">
          {/* Top section: Avatar, user info, stars, date, ellipsis */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              {/* Avatar */}
              <img
                src={reviewData.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-3 border border-gray-200"
              />
              <div>
                {/* Posted by and Apartment name */}
                <p className="text-sm text-gray-700">
                  Posted by{" "}
                  <span className="font-semibold text-gray-900">
                    {reviewData.postedBy}
                  </span>{" "}
                  on{" "}
                  <span className="font-semibold text-gray-900">
                    {reviewData.apartmentName}
                  </span>
                </p>
                {/* Review Title */}
                <h3 className="text-md font-bold text-gray-800 mt-1">
                  {reviewData.reviewTitle}
                </h3>
              </div>
            </div>

            <div className="flex flex-col items-end">
              {/* Star Rating */}
              <div className="flex mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < reviewData.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              {/* Date and Ellipsis Menu */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{reviewData.date}</span>
                <button
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <EllipsisVertical className="w-5 h-5 text-gray-500" />
                </button>
                {isOpen && (
                  <div className="absolute right-4 top-12 mt-2 w-32 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-400">
                      Delete
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-400">
                      Add
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Review Text */}
          <p className="text-base text-gray-700 leading-relaxed">
            {reviewData.reviewText}
          </p>
        </div>
      </div>

      {/* Bottom pagination etc */}
      <div className="flex justify-between items-center ">
        <div className="flex-grow flex justify-start items-center space-x-2">
          {/* --- Previous Button --- */}
          <button
            className={`${baseButtonClass} w-28 flex items-center justify-center 
                                      bg-gray-50 text-gray-700 border-gray-300 cursor-not-allowed opacity-50`}
            disabled // Statically disabled as per image
          >
            <IoIosArrowBack className="w-4 h-4 mr-1" />
            Previous
          </button>

          {/* --- Page Numbers --- */}
          <div className="flex space-x-1">
            {pages.map((page) => (
              <button
                key={page}
                className={`
                                      ${pageNumButtonClass} 
                                      ${
                                        page === currentPage
                                          ? "bg-green-100 text-green-700 border-green-500 ring-2 ring-green-500 ring-opacity-50"
                                          : "text-gray-700 hover:bg-gray-50 border-gray-300"
                                      }
                                  `}
              >
                {page}
              </button>
            ))}
          </div>

          {/* --- Next Button --- */}
          <button
            className={`${baseButtonClass} w-24 flex items-center justify-center  text-gray-700 hover:bg-gray-50 border-gray-300`}
          >
            Next
            <IoIosArrowForward className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* --- Show Entries Dropdown --- */}
        <div className="flex-shrink-0 flex items-center space-x-2 text-sm text-gray-700">
          <span>Show</span>
          <div className="relative">
            <div className="px-3 py-2 border border-gray-300 rounded-lg flex items-center cursor-pointer hover:border-gray-400 transition">
              <span>{entries} entries</span>
              <FaCircleChevronDown className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
