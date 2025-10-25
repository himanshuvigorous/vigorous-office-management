// import moment from 'moment';
// import React from 'react';

// const IDCardlayout = ({onBoardingDetailsData , cardRef}) => {
//   return (
//     <div ref={cardRef} className="w-[500px] rounded-xl bg-gradient-to-br from-[#074173] to-[#0a5a8a] text-white font-sans shadow-lg overflow-hidden relative">
//     {/* Card Header */}
//     <div className="bg-black/20 px-5 py-3 flex justify-between items-center">
//       <h1 className="text-base font-bold truncate max-w-[70%]">
//         {onBoardingDetailsData?.companyData?.fullName}
//       </h1>
//       <div className="bg-amber-400 text-header px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">
//         ID: {onBoardingDetailsData?.employeData?.userName || 'N/A'}
//       </div>
//     </div>

//     {/* Card Body */}
//     <div className="p-4 flex gap-4 bg-cover bg-center"
//       style={{
//         backgroundImage: `url('/images/5883168_430.jpg')`,
//       }}
//     >
//       {/* Employee Photo - 3:4 aspect ratio */}
//       <div className="flex flex-col items-center">
//         <div className="w-24 h-32 rounded-md border-2 border-white overflow-hidden shadow-md">
//           <img
//             className="w-full h-full object-cover"
//             src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${onBoardingDetailsData?.profileImage}`}
//             alt="Employee"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = '/default-profile.png';
//             }}
//           />
//         </div>
//       </div>

//       {/* Employee Info */}
//       <div className="flex-1 min-w-0 space-y-1.5">
//         <h2 className="text-lg font-bold mb-1.5 pb-1 border-b border-white/30 break-words">
//           {onBoardingDetailsData?.fullName}
//         </h2>

//         <div className="flex flex-wrap text-xs">
//           <span className="font-semibold w-24">Department:</span>
//           <span className="flex-1 min-w-0 break-words">
//             {onBoardingDetailsData?.departmentData?.name}
//           </span>
//         </div>

//         <div className="flex flex-wrap text-xs">
//           <span className="font-semibold w-24">Designation:</span>
//           <span className="flex-1 min-w-0 break-words">
//             {onBoardingDetailsData?.designationData?.name}
//           </span>
//         </div>

//         <div className="flex flex-wrap text-xs">
//           <span className="font-semibold w-24">Gender:</span>
//           <span className="flex-1 min-w-0">
//             {onBoardingDetailsData?.generalInfo?.gender}
//           </span>
//         </div>

//         <div className="flex flex-wrap text-xs">
//           <span className="font-semibold w-24">Date of Birth:</span>
//           <span className="flex-1 min-w-0">
//             {onBoardingDetailsData?.generalInfo?.dateOfBirth ?
//               moment(onBoardingDetailsData?.generalInfo?.dateOfBirth).format("DD-MM-YYYY") : "N/A"}
//           </span>
//         </div>

//         <div className="flex flex-wrap text-xs">
//           <span className="font-semibold w-24">Date of Joining:</span>
//           <span className="flex-1 min-w-0">
//             {onBoardingDetailsData?.generalInfo?.dateOfJoining ?
//               moment(onBoardingDetailsData?.generalInfo?.dateOfJoining).format("DD-MM-YYYY") : "N/A"}
//           </span>
//         </div>

//         <div className="flex flex-wrap text-xs">
//           <span className="font-semibold w-24">Email:</span>
//           <span className="flex-1 min-w-0 break-all">
//             {onBoardingDetailsData?.email}
//           </span>
//         </div>

//         <div className="flex flex-wrap text-xs">
//           <span className="font-semibold w-24">Mobile:</span>
//           <span className="flex-1 min-w-0">
//             {onBoardingDetailsData?.mobile?.code + onBoardingDetailsData?.mobile?.number}
//           </span>
//         </div>
//       </div>
//     </div>

//     {/* Card Footer */}
//     <div className="bg-black/15 px-4 py-2 text-center">
//       <div className="text-xs break-words leading-tight">
//         {[
//           onBoardingDetailsData?.addresses?.primary?.street,
//           onBoardingDetailsData?.addresses?.primary?.city,
//           onBoardingDetailsData?.addresses?.primary?.state,
//           `${onBoardingDetailsData?.addresses?.primary?.country} - ${onBoardingDetailsData?.addresses?.primary?.pinCode}`
//         ].filter(Boolean).join(', ')}
//       </div>
//     </div>
//   </div>
//   );
// };

// export default IDCardlayout;













import moment from 'moment';
import React from 'react';

const IDCardLayout = ({ onBoardingDetailsData, cardRef }) => {
  const userData = JSON.parse(localStorage.getItem('user_info_ca-admin'));
  const imageUrl = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${userData?.companyProfileImg}` ;

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[350px] bg-white shadow-lg border rounded-lg overflow-hidden" ref={cardRef}>
        
        {/* Top Section */}
        <div className="relative h-[200px] w-full max-w-[350px] mx-auto overflow-hidden">
          <div className="absolute bottom-0 top-0 rotate-180 left-0 right-0 h-[50px] bg-[#FB880B] rounded-t-full z-10"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[70%] h-[200px] bg-[#10395C] rounded-b-[90%] z-20 flex flex-col items-center pt-4">
            {/* Company Logo */}
            <div className="bg-white p-1 rounded shadow-sm flex justify-center items-center">
  <img
    src={imageUrl}
    alt="Company Logo"
    className="h-10 md:h-12 object-contain max-w-[80%]"
  />
</div>

            {/* Employee Profile Image */}
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-md mt-2">
              <img
                src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${onBoardingDetailsData?.profileImage}`}
                alt="Employee"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-profile.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="px-4 py-3 bg-white">
          {/* Employee Name */}
          <div className="mb-2 text-center">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide break-words line-clamp-2">
              {onBoardingDetailsData?.fullName || 'N/A'}
            </h2>
            <div className="text-[#10395C] text-sm font-semibold mt-1 truncate">
              {onBoardingDetailsData?.designationData?.name || 'N/A'}
            </div>
          </div>

          {/* Employee ID */}
          <div className=" bg-header text-white py-1 px-3 rounded-full  mx-auto flex justify-center">
            <span className="text-xs font-bold tracking-wider truncate">
             Employee ID: {onBoardingDetailsData?.employeData?.userName || 'N/A'}
            </span>
          </div>

          {/* Details Grid - Adjusted for better email handling */}
          <div className="grid grid-cols-1 gap-1.5 text-sm">
            {[
              { 
                label: 'Department', 
                value: onBoardingDetailsData?.departmentData?.name || 'N/A',
                className: 'truncate'
              },
              { 
                label: 'Gender', 
                value: onBoardingDetailsData?.generalInfo?.gender || 'N/A'
              },
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
                className: 'break-all text-xs' // Special handling for email
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
                  <span className="text-gray-600 font-medium text-xs">
                    {item.label}
                  </span>
                </div>
                <span className="text-gray-600 mx-1 text-xs">:</span>
                <div className="flex-1 min-w-0">
                  <span className={`text-gray-800 font-semibold text-xs ${item.className || ''}`}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address Footer */}
        <div className="bg-[#FB880B] py-2 px-3 text-center">
          <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
            {[
              onBoardingDetailsData?.addresses?.primary?.street,
              onBoardingDetailsData?.addresses?.primary?.city,
              onBoardingDetailsData?.addresses?.primary?.state,
              onBoardingDetailsData?.addresses?.primary?.country,
              onBoardingDetailsData?.addresses?.primary?.pinCode,
            ].filter(Boolean).join(', ')}
          </p>
        
        </div>
      </div>
    </div>
  );
};

export default IDCardLayout;
