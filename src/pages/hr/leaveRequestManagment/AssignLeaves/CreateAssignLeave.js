import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { domainName, inputClassName } from "../../../../constents/global";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { createAssignLeaves, deleteAssignedLeaveEmployee, getEmployeeListAsssignedleave } from "./AssignLeaveFeatures/_assign_leave_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";

function CreateAssignLeave() {
  const dispatch = useDispatch();
  const { leaveIdEnc, companyIdEnc, branchIdEnc } = useParams()
  const leaveId = decrypt(leaveIdEnc)
  const companyId = decrypt(companyIdEnc)
  const branchId = decrypt(branchIdEnc)
  const { employeList } = useSelector((state) => state.employe);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const { assignedleaveEmployeeData } = useSelector((state) => state.assignLeave);

  useEffect(() => {
    fetchEmployeListData();
  }, [branchId, companyId]);

  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: "",
      isHR: "",
      isTL: "",
      sort: true,
      isPagination: false,
      departmentId: "",
      designationId: "",
      companyId: companyId,
      branchId: branchId,
    };

    dispatch(employeSearch(reqPayload))
  };

  const handleSelectEmployee = (e , employeeId) => {
    if(e.target.checked){
    dispatch(createAssignLeaves({
      "directorId": "",
      companyId: companyId,
      branchId: branchId,
      "employeId": [...selectedEmployees, employeeId],
      "leaveTypeId": leaveId
    })).then((res) => {
     !res?.error && getAssignRequestData()
    })
  }else{
    dispatch(
      deleteAssignedLeaveEmployee({
        _id: assignedleaveEmployeeData?.docs?.find((item) => item?.employeId === employeeId)?._id,
      })
    ).then((data) => {
      if (!data?.error) {
        getAssignRequestData();
      }
    });
  }
  
  };
  useEffect(() => {
    getAssignRequestData();
  }, [companyId, branchId]);
  const getAssignRequestData = () => {
    const reqData = {
      companyId: companyId,
      branchId: branchId,
      text: "",
      sort: true,
      status: "",
      isPagination: false,
      "leaveTypeId": leaveId
    };
    dispatch(getEmployeeListAsssignedleave(reqData));
  };


  useEffect(() => {
    if (assignedleaveEmployeeData) {
      assignedleaveEmployeeData?.docs && setSelectedEmployees(assignedleaveEmployeeData?.docs?.map((emp) => emp.employeId))
    }
  }, [assignedleaveEmployeeData])

  return (
    <GlobalLayout>

      <div
        className=""
      >
        <div className="">
          <div className="">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 my-4">
              {/* {userInfoglobal?.userType === "admin" && (
                <div className="">
                  <select
                    {...register("PDCompanyId", {
                      required: "company is required",
                    })}
                    className={` ${inputClassName} ${
                      errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
                    }`}
                  >
                    <option className="" value="">
                      Select Comapany
                    </option>
                    {companyList?.map((type) => (
                      <option value={type?._id}>{type?.fullName}</option>
                    ))}
                  </select>
                  {errors.PDCompanyId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDCompanyId.message}
                    </p>
                  )}
                </div>
              )} */}
              {/* {(userInfoglobal?.userType === "admin" ||
                userInfoglobal?.userType === "company" ||
                userInfoglobal?.userType === "companyDirector") && (
                <div className="">
                  <select
                    {...register("PDBranchId", {
                      required: "Branch is required",
                    })}
                    className={` ${inputClassName} ${
                      errors.PDBranchId ? "border-[1px] " : "border-gray-300"
                    }`}
                  >
                    <option className="" value="">
                      Select Branch
                    </option>
                    {branchList?.map((type) => (
                      <option value={type?._id}>{type?.fullName}</option>
                    ))}
                  </select>
                  {errors.PDBranchId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBranchId.message}
                    </p>
                  )}
                </div>
              )} */}

            </div>


          </div>
        </div>
        <div className="bg-white shadow-sm  max-h-[500px]  w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full  rounded-xl overflow-auto">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmployees(employeList?.map((emp) => emp?._id));
                      } else {
                        setSelectedEmployees([]);
                      }
                    }}
                  />
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  Employee Name
                </th>
                <th className="border-none p-2 whitespace-nowrap">E-mail</th>
                <th className="border-none p-2 whitespace-nowrap">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {employeList && employeList?.length > 0 ? (
                employeList?.map((element, index) => (
                  <tr
                    className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      } border-[#DDDDDD] text-[#374151] text-[14px]`}
                  >
                    <td className="whitespace-nowrap border-none p-2">
                      <input
                        type="checkbox"
                        checked={selectedEmployees?.includes(element._id)}
                        onChange={(e) => handleSelectEmployee(e,element._id)}
                      />
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.fullName}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 ">
                      {element?.email}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 ">
                      {element?.mobile?.code + element?.mobile?.number}{" "}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={9}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                  >
                    Record Not Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
        {/* <div className="flex justify-end items-center mt-4">
          <button
            onClick={handleReturnSelected}
            className="bg-header px-2 py-2.5 rounded-md flex justify-center items-center space-x-2 text-white"
          >
            <FaPlus />
            <span className="text-[12px]">Return Selected Employees</span>
          </button>
        </div> */}
      </div>

    </GlobalLayout>
  );
}

export default CreateAssignLeave;
