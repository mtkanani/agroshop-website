import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
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
    <Box sx={{ minHeight: '100vh', bgcolor: '', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 430, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title={<Typography variant="h5" sx={{ fontWeight: 700, color: '#E7F1FE' }}>Reset Password</Typography>}
          sx={{ bgcolor: 'primary.dark', textAlign: 'center', py: 2 }}
        />
        <CardContent>
          <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
            Enter your new password below.
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
                  sx={{ mb: 2 }}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && (errors.password || 'At least 8 characters, one uppercase, one lowercase, one number, and one special character')}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  sx={{ mb: 2 }}
                  onChange={handleChange}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ minHeight: 44 }}>
                  Reset Password
                </Button>
                {loading && <CircularProgress size={24} sx={{ ml: 2, mt: 2 }} />}
                <Button variant="text" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/login')}>
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