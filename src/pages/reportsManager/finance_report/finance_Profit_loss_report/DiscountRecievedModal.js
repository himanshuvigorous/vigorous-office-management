import { Modal } from "antd";
import dayjs from "dayjs";


const DiscountRecievedModal = ({isOpen , alldata , onClose}) => {
  const data = alldata?.discountReceivedData ?? []
  return (
    <Modal 
     visible={isOpen}
      onCancel={() => {
        onClose();
      }}
      footer={null}
      title={`Discount Recieved List - ₹ ${(alldata?.discountReceivedAmount ?? 0).toFixed(2) }`}
      width={1000}
      height={400}
      className="antmodalclassName"
    >
     <div className="w-full p-1">
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>S.No.</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Payment For</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Date</span>
                  </div>
                </th>
               
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Total Amount</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Discount Amount</span>
                  </div>
                </th>
                
              </tr>
            </thead>
      
              <tbody>
                {data && data?.length > 0 ? (
                  data?.map((element, index) => (
                    <tr
                      className={`${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}
                      key={index}
                    >
                      <td className="whitespace-nowrap border-none p-2">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        { element?.type}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.date ? dayjs(element?.date).format("DD-MM-YYYY") : '-'}
                      </td>
                     
                      <td className="whitespace-nowrap border-none p-2">
                      ₹ {(element?.amount ?? 0).toFixed(2) }
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                      ₹ {(element?.discountAmount ?? 0).toFixed(2) }
                      </td>
                     
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={11}
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
  );
};

export default DiscountRecievedModal;