import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { forgotPassword } from '../api/userApi';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await forgotPassword(email);
      setSuccess(res.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset link');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 430, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title={<Typography variant="h5" sx={{ fontWeight: 700, color: '#E7F1FE' }}>Forgot Password</Typography>}
          sx={{ bgcolor: 'primary.dark', textAlign: 'center', py: 2 }}
        />
        <CardContent>
          <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              sx={{ mb: 2 }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ minHeight: 44 }}>
              Send Reset Link
            </Button>
            {loading && <CircularProgress size={24} sx={{ ml: 2, mt: 2 }} />}
            <Button variant="text" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
} 