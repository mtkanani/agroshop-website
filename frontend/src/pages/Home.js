import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button, Stack, Card, CardContent, Avatar, Chip, CircularProgress } from '@mui/material';
import { getApprovedStories } from '../api/successStoryApi';
import farmBg from '../assets/farm.jpg';

const categories = [
  {
    name: 'Seeds',
    icon: '🌱',
    description: 'Quality seeds for better yield and crop production',
    color: '#4CAF50',
    animation: 'sprout'
  },
  {
    name: 'Fertilizers',
    icon: '🧪',
    description: 'Organic and chemical fertilizers for soil nutrition',
    color: '#8BC34A',
    animation: 'soil'
  },
  {
    name: 'Sprayers',
    icon: '💧',
    description: 'Professional spraying equipment for crop protection',
    color: '#2196F3',
    animation: 'droplet'
  },
  {
    name: 'Pesticides',
    icon: '🛡️',
    description: 'Crop protection products for pest control',
    color: '#FF9800',
    animation: 'shield'
  }
];

const weatherTips = [
  {
    title: 'Monsoon Preparation',
    content: 'Prepare your fields early. Clear drainage channels and ensure proper soil preparation for the upcoming monsoon season.',
    icon: '🌧️',
    color: '#2196F3'
  },
  {
    title: 'Seed Selection',
    content: 'Choose monsoon-resistant seed varieties. Look for seeds that can withstand heavy rainfall and high humidity.',
    icon: '🌱',
    color: '#4CAF50'
  },
  {
    title: 'Pest Management',
    content: 'Monitor your crops regularly during monsoon. Early detection of pests can save your entire harvest.',
    icon: '🛡️',
    color: '#FF9800'
  },
  {
    title: 'Soil Health',
    content: 'Test your soil pH before planting. Monsoon can affect soil acidity, so adjust your fertilization accordingly.',
    icon: '🧪',
    color: '#8BC34A'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [farmerStories, setFarmerStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApprovedStories();
      console.log('Success stories response:', response);
      setFarmerStories(response.data || []);
    } catch (error) {
      console.error('Error fetching success stories:', error);
      setError('Failed to load success stories. Using sample data instead.');
      // Fallback to sample data if API fails
      
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.toLowerCase()}`);
  };

  return (
    <Box sx={{ border: '5px', p: 2 }}>
      {/* Welcome Section with Local Agriculture Background Image */}
      <Box
        sx={{
          backgroundImage: `url(${farmBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {/* Overlay for readability */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(44, 167, 80, 0.45)',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'left',
            color: 'white',
            width: { xs: '100%', md: '60%' },
            pl: { xs: 3, md: 8 },
            pr: { xs: 3, md: 0 },
            py: 6,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
            Welcome to Agro Shop
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
            Your one-stop destination for all agricultural products.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#2E7D32',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  color: '#388E3C',
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/products')}
            >
              Shop Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                  color: '#fff',
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/products')}
            >
              Learn More
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Featured Categories with Visual Cards */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#2E7D32' }}>
        Featured Categories
      </Typography>
      <Grid container spacing={3} mb={4}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.name}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${category.color}15, ${category.color}05)`,
                border: `2px solid ${category.color}30`,
                borderRadius: 4,
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 20px 40px ${category.color}40`,
                  borderColor: category.color,
                  '& .category-icon': {
                    transform: 'scale(1.2) rotate(5deg)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  },
                  '& .category-description': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                  '& .category-name': {
                    color: category.color,
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 30% 30%, ${category.color}20, transparent)`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 1,
                }
              }}
              onClick={() => handleCategoryClick(category.name)}
            >
              {/* Category Icon with Animation */}
              <Box
                className="category-icon"
                sx={{
                  fontSize: '4rem',
                  mb: 2,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  animation: category.animation === 'sprout' ? 'sprout 2s ease-in-out infinite' :
                             category.animation === 'droplet' ? 'droplet 2s ease-in-out infinite' :
                             category.animation === 'shield' ? 'shield 2s ease-in-out infinite' :
                             'soil 2s ease-in-out infinite',
                  '@keyframes sprout': {
                    '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
                    '50%': { transform: 'scale(1.1) rotate(5deg)' }
                  },
                  '@keyframes droplet': {
                    '0%, 100%': { transform: 'translateY(0) scale(1)' },
                    '50%': { transform: 'translateY(-5px) scale(1.1)' }
                  },
                  '@keyframes shield': {
                    '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
                    '50%': { transform: 'scale(1.05) rotate(-2deg)' }
                  },
                  '@keyframes soil': {
                    '0%, 100%': { transform: 'scale(1) translateY(0)' },
                    '50%': { transform: 'scale(1.08) translateY(-3px)' }
                  }
                }}
              >
                {category.icon}
              </Box>

              {/* Category Name */}
              <Typography 
                variant="h6" 
                className="category-name"
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#2E7D32',
                  mb: 1,
                  transition: 'color 0.3s ease',
                  fontSize: '1.3rem'
                }}
              >
                {category.name}
              </Typography>

              {/* Category Description (Hidden by default, shown on hover) */}
              <Typography 
                variant="body2" 
                className="category-description"
                sx={{ 
                  color: '#666',
                  opacity: 0,
                  transform: 'translateY(10px)',
                  transition: 'all 0.3s ease',
                  lineHeight: 1.4,
                  px: 1
                }}
              >
                {category.description}
              </Typography>

              {/* Click Indicator */}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: category.color,
                  fontWeight: 600,
                  mt: 1,
                  opacity: 0.7,
                  fontSize: '0.8rem'
                }}
              >
                Click to explore
              </Typography>
      </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Weather-based Recommendations */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#2E7D32' }}>
          🌤️ Weather-based Recommendations
        </Typography>
        <Grid container spacing={3} mb={4}>
          {weatherTips.map((tip, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${tip.color}20`,
                  background: `linear-gradient(135deg, ${tip.color}10, ${tip.color}05)`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${tip.color}30`,
                    borderColor: tip.color,
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h4" sx={{ mr: 2 }}>
                    {tip.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: tip.color }}>
                    {tip.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#555' }}>
                  {tip.content}
                </Typography>
              </Paper>
          </Grid>
        ))}
      </Grid>
      </Box>

      {/* Farmer Success Stories */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#2E7D32' }}>
          🌾 Farmer Success Stories
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#2E7D32' }} />
          </Box>
        ) : error ? (
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'warning.main', py: 2, fontStyle: 'italic' }}>
            {error}
          </Typography>
        ) : farmerStories.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
            No success stories available at the moment.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {farmerStories.map((story, index) => (
              <Grid item xs={12} md={4} key={story._id || index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Farmer Info Header */}
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={story.photo}
                        sx={{ width: 60, height: 60, mr: 2, border: '3px solid #4CAF50' }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                          {story.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {story.location} • {story.crop}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>


                  {/* Success Metrics */}
                  <CardContent sx={{ pt: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32', mb: 1 }}>
                        Success Metrics
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#E8F5E8', borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                              {story.yieldIncrease}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Yield Increase
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#E3F2FD', borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
                              ₹{story.profitIncrease?.toLocaleString() || story.profitIncrease}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Profit Increase
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#FFF3E0', borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F57C00' }}>
                              {story.timeSaved}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Time Saved
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Testimonial */}
                    <Typography variant="body2" sx={{ 
                      fontStyle: 'italic', 
                      color: '#666', 
                      mb: 2,
                      lineHeight: 1.6,
                      bgcolor: '#FAFAFA',
                      p: 2,
                      borderRadius: 1,
                      borderLeft: '4px solid #4CAF50'
                    }}>
                      "{story.testimonial}"
                    </Typography>

                    {/* Products Used */}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Products Used:
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {story.productsUsed?.map((product, idx) => (
                          <Chip
                            key={idx}
                            label={product}
                            size="small"
                            sx={{
                              bgcolor: '#4CAF50',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
} 