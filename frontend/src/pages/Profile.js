import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
  IconButton,
  Container,
  Tab,
  Tabs,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Edit,
  Save,
  Cancel,
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Schedule,
  Star,
  Favorite,
  Settings,
  Security,
  Notifications,
  Help,
  Logout,
  Visibility,
  VisibilityOff,
  CalendarToday,
  Payment,
  LocationOn,
  Phone
} from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { updateProfile, clearProfileStatus } from '../features/userSlice';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  address: Yup.string().min(1, 'Address must be at least 1 characters'),
});

export default function Profile() {
  const dispatch = useDispatch();
  const { userInfo, profileLoading, profileError, profileSuccess, orders } = useSelector(state => state.user);
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  React.useEffect(() => {
    return () => { dispatch(clearProfileStatus()); };
  }, [dispatch]);

  if (!userInfo) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, color: '#666' }}>
            Please login to view your profile
          </Typography>
          <Button 
            variant="contained" 
            href="/login"
            sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' } }}
          >
            Login Now
          </Button>
        </Paper>
      </Container>
    );
  }

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle />;
      case 'shipped': return <LocalShipping />;
      case 'processing': return <Schedule />;
      case 'pending': return <Schedule />;
      default: return <Schedule />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          👤 My Profile
        </Typography>
        <Typography variant="h6" sx={{ color: '#666' }}>
          Manage your account settings and view your order history
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Overview Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            position: 'sticky',
            top: 20
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              {/* Profile Avatar */}
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  bgcolor: '#2E7D32',
                  fontSize: '3rem',
                  border: '4px solid white',
                  boxShadow: 3
                }}
              >
                {userInfo.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>

              {/* User Info */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#2E7D32' }}>
                {userInfo.name}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                {userInfo.email}
              </Typography>

              {/* Member Since */}
              <Chip
                label={`Member since ${new Date().getFullYear()}`}
                sx={{
                  bgcolor: '#E8F5E8',
                  color: '#2E7D32',
                  fontWeight: 'bold',
                  mb: 3
                }}
              />


              {/* Action Buttons */}
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setEditMode(!editMode)}
                  sx={{
                    bgcolor: '#2E7D32',
                    '&:hover': { bgcolor: '#1B5E20' },
                    borderRadius: 2
                  }}
                >
                  {editMode ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
                
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    color: '#666',
                    fontWeight: 'bold',
                    '&.Mui-selected': {
                      color: '#2E7D32'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    bgcolor: '#2E7D32'
                  }
                }}
              >
                <Tab label="Personal Info" icon={<Person />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: 4 }}>
              {/* Personal Info Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#2E7D32' }}>
                    Personal Information
                  </Typography>
                  
                  <Formik
                    initialValues={{ 
                      name: userInfo.firstName || '', 
                      email: userInfo.email || '', 
                      password: '',
                      phone: userInfo.contactNumber || '',
                      address: userInfo.cityOrVillage || ''
                    }}
                    validationSchema={ProfileSchema}
                    onSubmit={async (values) => {
                      await dispatch(updateProfile({ profile: values, token: userInfo.token }));
                      setEditMode(false);
                    }}
                    enableReinitialize
                  >
                    {({ errors, touched, handleChange, values, handleSubmit }) => (
                      <Form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Full Name"
                              name="name"
                              fullWidth
                              value={values.name}
                              onChange={handleChange}
                              error={touched.name && Boolean(errors.name)}
                              helperText={touched.name && errors.name}
                              disabled={!editMode}
                              InputProps={{
                                startAdornment: <Person sx={{ mr: 1, color: '#666' }} />
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': { borderColor: '#2E7D32' },
                                  '&.Mui-focused fieldset': { borderColor: '#2E7D32' }
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Email Address"
                              name="email"
                              fullWidth
                              value={values.email}
                              onChange={handleChange}
                              error={touched.email && Boolean(errors.email)}
                              helperText={touched.email && errors.email}
                              disabled={!editMode}
                              InputProps={{
                                startAdornment: <Email sx={{ mr: 1, color: '#666' }} />
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': { borderColor: '#2E7D32' },
                                  '&.Mui-focused fieldset': { borderColor: '#2E7D32' }
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Phone Number"
                              name="phone"
                              fullWidth
                              value={values.phone}
                              onChange={handleChange}
                              error={touched.phone && Boolean(errors.phone)}
                              helperText={touched.phone && errors.phone}
                              disabled={!editMode}
                              InputProps={{
                                startAdornment: <Phone sx={{ mr: 1, color: '#666' }} />
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': { borderColor: '#2E7D32' },
                                  '&.Mui-focused fieldset': { borderColor: '#2E7D32' }
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="city/Village"
                              name="address"
                              fullWidth
                              rows={3}
                              value={values.address}
                              onChange={handleChange}
                              error={touched.address && Boolean(errors.address)}
                              helperText={touched.address && errors.address}
                              disabled={!editMode}
                              InputProps={{
                                startAdornment: <LocationOn sx={{ mr: 1, color: '#666'}} />
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': { borderColor: '#2E7D32' },
                                  '&.Mui-focused fieldset': { borderColor: '#2E7D32' }
                                }
                              }}
                            />
                          </Grid>
                          {editMode && (
                            <Grid item xs={12}>
                              <TextField
                                label="New Password (leave blank to keep current)"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                onChange={handleChange}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                InputProps={{
                                  startAdornment: <Lock sx={{ mr: 1, color: '#666' }} />,
                                  endAdornment: (
                                    <IconButton
                                      onClick={() => setShowPassword(!showPassword)}
                                      edge="end"
                                    >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  )
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': { borderColor: '#2E7D32' },
                                    '&.Mui-focused fieldset': { borderColor: '#2E7D32' }
                                  }
                                }}
                              />
                            </Grid>
                          )}
                        </Grid>

                        {profileError && (
                          <Alert severity="error" sx={{ mt: 3 }}>{profileError}</Alert>
                        )}
                        {profileSuccess && (
                          <Alert severity="success" sx={{ mt: 3 }}>Profile updated successfully!</Alert>
                        )}

                        {editMode && (
                          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<Save />}
                              disabled={profileLoading}
                              sx={{
                                bgcolor: '#2E7D32',
                                '&:hover': { bgcolor: '#1B5E20' },
                                px: 4
                              }}
                            >
                              Save Changes
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<Cancel />}
                              onClick={() => setEditMode(false)}
                              sx={{
                                borderColor: '#666',
                                color: '#666',
                                '&:hover': { borderColor: '#333', bgcolor: '#f5f5f5' }
                              }}
                            >
                              Cancel
                            </Button>
                            {profileLoading && <CircularProgress size={24} />}
                          </Stack>
                        )}
                      </Form>
                    )}
                  </Formik>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 