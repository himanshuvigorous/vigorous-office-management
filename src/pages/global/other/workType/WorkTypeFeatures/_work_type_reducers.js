import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { workTypeServices } from "./_work_type_services";




export const getWorkTypeList = createAsyncThunk(
  "user/getWorkTypeList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await workTypeServices.getWorkTypeList(reqData);
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

export const leaveTypeSearch = createAsyncThunk(
  "user/leaveTypeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await workTypeServices.leaveTypeSearch(reqData);
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

export const getWorkTypeDetails = createAsyncThunk(
  "user/getWorkTypeDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await workTypeServices.getWorkTypeDetails(reqData);
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

export const createWorkType = createAsyncThunk(
  "user/createWorkType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await workTypeServices.createWorkType(reqData);
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

export const updateWorkType = createAsyncThunk(
  "user/updateWorkType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await workTypeServices.updateWorkType(reqData);
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
export const deleteWorkType = createAsyncThunk(
  "user/deleteWorkType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await workTypeServices.deleteWorkType(reqData);
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

const workTypeSlice = createSlice({
  name: 'workType',
  initialState: {
    // employeeDocumentList: [],
    // totalUserDesignationCount: 0,
    // employeeDocDetails: {},
    workTypeListData:[]
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getWorkTypeList.pending, (state, action) => {
        state.loading = true;
        state.workTypeListData = [];
        state.totaWorkTypeCount = 0;
      })
      .addCase(getWorkTypeList.fulfilled, (state, action) => {
        state.workTypeListData = action.payload?.data?.docs;
        state.totaWorkTypeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getWorkTypeList.rejected, (state, action) => {
        state.loading = false;
        state.workTypeListData = [];
        state.totaWorkTypeCount = 0;
      })
      .addCase(leaveTypeSearch.pending, (state, action) => {
        state.loading = true;
        state.workTypeListData = [];
        state.totaWorkTypeCount = 0;
      })
      .addCase(leaveTypeSearch.fulfilled, (state, action) => {
        state.workTypeListData = action.payload?.data?.docs;
        state.totaWorkTypeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(leaveTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.workTypeListData = [];
        state.totaWorkTypeCount = 0;
      })
      .addCase(createWorkType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWorkType.fulfilled, (state, action) => {
        state.loading = false;
        state.workTypeCreateData = action.payload;
      })
      .addCase(createWorkType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateWorkType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWorkType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeUpdateData = action.payload;
      })
      .addCase(updateWorkType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteWorkType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWorkType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeDeleteData = action.payload;
      })
      .addCase(deleteWorkType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWorkTypeDetails.pending, (state) => {
        state.loading = true;
        state.workTypeDetails = null;
      })

      .addCase(getWorkTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.workTypeDetails = action.payload?.data;
      })
      .addCase(getWorkTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.workTypeDetails = null;

      })
  },
});

export default workTypeSlice.reducer;
