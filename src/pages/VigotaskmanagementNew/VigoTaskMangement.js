import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Card, 
  Tag, 
  message,
  Popconfirm,
  Space,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  PlayCircleOutlined, 
  PauseOutlined, 
  CheckCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import GlobalLayout from '../../global_layouts/GlobalLayout/GlobalLayout';

const { Option } = Select;
const { TextArea } = Input;

// Helper functions for localStorage
const getFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initial data setup
const initializeData = () => {
  if (!localStorage.getItem('employees')) {
    saveToStorage('employees', [
      { id: 1, name: 'John Doe', position: 'Developer', role: 'employee' },
      { id: 2, name: 'Jane Smith', position: 'Designer', role: 'employee' },
      { id: 3, name: 'Mike Johnson', position: 'Manager', role: 'manager' }
    ]);
  }
  
  if (!localStorage.getItem('tasks')) {
    saveToStorage('tasks', []);
  }
  
  if (!localStorage.getItem('taskLogs')) {
    saveToStorage('taskLogs', []);
  }
};

initializeData();

const VigoTaskManagement = ({ currentUser }) => {
  const [employees, setEmployees] = useState(getFromStorage('employees') || [
      { id: 1, name: 'John Doe', position: 'Developer', role: 'employee' },
      { id: 2, name: 'Jane Smith', position: 'Designer', role: 'employee' },
      { id: 3, name: 'Mike Johnson', position: 'Manager', role: 'manager' }
    ]);
  const [tasks, setTasks] = useState(getFromStorage('tasks'));
  const [taskLogs, setTaskLogs] = useState(getFromStorage('taskLogs'));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedEmployees = getFromStorage('employees');
    const storedTasks = getFromStorage('tasks');
    const storedTaskLogs = getFromStorage('taskLogs');
    
    setEmployees(storedEmployees);
    setTasks(storedTasks);
    setTaskLogs(storedTaskLogs);
    
    // Check if any task was active when the app was closed
    const activeTask = storedTasks.find(task => task.status === 'In Progress' && task.assignedTo === currentUser?.id);
    if (activeTask) {
      setActiveTaskId(activeTask.id);
    }
  }, [currentUser]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToStorage('employees', employees);
    saveToStorage('tasks', tasks);
    saveToStorage('taskLogs', taskLogs);
  }, [employees, tasks, taskLogs]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  const onFinish = (values) => {
    const newTask = {
      id: Date.now(),
      title: values.title,
      description: values.description,
      assignedTo: values.assignedTo,
      assignedBy: currentUser?.id || 1,
      dueDate: values.dueDate.format('YYYY-MM-DD'),
      status: 'Pending',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      completedAt: null,
      approved: null
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    message.success('Task created successfully!');
    setIsModalVisible(false);
    form.resetFields();
  };

  const startTask = (taskId) => {
    // Pause any currently active task
    if (activeTaskId) {
      pauseTask(activeTaskId);
    }
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: 'In Progress' };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setActiveTaskId(taskId);
    
    // Create a new task log entry
    const newLog = {
      id: Date.now(),
      taskId,
      startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      endTime: null,
      duration: null
    };
    
    setTaskLogs([...taskLogs, newLog]);
    message.info('Task started!');
  };

  const pauseTask = (taskId) => {
    if (!activeTaskId) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: 'Paused' };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setActiveTaskId(null);
    
    // Update the task log
    const activeLogIndex = taskLogs.findIndex(
      log => log.taskId === taskId && log.endTime === null
    );
    
    if (activeLogIndex !== -1) {
      const startTime = dayjs(taskLogs[activeLogIndex].startTime);
      const endTime = dayjs();
      const duration = endTime.diff(startTime, 'seconds');
      
      const updatedLogs = [...taskLogs];
      updatedLogs[activeLogIndex] = {
        ...updatedLogs[activeLogIndex],
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        duration
      };
      
      setTaskLogs(updatedLogs);
    }
    
    message.warning('Task paused!');
  };

  const resumeTask = (taskId) => {
    startTask(taskId);
    message.info('Task resumed!');
  };

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { 
          ...task, 
          status: 'Completed',
          completedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    // If the task was active, update its log
    if (activeTaskId === taskId) {
      pauseTask(taskId);
    }
    
    message.success('Task marked as completed!');
  };

  const editTask = (task) => {
    setCurrentTask(task);
    editForm.setFieldsValue({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      dueDate: dayjs(task.dueDate)
    });
    setIsEditModalVisible(true);
  };

  const onEditFinish = (values) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === currentTask.id) {
        return {
          ...task,
          title: values.title,
          description: values.description,
          assignedTo: values.assignedTo,
          dueDate: values.dueDate.format('YYYY-MM-DD')
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    message.success('Task updated successfully!');
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    
    // Also remove related logs
    const updatedLogs = taskLogs.filter(log => log.taskId !== taskId);
    setTaskLogs(updatedLogs);
    
    message.success('Task deleted successfully!');
  };

  const calculateTotalTime = (taskId) => {
    const logsForTask = taskLogs.filter(log => log.taskId === taskId);
    return logsForTask.reduce((total, log) => total + (log.duration || 0), 0);
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
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => dayjs(date).format('MMM D, YYYY')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        let color = '';
        let icon = null;
        
        switch (status) {
          case 'Pending':
            color = 'orange';
            icon = <ClockCircleOutlined />;
            break;
          case 'In Progress':
            color = 'blue';
            icon = <PlayCircleOutlined />;
            break;
          case 'Paused':
            color = 'gold';
            icon = <PauseOutlined />;
            break;
          case 'Completed':
            color = 'purple';
            icon = <CheckCircleOutlined />;
            break;
          case 'Approved':
            color = 'green';
            icon = <CheckCircleOutlined />;
            break;
          case 'Rejected':
            color = 'red';
            icon = <CheckCircleOutlined />;
            break;
          default:
            color = 'gray';
        }
        
        return (
          <Badge dot={status === 'In Progress'} color={color}>
            <Tag icon={icon} color={color}>
              {status}
            </Tag>
          </Badge>
        );
      }
    },
    {
      title: 'Time Spent',
      key: 'timeSpent',
      render: (_, record) => {
        const totalSeconds = calculateTotalTime(record.id);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const isAssignedUser = true;
        const isCreator = true; 
        return (
          <Space>
            {isAssignedUser && record.status === 'Pending' && (
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />} 
                onClick={() => startTask(record.id)}
              >
                Start
              </Button>
            )}
            
            {isAssignedUser && record.status === 'In Progress' && (
              <>
                <Button 
                  icon={<PauseOutlined />} 
                  onClick={() => pauseTask(record.id)}
                >
                  Pause
                </Button>
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  onClick={() => completeTask(record.id)}
                >
                  Complete
                </Button>
              </>
            )}
            
            {isAssignedUser && record.status === 'Paused' && (
              <>
                <Button 
                  type="primary" 
                  icon={<PlayCircleOutlined />} 
                  onClick={() => resumeTask(record.id)}
                >
                  Resume
                </Button>
                <Button 
                  icon={<CheckCircleOutlined />} 
                  onClick={() => completeTask(record.id)}
                >
                  Complete
                </Button>
              </>
            )}
            
            {(isCreator || currentUser?.role === 'manager') && (
              <Button 
                icon={<EditOutlined />} 
                onClick={() => editTask(record)}
              />
            )}
            
            {(isCreator || currentUser?.role === 'manager') && (
              <Popconfirm
                title="Are you sure to delete this task?"
                onConfirm={() => deleteTask(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <GlobalLayout>
      <div className="task-management">
        <Card 
          title="Task Management" 
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              Create Task
            </Button>
          }
        >
          <Table 
            dataSource={tasks} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
        
        {/* Create Task Modal */}
        <Modal
          title="Create New Task"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          className="antmodalclassName"
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              name="title"
              label="Task Title"
              rules={[{ required: true, message: 'Please enter task title' }]}
            >
              <input placeholder="Enter task title" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter task description' }]}
            >
              <TextArea rows={4} placeholder="Enter task description" />
            </Form.Item>
            
            <Form.Item
              name="assignedTo"
              label="Assign To"
              rules={[{ required: true, message: 'Please select an employee' }]}
            >
              <Select
                getPopupContainer={() => document.body}
                popupClassName={'!z-[1580]'} 
                placeholder="Select employee"
              >
                {console.log(employees)}
                {employees.filter(emp => emp.role === 'employee').map(employee => (
                  <Option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.position})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: 'Please select due date' }]}
            >
              <DatePicker
                getPopupContainer={() => document.body}
                popupClassName={'!z-[1580]'} 
                style={{ width: '100%' }} 
              />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Task
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        
        {/* Edit Task Modal */}
        <Modal
          title="Edit Task"
          visible={isEditModalVisible}
          onCancel={handleEditCancel}
          footer={null}
          className="antmodalclassName"
        >
          <Form form={editForm} onFinish={onEditFinish} layout="vertical">
            <Form.Item
              name="title"
              label="Task Title"
              rules={[{ required: true, message: 'Please enter task title' }]}
            >
              <input placeholder="Enter task title" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter task description' }]}
            >
              <TextArea rows={4} placeholder="Enter task description" />
            </Form.Item>
            
            <Form.Item
              name="assignedTo"
              label="Assign To"
              rules={[{ required: true, message: 'Please select an employee' }]}
            >
              <Select
                getPopupContainer={() => document.body}
                popupClassName={'!z-[1580]'} 
                placeholder="Select employee"
              >
                {employees.filter(emp => emp.role === 'employee').map(employee => (
                  <Option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.position})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: 'Please select due date' }]}
            >
              <DatePicker
                getPopupContainer={() => document.body}
                popupClassName={'!z-[1580]'} 
                style={{ width: '100%' }} 
              />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Task
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </GlobalLayout>
  );
};

export default VigoTaskManagement;