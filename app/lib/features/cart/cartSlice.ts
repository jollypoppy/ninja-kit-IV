import { createSlice } from '@reduxjs/toolkit';

const initialState =
  typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('ninja-cart') || '[]')
    : [];

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const productId = action.payload;
      state.push(productId);
      localStorage.setItem('ninja-cart', JSON.stringify(state));
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state = state.filter((item: string) => {
        return item !== productId;
      });
      localStorage.removeItem('ninja-cart');
      localStorage.setItem('ninja-cart', JSON.stringify(state));
      return state;
    },

    clearCart: (state, action) => {
      state = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
