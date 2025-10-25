import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  domainName,
  formButtonClassName,
  getLocationDataByPincode,
  inputAntdSelectClassName,
  inputClassName,
  inputDisabledClassName,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
  inputerrorClassNameAutoComplete,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import getUserIds from "../../../constents/getUserIds";
import { useNavigate } from "react-router-dom";
import {
  countrySearch,
  secCountrySearch,
} from "../../global/address/country/CountryFeatures/_country_reducers";
import {
  secStateSearch,
  stateSearch,
} from "../../global/address/state/featureStates/_state_reducers";
import {
  citySearch,
  secCitySearch,
} from "../../global/address/city/CityFeatures/_city_reducers";
import {
  applicationSearch,
  getApplicationDetails,
} from "../../applicationManagement/applicationFeatures/_application_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../../designation/designationFeatures/_designation_reducers";
import { onBoardingCreate } from "./onBoardingFeatures/_onBoarding_reducers";
import { encrypt } from "../../../config/Encryption";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import ReactSelect from "react-select";
import { leaveTypeSearch } from "../../global/other/leavetypeManagment/LeaveTypeFeatures/_leave_type_reducers";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers";
import { AutoComplete, Input, Radio, Select, Upload } from "antd";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import ImageUploader from "../../../global_layouts/ImageUploader/ImageUploader";
import UserDetails from "../../dashboard/UserDetails";
import dayjs from "dayjs";
import moment from "moment";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { RolesPermissionSearch } from "../../global/RolesAccess/RolesPermission/rolePermissiomnFeatures/_rolePermission_reducers";
import { timeSlotSearch } from "../../timeSlot/timeSlotsFeatures/_timeSlots_reducers";


const CreateOnBoarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState("");
  const [secondaryAddress, setSecoundarAddress] = useState();
  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType,
  } = getUserIds();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [financialDateDiffrence, setFinancialDateDiffrence] = useState({
    main: 0,
    current: 0
  });
  const { timeSlotsListData } = useSelector(state => state.timeSlots)
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { countryListData, secCountryList } = useSelector((state) => state.country);
  const { stateListData, secStateList } = useSelector((state) => state.states);
  const { cityListData, secCityList } = useSelector((state) => state.city);
  const { applicationList, loading: applicationLoading } = useSelector((state) => state.application);
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
  const { designationList, loading: desLoading } = useSelector((state) => state.designation);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const { directorLists } = useSelector((state) => state.director);
  const { leaveListData } = useSelector((state) => state.leaveType);
  const [fileList, setFileList] = useState([

  ]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      family: [
        {
          relation: "",
          name: "",
          age: "",
          contactNumber: "",
        },
      ],
      employmentDetails: [
        {
          organizationName: "",
          designationName: "",
          from: "",
          to: "",
          annualCTC: "",
        },
      ],
      educationDetails: [
        {
          degree: "",
          university: "",
          from: "",
          to: "",
          isPercentage: false,
          number: "",
          specification: "",
        },
      ],
      emergencyContact: [
        {
          name: "",
          relationship: "",
          email: "",
          mobile: {
            code: "",
            number: "",
          },
        },
      ],
      assignLeaveDetails: [{

      }]
    },
  });
  const currentPackage = useWatch({ name: "currentPackage", control })
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
  const basicSalaryPercentage = useWatch({
    control,
    name: "basicSalaryPercentage",
    defaultValue: "",
  });
  const currentSalary = useWatch({
    control,
    name: "currentSalary",
    defaultValue: "",
  });
  const dateOfJoining = useWatch({
    control,
    name: "dateOfJoining",
    defaultValue: "",
  });
  useEffect(() => {
    if (basicSalaryPercentage, currentSalary) {
      const basicSalaryCalc = Number(currentSalary) * Number(basicSalaryPercentage) / 100
      setValue('calculatedBasicSalary', Number(basicSalaryCalc).toFixed(2))
    }
  }, [basicSalaryPercentage, currentSalary])
  useEffect(() => {
    if (currentPackage) {
      // Calculate current salary and per day salary
      const calculatedSalary = currentPackage / 12; // assuming 12 months in a year
      const perDaySalary = calculatedSalary / 30; // assuming 30 days in a month
      setValue("currentSalary", calculatedSalary.toFixed(2));
      setValue("perDaySalary", perDaySalary.toFixed(2));
    }
  }, [currentPackage]);
  const { employeList } = useSelector((state) => state.employe);
  const dispatch = useDispatch();
  const PrintState = useWatch({
    control,
    name: "PDState",
    defaultValue: "",
  });
  const PrintCountry = useWatch({
    control,
    name: "PDCountry",
    defaultValue: "",
  });
  const PrintPincode = useWatch({
    control,
    name: "PDPinCode",
    defaultValue: "",
  });
  const profileType = useWatch({
    control,
    name: "profileType",
    defaultValue: "",
  });
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });
  const directorId = useWatch({
    control,
    name: "PDDirectorId",
    defaultValue: userDirectorId,
  });
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });
  const departmentId = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: '',
  });
  const designationId = useWatch({
    control,
    name: "PDDesignationId",
    defaultValue: '',
  });
  const employeId = useWatch({
    control,
    name: "PDEmployeId",
    defaultValue: "",
  });
  const applicationId = useWatch({
    control,
    name: "applicationId",
    defaultValue: "",
  });
  const isProbationPeriodActive = useWatch({
    control,
    name: "isProbationPeriod",
    defaultValue: "",
  });
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
  const {
    fields: assignLeaveDetails,
    append: appendassignLeave,
    remove: removeassignLeave,
  } = useFieldArray({
    control,
    name: "assignLeaveDetails",
  });
  const { loading: onBoardingLaoding } = useSelector(
    (state) => state.onBoarding
  );
  const { rolesPermissionList } = useSelector((state) => state.rolePermission);
  const { applicationDetails } = useSelector((state) => state.application);
  const [imageName, setImageName] = useState('');
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    if (fileList.length > 0) {
      setImageName(fileList[fileList.length - 1]?.url || fileList[fileList.length - 1]?.thumbUrl);
    }
  }, [fileList]);

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  useEffect(() => {
    if (companyId, branchId) {
      dispatch(
        leaveTypeSearch({
          directorId: null,
          companyId: companyId,
          branchId: branchId,
          employeId: "",
          text: "",
          sort: true,
          status: "",
          isPagination: false,
          isPaid: true,
        })
      );
    }
    dispatch(RolesPermissionSearch({
      directorId: null,
      companyId: companyId,
      branchId: branchId,
      text: "",
      sort: true,
      status: "",
      isPagination: false,
    }))
    dispatch(timeSlotSearch({
      directorId: null,
      companyId: companyId,
      branchId: branchId,
      text: "",
      sort: true,
      status: "",
      isPagination: false,
    }))

  }, [companyId, branchId]);

  useEffect(() => {

    setValue("PDFullName", '');
    setValue("PDEmail", '');
    setValue("PDMobileCode", '');
    setValue("PDMobileNo", '');
    fetchApplicationListData();
  }, [branchId]);

  const fetchApplicationListData = () => {
    let reqData = {
      text: "",
      status: "Selected",
      offerLatterStatus: "Accepted",
      sort: true,
      isPagination: false,
      employeId: "",
      companyId: companyId,
      branchId: branchId,
      departmentId: "",
      designationId: "",
      jobId: "",
    };
    dispatch(applicationSearch(reqData));
  };

  useEffect(() => {
    setUserData(applicationDetails);
  }, [applicationDetails]);

  useEffect(() => {
    if (applicationId) {
      dispatch(getApplicationDetails({ _id: applicationId }));
    }
  }, [applicationId]);



  useEffect(() => {
    if (userData) {
      setValue("profileType", "Application-onBoarding");
      setValue("PDFullName", userData?.fullName);
      setValue("PDEmail", userData?.email);
      setValue("PdApplicationDepartment", userData?.departmentName);
      setValue("PdDesignationApplication", userData?.designationName);
      setValue("PDMobileCode", userData?.mobile?.code);
      setValue("PDMobileNo", userData?.mobile?.number);
      setValue("PDAddress", userData?.address?.street);
      setValue("PDPinCode", userData?.address?.pinCode);
      setValue("PDCountry", userData?.address?.country);
      setValue("PDState", userData?.address?.state);
      setValue("PDCity", userData?.address?.city);
      setValue("gender", userData?.gender);
      setValue("maritalStatus", userData?.maritalStatus);
      setValue("openingBalance", Number(userData?.openingBalance));
      setValue("dateOfBirth", userData?.dateOfBirth ? dayjs(userData?.dateOfBirth) : null);
    }



  }, [userData]);

  const onSubmit = (data) => {

    if (step === 1) {

      const leavePayload = data?.assignLeaveDetails?.map((item) => ({
        "_id": item?._id,
        "leaveTypeId": item?.leave,
        "totalLeaves": Number(item?.totalLeave)
      }));

      const finalPayload = {

        companyId: companyId,
        directorId: "",
        branchId: branchId,
        // employeId: employeId,
        pageRoleId: data?.sidebarRole,
        applicationId:
          profileType === "Application-onBoarding" ? data?.applicationId : null,
        officeEmail: data?.PDOfficeEmail ? data?.PDOfficeEmail : null,
        "reporting_to": data?.reportingEmployee,
        departmentId: profileType === "Application-onBoarding" ? userData?.departmentId : data?.PDDepartmentId,
        designationId: profileType === "Application-onBoarding" ? userData?.designationId : data?.PDDesignationId,
        firstName: "",
        lastName: "",
        fullName: data?.PDFullName,
        landlineNumber: data?.landlineNo,
        seatNumber: +data?.seatNo,
        shift: data?.shift,
        workType: data?.workType,
        profileImage: data?.ProfileImage,
        email: data?.PDEmail,
        openingBalance: Number(data?.openingBalance),
        mobile: {
          code: data?.PDMobileCode,
          number: data?.PDMobileNo,
        },
        status: true,
        isDeleted: false,
        addresses: {
          primary: {
            street: data?.PDAddress,
            city: data?.PDCity,
            state: data?.PDState,
            country: data?.PDCountry,
            pinCode: data?.PDPinCode,
          },
          secondary: {
            street: data?.PDSecAddress,
            city: data?.PDSecCity,
            state: data?.PDSecState,
            country: data?.PDSecCountry,
            pinCode: data?.PDSecPinCode,
          },
        },
        generalInfo: {
          dateOfJoining: dayjs(data?.dateOfJoining).format("YYYY-MM-DD"),
          isProbationPeriod: data?.isProbationPeriod == "Yes" ? true : false,
          isProbationPeriodLeave: data?.isProbationPeriodLeave == "Yes" ? true : false,
          probationPeriod: data?.isProbationPeriod ? data?.probationPeriod : "",
          gender: data?.gender,
          bloodGroup: data?.BloodGroup,
          dateOfBirth: data?.dateOfBirth ? dayjs(data?.dateOfBirth).format("YYYY-MM-DD") : '',
          maritalStatus: data?.maritalStatus,
          designationName: data?.designation,
        },
        salaryDetails: {
          companyId: companyId,
          directorId: "",
          branchId: branchId,
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
        },
        leaveDetails: {
          companyId: companyId,
          directorId: "",
          branchId: branchId,
          "financStartDate": dayjs(data?.financStartDate)?.format("YYYY-MM"),
          "financEndDate": dayjs(data?.financEndDate)?.format("YYYY-MM"),
          "leavePolicy": data?.leaveTypePolicy,
          "leaveData": leavePayload
        }
      };

      dispatch(onBoardingCreate(finalPayload)).then((output) => {
        if (!output.error) {
          navigate(
            `/admin/onBoarding/edit/${encrypt(
              output?.payload?.companyinfo?.data?._id
            )}`
          );
        }
      });
    } else {
      setStep((step) => step + 1);
    }
  };

  useEffect(() => {
    if (
      PrintPincode &&
      PrintPincode.length >= 4 &&
      PrintPincode.length <= 6 &&
      /^\d{6}$/.test(PrintPincode)
    ) {
      getLocationDataByPincode(PrintPincode)
        .then((data) => {
          if (data) {
            setValue("PDCity", data?.city);
            setValue("PDState", data?.state);
            setValue("PDCountry", data?.country);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [PrintPincode]);

  const handleAddressCheckbox = (checked) => {
    setSameAsCurrentAddress(checked);
  };

  const navTabClick = (clickedStep) => {
    if (clickedStep < step) {
      setStep(clickedStep);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const handleFocusCompany = () => {
    if (!companyList?.length) {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  };
  const handleDesignationChange = (event) => {
    setValue("PDDesignationId", event);
    dispatch();
  };

  const handleCompanyChange = (event) => {
    setValue("PDCompanyId", event);
    setValue("PDBranchId", "");
    setValue("PDDirectorId", "");
    dispatch(
      directorSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: event,
      })
    );
    dispatch(
      branchSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: event,
      })
    );
  };

  const handleFocusDirector = () => {
    if (!directorLists) {
      dispatch(
        directorSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId,
        })
      );
    }
  };

  const handleBranchChange = (event) => {
    setValue("PDBranchId", event);
    setValue("PDDepartmentId", "");
    dispatch(
      deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: companyId,
        branchId: event,
      })
    );
  };

  const handleFocusBranch = () => {
    if (!branchList && userType === "company") {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId,
        })
      );
    }
  };

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
        companyId: companyId,
      })
    );
  };

  const handleFocusDepartment = () => {
    dispatch(
      deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: companyId,
        branchId: branchId,
      })
    );
  };

  useEffect(() => {
    if (sameAsCurrentAddress) {
      const currentAddress = {
        address: getValues("PDAddress"),
        country: getValues("PDCountry"),
        state: getValues("PDState"),
        city: getValues("PDCity"),
        pinCode: getValues("PDPinCode"),
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

  const handleSecCountryChange = (event) => {
    setValue("PDSecCountry", event.target.value);
    setValue("PDSecState", "");
    dispatch(
      secStateSearch({
        isPagination: false,
        text: event.target.value,
        sort: true,
        status: true,
        countryId: event.target.value,
      })
    );
  };

  const handleSecFocusCountry = () => {
    if (!secCountryList?.docs?.length) {
      setValue("PDSecState", "");
      dispatch(
        secCountrySearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
    }
  };
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
      departmentId: departmentId,
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

  const handleSecStateChange = (event) => {
    setValue("PDSecState", event.target.value);
    setValue("PDSecCity", "");
    dispatch(
      secCitySearch({
        isPagination: false,
        text: event.target.value,
        sort: true,
        status: true,
        countryId: "",
        stateId: event.target.value,
      })
    );
  };
  // useEffect(() => {

  //   if (financStartDate && financEndDate) {
  //     const dateObj1 = dayjs(financStartDate, "MM/YYYY")?.startOf('month')
  //     const dateObj2 = dayjs(financEndDate, "MM/YYYY")?.endOf('month')
  //     const today = dayjs();
  //     const baseDate = dateOfJoining
  //       ? (dayjs(dateOfJoining).date() <= 15
  //         ? dayjs(dateOfJoining).startOf('month')
  //         : dayjs(dateOfJoining).startOf('month').add(1, 'month'))
  //       : (today.date() <= 15
  //         ? today.startOf('month')
  //         : today.startOf('month').add(1, 'month'));

  //     const diffInMonths = dateObj2.diff(dateObj1, 'month') + 1;
  //     const diffInCurrent = dateObj2.diff(baseDate, 'month') + 1;
  //     setFinancialDateDiffrence({
  //       main: diffInMonths,
  //       current: diffInCurrent
  //     })
  //   } else {
  //     setFinancialDateDiffrence({
  //       main: 0,
  //       current: 0
  //     })
  //   }
  // }, [financStartDate, financEndDate, dateOfJoining])
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
    setValue('assignLeaveDetails', [{}])
  }, [dateOfJoining, financEndDate, financStartDate])
  const { Option } = Select;


  return (
    <GlobalLayout>
      <div className="grid grid-cols-12 gap-2">
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
            <button
              type="button"
              onClick={() => navTabClick(2)}
              className={`flex flex-col items-center relative pb-2 ${step === 2 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 2 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">General Details</span>
            </button>
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
              <span className="text-sm font-semibold">Employment Details</span>
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
            <>
              <div>
                <Controller
                  name="profileType"
                  control={control}
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      optionType="button"
                      buttonStyle="solid"
                      block
                      defaultValue={"Application-onBoarding"}
                      className={`  ${errors.clientSelection
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    >
                      <Radio value="Application-onBoarding">
                        <span className="md:text-[14px] text-[12px]"> Application onBoarding</span>
                      </Radio>
                      <Radio value="Direct-onBoarding"><span className="md:text-[14px] text-[12px]"> Direct OnBoarding </span></Radio>
                    </Radio.Group>
                  )}
                />
                <div className="flex w-full justify-center items-center p-2">
                  <Controller
                    name="ProfileImage"
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                        setValue={setValue}
                        name="image"
                        field={field}
                      />
                    )}
                  />

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                  {userType === "admin" && (
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Company <span className="text-red-600">*</span>
                      </label>


                      <Controller
                        name="PDCompanyId"
                        control={control}
                        rules={{ required: "Company is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.PDCompanyId ? '' : 'border-gray-300'}`}
                            onChange={(value) => {
                              field.onChange(value);
                              handleCompanyChange(value); // Custom handler if needed
                            }}
                            onFocus={handleFocusCompany}
                            placeholder="Select Company"
                          >
                            <Option value="">Select Company</Option>
                            {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (companyList?.map((company) => (
                              <Option key={company._id} value={company._id}>
                                {company?.userName} ({company?.fullName})
                              </Option>
                            )))}
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
                  {(userType === "admin" || userType === "company" || userType === "companyDirector") && (
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Branch <span className="text-red-600">*</span>
                      </label>

                      <Controller
                        name="PDBranchId"
                        control={control}
                        rules={{ required: "Branch is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.PDBranchId ? '' : 'border-gray-300'}`}
                            onChange={(value) => {
                              setValue("employee", '')
                              setValue("reportingEmployee", '')
                              field.onChange(value);
                              handleBranchChange(value); // Custom handler if needed
                            }}
                            onFocus={handleFocusBranch}
                            placeholder="Select Branch"
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                          >
                            <Option value="">Select Branch</Option>
                            {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> : sortByPropertyAlphabetically(branchList, 'fullName')?.map((branch) => (
                              <Option key={branch._id} value={branch._id}>
                                {branch.userName} ({branch.fullName})
                              </Option>
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
                  {profileType !== "Application-onBoarding" &&
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Department <span className="text-red-600">*</span>
                      </label>

                      <Controller
                        name="PDDepartmentId"
                        control={control}
                        rules={{ required: "Department is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.PDDepartmentId ? '' : 'border-gray-300'}`}
                            onChange={(value) => {
                              field.onChange(value);
                              handleDepartmentChange(value); // Custom handler if needed
                            }}
                            onFocus={handleFocusDepartment}
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                            placeholder="Select Department"
                          >
                            <Option value="">Select Department</Option>
                            {depLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (departmentListData?.map((element) => (
                              <Option key={element?._id} value={element?._id}>
                                {element?.name}
                              </Option>
                            )))}
                          </Select>
                        )}
                      />

                      {errors.PDDepartmentId && (
                        <p className="text-red-500 text-sm">
                          {errors.PDDepartmentId.message}
                        </p>
                      )}
                    </div>
                  }
                  {profileType !== "Application-onBoarding" &&
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Designation <span className="text-red-600">*</span>
                      </label>

                      <Controller
                        name="PDDesignationId"
                        control={control}
                        rules={{ required: "Designation is required" }}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.PDDesignationId ? '' : 'border-gray-300'}`}
                            showSearch
                            filterOption={
                              (input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                            placeholder="Select Designation"
                          >
                            <Option value="">Select Designation</Option>
                            {desLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (designationList?.map((type) => (
                              <Option key={type?._id} value={type?._id}>
                                {type?.name}
                              </Option>
                            )))}
                          </Select>
                        )}
                      />

                      {errors.PDDesignationId && (
                        <p className="text-red-500 text-sm">
                          {errors.PDDesignationId.message}
                        </p>
                      )}
                    </div>}

                  {profileType === "Application-onBoarding" && (
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Select Application <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        name="applicationId"
                        control={control}
                        rules={{ required: "Application is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.applicationId ? '' : 'border-gray-300'}`}
                            placeholder="Select Application"
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                          >
                            <Option value="">Select Application</Option>
                            {applicationLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(applicationList, 'fullName')?.map((type) => (
                              <Option key={type?._id} value={type?._id}>
                                {type?.fullName}
                              </Option>
                            )))}
                          </Select>
                        )}
                      />

                      {errors.applicationId && (
                        <p className="text-red-500 text-sm">
                          {errors.applicationId.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="">
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
                  <div className="">
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
                  {profileType === "Application-onBoarding" && (<>
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Department <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={true}
                        {...register("PdApplicationDepartment", {
                          required: "Department is required",
                        })}
                        className={`placeholder: ${inputDisabledClassName} ${errors.PdApplicationDepartment ? "border-[1px] " : "border-gray-300"
                          }`}
                        placeholder="Enter Department"
                      />
                      {errors.PdApplicationDepartment && (
                        <p className="text-red-500 text-sm">
                          {errors.PdApplicationDepartment.message}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Designation <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={true}
                        {...register("PdDesignationApplication", {
                          required: "Designation is required",
                        })}
                        className={`placeholder: ${inputDisabledClassName} ${errors.PdDesignationApplication ? "border-[1px] " : "border-gray-300"
                          }`}
                        placeholder="Enter Designation"
                      />
                      {errors.PdDesignationApplication && (
                        <p className="text-red-500 text-sm">
                          {errors.PdDesignationApplication.message}
                        </p>
                      )}
                    </div>
                  </>)}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Office Email
                    </label>
                    <input
                      type="text"
                      {...register("PDOfficeEmail", {
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={` ${inputClassName} ${errors.PDOfficeEmail
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Office Email"
                    />
                    {errors.PDOfficeEmail && (
                      <p className="text-red-500 text-sm">
                        {errors.PDOfficeEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Reporting Person
                    </label>
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
                        //       companyId:
                        //         userInfoglobal?.userType === "admin"
                        //           ? companyId
                        //           : userInfoglobal?.userType === "company"
                        //             ? userInfoglobal?._id
                        //             : userInfoglobal?.companyId,
                        //       branchId:
                        //         userInfoglobal?.userType === "company" ||
                        //           userInfoglobal?.userType === "admin" ||
                        //           userInfoglobal?.userType === "companyDirector"
                        //           ? branchId
                        //           : userInfoglobal?.userType === "companyBranch"
                        //             ? userInfoglobal?._id
                        //             : userInfoglobal?.branchId,
                        //     };

                        //     dispatch(employeSearch(reqPayload));
                        //   }}
                        //   options={sortByPropertyAlphabetically(employeList, 'fullName')?.map((employee) => ({
                        //     value: employee?._id,
                        //     label: employee?.fullName,
                        //   }))}
                        //   isClearable={true}
                        //   classNamePrefix="react-select"
                        //   className={`${inputLabelClassNameReactSelect} ${errors.employee ? "border-[1px] " : "border-gray-300"
                        //     }`}
                        //   placeholder="Select Employee"
                        // />

                        <Select

                          style={{ width: '100%' }}
                          className={`${inputAntdSelectClassName}`}
                          value={field?.value}
                          onChange={(value) => {

                            field.onChange(value)
                          }
                          }
                          allowClear
                          onFocus={reportingOption}
                          options={employeeList}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                          placeholder="Select Reporting Person"
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
                        name="PDMobileCode"
                        rules={{ required: "code is required" }}
                        render={({ field }) => (
                          <CustomMobileCodePicker
                            field={field}
                            errors={errors}
                          />
                        )}
                      />

                      {/* <select
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
                      {...register("PDMobileCode", {
                        required: "MobileCode is required",
                      })}
                      className={` ${inputClassName} ${errors.PDMobileCode
                          ? "border-[1px] "
                          : "border-gray-300"
                        }`}
                    >
                      <option className="" value="">
                        Select Mobile Code
                      </option>
                      {countryListData?.docs?.map((type) => (
                        <option value={type?.countryMobileNumberCode}>
                          {type?.countryMobileNumberCode}
                        </option>
                      ))}
                    </select> */}
                      {errors[`PDMobileCode`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`PDMobileCode`].message}
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
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
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
                      {...register(`openingBalance`, {


                      })}
                      className={` ${inputClassName} ${errors[`openingBalance`]
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Opening Balance"

                    />
                    {errors[`openingBalance`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`openingBalance`].message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
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
                        <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                          return profileType === "Application-onBoarding" && current && current.isBefore(moment().endOf('day'), 'day');
                        }} />
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
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
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
                </div>
                <div className="mt-3">
                  {/* Add the checkbox to copy address */}

                  <div className="mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                      <div className="col-span-2">
                        <label className={`${inputLabelClassName}`}>
                          Primary Address<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("PDAddress", {
                            required: "Primary Address is required",
                          })}
                          className={`${inputClassName} ${errors.PDAddress
                            ? "border-[1px] "
                            : "border-gray-300"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-3 md:my-1 px-3">
                      <div>
                        <div className={`${inputLabelClassName}`}>
                          Country <span className="text-red-600">*</span>
                        </div>
                        <Controller
                          control={control}
                          name="PDCountry"
                          rules={{ required: "Country is required" }}
                          render={({ field }) => (
                            <AutoComplete
                              className="w-full"
                              {...field}
                              onChange={(value) => {
                                // Directly handle country change by using setValue from React Hook Form
                                field.onChange(value); // Update the value in the form control
                              }}
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
                                className={`${inputClassName} ${errors.PDCountry
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                              />
                            </AutoComplete>
                          )}
                        />
                        {errors.PDCountry && (
                          <p className={`${inputerrorClassNameAutoComplete}`}>
                            {errors.PDCountry.message}
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

                              className="w-full"
                              {...field}
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
                                      countryName: PrintCountry,
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
                              className="w-full"
                              {...field}
                              onChange={(value) => field.onChange(value)} // Directly handle city change using React Hook Form's field.onChange
                              options={sortByPropertyAlphabetically(cityListData?.docs)?.map((type) => ({
                                value: type?.name,
                              }))}
                            >
                              <input
                                onFocus={() => {
                                  dispatch(
                                    citySearch({
                                      isPagination: false,
                                      text: "",
                                      sort: true,
                                      status: true,
                                      stateName: PrintState,
                                    })
                                  );
                                }}
                                placeholder="Enter City"
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
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Pin Code <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          control={control}
                          name="PDPinCode"
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
                              className={`${inputClassName} ${errors.PDPinCode
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            />
                          )}
                        />
                        {errors.PDPinCode && (
                          <p className="text-red-500 text-sm">
                            {errors.PDPinCode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
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

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 md:my-1 px-3">
                        {/* Secondary Address Fields (mirroring Primary Address) */}
                        <div>
                          <div className={`${inputLabelClassName}`}>Country</div>
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
                                  onFocus={handleSecFocusCountry}
                                  onChange={handleSecCountryChange}
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
                          <div className={`${inputLabelClassName}`}>State</div>
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
                          <div className={`${inputLabelClassName}`}>City</div>
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
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">

                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Current Package (yearly) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("currentPackage", {
                        required: "Current Package is required",
                      })}
                      className={`${inputClassName} ${errors.currentPackage ? "border-[1px] " : ""
                        }`}
                      placeholder="Enter Current Package"
                    />
                    {errors.currentPackage && (
                      <p className="text-red-600 text-sm">
                        {errors.currentPackage?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Last Increment Date  <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name={'salarystartDate'}
                      control={control}
                      rules={{ required: "Last Increment Date is required" }}
                      render={({ field }) => (
                        <CustomDatePicker format="DD/MM/YYYY" picker="date" field={field} errors={errors} />
                      )}
                    />

                    {errors.salarystartDate && (
                      <p className="text-red-500 text-sm">
                        {errors.salarystartDate?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Next Increment Date  <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name={'salaryEndDate'}
                      control={control}
                      rules={{ required: "salaryEndDate is required" }}
                      render={({ field }) => (
                        <CustomDatePicker format="DD/MM/YYYY" picker="date" field={field} errors={errors} />
                      )}
                    />

                    {errors.salaryEndDate && (
                      <p className="text-red-500 text-sm">
                        {errors.salaryEndDate?.message}
                      </p>
                    )}
                  </div>

                  {/* Current Salary */}
                  {currentPackage > 0 &&
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        Current Salary (monthly)
                      </label>
                      <input
                        type="number"
                        {...register("currentSalary", {

                        })}
                        className={`${inputDisabledClassName} ${errors.currentSalary ? "border-[1px] " : ""
                          }`}
                        placeholder="Current Salary"
                        disabled
                      />
                      {errors.currentSalary && (
                        <p className="text-red-600 text-sm">
                          {errors.currentSalary?.message}
                        </p>
                      )}
                    </div>
                  }

                  {currentPackage > 0 &&
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        Per Day Salary
                      </label>
                      <input
                        type="number"
                        {...register("perDaySalary", {

                        })}
                        className={`${inputDisabledClassName} ${errors.perDaySalary ? "border-[1px] " : ""
                          }`}
                        placeholder="Per Day Salary"
                        disabled
                      />
                      {errors.perDaySalary && (
                        <p className="text-red-600 text-sm">
                          {errors.perDaySalary?.message}
                        </p>
                      )}
                    </div>}
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      basic salary percentage (%)
                    </label>
                    <input
                      type="number"
                      max={100}
                      {...register("basicSalaryPercentage", {
                        required: "Percentage is required",
                        max: {
                          value: 100,
                          message: "Percentage cannot be more than 100",
                        },
                        min: {
                          value: 0,
                          message: "Percentage cannot be less than 0",
                        }
                      })}
                      className={`${inputClassName} ${errors.basicSalaryPercentage ? "border-[1px] border-red-600" : ""
                        }`}
                      placeholder="basic salary percentage"
                    />
                    {errors.basicSalaryPercentage && (
                      <p className="text-red-600 text-sm">
                        {errors.basicSalaryPercentage?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Claculated Basic Salary
                    </label>
                    <input
                      type="number"
                      disabled
                      {...register("calculatedBasicSalary", {

                      })}
                      className={`${inputDisabledClassName} ${errors.calculatedBasicSalary ? "border-[1px] " : ""
                        }`}
                      placeholder="Claculated Basic Salary"

                    />
                    {errors.calculatedBasicSalary && (
                      <p className="text-red-600 text-sm">
                        {errors.calculatedBasicSalary?.message}
                      </p>
                    )}
                  </div>
                  <div></div>
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Is ESIC <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name="isESIC"
                      control={control}
                      rules={{ required: "isESIC is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`mt-0 ${inputAntdSelectClassName} ${errors.isESIC ? '' : 'border-gray-300'}`}
                          placeholder="Select Is Esic"
                        >
                          <Option value={''}>Select isESIC</Option>
                          <Option value={'true'}>YES</Option>
                          <Option value={'false'}>NO</Option>
                        </Select>
                      )}
                    />
                    {errors.isESIC && (
                      <p className="text-red-600 text-sm">{errors.isESIC?.message}</p>
                    )}
                  </div>
                  {(isESIC === 'true' || isESIC === true) && <div>
                    <label className={`${inputLabelClassName}`}>
                      ESIC Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text" // Change to text to allow regex-based validation
                      {...register("esicNumber", {
                        required: "ESIC Number is required",  // Field is required
                        // pattern: {
                        //   //value: /^\d{17}$/, // Regex for exactly 17 digits
                        //   message: "ESIC Number must be a 17-digit number", // Error message if pattern doesn't match
                        // },
                        // minLength: {
                        //   value: 17,  // Ensures that it has at least 17 characters
                        //   message: "ESIC Number must be exactly 17 digits long",  // Error message for min length
                        // },
                        // maxLength: {
                        //   value: 17,  // Ensures that it doesn't exceed 17 characters
                        //   message: "ESIC Number must be exactly 17 digits long",  // Error message for max length
                        // },
                      })}
                      className={`${inputClassName} ${errors.esicNumber ? "border-[1px] " : ""
                        }`}
                      // maxLength={17}
                      // onInput={(e) => {
                      //   if (e.target.value.length > 17) {
                      //     e.target.value = e.target.value.slice(0, 17);
                      //   }
                      // }}
                      placeholder="Enter ESIC Number"
                    />
                    {errors.esicNumber && (
                      <p className="text-red-600 text-sm">
                        {errors.esicNumber?.message}
                      </p>
                    )}
                  </div>}
                  {(isESIC === 'true' || isESIC === true) && (
                    <>
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          ESIC Calculated From <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name="esicType"
                          control={control}
                          rules={{ required: "ESIC Calculated From is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={`mt-0 ${inputAntdSelectClassName} ${errors.esicType ? '' : 'border-gray-300'}`}
                              placeholder="Select ESIC Calculated From"
                            >
                              <Option value="">Select ESIC Calculated From</Option>
                              <Option value="basicSalary">Basic Salary</Option>
                              <Option value="totalSalary">Total Salary</Option>
                            </Select>
                          )}
                        />

                        {errors.esicType && (
                          <p className="text-red-600 text-sm">
                            {errors.esicType?.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Esic Percentage
                        </label>
                        <input
                          type="number"
                          step={0.01}
                          {...register("esicInPercentage", {

                          })}
                          className={`${inputClassName} ${errors.esicInPercentage ? "border-[1px] " : ""
                            }`}
                          placeholder="Esic Percentage"

                        />
                        {errors.esicInPercentage && (
                          <p className="text-red-600 text-sm">
                            {errors.esicInPercentage?.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Maximum Esic Amount
                        </label>
                        <input
                          type="number"
                          step={0.01}
                          {...register("esicMaxUpTo", {

                          })}
                          className={`${inputClassName} ${errors.esicMaxUpTo ? "border-[1px] " : ""
                            }`}
                          placeholder="Maximum Esic Amount"

                        />
                        {errors.esicMaxUpTo && (
                          <p className="text-red-600 text-sm">
                            {errors.esicMaxUpTo?.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          ESIC Applied On <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name="esicAppliedOn"
                          control={control}
                          rules={{ required: "ESIC Applied On is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={`mt-0 ${inputAntdSelectClassName} ${errors.esicAppliedOn ? '' : 'border-gray-300'}`}
                              placeholder="Select ESIC Applied On"
                            >
                              <Option value="">Select ESIC Applied On</Option>
                              <Option value="employee">employee</Option>
                              <Option value="employer">employer</Option>
                              <Option value="both">both</Option>
                            </Select>
                          )}
                        />

                        {errors.esicAppliedOn && (
                          <p className="text-red-600 text-sm">
                            {errors.esicAppliedOn?.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}


                  {/* Is PF */}
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Is PF <span className="text-red-600">*</span>
                    </label>

                    <Controller
                      name="isPF"
                      control={control}
                      rules={{ required: "Is PF is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`mt-0 ${inputAntdSelectClassName} ${errors.isPF ? '' : 'border-gray-300'}`}
                          placeholder="Select Is PF"
                        >
                          <Option value={''}>Select isPF</Option>
                          <Option value={'true'}>YES</Option>
                          <Option value={'false'}>NO</Option>
                        </Select>
                      )}
                    />
                    {errors.isPF && (
                      <p className="text-red-600 text-sm">{errors.isPF?.message}</p>
                    )}
                  </div>

                  {/* UAN Number */}
                  {(IsPf === "true" || IsPf === true) &&
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        UAN Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text" // Change to text to prevent issues with leading zeros in the number
                        {...register("uanNumber", {
                          required: "UAN Number is required", // Ensures UAN is provided
                          pattern: {
                            value: /^\d{12}$/, // Regex for exactly 12 digits
                            message: "UAN Number must be a 12-digit number", // Error message for invalid UAN number
                          },
                        })}
                        className={`${inputClassName} ${errors.uanNumber ? "border-[1px] " : ""
                          }`}
                        placeholder="Enter UAN Number"
                        maxLength={12}
                        onInput={(e) => {
                          if (e.target.value.length > 12) {
                            e.target.value = e.target.value.slice(0, 12);
                          }
                        }}
                      />
                      {errors.uanNumber && (
                        <p className="text-red-600 text-sm">
                          {errors.uanNumber?.message} {/* Display error message */}
                        </p>
                      )}
                    </div>}

                  {/* PF Type */}
                  {(IsPf === "true" || IsPf === true) && (
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        PF Type <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        name="pfType"
                        control={control}
                        rules={{ required: "PF Type is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`mt-0 ${inputAntdSelectClassName} ${errors.isPF ? '' : 'border-gray-300'}`}
                            placeholder="Select Is PF"
                          >
                            <Option value="">Select PF Calculated From</Option>
                            <Option value="basicSalary">Basic Salary</Option>
                            <Option value="totalSalary">Total Salary</Option>
                          </Select>
                        )}
                      />

                      {errors.pfType && (
                        <p className="text-red-600 text-sm">
                          {errors.pfType?.message}
                        </p>
                      )}
                    </div>
                  )}
                  {(IsPf === "true" || IsPf === true) &&
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        PF Applied On <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        name="pfAppliedOn"
                        control={control}
                        rules={{ required: "ESIC Applied On is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`mt-0 ${inputAntdSelectClassName} ${errors.pfAppliedOn ? '' : 'border-gray-300'}`}
                            placeholder="Select PF Applied On"
                          >
                            <Option value="">Select PF Applied On</Option>
                            <Option value="employee">employee</Option>
                            <Option value="employer">employer</Option>
                            <Option value="both">both</Option>
                          </Select>
                        )}
                      />

                      {errors.pfAppliedOn && (
                        <p className="text-red-600 text-sm">
                          {errors.pfAppliedOn?.message}
                        </p>
                      )}
                    </div>}
                  {(IsPf === "true" || IsPf === true) && <div>
                    <label className={`${inputLabelClassName}`}>
                      PF Percentage
                    </label>
                    <input
                      type="number"
                      step={0.01}
                      {...register("pfInPercentage", {
                      })}
                      className={`${inputClassName} ${errors.pfInPercentage ? "border-[1px] " : ""
                        }`}
                      placeholder="PF Percentage"

                    />
                    {errors.pfInPercentage && (
                      <p className="text-red-600 text-sm">
                        {errors.pfInPercentage?.message}
                      </p>
                    )}
                  </div>}
                  {(IsPf === "true" || IsPf === true) &&
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        Maximum PF Amount
                      </label>
                      <input
                        type="number"
                        step={0.01}
                        {...register("pfMaxUpTo", {

                        })}
                        className={`${inputClassName} ${errors.pfMaxUpTo ? "border-[1px] " : ""
                          }`}
                        placeholder="Maximum PF Amount"

                      />
                      {errors.pfMaxUpTo && (
                        <p className="text-red-600 text-sm">
                          {errors.pfMaxUpTo?.message}
                        </p>
                      )}
                    </div>}

                </div>

              </div>
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
                                removeassignLeave(item, index)
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
                  <button type="submit" className={`${formButtonClassName}`}>
                    Submit
                  </button>
                </div>
              </div>
            </>

          )}

        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateOnBoarding;
