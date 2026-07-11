import React, { useState } from 'react';
import { 
  Box, 
  Container,
  Grid,
  Paper,
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
  ExpandMore,
  Send,
  HelpOutline
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const faqs = [
  {
    question: "Do you deliver to remote rural areas?",
    answer: "Yes, AgroShop specializes in rural delivery! We partner with local logistics providers and Indian Post to deliver seeds, tools, and fertilizers directly to your village within 3-5 business days."
  },
  {
    question: "What payment methods are supported?",
    answer: "We support Paytm, PhonePe, Google Pay (UPI), Net Banking, major Debit/Credit Cards, and Cash on Delivery (COD) for your convenience."
  },
  {
    question: "Are the seeds listed on AgroShop certified?",
    answer: "Absolutely. All agricultural seeds are certified by the National Seeds Corporation (NSC) and undergo strict germination tests before listing."
  },
  {
    question: "How can I cancel or modify my order?",
    answer: "Orders can be cancelled or edited directly from your Profile dashboard within 12 hours of purchase. For urgent modifications, please contact support immediately."
  }
];

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
      setSuccess('Your message has been sent successfully! Our agricultural support team will reply within 24 hours.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#FAFDF6', minHeight: '90vh', py: 6 }}>
      <Container maxWidth="lg">
        
        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" sx={{ fontWeight: 850, color: '#1B5E20', mb: 1 }}>
            How Can We Help You?
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Get in touch with AgroShop's farm support desk or browse frequently asked questions.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Left Grid: Contact Information */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ 
              p: 4, 
              height: '100%', 
              borderRadius: 5, 
              border: '1px solid rgba(46,125,50,0.08)',
              boxShadow: '0 10px 30px rgba(46,125,50,0.04)',
              background: '#FFFFFF'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B5E20', mb: 3 }}>
                Support Headquarters
              </Typography>
              
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ p: 1.2, bgcolor: '#E8F5E8', borderRadius: 3, display: 'flex', color: '#2E7D32' }}>
                    <LocationOn />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Office Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AgroShop Corporate Park, 21 Green Valley Lane,<br />
                      Agricultural Tech Zone, Sector-12, India
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ p: 1.2, bgcolor: '#E8F5E8', borderRadius: 3, display: 'flex', color: '#2E7D32' }}>
                    <Phone />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Helpline Numbers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +91 98765 43210 (Toll Free)<br />
                      +91 1800 234 567 (Crop Advisory Desk)
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ p: 1.2, bgcolor: '#E8F5E8', borderRadius: 3, display: 'flex', color: '#2E7D32' }}>
                    <Email />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Support Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      support@agroshop.com<br />
                      corporate@agroshop.com
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ p: 1.2, bgcolor: '#E8F5E8', borderRadius: 3, display: 'flex', color: '#2E7D32' }}>
                    <AccessTime />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Working Hours
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monday - Saturday: 8:00 AM - 8:00 PM<br />
                      Sunday: Closed
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              <Divider sx={{ my: 4 }} />
              <Typography variant="body2" sx={{ bgcolor: '#FAFDF6', p: 2, borderRadius: 3, border: '1px dashed rgba(46,125,50,0.2)', color: '#2E7D32', fontWeight: 500 }}>
                💡 <strong>Need farm guidance?</strong> Mention your soil type or current crop in your message for customized agricultural recommendation.
              </Typography>
            </Paper>
          </Grid>

          {/* Right Grid: Form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: 5, 
              border: '1px solid rgba(46,125,50,0.08)',
              boxShadow: '0 10px 30px rgba(46,125,50,0.04)',
              background: '#FFFFFF'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B5E20', mb: 3 }}>
                Send Us a Message
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Your Name"
                      name="name"
                      fullWidth
                      value={form.name}
                      onChange={handleChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      fullWidth
                      value={form.email}
                      onChange={handleChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="How can we help your farm today?"
                      name="message"
                      fullWidth
                      multiline
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>{success}</Alert>}
                  {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}
                  
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading} 
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    sx={{ 
                      bgcolor: '#2E7D32',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      boxShadow: '0 4px 12px rgba(46,125,50,0.2)',
                      '&:hover': {
                        bgcolor: '#1B5E20',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 18px rgba(46,125,50,0.3)'
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Form'}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* FAQ Accordion Section */}
        <Box sx={{ mt: 8 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3, justifyContent: 'center' }}>
            <HelpOutline sx={{ color: '#2E7D32', fontSize: 28 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1B5E20' }}>
              Frequently Asked Questions
            </Typography>
          </Stack>
          
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {faqs.map((faq, idx) => (
              <Accordion 
                key={idx} 
                sx={{ 
                  mb: 1.5, 
                  borderRadius: '12px !important', 
                  border: '1px solid rgba(46,125,50,0.06)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                  '&:before': { display: 'none' } 
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#2E7D32' }} />}>
                  <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: '1px solid rgba(46,125,50,0.04)', py: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

      </Container>
    </Box>
  );
}