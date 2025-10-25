import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPenToSquare, FaPlus, FaAngleDown } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { HiOutlineFilter } from "react-icons/hi";
import {
  deleteIndustryFunc,
  getIndustryListFunc,
} from "./IndustryFeature/_industry_reducers";
import Loader from "../../../../global_layouts/Loader/Loader";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { Select, Tooltip } from "antd";
import { inputAntdSelectClassNameFilter } from "../../../../constents/global";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";

function Industry() {
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const { industryListData, totalIndustryCount, loading } = useSelector(
    (state) => state.industry
  );
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const limit = 10;

  
  const filters = [status, searchText].join("-");
  const [isFirstRender ,setisFirstRender] = useState(false)
  
  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state=>true);
      return;
    }
    if (currentPage === 1) {
      getindustryList();
    } else {
      setCurrentPage(1);
    }
  }, [filters])

  useEffect(() => {
    getindustryList();
  }, [currentPage]);

  const getindustryList = () => {
    const reqData = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        text: searchText,
        sort: false,
        status: status,
        isPagination: true,
      },
    };
    dispatch(getIndustryListFunc(reqData));
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
        dispatch(deleteIndustryFunc(reqData)).then((data) => {
          // getindustryList();
              if (currentPage > 1 && industryListData?.length==1) {
            setCurrentPage(Number(currentPage-1));  
             
          }else {
        getindustryList();    
          } 
        });
      }
    });
  };

  const onChange = (e) => {
    // 
    setSearchText(e);
  };
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
            <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1">
              <Select
                className={` ${inputAntdSelectClassNameFilter} `}
                value={status}
                onChange={(e) => {
                  setStatus(e);
                }}
                placeholder="Select Status"
                showSearch
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                <Select.Option value="">Select Status</Select.Option>
                <Select.Option value={true}>{"Active"}</Select.Option>
                <Select.Option value={false}>{"InActive"}</Select.Option>
              </Select>
            </div>

            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  setStatus("");
                }}
                className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>

      
              {canCreate && (
                <button
                  onClick={() => {
                    navigate("/admin/industry/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add Industry Type</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && (
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    S.No.
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[20%]">
                    Industry Name
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[20%]">
                    Created At
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[20%]">
                    Created By
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[15%]">Status</th>
                  {(canUpdate || canDelete) && (
                    <th className="border-none p-2 whitespace-nowrap w-[15%]">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              {loading ? (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={10}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr>
              ) : (
                <tbody>
                  {industryListData && industryListData?.length > 0 ? (
                    industryListData?.map((element, index) => (
                      <tr
                        className={`${
                          index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}
                      >
                        <td className="whitespace-nowrap border-none p-2 ">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {`${element?.name} ` ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {`${dayjs(element?.createdAt).format(
                            "DD-MM-YYYY hh:mm a"
                          )} ` ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.createdBy ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          <span
                            className={`${
                              element?.status
                                ? "bg-[#E0FFBE] border-green-500"
                                : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                          >
                            {" "}
                            {element?.status
                              ? "Active"
                              : "Inactive" ?? "-"}{" "}
                          </span>
                        </td>
                        {(canDelete || canUpdate) && (
                          <td className="whitespace-nowrap border-none p-2">
                            <span className="py-1.5 flex justify-start items-center space-x-2">
                              {canUpdate && (
                                <Tooltip placement="topLeft"  title="Edit">
                                  <button
                                    onClick={() => {
                                      navigate(
                                        `/admin/industry/edit/${encrypt(
                                          element?._id
                                        )}`
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
                                </Tooltip>
                              )}
                              {canDelete && (
                                <Tooltip placement="topLeft"  title="Delete">
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
                                </Tooltip>
                              )}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5 ">
                      <td
                        colSpan={6}
                        className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                      >
                        Record Not Found
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          )}
        </div>

        {totalIndustryCount > limit && (
          <CustomPagination
            totalCount={totalIndustryCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </>
    </GlobalLayout>
  );
}
export default Industry;
