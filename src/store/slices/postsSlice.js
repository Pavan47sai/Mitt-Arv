import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for posts API calls
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 10, search = '', tag = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(tag && { tag }),
      });
      
      const response = await fetch(`/api/posts/?${params}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch posts');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyPosts = createAsyncThunk(
  'posts/fetchMyPosts',
  async ({ page = 1, limit = 10, status = 'all' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status !== 'all' && { status }),
      });
      
      const response = await fetch(`/api/posts/my?${params}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch posts');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch post');
      }
      
      const data = await response.json();
      return data.post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ title, content, tags = [], status = 'draft', featured = false }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content, tags, status, featured }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create post');
      }
      
      const data = await response.json();
      return data.post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, title, content, tags, status, featured }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content, tags, status, featured }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update post');
      }
      
      const data = await response.json();
      return data.post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete post');
      }
      
      return postId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to toggle like');
      }
      
      const data = await response.json();
      return { postId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add comment');
      }
      
      const data = await response.json();
      return data.post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  posts: [],
  myPosts: [],
  currentPost: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  myPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Posts
      .addCase(fetchMyPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.myPosts = action.payload.posts;
        state.myPagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Post By ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
        state.error = null;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.myPosts.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myPosts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.myPosts[index] = action.payload;
        }
        if (state.currentPost && state.currentPost._id === action.payload._id) {
          state.currentPost = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.myPosts = state.myPosts.filter(post => post._id !== action.payload);
        if (state.currentPost && state.currentPost._id === action.payload) {
          state.currentPost = null;
        }
      })
      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, likesCount, isLiked } = action.payload;
        const post = state.posts.find(p => p._id === postId);
        if (post) {
          post.likesCount = likesCount;
          post.isLiked = isLiked;
        }
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost.likesCount = likesCount;
          state.currentPost.isLiked = isLiked;
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.currentPost && state.currentPost._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentPost, setCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;

