import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, updateProfile as updateProfileApi } from '../api/userApi';
import { getMyOrders, getOrderById } from '../api/orderApi';

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
  orders: [],
  ordersLoading: false,
  ordersError: null,
  orderDetail: null,
  orderDetailLoading: false,
  orderDetailError: null,
  profileLoading: false,
  profileError: null,
  profileSuccess: false,
};

export const login = createAsyncThunk('user/login', async ({ email, password }, thunkAPI) => {
  try {
    return await loginUser(email, password);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('user/register', async ({ firstName, lastName, email, password, cityOrVillage, contactNumber }, thunkAPI) => {
  try {
    return await registerUser(firstName, lastName, email, password, cityOrVillage, contactNumber);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async ({ profile, token }, thunkAPI) => {
  try {
    return await updateProfileApi(profile, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Profile update failed');
  }
});

export const fetchOrders = createAsyncThunk('user/fetchOrders', async (token, thunkAPI) => {
  try {
    return await getMyOrders(token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrderDetail = createAsyncThunk('user/fetchOrderDetail', async ({ id, token }, thunkAPI) => {
  try {
    return await getOrderById(id, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    setUser(state, action) {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    clearProfileStatus(state) {
      state.profileSuccess = false;
      state.profileError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending, state => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateProfile.pending, state => { state.profileLoading = true; state.profileError = null; state.profileSuccess = false; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userInfo = action.payload;
        state.profileSuccess = true;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
        state.profileSuccess = false;
      })
      .addCase(fetchOrders.pending, state => { state.ordersLoading = true; state.ordersError = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.ordersLoading = false; state.orders = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.ordersLoading = false; state.ordersError = action.payload; })
      .addCase(fetchOrderDetail.pending, state => { state.orderDetailLoading = true; state.orderDetailError = null; })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => { state.orderDetailLoading = false; state.orderDetail = action.payload; })
      .addCase(fetchOrderDetail.rejected, (state, action) => { state.orderDetailLoading = false; state.orderDetailError = action.payload; });
  }
});

export const { logout, setUser, clearProfileStatus } = userSlice.actions;
export default userSlice.reducer; 