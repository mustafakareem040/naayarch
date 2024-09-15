import { createSlice, createSelector } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
    name: 'wishlist',  // Changed from 'auth' to 'wishlist' to match the slice's purpose
    initialState: {
        items: []  // Changed from 'wishlist' to 'items' for clarity
    },
    reducers: {
        setWishlist: (state, action) => {
            state.items = action.payload;
        },
        deleteWishlist: (state, action) => {
            state.items = state.items.filter((item, index) => index !== action.payload);
        },
        addWishlist: (state, action) => {
            state.items.push(action.payload);
        },
    },
});

export const { setWishlist, addWishlist, deleteWishlist } = wishlistSlice.actions;

// Selector to get wishlist item by product ID
export const getWishlistByProductId = (state, productId) =>
    state.wishlist.items.find(item => item.id === productId || item.product_id === productId);

export default wishlistSlice.reducer;