import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager";
import { noticeBoardServices } from "../_services/_noticeBoard_services";


const initialState = {
  
};


export const createNoticeBoard = createAsyncThunk(
  "noticeBoard/createNoticeBoard",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await noticeBoardServices.createNoticeBoard(userData);
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message || error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const listNoticeBoard = createAsyncThunk(
  "noticeBoard/listNoticeBoard",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await noticeBoardServices.listNoticeBoard(userData);
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
export const updateNoticeBoard = createAsyncThunk(
  "noticeBoard/updateNoticeBoard",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await noticeBoardServices.updateNoticeBoard(userData);
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
export const deleteNoticeBoard = createAsyncThunk(
  "noticeBoard/deleteNoticeBoard",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await noticeBoardServices.deleteNoticeBoard(userData);
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

const noticeBoardSlice = createSlice({
  name: "noticeBoard",
  initialState,
  reducers: {
    logout(state) {
      state.loggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNoticeBoard.pending, (state) => {
        state.createNoticeBoard_loading = true;
      })
      .addCase(createNoticeBoard.fulfilled, (state, action) => {
        state.createNoticeBoard_loading = false;
        state.createNoticeBoardData = action.payload?.data;
      })
      .addCase(createNoticeBoard.rejected, (state, action) => {
        state.createNoticeBoard_loading = false;
        state.error = action.payload;
      })      
      .addCase(listNoticeBoard.pending, (state) => {
        state.listNoticeBoard_loading = true;
        state.listNoticeBoardData = [];
      })
      .addCase(listNoticeBoard.fulfilled, (state, action) => {
        state.listNoticeBoard_loading = false;
        state.listNoticeBoardData = action.payload?.data;
      })
      .addCase(listNoticeBoard.rejected, (state, action) => {
        state.listNoticeBoard_loading = false;
        state.listNoticeBoardData = [];
        state.error = action.payload;
      })      
      .addCase(updateNoticeBoard.pending, (state) => {
        state.updateNoticeBoard_loading = true;
      })
      .addCase(updateNoticeBoard.fulfilled, (state, action) => {
        state.updateNoticeBoard_loading = false;
        state.updateNoticeBoardData = action.payload?.data;
      })
      .addCase(updateNoticeBoard.rejected, (state, action) => {
        state.updateNoticeBoard_loading = false;
        state.error = action.payload;
      })      
      .addCase(deleteNoticeBoard.pending, (state) => {
        state.deleteNoticeBoard_loading = true;
      })
      .addCase(deleteNoticeBoard.fulfilled, (state, action) => {
        state.deleteNoticeBoard_loading = false;
        state.deleteNoticeBoardData = action.payload?.data;
      })
      .addCase(deleteNoticeBoard.rejected, (state, action) => {
        state.deleteNoticeBoard_loading = false;
        state.error = action.payload;
      })      
  },
});


export const { logout } = noticeBoardSlice.actions;

export default noticeBoardSlice.reducer;
