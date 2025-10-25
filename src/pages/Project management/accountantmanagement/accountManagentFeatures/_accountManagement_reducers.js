import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { accountManagementServices } from "./_accountManagement_services";









export const accountantSearch = createAsyncThunk(
  "getAccountantList/accountantSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await accountManagementServices.accountantSearch(reqData);
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



export const getAccountantListFunc = createAsyncThunk(
  "getAccountantList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await accountManagementServices.getAccountantList(reqData);
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




export const createAccountantFunc = createAsyncThunk(
  "createAccountantFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await accountManagementServices.createAccountantFunc(reqData);
      showNotification({
        message: response?.taskinfo?.message,
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

export const getAccountantDetails = createAsyncThunk(
  "/company/getAccountantDetails",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await accountManagementServices.getAccountantDetails(reqData);
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

export const updateAccountantFunc = createAsyncThunk(
  "/updateAccountantFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await accountManagementServices.updateAccountantFunc(reqData);
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

export const deleteAccountantFunc = createAsyncThunk(
  "/deleteAccountantFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await accountManagementServices.deleteAccountantFunc(reqData);
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




const accountManagementSlice = createSlice({
  name: 'accountManagement',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccountantListFunc.pending, (state, action) => {
        state.loading = true;
        state.accountantList = [];
        state.totalAccountantCount = 0;
      })
      .addCase(getAccountantListFunc.fulfilled, (state, action) => {
        state.accountantList = action.payload?.data?.docs;
        state.totalAccountantCount = action.payload?.data?.totalDocs;
        state.accountantDetailsData = null;
        state.loading = false;
      })
      .addCase(getAccountantListFunc.rejected, (state, action) => {
        state.loading = false;
        state.accountantList = [];
        state.totalAccountantCount = 0;
      })
      .addCase(createAccountantFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAccountantFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.createAccountantData = action.payload?.accountantinfo?.data;
      })
      .addCase(createAccountantFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAccountantFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAccountantFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.updateAccountantData = action.payload;
      })
      .addCase(updateAccountantFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAccountantFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAccountantFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteAccountantData = action.payload;
      })
      .addCase(deleteAccountantFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAccountantDetails.pending, (state, action) => {
        state.loading = true;
        state.accountantDetailsData = null;
      })
      .addCase(getAccountantDetails.fulfilled, (state, action) => {
        state.accountantDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getAccountantDetails.rejected, (state, action) => {
        state.loading = false;
        state.accountantDetailsData = null;
      })




    

      .addCase(accountantSearch.pending, (state, action) => {
        state.loading = true;
        state.gstTypeSearch = null;
      })
      .addCase(accountantSearch.fulfilled, (state, action) => {
        state.accountantList = action.payload?.data?.docs;
        state.totalAccountantCount = action.payload?.data?.totalDocs;
        state.accountantDetailsData = null;
        state.loading = false;
      })
      .addCase(accountantSearch.rejected, (state, action) => {
        state.loading = false;
        state.accountantList = [];
        state.totalAccountantCount = 0;
      })
      
  },
});

export default accountManagementSlice.reducer;
