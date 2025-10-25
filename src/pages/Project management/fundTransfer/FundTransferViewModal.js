import React from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { FaRegFile } from "react-icons/fa";
import { convertIntoAmount } from "../../../constents/global";

function FundTransferViewModal({ visible, onClose }) {
  const { fundTransferDetails } = useSelector((state) => state.fundTransfer);

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      title={<div className="text-xl font-bold text-header">Fund Transfer Details</div>}
      width={800}
      className="antmodalclassName"
    >
      {fundTransferDetails && (
        <div className="w-full overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Transfer Information</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Transfer Type:</span>
                  <span className="text-sm font-semibold capitalize">
                    {fundTransferDetails?.transferCatagoryType || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Amount:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {convertIntoAmount(fundTransferDetails?.amount)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <span className="text-sm">
                    {dayjs(fundTransferDetails?.date).format("DD-MM-YYYY") || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">UTR Number:</span>
                  <span className="text-sm font-mono">
                    {fundTransferDetails?.UTRNumber || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Sender Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Sender Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <p className="text-sm mt-1">{fundTransferDetails?.senderName || "N/A"}</p>
                </div>

                {fundTransferDetails?.senderBankAccData && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Bank:</span>
                      <p className="text-sm mt-1">{fundTransferDetails?.senderBankAccData?.bankName || "N/A"}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">Account Number:</span>
                      <p className="text-sm mt-1 font-mono">
                        {fundTransferDetails?.senderBankAccData?.accountNumber || "N/A"}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">IFSC Code:</span>
                      <p className="text-sm mt-1 font-mono">
                        {fundTransferDetails?.senderBankAccData?.ifscCode || "N/A"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Receiver Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Receiver Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <p className="text-sm mt-1">{fundTransferDetails?.receiverName || "N/A"}</p>
                </div>

                {fundTransferDetails?.receiverBankAccData && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Bank:</span>
                      <p className="text-sm mt-1">{fundTransferDetails?.receiverBankAccData?.bankName || "N/A"}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">Account Number:</span>
                      <p className="text-sm mt-1 font-mono">
                        {fundTransferDetails?.receiverBankAccData?.accountNumber || "N/A"}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">IFSC Code:</span>
                      <p className="text-sm mt-1 font-mono">
                        {fundTransferDetails?.receiverBankAccData?.ifscCode || "N/A"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Narration:</span>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded border">
                    {fundTransferDetails?.naration || "No narration provided"}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${fundTransferDetails?.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {fundTransferDetails?.status ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Created At:</span>
                  <span className="text-sm">
                    {dayjs(fundTransferDetails?.createdAt).format("DD-MM-YYYY HH:mm") || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {fundTransferDetails?.attechment?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Attachments</h3>
                <div className="space-y-2">
                  {fundTransferDetails?.attechment?.map((file, index) => (
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

export default FundTransferViewModal;