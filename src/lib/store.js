// lib/store.js
import { configureStore } from '@reduxjs/toolkit';
import addressesReducer from './features/addressesSlice';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import orderReducer from './features/orderSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            addresses: addressesReducer,
            auth: authReducer,
            user: userReducer,
            order: orderReducer
        },
    });
};