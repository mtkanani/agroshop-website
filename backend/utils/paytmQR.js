// Simulate Paytm QR code generation (for demo)
const generatePaytmQR = (orderId, amount, userEmail) => {
  // In real integration, use Paytm APIs and paytmchecksum
  return `https://api.qrserver.com/v1/create-qr-code/?data=paytm://pay?orderId=${orderId}&amount=${amount}&email=${userEmail}&size=200x200`;
};

module.exports = generatePaytmQR; 