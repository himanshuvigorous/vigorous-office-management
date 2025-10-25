import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


import { taskTypeServices } from "./_task_services";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";


export const getTaskTypeList = createAsyncThunk(
  "user/gettaskTypeList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await taskTypeServices.getTaskTypeList(reqData);
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

export const taskTypeSearch = createAsyncThunk(
  "user/taskTypeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await taskTypeServices.taskTypeSearch(reqData);
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

export const getTaskTypeDetails = createAsyncThunk(
  "user/gettaskTypeDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await taskTypeServices.getTaskTypeDetails(reqData);
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

export const createTaskType = createAsyncThunk(
  "user/createtaskType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await taskTypeServices.createTaskType(reqData);
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

export const updateTaskType = createAsyncThunk(
  "user/updatetaskType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await taskTypeServices.updateTaskType(reqData);
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
export const deleteTaskType = createAsyncThunk(
  "user/deletetaskType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await taskTypeServices.deleteTaskType(reqData);
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

const taskTypeSlice = createSlice({
  name: 'taskType',
  initialState: {
    taskTypeList: [],
    totaltaskTypeCount: 0,
    taskTypeDetails: {}
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getTaskTypeList.pending, (state, action) => {
        state.loading = true;
        state.taskTypeList = [];
        state.totalTaskTypeCount = 0;
      })
      .addCase(getTaskTypeList.fulfilled, (state, action) => {
        state.taskTypeList = action.payload?.data?.docs;
        state.totalTaskTypeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getTaskTypeList.rejected, (state, action) => {
        state.loading = false;
        state.taskTypeList = [];
        state.totalTaskTypeCount = 0;
      })
      .addCase(taskTypeSearch.pending, (state, action) => {
        state.loading = true;
        state.taskTypeList = [];
        state.totalTaskTypeCount = 0;
      })
      .addCase(taskTypeSearch.fulfilled, (state, action) => {
        state.taskTypeList = action.payload?.data?.docs;
        state.totalTaskTypeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(taskTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.taskTypeList = [];
        state.totalTaskTypeCount = 0;
      })
      .addCase(createTaskType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTaskType.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeCreateData = action.payload;
      })
      .addCase(createTaskType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTaskType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskType.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeUpdateData = action.payload;
      })
      .addCase(updateTaskType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTaskType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTaskType.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypetDeleteData = action.payload;
      })
      .addCase(deleteTaskType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTaskTypeDetails.pending, (state) => {
        state.loading = true;
        state.taskTypeDetails = null;
      })
      .addCase(getTaskTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.taskTypeDetails = action.payload?.data;
      })
      .addCase(getTaskTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.taskTypeDetails = null;
      })
  },
});

export default taskTypeSlice.reducer;
