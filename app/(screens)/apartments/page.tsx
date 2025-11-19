"use client";
import React from "react";
import { FaCircleChevronDown, FaLocationPin } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import {
  ChevronRight,
  CirclePlus,
  Delete,
  EllipsisVertical,
  Funnel,
  Trash2,
} from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ApartmentListing = () => {
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
  // Dummy data to match the image content
  const data = {
    name: "Attraction Name",
    location: "Barcelona, Spain",
    rating: 5.0,
    reviews: 160,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    tags: ["Museum", "Architecture", "Family-Friendly"],
    distance: "5km",
    priceFrom: "$40",
    priceNight: "$443/night",
  };

  return (
    <div className="w-full md:w-4xl mx-auto pt-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Apartment List</h2>
          <p className="flex items-center gap-2">
            <a href="/">Managment</a> <ChevronRight size={16} /> My Listing{" "}
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

          <button className="py-2 px-4 rounded border border-gray-300 text-white bg-[#99582A] flex items-center gap-2">
            Add Listing <CirclePlus size={20} />
          </button>
        </div>
      </div>

      {/* main cards */}
      <div className="mx-auto my-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="flex">
          {/* --- Left Section: Image and Slider Dots --- */}
          <div className="w-1/3 relative flex-shrink-0">
            {/* Placeholder for the image of boats on water */}
            <div
              className="h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://via.placeholder.com/350x200?text=Boats+on+Water)",
              }}
            >
              <div className="absolute inset-0 bg-black opacity-10"></div>{" "}
              {/* Optional: slight dark overlay for effect */}
            </div>
            {/* Slider Dots (Pagination) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {/* 5 dots, first is filled */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    i === 0 ? "bg-white" : "bg-gray-400 opacity-70"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* --- Right Section: Content and Details --- */}
          <div className="w-2/3 p-10 flex flex-col justify-between relative">
            <div className="flex justify-between items-start mb-2">
              {/* Title and Location */}
              <div>
                <h2 className="text-xl font-bold text-gray-800">{data.name}</h2>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FaLocationPin />
                  <span className="text-[#99582A]">{data.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-0.5 mb-1">
                {/* Display 5 FaStars */}
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              {/* Rating, Reviews, and Ellipsis */}
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2">
                  {/* Rating Badge */}
                  <div className="flex items-center">
                    <div className="mr-2">
                      <p className="text-sm font-semibold text-[#99582A] leading-none">
                        Excellent
                      </p>
                      <p className="text-xs text-gray-600 leading-none">
                        {data.reviews} reviews
                      </p>
                    </div>
                    <div className="text-xl font-medium text-[#99582A] bg-gray-100 rounded-lg p-2 text-center ">
                      {data.rating.toFixed(1)}
                    </div>
                  </div>
                  {/* Ellipsis Menu Icon */}
                  <button
                    className="absolute right-1.5 top-3 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <EllipsisVertical size={24} />
                  </button>
                  {isOpen && (
                    <div className="absolute right-4 top-12 mt-2 w-32 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Accept
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
              {data.description}
            </p>

            {/* Tags */}
            <div className="text-xs text-blue-600 mb-4">
              {data.tags.map((tag) => (
                <span key={tag} className="mr-3 font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Footer: Distance and Pricing */}
            <div className="flex justify-start items-end space-x-6 pt-2 border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Distance:</span>
                <span className="text-base font-semibold text-gray-800">
                  {data.distance}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">From:</span>
                <span className="text-base font-semibold text-gray-800">
                  {data.priceFrom}
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900 ml-auto">
                {data.priceNight}
              </span>
            </div>
          </div>
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

export default ApartmentListing;
