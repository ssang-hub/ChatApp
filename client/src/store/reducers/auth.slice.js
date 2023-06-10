import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: {},
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    lougout: (state) => {
      state.isAuthenticated = false;
      state.user = {};
      state.accessToken = null;
      state.refreshToken = null;
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});
export const { login, lougout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
