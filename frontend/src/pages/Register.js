import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Card, CardContent, CardHeader, Box, Typography, TextField, Button, CircularProgress, Alert, InputAdornment, Grid, Stack, IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PhoneIcon from '@mui/icons-material/Phone';
import { register } from '../features/userSlice';

const passwordRequirements =
  'At least 8 characters, one uppercase, one lowercase, one number, and one special character';

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'At least 8 characters')
    .matches(/[A-Z]/, 'One uppercase letter')
    .matches(/[a-z]/, 'One lowercase letter')
    .matches(/[0-9]/, 'One number')
    .matches(/[^A-Za-z0-9]/, 'One special character'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
  cityOrVillage: Yup.string().required('Required'),
  contactNumber: Yup.string().required('Required').matches(/^[0-9]{10,15}$/, 'Enter a valid contact number'),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector(state => state.user);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  React.useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

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
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(76, 175, 80, 0.15)',
          top: '-15%',
          right: '-10%',
          filter: 'blur(60px)',
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'rgba(46, 125, 50, 0.1)',
          bottom: '-15%',
          left: '-10%',
          filter: 'blur(70px)',
          zIndex: 0
        }
      }}
    >
      <Card 
        sx={{ 
          maxWidth: { xs: 450, sm: 650 }, 
          width: '100%', 
          boxShadow: '0 8px 32px rgba(46, 125, 50, 0.15)',
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
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
              Create Your Account
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
          <Typography variant="body2" align="center" sx={{ mb: 3.5, color: 'text.secondary', fontSize: '1rem' }}>
            Welcome! Please fill in the details to create your account.
          </Typography>
          <Formik
            initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', cityOrVillage: '', contactNumber: '' }}
            validationSchema={RegisterSchema}
            onSubmit={async (values) => {
              const { confirmPassword, ...rest } = values;
              await dispatch(register(rest));
            }}
          >
            {({ errors, touched, handleChange }) => (
              <Form>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      fullWidth
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.6)',
                          '&:hover fieldset': { borderColor: '#2E7D32' },
                          '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
                        }
                      }}
                      onChange={handleChange}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#2E7D32' }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      fullWidth
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.6)',
                          '&:hover fieldset': { borderColor: '#2E7D32' },
                          '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
                        }
                      }}
                      onChange={handleChange}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#2E7D32' }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      sx={{ 
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
                      InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#2E7D32' }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.6)',
                          '&:hover fieldset': { borderColor: '#2E7D32' },
                          '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
                        }
                      }}
                      onChange={handleChange}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && (errors.password || passwordRequirements)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#2E7D32' }} /></InputAdornment>,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((show) => !show)} edge="end" tabIndex={-1} sx={{ color: '#2E7D32' }}>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      fullWidth
                      sx={{ 
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
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#2E7D32' }} /></InputAdornment>,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirm((show) => !show)} edge="end" tabIndex={-1} sx={{ color: '#2E7D32' }}>
                              {showConfirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City/Village"
                      name="cityOrVillage"
                      fullWidth
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.6)',
                          '&:hover fieldset': { borderColor: '#2E7D32' },
                          '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
                        }
                      }}
                      onChange={handleChange}
                      error={touched.cityOrVillage && Boolean(errors.cityOrVillage)}
                      helperText={touched.cityOrVillage && errors.cityOrVillage}
                      InputProps={{ startAdornment: <InputAdornment position="start"><LocationCityIcon sx={{ color: '#2E7D32' }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Contact Number"
                      name="contactNumber"
                      fullWidth
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.6)',
                          '&:hover fieldset': { borderColor: '#2E7D32' },
                          '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
                        }
                      }}
                      onChange={handleChange}
                      error={touched.contactNumber && Boolean(errors.contactNumber)}
                      helperText={touched.contactNumber && errors.contactNumber}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#2E7D32' }} /></InputAdornment> }}
                    />
                  </Grid>
                </Grid>
                {error && <Alert severity="error" sx={{ mt: 2.5, borderRadius: 2 }}>{error}</Alert>}
                <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
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
                    {loading ? 'Registering...' : 'Register'}
                  </Button>
                  {loading && <CircularProgress size={24} sx={{ ml: 2, alignSelf: 'center', color: '#2E7D32' }} />}
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>Already have an account?</Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/login')} 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: '0.95rem', 
                      p: 0, 
                      minWidth: 0,
                      color: '#2E7D32',
                      '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' }
                    }}
                  >
                    Login Here
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