import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";

import { employeServices } from "./_employe_services";

export const getEmployeList = createAsyncThunk(
  "getEmployeList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeServices.getEmployeList(reqData);
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

export const getRoleList = createAsyncThunk(
  "getRoleList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeServices.getRoleList();
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

export const employeSearch = createAsyncThunk(
  "user/employeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeServices.employeSearch(reqData);
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


export const employeeTrailing = createAsyncThunk(
  "user/employeeTrailing",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeServices.employeeTrailing(reqData);
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


export const createEmploye = createAsyncThunk(
  "createEmploye",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await employeServices.createEmploye(reqData);
      showNotification({
        message: response?.companyinfo?.message,
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

export const getEmployeDetails = createAsyncThunk(
  "/company/getEmployeDetails",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await employeServices.getEmployeDetails(reqData);
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

export const updateEmploye = createAsyncThunk(
  "/updateEmploye",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeServices.updateEmploye(reqData);
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

export const deleteEmploye = createAsyncThunk(
  "/deleteEmploye",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeServices.deleteEmploye(reqData);
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
export const statusEmployefunc = createAsyncThunk(
  "/statusEmployefunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeServices.statusEmployefunc(reqData);
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

export const uploadDocFile = createAsyncThunk(
  'file/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await employeServices.uploadDocFile(formData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const employeSlice = createSlice({
  name: 'employeManagement',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getEmployeList.fulfilled, (state, action) => {
        state.employeList = action.payload?.data?.docs;
        state.totalEmployeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getEmployeList.rejected, (state, action) => {
        state.loading = false;
        state.employeList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(getRoleList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        state.roleList = action.payload?.data;
        state.totalEmployeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getRoleList.rejected, (state, action) => {
        state.loading = false;
        state.roleList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(employeSearch.pending, (state, action) => {
        state.loading = true;
        state.employeList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(employeSearch.fulfilled, (state, action) => {
        state.employeList = action.payload?.data?.docs;
        state.totalEmployeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(employeSearch.rejected, (state, action) => {
        state.loading = false;
        state.employeList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(createEmploye.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmploye.fulfilled, (state, action) => {
        state.loading = false;
        state.createEmployeData = action.payload;
      })
      .addCase(createEmploye.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmploye.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmploye.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updateEmploye.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEmploye.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmploye.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteEmploye.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statusEmployefunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusEmployefunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userstatusData = action.payload;
      })
      .addCase(statusEmployefunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEmployeDetails.pending, (state, action) => {
        state.loading = true;
        state.employeDetailsData = null;
      })
      .addCase(getEmployeDetails.fulfilled, (state, action) => {
        state.employeDetailsData = action.payload;
        state.loading = false;
      })
      .addCase(getEmployeDetails.rejected, (state, action) => {
        state.loading = false;
        state.employeDetailsData = null;
      })
      .addCase(employeeTrailing.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(employeeTrailing.fulfilled, (state, action) => {
        state.employeeTrailingData = action.payload?.data;
        state.loading = false;
      })
      .addCase(employeeTrailing.rejected, (state, action) => {
        state.loading = false;
        state.employeeTrailingData = null;
      })
  },
});

export default employeSlice.reducer;
