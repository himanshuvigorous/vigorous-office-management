import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { AssetInventryServices, AssetTypeServices } from "./_AssetType_services";





export const getAssetTypeList = createAsyncThunk(
  "user/getAssetTypeList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await AssetTypeServices.getAssetTypeList(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const AssetTypeSearch = createAsyncThunk(
  "user/AssetTypeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await AssetTypeServices.AssetTypeSearch(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const getAssetTypeDetails = createAsyncThunk(
  "user/getAssetTypeDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await AssetTypeServices.getAssetTypeDetails(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const createAssetType = createAsyncThunk(
  "user/createAssetType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await AssetTypeServices.createAssetType(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const updateAssetType = createAsyncThunk(
  "user/updateAssetType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await AssetTypeServices.updateAssetType(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const deleteAssetType = createAsyncThunk(
  "user/deleteAssetType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await AssetTypeServices.deleteAssetType(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

// /*--------------------------------------------Assets inventry------------------------------------*/
export const getAssetInventryList = createAsyncThunk(
  "user/getAssetInventryList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await AssetInventryServices.getAssetInventryList(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const AssetInventrySearch = createAsyncThunk(
  "user/AssetInventrySearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await AssetInventryServices.AssetInventrySearch(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);
export const AssetInventryCreate = createAsyncThunk(
  "user/AssetInventryCreate",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await AssetInventryServices.AssetInventryCreate(reqData);
      showNotification({
        message: respose?.message,
        type: 'success',
      });
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const deleteAssetInventry = createAsyncThunk(
  "user/deleteAssetInventry",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await AssetInventryServices.deleteAssetInventry(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const updateAssetInventry = createAsyncThunk(
  "user/updateAssetInventry",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await AssetInventryServices.updateAssetInventry(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const assetInventryDetails = createAsyncThunk(
  "user/assetInventryDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await AssetInventryServices.assetInventryDetails(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
const employeeDocumentSlice = createSlice({
  name: 'employeeDocument',
  initialState: {
    employeeDocumentList: [],
    totalUserDesignationCount: 0,
    employeeDocDetails: {},
    AssetTypeListData:[]
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssetTypeList.pending, (state, action) => {
        state.loading = true;
        state.AssetTypeListData = [];
        state.totalAssetTypeListCount = 0;
      })
      .addCase(getAssetTypeList.fulfilled, (state, action) => {
        state.AssetTypeListData = action.payload?.data?.docs;
        state.totalAssetTypeListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getAssetTypeList.rejected, (state, action) => {
        state.loading = false;
        state.AssetTypeListData = [];
        state.totalAssetTypeListCount = 0;
      })
      .addCase(AssetTypeSearch.pending, (state, action) => {
        state.loading = true;
        state.AssetTypeListData = [];
        state.totalAssetTypeListCount = 0;
      })
      .addCase(AssetTypeSearch.fulfilled, (state, action) => {
        state.AssetTypeListData = action.payload?.data?.docs;
        state.totalAssetTypeListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(AssetTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.AssetTypeListData = [];
        state.totalAssetTypeListCount = 0;
      })
      .addCase(createAssetType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAssetType.fulfilled, (state, action) => {
        state.loading = false;
        state.AssetTypeCreateData = action.payload;
      })
      .addCase(createAssetType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAssetType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAssetType.fulfilled, (state, action) => {
        state.loading = false;
        state.AssetTypeUpdateData = action.payload;
      })
      .addCase(updateAssetType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAssetType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAssetType.fulfilled, (state, action) => {
        state.loading = false;
        state.AssetTypeDeleteData = action.payload;
      })
      .addCase(deleteAssetType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAssetTypeDetails.pending, (state) => {
        state.loading = true;
        state.AssetTypeDetails = null;

      })
      .addCase(getAssetTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.AssetTypeDetails = action.payload?.data;
      })
      .addCase(getAssetTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.AssetTypeDetails = null;
      })
      /*----------------------------------assets inventry-------------*/
      .addCase(getAssetInventryList.pending, (state, action) => {
        state.loading = true;
        state.AssetInventryListData = [];
        state.totalAssetInventryListCount = 0;
      })
      .addCase(getAssetInventryList.fulfilled, (state, action) => {
        state.AssetInventryListData = action.payload?.data?.docs;
        state.totalAssetInventryListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getAssetInventryList.rejected, (state, action) => {
        state.loading = false;
        state.AssetInventryListData = [];
        state.totalAssetInventryListCount = 0;
      })
      .addCase(AssetInventrySearch.pending, (state, action) => {
        state.loading = true;
        state.AssetInventryListData = [];
        state.totalAssetInventryListCount = 0;
      })
      .addCase(AssetInventrySearch.fulfilled, (state, action) => {
        state.AssetInventryListData = action.payload?.data?.docs;
        state.totalAssetInventryListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(AssetInventrySearch.rejected, (state, action) => {
        state.loading = false;
        state.AssetInventryListData = [];
        state.totalAssetInventryListCount = 0;
      })
      .addCase(AssetInventryCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(AssetInventryCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.AssetinventryCreateData = action.payload;
      })
      .addCase(AssetInventryCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAssetInventry.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAssetInventry.fulfilled, (state, action) => {
        state.loading = false;
        state.AssetInventryDeleteData = action.payload;
      })
      .addCase(deleteAssetInventry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAssetInventry.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAssetInventry.fulfilled, (state, action) => {
        state.loading = false;
        state.AssetInventryUpdateData = action.payload;
      })
      .addCase(updateAssetInventry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assetInventryDetails.pending, (state) => {
        state.loading = true;
        state.assetsInventryDetailsData = null;

      })
      .addCase(assetInventryDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.assetsInventryDetailsData = action.payload?.data;
      })
      .addCase(assetInventryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.assetsInventryDetailsData = null;
      })
  },
});

export default employeeDocumentSlice.reducer;
