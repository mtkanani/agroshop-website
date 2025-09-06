import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { placeOrder as placeOrderApi } from '../api/orderApi';

const cartFromStorage = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { items: [], total: 0 };

const initialState = {
  items: cartFromStorage.items,
  total: cartFromStorage.total,
  orderResult: null,
  loading: false,
  error: null,
};

export const placeOrder = createAsyncThunk('cart/placeOrder', async ({ order, token }, thunkAPI) => {
  try {
    return await placeOrderApi(order, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Order failed');
  }
});

const saveCart = (state) => {
  localStorage.setItem('cart', JSON.stringify({ items: state.items, total: state.total }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const item = action.payload;
      const exist = state.items.find(i => i.product === item.product);
      if (exist) {
        exist.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      saveCart(state);
    },
    removeItem(state, action) {
      state.items = state.items.filter(i => i.product !== action.payload);
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      saveCart(state);
    },
    updateQuantity(state, action) {
      const { product, quantity } = action.payload;
      const item = state.items.find(i => i.product === product);
      if (item) item.quantity = quantity;
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      saveCart(state);
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
      saveCart(state);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(placeOrder.pending, state => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderResult = action.payload;
        state.items = [];
        state.total = 0;
        saveCart(state);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 