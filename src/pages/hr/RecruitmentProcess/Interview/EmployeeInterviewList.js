import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { MdRemoveCircle } from "react-icons/md";
import {
  getInterviewList,
  statusUpdateApplication,
} from "./InterviewFeatures/_interview_reducers";
import {
  domainName,
  handleSortLogic,
  inputAntdSelectClassNameFilter,
} from "../../../../constents/global";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader from "../../../../global_layouts/Loader/Loader";
import moment from "moment";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { Select, Tooltip } from "antd";
import { BsFileEarmarkPdfFill, BsPassFill } from "react-icons/bs";
import { Controller, useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import usePermissions from "../../../../config/usePermissions";
import ListLoader from "../../../../global_layouts/ListLoader";

function EmployeeInterviewList() {

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    unregister,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pdStatus: "Pending",
    },
  });
  const dispatch = useDispatch();
  const { interviewList, totalInterviewCount, loading } = useSelector(
    (state) => state.interview
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const limit = 10;
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const Status = useWatch({
    control,
    name: "pdStatus",
    defaultValue: "Pending",
  });
  useEffect(() => {
    if (userInfoglobal?.userType === "employee") {
      fetchInterviewData();
    }
  }, [Status, searchText]);
  const fetchInterviewData = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        text: searchText,
        status: Status,
        sort: true,
        isPagination: true,
        interviewerId:
          userInfoglobal?.userType === "employee" ? userInfoglobal?._id : "",

        companyId:
          userInfoglobal?.userType === "employee"
            ? userInfoglobal?.companyId
            : "",
        branchId:
          userInfoglobal?.userType === "employee"
            ? userInfoglobal?.branchId
            : "",
      },
    };
    dispatch(getInterviewList(data));
  };

  const [sortedList, setSortedList] = useState([]);

  useEffect(() => {
    if (interviewList) {
      handleSort();
    }
  }, [interviewList]);

  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, interviewList);
    setSortedList(sortedList);
  };

  if (userInfoglobal?.userType !== "employee") {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an employee. This page is viewable for employees only.
          </p>
        </div>
      </GlobalLayout>
    );
  }

  const handleStatusUpdate = (element, status) => {
    Swal.fire({
      title: "Provide feedback",
      input: "textarea",
      inputLabel: "Feedback (optional)",
      inputPlaceholder: "Type your feedback here...",
      showCancelButton: true,
      confirmButtonText: `Update as ${status}`,
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (value === undefined || value === "") {
          return "Feedback cannot be empty";
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const feedback = result.value; // Get feedback input
        // Dispatch the status update with feedback
        dispatch(
          statusUpdateApplication({
            _id: element?._id,
            applicationId: element?.applicationId,
            status: status,
            // status: 'Failed',
            feedback: feedback, // Include feedback here
          })
        ).then((data) => {
          if (!data?.error) {
            fetchInterviewData(); // Fetch interview data after successful update
          }
        });
      }
    });
  };

  const onChange = (e) => {
    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="">
            <div className="flex py-1 gap-3">
              <div className="">
                <Controller
                  control={control}
                  name="pdStatus"
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={loading}
                      className={`${inputAntdSelectClassNameFilter} `}
                    >
                      <Select.Option value="">Select Status</Select.Option>
                      <Select.Option value="Pending">Pending </Select.Option>
                      <Select.Option value="Passed">Passed</Select.Option>
                      <Select.Option value="Failed">Failed</Select.Option>
                      <Select.Option value="Completed">Completed</Select.Option>
                    </Select>
                  )}
                />
                {errors.PdDesignationId && (
                  <p className="text-red-500 text-sm">
                    {errors.PdDesignationId.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setValue("pdStatus", "Pending")
                }}
                className="bg-header py-2 rounded-md flex px-10 justify-center items-center text-white">
                <span className="text-[12px]">Reset</span>
              </button>
            </div>
          </div>
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                  <th className="tableHead w-[10%]">S.No.</th>
                  <th className="tableHead">
                    <div className="flex gap-1">
                      Applicant Name
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("interviewerName", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("interviewerName", "desc")}
                        />
                      </div>
                    </div>
                  </th>
                  <th className="tableHead">
                    <div className="flex gap-1">
                      position
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("interviewerName", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("interviewerName", "desc")}
                        />
                      </div>
                    </div>
                  </th>

                  <th className="tableHead">
                    <div className="flex gap-1">Round Number</div>
                  </th>
                  <th className="tableHead">
                    <div className="flex gap-1">Round Name</div>
                  </th>
                  <th className="tableHead">
                    <div className="flex gap-1">
                      Type
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp onClick={() => handleSort("type", "asc")} />
                        <FaAngleDown
                          onClick={() => handleSort("type", "desc")}
                        />
                      </div>
                    </div>
                  </th>
                  <th className="tableHead">
                    <div className="flex gap-1">Resume</div>
                  </th>
                  <th className="tableHead">
                    <div className="flex gap-1">
                      Date
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp onClick={() => handleSort("date", "asc")} />
                        <FaAngleDown
                          onClick={() => handleSort("date", "desc")}
                        />
                      </div>
                    </div>
                  </th>
                  <th className="tableHead">status</th>
                  {(canUpdate) && <th className="tableHead w-[10%]">Action</th>}
                </tr>
              </thead>
              {loading ? <ListLoader /> : <tbody>
                {sortedList && sortedList?.length > 0 ? (
                  sortedList?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">  {index + 1 + (currentPage - 1) * limit}</td>
                      <td className="tableData">
                        {element?.applicationData?.fullName}
                      </td>
                      <td className="tableData">
                        {
                          element?.applicationData?.jobPostData?.designationData
                            ?.name
                        }
                      </td>

                      <td className="tableData">
                        {element?.roundNumber}
                      </td>
                      <td className="tableData">
                        {element?.roundName}
                      </td>
                      <td className="tableData">{element?.type}</td>
                      <td className="tableData">
                        {" "}
                        <button
                          onClick={() => {
                            if (element?.applicationData?.resumeUrl) {
                              const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${element?.applicationData?.resumeUrl}`;
                              window.open(url, "_blank");
                            }
                          }}
                          className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                          type="button"
                        >
                          <BsFileEarmarkPdfFill
                            className=" text-rose-700"
                            size={16}
                          />
                        </button>
                      </td>
                      <td className="tableData">
                        {moment(element?.date).format("YYYY-MM-DD hh:mm A")}
                      </td>
                      <td className="tableData">
                        <span
                          className={`${element?.status === "Active"
                            ? "bg-[#E0FFBE] border-green-500 text-black"
                            : element?.status === "Pending"
                              ? "bg-yellow-200 border-yellow-500 text-black"
                              : element?.status === "Inactive"
                                ? "bg-red-200 border-red-500 text-black"
                                : "bg-gray-200 border-gray-500 text-black"
                            } border-[1px] px-2 py-1.5 rounded-lg text-[12px]`}
                        >
                          {element?.status ? element.status : "-"}
                        </span>
                      </td>

                      {canUpdate && <td className="tableData">
                        <span className="py-1.5 flex justify-start items-center space-x-2.5">
                          {canUpdate && <Tooltip placement="topLeft" 
                            title={`${element?.status === "Pending"
                              ? "Update As Failed"
                              : `Already ${element?.status}`
                              }`}
                          >
                            <button
                              onClick={() =>
                                handleStatusUpdate(element, "Failed")
                              }
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                              disabled={element?.status !== "Pending"}
                            >
                              <MdRemoveCircle
                                className={`${element?.status === "Pending"
                                  ? "hover:text-rose-500 text-rose-600"
                                  : "text-gray-500"
                                  }`}
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          {canUpdate && <Tooltip placement="topLeft" 
                            title={`${element?.status === "Pending"
                              ? "Update As Passed"
                              : `Already ${element?.status}`
                              }`}
                          >
                            <button
                              onClick={() =>
                                handleStatusUpdate(element, "Passed")
                              }

                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                              disabled={element?.status !== "Pending"}
                            >
                              <BsPassFill
                                className={`${element?.status === "Pending"
                                  ? "hover:text-teal-500 text-teal-500"
                                  : "text-gray-500"
                                  }`}
                                size={16}
                              />
                            </button>
                          </Tooltip>}

                        </span>
                      </td>}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={10}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
            </table>
          </div>
          <CustomPagination
            totalCount={totalInterviewCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        </>
      )}
    </GlobalLayout>
  );
}
export default EmployeeInterviewList;
