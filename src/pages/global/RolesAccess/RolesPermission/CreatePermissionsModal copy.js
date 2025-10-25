import React, { useEffect, useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dynamicSidebarSearch } from "../../../DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { directorSearch } from "../../../Director/director/DirectorFeatures/_director_reducers";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import {
  inputClassName,
  inputLabelClassName,
  domainName,
} from "../../../../constents/global";
import { createRolePermission } from "./rolePermissiomnFeatures/_rolePermission_reducers";
import getUserIds from "../../../../constents/getUserIds";
import { Checkbox } from "antd";



function CreatePermissionsModal({ closeModal, getRolesPermissionList }) {
  const {
    register,
    handleSubmit,
    setValue,
    getValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkAll, setCheckAll] = useState(false);

  const { companyList } = useSelector((state) => state.company);
  const { directorLists } = useSelector((state) => state.director);
  const { branchList } = useSelector((state) => state.branch);
  const { designationList } = useSelector((state) => state.designation);
  const { departmentListData } = useSelector((state) => state.department);
  const [permissionsState, setPermissionsState] = useState([]);
  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);

  const {
    userCompanyId,

    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType
  } = getUserIds();
  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });

  const branchId = useWatch({
    control,
    name: "branchId",
    defaultValue: userBranchId,
  });
  const departmentId = useWatch({
    control,
    name: "departmentId",
    defaultValue: userDepartmentId,
  });
  const designationId = useWatch({
    control,
    name: "designationId",
    defaultValue: userDesignationId,
  });
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );


  useEffect(() => {
    if (userType === "admin") {
      dispatch(
        companySearch({
          userType: "company",
          text: "",
          status: true,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (branchId) {
      dispatch(
        deptSearch({
          text: "",
          sort: true,
          status: true,
          isPagination:false,
          companyId: companyId,
          branchId: branchId,
        })
      );
    }
  }, [branchId]);

  useEffect(() => {
    if ((companyId && userType === "company" || companyId && userType === "admin")) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination:false,
          companyId: companyId
        })
      );
    }
  }, [companyId])

  // useEffect(() => {
  //   if (companyId && userType === "company" || userType === "admin") {
  //     dispatch(directorSearch({
  //       text: "", sort: true, status: true, isPagination: false, companyId: companyId,
  //     })
  //     );
  //   }
  // }, [companyId]);

  useEffect(() => {
    if (departmentId) {
      dispatch(
        designationSearch({
          departmentId: departmentId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId,
        })
      );
    }
  }, [departmentId]);

  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
        })
      );
    }
    dispatch(dynamicSidebarSearch({
      isPagination: false
    }))
  }, []);
  useEffect(() => {

    const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
      ...sidebarItem,
      canCreate: false,
      canRead: false,
      canUpdate: false,
      canDelete: false,
    }));
    setPermissionsState(updatedPermissions);

  }, [sidebarListData]);
  const handleCheckAll = (e)=>{
    setCheckAll(e.target.checked)

   
  }
  useEffect(()=>{
if(checkAll){
  const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
    ...sidebarItem,
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
  }));
  setPermissionsState(updatedPermissions);
}else{
  const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
    ...sidebarItem,
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
  }));
  setPermissionsState(updatedPermissions);
}
  },[checkAll])

  const onSubmit = (data) => {
    const permission = permissionsState
      ?.map((permissionData) => {
        if (
          permissionData?.canCreate ||
          permissionData?.canRead ||
          permissionData?.canUpdate ||
          permissionData?.canDelete
        ) {
          return {
            pageId: permissionData?._id,
            canCreate: permissionData?.canCreate,
            canRead: permissionData?.canRead,
            canUpdate: permissionData?.canUpdate,
            canDelete: permissionData?.canDelete,
          };
        }
        return null;
      })
      .filter(Boolean);

    const finalPayload = {
      companyId:
        userInfoglobal?.userType === "admin"
          ? data?.companyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      directorId:
        userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin"
          ? data?.directorId
          : userInfoglobal?.userType === "companyDirector"
            ? userInfoglobal?._id
            : userInfoglobal?.directorId,
      branchId: userInfoglobal?.userType === "company" ||
        userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? data?.branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      departmentId: data?.departmentId,
      designationId: data?.designationId,
      permissions: permission,
      designationName: designationList.find(
        (ele) => ele._id === designationId
      )?.name,
    };
    dispatch(createRolePermission(finalPayload)).then((response) => {
      if (!response.error) {
        getRolesPermissionList();
        closeModal();
      }
    });
  };

  const handleSelectCompany = useCallback(
    (event) => {
      const companyId = event.target.value;
      setValue("companyId", companyId);
      const companyName = companyList?.docs?.find(
        (company) => company._id === companyId
      )?.name;
      setValue("companyName", companyName);
      setValue("stateId", "");
      setValue("stateName", "");
      // Dispatch state search if needed
      // dispatch(stateSearch({ companyId }));
    },
    [companyList, setValue]
  );

  const handlePermissionToggle = (e, pageId, permissionType) => {
    e.preventDefault();
    setPermissionsState((prevState) =>
      prevState.map((item) =>
        item._id === pageId
          ? { ...item, [permissionType]: !item[permissionType] }
          : item
      )
    );
  };

  const getButtonClassName = (isActive) => {
    return `px-3 sm:px-4 py-2 rounded-md text-[9px] sm:text-sm text-nowrap font-medium transition-all duration-300 ${isActive
      ? "bg-header text-white border-header"
      : "bg-gray-200 text-gray-700 border-gray-300 hover:border-header border-2 hover:text-header"
      }`;
  };
  const closeModalWithAnimation = () => {
    closeModal();
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[2000] bg-black bg-opacity-50 flex justify-center items-center transition-all `}
      onClick={closeModalWithAnimation}
    >
      <div
        className={`bg-white   rounded-lg w-full max-w-3xl  transition-all transform mx-2 pb-2`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center rounded-lg bg-header px-2 py-3 ">
          <div className="text-lg  text-white">Create Roles</div>
          <button
            onClick={closeModalWithAnimation}
            className="text-white text-3xl hover:text-white"
          >
            &times;
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto">
          <form
            className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2 px-2"
            onSubmit={handleSubmit(onSubmit)}
          >

            {(userType === "admin") && (
              <div className="" >
                <label className={`${inputLabelClassName}`}>
                  Company < span className="text-red-600" >* </span>
                </label>
                < select
                  {...register("companyId", {
                    required: "Company is required",
                  })
                  }
                  className={` ${inputClassName} ${errors.companyId ? "border-[1px] " : "border-gray-300"
                    }`}
                >
                  <option className="" value="" >
                    Select Company
                  </option>
                  {
                    companyList?.map((type) => (
                      <option value={type?._id} >
                        {type?.fullName}({type?.userName})
                      </option>
                    ))
                  }
                </select>
                {
                  errors.companyId && (
                    <p className="text-red-500 text-sm" >
                      {errors.companyId.message}
                    </p>
                  )
                }
              </div>
            )}
            {
              (userType === "admin" || userType === "company") && (
                <div className="" >
                  <label className={`${inputLabelClassName}`}>
                    Branch < span className="text-red-600" >* </span>
                  </label>
                  < select
                    {...register("branchId", {
                      required: "Branch is required",
                    })
                    }
                    className={` ${inputClassName} ${errors.branchId ? "border-[1px] " : "border-gray-300"
                      }`
                    }
                  >
                    <option className="" value="" >
                      Select Branch
                    </option>

                    {
                      branchList
                        ?.filter((element) => element?.companyId === companyId)
                        ?.map((element) => (
                          <option value={element?._id} > {element?.fullName} </option>
                        ))
                    }

                    {/* {branchList?.map((element) => (
                      <option value={element?._id}>{element?.fullName}</option>
                    ))} */}
                  </select>
                  {
                    errors.branchId && (
                      <p className="text-red-500 text-sm" >
                        {errors.branchId.message}
                      </p>
                    )
                  }
                </div>)}

            <div className="" >
              <label className={`${inputLabelClassName}`}>
                Department < span className="text-red-600" >* </span>
              </label>
              < select
                {...register("departmentId", {
                  required: "Department is required",
                })
                }
                className={` ${inputClassName} ${errors.departmentId ? "border-[1px] " : "border-gray-300"
                  }`}
              >
                <option className="" value="" >
                  Select Department
                </option>



                {
                  departmentListData?.map((element) => (
                    <option value={element?._id} > {element?.name} </option>
                  ))
                }
              </select>
              {
                errors.departmentId && (
                  <p className="text-red-500 text-sm" >
                    {errors.departmentId.message}
                  </p>
                )
              }
            </div>

            < div className="" >
              <label className={`${inputLabelClassName}`}> Designation < span className="text-red-600" >* </span></label >
              <select
                {
                ...register("designationId", {
                  required: "Designation is required",
                })
                }
                className={` ${inputClassName} ${errors.designationId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="" >
                  Select Designation
                </option>
                {
                  designationList?.map((type) => (
                    <option value={type?._id} > {type?.name} </option>
                  ))
                }


              </select>
              {
                errors.designationId && (
                  <p className="text-red-500 text-sm" >
                    {errors.designationId.message}
                  </p>
                )
              }
            </div>
            

          </form>
          <div  className="mt-2  md:my-2 px-2">
          <Checkbox checked={checkAll} onChange={handleCheckAll} >
        Check all
      </Checkbox>
          </div>

          

          <div className="pt-2 text-gray-700">
            {permissionsState?.map((permission) => (
              <div
                key={permission._id}
                className="flex lg:justify-between lg:items-center lg:flex-row flex-col justify-center items-start gap-2 border-b p-2"
              >
                <div>
                  <span className="capitalize font-medium text-sm">
                    {permission?.name}
                  </span>
                </div>

                <div className="flex justify-between gap-1 w-full lg:w-auto">
                  {["canRead", "canCreate", "canUpdate", "canDelete"].map(
                    (permissionType) => (
                      <div key={permissionType}>
                        <button
                          className={getButtonClassName(
                            permission[permissionType]
                          )}
                          onClick={(e) =>
                            handlePermissionToggle(
                              e,
                              permission._id,
                              permissionType
                            )
                          }
                        >
                          {permission[permissionType]
                            ? `✔ ${permissionType.replace("can", "")}`
                            : permissionType.replace("can", "")}
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end my-2 mx-2">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded "
            >
              save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePermissionsModal;
