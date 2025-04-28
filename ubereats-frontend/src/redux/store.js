import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import authReducer from './slices/authSlice';
import restaurantReducer from './slices/restaurantSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        category: categoryReducer,
        restaurant: restaurantReducer,
        order: orderReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['auth/loginSuccess'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.user'],
                // Ignore these paths in the state
                ignoredPaths: ['auth.user'],
            },
        }),
});

export default store;