import React, { useState } from "react";
import { Modal, Select, message } from "antd";
import axios from "axios";
import { inputAntdSelectClassName } from "../../../constents/global";
import { useDispatch } from "react-redux";
import { companySubscriptionStatus, subscriptionFunc } from "./companyFeatures/_company_reducers";

const { Option } = Select;

const SUBSCRIPTION_STATUS_CANCELED = "cancel";
const SUBSCRIPTION_STATUS_PAUSE_RESUME = "pause_resume";
const SUBSCRIPTION_STATUS_ARR = [
  SUBSCRIPTION_STATUS_CANCELED,
  SUBSCRIPTION_STATUS_PAUSE_RESUME,
];

const SUBSCRIPTION_TYPE_IMMEDIATE = "immidate"; 
// const SUBSCRIPTION_TYPE_EOC = "end_of_cycle"; // Uncomment this in future if needed
const SUBSCRIPTION_TYPE_PAUSE = "pause";
const SUBSCRIPTION_TYPE_RESUME = "resume";

const SUBSCRIPTION_TYPE_OPTIONS = {
  [SUBSCRIPTION_STATUS_CANCELED]: [
    SUBSCRIPTION_TYPE_IMMEDIATE,
    // SUBSCRIPTION_TYPE_EOC, // Uncomment this in the future if needed
  ],
  [SUBSCRIPTION_STATUS_PAUSE_RESUME]: [
    SUBSCRIPTION_TYPE_PAUSE,
    SUBSCRIPTION_TYPE_RESUME,
  ],
};

const LABEL_MAP = {
  cancel: "Cancel",
  pause_resume: "Pause / Resume",
  immidate: "Immediate",
  // end_of_cycle: "End of Cycle",
  pause: "Pause",
  resume: "Resume",
};

const SubscriptionModal = ({ subscriptionId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleStatusChange = (value) => {
    setStatus(value);
    setType(""); // Reset type when status changes
  };

  const handleOk = async () => {
    if (!status || !type) {
      message.warning("Please select both status and type.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(companySubscriptionStatus({
        subscriptionId: subscriptionId,
        status: status,
        type: type,
      })).then((data) => {
        if (!data?.error) {
          dispatch(subscriptionFunc({ subscriptionId }));
          setIsModalOpen(false);
          setStatus("");
          setType("");
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTypeOptions = () => {
    return SUBSCRIPTION_TYPE_OPTIONS[status] || [];
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-2 py-1 bg-cyan-800 text-white rounded font-semibold"
      >
        Change
      </button>

      <Modal
        title="Update Subscription"
        className="antmodalclassName"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {setIsModalOpen(false);setStatus('') ; setType('')}}
        confirmLoading={loading}
        okText="Submit"
      >
        <div style={{ marginBottom: 16 }}>
          <label>Status:</label>
          <Select
            value={status || undefined}
            onChange={handleStatusChange}
            placeholder="Select subscription status"
            getPopupContainer={(trigger) => trigger.parentNode}
            className={`${inputAntdSelectClassName} border-2`}
            style={{ width: "100%" }}
          >
            {SUBSCRIPTION_STATUS_ARR.map((statusOption) => (
              <Option key={statusOption} value={statusOption}>
                {LABEL_MAP[statusOption] || statusOption}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label>Type:</label>
          <Select
            value={type || undefined}
            onChange={setType}
            placeholder="Select subscription type"
            getPopupContainer={(trigger) => trigger.parentNode}
            className={`${inputAntdSelectClassName} border-2`}
            style={{ width: "100%" }}
            disabled={!status}
          >
            {getFilteredTypeOptions().map((typeOption) => (
              <Option key={typeOption} value={typeOption}>
                {LABEL_MAP[typeOption] || typeOption}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default SubscriptionModal;
