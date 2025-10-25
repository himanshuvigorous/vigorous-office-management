import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { receiptServices } from "./_receipt_services";







export const getreceiptList = createAsyncThunk(
  "user/getreceiptList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await receiptServices.getreceiptList(reqData);
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

export const receiptSearch = createAsyncThunk(
  "user/receiptSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await receiptServices.receiptSearch(reqData);
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

export const getreceiptDetails = createAsyncThunk(
  "user/getreceiptDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await receiptServices.getreceiptDetails(reqData);
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

export const createreceipt = createAsyncThunk(
  "user/createreceipt",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await receiptServices.createreceipt(reqData);
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

export const updatereceipt = createAsyncThunk(
  "user/updatereceipt",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await receiptServices.updatereceipt(reqData);
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
export const deletereceipt = createAsyncThunk(
  "user/deletereceipt",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await receiptServices.deletereceipt(reqData);
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

const receiptSlice = createSlice({
  name: 'receiptSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getreceiptList.pending, (state, action) => {
        state.loading = true;
        state.receiptListData = null;
        state.totalreceiptListCount = 0;
      })
      .addCase(getreceiptList.fulfilled, (state, action) => {
        state.receiptListData = action.payload?.data?.docs;
        state.totalreceiptListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getreceiptList.rejected, (state, action) => {
        state.loading = false;
        state.receiptListData = null;
        state.totalreceiptListCount = 0;
      })
      .addCase(receiptSearch.pending, (state, action) => {
        state.loading = true;
        state.receiptListData = [];
        state.totalreceiptListCount = 0;
      })
      .addCase(receiptSearch.fulfilled, (state, action) => {
        state.receiptListData = action.payload?.data?.docs;
        state.totalreceiptListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(receiptSearch.rejected, (state, action) => {
        state.loading = false;
        state.receiptListData = [];
        state.totalreceiptListCount = 0;
      })
      .addCase(createreceipt.pending, (state) => {
        state.loading = true;
      })
      .addCase(createreceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.receiptCreateData = action.payload;
      })
      .addCase(createreceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatereceipt.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatereceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.receiptUpdateData = action.payload;
      })
      .addCase(updatereceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletereceipt.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletereceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.receiptDeleteData = action.payload;
      })
      .addCase(deletereceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getreceiptDetails.pending, (state) => {
        state.loading = true;
        state.receiptDetails = null;
      })
      .addCase(getreceiptDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.receiptDetails = action.payload?.data;
      })
      .addCase(getreceiptDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.receiptDetails = null;

      })
  },
});

export default receiptSlice.reducer;
