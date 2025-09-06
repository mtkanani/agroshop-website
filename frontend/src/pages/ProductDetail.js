import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  CircularProgress, 
  Alert, 
  Snackbar,
  Chip,
  Stack,
  Card,
  CardContent,
  IconButton,
  Divider,
  Container
} from '@mui/material';
import Rating from '@mui/material/Rating';
import {
  ShoppingCart,
  LocalShipping,
  Security,
  Star,
  ArrowBack,
  ZoomIn,
  ZoomOut
} from '@mui/icons-material';
import { fetchProductDetail } from '../features/productsSlice';
import { addItem } from '../features/cartSlice';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetail, loading, error } = useSelector(state => state.products);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);

  React.useEffect(() => {
    if (id) dispatch(fetchProductDetail(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (productDetail) {
      dispatch(addItem({
        product: productDetail._id,
        name: productDetail.name,
        price: productDetail.price,
        quantity: 1,
        image: productDetail.images?.[0] || '',
      }));
      setOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (productDetail) {
      // Clear cart and add only this product for Buy Now
      dispatch({ type: 'cart/clearCart' });
      dispatch(addItem({
        product: productDetail._id,
        name: productDetail.name,
        price: productDetail.price,
        quantity: 1,
        image: productDetail.images?.[0] || '',
      }));
      navigate('/checkout');
    }
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setImageZoom(1);
  };

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: '#2E7D32' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  if (!productDetail) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>Product not found.</Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ display: 'block', mx: 'auto' }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  const images = productDetail.images || [];
  const hasMultipleImages = images.length > 1;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button 
        variant="outlined" 
        startIcon={<ArrowBack />}
        onClick={() => navigate('/products')}
        sx={{ mb: 3, borderColor: '#2E7D32', color: '#2E7D32', '&:hover': { borderColor: '#1B5E20' } }}
      >
        Back to Products
      </Button>

      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: 3 }}>
        <Grid container spacing={4}>
          {/* Product Images Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              {/* Main Image Display */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 300, md: 400 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={`${productDetail.name} - Image ${selectedImage + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transform: `scale(${imageZoom})`,
                      transition: 'transform 0.3s ease',
                      cursor: imageZoom > 1 ? 'zoom-out' : 'zoom-in'
                    }}
                    onClick={() => setImageZoom(imageZoom > 1 ? 1 : 1.5)}
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No image available
                  </Typography>
                )}
              </Box>

              {/* Zoom Controls */}
              {images.length > 0 && (
                <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={handleZoomOut}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' } 
                    }}
                  >
                    <ZoomOut fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleZoomIn}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' } 
                    }}
                  >
                    <ZoomIn fontSize="small" />
                  </IconButton>
                </Box>
              )}

              {/* Thumbnail Images */}
              {hasMultipleImages && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid #2E7D32' : '2px solid #e0e0e0',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#2E7D32',
                          transform: 'scale(1.05)'
                        }
                      }}
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={image}
                        alt={`${productDetail.name} thumbnail ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Product Details Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Product Title and Category */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E7D32', mb: 1 }}>
                  {productDetail.name}
                </Typography>
                <Chip
                  label={productDetail.category?.name || 'Uncategorized'}
                  sx={{
                    bgcolor: '#E8F5E8',
                    color: '#2E7D32',
                    fontWeight: 'bold',
                    mb: 2
                  }}
                />
              </Box>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                  value={Number(productDetail.rating) || 0}
                  precision={0.1}
                  readOnly
                  size="large"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  ({productDetail.rating || 0} out of 5)
                </Typography>
              </Box>

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                  ₹{productDetail.price?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inclusive of all taxes
                </Typography>
              </Box>

              {/* Description */}
              <Box sx={{ mb: 4, flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                  Product Description
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#666' }}>
                  {productDetail.description || 'No description available for this product.'}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ mt: 'auto' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    sx={{
                      bgcolor: '#2E7D32',
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: '#1B5E20',
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleBuyNow}
                    sx={{
                      borderColor: '#2E7D32',
                      color: '#2E7D32',
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: '#1B5E20',
                        bgcolor: '#f1f8e9',
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Buy Now
                  </Button>
                </Stack>
              </Box>

              {/* Product Features */}
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <LocalShipping sx={{ fontSize: 40, color: '#2E7D32', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Free Delivery
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Security sx={{ fontSize: 40, color: '#2E7D32', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Secure Payment
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Star sx={{ fontSize: 40, color: '#2E7D32', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Quality Assured
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {productDetail.name} added to cart successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
} 