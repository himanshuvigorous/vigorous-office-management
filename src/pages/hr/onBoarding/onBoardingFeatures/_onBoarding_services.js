import { apiCall, apiCallForm } from "../../../../config/Http";


async function getOnBoardingList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/onboarding/list?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("onBoardinglist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/onboarding/list`);
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  }
}

async function onBoardingSearch(data) {
  try {
    const response = await apiCall("POST", "employe/onboarding/list", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function onBoardingCreate(data) {
  try {
    const response = await apiCall("POST", "employe/onboarding/create", data);
    if (response) {
      return { companyinfo: response };
    }
  } catch (error) {
    console.error("onBoarding create error:", error);
    return Promise.reject(error);
  }
}
async function importDirectOnBoarding(data) {
  try {
    const response = await apiCallForm("POST", "employe/onboarding/import", data);
    if (response) {
      return { companyinfo: response };
    }
  } catch (error) {
    console.error("onBoarding create error:", error);
    return Promise.reject(error);
  }
}

async function getOnBoardingDetails(data) {
  try {
    const response = await apiCall("POST", "employe/onboarding/detail", data);
    return response;
  } catch (error) {
    console.error("getonBoardingDetails:", error);
    return Promise.reject(error);
  }
}
async function sendEmailOnboarding(data) {
  try {
    const response = await apiCall("POST", "employe/onboarding/sendEmail", data);
    return response;
  } catch (error) {
    console.error("getonBoardingDetailsdddd:", error);
    return Promise.reject(error);
  }
}
async function sendEmailCommon(data) {
  try {
    const response = await apiCall("POST", "commonMailer", data);
    return response;
  } catch (error) {
    console.error("getonBoardingDetailsdddd:", error);
    return Promise.reject(error);
  }
}

async function updateOnBoarding(data) {
  try {
    const response = await apiCall("POST", "employe/onboarding/update", data);
    return response;
  } catch (error) {
    console.error("update onBoarding:", error);
    return Promise.reject(error);
  }
}
async function createEmployeeFromOnBoarding(data) {
  try {
    const response = await apiCall("POST", "employe/onboarding/createEmploye", data);
    return response;
  } catch (error) {
    console.error("update onBoarding:", error);
    return Promise.reject(error);
  }
}

async function deleteOnBoarding(data) {
  try {
    const response = await apiCall("POST", "employe/onboarding/delete", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}
async function statusOnBoarding(data) {
  try {
    const response = await apiCall("POST", "employe/onboarding/status", data);
    return response;
  } catch (error) {
    console.error("statuscompany:", error);
    return Promise.reject(error);
  }
}
async function employeExcelDownloadFunc(data) {
  try {
    const response = await apiCall("POST", "employe/onboarding/generateFile", data);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export const onBoardingServices = {
  getOnBoardingList,
  onBoardingSearch,
  onBoardingCreate,
  getOnBoardingDetails,
  updateOnBoarding,
  deleteOnBoarding,
  sendEmailOnboarding,
  sendEmailCommon,
  createEmployeeFromOnBoarding,
  statusOnBoarding,
  importDirectOnBoarding,
  employeExcelDownloadFunc
};
