import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Typography,
  Divider,
  Spin,
  Empty,
} from "antd";
import { getLeadmanagementFeatureById, LeadmanagementFollowupcommentListFunc } from "./LeadmanagementFeature/_LeadmanagementFeature_reducers";
import { decrypt } from "../../../config/Encryption";
import dayjs from "dayjs";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";

import FollowUpList from "./FollowUpList";

const { Title, Text } = Typography;

function ViewLeads() {
  const {
    loading: LeadmanagementFeatureLoading,
    LeadmanagementFeatureByIdData,
    LeadmanagementFoolowupList
  } = useSelector(state => state.LeadmanagementFeature);

  const dispatch = useDispatch();
  const { leadIdEnc } = useParams();
  const leadId = decrypt(leadIdEnc);

  useEffect(() => {
    if (leadId) {
      dispatch(getLeadmanagementFeatureById({ _id: leadId }))
    }
  }, [leadId]);
  useEffect(() => {
    if (LeadmanagementFeatureByIdData) {
      LeadeManagementFollowupListFunction()
    }
  }, [LeadmanagementFeatureByIdData])

  const getStatusTag = (status) => {
    switch (status) {
      case 'New':
        return <Tag color="blue">New</Tag>;
      case 'Contacted':
        return <Tag color="green">Contacted</Tag>;
      case 'Qualified':
        return <Tag color="orange">Qualified</Tag>;
      case 'Lost':
        return <Tag color="red">Lost</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString).format('DD MMM YYYY, hh:mm A');
  };

  if (LeadmanagementFeatureLoading) {
    return (
      <GlobalLayout>
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </GlobalLayout>
    );
  }

  if (!LeadmanagementFeatureByIdData) {
    return (
      <GlobalLayout>
        <Empty description="No lead data found" />
      </GlobalLayout>
    );
  }

  const LeadeManagementFollowupListFunction = () => {
    const reqdata = {
      "companyId": LeadmanagementFeatureByIdData?.companyId || "",
      "directorId": LeadmanagementFeatureByIdData?.directorId || "",
      "branchId": LeadmanagementFeatureByIdData?.branchId || "",
      "leadId": leadId,
      "startDate": null,
      "endDate": null,
      "text": "",
      "sort": true,
      "status": "",
      "isPagination": false

    }
    dispatch(LeadmanagementFollowupcommentListFunc(reqdata))
  }

  const {
    name,
    email,
    mobile,
    location,
    remark,
    intrested,
    source,
    followUpDate,
    status,
    createdAt,
    updatedAt,
    userData,
    categoryName,
    subCategoryName
  } = LeadmanagementFeatureByIdData;


  return (
    <GlobalLayout>
      <div className="gap-4 ">
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Descriptions
                title="Basic Information"
                bordered
                column={1}
                size="small"
              >
                <Descriptions.Item label="Name">{name || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Email">{email || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Mobile">
                  {mobile?.number ? `${mobile.code} ${mobile.number}` : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {location || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {status ? getStatusTag(status) : 'N/A'}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Descriptions
                title="Lead Details"
                bordered
                column={1}
                size="small"
              >
                <Descriptions.Item label="Category">
                  {categoryName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Source">{source || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Sub Category">
                  {subCategoryName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Interested In">
                  {intrested || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div className="flex-1">
              <Descriptions
                title="Follow-up Information"
                bordered
                column={1}
                size="small"
              >
                {/* <Descriptions.Item label="Follow-up Date">
                  {followUpDate ? formatDate(followUpDate) : 'N/A'}
                </Descriptions.Item> */}
                <Descriptions.Item label="Assigned To">
                  {userData?.fullName ? (
                    <div>
                      <Text strong>{userData.fullName}</Text>
                      <br />
                      <Text type="secondary">{userData.designationName}</Text>
                      <br />
                      <Text type="secondary">{userData.departmentName}</Text>
                    </div>
                  ) : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Remarks">
                  {remark || 'N/A'}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Descriptions
                title="System Information"
                bordered
                column={1}
                size="small"
              >
                <Descriptions.Item label="Created At">
                  {createdAt ? formatDate(createdAt) : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {updatedAt ? formatDate(updatedAt) : 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </Card>
        <FollowUpList followUps={LeadmanagementFoolowupList || []} leadData={LeadmanagementFeatureByIdData} LeadmanagementFeatureLoading={LeadmanagementFeatureLoading} LeadeManagementFollowupListFunction={LeadeManagementFollowupListFunction} />


      </div>
    </GlobalLayout>
  );
}

export default ViewLeads;