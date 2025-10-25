import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Tag, 
  message,
  Space,
  Badge,
  Modal,
  Descriptions
} from 'antd';
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import GlobalLayout from '../../global_layouts/GlobalLayout/GlobalLayout';

// Helper functions for localStorage
const getFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const VigoTaskApproval = ({ currentUser }) => {
  const [employees, setEmployees] = useState(getFromStorage('employees'));
  const [tasks, setTasks] = useState(getFromStorage('tasks'));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const storedEmployees = getFromStorage('employees');
    const storedTasks = getFromStorage('tasks');
    
    setEmployees(storedEmployees);
    setTasks(storedTasks);
  }, []);

  const showTaskDetails = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const approveTask = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { 
          ...task, 
          approved: true,
          status: 'Approved'
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveToStorage('tasks', updatedTasks);
    message.success('Task approved successfully!');
    setIsModalVisible(false);
  };

  const rejectTask = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { 
          ...task, 
          approved: false,
          status: 'Rejected'
        };
      }
      return task;
    });
    
    // Create a new revision task
    const originalTask = tasks.find(task => task.id === taskId);
    if (originalTask) {
      const newTask = {
        id: Date.now(),
        title: `Revision: ${originalTask.title}`,
        description: originalTask.description,
        assignedTo: originalTask.assignedTo,
        assignedBy: originalTask.assignedBy,
        dueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        status: 'Pending',
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        completedAt: null,
        approved: null
      };
      
      updatedTasks.push(newTask);
      message.warning('New revision task created!');
    }
    
    setTasks(updatedTasks);
    saveToStorage('tasks', updatedTasks);
    message.success('Task rejected!');
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (id) => {
        const employee = employees.find(emp => emp.id === id);
        return employee ? employee.name : 'Unknown';
      }
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      key: 'assignedBy',
      render: (id) => {
        const employee = employees.find(emp => emp.id === id);
        return employee ? employee.name : 'Unknown';
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Completed' ? 'purple' : 'orange';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      }
    },
    {
      title: 'Completed At',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date) => date ? dayjs(date).format('MMM D, YYYY HH:mm') : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => showTaskDetails(record)}
          >
            View
          </Button>
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            onClick={() => approveTask(record.id)}
            disabled={record.status !== 'Completed'}
          >
            Approve
          </Button>
          <Button 
            danger 
            icon={<CloseCircleOutlined />} 
            onClick={() => rejectTask(record.id)}
            disabled={record.status !== 'Completed'}
          >
            Reject
          </Button>
        </Space>
      )
    }
  ];

  return (
    <GlobalLayout>
      <div className="task-approval">
        <Card title="Task Approval">
          <Table 
            dataSource={tasks.filter(task => task.status === 'Completed')} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>

        {/* Task Details Modal */}
        <Modal
          title="Task Details"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
            <Button 
              key="approve" 
              type="primary" 
              icon={<CheckCircleOutlined />}
              onClick={() => approveTask(selectedTask?.id)}
              disabled={selectedTask?.status !== 'Completed'}
            >
              Approve
            </Button>,
            <Button 
              key="reject" 
              danger 
              icon={<CloseCircleOutlined />}
              onClick={() => rejectTask(selectedTask?.id)}
              disabled={selectedTask?.status !== 'Completed'}
            >
              Reject
            </Button>
          ]}
        >
          {selectedTask && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Title">{selectedTask.title}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedTask.description}</Descriptions.Item>
              <Descriptions.Item label="Assigned To">
                {employees.find(e => e.id === selectedTask.assignedTo)?.name || 'Unknown'}
              </Descriptions.Item>
              <Descriptions.Item label="Assigned By">
                {employees.find(e => e.id === selectedTask.assignedBy)?.name || 'Unknown'}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {dayjs(selectedTask.dueDate).format('MMM D, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedTask.status === 'Completed' ? 'purple' : 'orange'}>
                  {selectedTask.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Completed At">
                {selectedTask.completedAt ? dayjs(selectedTask.completedAt).format('MMM D, YYYY HH:mm') : '-'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </GlobalLayout>
  );
};

export default VigoTaskApproval;