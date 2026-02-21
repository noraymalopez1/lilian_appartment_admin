"use client";
import { ITaxiBooking, taxiPrices } from "@/types/ITaxiBooking";
import {
  Car,
  Clock,
  MapPin,
  Plane,
  Phone,
  Mail,
  Luggage,
  User,
} from "lucide-react";
import { useState } from "react";

interface TaxiBookingCardProps {
  data: ITaxiBooking;
  onStatusChange?: (id: string, status: ITaxiBooking["status"]) => void;
  onDelete?: (id: string) => void;
}

const TaxiBookingCard = ({
  data,
  onStatusChange,
  onDelete,
}: TaxiBookingCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const StatusPill = ({ status }: { status: string }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-600";

    switch (status) {
      case "pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-600";
        break;
      case "completed":
        bgColor = "bg-green-100";
        textColor = "text-green-600";
        break;
      case "cancelled":
        bgColor = "bg-red-100";
        textColor = "text-red-600";
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

  const getCarTypeLabel = (carType: ITaxiBooking["car_type"]) => {
    const labels: Record<ITaxiBooking["car_type"], string> = {
      standard_sedan: "Standard Sedan",
      premium_sedan: "Premium Sedan",
      suv: "SUV",
      mini_bus: "Mini Bus",
    };
    return labels[carType];
  };

  const getCarTypeIcon = (carType: ITaxiBooking["car_type"]) => {
    return <Car className="w-5 h-5" />;
  };

  return (
    <div className="relative flex flex-col bg-white p-5 rounded-xl shadow-lg border border-gray-100 mb-6">
      {/* Header with name and status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#FFF0EE] flex items-center justify-center mr-3">
            <Car className="w-6 h-6 text-[#781F19]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              {data.first_name} {data.last_name}
              <StatusPill status={data.status} />
            </h2>
            <p className="text-sm text-gray-500 capitalize">
              {data.booking_type} • {getCarTypeLabel(data.car_type)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#781F19]">€{data.price}</p>
          <p className="text-xs text-gray-500">Taxi Booking</p>
        </div>
      </div>

      {/* Route Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
          <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 uppercase">Pickup</p>
            <p className="text-sm font-medium text-gray-800">{data.pickup}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
          <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 uppercase">Destination</p>
            <p className="text-sm font-medium text-gray-800">
              {data.destination}
            </p>
          </div>
        </div>
      </div>

      {/* Flight and Time Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <Plane className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Flight</p>
            <p className="text-sm font-medium">{data.flight_no}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Plane className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Airline</p>
            <p className="text-sm font-medium">{data.airline}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium">{data.arrival_date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="text-sm font-medium">{data.arrival_time}</p>
          </div>
        </div>
      </div>

      {/* Contact and Details */}
      <div className="flex flex-wrap gap-4 text-sm border-t border-gray-100 pt-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{data.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{data.phone}</span>
        </div>
        {data.alternate_phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{data.alternate_phone}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Luggage className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{data.luggage_quantity} luggage</span>
        </div>
      </div>

      {/* Instructions */}
      {data.instruction && (
        <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
          <p className="text-xs text-yellow-600 uppercase font-medium mb-1">
            Special Instructions
          </p>
          <p className="text-sm text-gray-700">{data.instruction}</p>
        </div>
      )}

      {/* Action Menu */}
      <div className="absolute top-4 right-4">
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
                    onStatusChange?.(data.uid, "completed");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => {
                    onStatusChange?.(data.uid, "cancelled");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                >
                  Cancel Booking
                </button>
              </>
            )}
            <button
              onClick={() => {
                onDelete?.(data.uid);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxiBookingCard;
