"use client";
import { ChevronRight, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  useBookings,
  BookingsFilter,
  BookingsSort,
} from "@/hooks/useBookings";
import {
  useTaxiBookings,
  TaxiBookingsFilter,
  TaxiBookingsSort,
} from "@/hooks/useTaxiBookings";
import { IBooking } from "@/types/IBooking";
import { ITaxiBooking } from "@/types/ITaxiBooking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TaxiBookingCard from "@/components/common/TaxiBookingCard";

interface BookingCardProps {
  data: IBooking;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const BookingCard = ({ data, onStatusChange, onDelete }: BookingCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div className="absolute right-0 top-8 mt-2 w-40 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
            {data.status === "pending" && (
              <>
                <button
                  onClick={() => {
                    onStatusChange(data.uid, "confirmed");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    onStatusChange(data.uid, "cancelled");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </>
            )}
            {data.status === "confirmed" && (
              <button
                onClick={() => {
                  onStatusChange(data.uid, "completed");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
              >
                Mark Completed
              </button>
            )}
            {(data.status === "confirmed" || data.status === "pending") && (
              <button
                onClick={() => {
                  onStatusChange(data.uid, "cancelled");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Cancel Booking
              </button>
            )}
            <button
              onClick={() => {
                onDelete(data.uid);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
            >
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
  const {
    bookings,
    loading,
    error,
    totalCount,
    fetchBookings,
    updateBooking,
    deleteBooking,
  } = useBookings();
  const {
    taxiBookings,
    loading: taxiLoading,
    error: taxiError,
    totalCount: taxiTotalCount,
    fetchTaxiBookings,
    updateTaxiBookingStatus,
    deleteTaxiBooking,
  } = useTaxiBookings();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [listingType, setListingType] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<BookingsSort>({
    field: "created_at",
    order: "desc",
  });

  const isTaxiFilter = listingType === "taxi";
  const isAllTypes = listingType === "all";

  useEffect(() => {
    if (isTaxiFilter) {
      const taxiFilters: TaxiBookingsFilter = {};
      if (statusFilter !== "all") {
        taxiFilters.status = statusFilter as TaxiBookingsFilter["status"];
      }
      const taxiSort: TaxiBookingsSort = {
        field: sortBy.field === "total_price" ? "price" : (sortBy.field as TaxiBookingsSort["field"]),
        order: sortBy.order,
      };
      fetchTaxiBookings(page, limit, taxiFilters, taxiSort);
    } else {
      const bookingFilters: BookingsFilter = {};
      if (listingType !== "all") {
        bookingFilters.listing_type = listingType;
      }
      if (statusFilter !== "all") {
        bookingFilters.status = statusFilter as BookingsFilter["status"];
      }
      fetchBookings(page, limit, bookingFilters, sortBy);
    }

    if (isAllTypes) {
      const taxiFilters: TaxiBookingsFilter = {};
      if (statusFilter !== "all") {
        taxiFilters.status = statusFilter as TaxiBookingsFilter["status"];
      }
      const taxiSort: TaxiBookingsSort = {
        field: sortBy.field === "total_price" ? "price" : (sortBy.field as TaxiBookingsSort["field"]),
        order: sortBy.order,
      };
      fetchTaxiBookings(page, limit, taxiFilters, taxiSort);
    }
  }, [fetchBookings, fetchTaxiBookings, page, limit, statusFilter, sortBy, listingType, isTaxiFilter, isAllTypes]);

  const currentTotalCount = isAllTypes ? totalCount + taxiTotalCount : isTaxiFilter ? taxiTotalCount : totalCount;
  const totalPages = Math.ceil(currentTotalCount / limit);
  const isLoading = isTaxiFilter ? taxiLoading : loading;
  const currentError = isTaxiFilter ? taxiError : error;

  const handleListingTypeChange = (value: string) => {
    setListingType(value);
    setStatusFilter("all");
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-") as [
      "created_at" | "total_price",
      "asc" | "desc"
    ];
    setSortBy({ field, order });
    setPage(1);
  };

  const handleBookingStatusChange = async (id: string, status: string) => {
    await updateBooking(id, { status });
  };

  const handleBookingDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      await deleteBooking(id);
    }
  };

  const handleTaxiStatusChange = async (id: string, status: ITaxiBooking["status"]) => {
    await updateTaxiBookingStatus(id, status);
  };

  const handleTaxiDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this taxi booking?")) {
      await deleteTaxiBooking(id);
    }
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
            value={listingType}
            onValueChange={handleListingTypeChange}
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

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {isTaxiFilter ? (
                <>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select
            value={`${sortBy.field}-${sortBy.order}`}
            onValueChange={handleSortChange}
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
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <div className="max-w-6xl w-full mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : currentError ? (
            <div className="text-center text-red-500 py-10">Error: {currentError}</div>
          ) : isTaxiFilter ? (
            taxiBookings.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No taxi bookings found.
              </div>
            ) : (
              taxiBookings.map((booking) => (
                <TaxiBookingCard
                  key={booking.uid}
                  data={booking}
                  onStatusChange={handleTaxiStatusChange}
                  onDelete={handleTaxiDelete}
                />
              ))
            )
          ) : isAllTypes ? (
            bookings.length === 0 && taxiBookings.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No bookings found.
              </div>
            ) : (
              <>
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.uid}
                    data={booking}
                    onStatusChange={handleBookingStatusChange}
                    onDelete={handleBookingDelete}
                  />
                ))}
                {taxiBookings.map((booking) => (
                  <TaxiBookingCard
                    key={booking.uid}
                    data={booking}
                    onStatusChange={handleTaxiStatusChange}
                    onDelete={handleTaxiDelete}
                  />
                ))}
              </>
            )
          ) : bookings.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No bookings found.
            </div>
          ) : (
            bookings.map((booking) => (
              <BookingCard
                key={booking.uid}
                data={booking}
                onStatusChange={handleBookingStatusChange}
                onDelete={handleBookingDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && currentTotalCount > 0 && (
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
            disabled={page === totalPages || totalPages === 0}
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
