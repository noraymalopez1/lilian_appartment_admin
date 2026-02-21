"use client";
import {
  ChevronRight,
  CirclePlus,
  EllipsisVertical,
  Funnel,
  Star,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaCircleChevronDown } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useReviews } from "@/hooks/useReviews";

const Reviews = () => {
  const { reviews, loading, error, totalCount, fetchReviews, deleteReview } = useReviews();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showEntriesMenu, setShowEntriesMenu] = useState(false);

  // Fetch reviews on mount and when page/filter changes
  useEffect(() => {
    fetchReviews(currentPage, entriesPerPage, { rating: ratingFilter });
  }, [currentPage, entriesPerPage, ratingFilter, fetchReviews]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / entriesPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1); // ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);
      setOpenMenuId(null);
      // Refresh current page
      if (reviews.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Base button classes for common styling
  const baseButtonClass =
    "px-4 py-2 border rounded-lg font-medium transition duration-150 ease-in-out shadow-sm";

  // Page number button classes
  const pageNumButtonClass =
    "w-10 h-10 flex items-center justify-center border rounded-lg text-sm font-medium transition";

  return (
    <div className="w-full max-w-4xl mx-auto pt-12 px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Reviews</h2>
          <p className="flex items-center gap-2">
            <a href="/">Managment</a> <ChevronRight size={16} /> Reviews{" "}
            <ChevronRight size={16} />
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              className="py-2 px-4 rounded border border-gray-300 flex items-center gap-2"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              Filter
              <span className="border border-[#781F19] rounded p-1">
                <Funnel size={20} />
              </span>
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-12 mt-2 w-40 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                  onClick={() => {
                    setRatingFilter("all");
                    setShowFilterMenu(false);
                    setCurrentPage(1);
                  }}
                >
                  All Ratings
                </button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                    onClick={() => {
                      setRatingFilter(rating);
                      setShowFilterMenu(false);
                      setCurrentPage(1);
                    }}
                  >
                    {rating} Star{rating !== 1 && "s"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && reviews.length === 0 && (
        <div className="my-8 text-center text-gray-500">
          No reviews found.
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div>
          {reviews.map((review) => (
            <div
              key={review.uid}
              className="relative mx-auto my-8 py-6 px-6 md:px-12 bg-white rounded-xl shadow-lg border border-gray-100"
            >
              {/* Top section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 rounded-full mr-3 border border-gray-200 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    {/* Posted by */}
                    <p className="text-sm text-gray-700">
                      Posted by{" "}
                      <span className="font-semibold text-gray-900">
                        {review.name}
                      </span>
                    </p>
                    {/* Review Title */}
                    <h3 className="text-md font-bold text-gray-800 mt-1">
                      {review.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {/* Star Rating */}
                  <div className="flex mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  {/* Date and Ellipsis Menu */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition"
                      onClick={() =>
                        setOpenMenuId(openMenuId === review.uid ? null : review.uid)
                      }
                    >
                      <EllipsisVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    {openMenuId === review.uid && (
                      <div className="absolute right-4 top-12 mt-2 w-32 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => handleDelete(review.uid)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Review Text */}
              <p className="text-base text-gray-700 leading-relaxed">
                {review.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Bottom pagination */}
      {!loading && !error && totalPages > 0 && (
        <div className="flex justify-between items-center ">
          <div className="flex-grow flex justify-start items-center space-x-2">
            {/* Previous Button */}
            <button
              className={`${baseButtonClass} w-28 flex items-center justify-center ${currentPage === 1
                  ? "bg-gray-50 text-gray-700 border-gray-300 cursor-not-allowed opacity-50"
                  : "text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <IoIosArrowBack className="w-4 h-4 mr-1" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {pages.map((page, index) =>
                page === -1 ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-10 h-10 flex items-center justify-center text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    className={`
											${pageNumButtonClass} 
											${page === currentPage
                        ? "bg-green-100 text-green-700 border-green-500 ring-2 ring-green-500 ring-opacity-50"
                        : "text-gray-700 hover:bg-gray-50 border-gray-300"
                      }
										`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              className={`${baseButtonClass} w-24 flex items-center justify-center ${currentPage === totalPages
                  ? "bg-gray-50 text-gray-700 border-gray-300 cursor-not-allowed opacity-50"
                  : "text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <IoIosArrowForward className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Show Entries Dropdown */}
          <div className="flex-shrink-0 flex items-center space-x-2 text-sm text-gray-700">
            <span>Show</span>
            <div className="relative">
              <button
                className="px-3 py-2 border border-gray-300 rounded-lg flex items-center cursor-pointer hover:border-gray-400 transition"
                onClick={() => setShowEntriesMenu(!showEntriesMenu)}
              >
                <span>{entriesPerPage} entries</span>
                <FaCircleChevronDown className="w-4 h-4 ml-1" />
              </button>
              {showEntriesMenu && (
                <div className="absolute right-0 bottom-12 mb-2 w-32 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                  {[5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                      onClick={() => {
                        setEntriesPerPage(num);
                        setShowEntriesMenu(false);
                        setCurrentPage(1);
                      }}
                    >
                      {num} entries
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
