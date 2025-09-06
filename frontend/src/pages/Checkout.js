import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  CircularProgress, 
  Alert, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  Chip
} from '@mui/material';
import { 
  ShoppingCart, 
  LocalShipping, 
  Payment, 
  CheckCircle, 
  Cancel,
  Receipt
} from '@mui/icons-material';
import { placeOrder } from '../features/cartSlice';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, loading, error, orderResult } = useSelector(state => state.cart);
  const { userInfo } = useSelector(state => state.user);
  const [address, setAddress] = React.useState('');
  const [payment, setPayment] = React.useState('Online');
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingSubmit, setPendingSubmit] = React.useState(false);

  // Calculate delivery charge and totals
  const deliveryCharge = 50;
  const subtotal = total;
  const totalAmount = subtotal + deliveryCharge;

  React.useEffect(() => {
    if (!userInfo) navigate('/login');
    if (items.length === 0) navigate('/cart');
  }, [userInfo, items, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
      setConfirmOpen(true);
      setPendingSubmit(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setPendingSubmit(false);
    await dispatch(placeOrder({
      order: {
        orderItems: items.map(i => ({
          product: i.product,
          name: i.name,
          qty: i.quantity,
          price: i.price,
          image: i.image,
        })),
        shippingAddress: { address },
        paymentMethod: payment,
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: deliveryCharge,
        totalPrice: totalAmount,
      },
      token: userInfo.token,
    }));
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingSubmit(false);
  };

  const handleCancelOrder = () => {
    navigate('/cart');
  };

  React.useEffect(() => {
    if (orderResult && !loading) {
      navigate('/order-success', { state: { orderResult } });
    }
  }, [orderResult, loading, navigate]);

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="text.secondary">
          Your cart is empty
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2E7D32', mb: 4 }}>
        <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
        Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={5}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#2E7D32' }}>
                <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                Order Summary
              </Typography>

              {/* Product Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Products ({items.length} items)
                </Typography>
                {items.map((item, index) => (
                  <Box key={item.product} sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            backgroundImage: item.image ? `url(${item.image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: 1,
                            bgcolor: '#e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            color: '#666'
                          }}
                        >
                          {!item.image && 'No Image'}
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                          ₹{item.price * item.quantity}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price Breakdown */}
              <Box sx={{ mb: 3 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">₹{subtotal}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      <LocalShipping sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Delivery Charge:
                    </Typography>
                    <Typography variant="body2">₹{deliveryCharge}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                      Total:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                      ₹{totalAmount}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Payment Method */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Payment Method
                </Typography>
        <RadioGroup value={payment} onChange={e => setPayment(e.target.value)}>
                  <FormControlLabel 
                    value="Online" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body2">Online Payment</Typography>
                        <Typography variant="caption" color="text.secondary">UPI / QR Code / Card</Typography>
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="COD" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body2">Cash on Delivery</Typography>
                        <Typography variant="caption" color="text.secondary">Pay when you receive</Typography>
                      </Box>
                    } 
                  />
        </RadioGroup>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Checkout Form */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#2E7D32' }}>
                Shipping Information
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField 
                  label="Shipping Address" 
                  fullWidth 
                  multiline
                  rows={4}
                  sx={{ mb: 3 }} 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  required 
                  placeholder="Enter your complete shipping address..."
                />

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    type="submit" 
                    disabled={loading || pendingSubmit}
                    sx={{ 
                      flex: 1,
                      minWidth: 200,
                      bgcolor: '#2E7D32',
                      '&:hover': { bgcolor: '#1B5E20' }
                    }}
                    startIcon={<CheckCircle />}
                  >
                    {loading ? 'Processing...' : 'Proceed to Order'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={handleCancelOrder}
                    sx={{ 
                      flex: 1,
                      minWidth: 200,
                      borderColor: '#f44336',
                      color: '#f44336',
                      '&:hover': { 
                        borderColor: '#d32f2f',
                        bgcolor: '#ffebee'
                      }
                    }}
                    startIcon={<Cancel />}
                  >
                    Cancel Order
        </Button>
                </Box>

                {loading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2">Processing your order...</Typography>
                  </Box>
                )}
      </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Confirmation Dialog */}
      <Dialog 
        open={confirmOpen} 
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#2E7D32', color: 'white' }}>
          <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
          Confirm Your Order
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Order Summary
          </Typography>
          
          {/* Quick Summary */}
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Items:</strong> {items.length} products
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Subtotal:</strong> ₹{subtotal}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Delivery:</strong> ₹{deliveryCharge}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
              <strong>Total:</strong> ₹{totalAmount}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Payment Method: <Chip label={payment} color="primary" size="small" />
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to proceed with this order?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCancel} 
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
          >
            No, Cancel Order
          </Button>
          <Button 
            onClick={handleConfirm} 
            variant="contained"
            sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' } }}
            startIcon={<CheckCircle />}
            disabled={loading}
          >
            Yes, Place Order
          </Button>
        </DialogActions>
      </Dialog>

      {orderResult && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="success">Order placed successfully!</Alert>
          {orderResult.qr && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography>Scan to Pay:</Typography>
              <img src={orderResult.qr} alt="Paytm QR" style={{ maxWidth: 200 }} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
} 