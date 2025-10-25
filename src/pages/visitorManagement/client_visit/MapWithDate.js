import { GoogleMap, Marker } from '@react-google-maps/api';
import { Modal } from 'antd';
import { AiOutlineTags } from "react-icons/ai";

const MapWithDate = ({empDetailModalData ,  empCheckInDetailModalOpen , checkIn , setEmpCheckinDetailModalOpen}) => {
  return (
      <Modal
  className="antmodalclassName sm:!w-[60%] !w-[100%] !h-[50%]"
  title={``}
  open={empCheckInDetailModalOpen}
  onCancel={() => setEmpCheckinDetailModalOpen(false)}
  footer={null}
>
  <div className="flex justify-between items-center mb-4">
    <table className="w-full rounded-lg shadow-md overflow-hidden bg-white">
      <thead>
        <tr>
          <th className="text-header">
            <div className="mt-2 ml-2">{` `}</div>
          </th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-700">
        <tr className="hover:bg-indigo-50">
          <td className="p-3 text-gray-600">
            <div className="flex items-center gap-2">
              <AiOutlineTags className="size-4 text-header text-lg" />
              <span className="text-[16px] font-medium">Address</span>
            </div>
            <span className="block text-[15px] ml-4 font-light mt-1">
              {(checkIn === 'checkin'
                ? empDetailModalData?.checkInLocation?.address
                : empDetailModalData?.checkOutLocation?.address) || 'N/A'}
            </span>
          </td>
        </tr>

     
      </tbody>
    </table>
  </div>

  <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md">
      {empDetailModalData && (
   
          <GoogleMap
            mapContainerStyle={{
  width: '100%',
  height: '400px'
}}
            center={{
              lat: checkIn === 'checkin'
                ? empDetailModalData?.checkInLocation?.latitude
                : empDetailModalData?.checkOutLocation?.latitude,
              lng: checkIn === 'checkin'
                ? empDetailModalData?.checkInLocation?.longitude
                : empDetailModalData?.checkOutLocation?.longitude
            }}
            zoom={15}
          >
            <Marker
              position={{
                lat: checkIn === 'checkin'
                  ? empDetailModalData?.checkInLocation?.latitude
                  : empDetailModalData?.checkOutLocation?.latitude,
                lng: checkIn === 'checkin'
                  ? empDetailModalData?.checkInLocation?.longitude
                  : empDetailModalData?.checkOutLocation?.longitude
              }}
            />
          </GoogleMap>

      )}
    </div>

</Modal>
  );
};

export default MapWithDate;