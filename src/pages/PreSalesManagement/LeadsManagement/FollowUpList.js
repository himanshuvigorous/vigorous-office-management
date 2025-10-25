import { Card, List, Typography, Image, Tag, Empty, Button, Modal, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FilePdfOutlined, FileExcelOutlined, FileWordOutlined, FileImageOutlined, FileOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../constents/global";
import { FaRegFile, FaTimes } from "react-icons/fa";
import { LEAD_FOLLOWUP_TYPE_ARR } from "../../../constents/ActionConstent";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { LeadmanagementFollowupcommentCreate } from './LeadmanagementFeature/_LeadmanagementFeature_reducers';
import moment from 'moment';


dayjs.extend(relativeTime);

const { Text, Title } = Typography;

const FollowUpList = ({ followUps = [], leadData = null, LeadmanagementFeatureLoading, LeadeManagementFollowupListFunction }) => {
  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD MMM YYYY hh:mm A');
  };
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch()
  const [followupModal, setFollowUpModal] = useState({
    isOpen: false,
    data: null
  });
  const [isPreview, setIsPreview] = useState(false);
  const [attachment, setAttachment] = useState([]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
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
  }
  const handleRemoveFile = (index) => {
    setAttachment((prev) => {
      const updatedAttachments = prev?.filter((_, i) => i !== index);

      return updatedAttachments;
    });
  };
  const getTypeTag = (type) => {
    const typeColors = {
      Call: 'blue',
      Email: 'green',
      Meeting: 'purple',
      Message: 'orange',
      Other: 'gray',
      Proposal: "red",
      Demo: "cyan"
    };
    return <Tag color={typeColors[type] || 'gray'}>{type}</Tag>;
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a', fontSize: 24 }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#1890ff', fontSize: 24 }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageOutlined style={{ color: '#faad14', fontSize: 24 }} />;
      default:
        return <FileOutlined style={{ fontSize: 24 }} />;
    }
  };

  const renderAttachment = (attachment) => {
    const fileName = attachment.split('/').pop();
    const fileUrl = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${attachment}`;
    const extension = fileName.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension);

    return (
      <div key={attachment} className="flex flex-col items-center gap-1">
        {isImage ? (
          <Image
            width={100}
            src={fileUrl}
            alt={fileName}
            className="rounded border"
            preview={{
              src: fileUrl,
            }}
          />
        ) : (
          <Button
            type="text"
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            {getFileIcon(fileName)}
          </Button>
        )}

      </div>
    );
  };
  const onSubmit = (data) => {
    const reqData = {
      "companyId": leadData?.companyId || "",
      "directorId": leadData?.directorId || "",
      "branchId": leadData?.branchId || "",
      "leadId": leadData?._id,
      "type": data?.followupStatus || "",
      "remark": data.comment || "",
      "outcome": "",
      "attachments": attachment || [],
      "date": data.followUpDate ? dayjs(data.followUpDate).format("YYYY-MM-DD") : "",
    }
    dispatch(LeadmanagementFollowupcommentCreate(reqData)).then((res) => {
      if (!data?.error) {
        LeadeManagementFollowupListFunction()
        reset();
        setAttachment([]);
        setFollowUpModal({
          isOpen: false,
          data: null
        });

      }
    })
  }


  return (
    <div className='my-2'>
      <Card title={<div className='flex items-center justify-between'>

        <div className="!mb-0 text-[14px]">Follow-up Activities</div>
        <button
          type="button"
          onClick={() => {
            setFollowUpModal({
              isOpen: true,
              data: leadData
            })
          }}
          className={`bg-header text-white p-1 px-2 rounded  text-sm `}
        >
          Create Follow-up
        </button>
      </div>}>
        {followUps.length === 0 ? <Empty description="No follow-up activities found" /> :
          <div>
            <List
              itemLayout="vertical"
              dataSource={followUps}
              renderItem={(item) => (
                <List.Item>
                  <div className="flex flex-col md:flex-row md:justify-between gap-4 w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Title level={5} className="!mb-0">
                          {getTypeTag(item.type)} {item.date && dayjs(item.date).format("YYYY-MM-DD")}
                        </Title>
                      </div>

                      {item.remark && (
                        <Text className="block mb-2">
                          <strong>Remark:</strong> {item.remark}
                        </Text>
                      )}

                      {item.outcome && (
                        <Text className="block mb-2">
                          <strong>Outcome:</strong> {item.outcome || 'Not specified'}
                        </Text>
                      )}

                      <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500">
                        <Text>
                          <strong>Created by:</strong> {item.createdBy || 'System'}
                        </Text>
                        <Text>
                          <strong>Created:</strong> {formatDate(item.createdAt)}
                        </Text>
                      </div>
                    </div>

                    {item.attachments?.length > 0 && (
                      <div className="w-full md:w-1/3">
                        <Text strong className="block mb-2">
                          Attachments:
                        </Text>
                        <div className="flex flex-wrap gap-4">
                          {item.attachments.map(renderAttachment)}
                        </div>
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </div>
        }

      </Card>
      <Modal
        visible={followupModal?.isOpen}
        onCancel={() => {
          setFollowUpModal({
            isOpen: false,
            data: null
          })
          reset()
        }}
        footer={null}
        title="Create FollowUp"
        width={1000}
        height={400}
        className="antmodalclassName"
      >
        <form autoComplete="off" className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Comment <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("comment", {
                  required: "Comment is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.comment
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Comment"
              />
              {errors.comment && (
                <p className="text-red-500 text-sm">
                  {errors.comment.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                FollowUp Type <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="followupStatus"
                rules={{ required: "FollowUp Type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder={"Select FollowUp Type"}
                    className={`${inputAntdSelectClassName} `}
                    showSearch
                    getPopupContainer={() => document.body}
                    popupClassName={'!z-[1580]'}

                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value=""> Select FollowUp Type </Select.Option>
                    {
                      LEAD_FOLLOWUP_TYPE_ARR.map((type, index) => (
                        <Select.Option key={index} value={type}>
                          {type}
                        </Select.Option>
                      ))
                    }

                  </Select>
                )}
              />
              {errors.followupStatus && (
                <p className="text-red-500 text-sm">
                  {errors.followupStatus.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Follow Up date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="followUpDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} />
                )}
              />
              {errors.followUpDate && (
                <p className="text-red-500 text-sm">
                  {errors.followUpDate.message}
                </p>
              )}
            </div>
            <div className="  pt-2 mt-1 col-span-2">
              {!isPreview ? (
                <div className="space-y-4">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer"
                  >
                    <FaRegFile className="mr-2" /> Add Attachments
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
                          <FaRegFile className="text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {file}
                          </span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2"></div>
              )}
            </div>

          </div>

          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={LeadmanagementFeatureLoading}
              className={`${LeadmanagementFeatureLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3 `}
            >
              {LeadmanagementFeatureLoading ? <Spin /> : 'Submit'}
            </button>
          </div>
        </form>


      </Modal>
    </div>


  );
};

export default FollowUpList;