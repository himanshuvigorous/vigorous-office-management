import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { paymentServices } from "./_payment_services";







export const getpaymentList = createAsyncThunk(
  "user/getpaymentList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await paymentServices.getpaymentList(reqData);
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

export const paymentSearch = createAsyncThunk(
  "user/paymentSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await paymentServices.paymentSearch(reqData);
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

export const getpaymentDetails = createAsyncThunk(
  "user/getpaymentDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await paymentServices.getpaymentDetails(reqData);
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

export const createpayment = createAsyncThunk(
  "user/createpayment",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await paymentServices.createpayment(reqData);
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

export const updatepayment = createAsyncThunk(
  "user/updatepayment",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await paymentServices.updatepayment(reqData);
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
export const deletepayment = createAsyncThunk(
  "user/deletepayment",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await paymentServices.deletepayment(reqData);
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

const paymentSlice = createSlice({
  name: 'paymentSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getpaymentList.pending, (state, action) => {
        state.loading = true;
        state.paymentListData = [];
        state.totalpaymentListCount = 0;
      })
      .addCase(getpaymentList.fulfilled, (state, action) => {
        state.paymentListData = action.payload?.data?.docs;
        state.totalpaymentListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getpaymentList.rejected, (state, action) => {
        state.loading = false;
        state.paymentListData = [];
        state.totalpaymentListCount = 0;
      })
      .addCase(paymentSearch.pending, (state, action) => {
        state.loading = true;
        state.paymentListData = [];
        state.totalpaymentListCount = 0;
      })
      .addCase(paymentSearch.fulfilled, (state, action) => {
        state.paymentListData = action.payload?.data?.docs;
        state.totalpaymentListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(paymentSearch.rejected, (state, action) => {
        state.loading = false;
        state.paymentListData = [];
        state.totalpaymentListCount = 0;
      })
      .addCase(createpayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createpayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentCreateData = action.payload;
      })
      .addCase(createpayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatepayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatepayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUpdateData = action.payload;
      })
      .addCase(updatepayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletepayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletepayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDeleteData = action.payload;
      })
      .addCase(deletepayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getpaymentDetails.pending, (state) => {
        state.loading = true;
        state.paymentDetails = null;
      })
      .addCase(getpaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload?.data;
      })
      .addCase(getpaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentDetails = null;

      })
  },
});

export default paymentSlice.reducer;
