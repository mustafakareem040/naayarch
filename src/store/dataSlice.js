import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        categories: [],
        subcategories: [],
    },
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setSubcategories: (state, action) => {
            state.subcategories = action.payload;
        },
    },
});

export const { setCategories, setSubcategories } = dataSlice.actions;
export default dataSlice.reducer;