import { createSlice } from '@reduxjs/toolkit';

const addressesSlice = createSlice({
    name: 'addresses',
    initialState: [],
    reducers: {
        setAddresses: (state, action) => {
            return action.payload;
        },
        addAddress: (state, action) => {
            state.push(action.payload);
        },
        updateAddress: (state, action) => {
            const { index, address } = action.payload;
            state[index] = address;
        },
        removeAddress: (state, action) => {
            state.splice(action.payload, 1);
        },
    },
});

export const { setAddresses, addAddress, updateAddress, removeAddress } = addressesSlice.actions;
export default addressesSlice.reducer;