import { Modal, Timeline, Tag, Descriptions } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assetInventryDetails } from "./AssetTypeFeatures/_AssetType_reducers";
import Loader from "../../../../global_layouts/Loader";
import dayjs from "dayjs";

const statusColors = {
  assigned: "blue",
  returned: "green",
  retired: "orange",
  lost: "red",
  maintenance: "purple",
  damaged: "red",
  available: "green",
};

const AssetsTrailing = ({ detailsInventryModal, onClose }) => {
  const dispatch = useDispatch();
  const { assetsInventryDetailsData, loading } = useSelector(
    (state) => state.AssetType
  );

  useEffect(() => {
    if (detailsInventryModal?.data) {
      dispatch(assetInventryDetails({ _id: detailsInventryModal?.data?._id }));
    }
  }, [detailsInventryModal]);

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD MMM YYYY, hh:mm A");
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Create a sorted copy of the array instead of sorting the original
  const sortedData = assetsInventryDetailsData?.assetHistory
    ? [...assetsInventryDetailsData?.assetHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  return (
    <Modal
      open={detailsInventryModal?.isOpen}
      onCancel={() => { onClose() }}
      title="Asset Trailing History"
      width={1200}
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px' }}
      centered
      className="antmodalclassName"
      footer={null}
    >
      {loading ? <Loader /> : (
        <div>
          {sortedData.length > 0 ? (
            <Timeline mode="left">
              {sortedData.map((record) => (
                <Timeline.Item 
                  key={record._id} 
                  label={formatDate(record.createdAt)}
                  color={statusColors[record.status]}
                >
                  <div style={{ marginBottom: 16 }}>
                    <Tag color={statusColors[record.status]}>
                      {getStatusLabel(record.status)}
                    </Tag>
                    <span style={{ marginLeft: 8 }}>
                      Updated by: {record.updatedBy}
                    </span>
                    
                    <Descriptions bordered size="small" column={1} style={{ marginTop: 8 }}>
                      {record.assignDate && (
                        <Descriptions.Item label="Assign Date">
                          {dayjs(record.assignDate).format("DD MMM YYYY , hh:mm A")}
                        </Descriptions.Item>
                      )}
                      {record.returnDate && (
                        <Descriptions.Item label="Return Date">
                          {formatDate(record.returnDate)}
                        </Descriptions.Item>
                      )}
                      {record.employeName && (
                        <Descriptions.Item label="Employee">
                          {record.employeName}
                        </Descriptions.Item>
                      )}
                      {record.conditionOnAssign && (
                        <Descriptions.Item label="Condition on Assign">
                          {record.conditionOnAssign}
                        </Descriptions.Item>
                      )}
                      {record.conditionOnReturn && (
                        <Descriptions.Item label="Condition on Return">
                          {record.conditionOnReturn}
                        </Descriptions.Item>
                      )}
                      {record.remarks && (
                        <Descriptions.Item label="Remarks">
                          {record.remarks}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <div>No trailing history found for this asset</div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default AssetsTrailing;