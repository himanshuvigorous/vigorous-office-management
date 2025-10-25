import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { inputClassName, inputLabelClassName, domainName, inputerrorClassNameAutoComplete, getLocationDataByPincode, inputAntdSelectClassName, sortByPropertyAlphabetically } from "../../../constents/global";
import { countrySearch, secCountrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { stateSearch, secStateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { citySearch, secCitySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import { indusSearch } from "../../global/other/Industry/IndustryFeature/_industry_reducers";
import { orgTypeSearch } from "../../organizationType/organizationTypeFeatures/_org_type_reducers";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { createClientFunc } from "./clientFeatures/_client_reducers";
import { encrypt } from "../../../config/Encryption";
import { useNavigate } from "react-router-dom";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { AutoComplete, Input, List, Select } from "antd";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import Loader from "../../../global_layouts/Loader";
import ImageUploader from "../../../global_layouts/ImageUploader/ImageUploader";
import ListLoader from "../../../global_layouts/ListLoader";


const CreateClient = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { loading: clientLoading } = useSelector((state) => state.client);
  const dispatch = useDispatch();
  const [clientGroupOwner, setClientGroupOwner] = useState(false);
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
  const [secondaryAddress, setSecoundarAddress] = useState();
  const { countryListData, secCountryList } = useSelector((state) => state.country);
  const { stateListData, secStateList } = useSelector((state) => state.states);
  const { cityListData, secCityList } = useSelector((state) => state.city);
  const { industryListData, indusSearchloading } = useSelector((state) => state.industry);
  const { orgTypeList, orgSearchloading } = useSelector((state) => state.orgType);
  const { clientGroupList, groupSearchLoading } = useSelector(state => state.clientGroup);
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch,
  );
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

  useEffect(() => {
    if (PrintPincode && PrintPincode.length >= 4 &&
      PrintPincode.length <= 6) {
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

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: '',
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      "organizationId": data?.PDOrganizationType,
      "industryId": data?.PDindustrytype,
      groupId: data?.groupName,
      fullName: data?.PDFullName,
      userType: "client",
      email: data?.PDEmail?.toLowerCase(),
      // password: data?.PDPassword,
      mobile: {
        code: data?.code,
        number: data?.number,
      },

      openingBalance: Number(data?.openingBalance),
      clientProfile: {
        penNumber: data?.penNumber,
        adharNumber: data?.adharNumber,
        GSTNumber: data?.GSTNumber,
        dateOfJoining: data?.PDDateOfJoin,
        secondaryEmail: "",
        isGroupOwner: clientGroupOwner,
        secondaryMobile: {
          code: data?.code,
          number: data?.number,
        },
        landline: {
          code: data?.Lcode,
          number: data?.Lnumber,
        },
      },
      generalInfo: {
        gender: "Male",
        dateOfBirth: data?.dateOfBirth,
        maritalStatus: "Single"
      },
      profileImage: data?.ProfileImage,
      addresses: {
        primary: {
          street: data?.PDAddress ?? "",
          city: data?.PDCity ?? "",
          state: data?.PDState ?? "",
          country: data?.PDCountry ?? "",
          pinCode: data?.PDPinCode ?? ""
        },
        secondary: {
          street: data?.PDSecAddress ?? "",
          city: data?.PDSecCity ?? "",
          state: data?.PDSecState ?? "",
          country: data?.PDSecCountry ?? "",
          pinCode: data?.PDSecPinCode ?? ""
        }
      }
    };

    dispatch(createClientFunc(finalPayload)).then((output) => {
      !output.error && navigate(`/admin/client/edit/${encrypt(output?.payload?.clientinfo?.data?._id)}`);
    });
  };

  const navTabClick = (clickedStep) => {
    if (clickedStep !== 1) {
      showNotification({
        message: "First submit Primary Details",
        type: 'error',
      });
    }
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

  const handleAddressCheckbox = (checked) => {
    setSameAsCurrentAddress(checked);
  };

  const handleGroupOwnerCheckbox = (checked) => {
    setClientGroupOwner(checked);

  };

  const handleCountryChange = (event) => {
    setValue("PDCountry", event.target.value);
    setValue("PDState", "");
    dispatch(
      stateSearch({
        isPagination: false,
        text: event.target.value,
        sort: true,
        status: true,
        countryId: event.target.value,
      })
    );
  };

  const handleFocusCountry = () => {
    if (!countryListData?.docs?.length) {
      setValue("PDState", "");
      dispatch(
        countrySearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
    }
  };

  const handleStateChange = (event) => {
    setValue("PDState", event.target.value);
    setValue("PDCity", "");
    dispatch(
      citySearch({
        isPagination: false,
        text: event.target.value,
        sort: true,
        status: true,
        countryId: "",
        stateId: event.target.value,
      })
    );
  };

  const handleFocusIndustry = () => {
    // if (!industryListData?.length) {
    dispatch(
      indusSearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
    );
    // }
  };

  const handleFocusOrgType = () => {
    if (!orgTypeList?.length) {
      dispatch(orgTypeSearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
      );
    }
  };
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const handleFocusClientGrp = () => {

    dispatch(
      clientGrpSearch({
        companyId: userInfoglobal?.userType == 'company' ? userInfoglobal?._id : userInfoglobal?.userType == 'employee' ? branchId : userInfoglobal?.userType == 'companyBranch' ? userInfoglobal?.companyId : '',
        branchId: userInfoglobal?.userType == 'company' ? branchId : userInfoglobal?.userType == 'companyBranch' ? userInfoglobal?._id : userInfoglobal?.branchId,
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        groupId: "",

      })
    );

  };

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



  return (
    <GlobalLayout>
      <div className="">
        <div>
          <div className="flex bg-header justify-start items-center rounded-t-lg gap-5 px-3 pt-2 mt-2 overflow-x-auto overflow-y-hidden text-nowrap">
            <button
              type="button"
              onClick={() => navTabClick(1)}
              className={`flex relative flex-col items-center  pb-2 ${step === 1 ? "text-white ]" : "text-gray-500"
                } cursor-pointer`}
            >
              {step === 1 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold text-nowrap">
                Profile Information
              </span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(2)}
              className={`flex flex-col items-center relative pb-2 ${step === 2 ? "text-white ]" : "text-gray-500"
                } cursor-pointer`}
            >
              {step === 2 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold"> Owner</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(3)}
              className={`flex flex-col items-center relative pb-2 ${step === 3 ? "text-white ]" : "text-gray-500"
                } cursor-pointer`}
            >
              {step === 3 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Branch Details</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(4)}
              className={`flex flex-col items-center relative pb-2 ${step === 4 ? "text-white ]" : "text-gray-500"
                } cursor-pointer`}
            >
              {step === 4 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Contact Person</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(5)}
              className={`flex flex-col items-center relative pb-2 ${step === 5 ? "text-white ]" : "text-gray-500"
                } cursor-pointer`}
            >
              {step === 5 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold"> Files</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(6)}
              className={`flex flex-col items-center relative pb-2 ${step === 6 ? "text-white ]" : "text-gray-600"
                } cursor-pointer`}
            >
              {step === 6 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold"> Registration</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(7)}
              className={`flex flex-col items-center relative pb-2 ${step === 7 ? "text-white ]" : "text-gray-600"
                } cursor-pointer`}
            >
              {step === 7 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold"> Financial Document</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(8)}
              className={`flex flex-col items-center relative pb-2 ${step === 8 ? "text-white ]" : "text-gray-600"
                } cursor-pointer`}
            >
              {step === 8 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold"> Bank Account</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(9)}
              className={`flex flex-col items-center relative pb-2 ${step === 9 ? "text-white ]" : "text-gray-600"
                } cursor-pointer`}
            >
              {step === 9 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold"> Digital Signature</span>
            </button>
            {/* <button
              type="button"
              onClick={() => navTabClick(10)}
              className={`flex flex-col items-center relative pb-2 ${step === 10 ? "text-white ]" : "text-gray-600"
                } cursor-pointer`}
            >
              {step === 10 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold"> Status</span>
            </button> */}
          </div>

          <form autoComplete="off" className="" onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="gap-4">
                <div className="flex w-full justify-start items-center p-2">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:my-2 px-3">
                  {userInfoglobal?.userType === "admin" && <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Company <span className="text-red-600">*</span>
                    </label>
                    {/* <select
                      {...register("PDCompanyId", {
                        required: "company is required",
                      })}
                      onFocus={() => {
                        dispatch(
                          companySearch({
                            userType: "company",
                            text: "",
                            status: true,
                          })
                        );
                      }}
                      className={` ${inputClassName} ${errors.PDCompanyId
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    >
                      <option className="" value="">
                        Select Comapany
                      </option>
                      {companyList?.map((type) => (
                        <option value={type?._id}>{type?.fullName}</option>
                      ))}
                    </select> */}
                    <Controller
                      control={control}
                      name="PDCompanyId"
                      rules={{ required: "Company is required" }}
                      render={({ field }) => (
                        <Select
                          onFocus={() => {
                            dispatch(
                              companySearch({
                                userType: "company",
                                text: "",
                                status: true,
                              })
                            );
                          }}
                          {...field}
                          defaultValue={""}
                          // onFocus={() => {
                          //   dispatch(
                          //     companySearch({
                          //       text: "",
                          //       sort: true,
                          //       status: true,
                          //       isPagination: false,
                          //     })
                          //   );
                          // }}
                          className={`${inputAntdSelectClassName} `}
                        >
                          <Select.Option value="">Select Company</Select.Option>
                          {companyListLoading ? <Select.Option disabled>
                            <Loader />
                          </Select.Option> : (companyList?.map((type) => (
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
                  {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div onClick={() => {
                    dispatch(
                      branchSearch({
                        text: "",
                        sort: true,
                        status: true,
                        isPagination: false,
                        companyId: userInfoglobal?.userType === "admin" ? watch("PDCompanyId") : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
                      })
                    );
                  }} className="">
                    <label className={`${inputLabelClassName}`}>
                      Branch <span className="text-red-600">*</span>
                    </label>
                    {/* <select
                      {...register("PDBranchId", {
                        required: "Branch is required",
                      })}
                      onFocus={() => {
                        dispatch(
                          branchSearch({
                            text: "",
                            sort: true,
                            status: true,
                            companyId: userInfoglobal?.userType === "admin" ? watch("PDCompanyId") : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
                          })
                        );
                      }}
                      className={` ${inputClassName} ${errors.PDBranchId
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    >
                      <option className="" value="">
                        Select Branch
                      </option>
                      {branchList?.map((type) => (
                        <option value={type?._id}>{type?.fullName}</option>
                      ))}
                    </select> */}

                    <Controller
                      control={control}
                      name="PDBranchId"
                      rules={{ required: "Branch is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={""}

                          // showSearch
                          // filterOption={(input, option) =>
                          //   option?.children?.toLowerCase().includes(input?.toLowerCase())
                          // }
                          onFocus={() => {
                            dispatch(
                              branchSearch({
                                text: "",
                                sort: true,
                                status: true,
                                companyId: userInfoglobal?.userType === "admin" ? watch("PDCompanyId") : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
                              })
                            );
                          }}
                          optionLabelProp="children"
                          className={`${inputAntdSelectClassName} `}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">Select Branch</Select.Option>
                          {branchListloading ? <Select.Option disabled>
                            <Loader />
                          </Select.Option>
                            : (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
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
                  <div onClick={handleFocusClientGrp} className="">
                    <label className={`${inputLabelClassName}`}>
                      Group Type
                    </label>

                    <Controller
                      control={control}
                      name="groupName"

                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={""}
                          className={`${inputAntdSelectClassName} `}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">Select Group Type</Select.Option>
                          {groupSearchLoading ? <Select.Option disabled>
                            <Loader />
                          </Select.Option> : (clientGroupList?.map((type) => (
                            <Select.Option key={type?._id} value={type?._id}>
                              {`${type?.fullName}(${type?.groupName})}`}
                            </Select.Option>
                          )))}
                        </Select>
                      )}
                    />
                    {errors.groupName && (
                      <p className="text-red-500 text-sm">
                        {errors.groupName.message}
                      </p>
                    )}
                  </div>
                  <div onClick={handleFocusOrgType} className="">
                    <label className={`${inputLabelClassName}`}>
                      Organization Type <span className="text-red-600">*</span>
                    </label>


                    <Controller
                      control={control}
                      name="PDOrganizationType"
                      rules={{ required: "Organization is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}

                          className={`${inputAntdSelectClassName} `}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">Select Organization Type</Select.Option>
                          {orgSearchloading ? <Select.Option disabled>
                            <Loader />
                          </Select.Option> : (orgTypeList?.map((type) => (
                            <Select.Option
                              value={type?._id}>
                              {`${type?.name}`}
                            </Select.Option>
                          )))}
                        </Select>
                      )}
                    />
                    {errors.PDOrganizationType && (
                      <p className="text-red-500 text-sm">
                        {errors.PDOrganizationType.message}
                      </p>
                    )}
                  </div>
                  <div onClick={handleFocusIndustry} className="">
                    <label className={`${inputLabelClassName}`}>
                      Industry Type <span className="text-red-600">*</span>
                    </label>

                    <Controller
                      control={control}
                      name="PDindustrytype"
                      rules={{ required: "Industry type is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={""}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                          className={`${inputAntdSelectClassName} `}
                        >
                          <Select.Option value=""> Select Industry Type</Select.Option>
                          {indusSearchloading ? (<Select.Option disabled>
                            <Loader />
                          </Select.Option>) : (industryListData?.map((type) => (
                            <Select.Option key={type?._id} value={type?._id}>
                              {`${type?.name}`}
                            </Select.Option>
                          )))}
                        </Select>
                      )}
                    />
                    {errors.PDindustrytype && (
                      <p className="text-red-500 text-sm">
                        {errors.PDindustrytype.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                  <div className="col-span-2">
                    <label className={`${inputLabelClassName}`}>Name <span className="text-red-600">*</span></label>
                    <input
                      type="text"
                      {...register("PDFullName", {
                        required: "Client Name is required",
                      })}
                      className={` ${inputClassName} ${errors.PDFullName ? "border-[1px] " : "border-gray-300"
                        } `}
                      placeholder="Enter Client Name"
                    />
                    {errors.PDFullName && (
                      <p className="text-red-500 text-sm">
                        {errors.PDFullName.message}
                      </p>
                    )}
                  </div>
                  {/* <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      {...register("PDPassword", {
                        required: "Password is required",
                      })}
                      className={` ${inputClassName} ${errors.PDPassword ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Password"
                    />
                    {errors.PDPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.PDPassword.message}
                      </p>
                    )}
                  </div> */}
                  {/* <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      {...register("PDConfirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === PrintPassword || "Passwords do not match",
                      })}
                      className={` ${inputClassName} ${errors.PDConfirmPassword
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Re-enter Password"
                    />
                    {errors.PDConfirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.PDConfirmPassword.message}
                      </p>
                    )}
                  </div> */}
                  {/* <div className="">
                    <label className={`${inputLabelClassName}`}>
                      User Type
                    </label>
                    <select
                      {...register("userType", {
                        required: "User Type is required",
                      })}
                      className={` ${inputClassName} ${errors.userType ? "border-[1px] " : "border-gray-300"
                        } `}
                    >
                      <option value="companyOwner">Company Owner</option>
                      <option value="companyDirector">Company Director</option>
                      <option value="branchManager">Branch Manager</option>
                      <option value="staff">Staff</option>
                      <option value="client">Client</option>
                    </select>
                    {errors.userType && (
                      <p className="text-red-500 text-sm">
                        {errors.userType.message}
                      </p>
                    )}
                  </div> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4 gap-3  ">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("PDEmail", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={` ${inputClassName} ${errors.PDEmail ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Email"
                      style={{ textTransform: "lowercase" }}
                    />
                    {errors.PDEmail && (
                      <p className="text-red-500 text-xs h-5 ">
                        {errors.PDEmail.message}
                      </p>
                    )}
                  </div>
                  {/* l  */}
                  <div className="flex gap-3">
                    <div className="w-[150px]">
                      <label className={`${inputLabelClassName}`}>
                        Code <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="code"
                        rules={{ required: "code is required" }}
                        render={({ field }) => (
                          <CustomMobileCodePicker
                            field={field}
                            errors={errors}
                          />
                        )}
                      />
                      {errors[`code`] && (
                        <p className="text-red-500 text-sm m-2">
                          {errors[`code`].message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Mobile No <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(`number`, {
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
                        className={` ${inputClassName} ${errors[`number`]
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
                      {errors[`number`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`number`].message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Date of birth / incorporation <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      rules={{
                        required: ' Date of birth / incorporation is required'
                      }}
                      render={({ field }) => (
                        <CustomDatePicker
                          field={field}
                          errors={errors}
                          disabledDate={(current) => {
                            return current && current.isAfter(moment().endOf('day'), 'day');
                          }}
                        />
                      )}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Date of Joining <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name="PDDateOfJoin"
                      control={control}
                      rules={{
                        required: 'Date of Joining is required'
                      }}
                      render={({ field }) => (
                        <CustomDatePicker
                          field={field}
                          errors={errors}
                          disabledDate={(current) => {
                            return current.isAfter(moment().endOf('day'), 'day');
                          }}
                        />
                      )}
                    />
                    {errors.PDDateOfJoin && (
                      <p className="text-red-500 text-sm">
                        {errors.PDDateOfJoin.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 md:gap-8 md:my-1 px-3  gap-3 ">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      PAN Number
                    </label>
                    <input
                      type="text"
                      {...register("penNumber", {


                        pattern: {
                          value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                          message: "Invalid PAN card format (ABCDE1234E)",
                        }
                      })}
                      className={` ${inputClassName} ${errors.penNumber ? "border-[1px] " : "border-gray-300"
                        } `}
                      placeholder="Enter PAN number"
                    />
                    {errors.penNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.penNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Aadhar Number
                    </label>
                    <input
                      type="number"
                      {...register("adharNumber", {

                        minLength: {
                          value: 12,
                          message: "Must be exactly 12 digits",
                        },
                        maxLength: {
                          value: 12,
                          message: "Must be exactly 12 digits",
                        },
                      })}
                      className={` ${inputClassName} ${errors.adharNumber
                        ? "border-[1px] "
                        : "border-gray-300"
                        } `}
                      placeholder="Enter Aadhar number"
                      maxLength={12}
                      onInput={(e) => {
                        if (e.target.value.length > 12) {
                          e.target.value = e.target.value.slice(0, 12);
                        }
                      }}
                    />
                    {errors.adharNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.adharNumber.message}
                      </p>
                    )}
                  </div>








                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      GST Number
                    </label>
                    <input
                      type="text"
                      {...register("GSTNumber", {


                        pattern: {
                          value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
                          message: "Invalid GST Number format (29AAACH7409R1ZX)",
                        },
                      })}
                      className={` ${inputClassName} ${errors.GSTNumber ? "border-[1px] " : "border-gray-300"
                        } `}
                      placeholder="Enter GST number"
                      maxLength={15}

                    />
                    {errors.GSTNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.GSTNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <div className="w-[150px]">
                      <label className={`${inputLabelClassName}`}>
                        STD
                      </label>
                      <Controller
                        control={control}
                        name="Lcode"

                        render={({ field }) => (
                          <CustomMobileCodePicker
                            field={field}
                            errors={errors}
                          />
                        )}
                      />

                      {/* <select
                            {...register("code", {
                              required: "MobileCode is required",
                            })}
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
                            className={` ${inputClassName} ${
                              errors.code
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
                      {errors[`Lcode`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`Lcode`].message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Landline
                      </label>
                      <input
                        type="number"
                        {...register(`Lnumber`, {

                          minLength: {
                            value: 10,
                            message: "Must be exactly 10 digits",
                          },
                          maxLength: {
                            value: 10,
                            message: "Must be exactly 10 digits",
                          },
                        })}
                        className={` ${inputClassName} ${errors[`Lnumber`]
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter LandLine No"
                        maxLength={10}
                        onInput={(e) => {
                          if (e.target.value.length > 10) {
                            e.target.value = e.target.value.slice(0, 10);
                          }
                        }}
                      />
                      {errors[`Lnumber`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`Lnumber`].message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Opening Balance
                    </label>
                    <input
                      type="number"
                      step="any"
                      {...register("openingBalance", {



                      })}
                      className={` ${inputClassName} ${errors.openingBalance
                        ? "border-[1px] "
                        : "border-gray-300"
                        } `}
                      placeholder="Enter Opening Balance "

                    />
                    {errors.openingBalance && (
                      <p className="text-red-500 text-sm">
                        {errors.openingBalance.message}
                      </p>
                    )}
                  </div>
                </div>



                <div className="mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 gap-4">
                    <div className="col-span-2">
                      <label className={`${inputLabelClassName}`}>
                        Primary Address<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("PDAddress", {
                          required: "Primary Address is required",
                        })}
                        className={`${inputClassName} ${errors.PDAddress ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Enter Primary Address"
                      />
                      {errors.PDAddress && (
                        <p className="text-red-500 text-sm">
                          {errors.PDAddress.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-4 md:my-1 px-3 mt-2">
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
                                    "stateName": PrintState

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
                        <label className={`${inputLabelClassName} flex justify-between items-center`}>
                          <span>Secondary Address</span>
                          <div className="flex items-center mt-2">
                            <input
                              type="checkbox"
                              id="sameAsCurrentAddress"
                              onChange={(e) => handleAddressCheckbox(e.target.checked)}
                              className="mr-2"
                            />
                            <label htmlFor="sameAsCurrentAddress" className={`${inputLabelClassName}`}>
                              same as Current Address
                            </label>
                          </div>
                        </label>
                        <input
                          type="text"
                          {...register("PDSecAddress")}
                          className={`${inputClassName} ${errors.PDSecAddress ? "border-[1px] " : "border-gray-300"
                            }`}
                          placeholder="Enter Secondary Address"
                        />
                        {errors.PDSecAddress && (
                          <p className="text-red-500 text-sm">{errors.PDSecAddress.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 md:my-1 px-3 gap-4 mt-2">
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
                                onFocus={handleSecFocusCountry}
                                onChange={handleSecCountryChange}
                                className={`${inputClassName} ${errors.PDSecCountry ? "border-[1px] " : "border-gray-300"
                                  }`}
                              />
                            </AutoComplete>
                          )}
                        />
                        {errors.PDSecCountry && (
                          <p className="text-red-500 text-sm">{errors.PDSecCountry.message}</p>
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
                          <p className="text-red-500 text-sm">{errors.PDSecState.message}</p>
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
                                      "stateName": watch(`PDSecState`)

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
                          <p className="text-red-500 text-sm">{errors.PDSecCity.message}</p>
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
                              className={`${inputClassName} ${errors.PDSecPinCode ? "border-[1px] " : "border-gray-300"
                                }`}
                            />
                          )}
                        />
                        {errors.PDSecPinCode && (
                          <p className="text-red-500 text-sm">{errors.PDSecPinCode.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-2 p-3">
                  <input
                    type="checkbox"
                    id="clientGroupOwner"
                    onChange={(e) => handleGroupOwnerCheckbox(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="clientGroupOwner" className={`${inputLabelClassName}`}>
                    isGroupOwner
                  </label>
                </div>

                <div className="flex justify-end col-span-2 mt-4">
                  <button
                    type="submit"
                    disabled={clientLoading}
                    className={`${clientLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
                  >
                    {clientLoading ? <Loader /> : 'Submit'}
                  </button>

                </div>



              </div>
            )}
          </form>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default CreateClient;
