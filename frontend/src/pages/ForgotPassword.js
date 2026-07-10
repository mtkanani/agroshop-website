import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Box, Typography, TextField, Button, CircularProgress, Alert, Stack } from '@mui/material';
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
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: { xs: 2, sm: 4 },
        background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #C8E6C9 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(76, 175, 80, 0.12)',
          top: '-10%',
          right: '-10%',
          filter: 'blur(50px)',
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(46, 125, 50, 0.08)',
          bottom: '-10%',
          left: '-10%',
          filter: 'blur(50px)',
          zIndex: 0
        }
      }}
    >
      <Card 
        sx={{ 
          maxWidth: 430, 
          width: '100%', 
          boxShadow: '0 8px 32px rgba(46, 125, 50, 0.15)',
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(46, 125, 50, 0.12)',
          zIndex: 1,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', letterSpacing: '0.5px' }}>
              Forgot Password
            </Typography>
          }
          sx={{ 
            background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)', 
            textAlign: 'center', 
            py: 3,
            color: 'white'
          }}
        />
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="body2" align="center" sx={{ mb: 3, color: 'text.secondary', fontSize: '1rem', lineHeight: 1.5 }}>
            Enter your email address and we'll send you a secure link to reset your password.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              sx={{ 
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.6)',
                  '&:hover fieldset': { borderColor: '#2E7D32' },
                  '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
                }
              }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>{success}</Alert>}
            
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 1 }}>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading} 
                sx={{ 
                  minWidth: 160,
                  py: 1.2,
                  borderRadius: 3,
                  bgcolor: '#2E7D32',
                  boxShadow: '0 4px 12px rgba(46,125,50,0.3)',
                  '&:hover': {
                    bgcolor: '#1B5E20',
                    boxShadow: '0 6px 16px rgba(46,125,50,0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              {loading && <CircularProgress size={24} sx={{ color: '#2E7D32' }} />}
            </Stack>
            
            <Button 
              variant="text" 
              fullWidth 
              sx={{ 
                mt: 3,
                fontWeight: 600,
                color: '#2E7D32',
                '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' }
              }} 
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
} 