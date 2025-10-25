import Swal from "sweetalert2";
import { encrypt } from "../config/Encryption";
import moment from "moment";
import dayjs from "dayjs";

export const domainName = "ca-admin";
export const userTypeglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`))?.userType;
export const global = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
// export const userTypeglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`))?.rawData?.userType;







export const inputClassName =
  "mt-1 block w-full px-2 py-[12px] rounded-[5px] border-[1px] text-sm   bg-white focus:outline-none  ";
export const inputAntdSelectClassName = "inputAntdSelectClassName "
// "mt-1 block w-full px-2 !py-[22px] shadow-sm rounded-xl text-sm   bg-white focus:outline-none";
export const inputAntdSelectClassNameDisabled =
  "mt-1 block w-full px-2 !py-[22px] rounded-[5px] border-[1px] text-sm   bg-gray-200 focus:outline-none";
export const inputAntdSelectClassNameFilter =
  "inputAntdSelectClassNameFilter";
export const inputerrorClassNameAutoComplete =
  "text-red-500 text-sm mt-[10px]";
export const inputerrorClassName =
  "text-red-500 text-sm ";
export const inputClassNameSearch =
  "mt-1 block w-full px-2 py-[8px] shadow-sm rounded-[10px] text-xs   bg-white focus:outline-none min-w-[150px]";
export const inputDisabledClassName =
  "mt-1 block w-full px-2 py-[12px] rounded-[5px] border-[1px] text-sm   bg-gray-200 focus:outline-none";
export const inputLabelClassName =
  "!text-[#5e6366] !text-sm md:!py-2 !font-normal  !mb-0";
export const inputLabelClassNameReactSelect =
  "mt-1 block w-full px-2 py-[0.7px]  rounded-[5px] border-[1px] text-sm   bg-white focus:outline-none";
export const inputLabelClassNameReactSelectTable =
  "mt-1 block w-full px-2   rounded-[5px] border-[1px] text-xs   bg-white focus:outline-none";
export const formButtonClassName =
  "bg-header text-sm text-white py-2 px-3 rounded mt-4";
export const formButtonClassNameDisabled =
  "bg-gray-700 text-sm text-white py-2 px-3 rounded mt-4";
export const inputCalanderClassName =
  "w-full block  mt-2 rounded-[5px] border-[1px] text-sm  bg-white focus:outline-none placeholder:text-gray-500 placeholder:text-lg";








// export const inputCalanderClassName =
// "mt-1 block w-full  px-2 py-[10px] z-[1000] shadow-sm rounded-xl text-sm   bg-white focus:outline-none placeholder:text-gray-500 placeholder:text-lg";
export const usertypelist = [
  "admin",
  "company",
  "companyDirector",
  "companyBranch",
  "staff",
  "client",
];
export const organizationTypes = [
  "Startup",
  "Enterprise",
  "Nonprofit",
  "Public",
  "Private",
  "Government",
  "Family-owned",
  "Corporation",
];

export const customStylesSelect = {
  control: (base, state) => ({
    ...base,
    width: "100%",
    padding: "6px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    borderColor: "none",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    fontSize: "14px",
    marginTop: "0.25rem",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
        ? "#f3f4f6"
        : "white",
    color: state.isSelected ? "white" : "black",
    padding: "10px",
    fontSize: "14px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#5e6366",
    fontSize: "14px",
  }),
};

export const formatAddress = (address) => {
  if (!address) return '';
  const { street, city, state, country, pinCode } = address;
  return `${street || ''}, ${city || ''}, ${state || ''}, ${country || ''}, ${pinCode || ''}`;
}



const APPLICATION_STATUS_APPLIED = "Applied"
const APPLICATION_STATUS_HOLD = "Hold"
const APPLICATION_STATUS_SHORTLISTED = "Shortlisted"
const APPLICATION_STATUS_REJECTED = "Rejected"
const APPLICATION_STATUS_HIRED = "Hired"
export const APPLICATION_STATUS_ARR = [
  APPLICATION_STATUS_APPLIED,
  APPLICATION_STATUS_HOLD,
  APPLICATION_STATUS_SHORTLISTED,
  APPLICATION_STATUS_REJECTED,
  APPLICATION_STATUS_HIRED
]


export function convertMinutesToHoursAndMinutes(minutes) {
  // Check if the minutes are zero or undefined
  if (minutes === 0 || minutes === "0.00" || minutes === "0" || !minutes) return "-";

  const hours = Math.floor(minutes / 60); // Calculate hours
  const remainingMinutes = minutes % 60; // Calculate remaining minutes

  // Format the result as "hh:mm"
  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
}


export const pageSizeLead = [10, 25, 50, 100]
export const pazeSizeReport = [2, 5, 10, 20, 30, 40, 50]
export const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = resolve;
      // script.onerror = reject;
      document.head.appendChild(script);
    }
  });
};



export const handleSortLogic = (key, order, list) => {
  if (!key) return list;
  if (!list) return []

  const sortedList = [...list];
  const isAscending = order === 'asc';

  sortedList?.sort((a, b) => {
    const aValue = getValueByKey(a, key);
    const bValue = getValueByKey(b, key);
    const compareValue = (valueA, valueB) => {
      if (valueA < valueB) return isAscending ? -1 : 1;
      if (valueA > valueB) return isAscending ? 1 : -1;
      return 0;
    };

    return compareValue(aValue, bValue);
  });

  return sortedList;
};

const getValueByKey = (obj, key) => {
  const keys = key.split('.');
  return keys.reduce((acc, currentKey) => {
    return acc && acc[currentKey] !== undefined ? acc[currentKey] : null;
  }, obj);
};




// export const getLocationDataByPincode = async (pincode) => {
//   const googleAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${googleAPIKey}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.status === "OK") {
//       const result = data.results[0];

//       let country = "";
//       let state = "";
//       let city = "";

//       // Loop through address components to extract country, state, and city
//       result.address_components.forEach((component) => {


//         if (component.types.includes("country")) {
//           country = component.long_name;
//         }
//         if (component.types.includes("administrative_area_level_1")) {
//           state = component.long_name;
//         }
//         if (component.types.includes("administrative_area_level_3")) {
//           city = component.long_name;
//         }
//       });

//       return { country, state, city };
//     } else {
//       throw new Error("Unable to fetch location data");
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     // return { country: "", state: "", city: "" };
//   }
// };

export const getLocationDataByPincode = async (pincode) => {
  const googleAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // For Indian pincodes, we can use a more specific approach
  const isIndianPincode = /^\d{6}$/.test(pincode);

  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${googleAPIKey}`;

  // Add region bias for Indian pincodes to prioritize Indian results
  if (isIndianPincode) {
    url += '&region=in';
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const result = data.results[0];

      let country = "";
      let state = "";
      let city = "";
      let district = "";
      let postalTown = "";

      // Loop through address components to extract location data
      result.address_components.forEach((component) => {
        if (component.types.includes("country")) {
          country = component.long_name;
        }

        // For Indian addresses, prioritize administrative_area_level_1 for state
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }

        // Multiple ways to identify city in different regions
        if (component.types.includes("locality")) {
          city = component.long_name;
        }

        // For some Indian addresses, postal_town might be more accurate
        if (component.types.includes("postal_town")) {
          postalTown = component.long_name;
        }

        // Administrative level 2 often represents district in India
        if (component.types.includes("administrative_area_level_2")) {
          district = component.long_name;
        }

        // Administrative level 3 can also represent city/town
        if (component.types.includes("administrative_area_level_3") && !city) {
          city = component.long_name;
        }
      });

      // Prioritize city detection for Indian addresses
      if (isIndianPincode) {
        // Use postal_town if available, otherwise use locality or district
        city = postalTown || city || district;

        // If we still don't have a city, try to extract from formatted address
        if (!city) {
          const addressParts = result.formatted_address.split(',');
          if (addressParts.length > 1) {
            city = addressParts[0].trim();
          }
        }
      }

      // Additional validation for Indian addresses
      if (isIndianPincode && country !== "India") {
        console.warn(`Pincode ${pincode} returned non-Indian result. Country: ${country}`);
        // You might want to handle this case differently based on your requirements
      }

      return {
        country,
        state,
        city: city || district || postalTown,
        fullAddress: result.formatted_address,
        coordinates: result.geometry?.location
      };
    } else {
      throw new Error(`Unable to fetch location data: ${data.status}`);
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    return {
      country: "",
      state: "",
      city: "",
      fullAddress: "",
      coordinates: null
    };
  }
};

export const statusMapping = {
  'Assigned': 'Assigned',
  'Accepted': 'Accepted',
  'Pending': 'Pending',
  'Pending_at_client': 'Pending at Client',
  'Pending_at_department': 'Pending at Department',
  'Pending_at_colleague': 'Pending at Colleague',
  'Pending_at_manager': 'Pending at Manager',
  'Work_in_progress': 'Work in Progress',
  'Pending_for_approval': 'Pending for Approval',
  'Pending_for_fees': 'Pending for Fees',
  'Completed': 'Completed',
  'Task_Stop': 'Task Stopped',
  'reAssign_to_other': "Reassign to other"
};



export function transformData(data, pageRoleData) {
  const map = [];
  const userType = JSON.parse(localStorage.getItem(`user_info_${domainName}`))?.userType;

  data.forEach((element) => {
    const hasSubPages = element?.subPages && element?.subPages.length > 0;
    const pageId = element?._id;
    const matchingPermissions = pageRoleData?.permissions?.find(permission => permission.pageId === pageId);

    const permissions = ["company", "companyDirector", "companyBranch"].includes(userType)
      ? {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true
      }
      : matchingPermissions;
    if (permissions?.canCreate || permissions?.canRead || permissions?.canUpdate || permissions?.canDelete) {
      map.push({
        title: element?.name,
        icon: element?.icon,
        orderBy: element?.orderBy || 1,
        visible: true,
        role: ["company", "companyDirector", "companyBranch", "employee"],
        permissions: permissions || [],
        path: hasSubPages ? null : `${element?.slug}/${encrypt(element?._id)}`,
        submenu: hasSubPages && element?.subPages?.map((subElement) => {
          const hasSubChildPages = subElement?.subChildPages && subElement?.subChildPages.length > 0;
          const subPageId = subElement?._id;
          const matchingSubPagePermissions = pageRoleData?.permissions?.find(permission => permission.pageId === subPageId);
          const subPagePermissions = ["company", "companyDirector", "companyBranch"].includes(userType)
            ? { canCreate: true, canRead: true, canUpdate: true, canDelete: true }
            : matchingSubPagePermissions;
          return (subPagePermissions?.canCreate || subPagePermissions?.canRead || subPagePermissions?.canUpdate || subPagePermissions?.canDelete) ? {
            title: subElement?.name,
            icon: subElement?.icon,
            orderBy: subElement?.orderBy || 1,
            role: ["company", "companyDirector", "companyBranch", "employee"],
            visible: true,
            permissions: subPagePermissions || [],
            path: hasSubChildPages ? null : `${subElement?.slug}/${encrypt(subElement?._id)}`,
            submenu: hasSubChildPages && subElement?.subChildPages?.map((subChild) => {
              const subChildId = subChild?._id;
              const matchingSubChildPermissions = pageRoleData?.permissions?.find(permission => permission.pageId === subChildId);


              const subChildPermissions = ["company", "companyDirector", "companyBranch"].includes(userType)
                ? {
                  canCreate: true,
                  canRead: true,
                  canUpdate: true,
                  canDelete: true
                }
                : matchingSubChildPermissions;

              return (subChildPermissions?.canCreate || subChildPermissions?.canRead || subChildPermissions?.canUpdate || subChildPermissions?.canDelete) ? {
                title: subChild?.name,
                icon: subChild?.icon,
                orderBy: subChild?.orderBy || 1,
                visible: true,
                role: ["company", "companyDirector", "companyBranch", "employee"],
                permissions: subChildPermissions || [],
                path: `${subChild?.slug}/${encrypt(subChild?._id)}`,
              } : null;
            }).filter(Boolean),
          } : null;
        }).filter(Boolean),
      });
    }
  });

  return map;
}
export function transformDataRole(data, pageRoleData) {
  const map = [];
  const userType = JSON.parse(localStorage.getItem(`user_info_${domainName}`))?.userType;
  data?.forEach((element) => {
    const hasSubPages = element?.subPages && element?.subPages.length > 0;
    const pageId = element?._id;
    const matchingPermissions = pageRoleData?.permissions?.find(permission => permission.pageId === pageId);

    const permissions = ["admin", "company", "companyDirector", "companyBranch", "employee"].includes(userType)
      ? {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true
      }
      : matchingPermissions;
    if (permissions?.canCreate || permissions?.canRead || permissions?.canUpdate || permissions?.canDelete) {
      map.push({
        _id: element?._id,
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
        title: element?.name,
        icon: element?.icon,
        orderBy: 1,
        visible: true,
        role: ["admin", "company", "companyDirector", "companyBranch", "employee"],
        permissions: permissions || [],
        path: hasSubPages ? null : `${element?.slug}/${encrypt(element?._id)}`,
        children: hasSubPages && element?.subPages?.map((subElement) => {
          const hasSubChildPages = subElement?.subChildPages && subElement?.subChildPages.length > 0;
          const subPageId = subElement?._id;
          const matchingSubPagePermissions = pageRoleData?.permissions?.find(permission => permission.pageId === subPageId);
          const subPagePermissions = ["admin", "company", "companyDirector", "companyBranch", "employee"].includes(userType)
            ? { canCreate: true, canRead: true, canUpdate: true, canDelete: true }
            : matchingSubPagePermissions;
          return (subPagePermissions?.canCreate || subPagePermissions?.canRead || subPagePermissions?.canUpdate || subPagePermissions?.canDelete) ? {
            _id: subElement?._id,
            canCreate: false,
            canRead: false,
            canUpdate: false,
            canDelete: false,
            title: subElement?.name,
            icon: subElement?.icon,
            orderBy: 1,
            role: ["admin", "company", "companyDirector", "companyBranch", "employee"],
            visible: true,
            permissions: subPagePermissions || [],
            path: hasSubChildPages ? null : `${subElement?.slug}/${encrypt(subElement?._id)}`,
            children: hasSubChildPages && subElement?.subChildPages?.map((subChild) => {
              const subChildId = subChild?._id;
              const matchingSubChildPermissions = pageRoleData?.permissions?.find(permission => permission.pageId === subChildId);


              const subChildPermissions = ["admin", "company", "companyDirector", "companyBranch", "employee"].includes(userType)
                ? {
                  canCreate: true,
                  canRead: true,
                  canUpdate: true,
                  canDelete: true
                }
                : matchingSubChildPermissions;

              return (subChildPermissions?.canCreate || subChildPermissions?.canRead || subChildPermissions?.canUpdate || subChildPermissions?.canDelete) ? {
                _id: subChild?._id,
                canCreate: false,
                canRead: false,
                canUpdate: false,
                canDelete: false,
                title: subChild?.name,
                icon: subChild?.icon,
                orderBy: 1,
                visible: true,
                role: ["admin", "company", "companyDirector", "companyBranch", "employee"],
                permissions: subChildPermissions || [],
                path: `${subChild?.slug}/${encrypt(subChild?._id)}`,
              } : null;
            }).filter(Boolean),
          } : null;
        }).filter(Boolean),
      });
    }
  });

  return map;
}
export const JobPostApplicationInput = "w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-lg px-4 py-2 transition duration-200 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-slate-400 shadow-sm"

export const JobPostApplicationLabel =
  "!text-header !text-sm md:!py-2 !font-normal !font-[Poppins] !mb-0";

export const optionLabelForBankSlect = (type) => {
  if (!type) return '';
  return `${type?.bankName} (${type?.branchName}) - ${type?.bankholderName} - ${type?.accountNumber}`
};

export function formatNumber(value) {
  return (Math.floor(Number(value) * 100) / 100);
}
export const correctTaskStatus = (status) => {
  return status?.replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())
}
export function getDefaultFinacialYear() {
  const today = moment();
  const currentYear = today.year();
  const aprilFirst = moment(`${currentYear}-04-01`);

  return today.isBefore(aprilFirst)
    ? `${currentYear - 1}-${currentYear}`
    : `${currentYear}-${currentYear + 1}`;
}
export function convertDays(decimalDays) {
  const fullDays = Math.floor(decimalDays);
  const isHalfDay = decimalDays - fullDays >= 0.5;
  const fullDayText = fullDays > 1 ? `${fullDays} Fulldays` : `${fullDays} Fullday`;
  const halfDayText = isHalfDay ? "and 1 Halfday" : "";
  return `${fullDayText} ${halfDayText}`.trim();
}
export const generateFinancialYearPairs = () => {
  const currentYear = new Date().getFullYear();
  const yearPairs = [];
  for (let year = currentYear - 50; year <= currentYear + 50; year++) {
    yearPairs.push(`${year}-${year + 1}`);
  }
  return yearPairs;
};
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


export const convertIntoAmount = (amount) => {
  if (amount == null || isNaN(amount)) return "0.00";
  return (Math.round(Number(amount) * 100) / 100).toFixed(2);
};



export const customDayjs = (date) => {
  if (date !== null && date !== undefined && date !== "" && dayjs(date).isValid()) {
    return dayjs(date).format('YYYY-MM-DD');
  }
  return null;
};




export const quarter = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];

export const sortByPropertyAlphabetically = (array, property = 'name', order = 'asc') => {
  if (!Array.isArray(array)) return [];

  return [...array].sort((a, b) => {

    const valueA = a?.[property]?.toString()?.toLowerCase() || '';
    const valueB = b?.[property]?.toString()?.toLowerCase() || '';

    const comparison = valueA.localeCompare(valueB);
    return order === 'asc' ? comparison : -comparison;
  });
  // return array
};




export function showSwal(message) {
  Swal.fire({
    title: false,
    text: message || 'No message provided',
    icon: false,
    confirmButtonText: 'OK',
  });
}

export const ProjectmanagementStatus = ['NotStarted', 'Working', 'OnHold', 'Completed', 'Maintenance', 'Delivered', 'ForceClosed']
export const ProjectTaskStatus = ['assigned', 'in-progress', 'completed', 'reviewed', 'done', 'rejected', 'reassign']