import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  project?: {
    _id: string;
    title: string;
  };
  task?: {
    _id: string;
    title: string;
  };
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};


export const getNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>("notification/getNotifications", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/notifications");
    return res.data.notifications;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch notifications",
    );
  }
});


export const markAsRead = createAsyncThunk<
  Notification,
  string,
  { rejectValue: string }
>("notification/markAsRead", async (id, { rejectWithValue }) => {
  try {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data.notification;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to mark notification as read",
    );
  }
});

export const markAllAsRead = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("notification/markAllAsRead", async (_, { rejectWithValue }) => {
  try {
    await api.put("/notifications/read-all");
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to mark all notifications",
    );
  }
});


export const deleteNotification = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notification/deleteNotification", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/notifications/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete notification",
    );
  }
});

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })

      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.notifications = [];
        state.error = action.payload || "Something went wrong";
      })

      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (notification) => notification._id === action.payload._id,
        );

        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      })

      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (notification) => notification._id !== action.payload,
        );
      });
  },
});

export default notificationSlice.reducer;
