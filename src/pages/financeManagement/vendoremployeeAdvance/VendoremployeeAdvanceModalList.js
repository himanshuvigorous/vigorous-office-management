import { Modal } from "antd";
import { encrypt } from "../../../config/Encryption";
import { useNavigate } from "react-router-dom";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsEyeFill, BsFileEarmarkPdfFill } from "react-icons/bs";
import moment from "moment";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { deletevendoremployeeAdvance } from "./vendoremployeeAdvanceFeature/_vendoremployeeAdvance_reducers";
import { useEffect, useState } from "react";
import { FaImages } from "react-icons/fa";
import { convertIntoAmount } from "../../../constents/global";

function VendoremployeeAdvanceModalList({ isModalOpen, onClose, getvendoremployeeAdvancerequest, vendoremployeeAdvanceListData }) {

  const [listData, setListData] = useState([])
  const [viewAttachment, setViewAttachment] = useState(false)
  const [viewAttachmentData, setViewAttachmentData] = useState([])

  const dispatch = useDispatch();
  const handleOk = () => {
    onClose()
  };
  const handleCancel = () => {
    onClose()
  };
  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
      zIndex: 1580
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletevendoremployeeAdvance(reqData)).then((data) => {
          getvendoremployeeAdvancerequest()
        });
      }
    });
  };

  useEffect(() => {
    setListData(isModalOpen?.data?.alltransections)
  }, [vendoremployeeAdvanceListData])

  return (
    <>
      <Modal  className="antmodalclassName" width={1000} footer={false} title={`${isModalOpen?.data?.fullName} - Transactions`} open={true} onOk={handleOk} onCancel={handleCancel}>
        <table className="w-full max-w-full rounded-xl overflow-x-auto ">
          <thead className="">
            <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
              <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
              {/* <th className="p-2 whitespace-nowrap"> Name</th> */}
              <th className="p-2 whitespace-nowrap">payment Type</th>
              <th className="p-2 whitespace-nowrap">payment Mode</th>
              <th className="p-2 whitespace-nowrap">payment Details</th>
              <th className="p-2 whitespace-nowrap">Amount</th>
              <th className="p-2 whitespace-nowrap">Bill Date</th>
              <th className="p-2 whitespace-nowrap">Narration</th>
              <th className="p-2 whitespace-nowrap w-[10%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {listData && listData?.length > 0 ? (
              listData?.map((element, index) => (
                <tr
                  className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                    } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                >
                  <td className="whitespace-nowrap p-2">
                    {index + 1}
                  </td>
                  {/* <td className="whitespace-nowrap p-2">{element?.fullName || element?.employeName || "-"}</td> */}
                  <td className="whitespace-nowrap p-2">{element?.paymentType === "deduction" ? (
                        <span
                          className={`${"bg-red-200 border-red-500"} border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.paymentType}
                        </span>
                      ) : (
                        <span
                          className={`${"bg-[#E0FFBE] border-green-500"} border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.paymentType}
                        </span>
                      )}</td>
                 
                  <td className="whitespace-nowrap p-2">{element?.type}</td>
                   <td className="w-[200px]  border-none p-2">
                        {(element?.type == 'bank' ? `${element?.bankData?.bankName || '-'} / ${element?.bankData?.bankholderName || '-'} / ${element?.bankData?.accountNumber || '-'}` : (element?.paymentmode == 'cash') ? element?.employeName : '') || "-"}
                      </td>
                  <td className="whitespace-nowrap p-2">{convertIntoAmount(element?.amount)}</td>
                  <td className="whitespace-nowrap p-2">{moment(element?.date).format("DD/MM/YYYY")}</td>
                  <td className="whitespace-nowrap p-2">{element?.naration || "-"}</td>
                  <td className="whitespace-nowrap p-2">
                    <span className="py-1.5 flex justify-start items-center space-x-2.5">
                      <button
                        onClick={() => {
                          setViewAttachment(true)
                          setViewAttachmentData(element?.attachment)
                        }}
                        disabled={element?.attachment?.length>0 ? false : true}
                        className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                        type="button"
                      >
                        <FaImages
                          className={element?.attachment?.length>0 ? " text-rose-700": "text-gray-400"}
                          size={16}
                        />
                      </button>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white bg-opacity-5">
                <td
                  colSpan={5}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  Record Not Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>
      <Modal
      className="antmodalclassName"
        visible={viewAttachment}
        onCancel={() => {
          setViewAttachment(false)
          setViewAttachmentData([])
        }}
        footer={null}
        width='800px'
        destroyOnClose
      >
        <div className="flex gap-2 flex-wrap mt-4">
          {viewAttachmentData?.map((filePath, index) => {
            const fileExtension = filePath.split('.').pop().toLowerCase();
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
            const isPdf = fileExtension === 'pdf';

            return (
              <div key={index} style={{ flex: '1 1 calc(33.333% - 10px)', marginBottom: '20px' }}>
                {isImage ? (
                  // If it's an image, show the image
                  <a
                    href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                      alt={`attachment-${index}`}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  </a>
                ) : isPdf ? (<a
                  href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div style={{ width: '100%', height: '400px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                    <iframe
                      src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                      title={`attachment-${index}`}
                      style={{ width: '100%', height: '100%' }}
                    ></iframe>
                  </div>
                </a>
                ) : (
                  <p>Unsupported file type</p>
                )}
              </div>
            );
          })}
        </div>
      </Modal>

    </>
  )
}

export default VendoremployeeAdvanceModalList
