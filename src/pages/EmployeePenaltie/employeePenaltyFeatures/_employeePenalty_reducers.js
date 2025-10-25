import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


import { employeePenaltyTypeServices } from "./_employeePenalty_services";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";








export const getEmployeePenaltyList = createAsyncThunk(
  "user/getEmployeePenaltyList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await employeePenaltyTypeServices.getEmployeePenaltyTypeList(reqData);
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


export const getPenaltyList = createAsyncThunk(
  "user/getPenaltyList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await employeePenaltyTypeServices.getPenaltyList(reqData);
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

export const employeePenaltyTypeSearch = createAsyncThunk(
  "user/employeePenaltyTypeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await employeePenaltyTypeServices.employeePenaltyTypeSearch(reqData);
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

export const getEmployeePenaltyDetails = createAsyncThunk(
  "user/getEmployeePenaltyDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeePenaltyTypeServices.getEmployeePenaltyTypeDetails(reqData);
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

export const createemployeePenaltyType = createAsyncThunk(
  "user/createemployeePenaltyType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeePenaltyTypeServices.createEmployeePenaltyType(reqData);
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

export const updateemployeePenaltyType = createAsyncThunk(
  "user/updateemployeePenaltyType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeePenaltyTypeServices.updateEmployeePenaltyType(reqData);
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
export const deleteemployeePenaltyType = createAsyncThunk(
  "user/deleteemployeePenaltyType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await employeePenaltyTypeServices.deleteEmployeePenaltyType(reqData);
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
export const statusEmployeePenaltyType = createAsyncThunk(
  "user/statusEmployeePenaltyType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await employeePenaltyTypeServices.statusEmployeePenaltyType(reqData);
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

const employeePenaltySlice = createSlice({
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
      .addCase(getEmployeePenaltyList.pending, (state, action) => {
        state.loading = true;
        state.CCC = [];
        state.totaemployeePenaltyCount = 0;
      })
      .addCase(getEmployeePenaltyList.fulfilled, (state, action) => {
        state.employeePenaltyListData = action.payload?.data?.docs;
        state.totaemployeePenaltyCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getEmployeePenaltyList.rejected, (state, action) => {
        state.loading = false;
        state.employeePenaltyListData = [];
        state.totaemployeePenaltyCount = 0;
      })

      .addCase(getPenaltyList.pending, (state, action) => {
        state.penaltyloading = true;
        state.penaltyListData = [];
        state.totapenaltyCount = 0;
      })
      .addCase(getPenaltyList.fulfilled, (state, action) => {
        state.penaltyListData = action.payload?.data?.docs;
        state.totapenaltyCount = action.payload?.data?.totalDocs;
        state.penaltyloading = false;
      })
      .addCase(getPenaltyList.rejected, (state, action) => {
        state.penaltyloading = false;
        state.penaltyListData = [];
        state.totapenaltyCount = 0;
      })
      .addCase(employeePenaltyTypeSearch.pending, (state, action) => {
        state.loading = true;
        state.CCC = [];
        state.totaemployeePenaltyCount = 0;
      })
      .addCase(employeePenaltyTypeSearch.fulfilled, (state, action) => {
        state.employeePenaltyListData = action.payload?.data?.docs;
        state.totaemployeePenaltyCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(employeePenaltyTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.employeePenaltyListData = [];
        state.totaemployeePenaltyCount = 0;
      })
      
      .addCase(createemployeePenaltyType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createemployeePenaltyType.fulfilled, (state, action) => {
        state.loading = false;
        state.employeePenaltyCreateData = action.payload;
      })
      .addCase(createemployeePenaltyType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateemployeePenaltyType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateemployeePenaltyType.fulfilled, (state, action) => {
        state.loading = false;
        state.employeePenaltyUpdateData = action.payload;
      })
      .addCase(updateemployeePenaltyType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteemployeePenaltyType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteemployeePenaltyType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeDeleteData = action.payload;
      })
      .addCase(deleteemployeePenaltyType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statusEmployeePenaltyType.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusEmployeePenaltyType.fulfilled, (state, action) => {
        state.loading = false;
        state.employeePenaltyStatusDetails = action.payload;
      })
      .addCase(statusEmployeePenaltyType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEmployeePenaltyDetails.pending, (state) => {
        state.loading = true;
        state.employeePenaltyDetails = null;
      })

      .addCase(getEmployeePenaltyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.employeePenaltyDetails = action.payload?.data;
      })
      .addCase(getEmployeePenaltyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.employeePenaltyDetails = null;

      })
  },
});

export default employeePenaltySlice.reducer;
