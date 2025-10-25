import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {

  FaPaperPlane,

} from "react-icons/fa6";

import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { domainName, inputLabelClassName, inputLabelClassNameReactSelect} from "../../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import ReactSelect from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteAssignedLeaveEmployee,
  getAssignLeaveDetails,
  getUpdateleaveRequest,
} from "./AssignLeaveFeatures/_assign_leave_reducers";
import { FaEdit, FaRegTimesCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { decrypt } from "../../../../config/Encryption";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";

function AssignLeavesDetails() {
  const {
    register,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
const {leaveIdEnc , companyIdEnc ,branchIdEnc } = useParams()
const leaveId = decrypt(leaveIdEnc)
const companyId = decrypt(companyIdEnc)
const branchId = decrypt(branchIdEnc)

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
    const employeeId = useWatch({
      control,
      name: "employee",
      defaultValue: "",
    });
  const { assignLeaveRequestDetails } = useSelector(
    (state) => state.assignLeave
  );
  const { employeList } = useSelector((state) => state.employe);
  const [expandedEmployeeIndex, setExpandedEmployeeIndex] = useState(null);

  const toggleEmployee = (index) => {
    setExpandedEmployeeIndex(expandedEmployeeIndex === index ? null : index);
  };
  useEffect(() => {
    getAssignRequestData();
  }, [companyId, branchId , employeeId]);
  const getAssignRequestData = () => {
    const reqData = {
      companyId:
      companyId,
      branchId:
       branchId,
      text: "",
      sort: true,
      status: "",
      isPagination: false,
      "employeId": employeeId?.value,
      "leaveTypeId": leaveId
  
    };
    dispatch(getAssignLeaveDetails(reqData));
  };


  const [inputValue, setInputValue] = useState(null);
  const [inputId, setInputId] = useState(null);
  const [openInout, setOpenInput] = useState({
    branchIndex: null,
    employeeIndex: null,
  });
  const openInput = (employeeIndex, id) => {
    setOpenInput({
      employeeIndex: employeeIndex,
    });
    setInputId(id);
  };
  const hanbdleSubmit = () => {
    dispatch(
      getUpdateleaveRequest({
        _id: inputId,
        totalLeaves: inputValue,
      })
    ).then((data) => {
      if (!data?.error) {
        getAssignRequestData();
        setOpenInput({
          employeeIndex: null,
        });
      }
    });
  };
  const handleDelete = (_id) => {
    dispatch(
      deleteAssignedLeaveEmployee({
        _id: _id,
      })
    ).then((data) => {
      if (!data?.error) {
        getAssignRequestData();
      }
    });
  };
  useEffect(() => {
    if (companyId && branchId) {
      fetchEmployeListData()
    }
  }, [companyId, branchId, ])



  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: '',
      designationId: '',
      companyId:companyId,
      branchId: branchId,
    };

    dispatch(employeSearch(reqPayload));
  };
  return (
    <GlobalLayout>
      <>
        <div className="">
          <div className="flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="flex gap-2">
            <div className="w-full">
                <label className={`${inputLabelClassName}`}>Employee</label>
                <Controller
                  name="employee"
                  control={control}
                  rules={{ required: "Employee is required" }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={employeList?.map((employee) => ({
                        value: employee?._id,
                        label: employee?.fullName,
                      }))}
                      classNamePrefix="react-select"
                      className={`${inputLabelClassNameReactSelect} ${errors.employee ? "border-[1px] " : "border-gray-300"}`}
                      showSearch
                      placeholder="Select Employee"
                    />
                  )}
                />
                {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
              </div>
            </div>
          </div>
        </div>

       <div className="bg-white shadow-md rounded-xl  mt-4">
       {assignLeaveRequestDetails?.docs?.length > 0 && (
          <>
            <div className="grid grid-cols-5 gap-4 rounded-t-xl  border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] py-2">
              <div className="col-span-1 text-center">Employee</div>
              <div className="col-span-1 text-center">Total Leaves</div>
              <div className="col-span-1 text-center">Used Leaves</div>
              <div className="col-span-1 text-center">Available Leaves</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {assignLeaveRequestDetails?.docs?.map((employee, employeeIndex) => (
              <React.Fragment key={employeeIndex}>
                <div
                  className="grid grid-cols-5 gap-4 text-sm border-b cursor-pointer hover:bg-gray-100 p-2"
                  onClick={() => toggleEmployee(employeeIndex)}
                >
                  <div className="col-span-1 text-center">
                    {employee.employeName}
                  </div>
                  <div className="col-span-1 text-center">
                    {openInout?.employeeIndex === employeeIndex ? (
                      <input
                      type="number"
                      value={inputValue}
                        className="border border-header text-center"
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    ) : (
                      employee.totalLeaves
                    )}
                  </div>
                  <div className="col-span-1 text-center">
                    {employee.usedLeaves}
                  </div>
                  <div className="col-span-1 text-center">
                    {employee.availableLeaves}
                  </div>
                  <div className=" flex justify-center items-center gap-2">
                    {openInout?.employeeIndex === employeeIndex ? (
                      <div
                        onClick={() => {
                          openInput("", "");
                          setInputValue(null);
                        }}
                        className="col-span-1 text-center"
                      >
                        <FaRegTimesCircle size={18} />
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          openInput(employeeIndex, employee?._id);
                          setInputValue(employee.totalLeaves);
                        }}
                        className="col-span-1 text-center"
                      >
                        <FaEdit size={18} />
                      </div>
                    )}
                    {openInout?.employeeIndex === employeeIndex && (
                      <div onClick={() => hanbdleSubmit()}>
                        <FaPaperPlane size={18} />
                      </div>
                    )}
                    <div onClick={() => handleDelete(employee?._id)}>
                      <MdDeleteOutline size={18} />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </>
        )}
       </div>
      </>
    </GlobalLayout>
  );
}
export default AssignLeavesDetails;
