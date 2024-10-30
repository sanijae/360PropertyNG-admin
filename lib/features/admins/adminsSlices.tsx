import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'utils/api';

interface Admin {
  id: string;
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: number;
  password: string;
  imageUrl?: string;
  createdAt: string;
}

interface AdminState {
  _id: string;
  admins: Admin[];
  currentAdmin: Admin | null;
  admin: Admin | null;
  loading: boolean;
  error: string | null | any;
  success: boolean,
  isAuthenticated: boolean;
}

const initialState: AdminState = {
  admins: [],
  currentAdmin: null,
  admin: null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false,
  _id: ''
};

export const registerAdmin = createAsyncThunk('admin/register',
   async (adminData: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/Admin/add', adminData);
      return response.data;
    throw new Error("Invalid credentials");
  } catch (error: any) {
    console.log(error.message);
    return rejectWithValue(error.message);
  }
});

export const loginAdmin = createAsyncThunk(
  'admin/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/Admin/login', credentials);
      if (response.data.result) {
        document.cookie = `currentUser=${response.data.token}; path=/; max-age=86400`;
        return response.data;
      }
      return rejectWithValue(response.data.error);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "An unexpected error occurred.");
    }
  }
);

export const fetchAdmins = createAsyncThunk('admin/fetchAdmins', async () => {
  const response = await api.get('/Admin');
  return response.data;
});

export const fetchAdminProfile = createAsyncThunk(
  "admin/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await api.post("/Admin/profile/",{}, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAdmin = createAsyncThunk(
  "admin/fetchAdmin",
  async (id:any, { rejectWithValue }) => {
    try {
      const response = await api.get(`/Admin/${id}`);
      console.log(response.data);
      
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "An unexpected error occurred.");
    }
  }
);

export const updateAdmin = createAsyncThunk('profile/edit', 
  async ({admin, id}:{admin: Admin, id:any}, {rejectWithValue}) => {
   try {
    const response = await api.put(`/Admin/update/${id}`, admin);
    return response.data;
   } catch (error: any) {
    rejectWithValue(error.message)
   }
});

export const updateProfileImage = createAsyncThunk(
  "/profile/edit/profile-image",
  async ({ id, formData }: {id:any, formData:FormData}, { rejectWithValue }) => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await api.put(`/Admin/update-profile-image/${id}`, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const updatePassword = createAsyncThunk(
  "/profile/edit/password",
  async (
    { id, currentPassword, newPassword }: { id: any; currentPassword: string; newPassword: string }, 
    { rejectWithValue }
  ) => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await api.put(`/Admin/updatePassword/${id}`, 
        { currentPassword, newPassword }, 
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Password update failed");
    }
  }
);

export const deleteAdmin = createAsyncThunk('admin/deleteAdmin', async (id: string) => {
  await api.delete(`/Admin/delete/${id}`);
  return id;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout: (state) => {
      state.currentAdmin = null;
      document.cookie = "currentUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentAdmin = action.payload.result;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register admin';
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentAdmin = action.payload.result;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to login admin';
      })
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.currentAdmin = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.success = true;
        state.loading = false;
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.admins = action.payload.result;
      })
      // .addCase(updateAdmin.pending,(state) =>{
      //   state.loading = true;
      //   state.success = false;
      //   state.error = null;
      // })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload.result;
        state.success = true;
      })
      .addCase((updateAdmin.rejected),(state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload.result;
        state.success = true;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter(admin => admin.id !== action.payload);
      });
  },
});

export const { logout } = adminSlice.actions;
// export const { setCurrentAdmin, clearError } = adminSlice.actions;
export default adminSlice.reducer;

