import { Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { formButtonClassName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, sortByPropertyAlphabetically } from "../../../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import { AssetInventryCreate, updateAssetInventry } from "./AssetTypeFeatures/_AssetType_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import ReactSelect from "react-select";
import { useEffect } from "react";
import ListLoader from "../../../../global_layouts/ListLoader";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import dayjs from "dayjs";
const AssignInventryModal = ({ assignInventryModal,  onClose ,getAssetInventryListListRequest}) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm()
    const dispatch = useDispatch()
    const { employeList , employeeListLoading } = useSelector((state) => state.employe);
 
   useEffect(() => {
     
if(assignInventryModal?.data && assignInventryModal?.isOpen){
    fetchEmployeListData()
}
   }, [assignInventryModal])
 
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
       companyId: assignInventryModal?.data?.companyId,
       directorId: "",
       branchId: assignInventryModal?.data?.branchId,
     };
     dispatch(employeSearch(reqPayload));
   };
   const {loading:employeeDocumentLoading} = useSelector((state) => state.AssetType);
    const onSubmit = (data) => {
 
        const paylaod = {
    "companyId": assignInventryModal?.data?.companyId,
    "directorId": "",
    "branchId": assignInventryModal?.data?.branchId,
    "assetNameId": assignInventryModal?.data?.assetNameId,
    "_id": assignInventryModal?.data?._id,
    "status": "assigned",
    "employeId": data?.employee,
    "assignDate": dayjs(data?.Assigndate).format("YYYY-MM-DD"),
    "remarks": data?.remarks,
    "conditionOnAssign": data?.conditionOnAssign,

    "returnDate": "",
    "conditionOnReturn": "",

}


dispatch(updateAssetInventry(paylaod)).then((data)=>{
    if(!data?.error){
        onClose()
        reset()
        getAssetInventryListListRequest()
    }
})

     }
    return (
        <Modal
            open={assignInventryModal?.isOpen}
            onCancel={()=>{onClose(); reset()}}
    
            title={false}
            width={1200}
            bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px' }}
            centered
            className="antmodalclassName"
            footer={
               <div className="flex justify-end px-3 pb-2">
                        <button type="button" disabled={employeeDocumentLoading} onClick={()=>handleSubmit(onSubmit)()} className={`${employeeDocumentLoading ? "bg-gray-400" : "bg-header"} text-sm text-white py-2 px-3 rounded mt-4`}>
                            {employeeDocumentLoading ? <ListLoader /> : "Submit Details"}
                        </button>
                    </div>
            }
        >
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div>
                <div
                                className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-2 px-3 md:my-4"
                            >
                                 <div className="w-full">
              <label className={`${inputLabelClassName}`}>Employee <span className="text-red-600"> *</span></label>

              <Controller
                name="employee"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.employee ? "border-[1px]" : "border-gray-300"}`}
                    getPopupContainer={() => document.parentElement}
                    dropdownStyle={{ zIndex: 3000 }}
                    placeholder="Select Employee"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }                     >
                    <Select.Option value="">Select Employee</Select.Option>
                    {employeeListLoading ? (
                      <Select.Option disabled><ListLoader /></Select.Option>
                    ) : (
                      employeList?.map((item) => (
                        <Select.Option key={item?._id} value={item?._id}>
                          {item?.fullName}
                        </Select.Option>
                      ))
                    )}
                  </Select>
                )}
              />
              {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
            </div>
            <div>
                <label className={`${inputLabelClassName}`}>
                  Assign Date <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="Assigndate"
                  control={control}
                  rules={
                    {
                      required: 'Date is required'
                    }
                  }
                  render={({ field }) => (
                    <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                      return current && current.isAfter(moment().endOf('day'), 'day');
                    }} />
                  )}
                />
                {errors.Assigndate && (
                  <p className="text-red-500 text-sm">Date is required</p>
                )}
              </div>
                                <div className="flex gap-3">
                                    <div className="w-full">
                                        <label className={`${inputLabelClassName}`}>
                                            remarks <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register(`remarks`, {
                                                required: "remarks is required",
                                            })}
                                            className={`${inputClassName} ${errors.remarks
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Enter remarks"
                                        />
                                        {errors.remarks && (
                                            <p className="text-red-500 text-sm">
                                                {errors.remarks.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-full">
                                        <label className={`${inputLabelClassName}`}>
                                            Condition On Assign <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register(`conditionOnAssign`, {
                                                required: "Condition On Assign is required",
                                            })}
                                            className={`${inputClassName} ${errors.conditionOnAssign
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Enter Condition On Assign"
                                        />
                                        {errors.conditionOnAssign && (
                                            <p className="text-red-500 text-sm">
                                                {errors.conditionOnAssign.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                              
                            </div>
                </div>
            </form>
        </Modal>
    );
};

export default AssignInventryModal;