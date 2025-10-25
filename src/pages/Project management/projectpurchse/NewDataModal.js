import { Modal, Tooltip } from 'antd';
import React, { useState } from 'react';
import {
  FaEye,
  FaFilePdf,
  FaImages,
  FaIndustry,
  FaRegAddressCard,
} from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { AiOutlineMail, AiOutlineTags } from "react-icons/ai";
import dayjs from "dayjs";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer";

import { GrValidate } from "react-icons/gr";
import { TbPencilMinus } from "react-icons/tb";
import { FaPeopleGroup } from 'react-icons/fa6';

const NewDataModal = ({viewOpen , setViewOpen , projectpurchaseExpenceDetails}) => {
      const [modal, setModal] = useState({
        isOpen: false,
        data: {},
        projectpurchaseExpence: {},
      });
        const isPDF = (filename) => filename.toLowerCase().endsWith(".pdf");
  const isImage = (filename) =>
    [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"].some((ext) =>
      filename.toLowerCase().endsWith(ext)
    );
  return (
    <div>
       <Modal
          className="antmodalclassName"
          title={`Attached Docs	For ${modal?.data?.vendorData?.fullName}`}
          width={1000}
          footer={false}
          open={modal.isOpen}
          onOk={() => setModal({ open: false, data: {} })}
          onCancel={() => setModal({ open: false, data: {} })}
        >
          <table className="w-full max-w-full rounded-xl">
            <thead></thead>
            <tbody>
              <tr>
                <td className="tableData">
                  <div className="flex flex-col space-y-4">
                    {modal?.data?.attachment &&
                      Array.isArray(modal?.data?.attachment) ? (
                      modal.data.attachment.map((file, fileIndex) => {
                        const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`;

                        if (isImage(file)) {
                          return (
                            <div
                              key={fileIndex}
                              className="flex items-center gap-2"
                            >
                              <p className="font-[500] text-[12px] text-black">
                                ({fileIndex + 1})
                              </p>
                              <CommonImageViewer
                                src={url}
                                alt={`Uploaded ${fileIndex + 1}`}
                              />
                            </div>
                          );
                        } else if (isPDF(file)) {
                          return (
                            <Tooltip placement="topLeft"
                              title={`PDF Attachment ${fileIndex + 1}`}

                              key={fileIndex}
                            >
                              <div className="flex items-center gap-2">
                                <p className="font-[500] text-[12px] text-black">
                                  ({fileIndex + 1})
                                </p>
                                <button
                                  onClick={() => window.open(url, "_blank")}
                                  className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted hover:border-gray-800"
                                  type="button"
                                >
                                  <FaFilePdf
                                    className="text-red-600 hover:text-red-700"
                                    size={26}
                                  />
                                </button>
                              </div>
                            </Tooltip>
                          );
                        } else {
                          return null;
                        }
                      })
                    ) : modal?.data?.attachment ? (
                      (() => {
                        const file = modal.data.attachment;
                        const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`;

                        if (isImage(file)) {
                          return (
                            <CommonImageViewer src={url} alt="Uploaded Image" />
                          );
                        } else if (isPDF(file)) {
                          return (
                            <Tooltip placement="topLeft" title="PDF Attachment" >
                              <button
                                onClick={() => window.open(url, "_blank")}
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted hover:border-gray-800"
                                type="button"
                              >
                                <FaFilePdf
                                  className="text-red-600 hover:text-red-700"
                                  size={26}
                                />
                              </button>
                            </Tooltip>
                          );
                        } else {
                          return null;
                        }
                      })()
                    ) : (
                      <span className="text-gray-600 text-sm text-center">
                        No File Attached
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Modal>

        <Modal
          className="antmodalclassName"
          visible={viewOpen}
          onCancel={() => setViewOpen(false)}
          footer={null}
          title={false}
          width={1200}
          height={600}
        >
          <div className="w-full overflow-auto">
            <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
              <thead>
                <tr>
                  <th className="text-header ">
                    <div className="mt-2 ml-2">Purchase Expanse Details</div>
                  </th>
                </tr>
              </thead>
              {/* dfvdbdfb */}

              <tbody className="text-sm text-gray-700">
    
                <tr className=" hover:bg-indigo-50">
                  <td className="p-3  text-gray-600">
                    <div className="flex items-center gap-2">
                      <AiOutlineTags className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        purchaseDate
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {dayjs(projectpurchaseExpenceDetails?.date).format(
                        "DD-MM-YYYY"
                      ) || "N/A"}
                    </span>
                  </td>

                  <td className="p-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <IoPersonSharp className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        vendor Name
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {projectpurchaseExpenceDetails?.vendorName || "N/A"}
                    </span>
                  </td>
                </tr>

                <tr className=" hover:bg-indigo-50">
                  <td className="p-3  text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaPeopleGroup className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Total Amount
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {projectpurchaseExpenceDetails?.totalAmount || "N/A"} Rs
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <IoPersonSharp className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Expence Head
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {projectpurchaseExpenceDetails?.expenseHeadName || "N/A"}
                    </span>
                  </td>

                
                </tr>
               
                <tr className=" hover:bg-indigo-50">
                  <td className="p-3  text-gray-600">
                    <div className="flex flex-col justify-start items-start gap-2">
                      {/* <FaRegAddressCard className="size-4 text-header text-lg" /> */}
                      <span
                        onClick={() =>
                          projectpurchaseExpenceDetails?.attachment?.length > 0 &&
                          setModal({
                            isOpen: true,
                            data: projectpurchaseExpenceDetails,
                            purchaseExpence: {},
                          })
                        }
                        className={`flex items-center ${projectpurchaseExpenceDetails?.attachment?.length > 0
                            ? "text-rose-700 hover:text-rose-700"
                            : "text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        <FaImages
                          className="mr-2"
                          size={16}
                        />
                        View Document
                      </span>
                    </div>

                  </td>


                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
    </div>
  );
};

export default NewDataModal;