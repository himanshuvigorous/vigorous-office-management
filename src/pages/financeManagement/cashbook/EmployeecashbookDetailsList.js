import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getEmployeecashbookDetails } from "./cashbookFeature/_cashbook_reducers";
import { decrypt } from "../../../config/Encryption";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import EmployeeExpenseReport from "./EmployeeExpenseReport";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import EmployeeCashbook from "./EmployeeCashbook";
import { useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import { customDayjs } from "../../../constents/global";


const EmployeecashbookDetailsList = () => {
  const { companyIdEnc, branchIdEnc, employeeIdEnc } = useParams();
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const startDate = useWatch({
    control,
    name: "startDate",

  });

  const endDate = useWatch({
    control,
    name: "endDate",


  });
  useEffect(() => {

    setValue('startDate', dayjs().startOf('month'));
    setValue('endDate', dayjs().endOf('month'));
  }, [])
  const companyId = decrypt(companyIdEnc);
  const branchId = decrypt(branchIdEnc);
  const employeeId = decrypt(employeeIdEnc);
  const { cashbookDetailsLoading, cashbookDetailsListdata } = useSelector((state) => state.cashbook);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getEmployeecashbookDetails({
      "companyId": companyId,
      "directorId": "",
      "branchId": branchId,
      "employeId": employeeId,
      "startDate": startDate ? customDayjs(startDate) : null,
      "endDate": endDate ? customDayjs(endDate) : null,
    }))
  }, [companyIdEnc, branchIdEnc, employeeIdEnc, startDate, endDate])

  return (
    <GlobalLayout>
      {cashbookDetailsLoading ? <Loader2 /> : <EmployeeCashbook cashbookDetailsListdata={cashbookDetailsListdata} control={control} errors={errors} setValue={setValue} watch={watch} />}
      {/* <EmployeeExpenseReport data={cashbookDetailsListdata} /> */}
    </GlobalLayout>
  );
};

export default EmployeecashbookDetailsList;