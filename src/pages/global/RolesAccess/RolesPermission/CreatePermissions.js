import React, { useEffect, useState, useCallback } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
    transformDataRole,
    inputAntdSelectClassName,
    sortByPropertyAlphabetically,
} from "../../../../constents/global";
import { createRolePermission } from "./rolePermissiomnFeatures/_rolePermission_reducers";
import getUserIds from "../../../../constents/getUserIds";
import { Button, Checkbox, Select, Table } from "antd";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import ListLoader from "../../../../global_layouts/ListLoader";



function CreatePermissions() {
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

    const { companyList, companyListLoading } = useSelector((state) => state.company);
    const { directorLists } = useSelector((state) => state.director);
    const { branchList, branchListloading } = useSelector((state) => state.branch);
    const { designationList, loading: desListLoading } = useSelector((state) => state.designation);
    const { loading } = useSelector((state) => state.rolePermission);
    const [permissionsState, setPermissionsState] = useState([]);
    const [permissionsStateView, setPermissionsStateView] = useState([]);
    const { sidebarListData } = useSelector((state) => state.dynamicSidebar);
    const { sidebarViewData } = useSelector((state) => state.dynamicSidebar);
  
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

    // useEffect(() => {
    //     if (branchId) {
    //         dispatch(
    //             deptSearch({
    //                 text: "",
    //                 sort: true,
    //                 status: true,
    //                 isPagination: false,
    //                 companyId: companyId,
    //                 branchId: branchId,
    //             })
    //         );
    //     }
    // }, [branchId]);

    useEffect(() => {
        if ((companyId && userType === "company" || companyId && userType === "admin" || companyId && userType === "companyDirector")) {
            dispatch(
                branchSearch({
                    text: "",
                    sort: true,
                    status: true,
                    isPagination: false,
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

    // useEffect(() => {
    //     if (departmentId) {
    //         dispatch(
    //             designationSearch({
    //                 departmentId: departmentId,
    //                 text: "",
    //                 sort: true,
    //                 status: true,
    //                 isPagination: false,
    //                 companyId: companyId,
    //             })
    //         );
    //     }
    // }, [departmentId]);

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

        // const newData = sidebarListData?.filter((item) => !item?.parentPageId)
        // const newdata2 = newData?.map((item) => ({
        //     ...item,
        //     children: sidebarListData?.filter((sidebarItem) => sidebarItem?.parentPageId === item?._id)
        // }))
        // const newdata3 = newdata2?.map((item) => ({
        //     ...item,
        //     children: item?.children?.map((child) => ({
        //         ...child,
        //         children: sidebarListData?.filter((sidebarItem) => sidebarItem?.parentPageId === child?._id)
        //     }))
        // }))


        const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
            ...sidebarItem,
            canCreate: false,
            canRead: false,
            canUpdate: false,
            canDelete: false,
        }));

        setPermissionsState(updatedPermissions);

    }, [sidebarListData]);
    const handleCheckAll = (e) => {
        setCheckAll(e.target.checked)


    }
    useEffect(() => {
        if (checkAll) {
            const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
                ...sidebarItem,
                canCreate: true,
                canRead: true,
                canUpdate: true,
                canDelete: true,
            }));
            setPermissionsState(updatedPermissions);
        } else {
            const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
                ...sidebarItem,
                canCreate: false,
                canRead: false,
                canUpdate: false,
                canDelete: false,
            }));
            setPermissionsState(updatedPermissions);
        }
    }, [checkAll])

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
            permissions: permission,
            designationId: "",
            departmentId: "",
            designationName: data?.roleTitle,
        };
        dispatch(createRolePermission(finalPayload)).then((response) => {
            if (!response.error) {
                navigate(-1)
                // getRolesPermissionList();
                // closeModal();
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

    const handlePermissionToggle = (pageId, permissionType) => {
        const parent = permissionsState?.find((item) => item._id === pageId)?.parentPageId
        if (parent) {
            setPermissionsState((prevState) =>
                prevState.map((item) =>
                    item._id === parent
                        ? {
                            ...item, canCreate: true,
                            canRead: true,
                            canUpdate: true,
                            canDelete: true,
                        }
                        : item
                )
            );
        }
        const firstparent = permissionsState?.find((item) => item._id === parent)?.parentPageId
        if (firstparent) {
            setPermissionsState((prevState) =>
                prevState.map((item) =>
                    item._id === firstparent
                        ? {
                            ...item, canCreate: true,
                            canRead: true,
                            canUpdate: true,
                            canDelete: true,
                        }
                        : item
                )
            );
        }
        setPermissionsState((prevState) =>
            prevState.map((item) =>
                item._id === pageId
                    ? { ...item, [permissionType]: !item[permissionType] }
                    : item
            )
        );

    };
    const handlePermissionToggleRow = (e, pageId) => {
        const parent = permissionsState?.find((item) => item._id === pageId)?.parentPageId
        if (parent) {
            setPermissionsState((prevState) =>
                prevState.map((item) =>
                    item._id === parent
                        ? {
                            ...item, canCreate: true,
                            canRead: true,
                            canUpdate: true,
                            canDelete: true,
                        }
                        : item
                )
            );
        }
        const firstparent = permissionsState?.find((item) => item._id === parent)?.parentPageId
        if (firstparent) {
            setPermissionsState((prevState) =>
                prevState.map((item) =>
                    item._id === firstparent
                        ? {
                            ...item, canCreate: true,
                            canRead: true,
                            canUpdate: true,
                            canDelete: true,
                        }
                        : item
                )
            );
        }
        if (e.target.checked) {
            setPermissionsState((prevState) =>
                prevState.map((item) =>
                    item._id === pageId
                        ? {
                            ...item, canCreate: true,
                            canRead: true,
                            canUpdate: true,
                            canDelete: true,
                        }
                        : item
                )
            );
        } else {
            setPermissionsState((prevState) =>
                prevState.map((item) =>
                    item._id === pageId
                        ? {
                            ...item, canCreate: false,
                            canRead: false,
                            canUpdate: false,
                            canDelete: false,
                        }
                        : item
                )
            );
        }

    };



    useEffect(() => {
        if (checkAll) {
            const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
                ...sidebarItem,
                canCreate: true,
                canRead: true,
                canUpdate: true,
                canDelete: true,
            }));
            setPermissionsState(updatedPermissions);
        } else {
            const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
                ...sidebarItem,
                canCreate: false,
                canRead: false,
                canUpdate: false,
                canDelete: false,
            }));
            setPermissionsState(updatedPermissions);
        }
    }, [checkAll])


    const getButtonClassName = (id, button) => {
        const isActive = (button && permissionsState?.find((item) => item._id === id)) ? permissionsState?.find((item) => item._id === id)[button] : false
        return `px-3 sm:px-4 py-2 rounded-md text-[9px] sm:text-sm text-nowrap font-medium transition-all duration-300 ${isActive
            ? "bg-header text-white border-header"
            : "bg-gray-200 text-gray-700 border-gray-300 hover:border-header border-2 hover:text-header"
            }`;
    };

    useEffect(() => {
        if (sidebarViewData && sidebarListData) {

            if (sidebarListData.length > 0 && sidebarViewData.length > 0) {
                setPermissionsStateView(transformDataRole(sidebarViewData));
            } else {
                setPermissionsStateView([]);
            }
        } else {
            setPermissionsStateView([]);
        }
    }, [sidebarViewData, sidebarListData]);



    const getPermission = (id, button) => {
        return permissionsState?.find((item) => item._id === id)?.[button]
    }
    const columns = [

        {
            title: 'title',
            dataIndex: 'title',
            width: 300,
            key: '_id',
            render: (text, permission) => (
                <div className="text-nowrap">{text}</div>
            )
        },
        {
            title: <div><Checkbox onClick={(e) => handleCheckAll(e)} /></div>,
            key: '_id',
            width: 100,
            render: (text, permission) => (
                <div>
                    <Checkbox onClick={(e) => handlePermissionToggleRow(e, permission._id)} checked={getPermission(permission._id, "canRead") && getPermission(permission._id, "canCreate") && getPermission(permission._id, "canUpdate") && getPermission(permission._id, "canDelete")} />
                </div>
            )
        },
        {
            title: <div>{'Actions'}</div>,
            key: '_id',
            render: (text, permission) => (


                <div className="flex items-center flex-nowrap gap-2">
                    {["canRead", "canCreate", "canUpdate", "canDelete"].map((button) => (
                        <Button
                            className={getButtonClassName(
                                permission._id, button
                            )}
                            key={button}
                            type="button"
                            onClick={(e) =>
                                handlePermissionToggle(permission._id, button)
                            }
                            style={{ margin: '0 5px' }}
                        >
                            {button}
                        </Button>
                    ))}
                </div>

            ),
        },
    ];

    return (
        <GlobalLayout>

            <div className="">
                <form
                    className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2 md:my-2 px-2"
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

                            <Controller
                                control={control}
                                name="companyId"
                                rules={{ required: "Company is required" }}
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
                                        <Select.Option value="">Select Company</Select.Option>
                                        {companyListLoading ? <Select.Option disabled>
                                            <ListLoader />
                                        </Select.Option> : (sortByPropertyAlphabetically(companyList, 'fullName')?.map((type) => (
                                            <Select.Option key={type?._id} value={type?._id}>
                                                {type?.fullName}
                                            </Select.Option>
                                        )))}
                                    </Select>
                                )}
                            />
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
                        (userType === "admin" || userType === "company" || userType == 'companyDirector') && (
                            <div className="" >
                                <label className={`${inputLabelClassName}`}>
                                    Branch < span className="text-red-600" >* </span>
                                </label>
                                {/* <select 
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

                                    {branchList?.map((element) => (
                      <option value={element?._id}>{element?.fullName}</option>
                    ))}
                                </select> */}

                                <Controller
                                    name="branchId"
                                    control={control}
                                    rules={{ required: "Branch is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            className={`${inputAntdSelectClassName} ${errors.branchId ? "border-[1px] " : "border-gray-300"}`}
                                            placeholder="Select Branch"
                                            showSearch
                                            filterOption={(input, option) =>
                                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            <Select.Option value="">Select Branch</Select.Option>
                                            {branchListloading ? <Select.Option disabled>
                                                <ListLoader />
                                            </Select.Option> : (
                                                sortByPropertyAlphabetically(branchList, 'fullName')
                                                    ?.filter((element) => element?.companyId === companyId)
                                                    ?.map((element) => (
                                                        <Select.Option value={element?._id} > {element?.fullName} </Select.Option>
                                                    )))}
                                        </Select>
                                    )}
                                />
                                {
                                    errors.branchId && (
                                        <p className="text-red-500 text-sm" >
                                            {errors.branchId.message}
                                        </p>
                                    )
                                }
                            </div>)}

                    {/* <div className="" >
                        <label className={`${inputLabelClassName}`}>
                            Department < span className="text-red-600" >* </span>
                        </label>

                        <Controller
                    name="departmentId"
                    control={control}
                    rules={{ required: "departmentId is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputAntdSelectClassName} ${errors.departmentId ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Select department"
                      >
                        <Select.Option value="">Select department</Select.Option>
                        {depListLoading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option>  : (  
                                sortByPropertyAlphabetically(departmentListData)?.map((element) => (
                                    <Select.Option value={element?._id} > {element?.name} </Select.Option>
                                ))
                            )}
                      </Select>
                    )}
                  />
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

  <Controller
                    name="designationId"
                    control={control}
                    rules={{ required: "designationId is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputAntdSelectClassName} ${errors.designationId ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Select designation"
                      >
                        <Select.Option value="">Select designation</Select.Option>
                        {desListLoading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option>  : (  
                                sortByPropertyAlphabetically(designationList)?.map((element) => (
                                    <Select.Option value={element?._id} > {element?.name} </Select.Option>
                                ))
                            )}
                      </Select>
                    )}
                  />
                        {
                            errors.designationId && (
                                <p className="text-red-500 text-sm" >
                                    {errors.designationId.message}
                                </p>
                            )
                        }
                    </div> */}
                    <div className="">
                        <label className={`${inputLabelClassName}`}>
                            Role Title <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("roleTitle", {
                                required: "Role Title is required",
                            })}
                            className={`placeholder: ${inputClassName} ${errors.roleTitle
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            placeholder="Enter Role Title"
                        />
                        {errors.roleTitle && (
                            <p className="text-red-500 text-sm">
                                {errors.roleTitle.message}
                            </p>
                        )}
                    </div>

                </form>


                {<Table
                    columns={columns}
                    pagination={false}
                    dataSource={permissionsStateView}
                    scroll={{
                        // y: 90 * 5,
                        x: true
                    }}
                    rowKey="_id"
                />}


                {/* <div className="pt-2 text-gray-700">
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
                </div> */}
             
                <div className="flex justify-end my-2 mx-2">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleSubmit(onSubmit)}
                        className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded "
                    >
                     {loading? <ListLoader/> :   'save'}
                    </button>
                </div>
            </div>
        </GlobalLayout>
    );
}

export default CreatePermissions;
