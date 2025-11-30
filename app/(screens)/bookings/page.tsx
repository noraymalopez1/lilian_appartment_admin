"use client";
import { ChevronRight, CirclePlus, Funnel } from "lucide-react";
import React, { useState } from "react";

const BookingCard = ({ data }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Custom function to render the Status pills (Pending/Unpaid)
  const StatusPill = ({ status, bgColor, textColor }: any) => (
    <span
      className={`px-2 py-0.5 ml-2 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );

  return (
    <div className="relative flex bg-white p-4 rounded-xl shadow-lg border border-gray-100 mb-6">


    

      {/* 1. Image and Info Column */}
      <div className="flex flex-grow items-start space-x-4 pr-6">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          {/* Note: In a real app, replace this placeholder with an <img> tag */}
          <div className="w-full h-full bg-gray-300">
            {/* Placeholder for the image with palm trees and pool */}
          </div>
        </div>
    
        {/* Text Info */}
        <div className="flex flex-col text-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-1">
            {data.apartmentName}
            <StatusPill
              status="Pending"
              bgColor="bg-red-100"
              textColor="text-red-600"
            />
            <StatusPill
              status="Unpaid"
              bgColor="bg-yellow-100"
              textColor="text-yellow-600"
            />
          </h2>
          <p className="text-gray-600">
            <span className="font-medium">Address:</span> {data.address}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Phone:</span> {data.phone}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">GPS coordinates:</span> {data.gps}
          </p>
        </div>
      </div>

      {/* 2. Date/Stay Summary Columns */}
      <div className="flex items-center flex-shrink-0 text-sm">
        {/* Check-In */}
        <DateBlock
          title="Check-In"
          date={data.checkInDate}
          month={data.checkInMonth}
          time={data.checkInTime}
        />

        {/* Check-Out */}
        <DateBlock
          title="Check-Out"
          date={data.checkOutDate}
          month={data.checkOutMonth}
          time={data.checkOutTime}
        />

        {/* Stay Summary */}
        <div className="flex flex-col items-center border-l border-gray-200 px-4 py-2 text-center w-full">
          <p className="text-sm font-light text-gray-500 mb-1">Stay</p>
          <div className="flex items-center space-x-2">
            <p className="text-lg font-medium text-gray-700">Rooms</p>
            <p className="text-lg font-medium text-gray-700">Nights</p>
          </div>
          <h3 className="text-4xl font-bold text-gray-800 mt-1">
            {data.rooms} / {data.nights}
          </h3>
        </div>
      </div>

      {/* 3. Action Menu (Vertical Dots) */}
      <div className="relative flex flex-col justify-start items-center ml-4 mt-2">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition duration-150 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"></path>
          </svg>
        </button>

        {/* Dropdown Menu - Always shown in the image, but implemented as a dropdown for interactivity */}
        {isMenuOpen && (
          <div className="absolute -right-2 top-8 mt-2 w-32 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
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
  );
};

const Booking = () => {
  const sampleData = {
    apartmentName: "Apartment Name",
    address: "Marina, 19-21, Ciutat Vella, 08005 Barcelona, Spain",
    phone: "+38 540 979 5428",
    gps: "N 040° 50.963, E14° 15.348",
    checkInDate: "14",
    checkInMonth: "August",
    checkInTime: "14:00 - 21:00",
    checkOutDate: "19",
    checkOutMonth: "August",
    checkOutTime: "08:00 - 10:00",
    rooms: "15",
    nights: "5",
  };
  return (
    <div className="w-full mx-auto pt-6 border border-black">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Booking</h2>
          <p className="flex items-center gap-2">
            <a href="/">Managment</a> <ChevronRight size={16} /> Booking{" "}
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
      <div className="mt-4">
        <div className="max-w-6xl w-full mx-auto">
          {/* First Card */}
          <BookingCard data={sampleData} />
          {/* Second Card (duplicate for matching the image) */}
          <BookingCard data={sampleData} />
        </div>
      </div>
    </div>
  );
};

const DateBlock = ({ title, date, month, time }: any) => (
  <div className="flex flex-col items-center border-l border-gray-200 px-4 py-2 text-center w-full">
    <p className="text-sm font-light text-gray-500 mb-1">{title}</p>
    <h3 className="text-4xl font-bold text-gray-800">{date}</h3>
    <p className="text-lg font-medium text-gray-700">{month}</p>
    <div className="flex items-center text-sm font-normal text-gray-500 mt-2">
      <svg
        className="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      {time}
    </div>
  </div>
);

export default Booking;
