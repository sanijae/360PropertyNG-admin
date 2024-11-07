import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'utils/api'

interface Posts{
  posts: object[];
}
interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  address: string;
  imageUrl: string;
  title: string;
  license: string;
  phone: number;
  posts:Posts[];
  isVerified: boolean;
}

interface UserState {
  users: User[];
  user: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  user: [],
  currentUser: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk('user/register', async (userData: Omit<User, 'id'>) => {
  const response = await api.post('/user/register', userData);
  return response.data;
});

export const loginUser = createAsyncThunk('user/login', async (credentials: { email: string; password: string }) => {
  const response = await api.post('/user/login', credentials);
  return response.data;
});

export const fetchUser = createAsyncThunk('user/fetchUser', async (id: string) => {
  const response = await api.get('/user/'+id);
  return response.data;
});

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  const response = await api.get('/user/');
  return response.data;
});

export const updateUser = createAsyncThunk('user/updateUser', 
  async ({id, data}:{id:any,data:any}) => {
  const response = await api.put(`/user/update-notes/${id}`, data);
  return response.data;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id: string) => {
  const res = await api.delete(`/user/delete/${id}`);
  return res.data;
}); 

// Create a slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.result; 
        // state.count = action.payload.count;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.result; 
        // state.count = action.payload.count;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload); 
      });
  },
});

export const { setCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;
