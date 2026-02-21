"use client";

import React, { useEffect } from "react";
import { ChevronRight, CirclePlus, EllipsisVertical, Calendar } from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleChevronDown, FaLocationPin, FaStar } from "react-icons/fa6";
import { useListings } from "@/hooks/useListings";
import { useRouter } from "next/navigation";

const ApartmentListing = () => {
  const router = useRouter();
  const {
    listings,
    loading,
    error,
    currentPage,
    totalPages,
    pageSize,
    fetchListings,
    deleteListing,
  } = useListings();

  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  useEffect(() => {
    fetchListings({ category: "apartment", page: 1, pageSize: 10 });
  }, []);

  const handlePageChange = (page: number) => {
    fetchListings({ category: "apartment", page, pageSize });
  };

  const handleDelete = async (uid: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await deleteListing(uid);
    }
  };

  const pages = [...Array(totalPages).keys()].map((i) => i + 1);
  const baseButtonClass =
    "px-4 py-2 border rounded-lg font-medium transition duration-150 ease-in-out shadow-sm";
  const pageNumButtonClass =
    "w-10 h-10 flex items-center justify-center border rounded-lg text-sm font-medium transition";

  return (
    <div className="w-full max-w-4xl mx-auto pt-12 px-4 md:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Apartment List</h2>
          <p className="flex items-center gap-2 text-gray-600">
            <a href="/dashboard" className="hover:underline">
              Management
            </a>
            <ChevronRight size={16} /> Apartments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/add-listing")}
            className="py-2 px-4 rounded border border-gray-300 text-white bg-[#781F19] flex items-center gap-2 hover:bg-[#5f1914]"
          >
            Add Listing <CirclePlus size={20} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading apartments...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-8">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {!loading && !error && listings.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg my-8">
          <p className="text-gray-600">No apartments found.</p>
          <button
            onClick={() => router.push("/add-listing")}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Apartment
          </button>
        </div>
      )}

      <div className="space-y-6 my-8">
        {listings.map((listing) => {
          const firstPrice = listing.price ? Object.values(listing.price)[0] : null;
          const priceLabel = listing.price ? Object.keys(listing.price)[0] : null;

          return (
            <div
              key={listing.uid}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 relative flex-shrink-0 h-48 md:h-auto">
                  <div
                    className="h-full bg-cover bg-center"
                    style={{
                      backgroundImage: listing.images?.[0]
                        ? `url(${listing.images[0]})`
                        : "url(https://via.placeholder.com/350x200?text=No+Image)",
                    }}
                  >
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                  </div>
                  {listing.images && listing.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {listing.images.slice(0, 5).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full cursor-pointer ${i === 0 ? "bg-white" : "bg-gray-400 opacity-70"
                            }`}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full md:w-2/3 p-6 md:p-10 flex flex-col justify-between relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{listing.title}</h2>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <FaLocationPin />
                        <span className="text-[#781F19] ml-1">
                          {listing.city}
                          {listing.location && `, ${listing.location}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${listing.status === "open"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            {listing.status || "open"}
                          </span>
                        </div>
                        <button
                          className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
                          onClick={() =>
                            setOpenMenuId(openMenuId === listing.uid ? null : listing.uid)
                          }
                        >
                          <EllipsisVertical size={24} />
                        </button>
                        {openMenuId === listing.uid && (
                          <div className="absolute right-4 top-12 mt-2 w-40 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                            <button
                              onClick={() => {
                                router.push(`/listing-calendar?id=${listing.uid}&type=apartment`);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Calendar size={16} />
                              View Calendar
                            </button>
                            <button
                              onClick={() => {
                                router.push(`/add-listing?id=${listing.uid}&edit=true`);
                                setOpenMenuId(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(listing.uid)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                    {listing.description}
                  </p>

                  {listing.tags && (
                    <div className="text-xs text-blue-600 mb-4">
                      {listing.tags.split(",").map((tag) => (
                        <span key={tag.trim()} className="mr-3 font-medium">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-start items-end space-x-6 pt-2 border-t border-gray-100">
                    {listing.bedrooms_count && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Bedrooms:</span>
                        <span className="text-base font-semibold text-gray-800">
                          {listing.bedrooms_count}
                        </span>
                      </div>
                    )}
                    {listing.guest_capacity && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Guests:</span>
                        <span className="text-base font-semibold text-gray-800">
                          {listing.guest_capacity}
                        </span>
                      </div>
                    )}
                    {firstPrice && (
                      <span className="text-xl font-bold text-gray-900 ml-auto">
                        €{firstPrice}
                        {priceLabel && <span className="text-sm text-gray-600">/{priceLabel}</span>}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && listings.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex-grow flex justify-start items-center space-x-2">
            <button
              className={`${baseButtonClass} w-28 flex items-center justify-center ${currentPage === 1
                ? "bg-gray-50 text-gray-700 border-gray-300 cursor-not-allowed opacity-50"
                : "text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <IoIosArrowBack className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-1">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${pageNumButtonClass} ${page === currentPage
                    ? "bg-green-100 text-green-700 border-green-500 ring-2 ring-green-500 ring-opacity-50"
                    : "text-gray-700 hover:bg-gray-50 border-gray-300"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className={`${baseButtonClass} w-24 flex items-center justify-center ${currentPage === totalPages
                ? "bg-gray-50 text-gray-700 border-gray-300 cursor-not-allowed opacity-50"
                : "text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
              <IoIosArrowForward className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-2 text-sm text-gray-700">
            <span>Show</span>
            <div className="relative">
              <div className="px-3 py-2 border border-gray-300 rounded-lg flex items-center cursor-pointer hover:border-gray-400 transition">
                <span>{pageSize} entries</span>
                <FaCircleChevronDown className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ApartmentListing;
