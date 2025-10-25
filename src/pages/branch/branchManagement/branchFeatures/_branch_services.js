import { decryptObject, encryptObject } from "../../../../config/Encryption";
import { apiCall, apiCallForm } from "../../../../config/Http";


async function getBranchList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `company/branch/list?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("Branchlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `company/branch/list`);
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  }
}

async function branchSearch(data) {
  const encrtptionkey = 'U2FsdGVkX19jYJ6PGxV%2BSyF3isgHYbGxHMuE4WABvdTUcBG2MvDM%2FDPbRUk0Jauq'
  const localStorageData = localStorage.getItem(encrtptionkey)
  let response
  if (localStorageData) {
    response = decryptObject(JSON.parse(localStorageData));
  } else {
    const apiresponse = await apiCall("POST", "company/branch/list", data);
    localStorage.setItem((encrtptionkey), JSON.stringify(encryptObject(apiresponse)));
    response = apiresponse;
  }
  return response;
}

async function branchCreate(data) {
  try {
    const response = await apiCall("POST", "company/branch/create", data);
    if (response) {
      return { companyinfo: response };
    }
  } catch (error) {
    console.error("branch create error:", error);
    return Promise.reject(error);
  }
}

async function getBranchDetails(data) {
  try {
    const response = await apiCall("POST", "company/branch/detail", data);
    return response;
  } catch (error) {
    console.error("getbranchDetails:", error);
    return Promise.reject(error);
  }
}

async function updateBranch(data) {
  try {
    const response = await apiCall("POST", "company/branch/update", data);
    return response;
  } catch (error) {
    console.error("update branch:", error);
    return Promise.reject(error);
  }
}

async function deleteBranch(data) {
  try {
    const response = await apiCall("POST", "company/branch/delete", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}
async function statusUpdateBranch(data) {
  try {
    const response = await apiCall("POST", "company/branch/status", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}

export const branchServices = {
  getBranchList,
  branchSearch,
  branchCreate,
  getBranchDetails,
  updateBranch,
  deleteBranch,
  statusUpdateBranch
};
