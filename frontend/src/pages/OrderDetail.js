import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import { fetchOrderDetail } from '../features/userSlice';

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userInfo, orderDetail, orderDetailLoading, orderDetailError } = useSelector(state => state.user);

  React.useEffect(() => {
    if (id && userInfo?.token) {
      dispatch(fetchOrderDetail({ id, token: userInfo.token }));
    }
  }, [dispatch, id, userInfo]);

  if (orderDetailLoading) return <CircularProgress sx={{ my: 4 }} />;
  if (orderDetailError) return <Alert severity="error" sx={{ my: 2 }}>{orderDetailError}</Alert>;
  if (!orderDetail) return <Typography sx={{ m: 2 }}>Order not found.</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Order #{orderDetail._id}</Typography>
      <Typography>Status: {orderDetail.status}</Typography>
      <Typography>Total: ₹{orderDetail.totalPrice}</Typography>
      <Typography sx={{ mt: 2 }}>Shipping Address: {orderDetail.shippingAddress?.address}</Typography>
      <Typography sx={{ mt: 2, mb: 1 }}>Items:</Typography>
      <List>
        {orderDetail.orderItems.map(item => (
          <ListItem key={item.product}>
            <ListItemText
              primary={`${item.name} x${item.qty}`}
              secondary={`₹${item.price} each`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
} 