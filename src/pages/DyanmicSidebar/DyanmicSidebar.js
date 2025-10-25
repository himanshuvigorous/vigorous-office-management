import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { encrypt } from "../../config/Encryption";
import {dynamicSidebarDelete,getviewFinalsidebarList, } from "./DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { Button, Modal, Space, Table, Tooltip, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusOutlined, PlusCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { domainName } from "../../constents/global";
const { confirm } = Modal;

const DyanmicSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const userInfoglobal = JSON.parse(
      localStorage.getItem(`user_info_${domainName}`)
    );
  const { sidebarViewData, loading } = useSelector((state) => ({
    sidebarViewData: state.dynamicSidebar.sidebarViewData || [],
    loading: state.dynamicSidebar.loading || false,
  }));
  useEffect(() => {
  if(userInfoglobal?.userType == "admin"){
    getDataList();
  } else{
    localStorage.clear()
    window.location.href = "/"
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGOUT' }));
      }
  }
  }, []);
  const getDataList = async() => {
   await  dispatch(getviewFinalsidebarList());
  };
  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this item?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk() {
        return new Promise((resolve) => {
          dispatch(dynamicSidebarDelete({ _id: id })).then(() => {
            getDataList();
            resolve();
          });
        });
      },
    });
  };
  const columns = [
    {
      title: 'S.No.',
      key: 'index',
      width: '10%',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || '-',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text) => text || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip placement="topLeft"  title="Add Child">
            <Button 
              type="text" 
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/dynamic-sidebar/create/${encrypt(record._id)}`);
              }}
            />
          </Tooltip>
          <Tooltip placement="topLeft"  title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/dynamic-sidebar/edit/${encrypt(record._id)}`);
              }}
            />
          </Tooltip>
          <Tooltip placement="topLeft"  title="Delete">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record._id);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const subColumns = [
    {
      title: 'S.No.',
      key: 'index',
      width: '10%',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || '-',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text) => text || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
         
            <Tooltip placement="topLeft"  title="Add Child">
              <Button 
                type="text" 
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/dynamic-sidebar/create/${encrypt(record._id)}`);
                }}
              />
            </Tooltip>
     
          <Tooltip placement="topLeft"  title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/dynamic-sidebar/edit/${encrypt(record._id)}`);
              }}
            />
          </Tooltip>
          <Tooltip placement="topLeft"  title="Delete">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record._id);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const nestedSubColumns = [
    {
      title: 'S.No.',
      key: 'index',
      width: '10%',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || '-',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text) => text || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip placement="topLeft"  title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/dynamic-sidebar/edit/${encrypt(record._id)}`);
              }}
            />
          </Tooltip>
          <Tooltip placement="topLeft"  title="Delete">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record._id);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const expandedRowRender = (record) => {
    if (!record.subPages || record.subPages.length === 0) {
      return (
        <div style={{ margin: 0, padding: '8px 16px', background: '#fafafa' }}>
          <Typography.Text type="secondary">No subpages found</Typography.Text>
        </div>
      );
    }
    return (
      <Table
        columns={subColumns}
        dataSource={record.subPages}
        rowKey="_id"
        pagination={false}
        size="small"
        bordered
        expandable={{
          expandedRowRender: nestedExpandedRowRender,
          expandIcon: ({ expanded, onExpand, record }) => 
            record.subChildPages && record.subChildPages.length > 0 ? (
              <Button 
                type="text" 
                size="small"
                icon={expanded ? <MinusOutlined /> : <PlusCircleOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(record, e);
                }}
              />
            ) : null,
        }}
      />
    );
  };
  const nestedExpandedRowRender = (record) => {
    if (!record.subChildPages || record.subChildPages.length === 0) {
      return (
        <div style={{ margin: 0, padding: '8px 16px', background: '#fafafa' }}>
          <Typography.Text type="secondary">No child pages found</Typography.Text>
        </div>
      );
    }
    return (
      <Table
        columns={nestedSubColumns}
        dataSource={record.subChildPages}
        rowKey="_id"
        pagination={false}
        size="small"
        bordered
      />
    );
  };
  return (
    <GlobalLayout>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Dynamic Sidebar Management
          </Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/dynamic-sidebar/create")}
          >
            Add New Sidebar Item
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={sidebarViewData}
          pagination={false}
          rowKey="_id"
          loading={loading}
          expandable={{
            expandedRowRender,
            expandIcon: ({ expanded, onExpand, record }) => 
              record.subPages && record.subPages.length > 0 ? (
                <Button 
                  type="text" 
                  icon={expanded ? <MinusOutlined /> : <PlusCircleOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand(record, e);
                  }}
                />
              ) : null,
            rowExpandable: (record) => record.subPages && record.subPages.length > 0,
          }}
          locale={{
            emptyText: 'No sidebar items found'
          }}
          bordered
        />
      </div>
    </GlobalLayout>
  );
};

export default DyanmicSidebar;
