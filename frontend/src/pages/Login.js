import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Card, CardContent, CardHeader, Box, Typography, TextField, Button, CircularProgress, Alert, InputAdornment, Stack, IconButton, Link
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login } from '../features/userSlice';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'At least 8 characters')
    .matches(/[A-Z]/, 'One uppercase letter')
    .matches(/[a-z]/, 'One lowercase letter')
    .matches(/[0-9]/, 'One number')
    .matches(/[^A-Za-z0-9]/, 'One special character'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector(state => state.user);
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  const handleForgotPassword = () => {
    navigate('/forgot-password');
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
          background: 'rgba(76, 175, 80, 0.15)',
          top: '-10%',
          right: '-10%',
          filter: 'blur(50px)',
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(46, 125, 50, 0.1)',
          bottom: '-10%',
          left: '-10%',
          filter: 'blur(60px)',
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
              Welcome Back
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
            Please enter your credentials to access your Agro Account.
          </Typography>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values) => {
              await dispatch(login(values));
            }}
          >
            {({ errors, touched, handleChange, values }) => (
              <Form>
                <TextField
                  label="Email"
                  name="email"
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
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  InputProps={{ 
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#2E7D32' }} />
                      </InputAdornment>
                    ) 
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  sx={{ 
                    mb: 1.5,
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#2E7D32' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((show) => !show)} edge="end" tabIndex={-1} sx={{ color: '#2E7D32' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
                  <Link 
                    component="button" 
                    type="button"
                    variant="body2" 
                    onClick={handleForgotPassword} 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#2E7D32',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}
                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
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
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                  {loading && <CircularProgress size={24} sx={{ ml: 2, alignSelf: 'center', color: '#2E7D32' }} />}
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3.5, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>New user?</Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/register')} 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: '0.95rem', 
                      p: 0, 
                      minWidth: 0,
                      color: '#2E7D32',
                      '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' }
                    }}
                  >
                    Register Here
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
} 