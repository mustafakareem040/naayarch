// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    address: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.productId !== action.payload);
        },
        updateQuantity: (state, action) => {
            const item = state.items.find(item => item.productId === action.payload.productId);
            if (item) {
                item.qty = action.payload.qty;
            }
        },
        setAddress: (state, action) => {
            state.address = action.payload;
        },
        clearCart: () => {
            return initialState;
        },
    },
});

export const { addItem, removeItem, updateQuantity, setAddress, clearCart } = cartSlice.actions;
export default cartSlice.reducer;