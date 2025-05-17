import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  isLoggedIn: false,
  id: null,
};

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state,action) => {
      state.isLoggedIn = true;
      state.id = action.payload.id;
    },
    logout: (state) => {
        state.id = null;
      state.isLoggedIn = false;
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions