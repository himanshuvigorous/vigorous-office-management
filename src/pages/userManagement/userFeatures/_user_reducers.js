import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userServices } from "./_user_services";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";

export const getUserList = createAsyncThunk(
  "user/userList",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await userServices.getUserList(userData);
    
      return user;
    } catch (error) {

      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const userSearch = createAsyncThunk(
  "user/userSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await userServices.userSearch(userData);
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

export const createUserFunc = createAsyncThunk(
  "user/createUserFunc",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await userServices.userCreate(userData);
      showNotification({
        message: user?.userinfo?.data?.message,
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
export const getUserDetails = createAsyncThunk(
  "/getUserById",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await userServices.getUserDetails(userData);
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

export const getClientDetails = createAsyncThunk(
  "/getUserById",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await userServices.getClientDetails(userData);
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

export const updateUser = createAsyncThunk(
  "/updateUser",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await userServices.updateUser(userData);
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
export const deleteUser = createAsyncThunk(
  "/deleteUser",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await userServices.deleteUser(userData);
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
      const response = await userServices.uploadDocFile(formData);
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
    userList: [],
    fieldsUpdate: {},
    fieldsError: {},
    loading: false,
    totalUserCount: 0,
    permanentAddress: {},
    currentAddress: {},
    bankDetails: {},
    kycDocs: {},
    salaryAndLeaves: {},
    penalties: {},
    familyInfo: {},
    plan: {}
  },
  reducers: {
    setFieldsUpdate: (state, action) => {
      state.fieldsUpdate = action.payload;
    },
    setFieldsError: (state, action) => {
      state.fieldsError = action.payload;
    },
    setKycDocs: (state, action) => {
      state.kycDocs = action.payload;
    },
    setBankDetails: (state, action) => {
      state.bankDetails = action.payload;
    },
    setPenalties: (state, action) => {
      state.penalties = action.payload;
    },
    setSalaryAndLeaves: (state, action) => {
      state.salaryAndLeaves = action.payload;
    },
    setPermanentAddress: (state, action) => {
      state.permanentAddress = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setFamilyInfo: (state, action) => {
      state.familyInfo = action.payload;
    },
    setPlan: (state, action) => {
      state.plan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state, action) => {
        state.loading = true;
        state.userList = [];
        state.totalUserCount = 0;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.userList = action.payload?.data?.docs;
        state.totalUserCount = action.payload?.data?.total;
        state.loading = false;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.userList = [];
        state.totalUserCount = 0;
      })
      .addCase(userSearch.pending, (state, action) => {
        state.loading = true;
        state.userList = [];
        state.totalUserCount = 0;
      })
      .addCase(userSearch.fulfilled, (state, action) => {
        state.userList = action.payload?.data?.list;
        state.totalUserCount = action.payload?.data?.total;
        state.loading = false;
      })
      .addCase(userSearch.rejected, (state, action) => {
        state.loading = false;
        state.userList = [];
        state.totalUserCount = 0;
      })
      .addCase(createUserFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUserFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userCreateData = action.payload;
      })
      .addCase(createUserFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserDetails.pending, (state, action) => {
        state.loading = true;
        state.fieldsUpdate = {};
        state.permanentAddress = {};
        state.currentAddress = {};
        state.bankDetails = {};
        state.kycDocs = {};
        state.salaryAndLeaves = {};
        state.penalties = {};
        state.familyInfo = {};
        state.plan = {};
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.fieldsUpdate = action.payload?.data;
        state.permanentAddress = action.payload?.data?.permanentAddress;
        state.currentAddress = action.payload?.data?.currentAddress;
        state.bankDetails = action.payload?.data?.bankDetails;
        state.kycDocs = action.payload?.data?.kycDocs;
        state.salaryAndLeaves = action.payload?.data?.salaryAndLeaves;
        state.penalties = action.payload?.data?.penalties;
        state.familyInfo = action.payload?.data?.familyInfo;
        state.plan = action.payload?.data?.plan;
        state.loading = false;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.fieldsUpdate = {};
        state.permanentAddress = {};
        state.currentAddress = {};
        state.bankDetails = {};
        state.kycDocs = {};
        state.salaryAndLeaves = {};
        state.penalties = {};
        state.familyInfo = {};
        state.plan = {};
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
export const {
  setFieldsError,
  setFieldsUpdate,
  setKycDocs,
  setBankDetails,
  setPenalties,
  setSalaryAndLeaves,
  setCurrentAddress,
  setPermanentAddress,
  setFamilyInfo,
  setPlan
} = userSlice.actions;
export default userSlice.reducer;
