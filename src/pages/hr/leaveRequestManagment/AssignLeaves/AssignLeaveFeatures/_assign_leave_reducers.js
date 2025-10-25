import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { assignrequestServices } from "./_assign_leave_services";







export const getassignLeaveData = createAsyncThunk(
  "user/getassignLeaveData",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await assignrequestServices.getassignLeaveData(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const assignLeaveDataSearch = createAsyncThunk(
  "user/assignLeaveDataSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await assignrequestServices.assignLeaveDataSearch(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const getAssignLeaveDetails = createAsyncThunk(
  "user/getAssignLeaveDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await assignrequestServices.getAssignLeaveDetails(reqData);

      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const assignMultipleLeave = createAsyncThunk(
  "user/assignMultipleLeave",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await assignrequestServices.assignMultipleLeave(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const createAssignLeaves = createAsyncThunk(
  "user/createAssignLeaves",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await assignrequestServices.createAssignLeaves(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const getUpdateleaveRequest = createAsyncThunk(
  "user/getUpdateleaveRequest",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await assignrequestServices.updateTotalLeave(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const deleteAssignedLeaveEmployee = createAsyncThunk(
  "user/deleteAssignedLeaveEmployee",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await assignrequestServices.deleteAssignedLeaveEmployee(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const getEmployeeListAsssignedleave = createAsyncThunk(
  "user/getEmployeeListAsssignedleave",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await assignrequestServices.employeeListAsssignedleave(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
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
    leaveListData:[]
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getassignLeaveData.pending, (state, action) => {
        state.loading = true;
        state.assignleaveListData = [];
        state.totalAssignLEaveListData = 0;
      })
      .addCase(getassignLeaveData.fulfilled, (state, action) => {
        state.assignleaveListData = action.payload?.data?.docs;
        state.totalAssignLEaveListData = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getassignLeaveData.rejected, (state, action) => {
        state.loading = false;
        state.assignleaveListData = [];
        state.totalAssignLEaveListData = 0;
      })
      .addCase(assignLeaveDataSearch.pending, (state, action) => {
        state.loading = true;
        state.assignleaveListData = [];
        state.totalAssignLEaveListData = 0;
      })
      .addCase(assignLeaveDataSearch.fulfilled, (state, action) => {
        state.assignleaveListData = action.payload?.data?.docs;
        state.totalAssignLEaveListData = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(assignLeaveDataSearch.rejected, (state, action) => {
        state.loading = false;
        state.assignleaveListData = [];
        state.totalAssignLEaveListData = 0;
      })
      .addCase(createAssignLeaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAssignLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.assifnLeaveData = action.payload;
      })
      .addCase(createAssignLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUpdateleaveRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUpdateleaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedleaveRequest = action.payload;
      })
      .addCase(getUpdateleaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAssignedLeaveEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAssignedLeaveEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.AssignleaveRequestDeleteData = action.payload;
      })
      .addCase(deleteAssignedLeaveEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAssignLeaveDetails.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.assignLeaveRequestDetails = null;
      })
      .addCase(getAssignLeaveDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.assignLeaveRequestDetails = action.payload?.data;
      })
      .addCase(getAssignLeaveDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.assignLeaveRequestDetails = null;
      })
      .addCase(assignMultipleLeave.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.assignLeaveRequestDetails = null;
      })
      .addCase(assignMultipleLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.assignMultipleLeave = action.payload?.data;
      })
      .addCase(assignMultipleLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.assignMultipleLeave = null;
      })
      .addCase(getEmployeeListAsssignedleave.pending, (state) => {
        state.loading = true;
        state.assignedleaveEmployeeData = {};
      })
      .addCase(getEmployeeListAsssignedleave.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedleaveEmployeeData = action.payload?.data;
      })
      .addCase(getEmployeeListAsssignedleave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // state.leaverequestDetails = null;
      })

  },
});

export default employeeDocumentSlice.reducer;
