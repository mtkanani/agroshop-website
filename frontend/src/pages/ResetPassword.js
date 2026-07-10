import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Box, Typography, TextField, Button, CircularProgress, Alert, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { resetPassword } from '../api/userApi';

const ResetSchema = Yup.object().shape({
  password: Yup.string()
    .required('Required')
    .min(8, 'At least 8 characters')
    .matches(/[A-Z]/, 'One uppercase letter')
    .matches(/[a-z]/, 'One lowercase letter')
    .matches(/[0-9]/, 'One number')
    .matches(/[^A-Za-z0-9]/, 'One special character'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
});

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');

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
              Reset Password
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
          <Typography variant="body2" align="center" sx={{ mb: 3, color: 'text.secondary', fontSize: '1rem' }}>
            Enter your new password below to reset your password.
          </Typography>
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={ResetSchema}
            onSubmit={async (values) => {
              setLoading(true);
              setError('');
              setSuccess('');
              try {
                await resetPassword(token, values.password);
                setSuccess('Password reset successful! You can now log in.');
                setTimeout(() => navigate('/login'), 2000);
              } catch (err) {
                setError(err.response?.data?.message || 'Error resetting password');
              }
              setLoading(false);
            }}
          >
            {({ errors, touched, handleChange }) => (
              <Form>
                <TextField
                  label="New Password"
                  name="password"
                  type="password"
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
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && (errors.password || 'At least 8 characters, one uppercase, one lowercase, one number, and one special character')}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
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
                  onChange={handleChange}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
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
                    {loading ? 'Resetting...' : 'Reset Password'}
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
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
} 