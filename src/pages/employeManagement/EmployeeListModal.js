
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  employeSearch,
  getEmployeList,
} from "./employeFeatures/_employe_reducers";
import getUserIds from "../../constents/getUserIds";
import { domainName, inputClassNameSearch } from "../../constents/global";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { useForm, useWatch } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";

function EmployeeListModal({ onSelectEmployees, onClose }) {
  const {
    register,
    control,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const { userCompanyId, userBranchId, userType } = getUserIds();

  const { employeList } = useSelector((state) => state.employe);
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  useEffect(() => {
    fetchEmployeListData();
  }, [branchId, companyId]);

  useEffect(() => {
    if (userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
        })
      );
    }
  }, []);
  useEffect(() => {
    if (
      companyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination:false,
          companyId:
            userInfoglobal?.userType === "admin"
              ? companyId
              : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }
  }, [companyId]);

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

    dispatch(employeSearch(reqPayload));
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees((prevSelected) => {
      if (prevSelected.includes(employeeId)) {
        return prevSelected.filter((id) => id !== employeeId);
      } else {
        return [...prevSelected, employeeId];
      }
    });
  };

  // Return selected employees
  const handleReturnSelected = () => {
    onSelectEmployees(selectedEmployees); // Call the function passed as prop to return the selected employees
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1560]"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 rounded-lg p-6 w-full max-w-full md:max-w-2xl max-h-[60vh] overflow-scroll "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="">
          <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="sm:flex justify-start items-center sm:space-x-2 space-x-0 sm:space-y-0 space-y-2">
              {userInfoglobal?.userType === "admin" && (
                <div className="">
                  <select
                    {...register("PDCompanyId", {
                      required: "company is required",
                    })}
                    className={` ${inputClassNameSearch} ${
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
              )}
              {(userInfoglobal?.userType === "admin" ||
                userInfoglobal?.userType === "company" ||
                userInfoglobal?.userType === "companyDirector") && (
                <div className="">
                  <select
                    {...register("PDBranchId", {
                      required: "Branch is required",
                    })}
                    className={` ${inputClassNameSearch} ${
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
              )}
            </div>
            <button
              onClick={handleReturnSelected}
              className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
            >
              <FaPlus />
              <span className="text-[12px]">Return Selected Employees</span>
            </button>
          </div>
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmployees(employeList.map((emp) => emp._id));
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
              {employeList && employeList.length > 0 ? (
                employeList?.map((element, index) => (
                  <tr
                    className={`border-b-[1px] ${
                      index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                    } border-[#DDDDDD] text-[#374151] text-[14px]`}
                  >
                    <td className="whitespace-nowrap border-none p-2">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(element._id)}
                        onChange={() => handleSelectEmployee(element._id)}
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
      </div>
    </div>
  );
}

export default EmployeeListModal;
