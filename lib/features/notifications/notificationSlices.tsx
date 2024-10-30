import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'utils/api';

interface Notification {
  id: string;
  sender: string;
  receiver: string;
  title: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
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

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await api.get(`/Notifications/`);
    return response.data;
  }
);

export const fetchUserNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId: string) => {
    const response = await api.get(`/Notifications/${userId}`);
    return response.data;
  }
);

export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const response = await api.post('/Notifications/', notificationData);
    return response.data;
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: string) => {
    await api.delete(`/notifications/${notificationId}`);
    return notificationId;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.result;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notifications.push(action.payload);
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n.id === action.payload.id
        );
        if (notification) notification.status = 'read';
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload
        );
      });
  },
});

// Export the reducer
export default notificationSlice.reducer;
