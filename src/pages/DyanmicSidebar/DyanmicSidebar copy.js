import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { encrypt } from "../../config/Encryption";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import Loader from "../../global_layouts/Loader/Loader";
import {
  dynamicSidebarDelete,
  getsidebarList,
  getviewFinalsidebarList,
} from "./DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import CustomPagination from "../../component/CustomPagination/CustomPagination";

function DyanmicSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarListData, totalPlanCount, sidebarViewData, loading } = useSelector(
    (state) => state.dynamicSidebar
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const limit = 10;

  useEffect(() => {
    getDataList();
  }, []);
  const getDataList = () => {
    dispatch(getsidebarList());
  };
  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(dynamicSidebarDelete(reqData)).then((data) => {
          getDataList();
          dispatch(getviewFinalsidebarList());
        });
      }
    });
  };





  const renderSubPages = (subPages, level = 1) => {
    return subPages?.map((subPage, subIndex) => (
      <React.Fragment key={subPage._id}>
        <tr
          className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${subIndex % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
            }`}
        >
          <td className={`whitespace-nowrap border-none p-2 pl-${level * 2}`}>
            {subIndex + 1}
          </td>
          <td className="whitespace-nowrap border-none p-2">
            {subPage?.name ?? "-"}
          </td>
          <td className="whitespace-nowrap border-none p-2">
            {subPage?.slug ?? "-"}
          </td>
          <td className="whitespace-nowrap border-none p-2">
            <span className="py-1.5 flex justify-start items-center space-x-2">
              <button
                onClick={() => {
                  navigate(
                    `/admin/dynamic-sidebar/create/${encrypt(subPage?._id)}`
                  );
                }}
                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                type="button"
              >
                <FaPlus
                  className=" hover:text-[#337ab7] text-[#3c8dbc]"
                  size={16}
                />
              </button>
              <button
                onClick={() => {
                  navigate(
                    `/admin/dynamic-sidebar/edit/${encrypt(subPage?._id)}`
                  );
                }}
                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                type="button"
              >
                <FaPenToSquare
                  className=" hover:text-[#337ab7] text-[#3c8dbc]"
                  size={16}
                />
              </button>
              <button
                onClick={() => handleDelete(subPage?._id)}
                className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                type="button"
              >
                <RiDeleteBin5Line
                  className="text-red-600 hover:text-red-500"
                  size={16}
                />
              </button>
            </span>
          </td>
        </tr>

        {/* Render subChildPages if any */}
        {subPage.subChildPages && (
          <tr>
            <td colSpan={4}>
              <table className="w-full max-w-full rounded-xl overflow-hidden">
                <tbody>
                  {renderSubPages(subPage.subChildPages, level + 1)}
                </tbody>
              </table>
            </td>
          </tr>
        )}
      </React.Fragment>
    ));
  };


  return (
    <GlobalLayout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full">
            <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
              <div className="md:flex justify-start items-center md:space-x-4 space-x-0 md:space-y-0 space-y-2">
                <div className="sm:flex justify-start items-center sm:space-x-2 space-x-0 sm:space-y-0 space-y-2">
                  <div className="flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md">
                    <HiOutlineFilter />
                    <select className="ml-2 p-1 rounded-md outline-none border-none">
                      <option value="">Title</option>
                      <option value="A-Z">A-Z</option>
                      <option value="Z-A">Z-A</option>
                    </select>
                  </div>
                  <div className="flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md">
                    <HiOutlineFilter />
                    <select className="ml-2 p-1 rounded-md outline-none border-none">
                      <option value="">Price</option>
                      <option value="High to Low">High to Low</option>
                      <option value="Low to High">Low to High</option>
                    </select>
                  </div>
                  <div className="flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md">
                    <HiOutlineFilter />
                    <select className="ml-2 p-1 rounded-md outline-none border-none">
                      <option value="">Duration</option>
                      <option value="Newest to Oldest">Newest to Oldest</option>
                      <option value="Oldest to Newest">Oldest to Newest</option>
                    </select>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate("/admin/dynamic-sidebar/create");
                }}
                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add Dynamic Sidebar</span>
              </button>
            </div>
          </div>
          <div className="bg-[#ffffff] text-[13px] text-[#676a6c] w-full overflow-x-auto mt-1">
            <table className="w-full max-w-full rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">S.no.</th>
                  <th className="border-none p-2 whitespace-nowrap">name</th>
                  <th className="border-none p-2 whitespace-nowrap">slug</th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">Action</th>
                </tr>
              </thead>
              <tbody>
                {sidebarViewData && sidebarViewData.length > 0 ? (
                  sidebarViewData.map((element, index) => (
                    <React.Fragment key={element._id}>
                      {/* Parent Row */}
                      <tr onClick={() => toggleRow(index)}
                        className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          }`}
                      >
                        <td className="whitespace-nowrap border-none p-2">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap border-none p-2">
                          {element?.name ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2">
                          {element?.slug ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2">
                          <span className="py-1.5 flex justify-start items-center space-x-2">
                            <button
                              onClick={() => {
                                navigate(
                                  `/admin/dynamic-sidebar/create/${encrypt(element?._id)}`
                                );
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <FaPlus
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                            <button
                              onClick={() => {
                                navigate(
                                  `/admin/dynamic-sidebar/edit/${encrypt(element?._id)}`
                                );
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <FaPenToSquare
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(element?._id)}
                              className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <RiDeleteBin5Line
                                className="text-red-600 hover:text-red-500"
                                size={16}
                              />
                            </button>
                          </span>
                        </td>
                      </tr>
                      {expandedRow === index && element.subPages && (
                        <tr>
                          <td colSpan={4}>
                            <table className="w-full max-w-full rounded-xl overflow-hidden">
                              <tbody>
                                {renderSubPages(element.subPages)}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={4}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </>
      )}
    </GlobalLayout>
  );
}

export default DyanmicSidebar;
