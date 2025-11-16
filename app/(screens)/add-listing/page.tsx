import { ChevronRight } from "lucide-react";
import React from "react";

const AddListing = () => {
  return (
    <div className="w-3xl mx-auto pt-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Add Listing</h2>
        <p className="flex items-center gap-2">
          <a href="/">Managment</a> <ChevronRight size={16} /> Add Listing{" "}
          <ChevronRight size={16} />
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white py-4 px-20 mt-4">
        <h2 className="text-center text-3xl font-bold pt-4">
          Basic Information
        </h2>
        <form action="" className="mt-4 space-y-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="">Listing Title</label>
            <input
              type="text"
              placeholder="type a title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="">Listing Title</label>
              <input
                type="text"
                placeholder="type a title"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Listing Title</label>
              <input
                type="text"
                placeholder="type a title"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Listing Title</label>
            <textarea
              cols={10}
              rows={5}
              placeholder="type a title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
        </form>
      </div>

      {/* price */}
      <div className="rounded-2xl border border-gray-200 bg-white py-4 px-20 mt-4">
        <h2 className="text-center text-3xl font-bold pt-4">Price</h2>
        {/* Form Container */}
        <div className="space-y-6 mt-4">
          {/* First Row: Price and No of Days */}
          <div className="flex items-center space-x-4">
            <div className="grid grid-cols-2 gap-4 flex-grow">
              {/* Price Field 1 */}
              <div>
                <label
                  htmlFor="price1"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="price1"
                  placeholder="Enter Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* No of Days Field */}
              <div>
                <label
                  htmlFor="days"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No of Days
                </label>
                <div className="relative">
                  <select
                    id="days"
                    defaultValue="Select"
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white pr-8"
                  >
                    <option disabled>Select</option>
                    <option>1 Day</option>
                    <option>2 Days</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Plus Button 1 */}
            <button className="p-1 border border-gray-400 text-gray-600 rounded-full hover:bg-gray-50 focus:outline-none transition duration-150 ease-in-out">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>

          {/* Second Row: Price and Type of Person */}
          <div className="flex items-center space-x-4">
            <div className="grid grid-cols-2 gap-4 flex-grow">
              {/* Price Field 2 */}
              <div>
                <label
                  htmlFor="price2"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="price2"
                  placeholder="Enter Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Type of Person Field */}
              <div>
                <label
                  htmlFor="personType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type of Person
                </label>
                <div className="relative">
                  <select
                    id="personType"
                    defaultValue="Select"
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white pr-8"
                  >
                    <option disabled>Select</option>
                    <option>Adult</option>
                    <option>Child</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Plus Button 2 */}
            <button className="p-1 border border-gray-400 text-gray-600 rounded-full hover:bg-gray-50 focus:outline-none transition duration-150 ease-in-out">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* locations */}
      <div className="w-full bg-white p-6 sm:p-10 rounded-lg shadow-xl mt-4">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Locations
        </h1>

        {/* Form Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          {/* 1. Road or Street */}
          <div>
            <label
              htmlFor="roadOrStreet"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Road or Street
            </label>
            <input
              type="text"
              id="roadOrStreet"
              placeholder="e.g 12 San Pedro Street"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 2. City or state (Dropdown) */}
          <div>
            <label
              htmlFor="cityOrState"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City or state
            </label>
            <div className="relative">
              <select
                id="cityOrState"
                defaultValue="Select a City or State"
                className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white pr-10"
              >
                <option disabled>Select a City or State</option>
                <option>New York</option>
                <option>California</option>
              </select>
              {/* Custom Arrow for select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 3. Address (Dropdown with input style) */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <div className="relative">
              <input
                type="text"
                id="address"
                placeholder="e.g Bloom"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              {/* Down Arrow on the right, matching the image */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 4. Zip Code */}
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              placeholder="e.g ACBI258"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="w-full bg-white p-6 sm:p-10 rounded-lg shadow-xl mt-4">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Media and Attachment
        </h1>

        <div className="space-y-6">
          {/* 1. Upload Video Link */}
          <div>
            <label
              htmlFor="videoLink"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload video link
            </label>
            <input
              type="text"
              id="videoLink"
              placeholder="e.g you tube link"
              className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 2. Photos or Images Drop Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos or images
            </label>

            <div className="w-full p-16 border border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center space-y-4 shadow-inner min-h-[300px]">
              <p className="text-gray-600 text-lg">Drag and Drop images</p>
              <button
                type="button"
                className="px-6 py-3 text-white font-medium rounded-lg shadow-md transition duration-150"
                style={{ backgroundColor: "#A0522D", borderColor: "#A0522D" }}
              >
                Browse images
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-4 pb-8">
        {/* === SECTION 1: OVERVIEW (Dropdowns) === */}
        <div className="w-full bg-white p-6 sm:p-10 rounded-lg shadow-xl mt-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Overview
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {/* 1. Bathroom Dropdown */}
            <div>
              <label
                htmlFor="bathroom"
                className="block text-base font-medium text-gray-700 mb-1"
              >
                Bathroom
              </label>
              <div className="relative">
                <select
                  id="bathroom"
                  defaultValue="How many bathrooms?"
                  className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white pr-10"
                >
                  <option disabled>How many bathrooms?</option>
                  <option>1</option>
                  <option>2</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. Bedroom Dropdown */}
            <div>
              <label
                htmlFor="bedroom"
                className="block text-base font-medium text-gray-700 mb-1"
              >
                Bedroom
              </label>
              <div className="relative">
                <select
                  id="bedroom"
                  defaultValue="How many bedrooms?"
                  className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white pr-10"
                >
                  <option disabled>How many bedrooms?</option>
                  <option>1</option>
                  <option>2</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 3. Living Area Dropdown */}
            <div>
              <label
                htmlFor="livingArea"
                className="block text-base font-medium text-gray-700 mb-1"
              >
                Living Area
              </label>
              <div className="relative">
                <select
                  id="livingArea"
                  defaultValue="How many feet?"
                  className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white pr-10"
                >
                  <option disabled>How many feet?</option>
                  <option>500 sq ft</option>
                  <option>1000 sq ft</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 4. Garage or Parking Slot Dropdown */}
            <div>
              <label
                htmlFor="parking"
                className="block text-base font-medium text-gray-700 mb-1"
              >
                Garage or Parking Slot
              </label>
              <div className="relative">
                <select
                  id="parking"
                  defaultValue="Is parking available"
                  className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white pr-10"
                >
                  <option disabled>Is parking available</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === SECTION 2: FEATURES (Checkboxes) === */}
        <div className="w-full bg-white p-6 sm:p-10 rounded-lg shadow-xl mt-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-4">
            {[
              ["Pool", "Hot Tub", "Gym", "Bar"],
              [
                "Family Room",
                "Smoking Allowed",
                "Breakfast included",
                "Coffee Maker",
              ],
              [
                "Family Room",
                "Smoking Allowed",
                "Breakfast included",
                "Coffee Maker",
              ],
            ].map((column, colIndex) => (
              <div key={colIndex} className="space-y-3">
                {column.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <input
                      id={`feature-${colIndex}-${featureIndex}`}
                      name={`feature-${colIndex}-${featureIndex}`}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`feature-${colIndex}-${featureIndex}`}
                      className="ml-3 text-sm font-medium text-gray-700 select-none"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* === ACTION BUTTONS === */}
        <div className="flex justify-end pt-6 space-x-4 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-white font-medium rounded-lg shadow-md transition duration-150"
            style={{ backgroundColor: "#A0522D" }} // Custom color matching the image (Sienna/Brown)
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
