import { Modal, Tooltip } from "antd";
import { encrypt } from "../../../config/Encryption";
import { useNavigate } from "react-router-dom";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsEyeFill, BsFileEarmarkPdfFill } from "react-icons/bs";
import moment from "moment";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { deleteadvance } from "./advanceFeature/_advance_reducers";
import { useEffect, useState } from "react";
import { convertIntoAmount } from "../../../constents/global";

function AdvanceModalList({ isModalOpen, onClose, getadvancerequest, advanceListData }) {

    const [listData, setListData] = useState([])
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
                dispatch(deleteadvance(reqData)).then((data) => {
                    getadvancerequest()
                });
            }
        });
    };

    useEffect(() => {
        const filterData = advanceListData?.find((item) => item?._id === isModalOpen?.data?._id)
        // setListData(isModalOpen?.type === "up" ? filterData?.deductionList : filterData?.depositList)
        setListData(filterData?.alltransections)

    }, [advanceListData])

    return (
        <>
            <Modal className="antmodalclassName" width={1000} footer={false} title={`${isModalOpen?.data?.groupName} (${isModalOpen?.data?.groupUserName}) Transactions`} open={true} onOk={handleOk} onCancel={handleCancel}>
                <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                    <thead className="">
                        <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                            <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>

                            <th className="p-2 whitespace-nowrap">payment Type</th>
                            <th className="p-2 whitespace-nowrap">Amount</th>
                            <th className="p-2 whitespace-nowrap">Date</th>
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

                                    <td className="whitespace-nowrap p-2">
                                        {/* {element?.paymentType} */}

                                        {element?.paymentType === "deduction" ? (
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
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap p-2">{convertIntoAmount(element?.amount || "-")}</td>
                                    <td className="whitespace-nowrap p-2">{moment(element?.date).format("DD/MM/YYYY")}</td>
                                    <td className="whitespace-nowrap p-2">
                                        <span className="py-1.5 flex justify-start items-center space-x-2.5">
                                            {/* <button
                            onClick={() => {
                              navigate(
                                `/admin/advance/edit/${encrypt(element?._id)}`
                              );
                            }}
                          
                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                            type="button"
                          >
                            <FaPenToSquare
                              className=" hover:text-[#337ab7] text-[#3c8dbc]"
                              size={16}
                            />
                          </button> */}

                                            {/* <Tooltip placement="topLeft"  title='Delete'>
                                                {element?.paymentType === "deposit" &&
                                                    <button
                                                        onClick={() => handleDelete(element?._id)}
                                                        className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                                        type="button"
                                                    >
                                                        <RiDeleteBin5Line
                                                            className="text-red-600 hover:text-red-500"
                                                            size={16}
                                                        />
                                                    </button>
                                                }</Tooltip> */}
                                            <Tooltip placement="topLeft"  title='View'>
                                                <button
                                                    onClick={() => {
                                                        if (element?.receiptPDFPath) {
                                                            const pdfLink = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${element?.receiptPDFPath}`;
                                                            const link = document.createElement("a");
                                                            link.href = pdfLink;
                                                            link.target = "_blank";
                                                            link.rel = "noopener noreferrer";
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        }
                                                    }}

                                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                                    type="button"
                                                >
                                                    <BsFileEarmarkPdfFill
                                                        className=" text-rose-700"
                                                        size={16}
                                                    />
                                                </button>
                                            </Tooltip>
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
        </>
    )
}

export default AdvanceModalList
