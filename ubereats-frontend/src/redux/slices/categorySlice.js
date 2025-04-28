import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [],
    selectedCategory: null, // Add selectedCategory to the state
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setSelectedCategory: (state, action) => { // Add reducer for selectedCategory
            state.selectedCategory = action.payload;
        },
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
        removeCategory: (state, action) => {
            state.categories = state.categories.filter(category => category.id !== action.payload);
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex(category => category.id === action.payload.id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
    },
});

export const { setCategories, setSelectedCategory, addCategory, removeCategory, updateCategory } = categorySlice.actions;

export default categorySlice.reducer;