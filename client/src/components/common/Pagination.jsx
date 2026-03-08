import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate visible page range
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`p-2 rounded-full ${
          currentPage === 1
            ? "text-gray-600 cursor-not-allowed"
            : "text-white hover:bg-gray-700 transition"
        }`}
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition ${
            currentPage === page
              ? "bg-red-500 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full ${
          currentPage === totalPages
            ? "text-gray-600 cursor-not-allowed"
            : "text-white hover:bg-gray-700 transition"
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
