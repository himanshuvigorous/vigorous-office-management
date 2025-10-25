import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { domainName, formButtonClassName, inputAntdSelectClassName, inputAntdSelectClassNameFilter, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, sortByPropertyAlphabetically } from "../../../../constents/global";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import ReactSelect from "react-select";
import { Checkbox, Select } from "antd";
import { standardPayrollCreate } from "./standardPayrollfeature/_standardPayroll_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { getdeductionsList } from "../Deductions/deductionsfeature/_deductionsList_reducers";
import { getAllowanceList } from "../Allowance/allowancefeature/_allowanceList_reducers";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";




const CreateStandardPayroll = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allowanceListData, loading: allowanceLoading } = useSelector((state) => state.allowance);
  const { deductionsListData, loading: deductionLoading } = useSelector((state) => state.deductions);
  const { employeList, loading: employeLoading } = useSelector((state) => state.employe);
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const [finalemployeeList, setFinalEmployeeList] = useState([]);
  const [allDedfinalemployeeList, setAllDedFinalEmployeeList] = useState([]);
  const { loading: standardPayrollLoading } = useSelector(
    (state) => state.standardPayroll
  );
  const selectedEmployee = useWatch({
    control,
    name: "employee",
    defaultValue: "",
  });
  const deductionsListDetails = useWatch({
    control,
    name: "deductionDetails",
    defaultValue: "",
  });
  const allowanceListDetails = useWatch({
    control,
    name: "allowanceDetails",
    defaultValue: "",
  });


  // useEffect(() => {
  //   if (employeList && Array.isArray(employeList)) {
  //     const updatedList = employeList.map(employee => ({
  //       ...employee,
  //       salaryData: {
  //         basicSalary: getRandomNumber(300, 1000),
  //         yearlySalary: getRandomNumber(8000, 20000),
  //         monthlySalary: getRandomNumber(50000, 150000),
  //       }
  //     }));
  //     setFinalEmployeeList(updatedList);
  //   }
  // }, [employeList]);

  useEffect(() => {
    if (selectedEmployee && Array.isArray(selectedEmployee)) {
      const newData = selectedEmployee.map((data) => {
        const employeeId = data?.value;
        const getedData = employeList?.find(
          (employee) => employee?._id === employeeId
        );

        if (!getedData) return null;

        let AllDed = [];
        const salaryData = getedData?.salaryData || {};
        const basicSalary = Number(salaryData?.basicSalary) || 0;

        // Process Allowances
        if (Array.isArray(allowanceListDetails)) {
          allowanceListDetails.forEach((all) => {
            const allId = all?.allowance;
            const allowanceItem = allowanceListData?.find(
              (item) => item?._id === allId
            );
            const allName = allowanceItem?.name || "-";
            const allIsPercentage = all?.isPercentage;
            const amount = Number(all?.amount) || 0;

            const calculatedAmounted =
              allIsPercentage === "Yes"
                ? (basicSalary * amount) / 100
                : amount;

            AllDed.push({
              name: allName,
              isPercentage: allIsPercentage,
              _id: allId,
              amount: calculatedAmounted,
              type: "allowance",
            });
          });
        }

        // Process Deductions
        if (Array.isArray(deductionsListDetails)) {
          deductionsListDetails.forEach((ded) => {
            const dedId = ded?.deduction;
            const deductionItem = deductionsListData?.find(
              (item) => item?._id === dedId
            );
            const dedName = deductionItem?.name || "-";
            const dedIsPercentage = ded?.isPercentage;
            const amount = Number(ded?.amount) || 0;

            const calculatedAmounted =
              dedIsPercentage === "Yes"
                ? (basicSalary * amount) / 100
                : amount;

            AllDed.push({
              name: dedName,
              isPercentage: dedIsPercentage,
              _id: dedId,
              amount: calculatedAmounted,
              type: "deduction",
            });
          });
        }

        return { ...getedData, AllDed };
      });

      // Filter out any null employees if .find() failed
      const filteredData = newData.filter(Boolean);
      setAllDedFinalEmployeeList(filteredData);
    }
  }, [
    selectedEmployee,
    allowanceListDetails,
    deductionsListDetails,
    allowanceListData,
    deductionsListData,
    employeList,
  ]);


  // Helper function
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const handleSelectAll = (field) => {
    if (isSelectAllChecked) {
      field.onChange([]);
    } else {
      const allEmployees = employeList.map((employee) => ({
        value: employee._id,
        label: employee.fullName,
      }));
      field.onChange(allEmployees);
    }
    setIsSelectAllChecked(!isSelectAllChecked);
  };


  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const {
    fields: allowanceDetails,
    append: appendAllowance,
    remove: removeAllowance,
  } = useFieldArray({
    control,
    name: "allowanceDetails",
  });
  const {
    fields: deductionDetails,
    append: appendDeduction,
    remove: removeDeduction,
  } = useFieldArray({
    control,
    name: "deductionDetails",
  });



  const onSubmit = (data) => {

    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: "",
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      "employeIds": (data?.employee && data?.employee?.length > 0) ? data?.employee?.map((employee) => employee.value) : [],
      "allowances": data?.allowanceDetails?.map((allowance) => ({
        "allowanceId": allowance?.allowance,
        "name": allowanceListData?.find((item) => item?._id === allowance?.allowance)?.name,
        "isPercentage": allowance?.isPercentage === "Yes" ? true : false,
        "value": allowance?.amount
      })),
      "deductions": data?.deductionDetails?.map((deduction) => ({
        "deductionId": deduction?.deduction,
        "name": deductionsListData?.find((item) => item?._id === deduction?.deduction)?.name,
        "isPercentage": deduction?.isPercentage === "Yes" ? true : false,
        "value": deduction?.amount
      }))
    };

    dispatch(standardPayrollCreate(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };


  useEffect(() => {
    if (
      CompanyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId])
  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
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
  const getDeductionsData = () => {
    let reqData = {
      // currentPage: currentPage,
      // pageSize: pageSize,
      reqPayload: {
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        directorId: "",
        companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      },
    };
    dispatch(getdeductionsList(reqData));
  };
  const getchAllowanceData = () => {
    let reqData = {
      // currentPage: currentPage,
      // pageSize: pageSize,
      reqPayload: {
        "text": "",
        "sort": true,
        "status": true,
        "isPagination": false,
        directorId: "",
        companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      },
    };
    dispatch(getAllowanceList(reqData));
  };
  useEffect(() => {
    if ((CompanyId || userInfoglobal?.userType !== "admin") && (BranchId || userInfoglobal?.userType !== "companBranch" || userInfoglobal?.userType === "employee")) {
      getDeductionsData();
      getchAllowanceData();
    }
  }, [CompanyId, BranchId,])


  const { Option } = Select
  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userInfoglobal?.userType === "admin" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Company <span className="text-red-600">*</span>
              </label>

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
                    {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (companyList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.PDCompanyId && (
                <p className="text-red-500 text-sm">
                  {errors.PDCompanyId.message}
                </p>
              )}
            </div>}
            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">
              <label className={`${inputLabelClassName}`}>
                Branch <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="PDBranchId"
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(value) => {
                      setValue("employee", '')
                      field.onChange(value);
                    }}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Branch</Select.Option>
                    {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.PDBranchId && (
                <p className="text-red-500 text-sm">
                  {errors.PDBranchId.message}
                </p>
              )}
            </div>}
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Employees <span className="text-red-600">*</span>
              </label>

              <Controller
                name="employee"
                control={control}
                rules={{ required: "At least one employee is required" }}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    isMulti
                    onFocus={() => {
                      dispatch(employeSearch({
                        companyId:
                          userInfoglobal?.userType === "admin"
                            ? watch("PDCompanyId")
                            :
                            userInfoglobal?.userType === "company"
                              ? userInfoglobal?._id
                              : userInfoglobal?.companyId,
                        branchId:
                          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? watch("PDBranchId") : userInfoglobal?.userType === "companyBranch"
                            ? userInfoglobal?._id
                            : userInfoglobal?.branchId,
                        departmentId: watch('PDDepartmentId')?.value,
                        "directorId": "",
                        text: "",
                        sort: true,
                        status: true,
                        isPagination: false,
                      }));
                    }}
                    options={
                      Array.isArray(employeList) && employeList?.length > 0
                        ? [
                          { value: "select_all", label: "Select All" },
                          ...sortByPropertyAlphabetically(employeList, 'fullName').map((employee) => ({
                            value: employee?._id,
                            label: employee?.fullName,
                          })),
                        ]
                        : []
                    }
                    classNamePrefix="react-select"
                    className={`${inputLabelClassNameReactSelect} ${errors.employee ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Select Employees..."
                    onChange={(selectedOptions) => {
                      const isSelectAllSelected = selectedOptions.find(
                        (option) => option.value === "select_all"
                      );

                      if (isSelectAllSelected) {
                        handleSelectAll(field);
                      } else {
                        // Check if all employees are selected
                        setIsSelectAllChecked(
                          selectedOptions?.length === employeList?.length
                        );
                        field.onChange(selectedOptions);
                      }
                    }}
                    value={field.value || []}
                    formatOptionLabel={(data, { context }) => {
                      if (data.value === "select_all") {
                        return (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelectAllChecked}
                              onChange={() => handleSelectAll(field)}
                              style={{ marginRight: "10px" }}
                            />
                            <span>Select All</span>
                          </div>
                        );
                      }
                      return data.label;
                    }}
                  />
                )}
              />
              {errors.employee && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employee.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            <div>
              <div className=" rounded-t-lg border border-gray-300 md:mt-0 mt-3">
                <div className="py-2 text-white bg-header px-2 rounded-t-lg font-semibold">
                  Allowance{" "}
                </div>
                {allowanceDetails.map((item, index) => (
                  <div key={index} className=" rounded-md my-2 ">
                    <div key={item.id} className="">


                      <div className="px-3 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                        <div className="flex gap-3">
                          <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                              Allowance <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name={`allowanceDetails[${index}].allowance`}
                              control={control}
                              rules={{ required: "allowance is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  className={`${inputAntdSelectClassName} ${errors.allowanceDetails?.[index]?.allowance ? '' : 'border-gray-300'}`}
                                  showSearch
                                  filterOption={(input, option) =>
                                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                                  }
                                  placeholder="Select allowance"
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                >
                                  <Option value="">Select allowance</Option>
                                  {allowanceLoading ? (
                                    <Select.Option disabled><ListLoader /></Select.Option>
                                  ) : (
                                    sortByPropertyAlphabetically(allowanceListData)
                                      ?.filter(opt => {
                                        // Allow current value and exclude already selected ones
                                        const selectedIds = allowanceDetails
                                          .filter((_, i) => i !== index) // exclude current index
                                          .map(a => a.allowance);
                                        return !selectedIds.includes(opt._id);
                                      })
                                      .map(item => (
                                        <Option key={item._id} value={item._id}>
                                          {item.name}
                                        </Option>
                                      ))
                                  )}
                                </Select>

                              )}
                            />
                            {errors.allowanceDetails?.[index]?.allowance && (
                              <p className="text-red-500 text-sm">
                                {errors.allowanceDetails[index].allowance.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Is Percentage <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name={`allowanceDetails[${index}].isPercentage`}
                            control={control}
                            rules={{ required: "isPercentage is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`${inputAntdSelectClassName} ${errors.allowanceDetails?.[index]?.isPercentage ? '' : 'border-gray-300'}`}
                                placeholder="Select Is Percentage"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                              >
                                <Option value="">Select Is Percentage</Option>
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                              </Select>

                            )}
                          />
                          {errors.allowanceDetails?.[index]?.isPercentage && (
                            <p className="text-red-500 text-sm">
                              {errors.allowanceDetails[index].isPercentage.message}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            {watch(`allowanceDetails[${index}].isPercentage`) === "Yes" ? "Percentage" : "Amount"} <span className="text-red-600">*</span>
                          </label>

                          <input
                            type="number"
                            step="0.01"
                            placeholder="Enter Amount"
                            {...register(`allowanceDetails[${index}].amount`, {
                              required: "Amount is required",
                              valueAsNumber: true,
                              min: watch(`allowanceDetails[${index}].isPercentage`) === "Yes" ? 1 : 0,
                              validate: (value) => {
                                const isPercentage = watch(`allowanceDetails[${index}].isPercentage`) === "Yes";
                                if (isPercentage && value > 100) return "Percentage can't be more than 100";
                                return true;
                              }
                            })}
                            className={`${inputClassName} ${errors.deductionDetails?.[index]?.amount
                              ? "border-[1px]"
                              : "border-gray-300"
                              }`}
                          />
                          {errors.allowanceDetails?.[index]?.amount && (
                            <p className="text-red-500 text-sm">
                              {errors.allowanceDetails[index].amount.message}
                            </p>
                          )}
                        </div>
                        <div className="py-2">
                          {(
                            <div className="flex justify-end items-center">
                              <button
                                type="button"
                                onClick={() => {
                                  removeAllowance(item, index)
                                }}
                                className="text-rose-800 hover:text-rose-900 flex items-center justify-center p-1 rounded-lg"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendAllowance({

                    })
                  }
                  className={`${formButtonClassName} mx-3 mb-2`}
                >
                  Add Allowance
                </button>
              </div>
            </div>
            <div>
              <div className=" rounded-t-lg border border-gray-300 ">
                <div className="py-2 text-white bg-header px-2 rounded-t-lg  font-semibold">
                  Deductions{" "}
                </div>
                {deductionDetails.map((item, index) => (
                  <div key={index} className=" rounded-md my-2 ">
                    <div key={item.id} className="">
                      <div className="px-3 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                        <div className="flex gap-3">
                          <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                              Deduction <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name={`deductionDetails[${index}].deduction`}
                              control={control}
                              rules={{ required: "deduction is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  className={`${inputAntdSelectClassName} ${errors.deductionDetails?.[index]?.deduction ? '' : 'border-gray-300'}`}
                                  showSearch
                                  filterOption={(input, option) =>
                                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                                  }
                                  placeholder="Select deduction"
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                >
                                  <Option value="">Select deduction</Option>
                                  {deductionLoading ? (
                                    <Select.Option disabled><ListLoader /></Select.Option>
                                  ) : (
                                    sortByPropertyAlphabetically(deductionsListData)
                                      ?.filter(opt => {
                                        const selectedIds = deductionDetails
                                          .filter((_, i) => i !== index) // Exclude the current one so it doesn't filter itself
                                          .map(d => d.deduction);
                                        return !selectedIds.includes(opt._id);
                                      })
                                      .map(item => (
                                        <Option key={item._id} value={item._id}>
                                          {item.name}
                                        </Option>
                                      ))
                                  )}
                                </Select>
                              )}
                            />
                            {errors.deductionDetails?.[index]?.deduction && (
                              <p className="text-red-500 text-sm">
                                {errors.deductionDetails[index].deduction.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Is Percentage <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name={`deductionDetails[${index}].isPercentage`}
                            control={control}
                            rules={{ required: "isPercentage is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`${inputAntdSelectClassName} ${errors.deductionDetails?.[index]?.isPercentage ? '' : 'border-gray-300'}`}
                                placeholder="Select Is Percentage"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                              >
                                <Option value="">Select Is Percentage</Option>
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                              </Select>
                            )}
                          />
                          {errors.deductionDetails?.[index]?.isPercentage && (
                            <p className="text-red-500 text-sm">
                              {errors.deductionDetails[index].isPercentage.message}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            {watch(`deductionDetails[${index}].isPercentage`) === "Yes" ? "Percentage" : "Amount"} <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Enter Amount"
                            {...register(`deductionDetails[${index}].amount`, {
                              required: "Amount is required",
                              valueAsNumber: true,
                              min: watch(`deductionDetails[${index}].isPercentage`) === "Yes" ? 1 : 0,
                              validate: (value) => {
                                const isPercentage = watch(`deductionDetails[${index}].isPercentage`) === "Yes";
                                if (isPercentage && value > 100) return "Percentage can't be more than 100";
                                return true;
                              }
                            })}
                            className={`${inputClassName} ${errors.deductionDetails?.[index]?.amount
                              ? "border-[1px]"
                              : "border-gray-300"
                              }`}
                          />
                          {errors.deductionDetails?.[index]?.amount && (
                            <p className="text-red-500 text-sm">
                              {errors.deductionDetails[index].amount.message}
                            </p>
                          )}
                        </div>
                        <div className="py-2">
                          {(
                            <div className="flex justify-end items-center">
                              <button
                                type="button"
                                onClick={() => {
                                  removeDeduction(item, index)
                                }}
                                className="text-rose-800 hover:text-rose-900 flex items-center justify-center p-1 rounded-lg"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendDeduction({

                    })
                  }
                  className={`${formButtonClassName} mx-3 mb-2`}
                >
                  Add Deduction
                </button>
              </div>
            </div>
          </div>


          <div className="flex justify-end m-2 ">
            <button
              type="submit"
              disabled={standardPayrollLoading}
              className={`${standardPayrollLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {standardPayrollLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
        <div className="space-y-6">
          {allDedfinalemployeeList?.map((employee) => {
            // Calculate totals
            const totalAllowances = employee?.AllDed
              ?.filter(item => item?.type?.toLowerCase() === 'allowance')
              ?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) || 0;

            const totalDeductions = employee?.AllDed
              ?.filter(item => item?.type?.toLowerCase() === 'deduction')
              ?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) || 0;

            const netSalary = (parseFloat(employee?.salaryData?.basicSalary) || 0) + totalAllowances - totalDeductions;

            return (
              <div key={employee?.id || employee?.fullName} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden max-w-4xl mx-auto">

                {/* Employee Header with Salary Summary */}
                <div className="bg-header text-white p-5">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shrink-0">
                      {employee?.profileImage ? (
                        <img src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${employee.profileImage}`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-header">{employee?.fullName?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-xl font-bold">{employee?.fullName}</h2>
                      <p className="text-blue-100">{employee?.designation || 'Employee'}</p>

                      {/* Salary Summary - Now visible with proper sizing */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-sm md:text-base">
                        <div className="bg-white/10 p-2 rounded">
                          <p className="font-medium">Basic Salary</p>
                          <p className="font-bold">₹{employee?.salaryData?.basicSalary?.toLocaleString('en-IN') || '0'}</p>
                        </div>
                        <div className="bg-white/10 p-2 rounded">
                          <p className="font-medium">Monthly Salary</p>
                          <p className="font-bold">₹{employee?.salaryData?.currentSalary?.toLocaleString('en-IN') || '0'}</p>
                        </div>
                        <div className="bg-white/10 p-2 rounded">
                          <p className="font-medium">Yearly Package</p>
                          <p className="font-bold">₹{employee?.salaryData?.currentPackage?.toLocaleString('en-IN') || '0'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Salary Breakdown */}
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Allowances Section */}
                    <div className="border border-green-100 rounded-lg overflow-hidden">
                      <div className="bg-green-50 p-3 border-b border-green-100">
                        <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Allowances
                        </h3>
                      </div>

                      <div className="divide-y divide-green-50">
                        {employee?.AllDed?.filter(item => item?.type?.toLowerCase() === 'allowance')?.length > 0 ? (
                          employee.AllDed.filter(item => item?.type?.toLowerCase() === 'allowance').map((item, idx) => (
                            <div key={`allowance-${idx}`} className="p-3 flex justify-between items-center">
                              <span className="font-medium text-gray-700">{item.name}</span>
                              <span className="font-semibold text-green-600">+ ₹{item.amount}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-500">No allowances this month</div>
                        )}

                        <div className="p-3 bg-green-50 flex justify-between font-semibold">
                          <span>Total Allowances</span>
                          <span className="text-green-700">+ ₹{totalAllowances.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions Section */}
                    <div className="border border-red-100 rounded-lg overflow-hidden">
                      <div className="bg-red-50 p-3 border-b border-red-100">
                        <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                          Deductions
                        </h3>
                      </div>

                      <div className="divide-y divide-red-50">
                        {employee?.AllDed?.filter(item => item?.type?.toLowerCase() === 'deduction')?.length > 0 ? (
                          employee.AllDed.filter(item => item?.type?.toLowerCase() === 'deduction').map((item, idx) => (
                            <div key={`deduction-${idx}`} className="p-3 flex justify-between items-center">
                              <span className="font-medium text-gray-700">{item.name}</span>
                              <span className="font-semibold text-red-600">- ₹{item.amount}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-500">No deductions this month</div>
                        )}

                        <div className="p-3 bg-red-50 flex justify-between font-semibold">
                          <span>Total Deductions</span>
                          <span className="text-red-700">- ₹{totalDeductions.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Calculation */}
                <div className="p-5 border-t border-gray-200 bg-gray-50">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">Salary Calculation</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Basic Salary:</span>
                        <span className="font-medium">₹{employee?.salaryData?.basicSalary?.toLocaleString('en-IN') || '0'}</span>
                      </div>

                      <div className="flex justify-between text-green-600">
                        <span>Total Allowances:</span>
                        <span>+ ₹{totalAllowances.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between text-red-600">
                        <span>Total Deductions:</span>
                        <span>- ₹{totalDeductions.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="border-t border-gray-300 my-2"></div>

                      <div className="flex justify-between text-lg font-bold text-header">
                        <span>Net Salary Payable:</span>
                        <span>₹{netSalary.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>




      </div>
    </GlobalLayout>
  );
};

export default CreateStandardPayroll;
