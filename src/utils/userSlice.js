import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  uid: null,
  location: '', 
  JobPrefrence:'',     // Default value for location
};

const userSlice = createSlice({
  name: 'user',
  initialState, // Use the defined initial state
  reducers: {
    addUser: (state, action) => {
      return { ...state, ...action.payload }; // Store the full user data
    },
    removeUser: () => {
      return initialState; // Reset user state to initial state on logout
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
