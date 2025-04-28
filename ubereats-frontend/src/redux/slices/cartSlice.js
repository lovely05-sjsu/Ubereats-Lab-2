import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) {
                item.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            const itemPrice = state.items.find(i => i.id === action.payload.id)?.price || 0; // Fetch price
            state.totalAmount += Number(itemPrice);
        },
        removeItem(state, action) {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) {
                const itemPrice =Number(item.price); // Fetch price
                state.totalAmount -= itemPrice;
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.items = state.items.filter(i => i.id !== action.payload.id);
                }
            }
        },
        clearCart(state) {
            state.items = [];
            state.totalAmount = 0;
        },
    },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;