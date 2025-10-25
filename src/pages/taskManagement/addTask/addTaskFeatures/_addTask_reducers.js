import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { taskServices } from "./_addTask_services";



export const getTaskList = createAsyncThunk(
  "getTaskList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await taskServices.getTaskList(reqData);
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


export const dashboardTaskReq = createAsyncThunk(
  "dashboardTaskReq",
  async (reqPayload, { rejectWithValue }) => {
    try {
      const response = await taskServices.dashboardTaskReq(reqPayload);
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

export const taskSearch = createAsyncThunk(
  "taskSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await taskServices.taskSearch(reqData);
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
      const response = await taskServices.getRoleList();
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


export const createTaskFunc = createAsyncThunk(
  "createTaskFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await taskServices.createTaskFunc(reqData);
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

export const gettaskDetails = createAsyncThunk(
  "/company/gettaskDetails",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await taskServices.gettaskDetails(reqData);
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

export const updatetaskFunc = createAsyncThunk(
  "/updatetaskFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await taskServices.updatetaskFunc(reqData);
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

export const deletetaskFunc = createAsyncThunk(
  "/deletetaskFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await taskServices.deletetaskFunc(reqData);
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

export const statusupdatetaskFunc = createAsyncThunk(
  'file/statusupdatetaskFunc',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await taskServices.statusupdatetaskFunc(formData);
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


const taskSlice = createSlice({
  name: 'taskManagement',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getTaskList.pending, (state, action) => {
        state.loading = true;
        state.taskList = [];
        state.totalTaskCount = 0;
      })
      .addCase(getTaskList.fulfilled, (state, action) => {
        state.taskList = action.payload?.data?.docs;
        state.totalTaskCount = action?.payload?.data?.totalDocs;
        state.taskDetailsData = null;
        state.loading = false;
      })
      .addCase(getTaskList.rejected, (state, action) => {
        state.loading = false;
        state.taskList = [];
        state.totalTaskCount = 0;
      })
      .addCase(taskSearch.pending, (state, action) => {
        state.loading = true;
        state.taskList = [];
        state.totalTaskCount = 0;
      })
      .addCase(taskSearch.fulfilled, (state, action) => {
        state.taskList = action.payload?.data?.docs;
        state.totalTaskCount = action.payload?.data?.totalDocs;
        state.taskDetailsData = null; 
        state.loading = false;
      })
      .addCase(taskSearch.rejected, (state, action) => {
        state.loading = false;
        state.taskList = [];
        state.totalTaskCount = 0;
      })
      .addCase(createTaskFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTaskFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.createTaskData = action.payload?.taskinfo?.data;
      })
      .addCase(createTaskFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatetaskFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatetaskFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updatetaskFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletetaskFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletetaskFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deletetaskFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(gettaskDetails.pending, (state, action) => {
        state.loading = true;
        state.taskDetailsData = null;
      })
      .addCase(gettaskDetails.fulfilled, (state, action) => {
        state.taskDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(gettaskDetails.rejected, (state, action) => {
        state.loading = false;
        state.taskDetailsData = null;
      })
      .addCase(statusupdatetaskFunc.pending, (state, action) => {
        state.loading = true;
        state.taskDetailsData = null;
      })
      .addCase(statusupdatetaskFunc.fulfilled, (state, action) => {
        state.taskStatusDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(statusupdatetaskFunc.rejected, (state, action) => {
        state.loading = false;
        state.taskDetailsData = null;
      })

      .addCase(dashboardTaskReq.pending, (state, action) => {
        state.loading = true;
        state.dashboardTaskRequest = null;
      })
      .addCase(dashboardTaskReq.fulfilled, (state, action) => {
        state.dashboardTaskRequest = action.payload?.data;
        state.loading = false;
      })
      .addCase(dashboardTaskReq.rejected, (state, action) => {
        state.loading = false;
        state.dashboardTaskRequest = null;
      });
  },
});

export default taskSlice.reducer;
