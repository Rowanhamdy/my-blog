import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// read the posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await fetch(
        "https://sore-bubbly-beanie.glitch.me/api/posts"
      );
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// add the new post
export const insertPosts = createAsyncThunk(
  "posts/insertPosts",
  async (newPost, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await fetch(
        "https://sore-bubbly-beanie.glitch.me/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//delete the post
export const deletePosts = createAsyncThunk(
  "posts/deletePosts",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      await fetch(`https://sore-bubbly-beanie.glitch.me/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//update the post
export const updatePosts = createAsyncThunk(
  "posts/updatePosts",
  async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await fetch(
        `https://sore-bubbly-beanie.glitch.me/api/posts/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }
      );

      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//get one post
export const getPost = createAsyncThunk(
  "posts/getPost",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await fetch(
        `https://sore-bubbly-beanie.glitch.me/api/posts/${id}`
      );
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = { posts: [], status: "idle", error: null, record: null };

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setRecord(state, action) {
      state.record = action.payload;
    },
  },
  extraReducers: (builder) => {
    //Read posts cases
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Create Post cases
    builder
      .addCase(insertPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(insertPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add the new post to the state
        state.posts.push(action.payload);
      })
      .addCase(insertPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // delete Post cases
    builder
      .addCase(deletePosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // delete post to the state
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addCase(deletePosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // update Post cases
    builder
      .addCase(updatePosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.record = action.payload;
      })
      .addCase(updatePosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // get  one Post cases
    builder
      .addCase(getPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.record = action.payload;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const postActions = postSlice.actions;
export default postSlice.reducer;
