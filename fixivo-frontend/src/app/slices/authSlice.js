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
      state.accessToken = accessToken || null;
      state.refreshToken = refreshToken || null;
      state.role = role;
      // Only set as authenticated if we have at least an access token
      state.isAuthenticated = !!accessToken;
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
      
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      if (provider) {
        localStorage.setItem("provider", JSON.stringify(provider));
      }
    },
    restoreAuth: (state) => {
      const user = localStorage.getItem("user");
      const role = localStorage.getItem("role");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const provider = localStorage.getItem("provider");

      // Restore if we have valid tokens and user data
      if (accessToken && user) {
        state.user = JSON.parse(user);
        state.role = role;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.provider = provider ? JSON.parse(provider) : null;
        state.isAuthenticated = true;
      } else {
        // Clear all auth data if tokens are missing
        state.user = null;
        state.provider = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.role = null;
      }
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
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("provider");
      localStorage.removeItem("customerActiveTab");
      localStorage.removeItem("providerFilterTab");
    }
  }
});

export const { setAuth, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
