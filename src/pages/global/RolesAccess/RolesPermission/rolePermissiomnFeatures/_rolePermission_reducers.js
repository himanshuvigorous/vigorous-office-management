import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


import { rolePermissionServices } from "./_rolePermission_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";


export const getRolesPermissionList = createAsyncThunk(
  "user/getRolesPermissionList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await rolePermissionServices.getRolesPermissionList(reqData);
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

export const RolesPermissionSearch = createAsyncThunk(
  "user/RolesPermissionSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await rolePermissionServices.RolesPermissionSearch(reqData);
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

export const getPermissionsDetails = createAsyncThunk(
  "user/getPermissionsDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await rolePermissionServices.getPermissionsDetails(reqData);
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

export const createRolePermission = createAsyncThunk(
  "user/createRolePermission",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await rolePermissionServices.createRolePermission(reqData);
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

export const updateRolesAndPermissions = createAsyncThunk(
  "user/updateRolesAndPermissions",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await rolePermissionServices.updateRolesAndPermissions(reqData);
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
export const deleteRolesAndPermissions = createAsyncThunk(
  "user/deleteRolesAndPermissions",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await rolePermissionServices.deleteRolesAndPermissions(reqData);
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
export const getPageRole = createAsyncThunk(
  "user/getPageRole",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await rolePermissionServices.getPageRole(reqData);
     
      return response;
    } catch (error) {
      
      return rejectWithValue(error.message);
    }
  }
);

const rolePermissionSlice = createSlice({
  name: 'rolePemission',
  initialState: {
    designationList: [],
    totalDesignationCount: 0,
    designationDetails: {},
    rolesPermissionList:{}
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getRolesPermissionList.pending, (state, action) => {
        state.loading = true;
        state.rolesPermissionList = [];
        state.totalrolesPermissionCount = 0;
      })
      .addCase(getRolesPermissionList.fulfilled, (state, action) => {
        state.rolesPermissionList = action.payload?.data;
        state.totalrolesPermissionCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getRolesPermissionList.rejected, (state, action) => {
        state.loading = false;
        state.rolesPermissionList = [];
        state.totalrolesPermissionCount = 0;
      })
      .addCase(RolesPermissionSearch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(RolesPermissionSearch.fulfilled, (state, action) => {
        state.rolesPermissionList = action.payload?.data?.docs;
        state.totalrolesPermissionCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(RolesPermissionSearch.rejected, (state, action) => {
        state.loading = false;
        state.rolesPermissionList = [];
        state.totalrolesPermissionCount = 0;
      })
      .addCase(createRolePermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRolePermission.fulfilled, (state, action) => {
        state.loading = false;
        state.rolePermissionCreateData = action.payload;
      })
      .addCase(createRolePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRolesAndPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRolesAndPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeUpdateData = action.payload;
      })
      .addCase(updateRolesAndPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRolesAndPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRolesAndPermissions.fulfilled, (state, action) => {
        state.loading = false;
        // state.rolesPermissiontDeleteData = action.payload;
      })
      .addCase(deleteRolesAndPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPermissionsDetails.pending, (state) => {
        state.loading = true;
        state.roleAccessDetails = null;
      })
      .addCase(getPermissionsDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.roleAccessDetails = action.payload?.data;
      })
      .addCase(getPermissionsDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.roleAccessDetails = null;

      })
      .addCase(getPageRole.pending, (state) => {
        state.loading = true;
        state.PageRoleData = [];
      })
      .addCase(getPageRole.fulfilled, (state, action) => {
        state.loading = false;
        state.PageRoleData = action.payload?.data;
      })
      .addCase(getPageRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.PageRoleData = [];

      })
  },
});

export default rolePermissionSlice.reducer;
