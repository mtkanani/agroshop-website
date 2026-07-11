import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  IconButton, 
  Badge, 
  Tooltip,
  Paper,
  Snackbar,
  Alert,
  Rating
} from '@mui/material';
import { 
  Delete, 
  ShoppingCart, 
  Favorite, 
  Star,
  ArrowBack
} from '@mui/icons-material';
import { addItem } from '../features/cartSlice';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector(state => state.cart);
  const [wishlist, setWishlist] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load wishlist from localStorage
  const loadWishlist = () => {
    try {
      const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(list);
    } catch (err) {
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemoveFromWishlist = (productId) => {
    const updated = wishlist.filter(p => p._id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlist(updated);
    
    // Dispatch event to sync badge in AppNav header
    window.dispatchEvent(new Event('wishlist-update'));
    
    setSnackbar({
      open: true,
      message: 'Item removed from your wishlist.',
      severity: 'info'
    });
  };

  const handleAddToCart = (product) => {
    try {
      const existingItem = cartItems.find(item => item.product === product._id);
      
      if (existingItem) {
        dispatch(addItem({
          product: product._id,
          quantity: existingItem.quantity + 1,
          price: product.price,
          name: product.name,
          image: product.images?.[0] || product.image || ''
        }));
      } else {
        dispatch(addItem({
          product: product._id,
          quantity: 1,
          price: product.price,
          name: product.name,
          image: product.images?.[0] || product.image || ''
        }));
      }
      setSnackbar({
        open: true,
        message: `${product.name} added to cart!`,
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to add item to cart.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ bgcolor: '#FAFDF6', minHeight: '85vh', py: 5 }}>
      <Container maxWidth="xl">
        
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 850, 
              color: '#1B5E20',
              background: 'linear-gradient(45deg, #1B5E20, #4CAF50)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ❤️ My Wishlist
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Your saved crops, fertilizers, and tools.
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            component={Link} 
            to="/products"
            sx={{ borderColor: '#2E7D32', color: '#2E7D32', borderRadius: 2 }}
          >
            Back to Shop
          </Button>
        </Box>

        {wishlist.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#FFF' }}>
            <Favorite sx={{ fontSize: 80, color: '#FFCDD2', mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
              Your wishlist is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Explore our catalog to save products you are interested in.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/products"
              sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, borderRadius: 3, px: 4 }}
            >
              Shop Crops & Tools
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={{ xs: 1.5, sm: 3 }}>
            {wishlist.map((product) => (
              <Grid item xs={6} sm={6} md={4} lg={3} key={product._id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: 3,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Image */}
                  <Link to={`/product/${product._id}`} style={{ display: 'block' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=60'}
                      alt={product.name}
                      sx={{ objectFit: 'cover', height: { xs: 130, sm: 200 } }}
                    />
                  </Link>

                  {/* Remove Button Icon */}
                  <IconButton
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      color: '#d32f2f',
                      '&:hover': { bgcolor: '#ffebee' },
                      zIndex: 2,
                      p: { xs: 0.5, sm: 1 }
                    }}
                  >
                    <Delete sx={{ fontSize: { xs: 16, sm: 20 } }} />
                  </IconButton>

                  {/* Rating Badge */}
                  {product.rating && (
                    <Box sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}>
                      <Star sx={{ fontSize: { xs: 13, sm: 16 }, color: '#FFD700', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
                        {product.rating}
                      </Typography>
                    </Box>
                  )}

                  {/* Card Content */}
                  <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 3 } }}>
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold', 
                          mb: 1,
                          color: '#2E7D32',
                          lineHeight: 1.3,
                          fontSize: { xs: '0.85rem', sm: '1.1rem' },
                          minHeight: { xs: 44, sm: 'auto' },
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          '&:hover': { color: '#1B5E20' }
                        }}
                      >
                        {product.name}
                      </Typography>
                    </Link>

                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#2E7D32',
                        fontSize: { xs: '1.05rem', sm: '1.3rem' }
                      }}
                    >
                      ₹{product.price?.toLocaleString()}
                    </Typography>
                  </CardContent>

                  {/* Actions */}
                  <CardActions sx={{ p: { xs: 1.5, sm: 3 }, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleAddToCart(product)}
                      startIcon={<ShoppingCart sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                      sx={{ 
                        bgcolor: '#2E7D32', 
                        '&:hover': { bgcolor: '#1B5E20' },
                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                        py: { xs: 0.5, sm: 1 },
                        borderRadius: 2
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Container>
    </Box>
  );
}
