import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  customDayjs,
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
// import { projectSearch } from "../projectManagement/projectFeatures/_project_reducers";
// import { createInvoice } from "./invoiceFeatures/_invoice_reducers";
import { Select, DatePicker, Input, Button, Tag, Form, Divider, Row, Col, Checkbox } from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { projectmanagementSearch } from "../ProjectManagement/ProjectManagementFeatures/_ProjectManagement_reducers";

const { TextArea } = Input;

const CreateProjectInvoice = () => {
  const { loading: invoiceLoading } = useSelector((state) => state.invoice);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceType: "debit",
      isDiscountApplicable: true,
      discountType: "amount",
      isGSTApplicable: true,
      items: [],
      paymentMethod: "Cash",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListLoading } = useSelector((state) => state.branch);
  const { employeList, employeListLoading } = useSelector((state) => state.employe);
  const { clientList, clientListLoading } = useSelector((state) => state.client);
  const { projectList, projectListLoading } = useSelector((state) => state.projectManagement);
  const { expenseTypeList, expenseTypeListLoading } = useSelector((state) => state.projectservice);
  
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const CompanyId = useWatch({ control, name: "companyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "branchId", defaultValue: "" });
  const isDiscountApplicable = useWatch({ control, name: "isDiscountApplicable", defaultValue: false });
  const isGSTApplicable = useWatch({ control, name: "isGSTApplicable", defaultValue: false });
  const items = useWatch({ control, name: "items", defaultValue: [] });

  // Local state
  const [itemInputs, setItemInputs] = useState([{ expenseId: "", amount: "", remark: "" }]);

  // Calculate totals whenever relevant fields change
  useEffect(() => {
    calculateTotals();
  }, [items, isDiscountApplicable, isGSTApplicable, watch("discountRate"), watch("discountAmount"), watch("gstRate")]);

  // Form submission
  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      invoiceDate: customDayjs(data.invoiceDate),
      paymentDate: data.paymentDate ? customDayjs(data.paymentDate) : null,
      items: data.items.filter(item => item.expenseId && item.amount), // Remove empty items
    };
    
    // dispatch(createInvoice(formattedData)).then((res) => {
    //   if (!res.error) {
    //     navigate(-1);
    //   }
    // });
  };

  // Calculate subtotal, discount, GST, and total
  const calculateTotals = () => {
    const subtotal = items.length >0 ?  items?.reduce((sum, item) => sum + (Number(item.amount) || 0, 0)) : 0;
    setValue("subtotal", subtotal);

    let discountAmount = 0;
    if (isDiscountApplicable) {
      if (getValues("discountType") === "percentage") {
        const discountRate = Number(getValues("discountRate")) || 0;
        discountAmount = subtotal * (discountRate / 100);
      } else {
        discountAmount = Number(getValues("discountAmount")) || 0;
      }
    }
    setValue("discountAmount", discountAmount);

    let gstAmount = 0;
    if (isGSTApplicable) {
      const gstRate = Number(getValues("gstRate")) || 0;
      gstAmount = (subtotal - discountAmount) * (gstRate / 100);
    }
    setValue("GSTAmount", gstAmount);

    const totalAmount = subtotal - discountAmount + gstAmount;
    setValue("totalAmount", totalAmount);

    const amountPaid = Number(getValues("amountPaid")) || 0;
    setValue("balanceDue", totalAmount - amountPaid);
  };

  // Fetch data based on dependencies
  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(companySearch({ text: "", sort: true, status: true, isPagination: false }));
    }
  }, []);

  useEffect(() => {
    if (CompanyId || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") {
      dispatch(branchSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "admin" ? CompanyId : 
                 userInfoglobal?.userType === "company" ? userInfoglobal?._id : 
                 userInfoglobal?.companyId,
      }));
    }
  }, [CompanyId]);

  useEffect(() => {
    if (BranchId || userInfoglobal?.userType === "companyBranch") {
      const companyId = userInfoglobal?.userType === "admin" ? CompanyId : 
                      userInfoglobal?.userType === "company" ? userInfoglobal?._id : 
                      userInfoglobal?.companyId;
      
      const branchId = userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : BranchId;

      dispatch(employeSearch({
        text: "",
        status: true,
        sort: true,
        isPagination: false,
        companyId,
        branchId,
        isAccountent: true
      }));

      dispatch(clientSearch({
        text: "",
        status: true,
        sort: true,
        isPagination: false,
        companyId,
        branchId
      }));

      dispatch(projectmanagementSearch({
        text: "",
        status: true,
        sort: true,
        isPagination: false,
        companyId,
        branchId
      }));

      dispatch(expenseTypeSearch({
        text: "",
        status: true,
        sort: true,
        isPagination: false,
        companyId,
        branchId
      }));
    }
  }, [BranchId]);

  // Item management
  const handleItemAdd = () => {
    setItemInputs([...itemInputs, { expenseId: "", amount: "", remark: "" }]);
  };

  const handleItemRemove = (index) => {
    const newItems = [...itemInputs];
    newItems.splice(index, 1);
    setItemInputs(newItems);
    
    const formItems = getValues("items");
    formItems.splice(index, 1);
    setValue("items", formItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...itemInputs];
    newItems[index][field] = value;
    setItemInputs(newItems);
    
    const formItems = getValues("items");
    formItems[index] = formItems[index] || {};
    formItems[index][field] = value;
    
    // If expenseId changed, update the expenseName
    if (field === "expenseId") {
      const selectedExpense = expenseTypeList.find(exp => exp._id === value);
      if (selectedExpense) {
        formItems[index].expenseName = selectedExpense.name;
      }
    }
    
    setValue("items", formItems);
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 md:my-1 px-3 md:mt-4">
            {/* Company Select (for admin) */}
            {userInfoglobal?.userType === "admin" && (
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Company <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="companyId"
                  rules={{ required: "Company is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      loading={companyListLoading}
                      className={`${inputAntdSelectClassName}`}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? (
                        <Select.Option disabled><ListLoader /></Select.Option>
                      ) : (
                        sortByPropertyAlphabetically(companyList, 'fullName')?.map((company) => (
                          <Select.Option key={company?._id} value={company?._id}>
                            {company?.fullName}
                          </Select.Option>
                        ))
                      )}
                    </Select>
                  )}
                />
                {errors.companyId && (
                  <p className="text-red-500 text-sm">{errors.companyId.message}</p>
                )}
              </div>
            )}

            {/* Branch Select */}
            {(userInfoglobal?.userType === "admin" || 
              userInfoglobal?.userType === "company" || 
              userInfoglobal?.userType === "companyDirector") && (
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Branch <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="branchId"
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      loading={branchListLoading}
                      className={`${inputAntdSelectClassName}`}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListLoading ? (
                        <Select.Option disabled><ListLoader /></Select.Option>
                      ) : (
                        sortByPropertyAlphabetically(branchList, 'fullName')?.map((branch) => (
                          <Select.Option key={branch?._id} value={branch?._id}>
                            {branch?.fullName}
                          </Select.Option>
                        ))
                      )}
                    </Select>
                  )}
                />
                {errors.branchId && (
                  <p className="text-red-500 text-sm">{errors.branchId.message}</p>
                )}
              </div>
            )}

            {/* Client Select */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Client</label>
              <Controller
                control={control}
                name="clientId"
                render={({ field }) => (
                  <Select
                    {...field}
                    loading={clientListLoading}
                    className={`${inputAntdSelectClassName}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Client</Select.Option>
                    {clientListLoading ? (
                      <Select.Option disabled><ListLoader /></Select.Option>
                    ) : (
                      sortByPropertyAlphabetically(clientList, 'fullName')?.map((client) => (
                        <Select.Option key={client?._id} value={client?._id}>
                          {client?.fullName}
                        </Select.Option>
                      ))
                    )}
                  </Select>
                )}
              />
            </div>

            {/* Accountant Select */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Accountant</label>
              <Controller
                control={control}
                name="accountentId"
                render={({ field }) => (
                  <Select
                    {...field}
                    loading={employeListLoading}
                    className={`${inputAntdSelectClassName}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Accountant</Select.Option>
                    {employeListLoading ? (
                      <Select.Option disabled><ListLoader /></Select.Option>
                    ) : (
                      sortByPropertyAlphabetically(employeList, 'fullName')
                        ?.filter(emp => emp.isAccountent)
                        ?.map((employee) => (
                          <Select.Option key={employee?._id} value={employee?._id}>
                            {employee?.fullName}
                          </Select.Option>
                        ))
                    )}
                  </Select>
                )}
              />
            </div>

            {/* Project Select */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Project</label>
              <Controller
                control={control}
                name="projectId"
                render={({ field }) => (
                  <Select
                    {...field}
                    loading={projectListLoading}
                    className={`${inputAntdSelectClassName}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Project</Select.Option>
                    {projectListLoading ? (
                      <Select.Option disabled><ListLoader /></Select.Option>
                    ) : (
                      sortByPropertyAlphabetically(projectList, 'title')?.map((project) => (
                        <Select.Option key={project?._id} value={project?._id}>
                          {project?.title}
                        </Select.Option>
                      ))
                    )}
                  </Select>
                )}
              />
            </div>

            {/* Bank Account Select */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Bank Account</label>
              <Controller
                control={control}
                name="bankAccountId"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName}`}
                  >
                    <Select.Option value="">Select Bank Account</Select.Option>
                    {/* Bank accounts would need to be fetched from your API */}
                    <Select.Option value="bank1">Bank Account 1</Select.Option>
                    <Select.Option value="bank2">Bank Account 2</Select.Option>
                  </Select>
                )}
              />
            </div>

            {/* Invoice Type */}
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Invoice Type <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="invoiceType"
                rules={{ required: "Invoice type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName}`}
                  >
                    <Select.Option value="debit">Debit</Select.Option>
                    <Select.Option value="credit">Credit</Select.Option>
                  </Select>
                )}
              />
              {errors.invoiceType && (
                <p className="text-red-500 text-sm">{errors.invoiceType.message}</p>
              )}
            </div>

            {/* Invoice Date */}
            <div className="">
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
                  />
                )}
              />
              {errors.invoiceDate && (
                <p className="text-red-500 text-sm">{errors.invoiceDate.message}</p>
              )}
            </div>

            {/* Payment Date */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Payment Date</label>
              <Controller
                name="paymentDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    disabledDate={(current) => {
                      const invoiceDate = watch("invoiceDate");
                      return invoiceDate && current && current.isBefore(dayjs(invoiceDate), "day");
                    }}
                  />
                )}
              />
            </div>

            {/* Payment Method */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Payment Method</label>
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName}`}
                  >
                    <Select.Option value="Cash">Cash</Select.Option>
                    <Select.Option value="Bank Transfer">Bank Transfer</Select.Option>
                    <Select.Option value="Cheque">Cheque</Select.Option>
                    <Select.Option value="Credit Card">Credit Card</Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                  </Select>
                )}
              />
            </div>

            {/* Payment Reference */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Payment Reference</label>
              <input
                type="text"
                {...register("paymentReference")}
                className={`${inputClassName}`}
                placeholder="Transaction reference"
              />
            </div>

            {/* Divider */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="font-semibold text-lg">Invoice Items</h3>
            </div>

            {/* Invoice Items */}
            {itemInputs.map((item, index) => (
              <div key={index} className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`${inputLabelClassName}`}>Item {index + 1}</label>
                  <Controller
                    control={control}
                    name={`items[${index}].expenseId`}
                    render={({ field }) => (
                      <Select
                        {...field}
                        loading={expenseTypeListLoading}
                        className={`${inputAntdSelectClassName}`}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => handleItemChange(index, 'expenseId', value)}
                        value={item.expenseId}
                      >
                        <Select.Option value="">Select Item</Select.Option>
                        {expenseTypeListLoading ? (
                          <Select.Option disabled><ListLoader /></Select.Option>
                        ) : (
                          sortByPropertyAlphabetically(expenseTypeList, 'name')?.map((type) => (
                            <Select.Option key={type?._id} value={type?._id}>
                              {type?.name}
                            </Select.Option>
                          ))
                        )}
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <label className={`${inputLabelClassName}`}>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                    className={`${inputClassName}`}
                    placeholder="Amount"
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex-grow">
                    <label className={`${inputLabelClassName}`}>Remark</label>
                    <input
                      type="text"
                      value={item.remark}
                      onChange={(e) => handleItemChange(index, 'remark', e.target.value)}
                      className={`${inputClassName}`}
                      placeholder="Remark"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleItemRemove(index)}
                    className="ml-2 text-red-500 p-2"
                  >
                    <MinusOutlined />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Item Button */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleItemAdd}
                className="text-blue-500 flex items-center"
              >
                <PlusOutlined className="mr-1" /> Add Item
              </button>
            </div>

            {/* Divider */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="font-semibold text-lg">Pricing Summary</h3>
            </div>

            {/* Subtotal */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Subtotal</label>
              <input
                type="number"
                step="0.01"
                {...register("subtotal")}
                className={`${inputClassName} bg-gray-100`}
                readOnly
              />
            </div>

            {/* Discount Section */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <Controller
                  name="isDiscountApplicable"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        if (!e.target.checked) {
                          setValue("discountAmount", 0);
                          setValue("discountRate", 0);
                        }
                      }}
                    >
                      Apply Discount
                    </Checkbox>
                  )}
                />
              </div>

              {isDiscountApplicable && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`${inputLabelClassName}`}>Discount Type</label>
                    <Controller
                      control={control}
                      name="discountType"
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`${inputAntdSelectClassName}`}
                        >
                          <Select.Option value="amount">Fixed Amount</Select.Option>
                          <Select.Option value="percentage">Percentage</Select.Option>
                        </Select>
                      )}
                    />
                  </div>
                  {watch("discountType") === "amount" ? (
                    <div>
                      <label className={`${inputLabelClassName}`}>Discount Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("discountAmount")}
                        className={`${inputClassName}`}
                        placeholder="0.00"
                        onChange={() => calculateTotals()}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className={`${inputLabelClassName}`}>Discount Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("discountRate")}
                        className={`${inputClassName}`}
                        placeholder="0.00"
                        onChange={() => calculateTotals()}
                      />
                    </div>
                  )}
                  <div>
                    <label className={`${inputLabelClassName}`}>Discount Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("discountAmount")}
                      className={`${inputClassName} bg-gray-100`}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>

            {/* GST Section */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <Controller
                  name="isGSTApplicable"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        if (!e.target.checked) {
                          setValue("GSTAmount", 0);
                          setValue("gstRate", 0);
                        }
                      }}
                    >
                      Apply GST
                    </Checkbox>
                  )}
                />
              </div>

              {isGSTApplicable && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`${inputLabelClassName}`}>GST Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("gstRate")}
                      className={`${inputClassName}`}
                      placeholder="18.00"
                      onChange={() => calculateTotals()}
                    />
                  </div>
                  <div>
                    <label className={`${inputLabelClassName}`}>GST Number</label>
                    <input
                      type="text"
                      {...register("gstNumber")}
                      className={`${inputClassName}`}
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                  <div>
                    <label className={`${inputLabelClassName}`}>GST Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("GSTAmount")}
                      className={`${inputClassName} bg-gray-100`}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Total Amount */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Total Amount</label>
              <input
                type="number"
                step="0.01"
                {...register("totalAmount")}
                className={`${inputClassName} bg-gray-100 font-semibold`}
                readOnly
              />
            </div>

            {/* Amount Paid */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Amount Paid</label>
              <input
                type="number"
                step="0.01"
                {...register("amountPaid", {
                  onChange: () => calculateTotals()
                })}
                className={`${inputClassName}`}
                placeholder="0.00"
              />
            </div>

            {/* Balance Due */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Balance Due</label>
              <input
                type="number"
                step="0.01"
                {...register("balanceDue")}
                className={`${inputClassName} bg-gray-100 font-semibold`}
                readOnly
              />
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className={`${inputLabelClassName}`}>Remarks</label>
              <TextArea
                {...register("remark")}
                rows={3}
                className={`${inputClassName}`}
                placeholder="Additional notes or instructions"
              />
            </div>

            {/* Terms */}
            <div className="md:col-span-2">
              <label className={`${inputLabelClassName}`}>Terms & Conditions</label>
              <TextArea
                {...register("terms")}
                rows={3}
                className={`${inputClassName}`}
                placeholder="Payment terms and conditions"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end p-4">
            <button
              type="submit"
              disabled={invoiceLoading}
              className={`${invoiceLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-6 rounded mt-3`}
            >
              {invoiceLoading ? <Loader /> : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateProjectInvoice;