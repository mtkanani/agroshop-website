// Generates a standard BHIM UPI Deep-Link QR code
const generatePaytmQR = (orderId, amount, userEmail) => {
  // Reads your business UPI ID from environment variables, or falls back to standard placeholder
  const upiId = process.env.MERCHANT_UPI_ID || 'your_upi_id@okaxis';
  const merchantName = 'AgroShop';
  
  // Standard BHIM UPI deep-link format supported by GPay, PhonePe, Paytm, BHIM, etc.
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=Order_${orderId}`;
  
  // Return public QR API URL encoding the UPI link
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=220x220`;
};

module.exports = generatePaytmQR;