import { createSlice, createAsyncThunk , } from "@reduxjs/toolkit";


// read the posts
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await fetch("https://sore-bubbly-beanie.glitch.me/api/comments");
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// add the new post
export const insertComments = createAsyncThunk(
  "comments/insertComments",
  async (newComment, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await fetch("https://sore-bubbly-beanie.glitch.me/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const commentSlice = createSlice({
    name:"comments",
    initialState:{comments:[] , statusComment:"idle" , errorComment:null},
    reducers:{},
    extraReducers:(builder)=>{
builder.addCase(fetchComments.pending, (state) => {
        state.statusComment = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.statusComment = "succeeded";

        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.statusComment = "failed";
        state.errorComment = action.payload || action.errorComment.message;
      });

            // Create Post cases
            builder 
            .addCase(insertComments.pending, (state) => {
              state.statusComment = "loading";
            })
            .addCase(insertComments.fulfilled, (state, action) => {
              state.statusComment = "succeeded";
              // Add the new post to the state
              state.comments.push(action.payload);

      
            })
            .addCase(insertComments.rejected, (state, action) => {
              state.statusComment = "failed";
              state.error = action.payload || action.error.message;
            });
    }

})

export default commentSlice.reducer;