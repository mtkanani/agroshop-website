import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Tooltip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Schedule,
  Cancel,
  Receipt,
  Payment,
  CalendarToday,
  LocationOn,
  Phone,
  Email,
  ArrowForward,
  Download,
  Print,
  Star,
  StarBorder,
  FilterList,
  Sort,
  Search,
  Refresh
} from '@mui/icons-material';
import { fetchOrders } from '../features/userSlice';
import { Link } from 'react-router-dom';

export default function Orders() {
  const dispatch = useDispatch();
  const { userInfo, orders, ordersLoading, ordersError } = useSelector(state => state.user);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  React.useEffect(() => {
    if (userInfo?.token) {
      dispatch(fetchOrders(userInfo.token));
    }
  }, [dispatch, userInfo]);

  // Helper function to get the actual status considering isDelivered
  const getActualStatus = (order) => {
    if (order.isDelivered === true) return 'Delivered';
    if (order.status === 'Cancelled') return 'Cancelled';
    return order.status || 'Pending';
  };

  // Filter and sort orders
  const filteredOrders = orders?.filter(order => {
    const actualStatus = getActualStatus(order);
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actualStatus.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'price-high':
        return b.totalPrice - a.totalPrice;
      case 'price-low':
        return a.totalPrice - b.totalPrice;
      case 'status':
        return getActualStatus(a).localeCompare(getActualStatus(b));
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Group orders by status - considering both status field and isDelivered boolean
  const allOrders = filteredOrders || [];
  const pendingOrders = allOrders.filter(order => 
    getActualStatus(order) === 'Pending'
  );
  const processingOrders = allOrders.filter(order => 
    getActualStatus(order) === 'Processing'
  );
  const shippedOrders = allOrders.filter(order => 
    getActualStatus(order) === 'Shipped'
  );
  const deliveredOrders = allOrders.filter(order => 
    getActualStatus(order) === 'Delivered'
  );
  const cancelledOrders = allOrders.filter(order => 
    getActualStatus(order) === 'Cancelled'
  );

  const getOrderStatusColor = (order) => {
    const status = getActualStatus(order);
    switch (status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getOrderStatusIcon = (order) => {
    const status = getActualStatus(order);
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle />;
      case 'shipped': return <LocalShipping />;
      case 'processing': return <Schedule />;
      case 'pending': return <Schedule />;
      case 'cancelled': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const getOrderStatusBgColor = (order) => {
    const status = getActualStatus(order);
    switch (status?.toLowerCase()) {
      case 'delivered': return '#E8F5E8';
      case 'shipped': return '#E3F2FD';
      case 'processing': return '#FFF3E0';
      case 'pending': return '#F5F5F5';
      case 'cancelled': return '#FFEBEE';
      default: return '#F5F5F5';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrdersByTab = () => {
    switch (activeTab) {
      case 0: return allOrders;
      case 1: return pendingOrders;
      case 2: return processingOrders;
      case 3: return shippedOrders;
      case 4: return deliveredOrders;
      case 5: return cancelledOrders;
      default: return allOrders;
    }
  };

  const currentOrders = getOrdersByTab();

  if (ordersLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} sx={{ color: '#2E7D32' }} />
        </Box>
      </Container>
    );
  }

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
          📦 My Orders
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', mb: 3 }}>
          Track your orders and view order history
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            p: 2, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
            border: '2px solid #4CAF50'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
              {allOrders.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
              Total Orders
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            p: 2, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
            border: '2px solid #FF9800'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F57C00' }}>
              {pendingOrders.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#F57C00', fontWeight: 'bold' }}>
              Pending
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            p: 2, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
            border: '2px solid #2196F3'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
              {shippedOrders.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
              Shipped
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            p: 2, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
            border: '2px solid #4CAF50'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
              {deliveredOrders.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
              Delivered
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            p: 2, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
            border: '2px solid #F44336'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#D32F2F' }}>
              {cancelledOrders.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#D32F2F', fontWeight: 'bold' }}>
              Cancelled
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            p: 2, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
            border: '2px solid #9C27B0'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7B1FA2' }}>
              ₹{allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7B1FA2', fontWeight: 'bold' }}>
              Total Spent
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs and Filters */}
      <Paper sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
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
            <Tab 
              label={`All Orders (${allOrders.length})`} 
              icon={<ShoppingBag />} 
              iconPosition="start" 
            />
            <Tab 
              label={`Pending (${pendingOrders.length})`} 
              icon={<Schedule />} 
              iconPosition="start" 
            />
            <Tab 
              label={`Processing (${processingOrders.length})`} 
              icon={<Schedule />} 
              iconPosition="start" 
            />
            <Tab 
              label={`Shipped (${shippedOrders.length})`} 
              icon={<LocalShipping />} 
              iconPosition="start" 
            />
            <Tab 
              label={`Delivered (${deliveredOrders.length})`} 
              icon={<CheckCircle />} 
              iconPosition="start" 
            />
            <Tab 
              label={`Cancelled (${cancelledOrders.length})`} 
              icon={<Cancel />} 
              iconPosition="start" 
            />
          </Tabs>
        </Box>

        {/* Search and Sort */}
        <Box sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 200 }}>
            <Search sx={{ mr: 1, color: '#666' }} />
            <input
              type="text"
              placeholder="Search orders by ID or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                width: '100%',
                padding: '8px'
              }}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<Sort />}
            onClick={() => setSortBy(sortBy === 'date' ? 'price-high' : 'date')}
            sx={{
              borderColor: '#2E7D32',
              color: '#2E7D32',
              '&:hover': { borderColor: '#1B5E20', bgcolor: '#f1f8e9' }
            }}
          >
            Sort: {sortBy === 'date' ? 'Date' : 'Price'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => dispatch(fetchOrders(userInfo.token))}
            sx={{
              borderColor: '#666',
              color: '#666',
              '&:hover': { borderColor: '#333', bgcolor: '#f5f5f5' }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Orders List */}
      {ordersError && (
        <Alert severity="error" sx={{ mb: 3 }}>{ordersError}</Alert>
      )}

      {currentOrders.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
          <ShoppingBag sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, color: '#666' }}>
            No orders found
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#999' }}>
            {activeTab === 0 
              ? "You haven't placed any orders yet. Start shopping to see your orders here!"
              : `No ${['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'][activeTab]} orders found.`
            }
          </Typography>
          {activeTab === 0 && (
            <Button
              variant="contained"
              href="/products"
              sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' } }}
            >
              Start Shopping
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {currentOrders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
                border: `2px solid ${getOrderStatusBgColor(order)}`,
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 0 }}>
                  {/* Order Header */}
                  <Box sx={{
                    p: 3,
                    background: getOrderStatusBgColor(order),
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            bgcolor: '#2E7D32', 
                            mr: 2,
                            width: 50,
                            height: 50
                          }}>
                            {getOrderStatusIcon(order)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                              Order #{order._id.slice(-8)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(order.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                          <Chip
                            label={getActualStatus(order)}
                            color={getOrderStatusColor(order)}
                            sx={{ fontWeight: 'bold' }}
                          />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                            ₹{order.totalPrice?.toLocaleString() || 0}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Order Details */}
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {/* Order Items */}
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                          Order Items ({order.orderItems?.length || 0})
                        </Typography>
                        <List sx={{ p: 0 }}>
                          {order.orderItems?.slice(0, 3).map((item, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 1 }}>
                              <ListItemAvatar>
                                <Avatar sx={{ 
                                  bgcolor: '#E8F5E8',
                                  color: '#2E7D32',
                                  width: 40,
                                  height: 40
                                }}>
                                  {item.name?.charAt(0) || 'P'}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={item.name}
                                secondary={`Qty: ${item.qty} × ₹${item.price}`}
                                sx={{
                                  '& .MuiListItemText-primary': {
                                    fontWeight: 'bold'
                                  }
                                }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                ₹{(item.qty * item.price).toLocaleString()}
                              </Typography>
                            </ListItem>
                          ))}
                          {order.orderItems?.length > 3 && (
                            <ListItem sx={{ px: 0, py: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                +{order.orderItems.length - 3} more items
                              </Typography>
                            </ListItem>
                          )}
                        </List>
                      </Grid>

                      {/* Order Summary */}
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: '#f8f9fa', 
                          borderRadius: 2,
                          border: '1px solid #e0e0e0'
                        }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2E7D32' }}>
                            Order Summary
                          </Typography>
                          <Stack spacing={1} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Subtotal:</Typography>
                              <Typography variant="body2">₹{order.itemsPrice?.toLocaleString() || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Delivery:</Typography>
                              <Typography variant="body2">₹{order.shippingPrice?.toLocaleString() || 0}</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                ₹{order.totalPrice?.toLocaleString() || 0}
                              </Typography>
                            </Box>
                          </Stack>
                          
                          {/* Payment Method */}
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Payment: {order.paymentMethod}
                            </Typography>
                          </Box>

                          {/* Action Buttons */}
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              component={Link}
                              to={`/order/${order._id}`}
                              startIcon={<Receipt />}
                              sx={{
                                flex: 1,
                                bgcolor: '#2E7D32',
                                '&:hover': { bgcolor: '#1B5E20' },
                                fontSize: '0.8rem'
                              }}
                            >
                              View Details
                            </Button>
                            {getActualStatus(order) === 'Delivered' && (
                              <Tooltip title="Rate Order">
                                <IconButton
                                  sx={{
                                    bgcolor: '#FFD700',
                                    color: '#333',
                                    '&:hover': { bgcolor: '#FFC107' }
                                  }}
                                >
                                  <Star />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
} 