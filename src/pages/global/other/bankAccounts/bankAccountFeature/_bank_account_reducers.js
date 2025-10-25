import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { bankAccountServices } from "./_bank_account_services";






export const getbankAccountList = createAsyncThunk(
  "user/getbankAccountList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await bankAccountServices.getbankAccountList(reqData);
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

export const bankAccountSearch = createAsyncThunk(
  "user/bankAccountSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await bankAccountServices.bankAccountSearch(reqData);
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

export const getbankAccountDetails = createAsyncThunk(
  "user/getbankAccountDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await bankAccountServices.getbankAccountDetails(reqData);
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

export const createbankAccount = createAsyncThunk(
  "user/createbankAccount",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await bankAccountServices.createbankAccount(reqData);
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

export const updatebankAccount = createAsyncThunk(
  "user/updatebankAccount",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await bankAccountServices.updatebankAccount(reqData);
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
export const deletebankAccount = createAsyncThunk(
  "user/deletebankAccount",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await bankAccountServices.deletebankAccount(reqData);
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

const bankAccountSlice = createSlice({
  name: 'bankAccountSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getbankAccountList.pending, (state, action) => {
        state.loading = true;
        state.bankAccountListData = [];
        state.totalbankAccountListCount = 0;
      })
      .addCase(getbankAccountList.fulfilled, (state, action) => {
        state.bankAccountListData = action.payload?.data?.docs;
        state.totalbankAccountListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getbankAccountList.rejected, (state, action) => {
        state.loading = false;
        state.bankAccountListData = [];
        state.totalbankAccountListCount = 0;
      })
      .addCase(bankAccountSearch.pending, (state, action) => {
        state.loading = true;
        state.bankAccountListData = [];
        state.totalbankAccountListCount = 0;
      })
      .addCase(bankAccountSearch.fulfilled, (state, action) => {
        state.bankAccountListData = action.payload?.data?.docs;
        state.totalbankAccountListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(bankAccountSearch.rejected, (state, action) => {
        state.loading = false;
        state.bankAccountListData = [];
        state.totalbankAccountListCount = 0;
      })
      .addCase(createbankAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createbankAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.bankAccountCreateData = action.payload;
      })
      .addCase(createbankAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatebankAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatebankAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.bankAccountUpdateData = action.payload;
      })
      .addCase(updatebankAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletebankAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletebankAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.bankAccountDeleteData = action.payload;
      })
      .addCase(deletebankAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getbankAccountDetails.pending, (state) => {
        state.loading = true;
        state.bankAccountDetails = null;
      })
      .addCase(getbankAccountDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.bankAccountDetails = action.payload?.data;
      })
      .addCase(getbankAccountDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.bankAccountDetails = null;

      })
  },
});

export default bankAccountSlice.reducer;
