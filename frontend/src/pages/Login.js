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
    <Box sx={{ minHeight: '100vh', bgcolor: '', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 430, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title={<Typography variant="h5" sx={{ fontWeight: 700, color: '#E7F1FE' }}>Login to Your Account</Typography>}
          sx={{ bgcolor: 'primary.dark', textAlign: 'center', py: 2 }}
        />
        <CardContent>
          <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
            Welcome back! Please enter your credentials to log in.
          </Typography>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values) => {
              await dispatch(login(values));
            }}
          >
            {({ errors, touched, handleChange }) => (
              <Form>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  sx={{ mb: 2 }}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  sx={{ mb: 1 }}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && (errors.password || 'At least 8 characters, one uppercase, one lowercase, one number, and one special character')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((show) => !show)} edge="end" tabIndex={-1}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Link component="button" variant="body2" onClick={handleForgotPassword} sx={{ fontWeight: 500 }}>
                    Forgot password?
                  </Link>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                  <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 140 }}>
                    Login
                  </Button>
                  {loading && <CircularProgress size={24} sx={{ ml: 2, alignSelf: 'center' }} />}
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}>New user?</Typography>
                  <Button variant="text" onClick={() => navigate('/register')} sx={{ fontWeight: 600, fontSize: 16, p: 0, minWidth: 0 }}>
                    Register
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