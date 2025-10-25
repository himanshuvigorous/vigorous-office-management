import { Pagination } from "antd";
import React from "react";

const CustomPagination = ({ totalCount, pageSize, currentPage, onChange }) => {

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    if (onChange) {
      onChange(page);
    }
  };

  const createPageArray = () => {
    const delta = 2;
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    const pages = [];
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = createPageArray();

  return (
    <div className="flex items-center text-sm justify-end my-2 mx-2 space-x-1">
    <Pagination
    total={totalCount}
     align="center"
    current={currentPage}
    onChange={onChange}
    pageSize={pageSize}
    responsive={true}
    showSizeChanger={false}
    showQuickJumper = {false}
  />
   </div>
    // <div className="flex items-center text-sm justify-end my-2 mx-2 space-x-1">
    //   <button
    //     onClick={() => handlePageChange(currentPage - 1)}
    //     disabled={currentPage === 1 || !totalCount}
    //     className="px-3 py-1  rounded-sm  bg-emerald-600 text-white disabled:bg-gray-300 disabled:text-gray-500 transition-colors hover:bg-emerald-500"
    //   >
    //     &lt;
    //   </button>

    //   {pageNumbers.map((page, index) => (
    //     <button
    //       key={index}
    //       onClick={() => typeof page === "number" && handlePageChange(page)}
    //       className={`px-3 py-1  rounded-sm transition-colors ${
    //         page === currentPage
    //           ? "bg-header text-white"
    //           : "bg-white text-gray-700 hover:bg-gray-100"
    //       }`}
    //     >
    //       {page}
    //     </button>
    //   ))}

    //   <button
    //     onClick={() => handlePageChange(currentPage + 1)}
    //     disabled={currentPage === totalPages || !totalCount}
    //     className={`px-3 py-1  rounded-sm  bg-emerald-600 text-white disabled:bg-gray-300 disabled:text-gray-500 transition-colors hover:bg-emerald-500`} 
    //   >
    //     &gt;
    //   </button>
    // </div>
  );
};

export default CustomPagination;
