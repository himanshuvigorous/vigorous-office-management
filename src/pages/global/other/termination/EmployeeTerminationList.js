import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import Loader from "../../../../global_layouts/Loader/Loader";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { domainName, inputAntdSelectClassNameFilter, inputClassNameSearch, } from "../../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { CgEyeAlt } from "react-icons/cg";
import { Select, Tooltip } from "antd";
import getUserIds from "../../../../constents/getUserIds";
import { HiOutlineFilter } from "react-icons/hi";

import { BsPassFill } from "react-icons/bs";
import { MdBookmarkAdded, MdRemoveCircle } from "react-icons/md";
import moment from "moment";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { getEmployeeTerminationList } from "./terminationFeatures/termination_reducers";


function EmployeeTerminationList() {
  const { register, control, setValue, formState: { errors } } = useForm();
  const { userCompanyId, userBranchId, userType, userEmployeId } = getUserIds();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employeeTerminationData, employeeLoading, totalEmployeeTerminationCount } = useSelector((state) => state.Termination);
  const [searchText, setSearchText] = useState("");
  // const [status, setStatus] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });

  const status = useWatch({
    control,
    name: "status",
    defaultValue: "",
  });

  const limit = 10;

  useEffect(() => {
    if(userInfoglobal?.userType === "employee" && userInfoglobal?._id ){
    getCommonResignationRequest();
    }
  }, [currentPage, searchText, status]);

  const getCommonResignationRequest = () => {

    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
        companyId: userCompanyId || "",
        branchId: userBranchId || "",
        employeId: userEmployeId,
        "text": searchText,
        "sort": true,
        "status": status,
        "isPagination": true,
        type: "termination"
      }
    };
    dispatch(getEmployeeTerminationList(data));
  };


  // useEffect(() => {
  //   if (
  //     (companyId && userType=='employee')
     
  //   ) {
  //     dispatch(
  //       branchSearch({
  //         text: "",
  //         sort: true,
  //         status: true,
  //         isPagination: false,
  //         companyId: companyId
  //       })
  //     );
  //   }
  // }, [companyId])
  useEffect(() => {
    if (userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);


  const openModal = (template) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTemplate(null);
  };


  const onChange = (e) => {
    
    setSearchText(e);
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
    )
  }
  return (
    <GlobalLayout onChange={onChange}>


      <div className="">
        <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
          <div className="flex items-center space-x-2">
            <Controller
              name="status"
              control={control}
              rules={{}}
              render={({ field }) => (
                <Select
                  {...field}
                  className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.status ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Select Status"
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Select Status</Select.Option>
                  <Select.Option value='Rejected'>{"Rejected"}</Select.Option>
                  <Select.Option value='Approved'>{"Approved"}</Select.Option>
                  <Select.Option value='Requested'>{"Requested"}</Select.Option>
                  <Select.Option value='Completed'>{"Completed"}</Select.Option>
                </Select>
              )}
            />
          </div>
          <div className="flex justify-end items-center">
            <button
              onClick={() => {
                setValue("status", "");
                setValue("PDBranchId", "");
                setValue("PdDepartmentId", "");
                setValue("PdCompanyId", "");
              }}
              className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
          </div>
          {/* <button
                onClick={() => { navigate("/admin/employee-resignation/create")}}
                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add Resignation</span>
              </button> */}
        </div>
      </div>

      <div className="w-full">
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead w-[5%]">S.No.</th>
                <th className="tableHead">Title</th>
                <th className="tableHead">Employee Name</th>
                <th className="tableHead">Description</th>
                <th className="tableHead">Apply Date</th>
                <th className="tableHead">Create At</th>
                <th className="tableHead">Create By</th>
                <th className="tableHead">Notice Period (days)</th>
                <th className="tableHead">Status</th>
              </tr>
            </thead>
            {employeeLoading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {employeeTerminationData && employeeTerminationData?.length > 0 ? (
                  employeeTerminationData?.map((element, index) => (
                    <React.Fragment key={element._id}>
                      <tr
                        className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"} border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="tableData">{element?.title ?? "-"}</td>
                        <td className="tableData">{element?.employeName ?? "-"}</td>
                        <td className="tableData">{element?.description}</td>
                        <td className="tableData">{moment(element?.applyDate).format("DD-MM-YYYY")}</td>
                        <td className="tableData">{moment(element?.createdAt).format("DD-MM-YYYY hh:mm a")}</td>
                        <td className="tableData">{element?.createdBy}</td>
                        <td className="tableData">{element?.noticePeriod}</td>
                        <td className="tableData">
                          <span
                            className={`${element?.status ? "bg-[#E0FFBE] border-green-500" : "bg-red-200 border-red-500"} border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                          >
                            {element?.status}
                          </span>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td colSpan={6} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>
        {employeeTerminationData?.length > 0 &&
          <CustomPagination
            totalCount={totalEmployeeTerminationCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />}
      </div>

      {modalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1501]" onClick={closeModal}>
          <div className="animate-slideInFromTop bg-white rounded-lg px-6 pt-6 pb-3 w-[800px] max-h-[70vh] overflow-y-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="mt-4">
              <div dangerouslySetInnerHTML={{ __html: selectedTemplate?.content }}></div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-white bg-header rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </GlobalLayout>
  );
}
export default EmployeeTerminationList;
