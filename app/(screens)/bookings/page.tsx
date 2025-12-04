"use client";
import { ChevronRight, CirclePlus, Funnel, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  useBookings,
  BookingsFilter,
  BookingsSort,
} from "@/hooks/useBookings";
import { IBooking } from "@/types/IBooking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const BookingCard = ({ data }: { data: IBooking }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Custom function to render the Status pills
  const StatusPill = ({ status }: { status: string }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-600";

    switch (status) {
      case "pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-600";
        break;
      case "confirmed":
        bgColor = "bg-green-100";
        textColor = "text-green-600";
        break;
      case "cancelled":
        bgColor = "bg-red-100";
        textColor = "text-red-600";
        break;
      case "completed":
        bgColor = "bg-blue-100";
        textColor = "text-blue-600";
        break;
    }

    return (
      <span
        className={`px-2 py-0.5 ml-2 text-xs font-semibold rounded-full capitalize ${bgColor} ${textColor}`}
      >
        {status}
      </span>
    );
  };

  const checkInDate = new Date(data.check_in);
  const checkOutDate = new Date(data.check_out);

  const formatDate = (date: Date) => date.getDate();
  const formatMonth = (date: Date) =>
    date.toLocaleString("default", { month: "long" });
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="relative flex flex-col md:flex-row bg-white p-4 rounded-xl shadow-lg border border-gray-100 mb-6">
      {/* 1. Image and Info Column */}
      <div className="flex flex-grow items-start space-x-4 pr-6 mb-4 md:mb-0">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
          {/* Placeholder for image */}
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        </div>

        {/* Text Info */}
        <div className="flex flex-col text-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-1">
            {data.first_name} {data.last_name}
            <StatusPill status={data.status} />
          </h2>
          <p className="text-gray-600">
            <span className="font-medium">Type:</span>{" "}
            <span className="capitalize">{data.listing_type}</span>
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {data.email}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Phone:</span> {data.phone}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Total Price:</span> $
            {data.total_price}
          </p>
        </div>
      </div>

      {/* 2. Date/Stay Summary Columns */}
      <div className="flex items-center flex-shrink-0 text-sm w-full md:w-auto justify-between md:justify-start">
        {/* Check-In */}
        <DateBlock
          title="Check-In"
          date={formatDate(checkInDate)}
          month={formatMonth(checkInDate)}
          time={formatTime(checkInDate)}
        />

        {/* Check-Out */}
        <DateBlock
          title="Check-Out"
          date={formatDate(checkOutDate)}
          month={formatMonth(checkOutDate)}
          time={formatTime(checkOutDate)}
        />

        {/* Stay Summary */}
        <div className="flex flex-col items-center border-l border-gray-200 px-4 py-2 text-center w-full md:w-auto">
          <p className="text-sm font-light text-gray-500 mb-1">Stay</p>
          <div className="flex items-center space-x-2">
            <p className="text-lg font-medium text-gray-700">Guests</p>
            <p className="text-lg font-medium text-gray-700">Nights</p>
          </div>
          <h3 className="text-4xl font-bold text-gray-800 mt-1">
            {data.guests} / {data.nights}
          </h3>
        </div>
      </div>

      {/* 3. Action Menu (Vertical Dots) */}
      <div className="relative flex flex-col justify-start items-center ml-4 mt-2 hidden md:flex">
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

        {isMenuOpen && (
          <div className="absolute right-0 top-8 mt-2 w-32 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Edit
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DateBlock = ({
  title,
  date,
  month,
  time,
}: {
  title: string;
  date: number;
  month: string;
  time: string;
}) => (
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

const Booking = () => {
  const { bookings, loading, error, totalCount, fetchBookings } = useBookings();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState<BookingsFilter>({
    status: "all",
  });
  const [sortBy, setSortBy] = useState<BookingsSort>({
    field: "created_at",
    order: "desc",
  });

  useEffect(() => {
    fetchBookings(page, limit, filters, sortBy);
  }, [fetchBookings, page, limit, filters, sortBy]);

  const totalPages = Math.ceil(totalCount / limit);

  const handleFilterChange = (key: keyof BookingsFilter, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? undefined : value }));
    setPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-") as [
      "created_at" | "total_price",
      "asc" | "desc"
    ];
    setSortBy({ field, order });
    setPage(1);
  };

  return (
    <div className="w-full mx-auto pt-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Booking</h2>
          <p className="flex items-center gap-2 text-gray-500">
            <a href="/" className="hover:underline">
              Management
            </a>{" "}
            <ChevronRight size={16} /> Booking <ChevronRight size={16} />
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Listing Type Filter */}
          <Select
            onValueChange={(val) => handleFilterChange("listing_type", val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Listing Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="attraction">Attraction</SelectItem>
              <SelectItem value="taxi">Taxi</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter (Active/Expired) */}
          <Select
            onValueChange={(val) => handleFilterChange("status", val)}
            defaultValue="all"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select
            onValueChange={handleSortChange}
            defaultValue="created_at-desc"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest First</SelectItem>
              <SelectItem value="created_at-asc">Oldest First</SelectItem>
              <SelectItem value="total_price-desc">Price: High to Low</SelectItem>
              <SelectItem value="total_price-asc">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-[#99582A] text-white flex items-center gap-2">
            Add Booking <CirclePlus size={20} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <div className="max-w-6xl w-full mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">Error: {error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No bookings found.
            </div>
          ) : (
            bookings.map((booking) => (
              <BookingCard key={booking.uid} data={booking} />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalCount > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6 mb-10">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Booking;
