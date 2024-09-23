import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
      addUser: (state, action) => {
        return { ...action.payload }; // Store the full user data
      },
      removeUser: () => {
        return null; // Reset user state on logout
      },
    },
  });
  
export const {addUser,removeUser}  = userSlice.actions;

export default userSlice.reducer