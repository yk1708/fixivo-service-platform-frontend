import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // Dummy reducer to prevent the 'valid reducer' error until you add real slices
    _placeholder: (state = {}) => state,
  },
});