import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Typography, Paper, Grid, CircularProgress, Alert, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, 
  FormControlLabel, Tooltip, Stack, Avatar, Chip, MenuItem, Select, FormControl, InputLabel,
  Rating, Divider, Tabs, Tab, List, ListItem, ListItemText, Snackbar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as ProductsIcon,
  Receipt as OrdersIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  LockReset as LockResetIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  TrendingUp as SalesIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

import { 
  fetchStats, 
  fetchUsers, 
  fetchUserDetail, 
  updateUserDetail, 
  deleteUserById, 
  clearAdminStatus, 
  suspendUserThunk, 
  resetUserPasswordThunk 
} from '../features/adminSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PREDEFINED_CATEGORIES = [
  { name: 'Seeds' },
  { name: 'Fertilizers' },
  { name: 'Sprayers' },
  { name: 'Pesticides' }
];

export default function AdminDashboard({ tab }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.user);
  
  // Redux Admin states
  const { 
    stats, statsLoading, statsError, 
    users, usersLoading, usersError, 
    userDetail, userDetailLoading, userDetailError, 
    userUpdateSuccess, userUpdateError, 
    userDeleteSuccess, userDeleteError, 
    userSuspendSuccess, userSuspendError, 
    userResetSuccess, userResetError 
  } = useSelector(state => state.admin);

  // Unified Dashboard tab control
  const [activeTab, setActiveTab] = useState(tab !== undefined ? tab : 0);

  // Local data lists
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  
  const [categories, setCategories] = useState(PREDEFINED_CATEGORIES);

  // Search & Filter local states
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('All');

  // Modals & Forms states
  const [userEditOpen, setUserEditOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState({ firstName: '', lastName: '', email: '', isAdmin: false });

  const [passwordResetOpen, setPasswordResetOpen] = useState(false);
  const [resetPasswordId, setResetPasswordId] = useState(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  const [productAddOpen, setProductAddOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '', description: '', price: '', stock: '', rating: 4.5, category: '', images: ['']
  });

  const [productEditOpen, setProductEditOpen] = useState(false);
  const [editProductForm, setEditProductForm] = useState({
    _id: '', name: '', description: '', price: '', stock: '', rating: 4.5, category: '', images: ['']
  });

  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Image Upload helpers
  const [uploadingImage, setUploadingImage] = useState(false);

  // Snackbar notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Initial fetches
  useEffect(() => {
    if (tab !== undefined) {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    if (userInfo?.isAdmin && userInfo.token) {
      dispatch(fetchStats(userInfo.token));
      dispatch(fetchUsers(userInfo.token));
      fetchProducts();
      fetchOrders();
      fetchCategories();
    }
    // eslint-disable-next-line
  }, [dispatch, userInfo, userUpdateSuccess, userDeleteSuccess, userSuspendSuccess, userResetSuccess]);

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
      setProductsError('');
    } catch (err) {
      setProductsError('Failed to fetch products');
    }
    setProductsLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setOrders(data);
      setOrdersError('');
    } catch (err) {
      setOrdersError('Failed to fetch orders');
    }
    setOrdersLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      if (data && data.length > 0) setCategories(data);
    } catch (err) {
      // Keep predefined categories on error
    }
  };

  // Product Actions
  const handleProductAdd = async () => {
    try {
      await axios.post(`${API_URL}/products`, {
        ...newProductForm,
        price: Number(newProductForm.price),
        stock: Number(newProductForm.stock),
        rating: Number(newProductForm.rating)
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      showNotification('Product added successfully!');
      setProductAddOpen(false);
      setNewProductForm({ name: '', description: '', price: '', stock: '', rating: 4.5, category: '', images: [''] });
      fetchProducts();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to add product', 'error');
    }
  };

  const handleProductEditOpen = (prod) => {
    setEditProductForm({
      _id: prod._id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      rating: prod.rating,
      category: prod.category?._id || prod.category?.name || prod.category || '',
      images: prod.images?.[0] ? [...prod.images] : (prod['images[0]'] ? [prod['images[0]']] : [''])
    });
    setProductEditOpen(true);
  };

  const handleProductEditSave = async () => {
    try {
      await axios.put(`${API_URL}/products/${editProductForm._id}`, {
        ...editProductForm,
        price: Number(editProductForm.price),
        stock: Number(editProductForm.stock),
        rating: Number(editProductForm.rating)
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      showNotification('Product updated successfully!');
      setProductEditOpen(false);
      fetchProducts();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to update product', 'error');
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      showNotification('Product deleted!');
      fetchProducts();
    } catch (err) {
      showNotification('Failed to delete product', 'error');
    }
  };

  const handleImageUpload = async (e, formType) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await axios.post(`${API_URL}/products/upload-image`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${userInfo.token}` 
        }
      });
      if (formType === 'add') {
        setNewProductForm({ ...newProductForm, images: [data.image] });
      } else {
        setEditProductForm({ ...editProductForm, images: [data.image] });
      }
      showNotification('Image uploaded successfully!');
    } catch (err) {
      showNotification('Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Order Actions
  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      showNotification(`Order status updated to ${status}!`);
      fetchOrders();
    } catch (err) {
      showNotification('Failed to update status', 'error');
    }
  };

  // User Actions
  const handleUserEditOpen = (user) => {
    dispatch(fetchUserDetail({ id: user._id, token: userInfo.token }));
    setEditUserForm({ 
      firstName: user.firstName || '', 
      lastName: user.lastName || '', 
      email: user.email || '', 
      isAdmin: user.isAdmin || false 
    });
    setUserEditOpen(true);
  };

  const handleUserUpdate = () => {
    dispatch(updateUserDetail({ 
      id: userDetail._id, 
      user: { 
        firstName: editUserForm.firstName,
        lastName: editUserForm.lastName,
        name: `${editUserForm.firstName} ${editUserForm.lastName}`, 
        email: editUserForm.email, 
        isAdmin: editUserForm.isAdmin 
      }, 
      token: userInfo.token 
    }));
    setUserEditOpen(false);
    showNotification('User details updated!');
  };

  const handleUserDelete = (id) => {
    if (window.confirm('Delete this user permanently?')) {
      dispatch(deleteUserById({ id, token: userInfo.token }));
      showNotification('User deleted!');
    }
  };

  const handleUserSuspend = (id) => {
    dispatch(suspendUserThunk({ id, token: userInfo.token }));
    showNotification('User suspension status toggled!');
  };

  const handlePasswordResetOpen = (id) => {
    setResetPasswordId(id);
    setNewPasswordValue('');
    setPasswordResetOpen(true);
  };

  const handlePasswordResetSubmit = () => {
    dispatch(resetUserPasswordThunk({ id: resetPasswordId, password: newPasswordValue, token: userInfo.token }));
    setPasswordResetOpen(false);
    showNotification('User password has been reset!');
  };

  if (!userInfo?.isAdmin) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error">Access denied. Administrator privileges required.</Alert>
      </Box>
    );
  }

  // Filter lists based on states
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.category?.name || p.category || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'All') return true;
    return o.status === orderFilter;
  });

  const lowStockProducts = products.filter(p => p.stock !== undefined && p.stock < 5);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 1, md: 3 } }}>
      
      {/* Title */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 850, 
          color: '#1B5E20',
          background: 'linear-gradient(45deg, #1B5E20, #4CAF50)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Agro Control Panel
        </Typography>
        <Chip label="👑 SYSTEM ADMINISTRATOR" color="primary" sx={{ fontWeight: 'bold', mt: { xs: 1, sm: 0 } }} />
      </Stack>

      <Grid container spacing={3}>
        {/* Navigation Sidebar (Desktop) / Tabs (Mobile) */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid rgba(46,125,50,0.08)' }}>
            <Tabs
              orientation={window.innerWidth >= 960 ? "vertical" : "horizontal"}
              variant="scrollable"
              value={activeTab}
              onChange={(e, newVal) => setActiveTab(newVal)}
              sx={{
                borderRight: { md: 1 }, 
                borderColor: { md: 'divider' },
                '& .MuiTab-root': {
                  justifyContent: 'flex-start',
                  fontWeight: 'bold',
                  py: 1.5,
                  borderRadius: 2,
                  mb: { md: 1 },
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(46,125,50,0.05)', color: '#2E7D32' }
                },
                '& .Mui-selected': {
                  bgcolor: '#E8F5E8 !important',
                  color: '#1B5E20 !important'
                }
              }}
            >
              <Tab icon={<DashboardIcon sx={{ mr: 1 }} />} iconPosition="start" label="Dashboard Stats" />
              <Tab icon={<PeopleIcon sx={{ mr: 1 }} />} iconPosition="start" label="Manage Users" />
              <Tab icon={<ProductsIcon sx={{ mr: 1 }} />} iconPosition="start" label="Manage Products" />
              <Tab icon={<OrdersIcon sx={{ mr: 1 }} />} iconPosition="start" label="Manage Orders" />
            </Tabs>
          </Paper>
        </Grid>

        {/* Dynamic Panel content */}
        <Grid item xs={12} md={9}>
          {/* TAB 0: OVERVIEW STATS */}
          {activeTab === 0 && (
            <Stack spacing={4}>
              {statsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
              ) : statsError ? (
                <Alert severity="error">{statsError}</Alert>
              ) : stats && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 4, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3, borderLeft: '6px solid #2E7D32' }}>
                      <Avatar sx={{ bgcolor: '#E8F5E8', color: '#2E7D32', width: 60, height: 60 }}>
                        <PeopleIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>TOTAL USERS</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>{stats.totalUsers}</Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 4, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3, borderLeft: '6px solid #2196F3' }}>
                      <Avatar sx={{ bgcolor: '#E3F2FD', color: '#2196F3', width: 60, height: 60 }}>
                        <OrdersIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>TOTAL ORDERS</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>{stats.totalOrders}</Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 4, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3, borderLeft: '6px solid #FF9800' }}>
                      <Avatar sx={{ bgcolor: '#FFF3E0', color: '#FF9800', width: 60, height: 60 }}>
                        <SalesIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>TOTAL SALES</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>₹{stats.totalSales?.toLocaleString()}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {/* Low Stock Warning Box */}
              {lowStockProducts.length > 0 && (
                <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#FFFDEB', border: '1px solid #FFE082' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <WarningIcon color="warning" />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#B78103' }}>
                      Inventory Alert: Low Stock ({lowStockProducts.length} Items)
                    </Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    {lowStockProducts.map(p => (
                      <Grid item xs={12} sm={4} key={p._id}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#FFF' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} noWrap>{p.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Stock level:</Typography>
                          <Chip size="small" label={`${p.stock} units left`} color={p.stock === 0 ? 'error' : 'warning'} sx={{ ml: 1, height: 20 }} />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}

              {/* Quick Navigation Cards */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1B5E20' }}>Inventory Control</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Create new products, modify item catalogs, adjust stocks levels, upload custom Cloudinary product graphics.
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setProductAddOpen(true)}>Add New Product</Button>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1B5E20' }}>Order Processing</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      View customer order invoices, track shipment updates, update status metrics, view online payment validations.
                    </Typography>
                    <Button variant="outlined" startIcon={<OrdersIcon />} onClick={() => setActiveTab(3)}>Go to Orders list</Button>
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          )}

          {/* TAB 1: USERS MANAGEMENT */}
          {activeTab === 1 && (
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(46,125,50,0.08)' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#1B5E20' }}>System User Directory</Typography>
              {usersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
              ) : usersError ? (
                <Alert severity="error">{usersError}</Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Email Address</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>System Role</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map(user => (
                        <TableRow key={user._id} hover>
                          <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <Chip label="Admin" color="primary" size="small" icon={<AdminIcon />} sx={{ fontWeight: 'bold' }} />
                            ) : (
                              <Chip label="User" variant="outlined" size="small" />
                            )}
                          </TableCell>
                          <TableCell>
                            {user.isSuspended ? (
                              <Chip label="Suspended" color="error" size="small" />
                            ) : (
                              <Chip label="Active" color="success" variant="outlined" size="small" />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title={user.isSuspended ? 'Unsuspend Access' : 'Suspend Access'}>
                                <span>
                                  <IconButton onClick={() => handleUserSuspend(user._id)} color={user.isSuspended ? 'success' : 'warning'}>
                                    <BlockIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="Reset Password">
                                <IconButton onClick={() => handlePasswordResetOpen(user._id)} color="primary">
                                  <LockResetIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Profile Details">
                                <IconButton onClick={() => handleUserEditOpen(user)} color="info">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Remove User">
                                <IconButton onClick={() => handleUserDelete(user._id)} color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 2 && (
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(46,125,50,0.08)' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="stretch" spacing={2} sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B5E20', display: 'flex', alignItems: 'center' }}>
                  Manage Products
                </Typography>
                <Stack direction="row" spacing={2} flex={1} justifyContent="flex-end">
                  <TextField 
                    label="Search by name or category..." 
                    size="small" 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 260 } }}
                  />
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setProductAddOpen(true)}>
                    Add Product
                  </Button>
                </Stack>
              </Stack>

              {productsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
              ) : productsError ? (
                <Alert severity="error">{productsError}</Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Product Title</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.map(prod => (
                        <TableRow key={prod._id} hover>
                          <TableCell>
                            <Avatar 
                              variant="rounded"
                              src={prod.images?.[0] || prod['images[0]']}
                              sx={{ width: 50, height: 50, bgcolor: '#e0e0e0' }}
                            >
                              🌾
                            </Avatar>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>{prod.name}</TableCell>
                          <TableCell>
                            <Chip size="small" label={prod.category?.name || prod.category || 'Uncategorized'} sx={{ bgcolor: '#F0F5F0', color: '#2E7D32', fontWeight: 600 }} />
                          </TableCell>
                          <TableCell>₹{prod.price}</TableCell>
                          <TableCell>
                            {prod.stock === 0 ? (
                              <Chip size="small" label="Out of Stock" color="error" />
                            ) : prod.stock < 5 ? (
                              <Chip size="small" label={`${prod.stock} left`} color="warning" />
                            ) : (
                              `${prod.stock} units`
                            )}
                          </TableCell>
                          <TableCell>
                            <Rating size="small" readOnly precision={0.1} value={Number(prod.rating || 0)} />
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton onClick={() => handleProductEditOpen(prod)} color="primary">
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => handleProductDelete(prod._id)} color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 3 && (
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(46,125,50,0.08)' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B5E20' }}>Order Processing Panel</Typography>
                <Tabs 
                  value={orderFilter}
                  onChange={(e, newVal) => setOrderFilter(newVal)}
                  size="small"
                  sx={{
                    '& .MuiTab-root': { py: 0.5, px: 2, minHeight: 35, fontWeight: 'bold' }
                  }}
                >
                  <Tab value="All" label="All" />
                  <Tab value="Pending" label="Pending" />
                  <Tab value="Shipped" label="Shipped" />
                  <Tab value="Delivered" label="Delivered" />
                </Tabs>
              </Stack>

              {ordersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
              ) : ordersError ? (
                <Alert severity="error">{ordersError}</Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total Price</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date Placed</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrders.map(order => (
                        <TableRow key={order._id} hover>
                          <TableCell sx={{ fontFamily: 'monospace' }}>#{order._id.substring(12)}</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{order.user?.email || 'N/A'}</TableCell>
                          <TableCell>₹{order.totalPrice}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                              <Select
                                value={order.status}
                                onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                                sx={{
                                  height: 32,
                                  fontWeight: 'bold',
                                  color: order.status === 'Delivered' ? '#2E7D32' : (order.status === 'Shipped' ? '#2196F3' : '#FF9800'),
                                  bgcolor: order.status === 'Delivered' ? '#E8F5E8' : (order.status === 'Shipped' ? '#E3F2FD' : '#FFF3E0'),
                                }}
                              >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Shipped">Shipped</MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell align="right">
                            <Button 
                              variant="outlined" 
                              size="small" 
                              startIcon={<ViewIcon />}
                              onClick={() => { setSelectedOrder(order); setOrderDetailOpen(true); }}
                            >
                              View Invoice
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* USER EDIT DIALOG */}
      <Dialog open={userEditOpen} onClose={() => setUserEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1B5E20' }}>Edit User Roles</DialogTitle>
        <DialogContent dividers>
          {userDetailLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField 
                label="First Name" 
                value={editUserForm.firstName} 
                onChange={(e) => setEditUserForm({ ...editUserForm, firstName: e.target.value })} 
                fullWidth
              />
              <TextField 
                label="Last Name" 
                value={editUserForm.lastName} 
                onChange={(e) => setEditUserForm({ ...editUserForm, lastName: e.target.value })} 
                fullWidth
              />
              <TextField 
                label="Email" 
                value={editUserForm.email} 
                onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })} 
                fullWidth
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editUserForm.isAdmin} 
                    onChange={(e) => setEditUserForm({ ...editUserForm, isAdmin: e.target.checked })} 
                  />
                }
                label="Grant Administrator access rights"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserEditOpen(false)}>Cancel</Button>
          <Button onClick={handleUserUpdate} variant="contained" disabled={userDetailLoading}>Update User</Button>
        </DialogActions>
      </Dialog>

      {/* RESET PASSWORD DIALOG */}
      <Dialog open={passwordResetOpen} onClose={() => setPasswordResetOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1B5E20' }}>Reset User Password</DialogTitle>
        <DialogContent dividers>
          <TextField 
            label="New Password" 
            type="password" 
            value={newPasswordValue} 
            onChange={(e) => setNewPasswordValue(e.target.value)} 
            fullWidth 
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordResetOpen(false)}>Cancel</Button>
          <Button onClick={handlePasswordResetSubmit} variant="contained" color="error" disabled={!newPasswordValue}>
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* ADD PRODUCT DIALOG */}
      <Dialog open={productAddOpen} onClose={() => setProductAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1B5E20' }}>Add New Product</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField label="Product Name" value={newProductForm.name} onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" value={newProductForm.description} onChange={e => setNewProductForm({ ...newProductForm, description: e.target.value })} fullWidth required multiline minRows={2} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Price (INR)" type="number" value={newProductForm.price} onChange={e => setNewProductForm({ ...newProductForm, price: e.target.value })} fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Initial Stock" type="number" value={newProductForm.stock} onChange={e => setNewProductForm({ ...newProductForm, stock: e.target.value })} fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Initial Rating" type="number" inputProps={{ min: 0, max: 5, step: 0.1 }} value={newProductForm.rating} onChange={e => setNewProductForm({ ...newProductForm, rating: e.target.value })} fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newProductForm.category}
                  onChange={e => setNewProductForm({ ...newProductForm, category: e.target.value })}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat._id || cat.name} value={cat._id || cat.name}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={uploadingImage}
                sx={{ py: 1.5 }}
              >
                {uploadingImage ? <CircularProgress size={20} /> : 'Upload Product Image (Cloudinary)'}
                <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e, 'add')} />
              </Button>
              {newProductForm.images[0] && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Box component="img" src={newProductForm.images[0]} sx={{ maxWidth: '100%', maxHeight: 150, borderRadius: 2 }} />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductAddOpen(false)}>Cancel</Button>
          <Button onClick={handleProductAdd} variant="contained" disabled={!newProductForm.name || !newProductForm.price || uploadingImage}>Add Product</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT PRODUCT DIALOG */}
      <Dialog open={productEditOpen} onClose={() => setProductEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1B5E20' }}>Edit Product Details</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField label="Product Name" value={editProductForm.name} onChange={e => setEditProductForm({ ...editProductForm, name: e.target.value })} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" value={editProductForm.description} onChange={e => setEditProductForm({ ...editProductForm, description: e.target.value })} fullWidth required multiline minRows={2} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Price (INR)" type="number" value={editProductForm.price} onChange={e => setEditProductForm({ ...editProductForm, price: e.target.value })} fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Stock Level" type="number" value={editProductForm.stock} onChange={e => setEditProductForm({ ...editProductForm, stock: e.target.value })} fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Product Rating" type="number" inputProps={{ min: 0, max: 5, step: 0.1 }} value={editProductForm.rating} onChange={e => setEditProductForm({ ...editProductForm, rating: e.target.value })} fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editProductForm.category}
                  onChange={e => setEditProductForm({ ...editProductForm, category: e.target.value })}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat._id || cat.name} value={cat._id || cat.name}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={uploadingImage}
                sx={{ py: 1.5 }}
              >
                {uploadingImage ? <CircularProgress size={20} /> : 'Change Product Image (Cloudinary)'}
                <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e, 'edit')} />
              </Button>
              {editProductForm.images[0] && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Box component="img" src={editProductForm.images[0]} sx={{ maxWidth: '100%', maxHeight: 150, borderRadius: 2 }} />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductEditOpen(false)}>Cancel</Button>
          <Button onClick={handleProductEditSave} variant="contained" disabled={uploadingImage}>Save Details</Button>
        </DialogActions>
      </Dialog>

      {/* VIEW ORDER INVOICE DIALOG */}
      <Dialog open={orderDetailOpen} onClose={() => setOrderDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1B5E20' }}>Order Invoice Summary</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">ORDER NUMBER</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{selectedOrder._id}</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">CUSTOMER EMAIL</Typography>
                  <Typography variant="body1">{selectedOrder.user?.email || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">ORDER STATUS</Typography>
                  <Chip 
                    label={selectedOrder.status}
                    size="small"
                    sx={{
                      fontWeight: 'bold',
                      color: selectedOrder.status === 'Delivered' ? '#2E7D32' : (selectedOrder.status === 'Shipped' ? '#2196F3' : '#FF9800'),
                      bgcolor: selectedOrder.status === 'Delivered' ? '#E8F5E8' : (selectedOrder.status === 'Shipped' ? '#E3F2FD' : '#FFF3E0'),
                      mt: 0.5
                    }}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>SHIPPING ADDRESS</Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  {selectedOrder.shippingAddress?.address || 'No address specified'}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>ITEMS ORDERED</Typography>
                <List sx={{ py: 0 }}>
                  {selectedOrder.orderItems.map((item, idx) => (
                    <ListItem key={item.product || idx} divider sx={{ py: 1, px: 0 }}>
                      <ListItemText
                        primary={`${item.name} (x${item.qty})`}
                        secondary={`Price: ₹${item.price} each`}
                      />
                      <Typography sx={{ fontWeight: 'bold', color: '#1B5E20' }}>
                        ₹{item.price * item.qty}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>TOTAL PRICE</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1B5E20' }}>
                  ₹{selectedOrder.totalPrice}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailOpen(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR NOTIFICATION */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}