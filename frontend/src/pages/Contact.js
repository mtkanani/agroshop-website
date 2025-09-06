import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Card, CardContent } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await axios.post(`${API_URL}/contact`, form);
      setSuccess('Your message has been sent!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 450, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#2E7D32' }}>
            Contact Us
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              sx={{ mb: 2 }}
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              sx={{ mb: 2 }}
              value={form.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Message"
              name="message"
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
              value={form.message}
              onChange={handleChange}
              required
            />
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ bgcolor: '#2E7D32' }}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}