import React, { useEffect, useState } from 'react';
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout';
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, sortByPropertyAlphabetically } from '../../../constents/global';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ListLoader from '../../../global_layouts/ListLoader';
import ReactSelect from "react-select";
import { companySearch } from '../../company/companyManagement/companyFeatures/_company_reducers';
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers';
import { officeAddressSearch } from '../../global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers';
import { clientSearch } from '../../client/clientManagement/clientFeatures/_client_reducers';
import { RiDeleteBin5Line } from 'react-icons/ri';
const Createinvoice = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      tasks: [
        { gstAmount: "", gstRate: "", amount: "", hsnCode: "", taskType: "" },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "tasks", });
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const selectedTasks = useWatch({ control, name: "tasks" });
  const [gstType, setGstType] = useState("");
  const [isgstType, setIsGstType] = useState(false);
  const dispatch = useDispatch()
  const [finalTaskType, setFinalTaskType] = useState([]);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { officeAddressListData, loading: officeAddressLoading } = useSelector((state) => state.officeAddress);
  const { clientList, loading: clientLoading } = useSelector((state) => state.client);
  const selectedlayout = officeAddressListData?.find((address) => address._id === watch("invoiceLayout"));
  const selectedClient = clientList?.find((client) => client._id === watch("client"));
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
          companyId:
            userInfoglobal?.userType === "admin"
              ? CompanyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId]);
  useEffect(() => {
    if (
      (CompanyId || userInfoglobal?.userType !== "admin") &&
      (BranchId ||
        userInfoglobal?.userType === "companBranch" ||
        userInfoglobal?.userType === "employee")
    ) {
      fetchClientdata();
    }
  }, [CompanyId, BranchId]);
  useEffect(() => {
    setFinalTaskType([]);
    if (
      clientList?.find((client) => client._id === watch("client"))
        ?.clientCompletedTaskData
    ) {
      setFinalTaskType([
        ...clientList?.find((client) => client._id === watch("client"))
          ?.clientCompletedTaskData,
        {
          _id: "other",
          financialYear: "-",
          status: "Completed",
          taskName: "Other",
          description: "Other",
          HSNCode: "-",
          GSTRate: 0,
          GSTName: "-",
          taskFee: 0,
        },
      ]);
    }
  }, [clientList, watch("client"), selectedlayout, selectedClient]);
  const fetchClientdata = () => {
    dispatch(
      clientSearch({
        companyId:
          userInfoglobal?.userType === "admin"
            ? watch("PDCompanyId")
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? watch("PDBranchId")
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        groupId: "",
        directorId: "",
        organizationId: "",
        industryId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
      })
    );
  };
  const getAvailableTasks = (index) => {
    // const selectedIds = selectedTasks.map((task) => task?.taskType);
    // return finalTaskType?.filter((task) => !selectedIds.includes(task._id));
    return finalTaskType
  };
    useEffect(() => {
      if (selectedClient && selectedlayout) {
        if (selectedlayout?.isGSTEnabled) {
          setIsGstType(true);
          const ClientGstNumber = selectedClient?.clientProfile?.GSTNumber;
          const layoutGstNumber = selectedlayout?.gstNumber;
          const clientGstPrefix = ClientGstNumber?.slice(0, 2);
          const layoutGstPrefix = layoutGstNumber?.slice(0, 2);
          if (clientGstPrefix === layoutGstPrefix) {
            setGstType("interstate");
          } else {
            setGstType("intrastate");
          }
        } else {
          setIsGstType(false);
          setGstType("");
        }
      } else {
        setIsGstType(false);
        setGstType("");
      }
    }, [selectedClient, selectedlayout]);

  return (

    <GlobalLayout>
      <form
        autoComplete="off"
        className="mt-2 md:px-1"
      // onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1  md:mt-4">
          {userInfoglobal?.userType === "admin" && (
            <div className="">
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
                    {companyListLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : sortByPropertyAlphabetically(companyList, 'fullName')?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))}
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
              <div className="">
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
                      defaultValue={""}
                      className={`${inputAntdSelectClassName} `}
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      ))}
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
          <div className="w-full">
            <label className={`${inputLabelClassName}`}>
              Client <span className="text-red-600">*</span>
            </label>
            <Controller
              name="client"
              control={control}
              rules={{ required: " client is required" }}

              render={({ field }) => (
                <Select
                  {...field}
                  defaultValue={""}
                  showSearch
                  filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                  className={` ${inputAntdSelectClassName} ${errors.invoiceLayout
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <Select.Option className="" value="">
                    Select client
                  </Select.Option>
                  {clientLoading ? <Select.Option disabled>
                    <ListLoader />
                  </Select.Option> : (sortByPropertyAlphabetically(clientList, 'fullName')?.map((element) => (
                    <Select.Option value={element?._id}>
                      {element?.fullName}
                    </Select.Option>
                  )))}
                </Select>
              )}
            />
            {errors.client && (
              <p className="text-red-500 text-sm mt-1">
                {errors.client.message}
              </p>
            )}
          </div>
          <div className="">
            <label className={`${inputLabelClassName}`}>
              Firm Layout Name<span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="invoiceLayout"
              rules={{ required: "Task Name is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  defaultValue={""}
                  className={` ${inputAntdSelectClassName} ${errors.invoiceLayout
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  onFocus={() => {
                    dispatch(
                      officeAddressSearch({
                        companyId:
                          userInfoglobal?.userType === "admin"
                            ? watch("PDCompanyId")
                            : userInfoglobal?.userType === "company"
                              ? userInfoglobal?._id
                              : userInfoglobal?.companyId,
                        branchId:
                          userInfoglobal?.userType === "company" ||
                            userInfoglobal?.userType === "admin" ||
                            userInfoglobal?.userType === "companyDirector"
                            ? watch("PDBranchId")
                            : userInfoglobal?.userType === "companyBranch"
                              ? userInfoglobal?._id
                              : userInfoglobal?.branchId,
                        directorId: "",
                        text: "",
                        sort: true,
                        status: true,
                        type: "invoice",
                        isPagination: false,
                        bankAccountId: "",
                        isGSTEnabled: "",
                      })
                    );
                  }}
                >
                  <Select.Option className="" value="">
                    Select Layout
                  </Select.Option>

                  {officeAddressLoading ? <Select.Option disabled>
                    <ListLoader />
                  </Select.Option> : (sortByPropertyAlphabetically(officeAddressListData, 'firmName')?.map((element) => (
                    <Select.Option value={element?._id}>
                      {element?.firmName}
                    </Select.Option>
                  )))}
                </Select>
              )}
            />

            {errors.invoiceLayout && (
              <p className="text-red-500 text-sm">
                {errors.invoiceLayout.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
          {selectedClient && (
            <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-1 pb-0.5 border-b border-gray-100">Client Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DetailItem label="Client" value={selectedClient?.fullName} />
                <DetailItem label="GST Number" value={selectedClient?.clientProfile?.GSTNumber || '-'} />
                <DetailItem
                  label="Address"
                  value={`${selectedClient?.addresses?.primary?.city ?? '-'} , ${selectedClient?.addresses?.primary?.state ?? '-'}, ${selectedClient?.addresses?.primary?.country ?? '-'} , ${selectedClient?.addresses?.primary?.pinCode ?? '-'}`}
                />
                <DetailItem
                  label="Mobile"
                  value={`${selectedClient?.mobile?.code} ${selectedClient?.mobile?.number}`}
                />
              </div>
            </div>
          )}

          {selectedlayout && (
            <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-1 pb-0.5 border-b border-gray-100">Firm Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DetailItem label="Firm Name" value={selectedlayout?.firmName} />
                <DetailItem
                  label="GST Number"
                  value={selectedlayout?.isGSTEnabled ? selectedlayout?.gstNumber : '-'}
                />
                <DetailItem
                  label="Address"
                  value={`${selectedlayout?.address?.city ?? "-"}, ${selectedlayout?.address?.state ?? "-"}, ${selectedlayout?.address?.country ?? "-"} , ${selectedlayout?.address?.pinCode ?? "-"}`}
                />
                <DetailItem
                  label="Mobile"
                  value={`${selectedlayout?.mobile?.code} ${selectedlayout?.mobile?.number}`}
                />
              </div>
            </div>
          )}
        </div>


        <div className="space-y-2">
          {fields.map((field, index) => (
            <div className="border border-gray-300 rounded-md">
              <div className="flex flex-col items-end">
                <div className="w-full bg-header flex justify-end items-center rounded-tl-md rounded-tr-md p-1">
                  <button type="button" onClick={() => remove(index)}>
                    <RiDeleteBin5Line
                      className="text-white w-12 hover:text-white"
                      size={20}
                    />
                  </button>
                </div>
              </div>
              <div
                className={`grid sm:grid-cols-2 gap-2 md:grid-cols-4 p-2`}
              >
                <div
                  className={
                    watch("isAlltask") ? "hidden w-full" : "block w-full"
                  }
                >
                  <label className={`${inputLabelClassName}`}>Task</label>

                  <Controller
                    control={control}
                    name={`tasks[${index}].taskType`}
                    rules={{ required: "Task Type is required" }}
                    render={({ field }) => (
                      <Select
                        // {...field}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName}`}
                        onChange={(value) => {
                
                          if (value) {
                            const data = finalTaskType?.find(
                              (task) => task._id === value
                            );
                            if (data) {
                              setValue(
                                `tasks[${index}].tasktypeId`,
                                data?._id
                              );
                              setValue(
                                `tasks[${index}].amount`,
                                data?.taskFee
                              );
                              setValue(
                                `tasks[${index}].gstRate`,
                                data?.GSTRate
                              );
                              setValue(
                                `tasks[${index}].gstAmount`,
                                data?.taskFee * (data?.GSTRate / 100)
                              );
                              setValue(
                                `tasks[${index}].hsnCode`,
                                data?.HSNCode
                              );
                              setValue(
                                `tasks[${index}].totalAmount`,
                                data?.taskFee * (data?.GSTRate / 100) +
                                Number(data?.taskFee)
                              );
                              setValue(
                                `tasks[${index}].igst`,
                                data?.taskFee * (data?.GSTRate / 100)
                              );
                              setValue(
                                `tasks[${index}].cgst`,
                                (data?.taskFee * (data?.GSTRate / 100)) /
                                2
                              );
                              setValue(
                                `tasks[${index}].sgst`,
                                (data?.taskFee * (data?.GSTRate / 100)) /
                                2
                              );
                            }
                          } else {
                            setValue(`tasks[${index}].tasktypeId`, "");
                            setValue(`tasks[${index}].amount`, 0);
                            setValue(`tasks[${index}].gstRate`, 0);
                            setValue(`tasks[${index}].gstAmount`, 0);
                            setValue(`tasks[${index}].hsnCode`, "");
                            setValue(`tasks[${index}].totalAmount`, 0);
                            setValue(`tasks[${index}].igst`, 0);
                            setValue(`tasks[${index}].cgst`, 0);
                            setValue(`tasks[${index}].sgst`, 0);
                          }

                          field.onChange(value);
                        }}

                      >
                        <Select.Option value="">
                          Select Task
                        </Select.Option>
                        {getAvailableTasks(index)?.map((data) => (
                          <Select.Option
                            key={data?._id}
                            value={data?._id}
                          >
                            {data?.taskName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.tasks?.[index]?.taskType && (
                    <p className="text-red-500 text-sm">
                      {errors.tasks?.[index]?.taskType?.message}
                    </p>
                  )}
                </div>
                <div
                  className={
                    !watch("isAlltask") ? "hidden w-full" : "block w-full"
                  }
                >
                  <label className={`${inputLabelClassName}`}>Task</label>
                  <input
                    type="text"
                    disabled
                    {...register(`tasks[${index}].taskName`)}
                    className={`${inputClassName}`}
                    placeholder="Task Name"
                  />
                  {errors.tasks?.[index]?.taskName && (
                    <p className="text-red-500 text-sm">
                      {errors.tasks?.[index]?.taskName?.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    HSN Code
                  </label>
                  <input
                    type="text"
                    disabled={watch(`tasks[${index}].tasktypeId`) !== "other"}
                    {...register(`tasks[${index}].hsnCode`, {})}
                    className={`${inputClassName}`}
                    placeholder="HSN CODE"
                  />
                  {errors.tasks?.[index]?.hsnCode && (
                    <p className="text-red-500 text-sm">
                      {errors.tasks?.[index]?.hsnCode?.message}
                    </p>
                  )}
                </div>
                {watch(`tasks[${index}].tasktypeId`) === "other" && (
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Description
                    </label>
                    <input
                      type="text"
                      {...register(`tasks[${index}].description`, {})}
                      className={`${inputClassName}`}
                      placeholder="Description"
                    />
                    {errors.tasks?.[index]?.description && (
                      <p className="text-red-500 text-sm">
                        {errors.tasks?.[index]?.description?.message}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Amount
                  </label>
                  <input
                    type="text"
                    {...register(`tasks[${index}].amount`, {})}
                    className={`${inputClassName}`}
                    placeholder="Amount"
                    disabled={
                      watch(`tasks[${index}].tasktypeId`) !== "other"
                    }

                  />
                  {errors?.tasks?.[index]?.amount && (
                    <p className="text-red-500 text-sm">
                      {errors?.tasks?.[index]?.amount?.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Discount
                  </label>
                  <input
                    type="number"
                    {...register(`tasks[${index}].discount`, {})}
                    className={`${inputClassName}`}
                    placeholder="Discount"
                  />
                  {errors.tasks?.[index]?.discount && (
                    <p className="text-red-500 text-sm">
                      {errors.tasks?.[index]?.discount?.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    {...register(`tasks[${index}].discountedPrice`, {})}
                    className={`${inputClassName}`}
                    placeholder="discountedPrice"
                  />
                  {errors.tasks?.[index]?.discountedPrice && (
                    <p className="text-red-500 text-sm">
                      {errors.tasks?.[index]?.discountedPrice?.message}
                    </p>
                  )}
                </div>
                {isgstType &&
                  
                  (
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        GST Rate
                      </label>
                      <input
                        type="text"
                        disabled={watch(`tasks[${index}].tasktypeId`) !== "other"}
                        {...register(`tasks[${index}].gstRate`, {})}
                        className={`${inputClassName}`}
                        
                        placeholder="GST Rate"
                      />
                      {errors?.tasks?.[index]?.gstRate && (
                        <p className="text-red-500 text-sm">
                          {errors?.tasks?.[index]?.gstRate?.message}
                        </p>
                      )}
                    </div>
                  )}
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Final Amount
                  </label>
                  <input
                    type="number"
                    {...register(`tasks[${index}].finalAmount`, {})}
                    className={`${inputClassName}`}
                    placeholder="Final Amount"
                  />
                  {errors.tasks?.[index]?.finalAmount && (
                    <p className="text-red-500 text-sm">
                      {errors.tasks?.[index]?.finalAmount?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {finalTaskType.length > fields?.length && (
            <button
              type="button"
              onClick={() =>
                append({ taskType1: "", taskType2: "", amount: "" })
              }
              className={
                watch("isAlltask")
                  ? "hidden"
                  : "bg-header text-white p-2 px-4 rounded mt-4"
              }
            >
              Add Task Details
            </button>
          )}
        </div>
      </form>
    </GlobalLayout>
  );
};

export default Createinvoice;


const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-sm text-gray-800 mt-1">{value ?? "-"}</p>
  </div>
);