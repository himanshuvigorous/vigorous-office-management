import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { wfhRequestServices } from "./_wfh_request_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";






export const getwfhRequestList = createAsyncThunk(
  "user/getwfhRequestList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await wfhRequestServices.getwfhRequestList(reqData);
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

export const wfhRequestSearch = createAsyncThunk(
  "user/wfhRequestSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await wfhRequestServices.wfhRequestSearch(reqData);
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

export const getwfhRequestDetails = createAsyncThunk(
  "user/getwfhRequestDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await wfhRequestServices.getwfhRequestDetails(reqData);
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

export const createwfhRequest = createAsyncThunk(
  "user/createwfhRequest",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await wfhRequestServices.createwfhRequest(reqData);
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

export const updatewfhRequest = createAsyncThunk(
  "user/updatewfhRequest",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await wfhRequestServices.updatewfhRequest(reqData);
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
export const deletewfhRequest = createAsyncThunk(
  "user/deletewfhRequest",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await wfhRequestServices.deletewfhRequest(reqData);
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
export const updatewfhRequestStatus = createAsyncThunk(
  "user/updatewfhRequestStatus",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await wfhRequestServices.updatewfhRequestStatus(reqData);
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
export const getwfhDashboard = createAsyncThunk(
  "user/getwfhDashboard",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await wfhRequestServices.getwfhDashboard(reqData);
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

const employeeDocumentSlice = createSlice({
  name: 'employeeDocument',
  initialState: {
    employeeDocumentList: [],
    totalUserDesignationCount: 0,
    employeeDocDetails: {},
    wfhListData:[]
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getwfhRequestList.pending, (state, action) => {
        state.loading = true;
        state.wfhRequestData = [];
        state.totalwfhrequestCount = 0;
      })
      .addCase(getwfhRequestList.fulfilled, (state, action) => {
        state.wfhRequestData = action.payload?.data?.docs;
        state.totalwfhrequestCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getwfhRequestList.rejected, (state, action) => {
        state.loading = false;
        state.wfhRequestData = [];
        state.totalwfhrequestCount = 0;
      })
      .addCase(wfhRequestSearch.pending, (state, action) => {
        state.loading = true;
        state.wfhRequestData = [];
        state.totalwfhrequestCount = 0;
      })
      .addCase(wfhRequestSearch.fulfilled, (state, action) => {
        state.wfhRequestData = action.payload?.data?.docs;
        state.totalwfhrequestCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(wfhRequestSearch.rejected, (state, action) => {
        state.loading = false;
        state.wfhRequestData = [];
        state.totalwfhrequestCount = 0;
      })
      .addCase(createwfhRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createwfhRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.wfhrequestCreateData = action.payload;
      })
      .addCase(createwfhRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatewfhRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatewfhRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.wfhRequestUpdateData = action.payload;
      })
      .addCase(updatewfhRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletewfhRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletewfhRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.wfhRequestDeleteData = action.payload;
      })
      .addCase(deletewfhRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getwfhRequestDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getwfhRequestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.wfhrequestDetails = action.payload?.data;
      })
      .addCase(getwfhRequestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.wfhrequestDetails = null;
      })
      .addCase(updatewfhRequestStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatewfhRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteREquestDataStatus = action.payload?.data;
      })
      .addCase(updatewfhRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // state.wfhrequestDetails = null;
      })
      .addCase(getwfhDashboard.pending, (state) => {
        state.loading = true;
        state.wfhDashboardData = null;
      })
      .addCase(getwfhDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.wfhDashboardData = action.payload?.data;
      })
      .addCase(getwfhDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // state.wfhrequestDetails = null;
      })
  },
});

export default employeeDocumentSlice.reducer;
