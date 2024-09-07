// slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    email: '',
    password: '',
    phone: '',
    loggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            return { ...state, ...action.payload };
        },
        clearUser: () => {
            return initialState;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;