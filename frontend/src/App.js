import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Button, 
  Box,
  ThemeProvider,
  createTheme,
  Badge,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  ShoppingCart,
  Home as HomeIcon,
  Store,
  Person,
  AdminPanelSettings,
  Logout,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  LocalShipping,
  Support,
  Security,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { submitSuccessStory } from './api/successStoryApi';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import OrderDetail from './pages/OrderDetail';
import AdminUsers from './pages/AdminUsers';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminProducts from './pages/AdminProducts';
import OrderSuccess from './pages/OrderSuccess';
import AdminOrders from './pages/AdminOrders';
import Contact from './pages/Contact';
import { logout } from './features/userSlice';

// Create agriculture green theme
const agricultureTheme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
    },
    secondary: {
      main: '#4CAF50',
    },
    success: {
      main: '#66BB6A',
    },
    background: {
      default: '#F5F5F5',
    },
    text: {
      primary: '#2E7D32',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2E7D32',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function AppNav() {
  const { userInfo } = useSelector(state => state.user);
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ px: { xs: 1, sm: 3 } }}>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => navigate('/')}
        >
          🌾 Agro Shop
        </Typography>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button 
            color="inherit" 
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Store />}
            onClick={() => navigate('/products')}
          >
            Products
          </Button>
          {userInfo ? (
            <>
              <Button 
                color="inherit" 
                startIcon={<Person />}
                onClick={() => navigate('/profile')}
              >
                Profile
              </Button>
              <Button 
                color="inherit" 
                startIcon={<LocalShipping />}
                onClick={() => navigate('/orders')}
              >
                Orders
              </Button>
              <Button 
                color="inherit" 
                startIcon={<ShoppingCart />}
                onClick={() => navigate('/cart')}
              >
                Cart
                {cartItemCount > 0 && (
                  <Badge badgeContent={cartItemCount} color="error" sx={{ ml: 1 }} />
                )}
              </Button>
              {userInfo.isAdmin && (
                <Button 
                  color="inherit" 
                  startIcon={<AdminPanelSettings />}
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Admin
                </Button>
              )}
              <Button 
                color="inherit" 
                startIcon={<Logout />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Footer Component with Farmer Success Story Form
function Footer() {
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    crop: '',
    yieldIncrease: '',
    profitIncrease: '',
    timeSaved: '',
    testimonial: '',
    productsUsed: []
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.location || !formData.crop || 
          !formData.yieldIncrease || !formData.profitIncrease || 
          !formData.timeSaved || !formData.testimonial || 
          formData.productsUsed.length === 0) {
        throw new Error('Please fill in all required fields');
      }

      const response = await submitSuccessStory(formData);
      
      setSnackbar({
        open: true,
        message: response.message || 'Thank you for sharing your success story! We will review and publish it soon.',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        location: '',
        crop: '',
        yieldIncrease: '',
        profitIncrease: '',
        timeSaved: '',
        testimonial: '',
        productsUsed: []
      });
      setOpenForm(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error submitting your story. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ bgcolor: '#2E7D32', color: 'white', mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ py: 4 }}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              🌾 Agro Shop
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your trusted partner for quality agricultural products and expert farming advice.
            </Typography>
            <Typography variant="body2">
              Empowering farmers with the best tools and knowledge for successful harvests.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                onClick={() => navigate('/products')}
              >
                Products
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                onClick={() => navigate('/about')}
              >
                About Us
              </Typography>
              <Typography
                variant="body2"
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                onClick={() => navigate('/contact')}
              >
                Contact
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                onClick={() => navigate('/support')}
              >
                Support
              </Typography>
            </Box>
          </Grid>

          {/* Share Your Story */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Share Your Success Story
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Are you a farmer who has achieved success with our products? Share your story and inspire others!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
              sx={{
                bgcolor: 'white',
                color: '#2E7D32',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                }
              }}
            >
              Share Your Story
            </Button>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', pt: 2, pb: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            © 2024 Agro Shop. All rights reserved.
          </Typography>
        </Box>
      </Container>

      {/* Farmer Success Story Form Dialog */}
      <Dialog 
        open={openForm} 
        onClose={() => !loading && setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#2E7D32', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Share Your Success Story</Typography>
            <Button
              color="inherit"
              onClick={() => setOpenForm(false)}
              startIcon={<CloseIcon />}
              disabled={loading}
            >
              Close
            </Button>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32' }}>
                  Personal Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Name *"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location (State/City) *"
                  value={formData.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Crop Type *"
                  value={formData.crop}
                  onChange={(e) => handleFormChange('crop', e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>

              {/* Success Metrics */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32' }}>
                  Success Metrics
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Yield Increase (%) *"
                  type="number"
                  value={formData.yieldIncrease}
                  onChange={(e) => handleFormChange('yieldIncrease', e.target.value)}
                  required
                  disabled={loading}
                  inputProps={{ min: 0, max: 1000 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Profit Increase (₹) *"
                  type="number"
                  value={formData.profitIncrease}
                  onChange={(e) => handleFormChange('profitIncrease', e.target.value)}
                  required
                  disabled={loading}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Time Saved (%) *"
                  type="number"
                  value={formData.timeSaved}
                  onChange={(e) => handleFormChange('timeSaved', e.target.value)}
                  required
                  disabled={loading}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>

              {/* Products Used */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32' }}>
                  Products Used *
                </Typography>
                <FormControl fullWidth disabled={loading}>
                  <InputLabel>Select Products Used</InputLabel>
                  <Select
                    multiple
                    value={formData.productsUsed}
                    onChange={(e) => handleFormChange('productsUsed', e.target.value)}
                    label="Select Products Used"
                    required
                  >
                    <MenuItem value="Seeds">Seeds</MenuItem>
                    <MenuItem value="Fertilizers">Fertilizers</MenuItem>
                    <MenuItem value="Sprayers">Sprayers</MenuItem>
                    <MenuItem value="Pesticides">Pesticides</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Testimonial */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32' }}>
                  Your Success Story *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Share your experience and success story"
                  value={formData.testimonial}
                  onChange={(e) => handleFormChange('testimonial', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Tell us about your farming journey, challenges overcome, and how Agro Shop products helped you achieve success..."
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenForm(false)}
            color="inherit"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: '#2E7D32' }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Submitting...' : 'Submit Story'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={agricultureTheme}>
      <Router>
        <AppNav />
        <Box sx={{ pt: 8, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
