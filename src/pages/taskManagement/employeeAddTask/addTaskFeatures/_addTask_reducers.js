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
        state.totalTaskCount = action.payload?.data?.totalDocs;
        state.taskDetailsData = null;
        state.loading = false;
      })
      .addCase(getTaskList.rejected, (state, action) => {
        state.loading = false;
        state.taskList = [];
        state.totalTaskCount = 0;
      })
      
     

  },
});

export default taskSlice.reducer;
