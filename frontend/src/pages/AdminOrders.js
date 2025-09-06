import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AdminOrders() {
  const { userInfo } = useSelector(state => state.user);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrders(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch orders');
      }
      setLoading(false);
    };
    if (userInfo?.isAdmin && userInfo.token) {
      fetchOrders();
    }
  }, [userInfo]);

  if (!userInfo?.isAdmin) return <Typography>Access denied. Admins only.</Typography>;

  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                color: '#2E7D32', 
                mb: 2,
                background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                All Orders
              </Typography>
      {loading ? <CircularProgress sx={{ my: 4 }} /> : error ? <Alert severity="error">{error}</Alert> : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.user?.email || 'N/A'}</TableCell>
                  <TableCell>₹{order.totalPrice}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => navigate(`/order/${order._id}`)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
} 