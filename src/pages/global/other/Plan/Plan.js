import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPenToSquare, FaPlus, FaRegPenToSquare } from "react-icons/fa6";
import moment from "moment/moment";
import { useForm } from "react-hook-form";
import { HiOutlineFilter } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import Loader from "../../../../global_layouts/Loader/Loader";
import {
  deletePlanFunc,
  getPlanListFunc,
  planSearch,
  planStatus
} from "./PlanFeatures/_plan_reducers";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { inputAntdSelectClassNameFilter } from "../../../../constents/global";
import { Select, Switch, Tooltip } from "antd";
import dayjs from "dayjs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { FaEye } from "react-icons/fa";
function Plan() {
  const { setValue } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { planListData, totalPlanCount, loading } = useSelector((state) => state.plan);
  const [sortName, setSortName] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [sortDuration, setSortDuration] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const limit = 10;

  useEffect(() => {
    getPlanList();
  }, [currentPage, searchText, status]);

  const getPlanList = () => {
    const reqData = {
      currentPage: currentPage,
      pageSize: limit,
      reqPayload: {
        text: searchText,
        status: status,
        isPagination: true,
      },
    };
    dispatch(getPlanListFunc(reqData));
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
        dispatch(deletePlanFunc(reqData)).then((data) => {
          if (!data?.error) {
            getPlanList();
          }
        });
      }
    });
  };
  const handleOnChange = async (event) => {
    const searchValue = event.target.value;
    setValue("search", searchValue);

    let reqData = {
      search: searchValue,
    };
    const data = {
      currentPage: 1,
      pageSize: 10,
      reqData,
    };
    dispatch(planSearch(data));
  };

  const sortData = (data) => {
    if (!data) return
    let sortedData = [...data];
    if (sortName === "A-Z") {
      sortedData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortName === "Z-A") {
      sortedData.sort((a, b) => b.title.localeCompare(a.title));
    }
    if (sortPrice === "High to Low") {
      sortedData.sort((a, b) => b.price - a.price);
    } else if (sortPrice === "Low to High") {
      sortedData.sort((a, b) => a.price - b.price);
    }
    if (sortDuration === "Newest to Oldest") {
      sortedData.sort((a, b) => b.days - a.days);
    } else if (sortDuration === "Oldest to Newest") {
      sortedData.sort((a, b) => a.days - b.days);
    }
    return sortedData;
  };
  const handleSortName = (e) => {
    setSortName(e.target.value);
  };
  const handleSortPrice = (e) => {
    setSortPrice(e.target.value);
  };
  const handleSortDuration = (e) => {
    setSortDuration(e.target.value);
  };
  const sortedData = sortData(planListData);


  const onChange = (e) => {
    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>

      <>
        <div className="w-full">
          <div className="flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
              <Select
                className={` ${inputAntdSelectClassNameFilter} `}
                value={status}
                onChange={(e) => {
                  setStatus(e);
                }}
                placeholder="Select Status"
                showSearch >
                <Select.Option value="">Select Status</Select.Option>
                <Select.Option value={true}>{"Active"}</Select.Option>
                <Select.Option value={false}>{"InActive"}</Select.Option>
              </Select>
            </div>
            <button
              onClick={() => {
                navigate("/admin/plan/create");
              }}
              className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white">
              <FaPlus />
              <span className="text-[12px]">Add Plan</span>
            </button>
          </div>
        </div>
        <div className="bg-[#ffffff] text-[13px] text-[#676a6c] w-full overflow-x-auto mt-1">
          <table className="w-full max-w-full rounded-xl overflow-hidden ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500]  h-[40px]">
                <th className="border-none p-2 whitespace-nowrap w-[10%]"> S.no.</th>
                <th className="border-none p-2 whitespace-nowrap"> Plan Name </th>
                <th className="border-none p-2 whitespace-nowrap"> Description</th>
                <th className="border-none p-2 whitespace-nowrap"> Duration</th>
                <th className="border-none p-2 whitespace-nowrap">Price</th>
                <th className="border-none p-2 whitespace-nowrap">Enrolled Company</th>
                <th className="border-none p-2 whitespace-nowrap">Created At</th>
                <th className="border-none p-2 whitespace-nowrap">Created By</th>
                <th className="border-none p-2 whitespace-nowrap">Status</th>
                <th className="border-none p-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            {loading ?
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={15}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr> :

              <tbody>
                {sortedData && sortedData?.length > 0 ? (
                  sortedData?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        }`}
                    >
                      <td className="whitespace-nowrap border-none p-2 ">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {`${element?.title} ` ?? "-"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {`${element?.description} ` ?? "-"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {`${element?.days} days` ?? "-"}
                      </td>

                      <td className="whitespace-nowrap border-none p-2 ">
                        {`${element?.price} ₹` ?? "-"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {`${element?.enrolledCompany} ` ?? "-"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {`${dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')} ` ?? "-"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {`${element?.createdBy} ` ?? "-"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        <Switch
                          checked={element?.status}
                          onChange={() => {
                            dispatch(
                              planStatus({ _id: element?._id, status: !element?.status })
                            ).then((data) => {
                              if (!data?.error && data) {
                                getPlanList();
                              }
                            });
                          }}
                          style={{
                            backgroundColor: element?.status
                              ? "#4caf50"
                              : "#f44336",
                            transition: "background-color 0.3s ease",
                          }}
                          height={20}
                          width={40}
                        />
                      </td>
                      <td className="whitespace-nowrap border-none p-2 " >
                        <Tooltip placement="topLeft"  title="Access Settings">
                          <button
                            onClick={() => {
                              navigate(
                                `/admin/plan-manager/${encrypt(element?._id)}`
                              );
                            }}
                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                            type="button"
                          >
                            <FaEye
                              className=" hover:text-[#337ab7] text-[#3c8dbc]"
                              size={16}
                            />
                          </button>

                        </Tooltip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5 ">
                    <td
                      colSpan={10}
                      className="px-6 text-center py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>
        {totalPlanCount > limit && (
          <CustomPagination
            totalCount={totalPlanCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />)}
      </>

    </GlobalLayout>
  );
}

export default Plan;
