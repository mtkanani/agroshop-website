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
    <Box sx={{ minHeight: '100vh', bgcolor: '', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 430, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title={<Typography variant="h5" sx={{ fontWeight: 700, color: '#E7F1FE' }}>Create Your Account</Typography>}
          sx={{ bgcolor: 'primary.dark', textAlign: 'center', py: 2 }}
        />
        <CardContent>
          <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
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
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      fullWidth
                      onChange={handleChange}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      fullWidth
                      onChange={handleChange}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      onChange={handleChange}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      onChange={handleChange}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && (errors.password || passwordRequirements)}
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      fullWidth
                      onChange={handleChange}
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirm((show) => !show)} edge="end" tabIndex={-1}>
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
                      onChange={handleChange}
                      error={touched.cityOrVillage && Boolean(errors.cityOrVillage)}
                      helperText={touched.cityOrVillage && errors.cityOrVillage}
                      InputProps={{ startAdornment: <InputAdornment position="start"><LocationCityIcon /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Contact Number"
                      name="contactNumber"
                      fullWidth
                      onChange={handleChange}
                      error={touched.contactNumber && Boolean(errors.contactNumber)}
                      helperText={touched.contactNumber && errors.contactNumber}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment> }}
                    />
                  </Grid>
                </Grid>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                  <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 140 }}>
                    Register
                  </Button>
                  {loading && <CircularProgress size={24} sx={{ ml: 2, alignSelf: 'center' }} />}
                </Stack>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
} 