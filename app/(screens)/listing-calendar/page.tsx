"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { useBlockedDates } from "@/hooks/useBlockedDates";
import { useBookings } from "@/hooks/useBookings";
import { useListings } from "@/hooks/useListings";
import { IListing } from "@/types/IListing";
import { IBooking } from "@/types/IBooking";
import {
  ChevronLeft,
  Lock,
  Unlock,
  Calendar as CalendarIcon,
  Users,
  Mail,
  Phone,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format, parseISO, startOfDay, differenceInDays } from "date-fns";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#99582A]" />
    </div>
  );
}

export default function ListingCalendarPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ListingCalendarContent />
    </Suspense>
  );
}

function ListingCalendarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");
  const listingType = searchParams.get("type") as "apartment" | "attraction";

  const { listings, fetchListings } = useListings();
  const { blockedDates, loading: blockedLoading, fetchBlockedDates, blockDate, unblockDate } = useBlockedDates();
  const { listingBookings, loading: bookingsLoading, fetchBookingsByListing } = useBookings();

  const [listing, setListing] = useState<IListing | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [blockReason, setBlockReason] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (listingId && listingType) {
      fetchBlockedDates(listingId);
      fetchBookingsByListing(listingId);
      fetchListings({ category: listingType, page: 1, pageSize: 100 });
    }
  }, [listingId, listingType, fetchBlockedDates, fetchBookingsByListing, fetchListings]);

  useEffect(() => {
    if (listings.length > 0 && listingId) {
      const found = listings.find((l) => l.uid === listingId);
      if (found) setListing(found);
    }
  }, [listings, listingId]);

  const bookedDatesMap = useMemo(() => {
    const map = new Map<string, number>();
    listingBookings.forEach((booking) => {
      if (booking.status === "cancelled") return;
      const checkIn = startOfDay(parseISO(booking.check_in));
      const checkOut = startOfDay(parseISO(booking.check_out));
      let current = checkIn;
      while (current <= checkOut) {
        const key = format(current, "yyyy-MM-dd");
        map.set(key, (map.get(key) || 0) + 1);
        current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
      }
    });
    return map;
  }, [listingBookings]);

  const blockedDatesSet = useMemo(() => {
    return new Set(blockedDates.map((bd) => bd.blocked_date));
  }, [blockedDates]);

  const getDateStatus = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    const isBlocked = blockedDatesSet.has(key);
    const bookingCount = bookedDatesMap.get(key) || 0;

    if (isBlocked) return "blocked";
    if (listingType === "attraction") {
      if (bookingCount >= 2) return "fully-booked";
      if (bookingCount === 1) return "partially-booked";
    } else {
      if (bookingCount > 0) return "booked";
    }
    return "available";
  };

  const selectedDateStatus = selectedDate ? getDateStatus(selectedDate) : null;
  const selectedDateBlocked = selectedDate
    ? blockedDates.find((bd) => bd.blocked_date === format(selectedDate, "yyyy-MM-dd"))
    : null;
  const selectedDateBookings = selectedDate
    ? listingBookings.filter((b) => {
      if (b.status === "cancelled") return false;
      const checkIn = startOfDay(parseISO(b.check_in));
      const checkOut = startOfDay(parseISO(b.check_out));
      const selected = startOfDay(selectedDate);
      return selected >= checkIn && selected <= checkOut;
    })
    : [];

  const handleBlockDate = async () => {
    if (!selectedDate || !listingId) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    await blockDate(listingId, listingType, dateStr, blockReason || undefined);
    setBlockReason("");
  };

  const handleUnblockDate = async () => {
    if (!selectedDateBlocked) return;
    await unblockDate(selectedDateBlocked.uid);
  };

  const modifiers = useMemo(() => {
    const booked: Date[] = [];
    const partiallyBooked: Date[] = [];
    const blocked: Date[] = [];

    bookedDatesMap.forEach((count, key) => {
      const date = parseISO(key);
      if (!blockedDatesSet.has(key)) {
        if (listingType === "attraction") {
          if (count >= 2) booked.push(date);
          else if (count === 1) partiallyBooked.push(date);
        } else {
          if (count > 0) booked.push(date);
        }
      }
    });

    blockedDates.forEach((bd) => {
      blocked.push(parseISO(bd.blocked_date));
    });

    return { booked, partiallyBooked, blocked };
  }, [bookedDatesMap, blockedDates, blockedDatesSet, listingType]);

  const modifiersClassNames = {
    booked: "!bg-red-500 !text-white hover:!bg-red-600",
    partiallyBooked: "!bg-yellow-500 !text-white hover:!bg-yellow-600",
    blocked: "!bg-orange-500 !text-white hover:!bg-orange-600",
  };

  const loading = blockedLoading || bookingsLoading;

  const activeBookings = listingBookings.filter((b) => b.status !== "cancelled");
  const upcomingBookings = activeBookings.filter((b) => new Date(b.check_in) >= new Date());
  const pastBookings = activeBookings.filter((b) => new Date(b.check_out) < new Date());

  if (!listingId || !listingType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Invalid Request</h2>
          <p className="text-gray-600 mt-2">Missing listing ID or type</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-[#99582A] text-white rounded-lg hover:bg-[#7d4622]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {listing?.title || "Loading..."}
                </h1>
                <p className="text-sm text-gray-500 capitalize">
                  {listingType} • Booking Calendar
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#99582A]" />
              <span className="text-sm text-gray-600 hidden sm:inline">
                {format(new Date(), "MMMM yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading && !listing ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#99582A]" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#99582A]" />
                  Availability Calendar
                </h2>

                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={selectedMonth}
                    onMonthChange={setSelectedMonth}
                    modifiers={modifiers}
                    modifiersClassNames={modifiersClassNames}
                    numberOfMonths={1}
                    className="rounded-lg border-0 w-full max-w-md [--cell-size:3rem] sm:[--cell-size:3.5rem]"
                  />
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-red-500" />
                    <span className="text-gray-700">
                      {listingType === "attraction" ? "Fully Booked (2/2)" : "Booked"}
                    </span>
                  </div>
                  {listingType === "attraction" && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-yellow-500" />
                      <span className="text-gray-700">Partially (1/2)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-orange-500" />
                    <span className="text-gray-700">Blocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-white border border-gray-300" />
                    <span className="text-gray-700">Available</span>
                  </div>
                </div>
              </div>

              {selectedDate && (
                <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${selectedDateStatus === "blocked"
                          ? "bg-orange-100 text-orange-800"
                          : selectedDateStatus === "fully-booked" || selectedDateStatus === "booked"
                            ? "bg-red-100 text-red-800"
                            : selectedDateStatus === "partially-booked"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                    >
                      {selectedDateStatus === "blocked"
                        ? "Blocked by Admin"
                        : selectedDateStatus === "fully-booked"
                          ? "Fully Booked"
                          : selectedDateStatus === "booked"
                            ? "Booked"
                            : selectedDateStatus === "partially-booked"
                              ? "Partially Booked (1/2 slots)"
                              : "Available for Booking"}
                    </span>
                  </div>

                  {selectedDateBookings.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Bookings on this date ({selectedDateBookings.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedDateBookings.map((booking) => (
                          <div
                            key={booking.uid}
                            className="bg-gray-50 rounded-lg p-4 border"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {booking.first_name} {booking.last_name}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {format(parseISO(booking.check_in), "MMM d")} -{" "}
                                    {format(parseISO(booking.check_out), "MMM d")}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {booking.guests} guests
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-gray-800">
                                  ${booking.total_price}
                                </span>
                                <span
                                  className={`block text-xs px-2 py-1 rounded mt-1 ${booking.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDateBlocked && (
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mb-4">
                      <h3 className="text-sm font-medium text-orange-800 mb-1">Block Reason</h3>
                      <p className="text-orange-700">
                        {selectedDateBlocked.reason || "No reason provided"}
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    {!selectedDateBlocked ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Reason for blocking (optional)"
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99582A]"
                        />
                        <button
                          onClick={handleBlockDate}
                          disabled={loading}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 font-medium"
                        >
                          <Lock className="w-5 h-5" />
                          Block This Date
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleUnblockDate}
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition disabled:opacity-50 font-medium"
                      >
                        <Unlock className="w-5 h-5" />
                        Unblock This Date
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{activeBookings.length}</p>
                    <p className="text-sm text-blue-700">Total Bookings</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{upcomingBookings.length}</p>
                    <p className="text-sm text-green-700">Upcoming</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">{blockedDates.length}</p>
                    <p className="text-sm text-orange-700">Blocked Dates</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-600">{pastBookings.length}</p>
                    <p className="text-sm text-gray-700">Past Bookings</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Upcoming Bookings ({upcomingBookings.length})
                </h2>
                {upcomingBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming bookings</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {upcomingBookings.slice(0, 10).map((booking) => (
                      <BookingCard key={booking.uid} booking={booking} />
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Blocked Dates ({blockedDates.length})
                </h2>
                {blockedDates.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No blocked dates</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {blockedDates.map((bd) => (
                      <div
                        key={bd.uid}
                        className="flex items-center justify-between bg-orange-50 rounded-lg p-3 border border-orange-100"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {format(parseISO(bd.blocked_date), "MMM d, yyyy")}
                          </p>
                          {bd.reason && (
                            <p className="text-sm text-gray-500">{bd.reason}</p>
                          )}
                        </div>
                        <button
                          onClick={() => unblockDate(bd.uid)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition"
                          title="Unblock"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking }: { booking: IBooking }) {
  const nights = differenceInDays(parseISO(booking.check_out), parseISO(booking.check_in));

  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-gray-800">
            {booking.first_name} {booking.last_name}
          </p>
          <span
            className={`inline-block text-xs px-2 py-0.5 rounded mt-1 ${booking.status === "active"
                ? "bg-green-100 text-green-800"
                : booking.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
          >
            {booking.status}
          </span>
        </div>
        <p className="text-lg font-bold text-[#99582A]">${booking.total_price}</p>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {format(parseISO(booking.check_in), "MMM d")} - {format(parseISO(booking.check_out), "MMM d")}
          <span className="text-gray-400">({nights} {nights === 1 ? "night" : "nights"})</span>
        </p>
        <p className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          {booking.guests} guests
        </p>
        <p className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          {booking.email}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {booking.phone}
        </p>
      </div>
    </div>
  );
}
