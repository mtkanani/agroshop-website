import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Button, IconButton, TextField, Card, CardContent, Divider, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { removeItem, updateQuantity } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);
  const navigate = useNavigate();

  // Calculate delivery charge and totals
  const deliveryCharge = 50;
  const subtotal = total;
  const totalAmount = subtotal + deliveryCharge;

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  const handleQuantity = (id, qty) => {
    if (qty > 0) dispatch(updateQuantity({ product: id, quantity: Number(qty) }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2E7D32', mb: 4 }}>
        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Shopping Cart
      </Typography>
      
      {items.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <ShoppingCartIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Your cart is empty
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/products')}
              sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' } }}
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          {/* Cart Items */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Cart Items ({items.length})
            </Typography>
          {items.map(item => (
              <Paper key={item.product} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Product Image */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundImage: item.image ? `url(${item.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 2,
                      bgcolor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      color: '#666',
                      flexShrink: 0
                    }}
                  >
                    {!item.image && 'No Image'}
                  </Box>
                  
                  {/* Product Details */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Price: ₹{item.price} per item
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  type="number"
                  size="small"
                        label="Quantity"
                  value={item.quantity}
                  onChange={e => handleQuantity(item.product, e.target.value)}
                        sx={{ width: 100 }}
                  inputProps={{ min: 1 }}
                />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Total: ₹{item.price * item.quantity}
                      </Typography>
                    </Box>
              </Box>
                  
                  {/* Remove Button */}
                  <IconButton 
                    onClick={() => handleRemove(item.product)} 
                    color="error"
                    sx={{ 
                      bgcolor: '#ffebee',
                      '&:hover': { bgcolor: '#ffcdd2' }
                    }}
                  >
                <DeleteIcon />
              </IconButton>
                </Box>
            </Paper>
          ))}
          </Box>

          {/* Order Summary */}
          <Box sx={{ width: { xs: '100%', lg: 350 } }}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#2E7D32' }}>
                  Order Summary
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">₹{subtotal}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      <LocalShippingIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
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

                <Button 
                  variant="contained" 
                  fullWidth
                  size="large"
                  onClick={() => navigate('/checkout')}
                  sx={{ 
                    bgcolor: '#2E7D32',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': { 
                      bgcolor: '#1B5E20',
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    },
                    transition: 'all 0.3s ease'
                  }}
                  startIcon={<ShoppingCartIcon />}
                >
                  Proceed to Checkout
                </Button>

                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/products')}
                  sx={{ 
                    mt: 2,
                    borderColor: '#2E7D32',
                    color: '#2E7D32',
                    '&:hover': { 
                      borderColor: '#1B5E20',
                      bgcolor: '#f1f8e9'
                    }
                  }}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
} 