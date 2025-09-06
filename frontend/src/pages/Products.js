import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert, 
  Chip, 
  Stack, 
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  InputAdornment,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Star,
  LocalShipping,
  Security,
  TrendingUp,
  Category,
  PriceCheck,
  Sort
} from '@mui/icons-material';
import { fetchProducts } from '../features/productsSlice';
import { addItem } from '../features/cartSlice';
import { Link, useSearchParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';

export default function Products() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const { items } = useSelector(state => state.cart);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('name');
  const [addingToCart, setAddingToCart] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showFilters, setShowFilters] = useState(false);

  // Get category from URL parameters
  const categoryFromUrl = searchParams.get('category');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Get unique categories
  const categories = [...new Set(products?.map(product => product.category?.name).filter(Boolean))];

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || 
                           product.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setSearchParams({ category: category.toLowerCase() });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSortBy('name');
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    setAddingToCart(prev => ({ ...prev, [product._id]: true }));
    
    try {
      const existingItem = items.find(item => item.product === product._id);
      
      if (existingItem) {
        dispatch(addItem({
          product: product._id,
          quantity: existingItem.quantity + 1,
          price: product.price,
          name: product.name,
          image: product.images?.[0] || ''
        }));
        setSnackbar({
          open: true,
          message: `Updated ${product.name} quantity in cart!`,
          severity: 'success'
        });
      } else {
        dispatch(addItem({
          product: product._id,
          quantity: 1,
          price: product.price,
          name: product.name,
          image: product.images?.[0] || ''
        }));
        setSnackbar({
          open: true,
          message: `${product.name} added to cart successfully!`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add item to cart. Please try again.',
        severity: 'error'
      });
    } finally {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const getCartItemQuantity = (productId) => {
    const cartItem = items.find(item => item.product === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const hasActiveFilters = searchTerm || selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000 || sortBy !== 'name';

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
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
          🌾 Our Agricultural Products
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', mb: 3 }}>
          Discover quality seeds, fertilizers, and farming equipment for your agricultural needs
        </Typography>
        
        {/* Search Bar */}
        <Paper sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 3,
          boxShadow: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }}>
          <TextField
            fullWidth
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#2E7D32' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{ 
                      borderColor: '#2E7D32', 
                      color: '#2E7D32',
                      '&:hover': { borderColor: '#1B5E20' }
                    }}
                  >
                    Filters
                  </Button>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#2E7D32',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2E7D32',
                },
              },
            }}
          />
        </Paper>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Active Filters:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => setSearchTerm('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedCategory && (
                <Chip
                  label={`Category: ${selectedCategory}`}
                  onDelete={() => setSelectedCategory('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <Chip
                  label={`Price: ₹${priceRange[0]} - ₹${priceRange[1]}`}
                  onDelete={() => setPriceRange([0, 10000])}
                  color="primary"
                  variant="outlined"
                />
              )}
              <Button
                size="small"
                startIcon={<Clear />}
                onClick={clearFilters}
                sx={{ color: '#666' }}
              >
                Clear All
              </Button>
            </Stack>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            boxShadow: 3,
            position: 'sticky',
            top: 20,
            display: { xs: showFilters ? 'block' : 'none', md: 'block' }
          }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2E7D32' }}>
              <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
              Filters & Sort
            </Typography>

            {/* Category Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                <Category sx={{ mr: 1, fontSize: 20 }} />
                Categories
              </Typography>
              <Stack spacing={1}>
                <Chip
                  label="All Categories"
                  onClick={() => setSelectedCategory('')}
                  color={!selectedCategory ? 'primary' : 'default'}
                  variant={!selectedCategory ? 'filled' : 'outlined'}
                  sx={{ justifyContent: 'flex-start' }}
                />
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    color={selectedCategory === category ? 'primary' : 'default'}
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                    sx={{ justifyContent: 'flex-start' }}
                  />
                ))}
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Price Range Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                <PriceCheck sx={{ mr: 1, fontSize: 20 }} />
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={(event, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
                sx={{
                  color: '#2E7D32',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#2E7D32',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">₹{priceRange[0]}</Typography>
                <Typography variant="body2">₹{priceRange[1]}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Sort Options */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                <Sort sx={{ mr: 1, fontSize: 20 }} />
                Sort By
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2E7D32',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2E7D32',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2E7D32',
                    },
                  }}
                >
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                  <MenuItem value="price-low">Price (Low to High)</MenuItem>
                  <MenuItem value="price-high">Price (High to Low)</MenuItem>
                  <MenuItem value="rating">Rating (High to Low)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Results Count */}
            <Box sx={{ 
              p: 2, 
              bgcolor: '#f8f9fa', 
              borderRadius: 2, 
              textAlign: 'center' 
            }}>
              <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                {filteredProducts?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Products Found
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: '#2E7D32' }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
          ) : filteredProducts?.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#666' }}>
                No products found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#999' }}>
                Try adjusting your search terms or filters
              </Typography>
              <Button
                variant="contained"
                onClick={clearFilters}
                sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' } }}
              >
                Clear All Filters
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} lg={4} key={product._id}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Product Image */}
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images?.[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                      sx={{
                        objectFit: 'cover',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, rgba(46, 125, 50, 0.1), rgba(76, 175, 80, 0.1))',
                          zIndex: 1,
                        }
                      }}
                    />

                    {/* Category Badge */}
                    {product.category?.name && (
                      <Chip
                        label={product.category.name}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          bgcolor: 'rgba(46, 125, 50, 0.9)',
                          color: 'white',
                          fontWeight: 'bold',
                          zIndex: 2
                        }}
                      />
                    )}

                    {/* Rating Badge */}
                    <Box sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <Star sx={{ fontSize: 16, color: '#FFD700', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {product.rating?.toFixed(1) || '0.0'}
                      </Typography>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Product Name */}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold', 
                          mb: 1,
                          color: '#2E7D32',
                          lineHeight: 1.3
                        }}
                      >
                        {product.name}
                      </Typography>

                      {/* Product Description */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {product.description || 'No description available'}
                      </Typography>

                      {/* Price */}
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: '#2E7D32',
                          mb: 2
                        }}
                      >
                        ₹{product.price?.toLocaleString() || 0}
                      </Typography>

                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating
                          value={Number(product.rating) || 0}
                          precision={0.1}
                          readOnly
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({product.rating || 0})
                        </Typography>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                        <Button
                          variant="outlined"
                          component={Link}
                          to={`/product/${product._id}`}
                          sx={{
                            flex: 1,
                            borderColor: '#2E7D32',
                            color: '#2E7D32',
                            '&:hover': {
                              borderColor: '#1B5E20',
                              bgcolor: '#f1f8e9'
                            }
                          }}
                        >
                          View Details
                        </Button>
                        <Tooltip title="Add to Cart">
                          <IconButton
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCart[product._id]}
                            sx={{
                              bgcolor: '#2E7D32',
                              color: 'white',
                              '&:hover': {
                                bgcolor: '#1B5E20'
                              },
                              '&:disabled': {
                                bgcolor: '#ccc'
                              }
                            }}
                          >
                            {addingToCart[product._id] ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <Badge badgeContent={getCartItemQuantity(product._id)} color="error">
                                <ShoppingCart />
                              </Badge>
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 