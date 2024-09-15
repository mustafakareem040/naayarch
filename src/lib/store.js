// lib/store.js
import { configureStore } from '@reduxjs/toolkit';
import addressesReducer from './features/addressesSlice';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import orderReducer from './features/orderSlice';
import wishlistReducer from './features/wishlistSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            addresses: addressesReducer,
            auth: authReducer,
            user: userReducer,
            order: orderReducer,
            wishlist: wishlistReducer
        },
    });
};