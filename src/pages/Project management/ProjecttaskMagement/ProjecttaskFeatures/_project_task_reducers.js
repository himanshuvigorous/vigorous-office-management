import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { projectTaskServices } from "./_project_task_services";


export const getProjectTaskList = createAsyncThunk(
  "user/getProjectTaskList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await projectTaskServices.getProjectTaskList(reqData);
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const projectTaskSearch = createAsyncThunk(
  "user/projectTaskSearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await projectTaskServices.projectTaskSearch(reqData);
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const getProjectTaskDetails = createAsyncThunk(
  "user/getProjectTaskDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectTaskServices.getProjectTaskDetails(reqData);
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

export const createProjectTaskFunc = createAsyncThunk(
  "user/createProjectTaskFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectTaskServices.createProjectTaskFunc(reqData);
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

export const updateProjectTaskFunc = createAsyncThunk(
  "user/updateProjectTaskFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectTaskServices.updateProjectTaskFunc(reqData);
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
export const deleteProjectTaskFunc = createAsyncThunk(
  "user/deleteProjectTaskFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectTaskServices.deleteProjectTaskFunc(reqData);
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
export const statusProjectTaskFunc = createAsyncThunk(
  "user/statusProjectTaskFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectTaskServices.statusProjectTaskFunc(reqData);
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
export const logsofProjectTaskFunc = createAsyncThunk(
  "user/logsofProjectTaskFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectTaskServices.logsofProjectTaskFunc(reqData);
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
export const diretorProjectDashboardFunc = createAsyncThunk(
  "user/diretorProjectDashboardFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectTaskServices.diretorProjectDashboardFunc(reqData);
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
export const employeeProjectdashbord = createAsyncThunk(
  "user/employeeProjectdashbord",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectTaskServices.employeeProjectdashbord(reqData);
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

const projectTaskSlice = createSlice({
  name: 'projectTask',
  initialState: {
    projectTaskList: [],
    totalProjectTaskCount: 0,
    projectTaskDetails: null,
  },
  reducers: {
    projectTaskreset: (state) => {
      state.projectTaskDetails = null;
        state.projectTaskList = null;
        state.totalProjectTaskCount = 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjectTaskList.pending, (state, action) => {
        state.loading = true;
        state.projectTaskList = [];
        state.totalProjectTaskCount = 0;
      })
      .addCase(getProjectTaskList.fulfilled, (state, action) => {
        state.projectTaskList = action.payload?.data?.docs;
        state.totalProjectTaskCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getProjectTaskList.rejected, (state, action) => {
        state.loading = false;
        state.projectTaskList = [];
        state.totalProjectTaskCount = 0;
      })
      .addCase(projectTaskSearch.pending, (state, action) => {
        state.loading = true;
        state.projectTaskList = [];
        state.totalProjectTaskCount = 0;
      })
      .addCase(projectTaskSearch.fulfilled, (state, action) => {
        state.projectTaskList = action.payload?.data?.docs;
        state.totalProjectTaskCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(projectTaskSearch.rejected, (state, action) => {
        state.loading = false;
        state.projectTaskList = [];
        state.totalProjectTaskCount = 0;
      })
      .addCase(createProjectTaskFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProjectTaskFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTaskCreateData = action.payload;
      })
      .addCase(createProjectTaskFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProjectTaskFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProjectTaskFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTaskUpdateData = action.payload;
      })
      .addCase(updateProjectTaskFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProjectTaskFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProjectTaskFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTaskDeleteData = action.payload;
      })
      .addCase(deleteProjectTaskFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statusProjectTaskFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusProjectTaskFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTaskStatusData = action.payload;
      })
      .addCase(statusProjectTaskFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logsofProjectTaskFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(logsofProjectTaskFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasklogsData = action.payload;
      })
      .addCase(logsofProjectTaskFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProjectTaskDetails.pending, (state) => {
        state.loadingDetails = true;
        state.projectTaskDetails = null;
      })
      .addCase(getProjectTaskDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.projectTaskDetails = action.payload?.data;
      })
      .addCase(getProjectTaskDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.error = action.payload;
        state.projectTaskDetails = null;
      })
      .addCase(diretorProjectDashboardFunc.pending, (state) => {
        state.dashboardLoading = true;
        state.directorDashboardData = null;
      })
      .addCase(diretorProjectDashboardFunc.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.directorDashboardData = action.payload?.data;
      })
      .addCase(diretorProjectDashboardFunc.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
        state.directorDashboardData = null;
      })
      .addCase(employeeProjectdashbord.pending, (state) => {
        state.employeedashboardLoading = true;
        state.employeeProjectDashboardData = null;
      })
      .addCase(employeeProjectdashbord.fulfilled, (state, action) => {
        state.employeedashboardLoading = false;
        state.employeeProjectDashboardData = action.payload?.data;
      })
      .addCase(employeeProjectdashbord.rejected, (state, action) => {
        state.employeedashboardLoading = false;
        state.error = action.payload;
        state.employeeProjectDashboardData = null;
      })
  },
});
export const { projectTaskreset } = projectTaskSlice.actions
export default projectTaskSlice.reducer;