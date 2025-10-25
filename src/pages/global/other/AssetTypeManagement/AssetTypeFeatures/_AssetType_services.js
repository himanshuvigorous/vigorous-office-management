import { apiCall } from "../../../../../config/Http";


async function getAssetTypeList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `master/asset/name/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `master/asset/name/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function AssetTypeSearch(data) {

  try {
    const response = await apiCall("POST", "master/asset/name/list", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}

async function getAssetTypeDetails(data) {

  try {
    const response = await apiCall("POST", "master/asset/name/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function createAssetType(data) {
  try {
    const response = await apiCall("POST", "master/asset/name/create", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateAssetType(data) {

  try {
    const response = await apiCall("POST", "master/asset/name/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteAssetType(data) {

  try {
    const response = await apiCall("POST", "master/asset/name/delete", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const AssetTypeServices = {
  getAssetTypeList,
  getAssetTypeDetails,
  createAssetType,
  updateAssetType,
  deleteAssetType,
  AssetTypeSearch
};


/*********************************---------asset inventry -------------------------------- */


async function getAssetInventryList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `employe/asset/inventory/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `employe/asset/inventory/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function AssetInventrySearch(data) {

  try {
    const response = await apiCall("POST", "employe/asset/inventory/list", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}
async function AssetInventryCreate(data) {

  try {
    const response = await apiCall("POST", "employe/asset/inventory/create", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}
async function deleteAssetInventry(data) {

  try {
    const response = await apiCall("POST", "employe/asset/inventory/delete", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateAssetInventry(data) {

  try {
    const response = await apiCall("POST", "employe/asset/inventory/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function assetInventryDetails(data) {

  try {
    const response = await apiCall("POST", "employe/asset/inventory/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const AssetInventryServices = {
getAssetInventryList,
AssetInventrySearch,
AssetInventryCreate,
deleteAssetInventry,
updateAssetInventry,
assetInventryDetails
};
