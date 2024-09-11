import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
    name: 'order',
    initialState: [],
    reducers: {
        setOrder: (state, action) => {
            return action.payload;
        },
        addOrder: (state, action) => {
            state.push(action.payload);
        }
    },
});

export const { setOrder, addOrder } = orderSlice.actions;
export default orderSlice.reducer;