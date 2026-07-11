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
        image: productDetail.images?.[0] || productDetail['images[0]'] || '',
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
        image: productDetail.images?.[0] || productDetail['images[0]'] || '',
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

  const images = (productDetail.images && productDetail.images.length > 0 && productDetail.images[0])
    ? productDetail.images
    : (productDetail['images[0]'] ? [productDetail['images[0]']] : []);
  const hasMultipleImages = images.length > 1;

  return (
    <Container maxWidth="lg" sx={{ py: 5, bgcolor: '#FAFDF6' }}>
      {/* Back Button */}
      <Button 
        variant="outlined" 
        startIcon={<ArrowBack />}
        onClick={() => navigate('/products')}
        sx={{ 
          mb: 4, 
          borderColor: '#2E7D32', 
          color: '#2E7D32', 
          borderRadius: 3,
          px: 3,
          py: 1,
          fontWeight: 'bold',
          '&:hover': { 
            borderColor: '#1B5E20',
            bgcolor: 'rgba(46,125,50,0.05)',
            transform: 'translateX(-4px)'
          },
          transition: 'all 0.3s'
        }}
      >
        Back to Products
      </Button>

      <Paper sx={{ 
        p: { xs: 3, md: 5 }, 
        borderRadius: 6, 
        boxShadow: '0 20px 40px rgba(46,125,50,0.06)',
        border: '1px solid rgba(46,125,50,0.08)',
        background: '#FFFFFF'
      }}>
        <Grid container spacing={5}>
          
          {/* Product Images Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              {/* Main Image Display */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 300, md: 420 },
                  borderRadius: 5,
                  overflow: 'hidden',
                  bgcolor: '#F9FBF9',
                  border: '1px solid rgba(46,125,50,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)',
                  mb: 3
                }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={`${productDetail.name} - Image ${selectedImage + 1}`}
                    style={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'contain',
                      transform: `scale(${imageZoom})`,
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
                <Box sx={{ position: 'absolute', top: 15, right: 15, display: 'flex', gap: 1, zIndex: 2 }}>
                  <IconButton
                    size="small"
                    onClick={handleZoomOut}
                    sx={{ 
                      bgcolor: 'white', 
                      color: '#2E7D32',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      '&:hover': { bgcolor: '#F5FAF5' } 
                    }}
                  >
                    <ZoomOut fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleZoomIn}
                    sx={{ 
                      bgcolor: 'white', 
                      color: '#2E7D32',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      '&:hover': { bgcolor: '#F5FAF5' } 
                    }}
                  >
                    <ZoomIn fontSize="small" />
                  </IconButton>
                </Box>
              )}

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mt: 3 }}>
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 75,
                        height: 75,
                        borderRadius: 3,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid #2E7D32' : '2px solid rgba(46,125,50,0.15)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: selectedImage === index ? '0 4px 12px rgba(46,125,50,0.2)' : 'none',
                        '&:hover': {
                          borderColor: '#2E7D32',
                          transform: 'scale(1.08)'
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
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <Box>
                {/* Badges Bar */}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    label={productDetail.category?.name || productDetail.category || 'Uncategorized'}
                    sx={{
                      bgcolor: '#E8F5E8',
                      color: '#2E7D32',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      px: 0.5
                    }}
                  />
                  {productDetail.stock === 0 ? (
                    <Chip label="❌ Out of Stock" color="error" size="small" sx={{ fontWeight: 'bold' }} />
                  ) : productDetail.stock < 5 ? (
                    <Chip label={`⚠️ Only ${productDetail.stock} left!`} color="warning" size="small" sx={{ fontWeight: 'bold' }} />
                  ) : (
                    <Chip label="✅ In Stock" color="success" variant="outlined" size="small" sx={{ fontWeight: 'bold', borderColor: '#2E7D32', color: '#2E7D32' }} />
                  )}
                </Stack>

                {/* Title */}
                <Typography sx={{ 
                  fontWeight: 850, 
                  color: '#1B5E20', 
                  mb: 1.5, 
                  fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' }, 
                  lineHeight: 1.2 
                }}>
                  {productDetail.name}
                </Typography>

                {/* Ratings */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Rating
                    value={Number(productDetail.rating) || 0}
                    precision={0.1}
                    readOnly
                    size="medium"
                    sx={{ mr: 1, color: '#FFB300' }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {productDetail.rating || 0} / 5 Rating
                  </Typography>
                </Box>

                {/* Price Display */}
                <Paper variant="outlined" sx={{ 
                  p: 3, 
                  borderRadius: 4, 
                  bgcolor: '#FAFDF6', 
                  borderColor: 'rgba(46,125,50,0.12)', 
                  mb: 4,
                  display: 'inline-block'
                }}>
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography sx={{ fontWeight: '900', color: '#1B5E20', fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' }, lineHeight: 1 }}>
                      ₹{productDetail.price?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      INR
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontWeight: 500 }}>
                    ✓ Inclusive of all local taxes & delivery surcharges
                  </Typography>
                </Paper>

                {/* Description */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                    Product Details & Description
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#555', whiteSpace: 'pre-line' }}>
                    {productDetail.description || 'No description available for this product.'}
                  </Typography>
                </Box>
              </Box>

              {/* Action Section */}
              <Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={productDetail.stock === 0}
                    sx={{
                      bgcolor: '#2E7D32',
                      py: 1.8,
                      px: 4,
                      fontSize: '1.05rem',
                      fontWeight: 'bold',
                      borderRadius: 3.5,
                      boxShadow: '0 6px 16px rgba(46, 125, 50, 0.25)',
                      flex: 1,
                      '&:hover': {
                        bgcolor: '#1B5E20',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(46, 125, 50, 0.4)'
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
                    disabled={productDetail.stock === 0}
                    sx={{
                      borderColor: '#2E7D32',
                      color: '#2E7D32',
                      borderWidth: '2px',
                      py: 1.8,
                      px: 4,
                      fontSize: '1.05rem',
                      fontWeight: 'bold',
                      borderRadius: 3.5,
                      flex: 1,
                      '&:hover': {
                        borderColor: '#1B5E20',
                        borderWidth: '2px',
                        bgcolor: 'rgba(46,125,50,0.03)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Buy Now
                  </Button>
                </Stack>

                {/* Trust Seals Bar */}
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Paper variant="outlined" sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 3, 
                      border: '1px solid rgba(46,125,50,0.06)',
                      bgcolor: '#FAFAFA',
                      '&:hover': { bgcolor: '#F5FAF5', borderColor: '#2E7D32' },
                      transition: 'all 0.3s'
                    }}>
                      <LocalShipping sx={{ fontSize: 32, color: '#2E7D32', mb: 0.5 }} />
                      <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#333' }}>
                        Free Delivery
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper variant="outlined" sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 3, 
                      border: '1px solid rgba(46,125,50,0.06)',
                      bgcolor: '#FAFAFA',
                      '&:hover': { bgcolor: '#F5FAF5', borderColor: '#2E7D32' },
                      transition: 'all 0.3s'
                    }}>
                      <Security sx={{ fontSize: 32, color: '#2E7D32', mb: 0.5 }} />
                      <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#333' }}>
                        100% Secure
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper variant="outlined" sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 3, 
                      border: '1px solid rgba(46,125,50,0.06)',
                      bgcolor: '#FAFAFA',
                      '&:hover': { bgcolor: '#F5FAF5', borderColor: '#2E7D32' },
                      transition: 'all 0.3s'
                    }}>
                      <Star sx={{ fontSize: 32, color: '#2E7D32', mb: 0.5 }} />
                      <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#333' }}>
                        Premium Quality
                      </Typography>
                    </Paper>
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