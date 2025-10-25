import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, message, Descriptions } from 'antd';
import { Controller, useForm, useWatch } from 'react-hook-form';
import CustomDatePicker from '../../../global_layouts/DatePicker/CustomDatePicker';
import moment from 'moment';
import Loader from '../../../global_layouts/Loader';
import { customDayjs, inputAntdSelectClassName, inputLabelClassName, optionLabelForBankSlect } from '../../../constents/global';
import { useDispatch, useSelector } from 'react-redux';
import { accountantSearch } from '../accountantmanagement/accountManagentFeatures/_accountManagement_reducers';
import { createprojectInvoiceFunc } from './ProjectInvoiceFeatures/_ProjectInvoice_reducers';

const { Option } = Select;

const PaymentEntryModal = ({ visible, onCancel, parentdata, fetchprojectInvoice, refrensedata }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const dispatch = useDispatch()
  const loading = false
  const paymentMethod = useWatch({
    control,
    name: "paymentMethod",
    defaultValue: "",
  });
  const accountant = useWatch({
    control,
    name: "accountant",
    defaultValue: "",
  });
  const { accountantList: accountants, loading: loadingAccountants } = useSelector((state) => state.accountManagement);

  // Calculate maximum allowed payment amount
  const maxPaymentAmount = refrensedata ? refrensedata.balanceDue : Infinity;

  // Fetch accountants list
  useEffect(() => {
    if (visible) {
      setValue("paymentMethod", "Cash")
      dispatch(accountantSearch({
        directorId: "",
        companyId: parentdata?.companyId,
        branchId: parentdata?.branchId,
        text: "",
        sort: true,
        status: true,
        isPagination: false,
      }))
    }
  }, [visible]);

  const onFormSubmit = (data) => {
    const reqpayload = {
      companyId: parentdata?.companyId,
      directorId: parentdata?.directorId,
      branchId: parentdata?.branchId,
      managerId: "",
      projectId: parentdata?._id,
      invoiceType: 'credit',
      "accountentId": data?.accountant,
      "userId": accountants?.find((acc) => acc._id === accountant)?.accountentData?._id,
      "bankAccountId": data?.bankAccountId,
      "paymentMethod": data?.paymentMethod,
      "paymentReference": data?.paymentReference,
      "remark": data?.remark,
      "amountPaid": +data?.amountPaid,
      "paymentDate": customDayjs(data?.paymentDate),
      ...(refrensedata && { invReferanceId: refrensedata?._id }) // Add reference ID if exists
    }
    
    dispatch(createprojectInvoiceFunc(reqpayload)).then((data) => {
      if (!data?.error) {
        fetchprojectInvoice()
        onCancel()
        reset()
      }
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        onCancel();
        reset();
      }}
      footer={null}
      title="Record Payment"
      width={700}
      className="antmodalclassName"
    >
      {refrensedata && (
        <div className="mb-4 p-4 border rounded-md bg-gray-50">
          <Descriptions column={1} size="small" title="Reference Invoice Details">
            <Descriptions.Item label="Invoice Number">{refrensedata.invoiceNumber}</Descriptions.Item>
            <Descriptions.Item label="Invoice Date">{moment(refrensedata.invoiceDate).format('DD MMM YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Subtotal">${refrensedata.subTotal.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="GST">${refrensedata.GSTTotal.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Total Amount">${refrensedata.finalWithGSTAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Amount Paid">${refrensedata.amountPaid.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Balance Due">
              <span className="font-semibold">${refrensedata.balanceDue.toFixed(2)}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}

      <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <label className={`${inputLabelClassName}`}>
              Accountant <span className="text-red-600">*</span>
            </label>
            <Controller
              name="accountant"
              control={control}
              rules={{ required: "Accountant is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Select accountant"
                  loading={loadingAccountants}
                  {...field}
                  showSearch
                  getPopupContainer={(trigger) => trigger.parentNode}
                  optionFilterProp="children"
                  className={`${inputAntdSelectClassName} `}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {accountants?.map(acc => (
                    <Option key={acc?._id} value={acc?._id}>
                      {acc?.accountentData?.fullName}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.accountant && (
              <p className="text-red-500 text-sm">{errors.accountant.message}</p>
            )}
          </div>

          <div>
            <label className={`${inputLabelClassName}`}>
              Payment Method <span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="paymentMethod"
              rules={{ required: "Payment method is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  className={`${inputAntdSelectClassName} `}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {['Cash', 'Cheque', 'Card', 'Bank', 'Online', 'Other']?.map((bank) => (
                    <Select.Option key={bank} value={bank}>
                      {bank}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>
            )}
          </div>

          {paymentMethod !== "Cash" && (
            <div>
              <label className={`${inputLabelClassName}`}>
                Bank Account
              </label>
              <Controller
                control={control}
                name="bankAccountId"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} `}
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    <Select.Option value="">Select Bank Account</Select.Option>
                    {accountants?.find((acc) => acc._id === accountant)?.bankAccountData?.map((bank) => (
                      <Select.Option key={bank._id} value={bank._id}>
                        {optionLabelForBankSlect(bank)}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.bankAccountId && (
                <p className="text-red-500 text-sm">{errors.bankAccountId.message}</p>
              )}
            </div>
          )}

          <div>
            <label className={`${inputLabelClassName}`}>
              Payment Date <span className="text-red-600">*</span>
            </label>
            <Controller
              name="paymentDate"
              control={control}
              rules={{ required: "Payment date is required" }}
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
            {errors.paymentDate && (
              <p className="text-red-500 text-sm">Payment date is required</p>
            )}
          </div>

          <div>
            <label className={`${inputLabelClassName}`}>
              Amount Paid <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register("amountPaid", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" },
                max: { 
                  value: maxPaymentAmount, 
                  message: `Amount cannot exceed balance due of $${maxPaymentAmount.toFixed(2)}` 
                },
                validate: (value) => {
                  if (refrensedata && parseFloat(value) > maxPaymentAmount) {
                    return `Amount cannot exceed balance due of $${maxPaymentAmount.toFixed(2)}`;
                  }
                  return true;
                }
              })}
              className={`w-full px-3 py-2 border ${errors.amountPaid ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter amount"
              max={maxPaymentAmount}
            />
            {errors.amountPaid && (
              <p className="text-red-500 text-sm">{errors.amountPaid.message}</p>
            )}
            {refrensedata && (
              <p className="text-sm text-gray-500 mt-1">
                Balance due: ${refrensedata.balanceDue.toFixed(2)}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label className={`${inputLabelClassName}`}>
              Payment Reference
            </label>
            <input
              type="text"
              {...register("paymentReference")}
              className={`w-full px-3 py-2 border ${errors.paymentReference ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="e.g. TRANS123456789"
            />
            {errors.paymentReference && (
              <p className="text-red-500 text-sm">{errors.paymentReference.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className={`${inputLabelClassName}`}>
              Remarks
            </label>
            <textarea
              {...register("remark")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Additional notes (optional)"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`${loading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
          >
            {loading ? <Loader /> : 'Submit Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentEntryModal;