import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import moment from "moment";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { useDispatch, useSelector } from "react-redux";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, sortByPropertyAlphabetically } from "../../../../constents/global";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import {
  createwfhRequest
} from "./WFHRequestFeatures/_wfh_request_reducers";
import { FaRegFile, FaTimes } from "react-icons/fa";
import { fileUploadFunc } from "../../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import { Modal, Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";
import { wfhManagerListSearch } from "../../../global/other/wfhManager/wfhManagerfeature/_wfhManager_reducers";

const CreateWfhRequestModal = ({
  isOpen,
  onClose,
  fetchattendanceListData,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeName: "",
      date: moment().format("YYYY-MM-DD"),
      checkInTime: "",
      checkOutTime: "",
      reason: "",
      errors: {},
    },
  });

  const navigate = useNavigate();
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const multipleType = useWatch({
    control,
    name: "dayType",
    defaultValue: "",
  });
  const fromDate = useWatch({
    control,
    name: "fromDate",
    defaultValue: "",
  });

  const departmentId = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: "",
  });
  const employeeId = useWatch({
    control,
    name: "employee",
    defaultValue: "",
  });
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const dispatch = useDispatch();
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { employeList } = useSelector((state) => state.employe);
  const { wfhManagerListData, loading: wfhrequestLoading } = useSelector(
    (state) => state.wfhManager
  );


  const attachmentRef = useRef([]);

  const onFormSubmit = (data) => {
    const reqData = {

      companyId:
        userInfoglobal?.userType === "admin"
          ? companyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? branchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
      directorId:
        userInfoglobal?.userType === "companyDirector"
          ? userInfoglobal?._id
          : userInfoglobal?.directorId,
      employeId: data?.employee?.value,
      "wfhManagerId": data?.wfhTypeId,
      reason: data?.wfhReason,
      "startDate": dayjs(data?.fromDate).format("YYYY-MM-DD"),
      "endDate": dayjs(data?.fromDate).format("YYYY-MM-DD"),
      "worktodo": data?.worktodo || "-",
      "status": "approved"
    };

    dispatch(createwfhRequest(reqData)).then((response) => {
      if (!response.error) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "wfh Request sent successfully.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-header text-white hover:bg-[#063156]",
          },
        });

        fetchattendanceListData();
        onClose();
        reset()
      }
    });
  };


  useEffect(() => {
    if (
      (userInfoglobal?.userType === "admin" && companyId) ||
      (userInfoglobal?.userType === "company" && userInfoglobal?._id) ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      setValue("PDDepartmentId", "");
      setValue("PDDesignationId", "");
      setValue("PDBranchId", "");

      dispatch(
        branchSearch({
          companyId:
            userInfoglobal?.userType === "admin"
              ? companyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, [companyId]);
  useEffect(() => {
    if (
      (companyId || userInfoglobal?.userType !== "admin") &&
      (branchId ||
        userInfoglobal?.userType !== "companBranch" ||
        userInfoglobal?.userType === "employee")
    ) {
      fetchEmployeListData();
      dispatch(wfhManagerListSearch({
        text: '',
        sort: true,
        status: true,
        isPagination: false,
        directorId: "",
        companyId:
          userInfoglobal?.userType === "admin"
            ? companyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? branchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
      }))
    }
  }, [companyId, branchId]);

  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: "",
      designationId: "",
      companyId:
        userInfoglobal?.userType === "admin"
          ? companyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? branchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
    };

    dispatch(employeSearch(reqPayload));
  };






  if (!isOpen) return null;
  return (
    <Modal
      visible={isOpen}
      onCancel={() => {
        onClose();
        reset()
      }}
      footer={null}
      title="Apply wfh"
      width={600}
      height={400}
      className="antmodalclassName"


    >

      <div>
        <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
          <div className="grid grid-col-1 md:grid-cols-2 gap-4">
            {userInfoglobal?.userType === "admin" && (
              <div>
                <label className={`${inputLabelClassName}`}>Company <span className="text-red-600">*</span></label>
                <Controller
                  control={control}
                  name="PDCompanyId"
                  rules={{ required: "Company is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}

                      className={`${inputAntdSelectClassName} `}
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        (companyList?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        )))
                      }
                    </Select>
                  )}
                />
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
                <div>
                  <label className={`${inputLabelClassName}`}>Branch <span className="text-red-600">*</span></label>
                  <Controller
                    control={control}
                    name="PDBranchId"
                    rules={{ required: "Branch is required" }}

                    render={({ field }) => (
                      <Select
                        {...field}
                        onChange={(value) => {
                          setValue("employee", '')
                          setValue("wfhTypeId", '')
                          setValue("fromDayStatus", '')
                          setValue("toDayStatus", '')
                          field.onChange(value);
                        }}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> :
                          (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                            <Select.Option key={type?._id} value={type?._id}>
                              {type?.fullName}
                            </Select.Option>
                          )))
                        }
                      </Select>
                    )}
                  />
                  {errors.PDBranchId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBranchId.message}
                    </p>
                  )}
                </div>
              )}

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Employee <span className="text-red-600">*</span></label>
              <Controller
                name="employee"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={sortByPropertyAlphabetically(employeList, 'fullName')?.map((employee) => ({
                      value: employee?._id,
                      label: employee?.fullName,
                    }))}
                    classNamePrefix="react-select"
                    className={`${inputLabelClassNameReactSelect} ${errors.employee ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select Employee"
                  />
                )}
              />
              {errors.employee && (
                <p className="text-red-500 text-sm">
                  {errors.employee.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                wfh Type <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="wfhTypeId"
                rules={{ required: "wfh Request is required" }}

                render={({ field }) => (
                  <Select
                    {...field}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName} `}
                  >
                    <Select.Option value="">Select wfh Request</Select.Option>
                    {wfhrequestLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (wfhManagerListData?.map((wfhRequest) => (
                      <Select.Option key={wfhRequest?._id} value={wfhRequest?._id}>
                        {wfhRequest?.name}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.wfhTypeId && (
                <p className="text-red-500 text-sm">
                  {errors.wfhTypeId.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="fromDate"
                control={control}
                rules={
                  {
                    required: 'Date is required'
                  }
                }
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                    return current && current.isBefore(moment().endOf('day'), 'day');
                  }} />
                )}
              />
              {errors.fromDate && (
                <p className="text-red-500 text-sm">Date is required</p>
              )}
            </div>
          </div>


          <div className="grid grid-col-1 md:grid-cols-1 gap-4">
            <div className="">
              <label className={`${inputLabelClassName}`}>wfh Reason <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("wfhReason", {
                  required: "wfh Reason is required",
                })}
                className={` ${inputClassName} ${errors.wfhReason ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter wfh Reason"
              />
              {errors.wfhReason && (
                <p className="text-red-500 text-sm">
                  {errors.wfhReason.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>Work To Be Done <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("worktodo", {
                  required: "Work To Be Done is required",
                })}
                className={` ${inputClassName} ${errors.worktodo ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Work To Be Done"
              />
              {errors.worktodo && (
                <p className="text-red-500 text-sm">
                  {errors.worktodo.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={wfhrequestLoading}
              className={`${wfhrequestLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {wfhrequestLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateWfhRequestModal;
