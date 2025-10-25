import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { policyServices } from "./policy_services";





export const getpolicyList = createAsyncThunk(
  "user/getpolicyList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await policyServices.getpolicyList(reqData);
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

export const commonEmailSearch = createAsyncThunk(
  "user/commonEmailSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await policyServices.commonEmailSearch(reqData);
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

export const getPolicyDetails = createAsyncThunk(
  "user/getPolicyDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await policyServices.getPolicyDetails(reqData);
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

export const createPolicyFunc = createAsyncThunk(
  "user/createPolicyFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await policyServices.createPolicyFunc(reqData);
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

export const updatecommonEmail = createAsyncThunk(
  "user/updatecommonEmail",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await policyServices.updatecommonEmail(reqData);
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
export const deletePolicyFunc = createAsyncThunk(
  "user/deletePolicyFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await policyServices.deletePolicyFunc(reqData);
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

const policySlice = createSlice({
  name: 'policy',
  initialState: {
    employeeDocumentList: [],
    totalUserDesignationCount: 0,
    employeeDocDetails: {},
    commonEmailData:[]
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getpolicyList.pending, (state, action) => {
        state.loading = true;
        state.commonEmailData = [];
        state.totalcommonEmailCount = 0;
      })
      .addCase(getpolicyList.fulfilled, (state, action) => {
        state.commonEmailData = action.payload?.data?.docs;
        state.totalcommonEmailCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getpolicyList.rejected, (state, action) => {
        state.loading = false;
        state.commonEmailData = [];
        state.totalcommonEmailCount = 0;
      })
      .addCase(commonEmailSearch.pending, (state, action) => {
        state.loading = true;
        state.commonEmailData = [];
        state.totalcommonEmailCount = 0;
      })
      .addCase(commonEmailSearch.fulfilled, (state, action) => {
        state.commonEmailData = action.payload?.data?.docs;
        state.totalcommonEmailCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(commonEmailSearch.rejected, (state, action) => {
        state.loading = false;
        state.commonEmailData = [];
        state.totalcommonEmailCount = 0;
      })
      .addCase(createPolicyFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPolicyFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailCreateData = action.payload;
      })
      .addCase(createPolicyFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatecommonEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatecommonEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailUpdateData = action.payload;
      })
      .addCase(updatecommonEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePolicyFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePolicyFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailDeleteData = action.payload;
      })
      .addCase(deletePolicyFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPolicyDetails.pending, (state) => {
        state.loading = true;
        state.policyDetails = null;
      })
      .addCase(getPolicyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.policyDetails = action.payload?.data;
      })
      .addCase(getPolicyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.policyDetails = null;

      })
  },
});

export default policySlice.reducer;
