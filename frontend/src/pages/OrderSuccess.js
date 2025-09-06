import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, Button, Grid, Divider, Stack } from '@mui/material';
import { Download, Receipt, CheckCircle } from '@mui/icons-material';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderResult = location.state?.orderResult;
  // The backend returns { order, qr }, so we need to extract the order object
  const order = orderResult?.order || orderResult;

  React.useEffect(() => {
    if (!orderResult) {
      navigate('/orders');
    }
  }, [orderResult, navigate]);

  const generateBill = () => {
    // Debug: Log the order object to verify data
    console.log('🔍 Order Result:', orderResult);
    console.log('🔍 Order Object for Bill:', order);
    console.log('📋 Order Items:', order.orderItems);
    console.log('💰 Pricing:', {
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      totalPrice: order.totalPrice
    });
    console.log('🆔 Order Details:', {
      orderId: order._id,
      paymentMethod: order.paymentMethod,
      orderDate: order.createdAt
    });

    // Format order date properly
    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : new Date().toLocaleDateString('en-IN');
    
    // Format invoice date
    const invoiceDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create bill content with original order data
    const billContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #2E7D32; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #2E7D32; margin: 0;">🌾 Agro Shop</h1>
          <p style="color: #666; margin: 5px 0;">Your Trusted Agricultural Partner</p>
          <p style="color: #666; margin: 5px 0;">📧 info@agroshop.com | 📞 +91 98765 43210</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #2E7D32; border-bottom: 1px solid #ddd; padding-bottom: 10px;">INVOICE</h2>
          
          <!-- Order Summary Box -->
          <div style="background-color: #f8f9fa; border: 2px solid #2E7D32; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #2E7D32; text-align: center;">📋 ORDER SUMMARY</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
              <div><strong>Order ID:</strong> ${order._id || order.id || 'N/A'}</div>
              <div><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</div>
              <div><strong>Order Date:</strong> ${orderDate}</div>
              <div><strong>Invoice Date:</strong> ${invoiceDate}</div>
              <div><strong>Subtotal:</strong> ₹${order.itemsPrice || 0}</div>
              <div><strong>Total Amount:</strong> ₹${order.totalPrice || 0}</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <h3 style="margin: 0; color: #333;">Bill To:</h3>
              <p style="margin: 5px 0; color: #666;">Customer</p>
              <p style="margin: 5px 0; color: #666;">${order.shippingAddress?.address || 'Address not provided'}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 5px 0; color: #666;"><strong>Invoice Date:</strong> ${invoiceDate}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Order ID:</strong> ${order._id || order.id || 'N/A'}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Order Date:</strong> ${orderDate}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Item</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Quantity</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Price</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems?.map(item => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px;">${item.name || 'Product'}</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.qty || 0}</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₹${item.price || 0}</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₹${(item.price || 0) * (item.qty || 0)}</td>
                </tr>
              `).join('') || '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #666;">No items found</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Subtotal:</span>
            <span>₹${order.itemsPrice || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Delivery Charge:</span>
            <span>₹${order.shippingPrice || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Tax:</span>
            <span>₹${order.taxPrice || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 2px solid #2E7D32; padding-top: 10px; margin-top: 10px;">
            <span style="font-weight: bold; font-size: 18px; color: #2E7D32;">Total:</span>
            <span style="font-weight: bold; font-size: 18px; color: #2E7D32;">₹${order.totalPrice || 0}</span>
          </div>
        </div>

        <div style="margin-bottom: 30px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #2E7D32;">
          <h3 style="margin: 0 0 10px 0; color: #2E7D32;">Order Status</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> ${order.isPaid ? 'Paid' : 'Pending Payment'}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Order Date:</strong> ${orderDate}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Estimated Delivery:</strong> ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>

        <div style="text-align: center; border-top: 2px solid #2E7D32; padding-top: 20px; margin-top: 30px;">
          <p style="color: #666; margin: 5px 0;">Thank you for choosing Agro Shop!</p>
          <p style="color: #666; margin: 5px 0;">For any queries, contact us at support@agroshop.com</p>
          <p style="color: #666; margin: 5px 0; font-size: 12px;">This is a computer-generated invoice. No signature required.</p>
        </div>
      </div>
    `;

    // Create a new window with the bill content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Agro Shop - Invoice</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${billContent}
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="background-color: #2E7D32; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">
              🖨️ Print Bill
            </button>
            <button onclick="window.close()" style="background-color: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
              ❌ Close
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!orderResult || !order) return null;

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
        <Typography variant="h4" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
          Order Placed Successfully!
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
          Order ID: {order._id}
        </Typography>
        <Typography sx={{ color: '#666' }}>
          Thank you for your purchase. You will receive an email with your order details.
        </Typography>
      </Box>

      {/* Order Summary */}
      <Box sx={{ mb: 4, p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32', fontWeight: 'bold' }}>
          📋 Order Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Status:</strong> {order.isPaid ? 'Paid' : 'Pending Payment'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Subtotal:</strong> ₹{order.itemsPrice}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Delivery Charge:</strong> ₹{order.shippingPrice}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#2E7D32' }}>
              <strong>Total:</strong> ₹{order.totalPrice}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Order Items */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32', fontWeight: 'bold' }}>
          🛒 Order Items
        </Typography>
        {order.orderItems?.map((item, index) => (
          <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {item.qty} × ₹{item.price}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ₹{item.price * item.qty}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>

      {/* QR Code for Online Payment */}
      {orderResult?.qr && (
        <Box sx={{ mb: 4, textAlign: 'center', p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32' }}>
            💳 Scan to Pay (Online Payment)
          </Typography>
          <img src={orderResult.qr} alt="Paytm QR" style={{ maxWidth: 200, margin: '16px auto' }} />
        </Box>
      )}

      {/* Action Buttons */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={generateBill}
          sx={{
            bgcolor: '#2E7D32',
            '&:hover': { bgcolor: '#1B5E20' },
            px: 4,
            py: 1.5
          }}
        >
          Download Bill
        </Button>
        <Button
          variant="outlined"
          startIcon={<Receipt />}
          onClick={() => navigate('/orders')}
          sx={{
            borderColor: '#2E7D32',
            color: '#2E7D32',
            '&:hover': {
              borderColor: '#1B5E20',
              bgcolor: '#f1f8e9'
            },
            px: 4,
            py: 1.5
          }}
        >
          View My Orders
        </Button>
      </Stack>
    </Paper>
  );
} 