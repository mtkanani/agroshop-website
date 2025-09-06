import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStats, getUsers, getUserById, updateUser, deleteUser, suspendUser, resetUserPassword } from '../api/adminApi';

const initialState = {
  stats: null,
  users: [],
  loading: false,
  error: null,
  statsLoading: false,
  statsError: null,
  usersLoading: false,
  usersError: null,
  userDetail: null,
  userDetailLoading: false,
  userDetailError: null,
  userUpdateSuccess: false,
  userUpdateError: null,
  userDeleteSuccess: false,
  userDeleteError: null,
  userSuspendSuccess: false,
  userSuspendError: null,
  userSuspendLoading: false,
  userResetSuccess: false,
  userResetError: null,
  userResetLoading: false,
};

export const fetchStats = createAsyncThunk('admin/fetchStats', async (token, thunkAPI) => {
  try {
    return await getStats(token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
  }
});

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (token, thunkAPI) => {
  try {
    return await getUsers(token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const fetchUserDetail = createAsyncThunk('admin/fetchUserDetail', async ({ id, token }, thunkAPI) => {
  try {
    return await getUserById(id, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const updateUserDetail = createAsyncThunk('admin/updateUserDetail', async ({ id, user, token }, thunkAPI) => {
  try {
    return await updateUser(id, user, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update user');
  }
});

export const deleteUserById = createAsyncThunk('admin/deleteUserById', async ({ id, token }, thunkAPI) => {
  try {
    return await deleteUser(id, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete user');
  }
});

export const suspendUserThunk = createAsyncThunk('admin/suspendUser', async ({ id, token }, thunkAPI) => {
  try {
    return await suspendUser(id, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to suspend user');
  }
});

export const resetUserPasswordThunk = createAsyncThunk('admin/resetUserPassword', async ({ id, password, token }, thunkAPI) => {
  try {
    return await resetUserPassword(id, password, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to reset password');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminStatus(state) {
      state.userUpdateSuccess = false;
      state.userUpdateError = null;
      state.userDeleteSuccess = false;
      state.userDeleteError = null;
      state.userSuspendSuccess = false;
      state.userSuspendError = null;
      state.userSuspendLoading = false;
      state.userResetSuccess = false;
      state.userResetError = null;
      state.userResetLoading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStats.pending, state => { state.statsLoading = true; state.statsError = null; })
      .addCase(fetchStats.fulfilled, (state, action) => { state.statsLoading = false; state.stats = action.payload; })
      .addCase(fetchStats.rejected, (state, action) => { state.statsLoading = false; state.statsError = action.payload; })
      .addCase(fetchUsers.pending, state => { state.usersLoading = true; state.usersError = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.usersLoading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.usersLoading = false; state.usersError = action.payload; })
      .addCase(fetchUserDetail.pending, state => { state.userDetailLoading = true; state.userDetailError = null; })
      .addCase(fetchUserDetail.fulfilled, (state, action) => { state.userDetailLoading = false; state.userDetail = action.payload; })
      .addCase(fetchUserDetail.rejected, (state, action) => { state.userDetailLoading = false; state.userDetailError = action.payload; })
      .addCase(updateUserDetail.pending, state => { state.userUpdateSuccess = false; state.userUpdateError = null; })
      .addCase(updateUserDetail.fulfilled, (state, action) => { state.userUpdateSuccess = true; state.userDetail = action.payload; })
      .addCase(updateUserDetail.rejected, (state, action) => { state.userUpdateError = action.payload; state.userUpdateSuccess = false; })
      .addCase(deleteUserById.pending, state => { state.userDeleteSuccess = false; state.userDeleteError = null; })
      .addCase(deleteUserById.fulfilled, (state) => { state.userDeleteSuccess = true; })
      .addCase(deleteUserById.rejected, (state, action) => { state.userDeleteError = action.payload; state.userDeleteSuccess = false; })
      .addCase(suspendUserThunk.pending, state => { state.userSuspendLoading = true; state.userSuspendError = null; state.userSuspendSuccess = false; })
      .addCase(suspendUserThunk.fulfilled, (state) => { state.userSuspendLoading = false; state.userSuspendSuccess = true; })
      .addCase(suspendUserThunk.rejected, (state, action) => { state.userSuspendLoading = false; state.userSuspendError = action.payload; state.userSuspendSuccess = false; })
      .addCase(resetUserPasswordThunk.pending, state => { state.userResetLoading = true; state.userResetError = null; state.userResetSuccess = false; })
      .addCase(resetUserPasswordThunk.fulfilled, (state) => { state.userResetLoading = false; state.userResetSuccess = true; })
      .addCase(resetUserPasswordThunk.rejected, (state, action) => { state.userResetLoading = false; state.userResetError = action.payload; state.userResetSuccess = false; });
  }
});

export const { clearAdminStatus } = adminSlice.actions;
export default adminSlice.reducer; 