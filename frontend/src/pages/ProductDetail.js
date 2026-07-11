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
import { fetchProductDetail, fetchProducts } from '../features/productsSlice';
import { addItem } from '../features/cartSlice';

const categoryGuides = {
  'Seeds': {
    usage: 'Sow in well-prepared, damp soil at a depth of 2-3 cm. Maintain consistent soil moisture during germination (approx. 7-10 days).',
    season: 'Best planted during early Monsoon (Kharif) or start of Winter (Rabi) depending on crop type.',
    dosage: 'Standard spacing: 15-20 cm between plants, 45-60 cm between rows.',
    precautions: 'Store seed packs in a cool, dry place. Avoid waterlogging in the sowing area.'
  },
  'Fertilizers': {
    usage: 'Spread evenly around the base of the crop (avoiding direct contact with the stem) and mix slightly into the topsoil. Water thoroughly immediately after application.',
    season: 'Apply during early growth stages or pre-sowing preparation to boost crop vegetative growth.',
    dosage: 'Standard dose: 50-100 grams per square meter or as recommended for specific crops.',
    precautions: 'Wear protective gloves during handling. Store away from moisture and direct sunlight.'
  },
  'Sprayers': {
    usage: 'Fill the tank with clean water and mix the target solution thoroughly. Pump to build pressure and spray evenly on leaves until damp.',
    season: 'Can be used year-round for watering, pest spraying, and foliar nutrient feeding.',
    dosage: 'Calibrate nozzle flow before spraying. Maintain steady walking speed for uniform coverage.',
    precautions: 'Clean the tank and nozzle thoroughly after each use, especially when shifting between pesticides and nutrients.'
  },
  'Pesticides': {
    usage: 'Dilute the recommended dosage in clean water. Spray during calm hours (early morning or late evening) to avoid chemical wind-drift.',
    season: 'Apply as a preventative measure during high-humidity seasons (Monsoon) or at first sign of pest infestation.',
    dosage: 'Standard dilution: 2-3 ml per liter of water (refer to label guidelines for exact crop dilution).',
    precautions: 'Always wear mask, goggles, and gloves. Keep away from children and pets. Do not spray right before harvest.'
  }
};

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetail, loading, error, products } = useSelector(state => state.products);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(id));
      setSelectedImage(0); // Reset selected image when ID changes
      setImageZoom(1);
    }
  }, [dispatch, id]);

  React.useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

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
    <Box sx={{ bgcolor: '#FAFDF6', minHeight: '85vh', py: 4 }}>
      <Container maxWidth="xl">
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
            bgcolor: 'white',
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

      {/* SMART APPLICATION GUIDE */}
      {(() => {
        const currentCategory = productDetail.category?.name || productDetail.category || 'Seeds';
        const guide = categoryGuides[currentCategory] || categoryGuides['Seeds'];
        
        const relatedProducts = products
          .filter(p => p._id !== productDetail._id)
          .filter(p => (p.category?.name || p.category) === currentCategory)
          .slice(0, 4);

        const displayRelated = relatedProducts.length >= 3 
          ? relatedProducts 
          : [
              ...relatedProducts, 
              ...products.filter(p => p._id !== productDetail._id && !relatedProducts.find(rp => rp._id === p._id))
            ].slice(0, 4);

        return (
          <>
            <Paper sx={{ 
              p: { xs: 3, md: 4 }, 
              borderRadius: 5, 
              mt: 5, 
              border: '1px solid rgba(46,125,50,0.08)',
              boxShadow: '0 10px 30px rgba(46,125,50,0.04)'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B5E20', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                💡 Smart Advisor: Cultivation & Application Guide
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Farming tips and recommended dosage schedules specifically tailored for {currentCategory} items.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F9FBF9', height: '100%', borderLeft: '4px solid #2E7D32' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2E7D32', mb: 1 }}>
                      📖 Sowing & Usage Directions
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                      {guide.usage}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F5FAF5', height: '100%', borderLeft: '4px solid #8BC34A' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#689F38', mb: 1 }}>
                      📅 Ideal Season Calendar
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                      {guide.season}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#E3F2FD', height: '100%', borderLeft: '4px solid #2196F3' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976D2', mb: 1 }}>
                      🧪 Recommended Dosage
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                      {guide.dosage}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#FFF3E0', height: '100%', borderLeft: '4px solid #FF9800' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#F57C00', mb: 1 }}>
                      ⚠️ Protective Precautions
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                      {guide.precautions}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* RELATED PRODUCTS */}
            {displayRelated.length > 0 && (
              <Box sx={{ mt: 6 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B5E20', mb: 1 }}>
                  🌿 Related Agricultural Products
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Other items that farmers frequently purchase together for matching soil needs.
                </Typography>
                
                <Grid container spacing={3}>
                  {displayRelated.map(prod => (
                    <Grid item xs={12} sm={6} md={3} key={prod._id}>
                      <Card 
                        onClick={() => navigate(`/product/${prod._id}`)}
                        sx={{ 
                          height: '100%', 
                          borderRadius: 4, 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '1px solid rgba(46,125,50,0.06)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: '0 10px 25px rgba(46,125,50,0.12)',
                            borderColor: '#2E7D32'
                          }
                        }}
                      >
                        <Box sx={{ 
                          height: 180, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: '#F9FBF9',
                          p: 2
                        }}>
                          <img 
                            src={prod.images?.[0] || prod['images[0]'] || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=200'} 
                            alt={prod.name}
                            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                          />
                        </Box>
                        <CardContent sx={{ p: 2.5 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ fontWeight: 'bold', color: '#333', mb: 0.5, height: 48, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                          >
                            {prod.name}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2E7D32', mb: 1.5 }}>
                            ₹{prod.price?.toLocaleString()}
                          </Typography>
                          <Button 
                            variant="outlined" 
                            fullWidth 
                            size="small" 
                            sx={{ 
                              borderRadius: 2, 
                              borderColor: '#2E7D32', 
                              color: '#2E7D32',
                              fontWeight: 'bold',
                              '&:hover': { bgcolor: '#F5FAF5', borderColor: '#1B5E20' }
                            }}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        );
      })()}

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
    </Box>
  );
} 