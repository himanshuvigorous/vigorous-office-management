import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { authServices } from "../_services/_auth_services";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager";

const initialState = {
  
};

export const login = createAsyncThunk(
  "authentication/login",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.login(userData);
      
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

export const logoutUser = createAsyncThunk(
  "authentication/logoutUser",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.logoutUser(userData);
      
      showNotification({
        message: user?.message,
        type: 'success',
      });
      return user;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);



export const reload = createAsyncThunk(
  "authentication/reload",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.reload(userData);
      
      // showNotification({
      //   message: user?.message,
      //   type: 'success',
      // });
      return user;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);


export const authToken = createAsyncThunk(
  "authentication/authToken",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.authToken(userData);
      
      showNotification({
        message: user?.userinfo?.message,
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
export const getAuthData = createAsyncThunk(
  "authentication/getAuthData",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.getAuthData(userData);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getUserDetailsForLogin = createAsyncThunk(
  "authentication/getUserDetailsForLogin",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.getUserDetailsForLogin(userData);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const ProfileImageUpdate = createAsyncThunk(
  "authentication/ProfileImageUpdate",
  async (userData, { rejectWithValue , dispatch }) => {
    try {
      const user = await authServices.ProfileImageUpdate(userData);
      showNotification({
        message: user?.userinfo?.message,
        type: 'success',
      });

      dispatch(getAuthData())
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
export const changePasswordFunc = createAsyncThunk(
  "authentication/changePasswordFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.changePasswordFunc(userData);
      
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

export const sendOtpFunc = createAsyncThunk(
  "authentication/sendOtpFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.sendOtpFunc(userData);
      
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
export const verifyOtpFunc = createAsyncThunk(
  "authentication/verifyOtpFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.verifyOtpFunc(userData);
      
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
export const restPassowrdFunc = createAsyncThunk(
  "authentication/restPassowrdFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.restPassowrdFunc(userData);
      
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


const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    logout(state) {
      state.loggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.login_loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login_loading = false;
        state.loggedIn = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.login_loading = false;
        state.error = action.payload;
      })
      

       .addCase(logoutUser.pending, (state) => {
        state.logoutUser_loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.logoutUser_loading = false;
        state.logout = true;
        state.user = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutUser_loading = false;
        state.error = action.payload;
      })

        .addCase(reload.pending, (state) => {
        state.reload_loading = true;
      })
      .addCase(reload.fulfilled, (state, action) => {
        state.reload_loading = false;
        state.reloaded = true;
        state.user = action.payload;
      })
      .addCase(reload.rejected, (state, action) => {
        state.reload_loading = false;
        state.error = action.payload;
      })


      .addCase(authToken.pending, (state) => {
        state.authToken_loading = true;
      })
      .addCase(authToken.fulfilled, (state, action) => {
        state.authToken_loading = false;
        state.loggedIn = true;
        state.user = action.payload;
      })
      .addCase(authToken.rejected, (state, action) => {
        state.authToken_loading = false;
        state.error = action.payload;
      })
      .addCase(getUserDetailsForLogin.pending, (state) => {
        state.getUserDetailsForLogin_loading = true;
        state.userDataForLogin = [];
      })
      .addCase(getUserDetailsForLogin.fulfilled, (state, action) => {
        state.getUserDetailsForLogin_loading = false;
        state.loggedIn = true;
        state.userDataForLogin = action.payload;
      })
      .addCase(getUserDetailsForLogin.rejected, (state, action) => {
        state.getUserDetailsForLogin_loading = false;
        state.error = action.payload;
        state.userDataForLogin = [];
      })
      .addCase(ProfileImageUpdate.pending, (state) => {
        state.ProfileImageUpdate_loading = true;
      })
      .addCase(ProfileImageUpdate.fulfilled, (state, action) => {
        state.ProfileImageUpdate_loading = false;
        state.loggedIn = true;
        state.user = action.payload;
      })
      .addCase(ProfileImageUpdate.rejected, (state, action) => {
        state.ProfileImageUpdate_loading = false;
        state.error = action.payload;
      })
      .addCase(changePasswordFunc.pending, (state) => {
        state.changePasswordFunc_loading = true;
      })
      .addCase(changePasswordFunc.fulfilled, (state, action) => {
        state.changePasswordFunc_loading = false;
        state.userpassworrdData = action.payload;
      })
      .addCase(changePasswordFunc.rejected, (state, action) => {
        state.changePasswordFunc_loading = false;
        state.error = action.payload;
      })
      .addCase(sendOtpFunc.pending, (state) => {
        state.sendOtpFunc_loading = true;
      })
      .addCase(sendOtpFunc.fulfilled, (state, action) => {
        state.sendOtpFunc_loading = false;
        state.userpassworrdData = action.payload;
      })
      .addCase(sendOtpFunc.rejected, (state, action) => {
        state.sendOtpFunc_loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtpFunc.pending, (state) => {
        state.verifyOtpFunc_loading = true;
      })
      .addCase(verifyOtpFunc.fulfilled, (state, action) => {
        state.verifyOtpFunc_loading = false;
        state.userpassworrdData = action.payload;
      })
      .addCase(verifyOtpFunc.rejected, (state, action) => {
        state.verifyOtpFunc_loading = false;
        state.error = action.payload;
      })
      .addCase(restPassowrdFunc.pending, (state) => {
        state.restPassowrdFunc_loading = true;
      })
      .addCase(restPassowrdFunc.fulfilled, (state, action) => {
        state.restPassowrdFunc_loading = false;
        state.userpassworrdData = action.payload;
      })
      .addCase(restPassowrdFunc.rejected, (state, action) => {
        state.restPassowrdFunc_loading = false;
        state.error = action.payload;
      })
      
  },
});

export const { logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;
