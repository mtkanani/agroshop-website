import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getProductById } from '../api/productsApi';

const initialState = {
  products: [],
  productDetail: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, thunkAPI) => {
  try {
    return await getProducts(params);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductDetail = createAsyncThunk('products/fetchProductDetail', async (id, thunkAPI) => {
  try {
    return await getProductById(id);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProductDetail.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchProductDetail.fulfilled, (state, action) => { state.loading = false; state.productDetail = action.payload; })
      .addCase(fetchProductDetail.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export default productsSlice.reducer; 