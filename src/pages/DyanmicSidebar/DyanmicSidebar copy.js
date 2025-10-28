import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { encrypt } from "../../config/Encryption";
import {dynamicSidebarDelete,getviewFinalsidebarList } from "./DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { Button, Modal, Space, Table, Tooltip, Typography, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusOutlined, PlusCircleOutlined, ExclamationCircleFilled, DragOutlined, SaveOutlined } from '@ant-design/icons';
import { domainName } from "../../constents/global";
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import DraggableRow from './DraggableRow';
const { confirm } = Modal;

const DyanmicSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [reorderedData, setReorderedData] = useState([]);
  
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

  useEffect(() => {
    setReorderedData(sidebarViewData);
  }, [sidebarViewData]);

  const getDataList = async() => {
    await dispatch(getviewFinalsidebarList());
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

  // Drag and Drop Handlers for main items
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // Only proceed if there's a valid over target and it's different from active
    if (over && active.id !== over.id) {
      setReorderedData((previousData) => {
        const activeIndex = previousData.findIndex((item) => item._id === active.id);
        const overIndex = previousData.findIndex((item) => item._id === over.id);
        
        if (activeIndex !== -1 && overIndex !== -1) {
          return arrayMove(previousData, activeIndex, overIndex);
        }
        return previousData;
      });
    }
    
    setActiveId(null);
  };

  // Handle reordering of subpages
  const handleSubpageReorder = (parentId, newSubpages) => {
    setReorderedData(prevData => 
      prevData.map(item => 
        item._id === parentId 
          ? { ...item, subPages: newSubpages }
          : item
      )
    );
  };

  // Handle reordering of subchild pages
  const handleSubchildReorder = (parentId, subpageId, newSubchildPages) => {
    setReorderedData(prevData => 
      prevData.map(item => {
        if (item._id === parentId) {
          return {
            ...item,
            subPages: item.subPages.map(subpage => 
              subpage._id === subpageId 
                ? { ...subpage, subChildPages: newSubchildPages }
                : subpage
            )
          };
        }
        return item;
      })
    );
  };

  // Safe drag end handler for nested tables
  const createSafeDragEndHandler = (items, onReorder) => (event) => {
    const { active, over } = event;
    
    // Only proceed if there's a valid over target and it's different from active
    if (over && active.id !== over.id) {
      const activeIndex = items.findIndex(item => item._id === active.id);
      const overIndex = items.findIndex(item => item._id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const newItems = arrayMove(items, activeIndex, overIndex);
        onReorder(newItems);
      }
    }
    setActiveId(null);
  };

  // Flatten all data and generate payload
  const generateOrderPayload = () => {
    const payload = [];

    // Process main items
    reorderedData.forEach((mainItem, mainIndex) => {
      payload.push({
        pageId: mainItem._id,
        orderBy: mainIndex + 1,
        level: 'parent'
      });

      // Process subpages
      if (mainItem.subPages && mainItem.subPages.length > 0) {
        mainItem.subPages.forEach((subItem, subIndex) => {
          payload.push({
            pageId: subItem._id,
            orderBy: subIndex + 1,
            parentId: mainItem._id,
            level: 'subpage'
          });

          // Process subchild pages
          if (subItem.subChildPages && subItem.subChildPages.length > 0) {
            subItem.subChildPages.forEach((childItem, childIndex) => {
              payload.push({
                pageId: childItem._id,
                orderBy: childIndex + 1,
                parentId: subItem._id,
                level: 'subchild'
              });
            });
          }
        });
      }
    });

    return payload;
  };

  // Submit the new order
  const handleSubmitOrder = async () => {
    try {
      const orderPayload = generateOrderPayload();
      
      console.log('Order Payload:', orderPayload); // For debugging
      
      // await dispatch(updateSidebarOrder({ sidebarPages: orderPayload }));
      message.success('Sidebar order updated successfully!');
      setIsReorderMode(false);
      getDataList(); // Refresh data
    } catch (error) {
      message.error('Failed to update sidebar order');
      console.error('Error updating order:', error);
    }
  };

  const cancelReorder = () => {
    setReorderedData(sidebarViewData);
    setIsReorderMode(false);
  };

  // Normal mode columns (with actions)
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
          <Tooltip placement="topLeft" title="Add Child">
            <Button 
              type="text" 
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/dynamic-sidebar/create/${encrypt(record._id)}`);
              }}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/dynamic-sidebar/edit/${encrypt(record._id)}`);
              }}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title="Delete">
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

  // Reorder mode columns (with drag handle)
  const reorderColumns = [
    {
      title: 'Drag',
      key: 'drag',
      width: '5%',
      render: () => (
        <Tooltip title="Drag to reorder">
          <DragOutlined style={{ cursor: 'grab', color: '#999' }} />
        </Tooltip>
      ),
    },
    {
      title: 'S.No.',
      key: 'index',
      width: '8%',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Typography.Text strong>{text || '-'}</Typography.Text>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text) => text || '-',
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
          <Tooltip placement="topLeft" title="Add Child">
            <Button 
              type="text" 
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/dynamic-sidebar/create/${encrypt(record._id)}`);
              }}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/dynamic-sidebar/edit/${encrypt(record._id)}`);
              }}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title="Delete">
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

  const reorderSubColumns = [
    {
      title: 'Drag',
      key: 'drag',
      width: '5%',
      render: () => (
        <Tooltip title="Drag to reorder">
          <DragOutlined style={{ cursor: 'grab', color: '#999' }} />
        </Tooltip>
      ),
    },
    {
      title: 'S.No.',
      key: 'index',
      width: '8%',
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
          <Tooltip placement="topLeft" title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/dynamic-sidebar/edit/${encrypt(record._id)}`);
              }}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title="Delete">
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

  const reorderNestedSubColumns = [
    {
      title: 'Drag',
      key: 'drag',
      width: '5%',
      render: () => (
        <Tooltip title="Drag to reorder">
          <DragOutlined style={{ cursor: 'grab', color: '#999' }} />
        </Tooltip>
      ),
    },
    {
      title: 'S.No.',
      key: 'index',
      width: '8%',
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
  ];

  const expandedRowRender = (record) => {
    if (!record.subPages || record.subPages.length === 0) {
      return (
        <div style={{ margin: 0, padding: '8px 16px', background: '#fafafa' }}>
          <Typography.Text type="secondary">No subpages found</Typography.Text>
        </div>
      );
    }

    if (isReorderMode) {
      const subpageDragEndHandler = createSafeDragEndHandler(
        record.subPages,
        (newSubpages) => handleSubpageReorder(record._id, newSubpages)
      );

      return (
        <DndContext 
          modifiers={[restrictToVerticalAxis]}
          onDragStart={handleDragStart}
          onDragEnd={subpageDragEndHandler}
        >
          <SortableContext items={record.subPages.map(item => item._id)} strategy={verticalListSortingStrategy}>
            <Table
              columns={reorderSubColumns}
              dataSource={record.subPages}
              rowKey="_id"
              pagination={false}
              size="small"
              bordered
              components={{
                body: {
                  row: DraggableRow,
                },
              }}
              expandable={{
                expandedRowRender: (subRecord) => nestedReorderExpandedRowRender(subRecord, record._id),
                expandIcon: ({ expanded, onExpand, record: subRecord }) => 
                  subRecord.subChildPages && subRecord.subChildPages.length > 0 ? (
                    <Button 
                      type="text" 
                      size="small"
                      icon={expanded ? <MinusOutlined /> : <PlusCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onExpand(subRecord, e);
                      }}
                    />
                  ) : null,
              }}
            />
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <Table
                size="small"
                dataSource={[record.subPages.find(item => item._id === activeId)]}
                columns={reorderSubColumns}
                pagination={false}
                rowKey="_id"
              />
            ) : null}
          </DragOverlay>
        </DndContext>
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
          expandIcon: ({ expanded, onExpand, record: subRecord }) => 
            subRecord.subChildPages && subRecord.subChildPages.length > 0 ? (
              <Button 
                type="text" 
                size="small"
                icon={expanded ? <MinusOutlined /> : <PlusCircleOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(subRecord, e);
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

  const nestedReorderExpandedRowRender = (subRecord, parentId) => {
    if (!subRecord.subChildPages || subRecord.subChildPages.length === 0) {
      return (
        <div style={{ margin: 0, padding: '8px 16px', background: '#fafafa' }}>
          <Typography.Text type="secondary">No child pages found</Typography.Text>
        </div>
      );
    }

    const subchildDragEndHandler = createSafeDragEndHandler(
      subRecord.subChildPages,
      (newSubchildPages) => handleSubchildReorder(parentId, subRecord._id, newSubchildPages)
    );

    return (
      <DndContext 
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={subchildDragEndHandler}
      >
        <SortableContext items={subRecord.subChildPages.map(item => item._id)} strategy={verticalListSortingStrategy}>
          <Table
            columns={reorderNestedSubColumns}
            dataSource={subRecord.subChildPages}
            rowKey="_id"
            pagination={false}
            size="small"
            bordered
            components={{
              body: {
                row: DraggableRow,
              },
            }}
          />
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <Table
              size="small"
              dataSource={[subRecord.subChildPages.find(item => item._id === activeId)]}
              columns={reorderNestedSubColumns}
              pagination={false}
              rowKey="_id"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  };

  return (
    <GlobalLayout>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Dynamic Sidebar Management
          </Typography.Title>
          
          <Space>
            {isReorderMode ? (
              <>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSubmitOrder}
                >
                  Save Order
                </Button>
                <Button onClick={cancelReorder}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  icon={<DragOutlined />}
                  onClick={() => setIsReorderMode(true)}
                >
                  Reorder Items
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/admin/dynamic-sidebar/create")}
                >
                  Add New Sidebar Item
                </Button>
              </>
            )}
          </Space>
        </div>

        {isReorderMode && (
          <div style={{ marginBottom: 16, padding: '12px 16px', backgroundColor: '#f0f7ff', border: '1px solid #91d5ff', borderRadius: 6 }}>
            <Typography.Text type="secondary">
              <strong>Reorder Mode:</strong> Drag items using the handle icon to rearrange. Expand submenus to reorder nested items.
            </Typography.Text>
          </div>
        )}

        {isReorderMode ? (
          <DndContext 
            modifiers={[restrictToVerticalAxis]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={reorderedData.map(item => item._id)} strategy={verticalListSortingStrategy}>
              <Table
                columns={reorderColumns}
                dataSource={reorderedData}
                pagination={false}
                rowKey="_id"
                loading={loading}
                components={{
                  body: {
                    row: DraggableRow,
                  },
                }}
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
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <Table
                  dataSource={[reorderedData.find(item => item._id === activeId)]}
                  columns={reorderColumns}
                  pagination={false}
                  rowKey="_id"
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
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
        )}
      </div>
    </GlobalLayout>
  );
};

export default DyanmicSidebar;