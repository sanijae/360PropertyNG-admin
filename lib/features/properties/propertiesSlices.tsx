import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';

interface Photo {
    picture: string;
  }
interface HostedBy{
  name: string;
  email: string;
  title: string;
  phone: string;
}
interface Post {
  _id: string;
  name: string;
  desc: string;
  type: string;
  category: string;
  city?: string;
  state?: string;
  address?: string;
  price: number;
  minPrice?: string;
  maxPrice?: string;
  duration?: string;
  negotiable?: string;
  availability?: string;
  photos: Photo[];
  shops?: number;
  beds?: number;
  rooms?: number;
  toilets?: number;
  bathrooms?: number;
  safety?: string[];
  amenities?: object[];
  features?: object[];
  hostedBy: HostedBy;
  createdAt: string;
}

interface PostState {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  totalPages: 0,
  currentPage:1,
  loading: false,
  error: null,
};


export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (page: number) => {
    const response = await api.get(`/property/?page=${page}`);
    return response.data;
  }
);

export const filterPosts = createAsyncThunk(
  "posts/filterPosts",
  async ({page, query}:{page: number, query: any}) => {
    const params = new URLSearchParams(query).toString();
    const response = await api.get(`/property/search?${params}`);
    return response.data;
  }
);


export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ userId, postData }: { userId: string; postData: Omit<Post, 'id' | 'createdAt'> }) => {
    const response = await api.post(`/property/newPost/${userId}`, postData);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }: { postId: string; postData: Partial<Post> }) => {
    const response = await api.put(`/property/${postId}`, postData);
    return response.data;
  }
);

export const deletePost = createAsyncThunk('posts/deletePost', async (id: string) => {
  await api.delete(`/property/delete/${id}`);
  return id;
});

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.result;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(filterPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.result;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage
      })
      .addCase(filterPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      });
  },
});

export default postSlice.reducer;