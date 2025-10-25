import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import moment from "moment";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { useDispatch, useSelector } from "react-redux";
import { domainName, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputLabelClassName, inputLabelClassNameReactSelect, sortByPropertyAlphabetically } from "../../../../constents/global";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import {
  createwfhRequest,
  getwfhRequestDetails,
  updatewfhRequest
} from "./WFHRequestFeatures/_wfh_request_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import { Modal, Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";
import { wfhManagerListSearch } from "../../../global/other/wfhManager/wfhManagerfeature/_wfhManager_reducers";

const EditWfhRequestModal = ({
  isOpen,
  onClose,
  fetchattendanceListData,
  wfhRequestId,
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
  const dispatch = useDispatch();
  const { wfhManagerListData, loading: wfhrequestLoading } = useSelector(
    (state) => state.wfhManager
  );
  const { wfhrequestDetails } = useSelector((state) => state.wfhRequest)
  useEffect(() => {
    if (wfhRequestId) {
      dispatch(getwfhRequestDetails({ _id: wfhRequestId }));
    }
  }, [dispatch, wfhRequestId]);
  useEffect(() => {
    if (wfhrequestDetails) {

      dispatch(wfhManagerListSearch({
        text: '',
        sort: true,
        status: true,
        isPagination: false,
        directorId: "",
        companyId: wfhrequestDetails?.companyId,
        branchId: wfhrequestDetails?.branchId,
      }))
      setValue("wfhTypeId",wfhrequestDetails?.wfhManagerId)
      setValue("wfhReason",wfhrequestDetails?.reason)
      setValue("employeeName",wfhrequestDetails?.employeData?.fullName)
      setValue("fromDate",wfhrequestDetails?.startDate ? dayjs(wfhrequestDetails?.startDate) : null)
      setValue("worktodo",wfhrequestDetails?.worktodo)
      // setValue("toDate",wfhrequestDetails?.endDate ? dayjs(wfhrequestDetails?.endDate): null)

    }
  }, [wfhrequestDetails])
  const onFormSubmit = (data) => {
    const reqData = {
      _id:wfhRequestId,

      companyId: wfhrequestDetails?.companyId,
      branchId: wfhrequestDetails?.branchId,
      directorId: wfhrequestDetails?.directorId,
      employeId: wfhrequestDetails?.employeId,
      "wfhManagerId": data?.wfhTypeId,
      reason: data?.wfhReason,
      "startDate": dayjs(data?.fromDate).format("YYYY-MM-DD"),
      "endDate": dayjs(data?.fromDate).format("YYYY-MM-DD"),
      worktodo: data?.worktodo || "-",
      "status": wfhrequestDetails?.status,
     
    };

    dispatch(updatewfhRequest(reqData)).then((response) => {
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


             <div className="">
              <label className={`${inputLabelClassName}`}>Employee <span className="text-red-600">*</span></label>
              <input
                type="text"
                disabled
                {...register("employeeName", {
                  required: "Employee is required",
                })}
                className={` ${inputDisabledClassName} ${errors.employeeName ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Employee"
              />
              {errors.employeeName && (
                <p className="text-red-500 text-sm">
                  {errors.employeeName.message}
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
                          <label className={`${inputLabelClassName}`}>Work To Do <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            {...register("worktodo", {
                              required: "Work To Do is required",
                            })}
                            className={` ${inputClassName} ${errors.worktodo ? "border-[1px] " : "border-gray-300"
                              } `}
                            placeholder="Enter Work To Do"
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

export default EditWfhRequestModal;
