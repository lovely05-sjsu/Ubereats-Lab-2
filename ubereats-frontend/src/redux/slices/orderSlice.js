import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  orderStatus: {
    isProcessing: false,
    status: null,
    estimatedDeliveryTime: null
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
      state.orders.unshift(action.payload);
      state.orderStatus = {
        isProcessing: true,
        status: 'PLACED',
        estimatedDeliveryTime: action.payload.estimatedDeliveryTime
      };
    },
    createOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status, estimatedDeliveryTime } = action.payload;
      state.orderStatus = {
        isProcessing: status !== 'DELIVERED',
        status,
        estimatedDeliveryTime
      };
      
      // Update in orders array
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        state.orders[orderIndex] = {
          ...state.orders[orderIndex],
          status,
          estimatedDeliveryTime
        };
      }
      
      // Update current order if it matches
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder = {
          ...state.currentOrder,
          status,
          estimatedDeliveryTime
        };
      }
    },
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.orderStatus = initialState.orderStatus;
    }
  }
});

export const {
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  updateOrderStatus,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  clearCurrentOrder
} = orderSlice.actions;

export default orderSlice.reducer; 