import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurants: [],
  selectedRestaurant: null,
  menu: [],
  loading: false,
  error: null,
  filters: {
    cuisine: [],
    priceRange: [],
    rating: null,
    searchQuery: ''
  }
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    fetchRestaurantsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRestaurantsSuccess: (state, action) => {
      state.loading = false;
      state.restaurants = action.payload;
    },
    fetchRestaurantsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedRestaurant: (state, action) => {
      state.selectedRestaurant = action.payload;
    },
    fetchMenuStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMenuSuccess: (state, action) => {
      state.loading = false;
      state.menu = action.payload;
    },
    fetchMenuFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const {
  fetchRestaurantsStart,
  fetchRestaurantsSuccess,
  fetchRestaurantsFailure,
  setSelectedRestaurant,
  fetchMenuStart,
  fetchMenuSuccess,
  fetchMenuFailure,
  updateFilters,
  clearFilters
} = restaurantSlice.actions;

export default restaurantSlice.reducer; 