import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Tag,
  Button,
  Space,
  Tooltip,
  Input,
  Card,
  Typography,
  Badge,
  Select
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownOutlined,
  RightOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import getUserIds from "../../../constents/getUserIds";
import usePermissions from "../../../config/usePermissions";
import { deleteLeadCategoryFunc, getLeadCategoryList } from "./LeadCategoryFeatures/_LeadCategory_reducers";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { encrypt } from "../../../config/Encryption";
import Swal from "sweetalert2";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { Controller, useForm, useWatch } from "react-hook-form";
import { inputAntdSelectClassNameFilter, pageSizeLead } from "../../../constents/global";
import ListLoader from "../../../global_layouts/ListLoader";

const { Search } = Input;
const { Text } = Typography;
function LeadsManagementCategory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const {
      setValue,
      control,
     
    } = useForm();
  const { userCompanyId,userType ,userBranchId} = getUserIds();
  const { LeadCategoryListData, totalLeadCategoryCount, loading } = useSelector((state) => state.leadCategory);

  const [expandedRows, setExpandedRows] = useState([]);

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
   const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );





     const [searchParams, setSearchParams] = useSearchParams();
          const initialPage = parseInt(searchParams.get("page")) || 1;
          const initialLimit = parseInt(searchParams.get("limit")) || 10;
          const initialBranchId = searchParams.get("branchId") || "";     
          const [currentPage, setCurrentPage] = useState(initialPage);
          const [limit, setLimit] = useState(initialLimit);   
          const [searchText, setSearchText] = useState("");   
          const [branchId, setBranchId] = useState(initialBranchId);
      
          useEffect(() => {
            const params = new URLSearchParams();
            if (currentPage > 1) params.set("page", currentPage);
            if (limit) params.set("limit", limit);
            if (branchId) params.set("branchId", branchId);
            setSearchParams(params);
          }, [ branchId, searchText, currentPage, limit]);
          useEffect(() => {
          
              fetchLeadCategoryList();
          
          }, [ branchId, searchText, currentPage, limit]);
        
          const handleResetFilters = () => {
            setCurrentPage(1);
            setBranchId("");
            setLimit(10);
            setSearchText("");
          };
          const onChange = (e) => {
            setSearchText(e);
          };
        
          const onPaginationChange = (page) => setCurrentPage(page);
          const handleBranchChange = (value) => {
            setBranchId(value);
            setCurrentPage(1);
          };



  const fetchLeadCategoryList = () => {
    const reqListData = {
      limit: limit,
      page: currentPage,
      reqPayload: {
        text: searchText,
        sort: true,
        branchId:branchId,
        companyId: userCompanyId,
        isPagination: true,
        status: "",
      },
    };
    dispatch(getLeadCategoryList(reqListData));
  };

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };

    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteLeadCategoryFunc(reqData)).then((data) => {
          if (currentPage > 1 && LeadCategoryListData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));
          } else {
            !data.error && fetchLeadCategoryList()
          }
        });
      }
    });
  };

    useEffect(() => {
      if (userCompanyId) {
        dispatch(
          branchSearch({
            text: "",
            sort: true,
            status: true,
            isPagination: false,
            companyId: userCompanyId,
          })
        );
      }
    }, [userCompanyId]);


    const handlePageSizeChange = (e) => {
      setLimit(Number(e));
      setCurrentPage(Number(1))
    };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (_, record, index) => index + 1 + (currentPage - 1) * limit,
    },
    {
      title: "Lead Category Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>

          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format('DD-MM-YYYY hh:mm a') ?? "-",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {!record.leadCategoryId && canCreate && (
            <Tooltip title="Add Subcategory">
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() => navigate(`/admin/lead-category/create?parentPageId=${record._id}`)}
              />
            </Tooltip>
          )}
          {canUpdate && (
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => navigate(`/admin/lead-category/edit/${encrypt(record._id)}`)}
              />
            </Tooltip>
          )}
          {canDelete && (
            <Tooltip title="Delete">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record._id)}
                danger
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const subColumns = [
      ...columns.slice(0, -1), // Copy all columns except the last one (Action)
      {
        ...columns[columns.length - 1], // Copy the Action column
        render: (_, subRecord) => (
          <Space size="small">
            {canUpdate && (
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/admin/lead-category/edit/${encrypt(subRecord._id)}`)}
                />
              </Tooltip>
            )}
            {canDelete && (
              <Tooltip title="Delete">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(subRecord._id)}
                  danger
                />
              </Tooltip>
            )}
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={subColumns}
        dataSource={record.leadSubCategoryData}
        rowKey="_id"
        pagination={false}
        showHeader={false}
        size="small"
        style={{ backgroundColor: '#fafafa' }}
      />
    );
  };

  return (
    <GlobalLayout>
      <div className="flex justify-end items-center">
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-5 2xl:grid-cols-7 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-4 w-full items-center">
        <div className="flex items-center p-2 gap-2">
                                   <span className="text-sm font-light text-gray-500">
                                     Rows per page:
                                   </span>
                                   <Select
                                     value={limit}
                                     onChange={handlePageSizeChange}
                                     className="text-sm font-light text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
                                   >
                                     {pageSizeLead.map((size) => (
                                       <Select.Option key={size} value={size}>
                                         {size}
                                       </Select.Option>
                                     ))}
                                   </Select>
                                 </div>
        {(userType === "admin" ||
          userType === "company" ||
          userType === "companyDirector") && (
          <div className="relative md:flex justify-center items-center space-x-2  text-[14px] rounded-md">
      
                <Select
                  defaultValue={""}
                  disabled={loading}
                  onChange={handleBranchChange}
                  value={branchId}
                  className={`${inputAntdSelectClassNameFilter} `}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Select Branch</Select.Option>
                  {branchListloading ? (
                    <Select.Option disabled>
                      <ListLoader />
                    </Select.Option>
                  ) : (
                    branchList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))
                  )}
                </Select>
            
          </div>
        )}

        
        <div className="flex justify-end  items-center">
          <button
            onClick={() => {
              handleResetFilters()
            }}
            className="bg-header w-full  py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white"
          >
            <span className="text-[12px]">Reset</span>
          </button>
        </div>
      
         {canCreate && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/lead-category/create")}
          >
            Add Category
          </Button>
        )}
      </div>
        {/* {canCreate && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/lead-category/create")}
          >
            Add Category
          </Button>
        )} */}
      </div>
     
      {loading ? (
        <Loader2 />
      ) : (
        <div className="sm:w-full overflow-x-auto bg-white">
          <Table
            columns={columns}
            dataSource={LeadCategoryListData}
            rowKey="_id"
            expandable={{
              expandedRowRender,
              expandedRowKeys: expandedRows,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedRows([...expandedRows, record._id]);
                } else {
                  setExpandedRows(expandedRows.filter(id => id !== record._id));
                }
              },
              rowExpandable: (record) => record.leadSubCategoryData?.length > 0,
            }}
            pagination={false}
            bordered
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <CustomPagination
              totalCount={totalLeadCategoryCount}
              pageSize={limit}
              currentPage={currentPage}
              onChange={onPaginationChange}
            />
          </div>
        </div>
      )}
    </GlobalLayout>
  );
}

export default LeadsManagementCategory;