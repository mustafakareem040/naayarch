import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        items: [],
        info: {},
        coupon_id: null,
        shippingAddress: null,
        note: '',
        paymentMethod: 'Cash On Delivery'
    },
    reducers: {
        setOrder: (state, action) => {
            return { ...state, ...action.payload };
        },
        addOrderItem: (state, action) => {
            state.items.push(action.payload);
        },
        setShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
        },
        setNote: (state, action) => {
            state.note = action.payload;
        },
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        }
    },
});

export const { setOrder, addOrderItem, setShippingAddress, setNote, setPaymentMethod } = orderSlice.actions;
export default orderSlice.reducer;