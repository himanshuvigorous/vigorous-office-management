import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";

import { branchServices } from "./_branch_services";

export const getBranchList = createAsyncThunk(
  "getBranchList",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await branchServices.getBranchList(userData);
    
      return user;
    } catch (error) {

      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const branchSearch = createAsyncThunk(
  "user/branchSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await branchServices.branchSearch(userData);
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const branchCreate = createAsyncThunk(
  "branchCreate",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await branchServices.branchCreate(userData);
      showNotification({
        message: user?.companyinfo?.message,
        type: 'success',
      });
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const getBranchDetails = createAsyncThunk(
  "/company/getBranchDetails",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await branchServices.getBranchDetails(userData);
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);



export const updateBranch = createAsyncThunk(
  "/updateBranch",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await branchServices.updateBranch(userData);
      showNotification({
        message: user?.message,
        type: 'success',
      });
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const deleteBranch = createAsyncThunk(
  "/deleteBranch",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await branchServices.deleteBranch(userData);
      showNotification({
        message: user?.message,
        type: 'success',
      });
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const statusUpdateBranch = createAsyncThunk(
  "/statusUpdateBranch",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await branchServices.statusUpdateBranch(userData);
      showNotification({
        message: user?.message,
        type: 'success',
      });
      return user;
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
      const response = await branchServices.uploadDocFile(formData);
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


const userSlice = createSlice({
  name: 'user',
  initialState: {
  
  },
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBranchList.pending, (state, action) => {
        state.loading = true;
        state.branchList = [];
        state.totalBranchCount = 0;
      })
      .addCase(getBranchList.fulfilled, (state, action) => {
        state.branchList = action.payload?.data?.docs;
        state.totalBranchCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getBranchList.rejected, (state, action) => {
        state.loading = false;
        state.branchList = [];
        state.totalBranchCount = 0;
      })
      .addCase(branchSearch.pending, (state, action) => {
        state.branchListloading = true;
        state.branchList = null;
        state.totalBranchCount = 0;
      })
      .addCase(branchSearch.fulfilled, (state, action) => {
        state.branchList = action.payload?.data?.docs;
        state.totalBranchCount = action.payload?.data?.totalDocs;
        state.branchListloading = false;
      })
      .addCase(branchSearch.rejected, (state, action) => {
        state.branchListloading = false;
        state.branchList = null;
        state.totalBranchCount = 0;
      })
      .addCase(branchCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(branchCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.branchCreateData = action.payload;
      })
      .addCase(branchCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branchupdateData = action.payload;
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBranchDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getBranchDetails.fulfilled, (state, action) => {
        state.branchDetailsData = action.payload;
        state.loadingStatus = false;
        state.loading = false;
      })
      .addCase(getBranchDetails.rejected, (state, action) => {
        state.loadingStatus = false;
        state.branchDetailsData = null;
        state.loading = false;
      })
      .addCase(statusUpdateBranch.pending, (state, action) => {
        state.loadingStatus = true;
      })
      .addCase(statusUpdateBranch.fulfilled, (state, action) => {
        state.statusUpadteDataBranch = action.payload;
        state.loading = false;
      })
      .addCase(statusUpdateBranch.rejected, (state, action) => {
        state.loading = false;
        state.statusUpadteDataBranch = null;
      })
      .addCase(uploadDocFile.pending, (state) => {
        state.uploadStatus = 'loading';
      })
      .addCase(uploadDocFile.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        const { name, imageName, imgBaseUrl } = action.payload;
        state.fieldsMatch[name] = `${imgBaseUrl}/${imageName}`;
      })
      .addCase(uploadDocFile.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.errorMessage = action.payload;
      });
  },
});

export default userSlice.reducer;
