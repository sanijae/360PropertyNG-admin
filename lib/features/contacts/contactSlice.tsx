import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from 'utils/api';

interface Contact {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date | number | string | any;
}

interface ContactState {
  contacts: Contact[];
  contact: any,
  loading: boolean;
  success: boolean;
  deleteSuccess: boolean;
  addSuccess: boolean;
  error: string | null;
}

const initialState: ContactState = {
  contacts: [],
  contact: null,
  loading: false,
  success: false,
  addSuccess: false,
  deleteSuccess: false,
  error: null,
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async () => {
    const response = await api.get('/contact/');
    return response.data;
  }
);

export const fetchContact = createAsyncThunk(
  'contacts/fetchContact',
  async (id:any) => {
    const response = await api.get('/contact/'+id);
    return response.data;
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contactData: Contact) => {
    const response = await api.post('/contact/add', contactData);
    return response.data;
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, data }: { id: string; data: Partial<Contact> }) => {
    const response = await api.put(`/contact/update/${id}`, data);
    return response.data;
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id: string) => {
    const response = await api.delete(`/contact/delete/${id}`);
    return response.data;
  }
);

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    resetDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
    resetAddSuccess: (state) => {
      state.addSuccess = false;
    },
    resetSuccess: (state) => {
      state.success = false
    },
    resetError: (state) => {
      state.error = null;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true
        state.contacts = action.payload.result;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message || 'Failed to fetch contacts';
      })
      .addCase(fetchContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContact.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.contact = action.payload.result;
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contact';
      })
      .addCase(addContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        state.addSuccess = true;
        state.contact = action.payload.result;
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create contacts';
      })
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true
        state.contact = action.payload.result;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update contact';
      })
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContact.fulfilled, (state) => {
        state.loading = false;
        state.deleteSuccess = true; 
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete contact';
      });
  },
});


export const { resetAddSuccess } = contactSlice.actions;
export const { resetDeleteSuccess } = contactSlice.actions;
export const { resetSuccess } = contactSlice.actions;
export const { resetError } = contactSlice.actions;
export const { resetLoading } = contactSlice.actions;
export default contactSlice.reducer;
