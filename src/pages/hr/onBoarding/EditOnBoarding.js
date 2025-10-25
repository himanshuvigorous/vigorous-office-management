import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useDispatch, useSelector } from "react-redux";
import {
  domainName,
  formButtonClassName,
  inputAntdSelectClassName,
  inputClassName,
  inputDisabledClassName,
  inputerrorClassNameAutoComplete,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
  sortByPropertyAlphabetically,
} from "../../../constents/global.js";
import getUserIds from "../../../constents/getUserIds";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../config/Encryption.js";
import {
  getOnBoardingDetails,
  resetOnBoarding,
  updateOnBoarding,
} from "./onBoardingFeatures/_onBoarding_reducers.js";
import { designationSearch } from "../../designation/designationFeatures/_designation_reducers.js";
import {
  countrySearch,
  secCountrySearch,
} from "../../global/address/country/CountryFeatures/_country_reducers.js";
import {
  secStateSearch,
  stateSearch,
} from "../../global/address/state/featureStates/_state_reducers.js";
import {
  citySearch,
  secCitySearch,
} from "../../global/address/city/CityFeatures/_city_reducers.js";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers.js";
import moment from "moment";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers.js";
import ReactSelect from "react-select";
import { leaveTypeSearch } from "../../global/other/leavetypeManagment/LeaveTypeFeatures/_leave_type_reducers.js";
import { AutoComplete, Input, Select } from "antd";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker.js";
import { assignMultipleLeave, deleteAssignedLeaveEmployee } from "../leaveRequestManagment/AssignLeaves/AssignLeaveFeatures/_assign_leave_reducers.js";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers.js";
import dayjs from "dayjs";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker.js";
import EditSalaryDetailsModule from "../employeeSalary/employeeSalaryModule/EditSalaryDetailsModule.js";
import { deleteDocument, fileUploadFunc, updateDocument } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers.js";
import { createEmployeeSalaryDetails, updateEmployeeSalaryDetails } from "../employeeSalary/employeeSalaryModule/employeeSalaryFeatures/_employee_salary_reducers.js";
import Swal from "sweetalert2";
import ImageUploader from "../../../global_layouts/ImageUploader/ImageUploader.js";
import Loader from "../../../global_layouts/Loader.js";
import ListLoader from "../../../global_layouts/ListLoader.js";
import Loader2 from "../../../global_layouts/Loader/Loader2.js";
import { RolesPermissionSearch } from "../../global/RolesAccess/RolesPermission/rolePermissiomnFeatures/_rolePermission_reducers.js";
import { timeSlotSearch } from "../../timeSlot/timeSlotsFeatures/_timeSlots_reducers.js";

const EditOnBoarding = () => {
  const navigate = useNavigate();
  const { onBoardingIdEnc } = useParams();
  const onBoardingId = decrypt(onBoardingIdEnc);
  const [step, setStep] = useState(1);
  const { loading: onBoardingLaoding } = useSelector(
    (state) => state.onBoarding
  );
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
  const { countryListData, secCountryList } = useSelector(
    (state) => state.country
  );
  const { rolesPermissionList } = useSelector((state) => state.rolePermission);
  const [editPageLoader, setEditPageLoader] = useState(true);
  const { designationList, loading: desLoading } = useSelector((state) => state.designation);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const { stateListData, secStateList } = useSelector((state) => state.states);
  const { cityListData, secCityList } = useSelector((state) => state.city);
  const { onBoardingDetailsData } = useSelector((state) => state.onBoarding);
  const { leaveListData } = useSelector((state) => state.leaveType);
  const [isFirstEffectComplete, setIsFirstEffectComplete] = useState(false);
  const [financialDateDiffrence, setFinancialDateDiffrence] = useState({
    main: 0,
    current: 0
  });




  const { employeeDocumentList, } = useSelector(
    (state) => state.employeeDocument
  );
  const [banks, setBanks] = useState([{ id: 1 }]);
  const [documents, setDocuments] = useState([
    { id: 1, documentType: "", documentNo: "", file: [] },
  ]);
  const { loadingUpdateFile } = useSelector((state) => state.fileUpload);
  const [financialInfo, setFinancialInfo] = useState([
    {
      id: 1,
      name: "",
      year: "",
      file: [],
    },
  ]);
        const { timeSlotsListData } = useSelector(state => state.timeSlots)
  const [formErrors, setFormErrors] = useState([]);
  const [formErrorsBank, setFormErrorsBank] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    clearErrors,
    setError,
    resetField,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
    },
  });
  const isProbationPeriodActive = useWatch({
    control,
    name: "isProbationPeriod",
    defaultValue: "",
  });
  const dateOfJoining = useWatch({
    control,
    name: "dateOfJoining",
    defaultValue: "",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "family",
  });
  const {
    fields: emergencyContactFields,
    append: appendEmergencyContact,
    remove: removeEmergencyContact,
  } = useFieldArray({
    control,
    name: "emergencyContact",
  });
  const {
    fields: educationDetails,
    append: appendEducational,
    remove: removeEducational,
  } = useFieldArray({
    control,
    name: "educationDetails",
  });
  const {
    fields: employmentDetails,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({
    control,
    name: "employmentDetails",
  });
  const {
    fields: incrementDetails,
    append: appendIncrement,
    remove: removeIncrement,
  } = useFieldArray({
    control,
    name: "incrementDetails",
  });
  const {
    fields: assignLeaveDetails,
    append: appendassignLeave,
    remove: removeassignLeave,
  } = useFieldArray({
    control,
    name: "assignLeaveDetails",
  });

  const dispatch = useDispatch();
  const financStartDate = useWatch({
    control,
    name: "financStartDate",
    defaultValue: "",
  });
  const financEndDate = useWatch({
    control,
    name: "financEndDate",
    defaultValue: "",
  });
  const IsPf = useWatch({
    control,
    name: "isPF",
    defaultValue: "",
  });
  const isESIC = useWatch({
    control,
    name: "isESIC",
    defaultValue: "",
  });
  const isTl = useWatch({ name: "isTl", control });
  const isHr = useWatch({ name: "isHr", control });

  useEffect(() => {
    if (isHr && isTl) {
      setValue("isTl", false);
      setValue("isHr", true);
    }
    if (isTl && isHr) {
      setValue("isHr", false);
      setValue("isTl", true);
    }
  }, [isTl, isHr, setValue]);
  useEffect(() => {
    dispatch(
      countrySearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
    );

    setIsFirstEffectComplete(true);
  }, []);


  useEffect(() => {
    if (isFirstEffectComplete) {

      const reqData = {
        _id: onBoardingId,
      };
      dispatch(getOnBoardingDetails(reqData)).then(() => {
        setEditPageLoader(false)
      })
      setIsFirstEffectComplete(false);
    }

   
  }, [isFirstEffectComplete]);

  useEffect(()=>{
 return ()=>{
    dispatch(resetOnBoarding())
    }
  },[])


  const [employeeList, setEmployeeList] = useState([])

  const reportingOption = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isManager: true,
      isPagination: false,
      departmentId: "",
      designationId: "",
      companyId: onBoardingDetailsData?.companyId,
      branchId: onBoardingDetailsData?.branchId,
      isBranch: true

    };

    dispatch(employeSearch(reqPayload)).then((res) => {

      const optionList = res?.payload?.data?.docs?.map(
        (options) => {
          return ({
            value: options?._id,
            label: (
              <div className="flex gap-2 items-center">
                {options?.fullName}
                <div className="text-[10px] text-gray-500">
                  {options?.userType === "companyDirector"
                    ? "Director"
                    : options?.userType === "companyBranch"
                      ? "Branch Head"
                      : options?.userType === 'employee' ? <div className="flex  gap-1   !p-0 !m-0 rounded-sm">
                        <div className="!p-0 !m-0">{options?.departmentData?.name}</div>
                        (<div className="!p-0 !m-0">{options?.designationData?.name}</div>)
                      </div> : ''}
                </div>
              </div>
            ),
          })
        }
      );
      setEmployeeList(optionList)
    })

  }



  useEffect(() => {
    if (onBoardingDetailsData) { 
      reset();
      setValue("PDAddress", onBoardingDetailsData?.addresses?.primary?.street);
      setValue("PDCity", onBoardingDetailsData?.addresses?.primary?.city);
      setValue("PDcountry", onBoardingDetailsData?.addresses?.primary?.country);
      setValue("PDState", onBoardingDetailsData?.addresses?.primary?.state);
      setValue("PDPin", onBoardingDetailsData?.addresses?.primary?.pinCode);

      setValue(
        "PDSecAddress",
        onBoardingDetailsData?.addresses?.secondary?.street
      );
      setValue(
        "PDSecCountry",
        onBoardingDetailsData?.addresses?.secondary?.country
      );
      setValue(
        "PDSecState",
        onBoardingDetailsData?.addresses?.secondary?.state
      );
      setValue("PDSecCity", onBoardingDetailsData?.addresses?.secondary?.city);
      setValue(
        "PDSecPinCode",
        onBoardingDetailsData?.addresses?.secondary?.pinCode
      );
      setValue("PDFullName", onBoardingDetailsData?.fullName);
       setValue("landlineNo", onBoardingDetailsData?.landlineNumber);
       setValue("seatNo", onBoardingDetailsData?.seatNumber);
       
      setValue("PDEmail", onBoardingDetailsData?.email);
      setValue("PDmobileCode", onBoardingDetailsData?.mobile?.code);
      setValue("PDOfficeemail", onBoardingDetailsData?.officeEmail);
    
      setValue("PDCompanyId", onBoardingDetailsData?.companyId);
      dispatch(
        deptSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: onBoardingDetailsData?.companyId,
          branchId: onBoardingDetailsData?.branchId,
        })
      ).then(data => {
        if (!data?.error) {
          setValue("PDDepartmentId", onBoardingDetailsData?.departmentId)
        }
      })

      dispatch(RolesPermissionSearch({
        companyId: onBoardingDetailsData?.companyId,
        branchId: onBoardingDetailsData?.branchId,
        text: "",
        sort: true,
        status: "",
        isPagination: false,
      })).then((data) => {
        if (!data?.error) {
          setValue("sidebarRole", onBoardingDetailsData?.pageRoleId)
        }
      })
      dispatch(
        designationSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          departmentId: onBoardingDetailsData?.departmentId,
          companyId: onBoardingDetailsData?.companyId,
        })
      ).then((res) => {
        if (!res.error) {
          setValue("PDDesignationId", onBoardingDetailsData?.designationId);
        }
      })
      setValue("PDDepartmentname", onBoardingDetailsData?.departmentData?.name);
      setValue("PDDesignationname", onBoardingDetailsData?.designationData?.name);
      setValue("workType", onBoardingDetailsData?.workType);
      setValue("PDMobileNo", onBoardingDetailsData?.mobile?.number);
      setValue("gender", onBoardingDetailsData?.generalInfo?.gender);
      setValue("BloodGroup", onBoardingDetailsData?.generalInfo?.bloodGroup);
      onBoardingDetailsData?.generalInfo?.dateOfBirth && setValue(
        "dateOfBirth",
        dayjs(onBoardingDetailsData?.generalInfo?.dateOfBirth))
      setValue(
        "maritalStatus",
        onBoardingDetailsData?.generalInfo?.maritalStatus
      );
      onBoardingDetailsData?.generalInfo?.dateOfJoining && setValue(
        "dateOfJoining",
        dayjs(onBoardingDetailsData?.generalInfo?.dateOfJoining)
      );
      setValue("isProbationPeriod", onBoardingDetailsData?.generalInfo?.isProbationPeriod == true ? "Yes" : onBoardingDetailsData?.generalInfo?.isProbationPeriod == false ? "No" : "");
      setValue("isProbationPeriodLeave", onBoardingDetailsData?.generalInfo?.isProbationPeriodLeave == true ? "Yes" : onBoardingDetailsData?.generalInfo?.isProbationPeriodLeave == false ? "No" : "");
      setValue(
        "probationPeriod",
        onBoardingDetailsData?.generalInfo?.probationPeriod
      );

      const bankData = onBoardingDetailsData?.bankData?.length
        ? onBoardingDetailsData?.bankData.map((bank) => ({
          _id: bank?._id || "",
          accountType: bank?.accountType || "",
          bankName: bank?.bankName || "",
          branchName: bank?.branchName || "",
          bankholderName: bank?.bankholderName || "",
          accountNumber: bank?.accountNumber || "",
          ifscCode: bank?.ifscCode || "",
          file: bank?.filePath || [],
        }))
        : [
          {
            _id: "",
            accountType: "",
            bankName: "",
            branchName: "",
            bankholderName: "",
            accountNumber: "",
            ifscCode: "",
            file: [],
          },
        ];

      setBanks([...bankData]);
      const documentData = onBoardingDetailsData?.documentData?.length
        ? onBoardingDetailsData?.documentData.map((document) => ({
          _id: document?._id || "",
          documentType: document?.name || "",
          documentNo: document?.number || "",
          file: document?.filePath || [],
        }))
        : [
          {
            _id: "",
            documentType: "",
            documentNo: "",
            file: [],
          },
        ];

      setDocuments([...documentData]);
     
      dispatch(timeSlotSearch({
            directorId: '',
            companyId: onBoardingDetailsData?.companyId,
        branchId: onBoardingDetailsData?.branchId,
            text: "",
            sort: true,
            status: "",
            isPagination: false,
          })).then((res) => {
            if (!res.error) {
              setValue("shift", onBoardingDetailsData?.shift);
            }
          })

      dispatch(employeSearch({
        text: "",
        status: true,
        sort: true,
        isTL: "",
        isHR: "",
        isPagination: false,
        departmentId: "",
        designationId: "",
        companyId: onBoardingDetailsData?.companyId,
        branchId: onBoardingDetailsData?.branchId,
        isBranch: true,
        isDirector: true
      })).then((data) => {
        if (!data?.error) {
          const selectedEmployee = data?.payload?.data?.docs?.find((ele) => ele?._id === onBoardingDetailsData?.reporting_to)
          setValue("reportingEmployee", {
            value: selectedEmployee?._id,
            label: (
              <div className="flex gap-2 items-center">
                {selectedEmployee?.fullName}
                <div className="text-[10px] text-gray-500">
                  {selectedEmployee?.userType === "companyDirector"
                    ? "Director"
                    : selectedEmployee?.userType === "companyBranch"
                      ? "Branch Head"
                      : selectedEmployee?.userType === "employee" ? (
                        <div className="flex gap-1 !p-0 !m-0 rounded-sm">
                          <div className="!p-0 !m-0">{selectedEmployee?.departmentData?.name}</div>
                          (<div className="!p-0 !m-0">{selectedEmployee?.designationData?.name}</div>)
                        </div>
                      ) : ""}
                </div>
              </div>
            )
          })
        }
      })

      if(onBoardingDetailsData?.familyDetails){
        remove();
        onBoardingDetailsData?.familyDetails?.forEach((famDetail) => {
        
        const formattedEmpDetail = {
          ...famDetail,
          contactNumber: { code: famDetail?.contactNumber?.code, number: famDetail?.contactNumber?.number }

        };
        append(formattedEmpDetail);
      });}




      if(onBoardingDetailsData?.educationDetails){
        
         removeEducational();
        onBoardingDetailsData?.educationDetails?.forEach((eduDetail) => {
       
        const formattedEduDetail = {

          ...eduDetail,
          from: dayjs(eduDetail.from),
          to: dayjs(eduDetail.to),
        };
        appendEducational(formattedEduDetail);
      });}

      
      if(onBoardingDetailsData?.employementDetails){
        removeEmployment();
        onBoardingDetailsData?.employementDetails?.forEach((empDetail) => {

        const formattedEmpDetail = {
          ...empDetail,
          from: dayjs(empDetail.from),
          to: dayjs(empDetail.to),
        };
        appendEmployment(formattedEmpDetail);
      });}

     if(onBoardingDetailsData?.emergencyContact){
       removeEmergencyContact();
       onBoardingDetailsData?.emergencyContact?.forEach((emrConDetail) => {
     
        const formattedEduDetail = {
          ...emrConDetail,
        };
        appendEmergencyContact(formattedEduDetail);
      });}
      const FirstassignLeave = onBoardingDetailsData?.assignLeaves?.[0];
      if (FirstassignLeave) {
        setValue("financStartDate", FirstassignLeave.financStartDate ?  dayjs(FirstassignLeave.financStartDate) : null);
        setValue("financEndDate",FirstassignLeave.financEndDate ?  dayjs(FirstassignLeave.financEndDate):null);
        setValue("leaveTypePolicy", FirstassignLeave.leavePolicy);
      }
      dispatch(leaveTypeSearch({
        directorId: "",
        companyId: onBoardingDetailsData?.companyId,
        branchId: onBoardingDetailsData?.branchId,
        "text": "",
        "sort": true,
        "status": "",
        "isPagination": false,
        isPaid: true,
      })).then((res) => {
        if (!res.error) {
          setValue("assignLeaveDetails", [])

          onBoardingDetailsData?.assignLeaves?.length > 0 ? onBoardingDetailsData?.assignLeaves?.filter(data => data?.leaveTypeIsPaid)?.forEach((item, index) => {
            const formattedLeave = {
              _id: item?._id,
              leave: item?.leaveTypeId,
              totalLeave: item?.totalLeaves
            }

            appendassignLeave(formattedLeave)
            setValue(`assignLeaveDetails[${index}].maxValue`, Math.ceil(item?.totalLeaves))
          }) : appendassignLeave(
            {
              leave: "",
            }
          )

        }
      })

      setValue(
        "SMLinkedIn",
        onBoardingDetailsData?.socialLinks?.find(
          (link) => link.name === "LinkedIn"
        )?.link?.replace(/^https?:\/\//, '') || ''
      );
      setValue(
        "SMGithub",
        onBoardingDetailsData?.socialLinks?.find(
          (link) => link.name === "GitHub"
        )?.link?.replace(/^https?:\/\//, '') || ''
      );

      setValue("ProfileImage", onBoardingDetailsData?.profileImage);
      setValue("salaryId", onBoardingDetailsData?.salaryData?._id);
      setValue("currentPackage", onBoardingDetailsData?.salaryData?.currentPackage);
      setValue("esicNumber", onBoardingDetailsData?.salaryData?.esicNumber);
      setValue("currentSalary", onBoardingDetailsData?.salaryData?.currentSalary);
      setValue("perDaySalary", onBoardingDetailsData?.salaryData?.perDaySalary);
      setValue("basicSalaryPercentage", onBoardingDetailsData?.salaryData?.basicSalaryPercentage);
      setValue("calculatedBasicSalary", onBoardingDetailsData?.salaryData?.basicSalary);
      setValue("isPF", onBoardingDetailsData?.salaryData?.isPF ? 'true' : 'false');
      setValue("isESIC", onBoardingDetailsData?.salaryData?.isESIC ? 'true' : 'false');
      setValue("uanNumber", onBoardingDetailsData?.salaryData?.uanNumber);
      setValue("pfType", onBoardingDetailsData?.salaryData?.pfType);
      setValue("pfAppliedOn", onBoardingDetailsData?.salaryData?.pfAppliedOn);
      setValue("salarystartDate", dayjs(onBoardingDetailsData?.salaryData?.lastIncrementDate));
      setValue("salaryEndDate", dayjs(onBoardingDetailsData?.salaryData?.nextIncrementDate));
      setValue("openingBalance", onBoardingDetailsData?.openingBalance);
      setValue("esicType", onBoardingDetailsData?.salaryData?.esicType);
      setValue("esicAppliedOn", onBoardingDetailsData?.salaryData?.esicAppliedOn);
      setValue("esicInPercentage", onBoardingDetailsData?.salaryData?.esicInPercentage);
      setValue("esicMaxUpTo", onBoardingDetailsData?.salaryData?.esicMaxUpTo);
      setValue("pfInPercentage", onBoardingDetailsData?.salaryData?.pfInPercentage);
      setValue("pfMaxUpTo", onBoardingDetailsData?.salaryData?.pfMaxUpTo);
    }
  }, [onBoardingDetailsData]);
useEffect(() => {
  if (financStartDate && financEndDate) {
    const dateObj1 = dayjs(financStartDate, "MM/YYYY")?.startOf('month');
    const dateObj2 = dayjs(financEndDate, "MM/YYYY")?.endOf('month');
    const today = dayjs();

    let baseDate;

    if (dateOfJoining) {
      const doj = dayjs(dateOfJoining);
      if (dateObj1.isBefore(doj, 'month')) {
        baseDate = doj.date() <= 15
          ? doj.startOf('month')
          : doj.startOf('month').add(1, 'month');
      } else {
        baseDate = dateObj1.clone().startOf('month');
      }
    } else {
      baseDate = today.date() <= 15
        ? today.startOf('month')
        : today.startOf('month').add(1, 'month');
    }

    const diffInMonths = dateObj2.diff(dateObj1, 'month') + 1;
    const diffInCurrent = dateObj2.diff(baseDate, 'month') + 1;

    setFinancialDateDiffrence({
      main: diffInMonths,
      current: diffInCurrent
    });
  } else {
    setFinancialDateDiffrence({
      main: 0,
      current: 0
    });
  }
}, [financStartDate, financEndDate, dateOfJoining]);

  useEffect(() => {
    if (onBoardingDetailsData) {
      setValue('assignLeaveDetails', [{}])
    }
  }, [dateOfJoining, financEndDate, financStartDate])

  useEffect(() => {
    if (onBoardingDetailsData && leaveListData) {
      const selectedleave = leaveListData?.filter((type) =>
        onBoardingDetailsData?.assignLeaves?.includes(type._id)
      );

      if (selectedleave) {
        setValue("leaveTypeId", selectedleave);
      }
    }
  }, [onBoardingDetailsData, leaveListData]);
  const handleDepartmentChange = (event) => {
    setValue("PDDepartmentId", event);
    setValue("PDDesignationId", "");
    dispatch(
      designationSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        departmentId: event,
        companyId: onBoardingDetailsData?.companyId,
      })
    );
  };
  const onSubmit = (data) => {

    if (step === 1) {
      const finalPayload = {
        _id: onBoardingId,
        generalInfo: {
          gender: data?.gender,
          bloodGroup: data?.BloodGroup,
          dateOfBirth: data?.dateOfBirth ? dayjs(data?.dateOfBirth).format("YYYY-MM-DD") : '',
          maritalStatus: data?.maritalStatus,
          designationName: data?.designation,
          dateOfJoining: data?.dateOfJoining ? dayjs(data?.dateOfJoining).format("YYYY-MM-DD") : '',
          isProbationPeriod: data?.isProbationPeriod == "Yes" ? true : false,
          isProbationPeriodLeave: data?.isProbationPeriodLeave == "Yes" ? true : false,
          probationPeriod: data?.isProbationPeriod ? data?.probationPeriod : "",
        },
        pageRoleId: data?.sidebarRole,
        companyId: onBoardingDetailsData?.companyId,
        directorId: onBoardingDetailsData?.directorId,
        branchId: onBoardingDetailsData?.branchId,
        landlineNumber: data?.landlineNo,
        seatNumber: +data?.seatNo,
        employeId: onBoardingDetailsData?.employeId,
        applicationId: onBoardingDetailsData?.applicationId,
        departmentId: data?.PDDepartmentId,
        designationId: data?.PDDesignationId,
        officeEmail: data?.PDOfficeemail,
        openingBalance:Number(data?.openingBalance),
        assignLeaves: Array.isArray(data?.leaveTypeId)
          ? data?.leaveTypeId?.map((item) => item._id)
          : data?.leaveTypeId
            ? [data?.leaveTypeId.value]
            : [],
        reporting_to: typeof data.reportingEmployee === 'object' ? data?.reportingEmployee?.value: data.reportingEmployee = 'object' ? data?.reportingEmployee :'' ,
        firstName: "",
        lastName: "",
        fullName: data?.PDFullName,
        shift: data?.shift,
        workType: data?.workType,
        profileImage: data?.ProfileImage,
        email: data?.PDEmail,
        mobile: {
          code: data?.PDmobileCode,
          number: data?.PDMobileNo,
        },
        status: data?.status,
        addresses: {
          primary: {
            street: data?.PDAddress,
            city: data?.PDCity,
            state: data?.PDState,
            country: data?.PDcountry,
            pinCode: data?.PDPin,
          },
          secondary: {
            street: data?.PDSecAddress,
            city: data?.PDSecCity,
            state: data?.PDSecState,
            country: data?.PDSecCountry,
            pinCode: data?.PDSecPinCode,
          },
        },
      };
      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          dispatch(resetOnBoarding());
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    }
    else if (step === 3) {
      const finalPayload = {
        ...onBoardingDetailsData,
        familyDetails: data?.family,
      };

      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          dispatch(resetOnBoarding());
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 4) {
      const finalPayload = {
        ...onBoardingDetailsData,
        emergencyContact: data?.emergencyContact,
      };
      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          dispatch(resetOnBoarding());

          // navigate(
          //   `/admin/onBoarding`
          // );
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 5) {
      const finalPayload = {
        ...onBoardingDetailsData,

        educationDetails: data?.educationDetails,
      };
      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          dispatch(resetOnBoarding());
          
          // navigate(
          //   `/admin/onBoarding`
          // );

          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 6) {
      const finalPayload = {
        ...onBoardingDetailsData,

        employementDetails: data?.employmentDetails,
      };
      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          dispatch(resetOnBoarding());
          
          // navigate(
          //   `/admin/onBoarding`
          // );
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 7) {
      const finalPayload = {
        ...onBoardingDetailsData,
        socialLinks: [
          {
            name: "LinkedIn",
            link: data?.SMLinkedIn ? data?.SMLinkedIn?.startsWith("http") ? data?.SMLinkedIn : `https://${data?.SMLinkedIn}` : null,
          },
          {
            name: "GitHub",
            link: data?.SMGithub ? data?.SMGithub?.startsWith("http") ? data?.SMLinkedIn : `https://${data?.SMGithub}` : null,

          },
        ],
      };
      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          dispatch(resetOnBoarding());
          
          // navigate(
          //   `/admin/onBoarding`
          // );
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 8) {


      const leavePayload = data?.assignLeaveDetails?.map((item) => ({
        "_id": item?._id,
        "leaveTypeId": item?.leave,
        "totalLeaves": Number(item?.totalLeave)
      }));
      const reqData = {
        "companyId": onBoardingDetailsData?.companyId,
        "directorId": onBoardingDetailsData?.directorId,
        "branchId": onBoardingDetailsData?.branchId,
        "employeId": onBoardingDetailsData?.employeId,
        "financStartDate": dayjs(data?.financStartDate)?.format("YYYY-MM"),
        "financEndDate": dayjs(data?.financEndDate)?.format("YYYY-MM"),
        "leavePolicy": data?.leaveTypePolicy,
        "leaveData": leavePayload
      }


      dispatch(assignMultipleLeave(reqData)).then((output) => {
        if (!output.error) {
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    }
    if (step === 9) {
      if (data?.salaryId) {
        const finalPayload = {
          _id: data?.salaryId,
          companyId: onBoardingDetailsData?.companyId,
          directorId: onBoardingDetailsData?.directorId,
          branchId: onBoardingDetailsData?.branchId,
          employeId: onBoardingDetailsData?.employeId,
          currentPackage: Number(data?.currentPackage),
          currentSalary: Number(data?.currentSalary),
          perDaySalary: Number(data?.perDaySalary),
          basicSalaryPercentage: Number(data?.basicSalaryPercentage),
          basicSalary: Number(data?.calculatedBasicSalary),
          isESIC: data?.isESIC === 'true' ? true : false,
          esicNumber: (isESIC === 'true' || isESIC === true) ? data?.esicNumber : '',
          esicType: (isESIC === 'true' || isESIC === true) ? data?.esicType : '',
           esicAppliedOn: (isESIC === 'true' || isESIC === true) ? data?.esicAppliedOn : '',
          esicInPercentage: (isESIC === 'true' || isESIC === true) ? +data?.esicInPercentage : '',
          esicMaxUpTo: (isESIC === 'true' || isESIC === true) ? +data?.esicMaxUpTo : '',
          isPF: data?.isPF === 'true' ? true : false,
          uanNumber: data?.uanNumber,
          pfType: (IsPf === 'true' || IsPf === true) ? data?.pfType : '',
          pfAppliedOn: (IsPf === 'true' || IsPf === true) ? data?.pfAppliedOn : '',
          pfInPercentage: (IsPf === 'true' || IsPf === true) ? +data?.pfInPercentage : '',
          pfMaxUpTo: (IsPf === 'true' || IsPf === true) ? +data?.pfMaxUpTo : '',
          "lastIncrementDate": dayjs(data?.salarystartDate),
          "nextIncrementDate": dayjs(data?.salaryEndDate)
        };
        dispatch(updateEmployeeSalaryDetails(finalPayload)).then((data) => {
          if (!data.error) {
            const reqData = {
              _id: onBoardingId,
            };
            dispatch(getOnBoardingDetails(reqData));

          }
        });
      } else {
        const finalPayload = {
          companyId: onBoardingDetailsData?.companyId,
          directorId: onBoardingDetailsData?.directorId,
          branchId: onBoardingDetailsData?.branchId,
          employeId: onBoardingDetailsData?.employeId,
          currentPackage: Number(data?.currentPackage),
          currentSalary: Number(data?.currentSalary),
          perDaySalary: Number(data?.perDaySalary),
          // isESIC: data?.isESIC,
          // esicNumber: (isESIC === 'true' || isESIC === true) ? data?.esicNumber : '',
          // isPF:   data?.isPF ,
          // uanNumber: data?.uanNumber,
          // pfType: (IsPf === 'true' || IsPf === true) ? data?.pfType : '',
           basicSalaryPercentage: Number(data?.basicSalaryPercentage),
          basicSalary: Number(data?.calculatedBasicSalary),
          isESIC: data?.isESIC === 'true' ? true : false,
          esicNumber: (isESIC === 'true' || isESIC === true) ? data?.esicNumber : '',
          isPF: data?.isPF === 'true' ? true : false,
          uanNumber: data?.uanNumber,
          pfType: (IsPf === 'true' || IsPf === true) ? data?.pfType : '',
          "lastIncrementDate": dayjs(data?.salarystartDate),
          "nextIncrementDate": dayjs(data?.salaryEndDate)
        };
        dispatch(createEmployeeSalaryDetails(finalPayload)).then((data) => {
          if (!data.error) {
            const reqData = {
              _id: onBoardingId,
            };
            dispatch(getOnBoardingDetails(reqData));

          }
        });
      }

    }
    if (step === 10) {
      if (validateForm()) {
        const documentPayload = documents.map((doc, index) => {
          if (doc?._id) {
            return {
              userId: onBoardingDetailsData?.employeId,
              _id: doc?._id,
              name: doc?.documentType,
              number: doc?.documentNo,
              filePath: doc?.file,
            };
          } else {
            return {
              userId: onBoardingDetailsData?.employeId,
              name: doc?.documentType,
              number: doc?.documentNo,
              filePath: doc?.file,
            };
          }
        });

        const finalPayload = {
          documents: documentPayload,
          type: "documents",
        };
        dispatch(updateDocument(finalPayload)).then((data) => {
          if (!data.error) {
            const reqData = {
              _id: onBoardingId,
            };
            dispatch(getOnBoardingDetails(reqData));
          }
        })
      }
    }

    if (step === 11) {
      if (validateBankForm()) {
        const bankPayload = banks.map((bank, index) => {
          if (bank?._id) {
            return {
              userId: onBoardingDetailsData?.employeId,
              _id: bank?._id,
              bankholderName: bank?.bankholderName,
              bankName: bank?.bankName,
              accountNumber: bank?.accountNumber,
              branchName: bank?.branchName,
              ifscCode: bank?.ifscCode,
              accountType: bank?.accountType,
              filePath: bank?.file,
            };
          } else {
            return {
              userId: onBoardingDetailsData?.employeId,
              bankholderName: bank?.bankholderName,
              bankName: bank?.bankName,
              accountNumber: bank?.accountNumber,
              branchName: bank?.branchName,
              ifscCode: bank?.ifscCode,
              accountType: bank?.accountType,
              filePath: bank?.file,
            };
          }
        });

        const finalPayload = {
          bank: bankPayload,
          type: "bank",
        };
        dispatch(updateDocument(finalPayload)).then((data) => {
          if (!data.error) {
            const reqData = {
              _id: onBoardingId,
            };
            dispatch(getOnBoardingDetails(reqData));
            navigate(-1)
          }
        })
      }
    }
  };
  const navTabClick = (clickedStep) => {
    setStep(clickedStep);
  };

  // const handleDepartmentChange = (event) => {
  //   setValue("PDDepartmentId", event.target.value);
  //   setValue("PDDesignationId", "");
  //   dispatch(
  //     designationSearch({
  //       text: "",
  //       sort: true,
  //       status: true,
  //       isPagination: false,
  //       departmentId: event.target.value,
  //     })
  //   );
  // };
  useEffect(() => {
    if (sameAsCurrentAddress) {
      const currentAddress = {
        address: getValues("PDAddress"),
        country: getValues("PDcountry"),
        state: getValues("PDState"),
        city: getValues("PDCity"),
        pinCode: getValues("PDPin"),
      };
      setValue("PDSecAddress", currentAddress.address);
      setValue("PDSecPinCode", currentAddress.pinCode);
      setValue("PDSecCountry", currentAddress.country);
      setValue("PDSecState", currentAddress.state);
      setValue("PDSecCity", currentAddress.city);
    } else {
      setValue("PDSecAddress", "");
      setValue("PDSecCountry", "");
      setValue("PDSecState", "");
      setValue("PDSecCity", "");
      setValue("PDSecPinCode", "");
    }
  }, [sameAsCurrentAddress]);

  const handleAddressCheckbox = (checked) => {
    setSameAsCurrentAddress(checked);
  };
  const { Option } = Select;
  const currentPackage = useWatch({ name: "currentPackage", control })

  // Logic to calculate currentSalary and perDaySalary based on currentPackage
  useEffect(() => {
    if (currentPackage) {
      // Calculate current salary and per day salary
      const calculatedSalary = currentPackage / 12; // assuming 12 months in a year
      const perDaySalary = calculatedSalary / 30; // assuming 30 days in a month

      setValue("currentSalary", calculatedSalary.toFixed(2));
      setValue("perDaySalary", perDaySalary.toFixed(2));
    }
  }, [currentPackage, setValue]);

  const handleAddMore = () => {
    setDocuments([...documents, { id: Date.now() }]);
  };
  const handleBankAddMore = () => {
    setBanks([...banks, { id: Date.now() }]);
  };
  const handleInputChangeBank = (index, field, value) => {
    const updatedBanks = [...banks];
    const newFormErrors = [...formErrorsBank];

    if (field === "ifscCode") {
      const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;

      if (!ifscPattern.test(value)) {
        if (!newFormErrors[index]) newFormErrors[index] = {};
        newFormErrors[index][field] = "Invalid IFSC code. Example: SBIN0001234";
      } else {
        if (newFormErrors[index]?.[field]) {
          delete newFormErrors[index][field];
        }
      }
    }

    if (field === "accountNumber") {
      const accountPattern = /^\d{6,18}$/;

      if (!accountPattern.test(value)) {
        if (!newFormErrors[index]) newFormErrors[index] = {};
        newFormErrors[index][field] =
          "Invalid account number. Must be 6 to 18 digits.";
      } else {
        if (newFormErrors[index]?.[field]) {
          delete newFormErrors[index][field];
        }
      }
    }

    updatedBanks[index][field] = value;
    setBanks(updatedBanks);
    setFormErrorsBank(newFormErrors);
  };

  // const handleBankFileChange = (index, file) => {
  //   dispatch(
  //     fileUploadFunc({
  //       filePath: file,
  //       isVideo: false,
  //       isMultiple: false,
  //     })
  //   ).then((data) => {
  //     if (!data.error) {
  //       const updatedBanks = [...banks];
  //       updatedBanks[index].file = [data?.payload?.data];
  //       setDocuments(updatedBanks);
  //       const newFormErrors = [...formErrorsBank];
  //       if (newFormErrors[index]?.file) {
  //         delete newFormErrors[index].file;
  //       }
  //       setFormErrorsBank(newFormErrors);
  //     }
  //   });
  // };
  const handleBankFileChange = (index, file) => {

    if (!file) return;

    // Variable to track the newly selected file
    let selectedFile = file;

    // Create a preview of the file
    const fileReader = new FileReader();
    let filePreviewUrl = '';

    fileReader.onload = (e) => {
      filePreviewUrl = e.target.result;

      // Show SweetAlert to confirm upload
      Swal.fire({
        title: 'Preview your file',
        html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
              <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
              <img id="filePreview" src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">
              <br>
              <button id="changeImageBtn" style="  margin-top: 15px;
    padding: 10px 18px;
    cursor: pointer;
    background-color: #074173;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    transition: background-color 0.3s, transform 0.2s;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);">Change Image</button>
              <input type="file" id="fileInput" style="display: none;" accept="image/*">
            </div>
          `,
        showCancelButton: true,
        confirmButtonText: 'Confirm!',
        cancelButtonText: 'Cancel',
        didOpen: () => {
          // Attach the change image functionality to the button
          const changeImageBtn = document.getElementById('changeImageBtn');
          const fileInput = document.getElementById('fileInput');
          const filePreview = document.getElementById('filePreview');

          changeImageBtn.addEventListener('click', () => {
            fileInput.click(); // Trigger file input click
          });

          // When a new file is selected
          fileInput.addEventListener('change', (event) => {
            const newFile = event.target.files[0];
            if (newFile) {
              selectedFile = newFile; // Update the selected file
              const newFileReader = new FileReader();
              newFileReader.onload = (e) => {
                filePreview.src = e.target.result; // Update preview
              };
              newFileReader.readAsDataURL(newFile);
            }
          });
        }
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(
            fileUploadFunc({
              filePath: selectedFile,
              isVideo: false,
              isMultiple: false,
            })
          ).then((data) => {
            if (!data.error) {
              const updatedBanks = [...banks];
              updatedBanks[index].file = [data?.payload?.data];
              setBanks(updatedBanks);
              const newFormErrors = [...formErrorsBank];
              if (newFormErrors[index]?.file) {
                delete newFormErrors[index].file;
              }
              setFormErrorsBank(newFormErrors);
            }
          });
        } else {
          // Handle the cancel case

        }
      });
    };

    // Read the file to generate the preview
    fileReader.readAsDataURL(file);
  }
  const handleDeleteBankImage = (index, file) => {
    const updatedBanks = [...banks];
    updatedBanks[index].file = [];
    setBanks(updatedBanks);
  };
  const handleBankDelete = (bank, index) => {
    if (bank?._id) {
      dispatch(deleteDocument({ _id: bank?._id })).then((data) => {
        if (!data.error) {
          setBanks((prevBanks) =>
            prevBanks.filter((_, index2) => index2 !== index)
          );
        }
      });
    } else {
      setBanks((prevBanks) =>
        prevBanks.filter((_, index2) => index2 !== index)
      );
    }
  };
  const validateBankForm = () => {
    let errors = [];
    banks.forEach((bank, index) => {
      let error = {};
      if (!bank.accountType) {
        error.accountType = "Account Type is required.";
      }
      if (!bank.bankholderName) {
        error.bankholderName = "Account Holder name is required.";
      }
      if (!bank.accountNumber) {
        error.accountNumber = "Account No is required.";
      }
      if (!bank.bankName) {
        error.bankName = "Bank Name is required.";
      }
      if (!bank.branchName) {
        error.branchName = "Branch Name is required.";
      }
      if (!bank.ifscCode) {
        error.ifscCode = "Ifsc code is required.";
      }
      // if (!bank.file || bank.file.length === 0) {
      //   error.file = "Bank file is required.";
      // }
      if (Object.keys(error).length > 0) {
        errors[index] = error;
      }
    });


    setFormErrorsBank(errors);
    return errors.every((error) => Object.keys(error).length === 0);
  };

  const handleInputChange = (index, field, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index][field] = value;
    setDocuments(updatedDocuments);
    const newFormErrors = [...formErrors];
    if (newFormErrors[index]?.[field]) {
      delete newFormErrors[index][field];
    }
    setFormErrors(newFormErrors);
  };

  // const handleFileChange = (index, file) => {
  //   dispatch(
  //     fileUploadFunc({
  //       filePath: file,
  //       isVideo: false,
  //       isMultiple: false,
  //     })
  //   ).then((data) => {
  //     if (!data.error) {
  //       const updatedDocuments = [...documents];
  //       updatedDocuments[index].file = [data?.payload?.data];
  //       setDocuments(updatedDocuments);
  //       const newFormErrors = [...formErrors];
  //       if (newFormErrors[index]?.file) {
  //         delete newFormErrors[index].file;
  //       }
  //       setFormErrors(newFormErrors);
  //     }
  //   });
  // };
  const handleFileChange = (index, file) => {
    if (!file) return;

    // Variable to track the newly selected file
    let selectedFile = file;

    // Create a preview of the file
    const fileReader = new FileReader();
    let filePreviewUrl = '';

    fileReader.onload = (e) => {
      filePreviewUrl = e.target.result;

      // Show SweetAlert to confirm upload
      Swal.fire({
        title: 'Preview your file',
        html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
              <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
              <img id="filePreview" src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">
              <br>
              <button id="changeImageBtn" style="  margin-top: 15px;
    padding: 10px 18px;
    cursor: pointer;
    background-color:#074173;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    transition: background-color 0.3s, transform 0.2s;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);">Change Image</button>
              <input type="file" id="fileInput" style="display: none;" accept="image/*">
            </div>
          `,
        showCancelButton: true,
        confirmButtonText: 'Confirm!',
        cancelButtonText: 'Cancel',
        didOpen: () => {
          // Attach the change image functionality to the button
          const changeImageBtn = document.getElementById('changeImageBtn');
          const fileInput = document.getElementById('fileInput');
          const filePreview = document.getElementById('filePreview');

          changeImageBtn.addEventListener('click', () => {
            fileInput.click(); // Trigger file input click
          });

          // When a new file is selected
          fileInput.addEventListener('change', (event) => {
            const newFile = event.target.files[0];
            if (newFile) {
              selectedFile = newFile; // Update the selected file
              const newFileReader = new FileReader();
              newFileReader.onload = (e) => {
                filePreview.src = e.target.result; // Update preview
              };
              newFileReader.readAsDataURL(newFile);
            }
          });
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Use the updated selectedFile (which could be the original or changed file)
          dispatch(
            fileUploadFunc({
              filePath: selectedFile,
              isVideo: false,
              isMultiple: false,
            })
          ).then((data) => {
            if (!data.error) {
              const updatedDocuments = [...documents];
              updatedDocuments[index].file = [data?.payload?.data];
              setDocuments(updatedDocuments);
              const newFormErrors = [...formErrors];
              if (newFormErrors[index]?.file) {
                delete newFormErrors[index].file;
              }
              setFormErrors(newFormErrors);
            }
          });
        } else {
          // Handle the cancel case

        }
      });
    };

    // Read the file to generate the preview
    fileReader.readAsDataURL(file);
  };
  const handleDeleteDoctImage = (index, file) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].file = [];
    setDocuments(updatedDocuments);
  };
  const handleDelete = (document, index) => {
    if (document?._id) {
      dispatch(deleteDocument({ _id: document?._id })).then((data) => {
        if (!data.error) {
          setDocuments((prevDocuments) =>
            prevDocuments.filter((_, index2) => index2 !== index)
          );
        }
      });
    } else {
      setDocuments((prevDocuments) =>
        prevDocuments.filter((_, index2) => index2 !== index)
      );
    }
  };

  const validateForm = () => {
    let errors = [];
    documents.forEach((document, index) => {
      let error = {};
      if (!document.documentType) {
        error.documentType = "Document Type is required.";
      }
      if (!document.documentNo) {
        error.documentNo = "Document No is required.";
      }
      if (!document.file || document.file.length === 0) {
        error.file = "Document file is required.";
      }
      if (Object.keys(error).length > 0) {
        errors[index] = error;
      }
    });

    setFormErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0); // returns true if no errors
  };


  return (
    <GlobalLayout>
      {editPageLoader ? <div className="h-full w-full flex justify-center items-center"><Loader2 /></div> : <div className="grid grid-cols-12 gap-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2  col-span-12 shadow-2xl rounded-xl"
        >
          <div className="flex bg-header justify-start items-center rounded-t-lg gap-5 px-3 pt-2 overflow-x-auto overflow-y-hidden text-nowrap">
            <button
              type="button"
              onClick={() => navTabClick(1)}
              className={`flex relative flex-col items-center  pb-2 ${step === 1 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 1 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold text-nowrap">
                Primary Details
              </span>
            </button>
            {/* <button
              type="button"
              onClick={() => navTabClick(2)}
              className={`flex flex-col items-center relative pb-2 ${step === 2 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 2 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">General Details</span>
            </button> */}
            <button
              type="button"
              onClick={() => navTabClick(8)}
              className={`flex flex-col items-center relative pb-2 ${step === 8 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 8 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Assign Leave</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(9)}
              className={`flex flex-col items-center relative pb-2 ${step === 9 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 9 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Salary</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(3)}
              className={`flex flex-col items-center relative pb-2 ${step === 3 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 3 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Family Details </span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(4)}
              className={`flex flex-col items-center relative pb-2 ${step === 4 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 4 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Emergency Contacts</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(5)}
              className={`flex flex-col items-center relative pb-2 ${step === 5 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 5 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Educational Details</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(6)}
              className={`flex flex-col items-center relative pb-2 ${step === 6 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 6 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold"> Past Employment</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(7)}
              className={`flex flex-col items-center relative pb-2 ${step === 7 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 7 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Social Media</span>
            </button>

            <button
              type="button"
              onClick={() => navTabClick(10)}
              className={`flex flex-col items-center relative pb-2 ${step === 10 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 10 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Document</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(11)}
              className={`flex flex-col items-center relative pb-2 ${step === 11 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 11 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">bank</span>
            </button>
          </div>
          {step === 1 && (
            <div>
              <Controller
                name="ProfileImage"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    setValue={setValue} // Pass setValue to the ImageUploader
                    name="image" // The field name in React Hook Form
                    field={field}

                  />
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:my-1 px-3">
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Department<span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="PDDepartmentId"
                    control={control}
                    rules={{ required: "Department is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputAntdSelectClassName} ${errors.PDDepartmentId ? '' : 'border-gray-300'}`}
                        showSearch
                       filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                              }
                        onChange={(value) => {
                          field.onChange(value);
                          handleDepartmentChange(value); // Custom handler if needed
                        }}
                        placeholder="Select Department"
                      >
                        <Option value="">Select Department</Option>
                        {depLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(departmentListData)?.map((element) => (
                          <Option key={element?._id} value={element?._id}>
                            {element?.name}
                          </Option>
                        )))}
                      </Select>
                    )}
                  />

                  {errors.PDDepartmentname && (
                    <p className="text-red-500 text-sm">
                      {errors.PDDepartmentname.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Designation<span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="PDDesignationId"
                    control={control}
                    rules={{ required: "Designation is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputAntdSelectClassName} ${errors.PDDesignationId ? '' : 'border-gray-300'}`}
                        showSearch
                       filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                              }
                        placeholder="Select Designation"
                      >
                        <Option value="">Select Designation</Option>
                        {desLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(designationList)?.map((type) => (
                          <Option key={type?._id} value={type?._id}>
                            {type?.name}
                          </Option>
                        )))}
                      </Select>
                    )}
                  />
                  {errors.PDDesignationname && (
                    <p className="text-red-500 text-sm">
                      {errors.PDDesignationname.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("PDFullName", {
                      required: "Full Name is required",
                    })}
                    className={`placeholder: ${inputClassName} ${errors.PDFullName ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Full Name"
                  />
                  {errors.PDFullName && (
                    <p className="text-red-500 text-sm">
                      {errors.PDFullName.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Email<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("PDEmail", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={` ${inputClassName} ${errors.PDEmail ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Email"
                  />
                  {errors.PDEmail && (
                    <p className="text-red-500 text-sm">
                      {errors.PDEmail.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Office Email
                  </label>
                  <input
                    type="text"
                    {...register("PDOfficeemail", {
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={` ${inputClassName} ${errors.PDOfficeemail
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    placeholder="Enter Office Email"
                  />
                  {errors.PDOfficeemail && (
                    <p className="text-red-500 text-sm">
                      {errors.PDOfficeemail.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>Reporting Person</label>
                  <Controller
                    name="reportingEmployee"
                    control={control}
                    render={({ field }) => (
                      // <ReactSelect
                      //   {...field}
                      //   onFocus={() => {
                      //     const reqPayload = {
                      //       text: "",
                      //       status: true,
                      //       sort: true,
                      //       isTL: "",
                      //       isHR: "",
                      //       isManager: true,
                      //       isPagination: false,
                      //       departmentId: "",
                      //       designationId: "",
                      //       companyId: onBoardingDetailsData?.companyId,
                      //       branchId: onBoardingDetailsData?.branchId,
                      //     };

                      //     dispatch(employeSearch(reqPayload));
                      //   }}
                      //   isClearable
                      //   options={employeList?.map((employee) => ({
                      //     value: employee?._id,
                      //     label: employee?.fullName,
                      //   }))}
                      //   classNamePrefix="react-select"
                      //   className={`${inputLabelClassNameReactSelect} ${errors.employee ? "border-[1px] " : "border-gray-300"
                      //     }`}
                      //   placeholder="Select Employee"
                      // />

                      <Select

                        style={{ width: '100%' }}
                        className={`${inputAntdSelectClassName}`}
                        value={field?.value}
                        getOptionLabel={(e) => e.label}
      getOptionValue={(e) => e.value}
                        onChange={(value) => {
                          field.onChange(value)
                        }
                        }
                        allowClear
                        onFocus={reportingOption}
                        options={employeeList}
                        placeholder="Select Reporting Person"
                        showSearch
                       filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                              }
                      />

                    )}
                  />
                  {errors.employee && (
                    <p className="text-red-500 text-sm">
                      {errors.employee.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="w-[150px]">
                    <label className={`${inputLabelClassName}`}>
                      code<span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="PDmobileCode"
                      rules={{ required: "code is required" }}
                      render={({ field }) => (
                        <CustomMobileCodePicker
                          field={field}
                          errors={errors}
                        />
                      )}
                    />
                    {errors[`PDmobileCode`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`PDmobileCode`].message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Mobile No<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      {...register(`PDMobileNo`, {
                        required: "Mobile No is required",
                        minLength: {
                          value: 10,
                          message: "Must be exactly 10 digits",
                        },
                        maxLength: {
                          value: 10,
                          message: "Must be exactly 10 digits",
                        },
                      })}
                      className={` ${inputClassName} ${errors[`PDMobileNo`]
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Mobile No"
                      maxLength={10}
                      onInput={(e) => {
                        if (e.target.value.length > 10) {
                          e.target.value = e.target.value.slice(0, 10);
                        }
                      }}
                    />
                    {errors[`PDMobileNo`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`PDMobileNo`].message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                <div>
                  {/* Select Gender */}
                  <label className={`${inputLabelClassName}`}>
                    Gender <span className="text-red-600">*</span>
                  </label>

                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`mt-0 ${inputAntdSelectClassName} ${errors.gender ? '' : 'border-gray-300'}`}
                        placeholder="Select Gender"
                      >
                        <Option value="">Select Gender</Option>
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    )}
                  />

                  {errors.gender && (
                    <p className="text-red-500 text-sm">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                <div>
                  {/* Select Blood Group */}
                  <label className={`${inputLabelClassName}`}>
                    Blood Group
                  </label>

                  <Controller
                    name="BloodGroup"
                    control={control}

                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`mt-0 ${inputAntdSelectClassName} ${errors.BloodGroup ? '' : 'border-gray-300'}`}
                        placeholder="Select Blood Group"
                      >
                        <Option value="">Select Blood Group</Option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bloodType) => (
                          <Option key={bloodType} value={bloodType}>
                            {bloodType}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.BloodGroup && (
                    <p className="text-red-500 text-sm">
                      {errors.BloodGroup.message}
                    </p>
                  )}
                </div>
                <div>
                  {/* Select Gender */}
                  <label className={`${inputLabelClassName}`}>
                    Sidebar Role <span className="text-red-600">*</span>
                  </label>

                  <Controller
                    name="sidebarRole"
                    control={control}
                    rules={{ required: "Sidebar Role is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`mt-0 ${inputAntdSelectClassName} ${errors.sidebarRole ? '' : 'border-gray-300'}`}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                        placeholder="Select Sidebar Role"
                      >
                        <Option value="">Select Sidebar Role</Option>
                        {rolesPermissionList && rolesPermissionList.length > 0 &&
                          rolesPermissionList.map((data, index) => {
                            return (
                              <Option key={index} value={data?._id}>
                                {data?.designationName}
                              </Option>
                            );
                          })
                        }


                      </Select>
                    )}
                  />

                  {errors.sidebarRole && (
                    <p className="text-red-500 text-sm">
                      {errors.sidebarRole.message}
                    </p>
                  )}
                </div>


                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Date of Birth <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                        return current && current.isAfter(moment().endOf('day'), 'day');
                      }} />
                    )}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>


                <div>
                  {/* Select Marital Status */}
                  <label className={`${inputLabelClassName}`}>
                    Marital Status <span className="text-red-600">*</span>
                  </label>

                  <Controller
                    name="maritalStatus"
                    control={control}
                    rules={{ required: "Marital status is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`mt-0 ${inputAntdSelectClassName} ${errors.maritalStatus ? '' : 'border-gray-300'}`}
                        placeholder="Select Marital Status"
                      >
                        <Option value="">Select Marital Status</Option>
                        <Option value="Single">Single</Option>
                        <Option value="Married">Married</Option>
                        <Option value="Divorced">Divorced</Option>
                      </Select>
                    )}
                  />

                  {errors.maritalStatus && (
                    <p className="text-red-500 text-sm">
                      {errors.maritalStatus.message}
                    </p>
                  )}
                </div>
                  <div className="w-full">
                                  <label className={`${inputLabelClassName}`}>
                                    Opening Balance
                                  </label>
                                  <input
                                    type="number"
                                    step="any"
                                    {
                                      ...register('openingBalance',{
                                      
                                      })
                                    }
                                    disabled={onBoardingDetailsData?.openingBalance}
                                    value={onBoardingDetailsData?.openingBalance}
                                    // onChange={(e) =>
                                    //   handleInputChangeBank(
                                    //     index,
                                    //     "openingBalance",
                                    //     e.target.value
                                    //   )
                                    // }
                                    className={`${onBoardingDetailsData?.openingBalance ? inputDisabledClassName:inputClassName } `}
                                    placeholder="Enter Opening Balance"
                                  />
                                
                                </div>

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:my-1 px-3">
                <div className="">
                  {/* Select probation */}
                  <label className={`${inputLabelClassName}`}>
                    Select probation <span className="text-red-600">*</span>
                  </label>

                  <Controller
                    name="isProbationPeriod"
                    control={control}
                    rules={{ required: "probation is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputAntdSelectClassName} ${errors.isProbationPeriod ? '' : 'border-gray-300'}`}
                        placeholder="Select probation"
                      >
                        <Option value="">Select probation</Option>
                        <Option value={'Yes'}>Yes</Option>
                        <Option value={'No'}>No</Option>
                      </Select>
                    )}
                  />

                  {errors.isProbationPeriod && (
                    <p className="text-red-500 text-sm">
                      {errors.isProbationPeriod.message}
                    </p>
                  )}
                </div>
                {(isProbationPeriodActive === "Yes" ||
                  isProbationPeriodActive === true) && (
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Is Leave Applicable<span className="text-red-600">*</span>
                      </label>
                      <Controller
                        name="isProbationPeriodLeave"
                        control={control}
                        // rules={{ required: "probation Paid is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.isProbationPeriodLeave ? '' : 'border-gray-300'}`}
                            placeholder=">Select is Leave Applicable"
                          >
                            <Option value="">Select is Leave Applicable</Option>
                            <Option value={'Yes'}>Yes</Option>
                            <Option value={'No'}>No</Option>
                          </Select>
                        )}
                      />
                      {errors.isProbationPeriodLeave && (
                        <p className="text-red-500 text-sm">
                          {errors.isProbationPeriodLeave.message}
                        </p>
                      )}
                    </div>
                  )}
                {(isProbationPeriodActive === "Yes" ||
                  isProbationPeriodActive === true) && (
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        probation Period (days) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("probationPeriod", {
                          required: "probation Period is required",
                        })}
                        className={`${inputClassName} ${errors.probationPeriod
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter probation Period"
                      />
                      {errors.probationPeriod && (
                        <p className="text-red-500 text-sm">
                          {errors.probationPeriod.message}
                        </p>
                      )}
                    </div>
                  )}
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Date of Joining <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="dateOfJoining"
                    control={control}
                    render={({ field }) => (
                      <CustomDatePicker field={field} errors={errors} />
                    )}
                  />

                  {errors.dateOfJoining && (
                    <p className="text-red-500 text-sm">
                      {errors.dateOfJoining.message}
                    </p>
                  )}
                </div>
                <div className="">
                  {/* Select Shift */}
                  <label className={`${inputLabelClassName}`}>
                    Select Shift <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="shift"
                    control={control}
                    rules={{ required: "Shift is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputAntdSelectClassName} ${errors.shift ? '' : 'border-gray-300'}`}
                        placeholder="Select Shift"
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        <Option value="">Select Shift</Option>
                        {timeSlotsListData?.map((type) =>
                          <Option key={type?._id} value={type?._id}>
                            {type?.shiftName}
                          </Option>
                        )}
                      </Select>
                    )}
                  />

                  {errors.shift && (
                    <p className="text-red-500 text-sm">
                      {errors.shift.message}
                    </p>
                  )}
                </div>

                <div className="">
                  {/* Select Work Type */}
                  <label className={`${inputLabelClassName}`}>
                    Select Work Type <span className="text-red-600">*</span>
                  </label>

                  <Controller
                    name="workType"
                    control={control}
                    rules={{ required: "Work Type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputAntdSelectClassName} ${errors.workType ? '' : 'border-gray-300'}`}
                        placeholder="Select Work Type"
                      >
                        <Option value="">Select Work Type</Option>
                        {[
                          { key: "work_from_office", value: "Work From Office" },
                          { key: "work_from_home", value: "Work From Home" },
                          { key: "hybrid", value: "Hybrid" },
                          { key: "remote", value: "Remote" }
                        ]?.map((type) => (
                          <Option key={type.key} value={type.key}>
                            {type.value}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.workType && (
                    <p className="text-red-500 text-sm">
                      {errors.workType.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                                      <label className={`${inputLabelClassName}`}>
                                        Landline No (EPBX)
                                      </label>
                                      <input
                                        type="text"
                                        {...register(`landlineNo`, {
                                         
                                        
                                        })}
                                        className={` ${inputClassName} ${errors[`landlineNo`]
                                          ? "border-[1px] "
                                          : "border-gray-300"
                                          }`}
                                        placeholder="Enter Landline No"
                                       
                                      />
                                      {errors[`landlineNo`] && (
                                        <p className="text-red-500 text-sm">
                                          {errors[`landlineNo`].message}
                                        </p>
                                      )}
                                    </div>
                
                                    <div className="w-full">
                                      <label className={`${inputLabelClassName}`}>
                                        Seat No
                                      </label>
                                      <input
                                        type="number"
                                        {...register(`seatNo`, {
                                         
                                        
                                        })}
                                        className={` ${inputClassName} ${errors[`seatNo`]
                                          ? "border-[1px] "
                                          : "border-gray-300"
                                          }`}
                                        placeholder="Enter Seat No"
                                       
                                      />
                                      {errors[`seatNo`] && (
                                        <p className="text-red-500 text-sm">
                                          {errors[`seatNo`].message}
                                        </p>
                                      )}
                                    </div>

              </div>
              <div className="mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:my-1 px-3">
                  <div className="col-span-2">
                    <label className={`${inputLabelClassName}`}>
                      Primary Address<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("PDAddress", {
                        required: "Primary Address is required",
                      })}
                      className={`${inputClassName} ${errors.PDAddress ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Primary Address"
                    />
                    {errors.PDAddress && (
                      <p className="text-red-500 text-sm">
                        {errors.PDAddress.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:my-1 px-3">
                  <div>
                    <div className={`${inputLabelClassName}`}>
                      Country <span className="text-red-600">*</span>
                    </div>
                    <Controller
                      control={control}
                      name="PDcountry"
                      rules={{ required: "Country is required" }}
                      render={({ field }) => (
                        <AutoComplete
                          {...field}
                          onChange={(value) => {
                            // Directly handle country change by using setValue from React Hook Form
                            field.onChange(value); // Update the value in the form control
                          }}
                          className="w-full"
                          options={sortByPropertyAlphabetically(countryListData?.docs)?.map((type) => ({
                            value: type?.name,
                          }))}
                        >
                          <input
                            placeholder="Enter Country"
                            onFocus={() => {
                              dispatch(
                                countrySearch({
                                  isPagination: false,
                                  text: "",
                                  sort: true,
                                  status: true,
                                })
                              );
                            }}
                            className={`${inputClassName} ${errors.PDcountry
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                          />
                        </AutoComplete>
                      )}
                    />
                    {errors.PDcountry && (
                      <p className={`${inputerrorClassNameAutoComplete}`}>
                        {errors.PDcountry.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className={`${inputLabelClassName}`}>
                      State <span className="text-red-600">*</span>
                    </div>
                    <Controller
                      control={control}
                      name="PDState"
                      rules={{ required: "State is required" }}
                      render={({ field }) => (
                        <AutoComplete
                          {...field}
                          className="w-full"
                          onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
                          options={sortByPropertyAlphabetically(stateListData?.docs)?.map((type) => ({
                            value: type?.name,
                          }))}
                        >
                          <input
                            placeholder="Enter State"
                            onFocus={() => {
                              dispatch(
                                stateSearch({
                                  isPagination: false,
                                  text: "",
                                  countryName: watch("PDcountry"),
                                  sort: true,
                                  status: true,
                                })
                              );
                            }}
                            className={`${inputClassName} ${errors.PDState
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                          />
                        </AutoComplete>
                      )}
                    />
                    {errors.PDState && (
                      <p className={`${inputerrorClassNameAutoComplete}`}>
                        {errors.PDState.message}
                      </p>
                    )}
                  </div>

                  {/* City Field */}
                  <div>
                    <div className={`${inputLabelClassName}`}>
                      City <span className="text-red-600">*</span>
                    </div>
                    <Controller
                      control={control}
                      name="PDCity"
                      rules={{ required: "City is required" }}
                      render={({ field }) => (
                        <AutoComplete
                          {...field}
                          className="w-full"
                          onChange={(value) => field.onChange(value)} // Directly handle city change using React Hook Form's field.onChange
                          options={sortByPropertyAlphabetically(cityListData?.docs)?.map((type) => ({
                            value: type?.name,
                          }))}
                        >
                          <input
                            placeholder="Enter City"
                            onFocus={() => {
                              dispatch(
                                citySearch({
                                  isPagination: false,
                                  text: "",
                                  sort: true,
                                  status: true,
                                  stateName: watch("PDState"),
                                })
                              );
                            }}
                            className={`${inputClassName} ${errors.PDCity
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                          />
                        </AutoComplete>
                      )}
                    />
                    {errors.PDCity && (
                      <p className={`${inputerrorClassNameAutoComplete}`}>
                        {errors.PDCity.message}
                      </p>
                    )}
                  </div>

                  {/* Pin Code Field */}
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Pin Code <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="PDPin"
                      rules={{ required: "Pin Code is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          placeholder="Enter Pin Code"
                          maxLength={6}
                          onInput={(e) => {
                            if (e.target.value.length > 6) {
                              e.target.value = e.target.value.slice(0, 6);
                            }
                          }}
                          className={`${inputClassName} ${errors.PDPin ? "border-[1px] " : "border-gray-300"
                            }`}
                        />
                      )}
                    />
                    {errors.PDPin && (
                      <p className="text-red-500 text-sm">
                        {errors.PDPin.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:my-1 px-3">
                    <div className="col-span-2">
                      <label
                        className={`${inputLabelClassName} flex justify-between items-center`}
                      >
                        <span>Secondary Address</span>
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id="sameAsCurrentAddress"
                            onChange={(e) =>
                              handleAddressCheckbox(e.target.checked)
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor="sameAsCurrentAddress"
                            className={`${inputLabelClassName}`}
                          >
                            same as Current Address
                          </label>
                        </div>
                      </label>
                      <input
                        type="text"
                        {...register("PDSecAddress")}
                        className={`${inputClassName} ${errors.PDSecAddress
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter Secondary Address"
                      />
                      {errors.PDSecAddress && (
                        <p className="text-red-500 text-sm">
                          {errors.PDSecAddress.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:my-1 px-3">
                    {/* Secondary Address Fields (mirroring Primary Address) */}
                    <div>
                      <div className={`${inputLabelClassName}`}>
                        Country
                      </div>
                      <Controller
                        control={control}
                        name="PDSecCountry"

                        render={({ field }) => (
                          <AutoComplete
                            {...field}
                            className="w-full"
                            options={sortByPropertyAlphabetically(secCountryList?.docs)?.map((type) => ({
                              value: type?.name,
                            }))}
                          >
                            <input
                              placeholder="Enter Country"
                              onFocus={() =>
                                dispatch(
                                  secCountrySearch({
                                    isPagination: false,
                                    text: "",
                                    sort: true,
                                    status: true,
                                  })
                                )
                              }
                              className={`${inputClassName} ${errors.PDSecCountry
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            />
                          </AutoComplete>
                        )}
                      />
                      {errors.PDSecCountry && (
                        <p className="text-red-500 text-sm">
                          {errors.PDSecCountry.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className={`${inputLabelClassName}`}>
                        State
                      </div>
                      <Controller
                        control={control}
                        name="PDSecState"

                        render={({ field }) => (
                          <AutoComplete
                            {...field}
                            className="w-full"
                            onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
                            options={sortByPropertyAlphabetically(stateListData?.docs)?.map((type) => ({
                              value: type?.name,
                            }))}
                          >
                            <input
                              placeholder="Enter State"
                              onFocus={() => {
                                dispatch(
                                  stateSearch({
                                    isPagination: false,
                                    text: "",
                                    countryName: watch(`PDSecCountry`),
                                    sort: true,
                                    status: true,
                                  })
                                );
                              }}
                              className={`${inputClassName} ${errors.PDState
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            />
                          </AutoComplete>
                        )}
                      />
                      {errors.PDSecState && (
                        <p className="text-red-500 text-sm">
                          {errors.PDSecState.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className={`${inputLabelClassName}`}>
                        City
                      </div>
                      <Controller
                        control={control}
                        name="PDSecCity"

                        render={({ field }) => (
                          <AutoComplete
                            {...field}
                            className="w-full"
                            onChange={(value) => field.onChange(value)} // Directly handle city change using React Hook Form's field.onChange
                            options={sortByPropertyAlphabetically(cityListData?.docs)?.map((type) => ({
                              value: type?.name,
                            }))}
                          >
                            <input
                              placeholder="Enter City"
                              onFocus={() => {
                                dispatch(
                                  citySearch({
                                    isPagination: false,
                                    text: "",
                                    sort: true,
                                    status: true,
                                    stateName: watch(`PDSecState`),
                                  })
                                );
                              }}
                              className={`${inputClassName} ${errors.PDCity
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            />
                          </AutoComplete>
                        )}
                      />
                      {errors.PDSecCity && (
                        <p className="text-red-500 text-sm">
                          {errors.PDSecCity.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`${inputLabelClassName}`}>
                        Pin Code
                      </label>
                      <Controller
                        control={control}
                        name="PDSecPinCode"

                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            placeholder="Enter Pin Code"
                            maxLength={6}
                            onInput={(e) => {
                              if (e.target.value.length > 6) {
                                e.target.value = e.target.value.slice(0, 6);
                              }
                            }}
                            className={`${inputClassName} ${errors.PDSecPinCode
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                          />
                        )}
                      />
                      {errors.PDSecPinCode && (
                        <p className="text-red-500 text-sm">
                          {errors.PDSecPinCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>


              <div className="flex justify-start m-4">
                <button
                  type="submit"
                  disabled={onBoardingLaoding}
                  className={`${onBoardingLaoding ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
                >
                  {onBoardingLaoding ? <Loader /> : 'Submit'}
                </button>

              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              {fields.map((item, index) => (
                <div key={index} className=" rounded-md my-2 ">
                  <div className="flex justify-between items-center mb-4 bg-header rounded-t-md px-3">
                    <div className="py-2 text-white font-semibold">
                      Family Details
                    </div>
                 
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => remove( index)}
                          className="text-gray-300 hover:text-gray-200 flex items-center justify-center p-1 rounded-lg"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
               
                  </div>
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-2 md:gap-8 px-3 md:my-4"
                  >
                    <div className="flex gap-3">
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Relation Type <span className="text-red-600">*</span>
                        </label>

                        <Controller
                          name={`family[${index}].relation`}
                          control={control}
                          rules={{ required: "Relation type is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={`mt-0 ${inputAntdSelectClassName} ${errors.family?.[index]?.relation ? '' : 'border-gray-300'}`}
                              placeholder="Select Relation Type"
                            >
                              <Option value="">Select Relation Type</Option>
                              {["Father", "Mother", "Spouse", "Child", "Sibling", "Other"].map((relation) => (
                                <Option key={relation} value={relation}>
                                  {relation}
                                </Option>
                              ))}
                            </Select>
                          )}
                        />

                        {errors.family?.[index]?.relation && (
                          <p className="text-red-500 text-sm">
                            {errors.family[index].relation.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          {...register(`family[${index}].name`, {
                            required: "Name is required",
                          })}
                          className={`${inputClassName} ${errors.family?.[index]?.name
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          placeholder="Enter Name"
                        />
                        {errors.family?.[index]?.name && (
                          <p className="text-red-500 text-sm">
                            {errors.family[index].name.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Age <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          {...register(`family[${index}].age`, {
                            required: "Age is required",
                          })}
                          className={`${inputClassName} ${errors.family?.[index]?.age
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          placeholder="Enter Age"
                        />
                        {errors.family?.[index]?.age && (
                          <p className="text-red-500 text-sm">
                            {errors.family[index].age.message}
                          </p>
                        )}
                      </div>
                    </div>

  

                    <div className="flex gap-2">
                      <div className="w-32">
                        <label className={`${inputLabelClassName}`}>
                          Mobile code <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          control={control}
                          name={`family[${index}].contactNumber.code`}
                          rules={{ required: "code is required" }}
                          render={({ field }) => (
                            <CustomMobileCodePicker
                              field={field}
                              errors={errors}
                            />
                          )}
                        />

                        {errors.family?.[index]?.contactNumber.code && (
                          <p className="text-red-500 text-sm">
                            {errors.family?.[index].contactNumber.code.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Mobile No <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          {...register(
                            `family[${index}].contactNumber.number`,
                            {
                              required: "Mobile number is required",
                              minLength: {
                                value: 10,
                                message: "Must be exactly 10 digits",
                              },
                              maxLength: {
                                value: 10,
                                message: "Must be exactly 10 digits",
                              },
                            }
                          )}
                          className={`${inputClassName} ${errors?.family?.[index]?.contactNumber?.number
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          placeholder="Enter Mobile No"
                          maxLength={10}
                          onInput={(e) => {
                            if (e.target.value.length > 10) {
                              e.target.value = e.target.value.slice(0, 10);
                            }
                          }}
                        />
                      </div>

                      {errors?.family?.[index]?.contactNumber?.number && (
                        <p className="text-red-500 text-sm">
                          {
                            errors?.family?.[index]?.contactNumber?.number
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between px-3 py-2">
                <button
                  type="button"
                  onClick={() =>
                    append({
                      relation: "",
                      name: "",
                      age: "",
                      contactNumber: "",
                    })
                  }
                  className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded"
                >
                  Add More
                </button>
              </div>
              <div className="flex justify-between px-3 pb-2">
                <button type="Submit" className={`${formButtonClassName}`}>
                  Submit Details
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              {emergencyContactFields.map((item, index) => (
                <div key={index} className=" rounded-md my-2 ">
                  <div key={item.id} className="rounded-md">
                    <div className="flex justify-between items-center mb-4 bg-header rounded-t-md px-3">
                      <div className="py-2 text-white font-semibold">
                        Emergency Contact
                      </div>
                     
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeEmergencyContact(index)}
                            className="text-gray-300 hover:text-gray-200 flex items-center justify-center p-1 rounded-lg"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                     
                    </div>
                    <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                      <div className="flex gap-3">
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Name <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            {...register(`emergencyContact[${index}].name`, {
                              required: "Name is required",
                            })}
                            className={`${inputClassName} ${errors.emergencyContact?.[index]?.name
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                            placeholder="Enter Name"
                          />
                          {errors.emergencyContact?.[index]?.name && (
                            <p className="text-red-500 text-sm">
                              {errors.emergencyContact[index].name.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Relationship <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            {...register(
                              `emergencyContact[${index}].relationship`,
                              { required: "Relationship is required" }
                            )}
                            className={`${inputClassName} ${errors.emergencyContact?.[index]?.relationship
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                            placeholder="Enter Relationship"
                          />
                          {errors.emergencyContact?.[index]?.relationship && (
                            <p className="text-red-500 text-sm">
                              {
                                errors.emergencyContact[index].relationship
                                  .message
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Email <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="email"
                            {...register(`emergencyContact[${index}].email`, {
                              required: "Email is required",
                            })}
                            className={`${inputClassName} ${errors.emergencyContact?.[index]?.email
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                            placeholder="Enter Email"
                          />
                          {errors.emergencyContact?.[index]?.email && (
                            <p className="text-red-500 text-sm">
                              {errors.emergencyContact[index].email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="">
                        <div className="flex gap-2">
                          <div className="">
                            <label className={`${inputLabelClassName}`}>
                              Mobile code{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              control={control}
                              name={`emergencyContact[${index}].mobile.code`}
                              rules={{ required: "code is required" }}
                              render={({ field }) => (
                                <CustomMobileCodePicker
                                  field={field}
                                  errors={errors}
                                />
                              )}
                            />
                            {/* <select
                              {...register(
                                `emergencyContact[${index}].mobile.code`,
                                { required: "Mobile code is required" }
                              )}
                              className={`${inputClassName} ${errors.emergencyContact?.[index]?.mobile?.code
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            >
                              <option value="">Select Country Code</option>
                              <option value="+1">+1</option>
                              <option value="+44">+44</option>
                              <option value="+91">+91</option>
                            </select> */}
                            {errors.emergencyContact?.[index]?.mobile.code && (
                              <p className="text-red-500 text-sm">
                                {
                                  errors.emergencyContact[index].mobile.code
                                    .message
                                }
                              </p>
                            )}
                          </div>
                          <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                              Mobile No <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="number"
                              {...register(
                                `emergencyContact[${index}].mobile.number`,
                                {
                                  required: "Mobile number is required",
                                  minLength: {
                                    value: 10,
                                    message: "Must be exactly 10 digits",
                                  },
                                  maxLength: {
                                    value: 10,
                                    message: "Must be exactly 10 digits",
                                  },
                                }
                              )}
                              className={`${inputClassName} ${errors.emergencyContact?.[index]?.mobile?.number
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter Mobile No"
                              maxLength={10}
                              onInput={(e) => {
                                if (e.target.value.length > 10) {
                                  e.target.value = e.target.value.slice(0, 10);
                                }
                              }}
                            />
                          </div>
                          {errors.emergencyContact?.[index]?.mobile?.number && (
                            <p className="text-red-500 text-sm">
                              {
                                errors.emergencyContact[index].mobile.number
                                  .message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-start px-3 py-2">
                <button
                  type="button"
                  onClick={() =>
                    appendEmergencyContact({
                      name: "",
                      relationship: "",
                      email: "",
                      mobile: {
                        code: "",
                        number: "",
                      },
                    })
                  }
                  className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded"
                >
                  Add Emergency Contact
                </button>
              </div>

              <div className="flex justify-between px-3 pb-2">
                <button type="Submit" className={`${formButtonClassName}`}>
                  Submit Details
                </button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div>
              {educationDetails.map((item, index) => (
                <div key={index} className=" rounded-md my-2 ">
                  <div key={item.id} className="">
                    <div className="flex justify-between items-center mb-4 bg-header rounded-t-md px-3">
                      <div className="py-2 text-white font-semibold">
                        Education Details
                      </div>
                     
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeEducational(index)}
                            className="text-gray-300 hover:text-gray-200 flex items-center justify-center p-1 rounded-lg"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                    
                    </div>
                    <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Degree <span className="text-red-600">*</span>
                        </label>
                        <input
                          {...register(`educationDetails[${index}].degree`, {
                            required: "Degree is required",
                          })}
                          className={`${inputClassName} ${errors.educationDetails?.[index]?.degree
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        />
                        {errors.educationDetails?.[index]?.degree && (
                          <p className="text-red-500 text-sm">
                            {errors.educationDetails[index].degree.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          University <span className="text-red-600">*</span>
                        </label>
                        <input
                          {...register(
                            `educationDetails[${index}].university`,
                            {
                              required: "University is required",
                            }
                          )}
                          className={`${inputClassName} ${errors.educationDetails?.[index]?.university
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        />
                        {errors.educationDetails?.[index]?.university && (
                          <p className="text-red-500 text-sm">
                            {errors.educationDetails[index].university.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          From <span className="text-red-600">*</span>
                        </label>

                        <Controller
                          name={`educationDetails[${index}].from`}
                          control={control}
                          render={({ field }) => (
                            <CustomDatePicker field={field} errors={errors} />
                          )}
                        />
                        {errors.educationDetails?.[index]?.from && (
                          <p className="text-red-500 text-sm">
                            {errors.educationDetails[index].from.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          To <span className="text-red-600">*</span>
                        </label>

                        <Controller
                          name={`educationDetails[${index}].to`}
                          control={control}
                          render={({ field }) => (
                            <CustomDatePicker field={field} errors={errors} />
                          )}
                        />
                        {errors.educationDetails?.[index]?.to && (
                          <p className="text-red-500 text-sm">
                            {errors.educationDetails[index].to.message}
                          </p>
                        )}
                      </div>

                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Marking Type
                        </label>

                        <Controller
                          name={`educationDetails[${index}].isPercentage`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={` ${inputAntdSelectClassName} ${errors.educationDetails?.[index]?.isPercentage ? "border-[1px] " : "border-gray-300"}`}
                              placeholder="Select Marking Type"
                            >
                              <Option value={true}>Percentage</Option>
                              <Option value={false}>Grade</Option>
                            </Select>
                          )}
                        />

                        {errors.educationDetails?.[index]?.isPercentage && (
                          <p className="text-red-500 text-sm">
                            {errors.educationDetails?.[index]?.isPercentage.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full ">
                        <label className={`${inputLabelClassName}`}>
                          Percentage / Grade{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          {...register(`educationDetails[${index}].number`, {
                            required: "Percentage is required",
                            valueAsNumber: true,
                          })}
                          className={`${inputClassName} ${errors.educationDetails?.[index]?.number
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        />
                        {errors.educationDetails?.[index]?.number && (
                          <p className="text-red-500 text-sm">
                            {errors.educationDetails[index].number.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Specification <span className="text-red-600">*</span>
                        </label>
                        <input
                          {...register(
                            `educationDetails[${index}].specification`,
                            { required: "Specification is required" }
                          )}
                          className={`${inputClassName} ${errors.educationDetails?.[index]?.specification
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        />
                        {errors.educationDetails?.[index]?.specification && (
                          <p className="text-red-500 text-sm">
                            {
                              errors.educationDetails[index].specification
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Education Button */}
              <button
                type="button"
                onClick={() =>
                  appendEducational({
                    degree: "",
                    university: "",
                    from: "",
                    to: "",
                    isPercentage: false,
                    number: "",
                    specification: "",
                  })
                }
                className={`${formButtonClassName} mx-3`}
              >
                Add Education
              </button>

              <div className="flex justify-between px-3 pb-2">
                <button type="Submit" className={`${formButtonClassName}`}>
                  Submit Details
                </button>
              </div>
            </div>
          )}
          {step === 6 && (
            <div>
              {employmentDetails.map((item, index) => (
                <div key={index} className=" rounded-md my-2 ">
                  <div key={item.id} className="">
                    <div className="flex justify-between items-center mb-4 bg-header rounded-t-md px-3">
                      <div className="py-2 text-white font-semibold">
                        Past Employment {" "}
                      </div>
                      
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeEmployment( index)}
                            className="text-gray-300 hover:text-gray-200 flex items-center justify-center p-1 rounded-lg"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                     
                    </div>
                    <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Organization Name{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          {...register(
                            `employmentDetails[${index}].organizationName`,
                            { required: "Organization name is required" }
                          )}
                          className={`${inputClassName} ${errors.employmentDetails?.[index]?.organizationName
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        />
                        {errors.employmentDetails?.[index]
                          ?.organizationName && (
                            <p className="text-red-500 text-sm">
                              {
                                errors.employmentDetails[index].organizationName
                                  .message
                              }
                            </p>
                          )}
                      </div>

                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Designation Name{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          {...register(
                            `employmentDetails[${index}].designationName`,
                            { required: "Designation name is required" }
                          )}
                          className={`${inputClassName} ${errors.employmentDetails?.[index]?.designationName
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        />
                        {errors.employmentDetails?.[index]?.designationName && (
                          <p className="text-red-500 text-sm">
                            {
                              errors.employmentDetails[index].designationName
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          From <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name={`employmentDetails[${index}].from`}
                          control={control}
                          render={({ field }) => (
                            <CustomDatePicker field={field} errors={errors} />
                          )}
                        />

                        {errors.employmentDetails?.[index]?.from && (
                          <p className="text-red-500 text-sm">
                            {errors.employmentDetails[index].from.message}
                          </p>
                        )}
                      </div>
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          To <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name={`employmentDetails[${index}].to`}
                          control={control}
                          render={({ field }) => (
                            <CustomDatePicker field={field} errors={errors} />
                          )}
                        />

                        {errors.employmentDetails?.[index]?.to && (
                          <p className="text-red-500 text-sm">
                            {errors.employmentDetails[index].to.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Annual CTC <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          {...register(
                            `employmentDetails[${index}].annualCTC`,
                            {
                              required: "Annual CTC is required",
                              valueAsNumber: true,
                            }
                          )}
                          className={`${inputClassName} ${errors.employmentDetails?.[index]?.annualCTC
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        />
                        {errors.employmentDetails?.[index]?.annualCTC && (
                          <p className="text-red-500 text-sm">
                            {errors.employmentDetails[index].annualCTC.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  appendEmployment({
                    organizationName: "",
                    designationName: "",
                    from: "",
                    to: "",
                    annualCTC: "",
                  })
                }
                className={`${formButtonClassName} mx-3`}
              >
                Add Employment
              </button>

              <div className="flex justify-between px-3 pb-2">
                <button type="Submit" className={`${formButtonClassName}`}>
                  Submit Details
                </button>
              </div>
            </div>
          )}
          {step === 7 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:my-1 px-3">
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    LinkedIn Link
                  </label>
                  <div className="flex">
                    <input className="mt-1 block w-[70px] px-2 py-[12px] shadow-sm rounded-l-xl text-sm bg-gray-200 focus:outline-none" disabled value={"https://"} />
                    <input
                      type="text"
                      {...register("SMLinkedIn")}
                      className={`mt-1 block w-full px-2 py-[12px] shadow-sm rounded-r-xl text-sm bg-white focus:outline-none ${errors.SMLinkedIn ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Enter Twitter Link"
                    />
                  </div>
                  {errors.SMLinkedIn && <p className="text-red-500 text-sm">{errors.SMLinkedIn.message}</p>}
                </div>
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Github Link
                  </label>
                  <div className="flex">
                    <input className="mt-1 block w-[70px] px-2 py-[12px] shadow-sm rounded-l-xl text-sm bg-gray-200 focus:outline-none" disabled value={"https://"} />
                    <input
                      type="text"
                      {...register("SMGithub")}
                      className={`mt-1 block w-full px-2 py-[12px] shadow-sm rounded-r-xl text-sm bg-white focus:outline-none ${errors.SMGithub ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Enter Twitter Link"
                    />
                  </div>
                  {/* <input
                    type="url"
                    {...register("SMGithub")}
                    className={` ${inputClassName} ${errors.SMGithub ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Github Link"
                  /> */}
                  {errors.SMGithub && (
                    <p className="text-red-500 text-sm">
                      {errors.SMGithub.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between px-3 pb-2">
                <button type="submit" className={`${formButtonClassName}`}>
                  Submit
                </button>
              </div>
            </div>
          )}
          {step === 8 && (
            <div>
              <div className="px-3 grid lg:grid-cols-3 grid-cols-1 gap-4 items-end mb-3">
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    financial Start Date  <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name={'financStartDate'}
                    control={control}
                    rules={{ required: "financStartDate is required" }}
                    render={({ field }) => (
                      <CustomDatePicker format="MM/YYYY" picker="month" field={field} errors={errors} />
                    )}
                  />

                  {errors.financStartDate && (
                    <p className="text-red-500 text-sm">
                      {errors.financStartDate?.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    financial End Date  <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name={'financEndDate'}
                    control={control}
                    rules={{ required: "financEndDate is required" }}
                    render={({ field }) => (
                      <CustomDatePicker format="MM/YYYY" picker="month" field={field} errors={errors} disabledDate={(current) => {
                              const start = dayjs(watch('financStartDate'), "MM/YYYY");
                              return start.isValid() && current.isBefore(start, 'month');
                            }} />
                    )}
                  />

                  {errors.financEndDate && (
                    <p className="text-red-500 text-sm">
                      {errors.financEndDate?.message}
                    </p>
                  )}
                </div>
                <div className="">

                  <label className={`${inputLabelClassName}`}>
                    Select Leave Policy <span className="text-red-600">*</span>
                  </label>

                  <Controller
                    name="leaveTypePolicy"
                    control={control}
                    rules={{ required: "Leave Policy is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputAntdSelectClassName} ${errors.leaveTypePolicy ? '' : 'border-gray-300'}`}
                        placeholder="Select Leave Policy"
                      >
                        <Option value="">Select Leave Policy</Option>
                        {[
                          { key: "carry_forward", value: "Carry Forward" },
                          { key: "zero_out", value: "Zero Out" },
                          { key: "paid_balance", value: "Paid Balance" },
                        ]?.map((type) => (
                          <Option key={type.key} value={type.key}>
                            {type.value}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.leaveTypePolicy && (
                    <p className="text-red-500 text-sm">
                      {errors.leaveTypePolicy.message}
                    </p>
                  )}
                </div>


              </div>
              {assignLeaveDetails.map((item, index) => (
                <div key={index} className=" rounded-md my-2 ">
                  <div key={item.id} className="">
                    <div className="flex justify-between items-center mb-4 bg-header rounded-t-md px-3">
                      <div className="py-2 text-white font-semibold">
                        Assign Leave{" "}
                      </div>
                      {(
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (item?._id) {
                                dispatch(
                                  deleteAssignedLeaveEmployee({
                                    _id: item?._id,
                                  })
                                ).then((data) => {
                                  if (!data?.error) {
                                    dispatch(getOnBoardingDetails({ _id: onBoardingId }))
                                    removeassignLeave(index)
                                  }
                                });
                              } else { removeassignLeave(index) }
                            }}
                            className="text-gray-300 hover:text-gray-200 flex items-center justify-center p-1 rounded-lg"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                      <div className="flex gap-3">
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Leave <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name={`assignLeaveDetails[${index}].leave`}
                            control={control}
                            rules={{ required: "Leave is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`${inputAntdSelectClassName} ${errors.assignLeaveDetails?.[index]?.leave ? '' : 'border-gray-300'}`}
                                placeholder="Select Leave"
                                value={field.value}
                                onChange={(value) => {
                                  const totalLeaves = leaveListData?.find((leave) => leave?._id === value)?.totalLeaves
                                  const availableLeave = (totalLeaves / financialDateDiffrence?.main) * financialDateDiffrence?.current
                                  setValue(`assignLeaveDetails[${index}].totalLeave`, Math.ceil(availableLeave))
                                  setValue(`assignLeaveDetails[${index}].maxValue`, Math.ceil(availableLeave))
                                  clearErrors(`assignLeaveDetails[${index}].totalLeave`);
                                  field.onChange(value);
                                }}
                              >
                                <Option value="">Select Leave</Option>
                                {leaveListData?.map((leaveOption) => (
                                  <Option key={leaveOption._id} value={leaveOption._id}>
                                    {leaveOption.name} ({leaveOption.totalLeaves})
                                  </Option>
                                ))}
                              </Select>
                            )}
                          />

                          {errors.assignLeaveDetails?.[index]?.leave && (
                            <p className="text-red-500 text-sm">
                              {errors.assignLeaveDetails[index].leave.message}
                            </p>
                          )}
                        </div>
                      </div>


                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Total Leave <span className="text-red-600">*</span>
                        </label>

                        <input
                          type="number"
                           step="any"
                          {...register(`assignLeaveDetails[${index}].totalLeave`, {
                            required: "Total Leave is required",
                            valueAsNumber: true,
                          })}
                          max={+watch(`assignLeaveDetails[${index}].maxValue`)}
                          className={`${inputClassName} ${errors.assignLeaveDetails?.[index]?.totalLeave
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          onInput={(e) => {
                            const value = +e.target.value;
                            const maxValue = +watch(`assignLeaveDetails[${index}].maxValue`);

                            if (value > maxValue) {
                              // Trigger error if value exceeds maxValue
                              setError(`assignLeaveDetails[${index}].totalLeave`, {
                                type: 'manual',
                                message: `Total Leave cannot be more than ${maxValue}`,
                              });
                            } else {
                              // Clear the error if value is valid
                              clearErrors(`assignLeaveDetails[${index}].totalLeave`);
                            }
                          }}
                        />

                        {errors.assignLeaveDetails?.[index]?.totalLeave && (
                          <p className="text-red-500 text-sm">
                            {errors.assignLeaveDetails[index].totalLeave.message}
                          </p>
                        )}
                      </div>


                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  appendassignLeave({
                    leave: "",
                    totalLeave: 0,
                  })
                }
                className={`${formButtonClassName} mx-3`}
              >
                Add leave
              </button>

              <div className="flex justify-between px-3 pb-2">
                <button type="Submit" className={`${formButtonClassName}`}>
                  Submit Details
                </button>
              </div>
            </div>
          )}
          {[9, 10, 11].includes(step) && (
            <EditSalaryDetailsModule incrementDetails={incrementDetails} appendIncrement={appendIncrement} removeIncrement={removeIncrement} EditSalaryDetailsModule={EditSalaryDetailsModule} setValue={setValue} handleDeleteDoctImage={handleDeleteDoctImage} handleDeleteBankImage={handleDeleteBankImage} formErrorsBank={formErrorsBank} currentPackage={currentPackage} step={step} errors={errors} register={register} watch={watch} control={control} setStep={setStep} navTabClick={navTabClick} isESIC={isESIC} IsPf={IsPf} formErrors={formErrors} handleAddMore={handleAddMore} documents={documents} setDocuments={setDocuments} banks={banks} setBanks={setBanks} handleInputChangeBank={handleInputChangeBank} handleBankFileChange={handleBankFileChange} loadingUpdateFile={loadingUpdateFile} handleInputChange={handleInputChange} employeeDocumentList={employeeDocumentList} handleFileChange={handleFileChange} handleDelete={handleDelete} onBoardingDetailsData={onBoardingDetailsData} />
          )}
        </form>
      </div>}
    </GlobalLayout>
  );
};
export default EditOnBoarding;