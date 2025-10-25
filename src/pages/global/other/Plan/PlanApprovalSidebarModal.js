import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { transformDataRole, } from "../../../../constents/global";
import { Checkbox, Table } from "antd";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { decrypt } from "../../../../config/Encryption";
import { dynamicSidebarSearch } from "../../../DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { planSidbarpermission, planSidbarpermissionDetails } from "./PlanFeatures/_plan_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";

function PlanApprovalSidebarModal() {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [checkAll, setCheckAll] = useState(false);
    const { planManagerIdEnc } = useParams();
    const planManagerId = decrypt(planManagerIdEnc);
    const [permissionsState, setPermissionsState] = useState([]);
    const [permissionsStateView, setPermissionsStateView] = useState([]);
    const { sidebarListData } = useSelector((state) => state.dynamicSidebar);
    const { sidebarViewData } = useSelector((state) => state.dynamicSidebar);
      const { planSidbarpermissionDetailsData ,loading } = useSelector((state) => state.plan);
    
      
    useEffect(() => {
        dispatch(dynamicSidebarSearch({isPagination: false}));
        dispatch(planSidbarpermissionDetails({planId:planManagerId}))
        }      
    , []);
    useEffect(() => {
        setPermissionsStateView(transformDataRole(sidebarViewData));
    }, [sidebarViewData]);
    useEffect(() => {
        if (sidebarListData && planSidbarpermissionDetailsData) {
            const allowedPermissions = planSidbarpermissionDetailsData;
            const updatedPermissions = sidebarListData?.map((sidebarItem) => {
                const data = allowedPermissions?.find(
                    (perm) => perm?.pageId === sidebarItem?._id
                );
                return {
                    ...sidebarItem,
                    isAllowed: data?.isAllowed || false,
                };
            });
            setPermissionsState(updatedPermissions);
            if (updatedPermissions) {
                const allChecked = updatedPermissions.every(item => item.isAllowed);
                setCheckAll(allChecked);
            }
        } else if(sidebarListData ){
            const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
                ...sidebarItem,
                isAllowed:false
            }));
            setPermissionsState(updatedPermissions);
        }
    }, [sidebarListData, planSidbarpermissionDetailsData]);
    const handlePermissionToggleRow = (e, pageId) => {
        const isChecked = e.target.checked;
        const updatedPermissions = permissionsState?.map(item => {
            if (item._id === pageId) {
                return { ...item, isAllowed: isChecked };
            }
            return item;
        });
        if (!isChecked) {
            const uncheckChildren = (parentId) => {
                updatedPermissions.forEach(item => {
                    if (item.parentPageId === parentId) {
                        item.isAllowed = false;
                        uncheckChildren(item._id);
                    }
                });
            };
            uncheckChildren(pageId);
        }
        if (isChecked) {
            let currentId = pageId;
            let parentId = updatedPermissions.find(item => item._id === currentId)?.parentPageId;
            
            while (parentId) {
                const parentIndex = updatedPermissions.findIndex(item => item._id === parentId);
                if (parentIndex !== -1) {
                    updatedPermissions[parentIndex].isAllowed = true;
                    parentId = updatedPermissions[parentIndex].parentPageId;
                } else {
                    parentId = null;
                }
            }
        }

        setPermissionsState(updatedPermissions);
        const allChecked = updatedPermissions.every(item => item.isAllowed);
        setCheckAll(allChecked);
    };

    const handleCheckAll = (e) => {
        const isChecked = e.target.checked;
        setCheckAll(isChecked);

        const updatedPermissions = permissionsState?.map((sidebarItem) => ({
            ...sidebarItem,
            isAllowed: isChecked,
        }));
        setPermissionsState(updatedPermissions);
    };

    const onSubmit = (data) => {
        const permission = permissionsState
            ?.map((permissionData) => {
                if (permissionData?.isAllowed) {
                    return {
                        pageId: permissionData?._id,
                        isAllowed: permissionData?.isAllowed ,
                    };
                }
                return null;
            })
            .filter(Boolean);

        const finalPayload = {
            planId: planManagerId,
            pageArr: permission,
        };



dispatch(planSidbarpermission(finalPayload)).then((response) => {
      if (!response.error) {
        navigate(-1);
      }
    });


    };
    const getPermission = (id) => {
        return permissionsState?.find((item) => item._id === id)?.isAllowed;
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            width: 300,
            key: "_id",
            render: (text, permission) => <div className="text-nowrap">{text}</div>,
        },
        {
            title: (
                <div>
                    <Checkbox checked={checkAll} 
                    onChange={handleCheckAll}
                     />
                </div>
            ),
            key: "_id",
            width: 100,
            render: (text, permission) => (
                <div>
                    <Checkbox
                        checked={getPermission(permission._id)}
                        onChange={(e) => handlePermissionToggleRow(e, permission._id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <GlobalLayout>
            <div className="">
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={permissionsStateView}
                    scroll={{
                   
                        x: true,
                    }}
                    rowKey="_id"
                />
                <div className="flex justify-end my-2 mx-2">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleSubmit(onSubmit)}
                        className={`${!loading ? 'bg-header' :'bg-gray-400'} text-white py-1.5 px-3 text-nowrap text-sm rounded `}
                    >
                        {loading?<ListLoader/>: 'Save'}
                    </button>
                </div>
            </div>
        </GlobalLayout>
    );
}

export default PlanApprovalSidebarModal;