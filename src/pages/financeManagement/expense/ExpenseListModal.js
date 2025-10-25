import { Modal } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { encrypt } from "../../../config/Encryption";
import { BiEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { convertIntoAmount } from "../../../constents/global";

function ExpenseListModal({ isModalOpen, onClose, handleDelete, expenseListData }) {

  const [listData, setListData] = useState([])
  const navigate = useNavigate()
  const handleOk = () => {
    onClose()
  };
  const handleCancel = () => {
    onClose()
  };
  useEffect(() => {
    const newRecors = expenseListData?.find((data) => data?._id == isModalOpen?.data?._id)
    setListData(newRecors?.records)
  }, [isModalOpen, expenseListData])

  return (
    <>
      <Modal className="antmodalclassName" width={1000} footer={false} title={`${isModalOpen?.data?.clientName} - expenses`} open={isModalOpen?.isOpen} onOk={handleOk} onCancel={handleCancel}>
        <table className="w-full max-w-full rounded-xl overflow-x-auto ">
          <thead className="">
            <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
              <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
              {/* <th className="p-2 whitespace-nowrap"> Name</th> */}
              <th className="p-2 whitespace-nowrap">Date</th>
              <th className="p-2 whitespace-nowrap">Amount</th>
              <th className="p-2 whitespace-nowrap">Payment Mode</th>
              <th className="p-2 whitespace-nowrap">Employee Name / Transaction No</th>
              <th className="p-2 whitespace-nowrap">Created At </th>
              <th className="p-2 whitespace-nowrap">Created By</th>
              <th className="p-2 whitespace-nowrap">Action</th>
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

                  <td className="whitespace-nowrap p-2">{moment(element?.date).format("DD/MM/YYYY")}</td>
                  <td className="whitespace-nowrap p-2">{convertIntoAmount(element?.totalAmount || "-")}</td>
                  <td className="whitespace-nowrap p-2">{element?.paymentMode}</td>
                  <td className="whitespace-nowrap p-2">{element?.paymentMode === "cash" ? element?.employeName : `${element?.bankData?.bankName}/${element?.bankData?.bankholderName}/${element?.transactionNo}`}</td>
                  <td className="whitespace-nowrap p-2">{element?.createdAt ? moment(element?.createdAt).format("DD-MM-YYYY hh:mm A") : "-"}</td>
                  <td className="whitespace-nowrap p-2">{element?.createdBy}</td>
                  <td className="whitespace-nowrap p-2">
                    {!["check", "cash", "bank"].includes(element?.paymentMode) && <button
                      onClick={() => {
                        navigate(`/admin/expense/edit/${encrypt(element?._id)}`);
                      }}
                      className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                      type="button"
                    >
                      <BiEdit
                        className="text-header hover:text-header"
                        size={16}
                      />
                    </button>}
                    {!["check", "cash", "bank"].includes(element?.paymentMode) &&
                      <button
                        onClick={() => handleDelete(element?._id)}
                        className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                        type="button"
                      >
                        <RiDeleteBin5Line
                          className="text-red-600 hover:text-red-500"
                          size={16}
                        />
                      </button>}

                  </td>


                </tr>
              ))
            ) : (
              <tr className="bg-white bg-opacity-5">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  Record Not Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>


    </>
  )
}

export default ExpenseListModal
