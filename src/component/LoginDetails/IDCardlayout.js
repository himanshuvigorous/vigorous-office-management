import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { domainName } from '../../constents/global';

const IDCardLayout = ({ onBoardingDetailsData, cardRef }) => {
  const { user } = useSelector(state => state.authentication);
  const userDetails =
    user?.userinfo?.data?.rowData ||
    JSON.parse(localStorage.getItem('user_Profile'));
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));

  const imageUrl = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${userInfoglobal?.logo}`;
  const profileImageUrl = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${userDetails?.profileImage}`;

  return (
    <div className="w-full flex items-center justify-center ">
      <div
        className="w-full max-w-[350px] bg-white shadow-lg border-2 border-header rounded-lg overflow-hidden"
        ref={cardRef}
        style={{ width: '350px', boxSizing: 'border-box' }}
      >
        {/* Top */}
        <div className="relative h-[200px] w-full mx-auto overflow-hidden">
          {/* <div className="absolute bottom-0 top-0 rotate-180 left-0 right-0 h-[50px] bg-[#FB880B] rounded-t-full z-10" /> */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[70%] h-[200px] bg-transparent rounded-b-[90%] z-20 flex flex-col items-center pt-4">
            {/* Logo */}
            <div className="p-1 rounded  flex justify-center items-center">
              <img
                src={imageUrl}
                alt="Company Logo"
                className="h-10 md:h-12 object-contain max-w-[100%]"
               />
            </div>

            {/* Profile Pic */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-md mt-2">
              <img
                src={profileImageUrl}
                alt="Employee"
                className="w-full h-full object-cover"
               />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-3 bg-white" style={{ minHeight: '300px' }}>
          <div className="mb-2 text-center">
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide break-words">
              {onBoardingDetailsData?.fullName || 'N/A'}
            </h2>
            <div className="text-[#10395C] text-sm font-semibold mt-1">
              {onBoardingDetailsData?.designationData?.name || 'N/A'}
            </div>
          </div>

          <div className="relative w-full mb-3 h-8">
          <div
            className="absolute left-1/2 top-0 transform -translate-x-1/2 bg-[#10395C] rounded-full py-1 px-4"
            style={{ minWidth: '240px', textAlign: 'center' }}
          >
            <span className="text-xs font-bold text-white">
              Employee ID: {onBoardingDetailsData?.employeData?.userName || 'N/A'}
            </span>
          </div>
        </div>

          <div className="grid grid-cols-1 gap-1.5 text-sm">
            {[
              { label: 'Department', value: onBoardingDetailsData?.departmentData?.name },
              { label: 'Gender', value: onBoardingDetailsData?.generalInfo?.gender },
              {
                label: 'Date of Birth',
                value: onBoardingDetailsData?.generalInfo?.dateOfBirth
                  ? moment(onBoardingDetailsData.generalInfo.dateOfBirth).format('DD-MM-YYYY')
                  : 'N/A',
              },
              {
                label: 'Date of Joining',
                value: onBoardingDetailsData?.generalInfo?.dateOfJoining
                  ? moment(onBoardingDetailsData.generalInfo.dateOfJoining).format('DD-MM-YYYY')
                  : 'N/A',
              },
              {
                label: 'Email',
                value: onBoardingDetailsData?.email || 'N/A',
                className: 'break-all text-xs',
              },
              {
                label: 'Mobile',
                value: onBoardingDetailsData?.mobile?.number
                  ? `${onBoardingDetailsData.mobile.code || ''} ${onBoardingDetailsData.mobile.number}`
                  : 'N/A',
              },
            ].map((item, idx) => (
              <div className="flex items-start" key={idx}>
                <div className="w-28 flex-shrink-0">
                  <span className="text-gray-600 font-medium text-xs">{item.label}</span>
                </div>
                <span className="text-gray-600 mx-1 text-xs">:</span>
                <div className="flex-1 min-w-0">
                  <span className={`text-gray-800 font-semibold text-xs ${item.className || ''}`}>
                    {item.value || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address Footer */}
        <div className="bg-[#FB880B] py-2 px-3 text-center">
          <p className="text-white text-xs font-semibold ">
            {[
              onBoardingDetailsData?.addresses?.primary?.street,
              onBoardingDetailsData?.addresses?.primary?.city,
              onBoardingDetailsData?.addresses?.primary?.state,
              onBoardingDetailsData?.addresses?.primary?.country,
              onBoardingDetailsData?.addresses?.primary?.pinCode,
            ]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IDCardLayout;
