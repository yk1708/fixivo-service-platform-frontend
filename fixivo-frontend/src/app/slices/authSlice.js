import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  provider: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  role: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, provider, accessToken, refreshToken, role } = action.payload;
      state.user = user;
      state.provider = provider;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.role = role;
      state.isAuthenticated = true;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.provider = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
