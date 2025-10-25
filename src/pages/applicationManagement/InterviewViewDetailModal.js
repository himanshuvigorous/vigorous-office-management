import { Modal, Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'
import { AiOutlineMail, AiOutlineTags } from 'react-icons/ai'
import { BsFileEarmarkPdfFill } from 'react-icons/bs'
import { FaIndustry, FaPhoneAlt, FaRegAddressCard } from 'react-icons/fa'
import { FaAddressBook, FaMoneyBill, FaPeopleGroup } from 'react-icons/fa6'
import { IoPersonSharp, IoTimeSharp } from 'react-icons/io5'
import { MdDateRange } from 'react-icons/md'
import { RiTimeLine } from 'react-icons/ri'

const InterviewViewDetailModal = ({ isOpen, onClose, applicationList, fetchinterviewListData, applicationId, interviewData }) => {
  if(!isOpen) return
  return (
    <Modal
    visible={isOpen}
    onCancel={onClose}
    footer={null}
    title={false}
    width={1200}
    height={600} 
    className="antmodalclassName"
    >
       <div className="w-full overflow-auto">
          <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
            <thead>
              <tr>
                <th className="text-header ">
                  <div className="mt-2 ml-2">
                    Application Details
                  </div>
                </th>
              </tr>
            </thead>
            {/* dfvdbdfb */}

            <tbody className="text-sm text-gray-700">

              <tr className=" hover:bg-indigo-50">
                <td className="p-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <IoPersonSharp className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      Name
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {interviewData?.fullName || "N/A"}
                  </span>
                </td>

                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <AiOutlineTags className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      Email
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {interviewData.email || "N/A"}
                  </span>
                </td>

              </tr>

              <tr className=" hover:bg-indigo-50">
                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaPeopleGroup className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      Gender
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {interviewData?.gender || "N/A"
                    }
                  </span>
                </td>

                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaIndustry className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      Mobile No.
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {interviewData?.mobile?.code || "N/A"
                    }{" "}{interviewData?.mobile?.number}
                  </span>
                </td>
              </tr>
              <tr className=" hover:bg-indigo-50">
                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaRegAddressCard className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      Notice Period Days
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {interviewData?.noticePeriodDays || 'N/A'}
                  </span>
                </td>

                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <AiOutlineMail className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      Profile Type
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {interviewData?.profileType || 'N/A'}
                  </span>
                </td>
              </tr>

              <tr className=" hover:bg-indigo-50">
                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaRegAddressCard className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      Previous Company Name
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {
                      interviewData?.previousCompanyName || "N/A"}
                  </span>
                </td>
                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaRegAddressCard className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      Status
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {
                      interviewData?.status || "N/A"}
                  </span>
                </td>
              </tr>

              <tr className=" hover:bg-indigo-50">

                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <MdDateRange className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      {" "}
                      Date Of Birth
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {moment(interviewData?.dateOfBirth)?.format("DD/MM/YYYY") || "N/A"}{" "}
                  </span>
                </td>
                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMoneyBill className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      {" "}
                      Expected Salary
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {
                      interviewData?.expectedSalary || "N/A"}
                  </span>
                </td>
              </tr>

              <tr className=" hover:bg-indigo-50">

                 
                 <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <RiTimeLine className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      {" "}
                      Total Experience
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {
                      interviewData?.totalExp || "N/A"}
                  </span>
                </td>
                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <IoTimeSharp className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      {" "}
                      Total Relevent Experience
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {
                      interviewData?.totalReleventExp || "N/A"}
                  </span>
                </td>
              </tr>


              <tr className=" hover:bg-indigo-50">
                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaAddressBook className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      {" "}
                      Address
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {interviewData?.address?.street || ""} ,
                    {interviewData?.address?.city || ""},
                    {interviewData?.address?.state || ""},
                    {interviewData?.address?.country || ""},
                    {interviewData?.address?.pincode || ""}
                  </span>
                </td>

                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      {" "}
                      Resume
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {
                      <Tooltip placement="topLeft"  title="Resume">
                        {" "}
                        <button
                          onClick={() => {
                            if (interviewData?.resumeUrl) {
                              const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${interviewData?.resumeUrl}`;
                              window.open(url, "_blank");
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
                      </Tooltip>}
                  </span>
                </td>

              </tr>
              <tr className=" hover:bg-indigo-50">

                <td className="p-3  text-gray-600">
                  <div className="flex items-center gap-2">
                    <MdDateRange className="size-4 text-header text-lg" />
                    <span className="text-[16px] font-medium">
                      {" "}
                     Date of Application
                    </span>
                  </div>
                  <span className="block text-[15px] ml-4 font-light mt-1">
                    {moment(interviewData?.createdAt)?.format("DD/MM/YYYY hh:mm a") || "N/A"}{" "}
                  </span>
                </td>
                
              </tr>



            </tbody>
          </table>
          <div className='w-full max-w-full overflow-x-auto'>
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                  <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                  <th className="p-2 whitespace-nowrap">Interviewer Name</th>
                  <th className="p-2 whitespace-nowrap">Round Number</th>
                  <th className="p-2 whitespace-nowrap">Position</th>
                  <th className="p-2 whitespace-nowrap">Status</th>
                  <th className="p-2 whitespace-nowrap">Feedback</th>
                  <th className="p-2 whitespace-nowrap">Type</th>

                  <th className="p-2 whitespace-nowrap">Date</th>
                  <th className="p-2 whitespace-nowrap">Updated By</th>
                  <th className="p-2 whitespace-nowrap">Updated At</th>
                  {/* <th className="p-2 whitespace-nowrap w-[10%]">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {interviewData && interviewData?.interviewData?.interviewList?.length > 0 ? (
                  interviewData?.interviewData?.interviewList?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="whitespace-nowrap p-2">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap p-2">{element?.interviewerName}</td>
                      <td className="whitespace-nowrap p-2">{element?.roundNumber}</td>
                      <td className="whitespace-nowrap p-2">{element?.interviewerPosition}</td>
                      <td className="whitespace-nowrap p-2">{element?.status}</td>
                      <td className="whitespace-nowrap p-2">{element?.feedback}</td>
                      <td className="whitespace-nowrap p-2">{element?.type}</td>

                      <td className="whitespace-nowrap p-2">{moment(element?.date).format("DD/MM/YYYY hh:mm")}</td>
                      <td className="whitespace-nowrap p-2">{element?.updateBy ?? "-"}</td>
                      <td className="whitespace-nowrap p-2">{moment(element?.updatedAt).format("DD/MM/YYYY hh:mm")}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={7}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </Modal>
 
  )
}

export default InterviewViewDetailModal