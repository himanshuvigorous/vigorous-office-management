import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Spin,
  Input,
  Avatar,
  Tag,
  Progress,
  Upload,
  message,
  Badge,
  Timeline,
  Collapse,
  Tooltip,
  Tabs,
  Descriptions
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  PaperClipOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  CheckCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  FlagOutlined,
  HourglassOutlined,
  DownloadOutlined,
  CloseOutlined,
  SendOutlined,
  MessageOutlined,
  PlusOutlined,
  DownOutlined,
  UpOutlined,
  CheckCircleFilled,
  HistoryOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectTaskDetails, logsofProjectTaskFunc, statusProjectTaskFunc } from './ProjecttaskFeatures/_project_task_reducers';
import { fileUploadFunc } from '../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers';
import Swal from 'sweetalert2';
import { FaRegFile, FaTimes, FaStopwatch } from 'react-icons/fa';
import { domainName, inputClassName } from '../../../constents/global';
import { MdWorkHistory } from 'react-icons/md';
import { BiTimer } from 'react-icons/bi';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const formatDuration = (start, end) => {
  if (!start) return '0h 0m';
  const endTime = end || new Date();
  const duration = moment.duration(moment(endTime).diff(moment(start)));
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes()) % 60;
  return `${hours}h ${minutes}m`;
};

const statusConfig = {
  'assigned': { color: 'blue', text: 'Assigned', icon: <UserOutlined /> },
  'in-progress': { color: 'orange', text: 'In Progress', icon: <PlayCircleOutlined /> },
  'completed': { color: 'green', text: 'Completed', icon: <CheckCircleOutlined /> },
  'reviewed': { color: 'purple', text: 'Reviewed', icon: <CheckCircleOutlined /> },
  'done': { color: 'green', text: 'Done', icon: <CheckCircleOutlined /> },
  'rejected': { color: 'red', text: 'Rejected', icon: <CloseOutlined /> },
  'reassign': { color: 'volcano', text: 'Reassigned', icon: <UserOutlined /> }
};

const TaskLogsModal = ({ isOpen, data, closeModalFunc, fetchListAfterSuccess }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('comments');
  const [expandedLogs, setExpandedLogs] = useState([]);
  const [workingTime, setWorkingTime] = useState("00:00:00");
  const loadingDetails = false;
  const { projectTaskDetails } = useSelector(state => state.projectTask);
  const isTimerRunning = projectTaskDetails?.isCheckIn;
  const latestCheckinData = projectTaskDetails?.timeSpentData?.latestCheckIn?.checkInTime
  const [attachment, setAttachment] = useState([]);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const loginuserId = userInfoglobal?._id;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Open all comments by default
  useEffect(() => {
    if (projectTaskDetails) {
      const allLogIds = [
        ...(projectTaskDetails?.timeSpentData?.comments || []).map(item => item._id),
        ...(projectTaskDetails?.timeSpentData?.timeLogs?.list || []).map(item => item._id || item.checkInTime)
      ];
      setExpandedLogs(allLogIds);
    }
  }, [projectTaskDetails]);

  useEffect(() => {
    if (isOpen && data?._id) {
      fetchDetailsData(data._id);
    }
  }, [isOpen, data?._id]);

  const fetchDetailsData = useCallback((id) => {
    dispatch(getProjectTaskDetails({ _id: id }));
  }, [dispatch]);

  useEffect(() => {
    if ((projectTaskDetails?.status === "assigned" ||
      projectTaskDetails?.status === "reassign" ||
      projectTaskDetails?.status === "in-progress") && isTimerRunning && latestCheckinData) {
      const interval = setInterval(() => {
        const duration = moment.duration(moment().diff(latestCheckinData));
        const hours = String(duration.hours()).padStart(2, "0");
        const minutes = String(duration.minutes()).padStart(2, "0");
        const seconds = String(duration.seconds()).padStart(2, "0");
        setWorkingTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [projectTaskDetails]);

  const handleTimer = async () => {
    if (isTimerRunning) {
      const { value: comment } = await Swal.fire({
        title: 'Check-out Comment',
        input: 'textarea',
        inputLabel: 'Please enter your comment for checking out',
        inputPlaceholder: 'Enter your comment here...',
        inputAttributes: {
          'aria-label': 'Check-out comment'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      });

      if (comment !== undefined) {
        dispatch(logsofProjectTaskFunc({
          _id: data._id,
          type: 'check-out',
          comment: comment?.trim() || ''
        })).then(res => {
          if (!res.error) {
            fetchDetailsData(data._id);
          }
        });
      }
    } else {
      dispatch(logsofProjectTaskFunc({
        _id: data._id,
        type: 'check-in'
      })).then(res => {
        if (!res.error) {
          fetchDetailsData(data._id);
        }
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reqData = {
      filePath: file,
      isVideo: false,
      isMultiple: false,
    };

    dispatch(fileUploadFunc(reqData)).then((res) => {
      if (res?.payload?.data) {
        setAttachment((prev) => [...prev, res?.payload?.data]);
      }
    });
  };

  const handleRemoveFile = (index) => {
    setAttachment((prev) => {
      const updatedAttachments = prev?.filter((_, i) => i !== index);
      return updatedAttachments;
    });
  };

  const handleCommentSubmit = () => {
    if (!comment.trim() && attachment.length === 0) {
      message.warning('Please add a comment or attachment');
      return;
    }

    dispatch(logsofProjectTaskFunc({
      _id: data._id,
      type: 'comment',
      comment: comment.trim(),
      filePath: attachment
    })).then(res => {
      if (!res.error) {
        setComment('');
        setAttachment([]);
        fetchDetailsData(data._id);
      }
    })
  };

  const calculateTotalTime = () => {
    return projectTaskDetails?.timeSpentData?.timeLogs?.totalMinutes ? `${projectTaskDetails?.timeSpentData?.timeLogs?.totalMinutes} Minutes` : '0.00'
  };

  const toggleExpandLog = (id) => {
    setExpandedLogs(prev =>
      prev.includes(id)
        ? prev.filter(logId => logId !== id)
        : [...prev, id]
    );
  };

  const handleCompleted = () => {
    dispatch(statusProjectTaskFunc({
      "_id": projectTaskDetails?._id,
      "status": "completed"
    })).then((res) => {
      if (!res.error) {
        fetchDetailsData(data._id);
      }
    })
  };

  const renderCommentItem = (item) => {
    return (
      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="flex items-start">
          <div className="mr-3">
            <Avatar
              size={40}
              src={item.createdBy?.profileImage ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${item.createdBy.profileImage}` : null}
              icon={<UserOutlined />}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center">
                <span className="font-medium text-gray-900 text-sm sm:text-base">{item.createdBy?.fullName || 'Unknown'}</span>
                <span className="ml-2 text-xs sm:text-sm text-gray-500">{moment(item.createdAt).fromNow()}</span>
              </div>
              <Tag color="green" icon={<CommentOutlined />} className="text-xs sm:text-sm">Comment</Tag>
            </div>
            <p className="mt-2 text-gray-700 text-sm sm:text-base">{item.comment}</p>

            {item.file?.length > 0 && (
              <div className="mt-3">
                <h4 className="mb-2 text-xs sm:text-sm font-medium text-gray-500">Attachments</h4>
                <div className="space-y-2">
                  {item.file.map((file, idx) => (
                    <a
                      href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={idx}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors text-xs sm:text-sm"
                    >
                      <span className="truncate font-medium text-gray-700">{file}</span>
                      <DownloadOutlined className="ml-2 text-gray-400 hover:text-gray-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTimeLogItem = (item) => {
    const isExpanded = expandedLogs.includes(item._id || item.checkInTime);

    return (
      <div className={`mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 ${isExpanded ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}>
        <div className="flex items-start">
          <div className="mr-3">
            <Avatar
              size={40}
              src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${projectTaskDetails?.assignedToData?.profileImage}`}
              icon={<UserOutlined />}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center">
                <span className="font-medium text-gray-900 text-sm sm:text-base">{projectTaskDetails?.assignedToData?.fullName || 'Unknown'}</span>
                <span className="ml-2 text-xs sm:text-sm text-gray-500">{moment(item.checkInTime).fromNow()}</span>
              </div>
              <div className="flex items-center">
                <Tag color="blue" icon={<ClockCircleOutlined />} className="text-xs sm:text-sm">
                  {item.checkOutTime ? 'Time Entry' : 'Timer Running'}
                </Tag>
                <Button
                  type="text"
                  icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                  onClick={() => toggleExpandLog(item._id || item.checkInTime)}
                  className="ml-2"
                  size="small"
                />
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircleOutlined />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Checked in</p>
                      <p className="text-xs sm:text-sm text-gray-900">
                        {moment(item.checkInTime).format('MMM D, YYYY h:mm A')}
                      </p>
                    </div>
                  </div>

                  {item.checkOutTime && (
                    <div className="flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircleOutlined />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Checked out</p>
                        <p className="text-xs sm:text-sm text-gray-900">
                          {moment(item.checkOutTime).format('MMM D, YYYY h:mm A')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <HourglassOutlined />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-xs sm:text-sm text-gray-900">
                      {formatDuration(item.checkInTime, item.checkOutTime)}
                    </p>
                  </div>
                </div>

                {item.comment && (
                  <div className="flex items-start">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 mt-1">
                      <CommentOutlined />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Comment</p>
                      <p className="text-xs sm:text-sm text-gray-900">{item.comment}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTaskDetails = () => (
    <Card
      title="Task Details"
      className="mb-6"
      headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px' }}
      bodyStyle={{ padding: '16px' }}
    >
      <Descriptions column={1} bordered={false} className="task-details-descriptions">
        <Descriptions.Item label="Priority" className="py-2">
          <div className="flex items-center">
            <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
              <FlagOutlined className="text-xs" />
            </div>
            <span className="font-medium text-sm">{projectTaskDetails?.priority || 'Not set'}</span>
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Status" className="py-2">
          <div className="flex items-center">
            <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {statusConfig[projectTaskDetails?.status]?.icon || <Badge status="processing" />}
            </div>
            <Tag color={statusConfig[projectTaskDetails?.status]?.color || 'default'} className="font-medium text-xs sm:text-sm">
              {statusConfig[projectTaskDetails?.status]?.text || projectTaskDetails?.status || 'Not set'}
            </Tag>
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Start Date" className="py-2">
          <div className="flex items-center">
            <CalendarOutlined className="mr-2 text-gray-400" />
            <span className="font-medium text-sm">
              {projectTaskDetails?.startDateTime
                ? moment(projectTaskDetails.startDateTime).format('MMM D, YYYY')
                : 'Not set'}
            </span>
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Due Date" className="py-2">
          <div className="flex items-center">
            <CalendarOutlined className="mr-2 text-gray-400" />
            <span className="font-medium text-sm">
              {projectTaskDetails?.endDateTime
                ? moment(projectTaskDetails.endDateTime).format('MMM D, YYYY')
                : 'Not set'}
            </span>
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Total Time" className="py-2">
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-2 text-gray-400" />
            <span className="font-medium text-sm">{calculateTotalTime()}</span>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );

  const renderAssigneeCard = () => (
    <Card
      title="Assignee"
      headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px' }}
      bodyStyle={{ padding: '16px', textAlign: 'center' }}
    >
      <Avatar
        size={isMobile ? 60 : 80}
        src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${projectTaskDetails?.assignedToData?.profileImage}`}
        icon={<UserOutlined />}
        className="mb-4"
      />
      <div className="text-center">
        <p className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
          {projectTaskDetails?.assignedToData?.fullName || 'Unassigned'}
        </p>
        <p className="text-gray-500 mb-3 text-sm">
          {projectTaskDetails?.assignedToData?.role || 'Team Member'}
        </p>
      </div>
    </Card>
  );

  if (loadingDetails) {
    return (
      <Modal
        open={isOpen}
        onCancel={closeModalFunc}
        footer={null}
        width={isMobile ? '100%' : 800}
        centered
        className="task-logs-modal"
        style={isMobile ? { top: 0, margin: 0, padding: 0, maxWidth: '100%' } : {}}
      >
        <div className="flex flex-col items-center justify-center p-10">
          <Spin size="large" />
          <p className="mt-4 text-gray-500">Loading task details...</p>
        </div>
      </Modal>
    );
  }

  // Create copies of arrays to avoid mutating read-only state
  const comments = [...(projectTaskDetails?.timeSpentData?.comments || [])];
  const timeLogs = [...(projectTaskDetails?.timeSpentData?.timeLogs?.list || [])];

  // Sort the copies instead of the original arrays
  const sortedComments = comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const sortedTimeLogs = timeLogs.sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));

  return (
    <Modal
      open={isOpen}
      onCancel={closeModalFunc}
      footer={null}
      width={isMobile ? '100%' : 1100}
      centered
      destroyOnClose
      className="task-logs-modal antmodalclassName"
      style={isMobile ? {
        top: 0,
        margin: 0,
        padding: 0,
        maxWidth: '100%',
        height: '100vh'
      } : { top: 20 }}
      bodyStyle={isMobile ? {
        padding: '16px',
        maxHeight: 'calc(100vh - 55px)',
        overflowY: 'auto'
      } : {}}
      title={
        <div className={isMobile ? "max-w-full" : "max-w-3/4"}>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 line-clamp-2">
            {projectTaskDetails?.title}
          </h2>
          <p className="text-gray-500 flex items-center flex-wrap text-xs sm:text-sm">
            <span className="mr-2">#{projectTaskDetails?.taskCode}</span>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className="ml-0 sm:ml-2 mt-1 sm:mt-0">
              Created {projectTaskDetails?.createdAt ? moment(projectTaskDetails.createdAt).fromNow() : ''}
            </span>
          </p>
        </div>
      }
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {loginuserId === projectTaskDetails?.assignedTo &&
            (projectTaskDetails?.status === "assigned" ||
              projectTaskDetails?.status === "reassign" ||
              projectTaskDetails?.status === "in-progress") && (
              <Tooltip title={isTimerRunning ? 'Stop timer' : 'Start timer'}>
                <Button
                  type={isTimerRunning ? 'primary' : 'default'}
                  danger={isTimerRunning}
                  icon={isTimerRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={handleTimer}
                  size={isMobile ? "small" : "middle"}
                  className="flex items-center w-full sm:w-auto justify-center mb-2 sm:mb-0"
                >
                  {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
                </Button>
              </Tooltip>
            )}

          {projectTaskDetails?.status === "in-progress" &&
            !projectTaskDetails?.isCheckIn &&
            loginuserId === projectTaskDetails?.assignedTo && (
              <Button
                type="primary"
                icon={<CheckCircleFilled />}
                onClick={handleCompleted}
                size={isMobile ? "small" : "middle"}
                className="w-full sm:w-auto justify-center"
              >
                Mark Complete
              </Button>
            )}
        </div>
        {(projectTaskDetails?.status === "assigned" ||
        projectTaskDetails?.status === "reassign" ||
        projectTaskDetails?.status === "in-progress") && isTimerRunning &&workingTime && <div className="text-[20px] font-medium text-teal-600 flex items-center  gap-2">
          <BiTimer />
          <span className="font-semibold">{workingTime}</span>
        </div>}
      </div>
      

      <Divider className="my-4" />

      {isMobile ? (
        // Mobile layout - single column with all content in one card
        <Card
          bodyStyle={{ padding: '16px' }}
          className="mobile-task-card"
        >
          {/* Task Details Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Task Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {renderTaskDetails()}
            </div>
          </div>

          {/* Assignee Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Assignee</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {renderAssigneeCard()}
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Description</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-sm">
                {projectTaskDetails?.description || 'No description provided for this task.'}
              </p>
            </div>
          </div>

          {/* Add Comment Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Add Comment</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <TextArea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full mb-4"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />

              <div className="flex flex-col gap-4">
                <div className="space-y-4">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload-mobile"
                  />
                  <label
                    htmlFor="file-upload-mobile"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer hover:bg-gray-50 transition-colors w-full justify-center"
                  >
                    <PaperClipOutlined className="mr-2" /> Add Attachments
                  </label>

                  <div className="space-y-2">
                    {attachment?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-xs"
                      >
                        <a
                          href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                          className="flex items-center space-x-2 truncate"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <PaperClipOutlined className="text-gray-500" />
                          <span className="text-gray-600 truncate max-w-[120px]">
                            {file}
                          </span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <CloseOutlined />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="primary"
                  onClick={handleCommentSubmit}
                  disabled={(!comment.trim() && attachment.length === 0)}
                  className="flex items-center justify-center w-full"
                  icon={<SendOutlined />}
                  size="middle"
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Activity</h3>
            <Tabs
              defaultActiveKey="comments"
              activeKey={activeTab}
              onChange={setActiveTab}
              className="activity-tabs"
              type="card"
            >
              <TabPane
                tab={
                  <span className='flex justify-center items-center gap-1 text-xs sm:text-sm'>
                    <CommentOutlined />
                    Comments
                  </span>
                }
                key="comments"
              >
                <div className="pt-4">
                  <div className="space-y-4">
                    {sortedComments.map((item, index) => (
                      <React.Fragment key={item._id || index}>
                        {renderCommentItem(item)}
                      </React.Fragment>
                    ))}

                    {sortedComments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CommentOutlined className="text-3xl mb-2" />
                        <p>No comments yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span className='flex justify-center items-center gap-1 text-xs sm:text-sm'>
                    <HistoryOutlined />
                    Time Activity
                  </span>
                }
                key="activity"
              >
                <div className="pt-4">
                  <div className="space-y-4">
                    {sortedTimeLogs.map((item, index) => (
                      <React.Fragment key={item._id || item.checkInTime || index}>
                        {renderTimeLogItem(item)}
                      </React.Fragment>
                    ))}

                    {sortedTimeLogs.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <ClockCircleOutlined className="text-3xl mb-2" />
                        <p>No time activity recorded</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      ) : (
        // Desktop layout - original three-column design
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card
              title="Description"
              headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
              bodyStyle={{ padding: '24px' }}
            >
              <p className="text-gray-700">
                {projectTaskDetails?.description || 'No description provided for this task.'}
              </p>
            </Card>

            <Card
              title="Add Comment"
              headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
              bodyStyle={{ padding: '24px' }}
              className="mb-6"
            >
              <TextArea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full mb-4"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-4">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <PaperClipOutlined className="mr-2" /> Add Attachments
                  </label>

                  <div className="space-y-2">
                    {attachment?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <a
                          href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                          className="flex items-center space-x-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <PaperClipOutlined className="text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {file}
                          </span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <CloseOutlined />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="primary"
                  onClick={handleCommentSubmit}
                  disabled={(!comment.trim() && attachment.length === 0)}
                  className="flex items-center self-end"
                  icon={<SendOutlined />}
                  size="middle"
                >
                  Post Comment
                </Button>
              </div>
            </Card>

            <Card
              bodyStyle={{ padding: 0 }}
              className="activity-card"
            >
              <Tabs
                defaultActiveKey="comments"
                activeKey={activeTab}
                onChange={setActiveTab}
                className="activity-tabs !px-5"
              >
                <TabPane
                  tab={
                    <span className='flex justify-center items-center gap-1'>
                      <CommentOutlined />
                      Comments
                    </span>
                  }
                  key="comments"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
                    <div className="space-y-4">
                      {sortedComments.map((item, index) => (
                        <React.Fragment key={item._id || index}>
                          {renderCommentItem(item)}
                        </React.Fragment>
                      ))}

                      {sortedComments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <CommentOutlined className="text-3xl mb-2" />
                          <p>No comments yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className='flex justify-center items-center gap-1'>
                      <HistoryOutlined />
                      Time Activity
                    </span>
                  }
                  key="activity"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Time Activity</h3>
                    <div className="space-y-4">
                      {sortedTimeLogs.map((item, index) => (
                        <React.Fragment key={item._id || item.checkInTime || index}>
                          {renderTimeLogItem(item)}
                        </React.Fragment>
                      ))}

                      {sortedTimeLogs.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <ClockCircleOutlined className="text-3xl mb-2" />
                          <p>No time activity recorded</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            {renderTaskDetails()}
            {renderAssigneeCard()}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskLogsModal;