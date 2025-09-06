import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Grid, CircularProgress, Alert, List, ListItem, ListItemText, Button } from '@mui/material';
import { fetchStats, fetchUsers } from '../features/adminSlice';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.user);
  const { stats, statsLoading, statsError, users, usersLoading, usersError } = useSelector(state => state.admin);

  React.useEffect(() => {
    if (userInfo?.isAdmin && userInfo.token) {
      dispatch(fetchStats(userInfo.token));
      dispatch(fetchUsers(userInfo.token));
    }
  }, [dispatch, userInfo]);

  if (!userInfo?.isAdmin) return <Typography>Access denied. Admins only.</Typography>;

  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ 
                fontWeight: 'bold', 
                color: '#2E7D32', 
                mb: 2,
                background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Admin Dashboard
              </Typography>
      {statsLoading ? <CircularProgress sx={{ my: 4 }} /> : statsError ? <Alert severity="error">{statsError}</Alert> : stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{stats.totalUsers}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{stats.totalOrders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4">₹{stats.totalSales}</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
      <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: '#2E7D32', 
                mb: 2,
                background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Users
              </Typography>
      {usersLoading ? <CircularProgress sx={{ my: 4 }} /> : usersError ? <Alert severity="error">{usersError}</Alert> : (
        <List>
          {users.map(user => (
            <ListItem key={user._id} divider>
              <ListItemText
                primary={user.firstName + " "+ user.lastName + (user.isAdmin ? ' (Admin)' : '')}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4, mr: 2 }}
        onClick={() => navigate('/admin/products')}
      >
        Manage Products
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ mt: 4 }}
        onClick={() => navigate('/admin/orders')}
      >
        Order Summary
      </Button>
    </Box>
  );
} 