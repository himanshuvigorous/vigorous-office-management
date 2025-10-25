import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { DepartmentServices } from "./_department_services";

export const getDepartmentList = createAsyncThunk(
  "user/departmentList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await DepartmentServices.getDepartmentList(reqData);
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

export const deptSearch = createAsyncThunk(
  "user/deptSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await DepartmentServices.departmentSearch(userData);
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

export const getDepartmentById = createAsyncThunk(
  "user/getDepartmentById",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await DepartmentServices.getDepartmentById(userData);
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

export const createDepartmentFunc = createAsyncThunk(
  "user/createDepartmentFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await DepartmentServices.DepartmentCreate(userData);
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

export const updateDepartmentFunc = createAsyncThunk(
  "user/updateDepartmentFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await DepartmentServices.DepartmentUpdate(userData);
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

export const deleteDepartmentFunc = createAsyncThunk(
  "user/deleteDepartmentFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await DepartmentServices.DepartmentDelete(userData);
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

const departmentSlice = createSlice({
  name: 'department',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getDepartmentList.pending, (state, action) => {
        state.loading = true;
        state.departmentListData = [];
        state.totalDepartmentCount = 0;
      })
      .addCase(getDepartmentList.fulfilled, (state, action) => {
        state.departmentListData = action.payload?.data?.docs;
        state.totalDepartmentCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getDepartmentList.rejected, (state, action) => {
        state.loading = false;
        state.departmentListData = [];
        state.totalDepartmentCount = 0;
      })
      .addCase(deptSearch.pending, (state, action) => {
        state.loading = true;
        state.departmentListData = null;
        state.totalDepartmentCount = 0;
      })
      .addCase(deptSearch.fulfilled, (state, action) => {
        state.departmentListData = action.payload?.data?.docs;
        state.totalDepartmentCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(deptSearch.rejected, (state, action) => {
        state.loading = false;
        state.departmentListData = null;
        state.totalDepartmentCount = 0;
      })
      .addCase(createDepartmentFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDepartmentFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentCreateData = action.payload;
      })
      .addCase(createDepartmentFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDepartmentFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDepartmentFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentUpdateData = action.payload;
      })
      .addCase(updateDepartmentFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDepartmentFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDepartmentFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentDeleteData = action.payload;
      })
      .addCase(deleteDepartmentFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDepartmentById.pending, (state) => {
        state.loading = true;
        state.departmentByIdData = null;
      })

      .addCase(getDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentByIdData = action.payload;
      })
      .addCase(getDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.departmentByIdData = null;
      })
  },
});

export default departmentSlice.reducer;
