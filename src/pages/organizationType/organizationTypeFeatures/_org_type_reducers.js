import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { orgTypeServices } from "./_org_type_services";


export const getOrgTypeList = createAsyncThunk(
  "user/getOrgTypeList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await orgTypeServices.getOrgTypeList(reqData);
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

export const orgTypeSearch = createAsyncThunk(
  "user/orgTypeSearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await orgTypeServices.orgTypeSearch(reqData);
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

export const getOrgTypeDetails = createAsyncThunk(
  "user/getOrgTypeDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await orgTypeServices.getOrgTypeDetails(reqData);
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

export const createOrgType = createAsyncThunk(
  "user/createOrgType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await orgTypeServices.createOrgType(reqData);
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

export const updateOrgType = createAsyncThunk(
  "user/updateOrgType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await orgTypeServices.updateOrgType(reqData);
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
export const deleteOrgType = createAsyncThunk(
  "user/deleteOrgType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await orgTypeServices.deleteOrgType(reqData);
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

const orgTypeSlice = createSlice({
  name: 'orgType',
  initialState: {
    orgTypeList: [],
    totalOrgTypeCount: 0,
    orgTypeData: {}
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrgTypeList.pending, (state, action) => {
        state.loading = true;
        state.orgTypeList = [];
        state.totalOrgTypeCount = 0;
      })
      .addCase(getOrgTypeList.fulfilled, (state, action) => {
        state.orgTypeList = action.payload?.data?.docs;
        state.totalOrgTypeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getOrgTypeList.rejected, (state, action) => {
        state.loading = false;
        state.orgTypeList = [];
        state.totalOrgTypeCount = 0;
      })

      .addCase(orgTypeSearch.pending, (state, action) => {
        state.orgSearchloading = true;
        state.orgTypeList = [];
        state.totalOrgTypeCount = 0;
      })
      .addCase(orgTypeSearch.fulfilled, (state, action) => {
        state.orgTypeList = action.payload?.data?.docs;
        state.totalOrgTypeCount = action.payload?.data?.total;
        state.orgSearchloading = false;
      })
      .addCase(orgTypeSearch.rejected, (state, action) => {
        state.orgSearchloading = false;
        state.orgTypeList = [];
        state.totalOrgTypeCount = 0;
      })
      .addCase(createOrgType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrgType.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeCreateData = action.payload;
      })
      .addCase(createOrgType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrgType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrgType.fulfilled, (state, action) => {
        state.loading = false;
        state.orgTypeData = action.payload;
      })
      .addCase(updateOrgType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrgType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrgType.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypetDeleteData = action.payload;
      })
      .addCase(deleteOrgType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrgTypeDetails.pending, (state) => {
        state.loading = true;
        state.orgTypeData = null;
      })
      .addCase(getOrgTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orgTypeData = action.payload?.data;
      })
      .addCase(getOrgTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orgTypeData = null;
      })
  },
});

export default orgTypeSlice.reducer;
