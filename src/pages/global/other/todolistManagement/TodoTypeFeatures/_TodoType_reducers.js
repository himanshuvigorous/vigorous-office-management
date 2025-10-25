import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { TodoServices } from "./_Todo_services";




export const getTodoList = createAsyncThunk(
  "user/getTodoList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await TodoServices.getTodoList(reqData);
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

export const AssetInventrySearch = createAsyncThunk(
  "user/AssetInventrySearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await TodoServices.AssetInventrySearch(reqData);
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
export const CreateTodoListAction = createAsyncThunk(
  "user/CreateTodoListAction",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await TodoServices.CreateTodoList(reqData);
      showNotification({
        message: respose?.message,
        type: 'success',
      });
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

export const deleteTodoData = createAsyncThunk(
  "user/deleteTodoData",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await TodoServices.deleteTodoData(reqData);
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
export const statusTodoList = createAsyncThunk(
  "user/statusTodoList",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await TodoServices.statusTodoList(reqData);
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

export const updateTodoList = createAsyncThunk(
  "user/updateTodoList",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await TodoServices.updateTodoList(reqData);
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
export const assetInventryDetails = createAsyncThunk(
  "user/assetInventryDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await TodoServices.assetInventryDetails(reqData);
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
const todoListSlice = createSlice({
  name: 'todoList',
  initialState: {
    employeeDocumentList: [],
    totalUserDesignationCount: 0,
    employeeDocDetails: {},
    TodoListData: []
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
     
      .addCase(getTodoList.pending, (state, action) => {
        state.loading = true;
        state.TodoListData = [];
      })
      .addCase(getTodoList.fulfilled, (state, action) => {
        state.TodoListData = action.payload?.data?.docs;
        state.loading = false;
      })
      .addCase(getTodoList.rejected, (state, action) => {
        state.loading = false;
        state.TodoListData = [];
      })
      .addCase(AssetInventrySearch.pending, (state, action) => {
        state.loading = true;
        state.AssetInventryListData = [];
        state.totalAssetInventryListCount = 0;
      })
      .addCase(AssetInventrySearch.fulfilled, (state, action) => {
        state.AssetInventryListData = action.payload?.data?.docs;
        state.totalAssetInventryListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(AssetInventrySearch.rejected, (state, action) => {
        state.loading = false;
        state.AssetInventryListData = [];
        state.totalAssetInventryListCount = 0;
      })
      .addCase(CreateTodoListAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(CreateTodoListAction.fulfilled, (state, action) => {
        state.loading = false;
        state.CreateTodoListActionData = action.payload;
      })
      .addCase(CreateTodoListAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTodoData.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTodoData.fulfilled, (state, action) => {
        state.loading = false;
        state.AssetInventryDeleteData = action.payload;
      })
      .addCase(deleteTodoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statusTodoList.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusTodoList.fulfilled, (state, action) => {
        state.loading = false;
        state.AssetInventryDeleteData = action.payload;
      })
      .addCase(statusTodoList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTodoList.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTodoList.fulfilled, (state, action) => {
        state.loading = false;
        state.toDoUpdateData = action.payload;
      })
      .addCase(updateTodoList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assetInventryDetails.pending, (state) => {
        state.loading = true;
        state.assetsInventryDetailsData = null;

      })
      .addCase(assetInventryDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.assetsInventryDetailsData = action.payload?.data;
      })
      .addCase(assetInventryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.assetsInventryDetailsData = null;
      })
  },
});

export default todoListSlice.reducer;
