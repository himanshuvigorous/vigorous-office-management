import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { cashbookServices } from "./_cashbook_services";






export const getcashbookList = createAsyncThunk(
  "user/getcashbookList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await cashbookServices.getcashbookList(reqData);
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
export const getEmployeecashbookDetails = createAsyncThunk(
  "user/getEmployeecashbookDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await cashbookServices.getEmployeecashbookDetails(reqData);
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


export const getEmployeeCashbookList = createAsyncThunk(
  "user/getEmployeeCashbookList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await cashbookServices.getEmployeeCashbookList(reqData);
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


export const getCashbookEmployeeList = createAsyncThunk(
  "user/getCashbookEmployeeList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await cashbookServices.getCashbookEmployeeList(reqData);
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






export const cashbookSearch = createAsyncThunk(
  "user/cashbookSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await cashbookServices.cashbookSearch(reqData);
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

export const getcashbookDetails = createAsyncThunk(
  "user/getcashbookDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await cashbookServices.getcashbookDetails(reqData);
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

export const createcashbook = createAsyncThunk(
  "user/createcashbook",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await cashbookServices.createcashbook(reqData);
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

export const updatecashbook = createAsyncThunk(
  "user/updatecashbook",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await cashbookServices.updatecashbook(reqData);
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
export const deletecashbook = createAsyncThunk(
  "user/deletecashbook",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await cashbookServices.deletecashbook(reqData);
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
export const statuscashbook = createAsyncThunk(
  "user/statuscashbook",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await cashbookServices.statuscashbook(reqData);
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

const cashbookSlice = createSlice({
  name: 'cashbookSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getcashbookList.pending, (state, action) => {
        state.loading = true;
        state.cashbookListData = [];
        state.totalcashbookListCount = 0;
      })
      .addCase(getcashbookList.fulfilled, (state, action) => {
        state.cashbookListData = action.payload?.data?.docs;
        state.totalcashbookListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getcashbookList.rejected, (state, action) => {
        state.loading = false;
        state.cashbookListData = [];
        state.totalcashbookListCount = 0;
      })
      .addCase(getEmployeecashbookDetails.pending, (state, action) => {
        state.cashbookDetailsLoading = true;
        state.cashbookDetailsListdata = [];
        state.totalEmployeecashbookDetailsListCount = 0;
      })
      .addCase(getEmployeecashbookDetails.fulfilled, (state, action) => {
        state.cashbookDetailsListdata = action.payload?.data;
        state.totalEmployeecashbookDetailsListCount = action.payload?.data?.totalDocs;
        state.cashbookDetailsLoading = false;
      })
      .addCase(getEmployeecashbookDetails.rejected, (state, action) => {
        state.cashbookDetailsLoading = false;
        state.cashbookDetailsListdata = [];
        state.totalEmployeecashbookDetailsListCount = 0;
      })

      .addCase(getCashbookEmployeeList.pending, (state, action) => {
        state.getCashbookEmployeeListLoading = true; 
        state.getCashbookEmployeeListData = [];
        state.getCashbookEmployeeSummry = 0;
        state.totalCashbookEmployeeListCount = 0;
      })
      .addCase(getCashbookEmployeeList.fulfilled, (state, action) => {
        state.getCashbookEmployeeListData = action.payload?.data?.result?.docs;
        state.getCashbookEmployeeSummry = action.payload?.data?.netAmount;
        state.totalCashbookEmployeeListCount = action.payload?.data?.result?.totalDocs;
        state.getCashbookEmployeeListLoading = false;
      })
      .addCase(getCashbookEmployeeList.rejected, (state, action) => {
        state.getCashbookEmployeeListLoading = false;
        state.getCashbookEmployeeListData = [];
        state.getCashbookEmployeeSummry = 0;
        state.totalCashbookEmployeeListCount = 0;
      })

      .addCase(getEmployeeCashbookList.pending, (state, action) => {
        state.employeeCashbookLoading = true;
        state.employeeCashbookListData = [];
        state.totalemployeeCashbookListCount = 0;
      })
      .addCase(getEmployeeCashbookList.fulfilled, (state, action) => {
        state.employeeCashbookListData = action.payload?.data?.docs;
        state.totalemployeeCashbookListCount = action.payload?.data?.totalDocs;
        state.employeeCashbookLoading = false;
      })
      .addCase(getEmployeeCashbookList.rejected, (state, action) => {
        state.employeeCashbookLoading = false;
        state.employeeCashbookListData = [];
        state.totalemployeeCashbookListCount = 0;
      })
      .addCase(cashbookSearch.pending, (state, action) => {
        state.loading = true;
        state.cashbookListData = [];
        state.totalcashbookListCount = 0;
      })
      .addCase(cashbookSearch.fulfilled, (state, action) => {
        state.cashbookListData = action.payload?.data?.docs;
        state.totalcashbookListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(cashbookSearch.rejected, (state, action) => {
        state.loading = false;
        state.cashbookListData = [];
        state.totalcashbookListCount = 0;
      })
      .addCase(createcashbook.pending, (state) => {
        state.loading = true;
      })
      .addCase(createcashbook.fulfilled, (state, action) => {
        state.loading = false;
        state.cashbookCreateData = action.payload;
      })
      .addCase(createcashbook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatecashbook.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatecashbook.fulfilled, (state, action) => {
        state.loading = false;
        state.cashbookUpdateData = action.payload;
      })
      .addCase(updatecashbook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletecashbook.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletecashbook.fulfilled, (state, action) => {
        state.loading = false;
        state.cashbookDeleteData = action.payload;
      })
      .addCase(deletecashbook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statuscashbook.pending, (state) => {
        state.loading = true;
      })
      .addCase(statuscashbook.fulfilled, (state, action) => {
        state.loading = false;
        state.cashbookStatusData = action.payload;
      })
      .addCase(statuscashbook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getcashbookDetails.pending, (state) => {
        state.loading = true;
        state.cashbookDetails = null;
      })
      .addCase(getcashbookDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.cashbookDetails = action.payload?.data;
      })
      .addCase(getcashbookDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cashbookDetails = null;

      })
  },
});

export default cashbookSlice.reducer;
