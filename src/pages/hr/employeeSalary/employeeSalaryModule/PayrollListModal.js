import React from 'react';
import { Modal, Table, Select, Button, Tooltip } from 'antd';
import moment from 'moment';
import { BsEye } from 'react-icons/bs';
import { BiCheckDouble } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { payrollStatusFunc } from '../employeePayrollModule/employeePayRollFeatures/_payroll_reducers';

const PayrollListModal = ({ isOpen, onClose, element, payrollDatafullListId, setPayrollDatafullListId, setIsPayrollListModalOpen , fetchEmployeListData }) => {
const dispatch = useDispatch()
  const columns = [
    {
      title: 'S.No.',
      dataIndex: 'sno',
      render: (text, record, index) => index + 1,
      width: '10%',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Basic Salary',
      dataIndex: 'basicSalary',
    },
    {
      title: 'Gross Salary',
      dataIndex: 'grossSalary',
    },
    {
      title: 'Net Salary',
      dataIndex: 'netSalary',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Action',
      onHeaderCell: (column) => ({
        classname: "bg-header"
      }),
      render: (text, record) => (
        <div className='flex gap-2'>
           <Tooltip placement="topLeft"  title="View Entire Data">
           <button className="px-2 py-1.5 rounded-md bg-transparent border border-muted" >
            <BsEye className='text-gray-600 hover:text-gray-600' size={16}  onClick={() => {
            setPayrollDatafullListId(record._id)
            setIsPayrollListModalOpen(true)
            onClose();
          }} />
          </button>
           </Tooltip>
       
           {/* {record?.status === 'Draft' && <Tooltip placement="topLeft"  title="Approve">
            <button className="px-2 py-1.5 rounded-md bg-transparent border border-muted" onClick={() => {
           dispatch(payrollStatusFunc({
            _id: record._id,
            status: 'Approved'
           }))
            fetchEmployeListData();
          }} >
            <BiCheckDouble className ={`text-green-500`} size={16}  />
          </button></Tooltip>}
           {record?.status !== 'Draft' &&<Tooltip placement="topLeft"  title="No Actions Allowed">
            <button className="px-2 py-1.5 rounded-md bg-transparent border border-muted"  >
            <BiCheckDouble className ={`text-gray-600`} size={16}  />
          </button>
          </Tooltip>
          } */}
       
       
      
       
        </div>
      ),
    },
  ];
  if (!isOpen) return null;
  return (
    <Modal
      title={`Payroll Data -  ${element?.employeName}`}
      visible={isOpen}
      onCancel={onClose}
      footer={null}
       className="antmodalclassName"
      width={1000}
    >
      <Table
        columns={columns}
        dataSource={element?.payrollData || []}
        rowKey="_id"
        pagination={false}
        size='small'
        bordered
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: 'Record Not Found',
        }}
        rowClassName={(record, index) => (index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white')}
      />

    </Modal>
  );
};

export default PayrollListModal;
