import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { fundTransferServices } from "./_fundTransfer_services";








export const getfundTransferList = createAsyncThunk(
  "user/getfundTransferList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await fundTransferServices.getfundTransferList(reqData);
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

export const fundTransferSearch = createAsyncThunk(
  "user/fundTransferSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await fundTransferServices.fundTransferSearch(reqData);
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

export const getfundTransferDetails = createAsyncThunk(
  "user/getfundTransferDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fundTransferServices.getfundTransferDetails(reqData);
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

export const createfundTransfer = createAsyncThunk(
  "user/createfundTransfer",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fundTransferServices.createfundTransfer(reqData);
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

export const updatefundTransfer = createAsyncThunk(
  "user/updatefundTransfer",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fundTransferServices.updatefundTransfer(reqData);
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
export const deletefundTransfer = createAsyncThunk(
  "user/deletefundTransfer",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await fundTransferServices.deletefundTransfer(reqData);
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

export const fundTransferreport = createAsyncThunk(
  "user/fundTransferreport",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fundTransferServices.fundTransferreport(reqData);
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

const fundTransferSlice = createSlice({
  name: 'fundTransferSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getfundTransferList.pending, (state, action) => {
        state.loading = true;
        state.fundTransferListData = [];
        state.totalfundTransferListCount = 0;
      })
      .addCase(getfundTransferList.fulfilled, (state, action) => {
        state.fundTransferListData = action.payload?.data?.docs;
        state.totalfundTransferListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getfundTransferList.rejected, (state, action) => {
        state.loading = false;
        state.fundTransferListData = [];
        state.totalfundTransferListCount = 0;
      })
      .addCase(fundTransferSearch.pending, (state, action) => {
        state.loading = true;
        state.fundTransferListData = [];
        state.totalfundTransferListCount = 0;
      })
      .addCase(fundTransferSearch.fulfilled, (state, action) => {
        state.fundTransferListData = action.payload?.data?.docs;
        state.totalfundTransferListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(fundTransferSearch.rejected, (state, action) => {
        state.loading = false;
        state.fundTransferListData = [];
        state.totalfundTransferListCount = 0;
      })
      .addCase(createfundTransfer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createfundTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.fundTransferCreateData = action.payload;
      })
      .addCase(createfundTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatefundTransfer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatefundTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.fundTransferUpdateData = action.payload;
      })
      .addCase(updatefundTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletefundTransfer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletefundTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.fundTransferDeleteData = action.payload;
      })
      .addCase(deletefundTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getfundTransferDetails.pending, (state) => {
        state.loading = true;
        state.fundTransferDetails = null;
      })
      .addCase(getfundTransferDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.fundTransferDetails = action.payload?.data;
      })
      .addCase(getfundTransferDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fundTransferDetails = null;
      })
      .addCase(fundTransferreport.pending, (state) => {
        state.loading = true;
        state.fundTransferReportData = null;
      })
      .addCase(fundTransferreport.fulfilled, (state, action) => {
        state.loading = false;
        state.fundTransferReportData = action.payload?.data;
      })
      .addCase(fundTransferreport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fundTransferReportData = null;
      })
  },
});

export default fundTransferSlice.reducer;
