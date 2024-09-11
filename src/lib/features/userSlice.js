import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        info: null,
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.info = action.payload;
        },
        clearUserInfo: (state) => {
            state.info = null;
        },
    },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;