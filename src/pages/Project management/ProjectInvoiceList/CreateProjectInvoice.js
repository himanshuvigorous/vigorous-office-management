import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  customDayjs,
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { Select } from "antd";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { ServerManagementSearch } from "../../ServerManagement/serverManagementFeatures/_server-management_reducers";
import { projectserviceSearch } from "../ProjectServices/projectserviceFeatures/_projectservice_reducers";
import { decrypt } from "../../../config/Encryption";
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { createprojectInvoiceFunc } from "./ProjectInvoiceFeatures/_ProjectInvoice_reducers";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import Swal from "sweetalert2";



function CreateProjectInvoice() {
  const { loading: projectManagementLoader } = useSelector((state) => state.projectManagement);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      billing: {
        duration: "Weekly",
        schedule: {
          weekly: { day: "Monday" },
          monthly: { date: 1 },
          quartAndYearly: { month: "January", date: 1 }
        }
      },
      projectType: "product",
      priority: "Medium",
      billingType: "isBillable",
      employeIds: [],
      items: [{
        type: "",
        amount: 0,
        name: "",
        expenseId: "",
        serverId: "",
        GSTRate: 0,
        GSTAmount: 0,
        amountAfterGST: 0,
        remark: ""
      }], // Changed from services to items to include both services and servers
      tags: [],
      filePath: [],
      subTotal: 0,
      finalAmount: 0
    }
  });
  const [searchparams] = useSearchParams()
  const initaldata = searchparams.get("element") ? decrypt(searchparams.get("element")) : ""
  const parentdata = initaldata ? JSON.parse(initaldata) : ""
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));

  // Selectors
  const { ServerManagementList, loading: serverLoading } = useSelector(state => state.serverManagement);
  const { projectserviceList, loading: projectservicesLoading } = useSelector((state) => state.projectservice);

  // Local state
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });
  // Watched values

  const items = useWatch({ control, name: "items", defaultValue: [] });

  // Calculate totals whenever relevant fields change
  useEffect(() => {
    const subTotal = (items || []).reduce((sum, item) => sum + (Number(item?.amount) || 0), 0);
    const finalAmount = subTotal;
    setValue("subTotal", subTotal);
    setValue("finalAmount", finalAmount);
  }, [items, setValue]);

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: parentdata?.companyId,
      directorId: parentdata?.directorId,
      branchId: parentdata?.branchId,
      managerId: "",
      projectId: parentdata?._id,
      invoiceType: 'debit',
      invoiceDate: customDayjs(data?.invoiceDate),
      clientId: parentdata?.clientId || "",
      items: data.items?.map((item) => ({
        type: item.type,
        amount: item.amount ? +item.amount : 0,
        name:
          item.type === "service"
            ? projectserviceList.find(service => service._id === item.expenseId)?.name
            : item.type === "server"
              ? ServerManagementList.find(server => server._id === item.expenseId)?.serverName
              : item?.name,
        expenseId: item.type === "service" ? (item.expenseId || "") : null,
        serverId: item.type === "server" ? (item.expenseId || "") : null,
        GSTRate: + item?.GSTRate,
        GSTAmount: + item?.GSTAmount,
        amountAfterGST: +item?.amountAfterGST,
        remark: item.remark || ""
      })) || [],
      subTotal: + data.subTotal,
      GSTTotal: +data?.GSTTotal,
      finalWithGSTAmount: + data?.finalWithGSTAmount,
      terms: ""

    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Once submitted, this entry cannot be edited. Do you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(createprojectInvoiceFunc(finalPayload)).then((data) => {
          if (!data.error) navigate(-1);
        });
      }
    });
  };



  const fetchServerData = () => {
    dispatch(ServerManagementSearch({
      companyId: parentdata?.companyId,
      branchId: parentdata?.branchId,
      text: '',
      sort: true,
      status: '',
      isPagination: false,
    }));
  };

  const fetchProjectServices = () => {
    dispatch(projectserviceSearch({
      companyId: parentdata?.companyId,
      branchId: parentdata?.branchId,
      text: '',
      sort: true,
      status: '',
      isPagination: false,
    }));
  };
  useEffect(() => {
    fetchServerData();
    fetchProjectServices();
  }, []);

  const calculateGST = (index, amount, gstRate) => {
    const gstAmount = (amount * gstRate) / 100;
    const amountAfterGST = amount + gstAmount;

    setValue(`items.${index}.GSTAmount`, gstAmount);
    setValue(`items.${index}.amountAfterGST`, amountAfterGST);

    // Update financial summary
    updateFinancialSummary();
  };

  const calculateSubtotal = () => {
    const items = watch('items') || [];
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateTotalGST = () => {
    const items = watch('items') || [];
    return items.reduce((sum, item) => sum + (item.GSTAmount || 0), 0);
  };

  const calculateTotalWithGST = () => {
    const items = watch('items') || [];
    return items.reduce((sum, item) => sum + (item.amountAfterGST || 0), 0);
  };

  const updateFinancialSummary = () => {
    const subtotal = calculateSubtotal();
    const totalGST = calculateTotalGST();
    const totalWithGST = calculateTotalWithGST();

    setValue('subTotal', subtotal);
    setValue('GSTTotal', totalGST);
    setValue('finalWithGSTAmount', totalWithGST);
  };
  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>

          {/* Services/Servers Section */}
          <div className="p-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Services & Servers
            </h2>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 border rounded p-2">
                  {/* Type - col-span-2 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Type</label>
                    <Controller
                      control={control}
                      name={`items.${index}.type`}
                      rules={{ required: 'Type is required' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`${inputAntdSelectClassName}`}
                          placeholder="Select Type"
                          onChange={(value) => {
                            field.onChange(value);
                            // Reset expenseId when type changes
                            setValue(`items.${index}.expenseId`, "");
                            setValue(`items.${index}.name`, "");
                          }}
                        >
                          <Select.Option value="">Select Type</Select.Option>
                          {['service', 'server', 'other'].map((type) => (
                            <Select.Option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.items?.[index]?.type && (
                      <p className="text-red-500 text-sm">
                        {errors.items?.[index]?.type?.message}
                      </p>
                    )}
                  </div>

                  {/* Service/Server/Other Name - col-span-3 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      {watch(`items.${index}.type`) === 'service' ? 'Service' :
                        watch(`items.${index}.type`) === 'server' ? 'Server' : 'Name'}
                    </label>
                    {watch(`items.${index}.type`) === 'other' ? (
                      <Controller
                        name={`items.${index}.name`}
                        control={control}
                        rules={{ required: 'Name is required' }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`${inputClassName}`}
                            placeholder="Enter name"
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        control={control}
                        name={`items.${index}.expenseId`}
                        rules={{
                          required: `${watch(`items.${index}.type`) === 'service' ? 'Service' : 'Server'} is required`,
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            loading={watch(`items.${index}.type`) === 'service' ? projectservicesLoading : serverLoading}
                            className={`${inputAntdSelectClassName}`}
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                            onChange={(value, option) => {
                              field.onChange(value);
                              // Set the name when item is selected
                              const name = option?.children || "";
                              setValue(`items.${index}.name`, name);
                            }}
                          >
                            <Select.Option value="">
                              Select {watch(`items.${index}.type`) === 'service' ? 'Service' : 'Server'}
                            </Select.Option>
                            {watch(`items.${index}.type`) === 'service' ? (
                              projectservicesLoading ? (
                                <Select.Option disabled>
                                  <ListLoader />
                                </Select.Option>
                              ) : (
                                sortByPropertyAlphabetically(projectserviceList, 'name')?.map((type) => (
                                  <Select.Option key={type?._id} value={type?._id}>
                                    {type?.name}
                                  </Select.Option>
                                ))
                              )
                            ) : serverLoading ? (
                              <Select.Option disabled>
                                <ListLoader />
                              </Select.Option>
                            ) : (
                              sortByPropertyAlphabetically(ServerManagementList, 'serverName')?.map(
                                (server) => (
                                  <Select.Option key={server?._id} value={server?._id}>
                                    {server?.serverName}
                                  </Select.Option>
                                )
                              )
                            )}
                          </Select>
                        )}
                      />
                    )}
                    {errors.items?.[index]?.expenseId && watch(`items.${index}.type`) !== 'other' && (
                      <p className="text-red-500 text-sm">
                        {errors.items?.[index]?.expenseId?.message}
                      </p>
                    )}
                    {errors.items?.[index]?.name && watch(`items.${index}.type`) === 'other' && (
                      <p className="text-red-500 text-sm">
                        {errors.items?.[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  {/* Amount - col-span-2 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Amount</label>
                    <Controller
                      name={`items.${index}.amount`}
                      control={control}
                      rules={{ required: 'Amount is required', min: 0 }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          className={`${inputClassName}`}
                          placeholder="Amount"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            field.onChange(value);
                            // Recalculate GST when amount changes
                            const gstRate = watch(`items.${index}.GSTRate`) || 0;
                            calculateGST(index, value, gstRate);
                          }}
                        />
                      )}
                    />
                    {errors.items?.[index]?.amount && (
                      <p className="text-red-500 text-sm">
                        {errors.items?.[index]?.amount?.message}
                      </p>
                    )}
                  </div>

                  {/* GST Rate - col-span-1 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>GST %</label>
                    <Controller
                      name={`items.${index}.GSTRate`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`${inputAntdSelectClassName}`}
                          placeholder="GST %"
                          onChange={(value) => {
                            field.onChange(value);
                            // Recalculate GST when rate changes
                            const amount = watch(`items.${index}.amount`) || 0;
                            calculateGST(index, amount, value);
                          }}
                        >
                          <Select.Option value={0}>0%</Select.Option>
                          <Select.Option value={5}>5%</Select.Option>
                          <Select.Option value={12}>12%</Select.Option>
                          <Select.Option value={18}>18%</Select.Option>
                          <Select.Option value={28}>28%</Select.Option>
                        </Select>
                      )}
                    />
                  </div>

                  {/* GST Amount (display only) - col-span-1 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>GST Amt</label>
                    <div className={`${inputClassName} bg-gray-100 flex items-center justify-center`}>
                      ₹{(watch(`items.${index}.GSTAmount`) || 0).toFixed(2)}
                    </div>
                  </div>

                  {/* Total with GST (display only) - col-span-1 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Total</label>
                    <div className={`${inputClassName} bg-gray-100 flex items-center justify-center`}>
                      ₹{(watch(`items.${index}.amountAfterGST`) || 0).toFixed(2)}
                    </div>
                  </div>

                  {/* Remark and Remove - col-span-1 on md, full on mobile */}
                  <div className="flex items-end md:col-span-2 w-full">
                    <div className="w-full" >
                      <label className={`${inputLabelClassName}`}>Remark</label>
                      <Controller
                        name={`items.${index}.remark`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`${inputClassName} flex-grow`}
                            placeholder="Remark"
                          />
                        )}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-2 text-red-500 h-10 px-2 flex items-center justify-center bg-red-50 rounded"
                    >
                      <CloseOutlined />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Button */}
              <button
                type="button"
                onClick={() => append({
                  type: "",
                  expenseId: "",
                  name: "",
                  amount: 0,
                  GSTRate: 0,
                  GSTAmount: 0,
                  amountAfterGST: 0,
                  remark: ""
                })}
                className="mt-2 text-blue-500 flex items-center"
              >
                <PlusOutlined className="mr-1" /> Add Item
              </button>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Financial Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-gray-600">Subtotal:</p>
                <p className="text-xl font-bold text-blue-600">₹{calculateSubtotal().toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-gray-600">Total GST:</p>
                <p className="text-xl font-bold text-green-600">₹{calculateTotalGST().toFixed(2)}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="text-gray-600">Total with GST:</p>
                <p className="text-xl font-bold text-purple-600">₹{calculateTotalWithGST().toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div>
            <label className={`${inputLabelClassName}`}>
              Invoice Date <span className="text-red-600">*</span>
            </label>
            <Controller
              name="invoiceDate"
              control={control}
              rules={{ required: "Invoice date is required" }}
              render={({ field }) => (
                <CustomDatePicker
                  field={field}
                  errors={errors}
                  disabledDate={(current) => {
                    return current && current.isAfter(moment(), 'day');
                  }}
                />
              )}
            />
            {errors.invoiceDate && (
              <p className="text-red-500 text-sm">Invoice date is required</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={projectManagementLoader}
              className={`${projectManagementLoader ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {projectManagementLoader ? <Loader /> : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default CreateProjectInvoice;