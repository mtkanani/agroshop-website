import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Stack, 
  Card, 
  CardContent, 
  Avatar, 
  Chip, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton
} from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getApprovedStories } from '../api/successStoryApi';
import farmBg from '../assets/farm.jpg';

const categories = [
  {
    name: 'Seeds',
    icon: '🌱',
    description: 'Quality seeds for better yield and crop production',
    color: '#2E7D32',
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

const stats = [
  { value: '50,000+', label: 'Happy Farmers', icon: '👨‍🌾', color: '#2E7D32' },
  { value: '150+', label: 'Quality Products', icon: '🌾', color: '#8BC34A' },
  { value: '98%', label: 'Success Rate', icon: '📈', color: '#FF9800' },
  { value: '24/7', label: 'Expert Support', icon: '🤝', color: '#2196F3' }
];

const soilTypes = [
  'Loamy (Fertile & Rich)',
  'Sandy (Dry & Well-drained)',
  'Clayey (Moist & Heavy)',
  'Black Soil (Cotton-friendly)'
];

const seasons = [
  'Monsoon (Kharif)',
  'Winter (Rabi)',
  'Summer (Zaid)'
];

const matchingTips = {
  'Loamy (Fertile & Rich)-Monsoon (Kharif)': {
    crop: 'Paddy, Maize & Jowar',
    advice: 'Perfect for nutrient-heavy crops. Focus on proper weed control and moisture monitoring.',
    category: 'Seeds'
  },
  'Loamy (Fertile & Rich)-Winter (Rabi)': {
    crop: 'Wheat, Barley & Mustard',
    advice: 'Apply balanced fertilizers early. Excellent for high-yield grains.',
    category: 'Seeds'
  },
  'Loamy (Fertile & Rich)-Summer (Zaid)': {
    crop: 'Watermelon, Cucumber & Pulses',
    advice: 'Maintains decent moisture. Keep drip irrigation active to maximize crop sweetness.',
    category: 'Sprayers'
  },
  'Sandy (Dry & Well-drained)-Monsoon (Kharif)': {
    crop: 'Bajra, Groundnut & Guar',
    advice: 'Drains quickly. Add organic manure/fertilizer to help retain nutrients during rain.',
    category: 'Fertilizers'
  },
  'Sandy (Dry & Well-drained)-Winter (Rabi)': {
    crop: 'Gram & Coriander',
    advice: 'Low water requirement crops are ideal. Apply light sprinkler watering regularly.',
    category: 'Sprayers'
  },
  'Sandy (Dry & Well-drained)-Summer (Zaid)': {
    crop: 'Muskmelon & Fodder Crops',
    advice: 'Needs high temperature but steady moisture. Focus on root health and pesticide protection.',
    category: 'Pesticides'
  },
  'Clayey (Moist & Heavy)-Monsoon (Kharif)': {
    crop: 'Rice (Paddy) & Soyabean',
    advice: 'High moisture retention. Maintain good drainage channels to prevent root rot.',
    category: 'Pesticides'
  },
  'Clayey (Moist & Heavy)-Winter (Rabi)': {
    crop: 'Linseed & Peas',
    advice: 'Excellent for crops that need slow, steady moisture. Do not overwater.',
    category: 'Fertilizers'
  },
  'Clayey (Moist & Heavy)-Summer (Zaid)': {
    crop: 'Vegetables & Green Manure',
    advice: 'Soil might crack in heat. Mulching and sprinkler watering are highly recommended.',
    category: 'Sprayers'
  },
  'Black Soil (Cotton-friendly)-Monsoon (Kharif)': {
    crop: 'Cotton & Sugarcane',
    advice: 'Highly fertile. Cotton responds exceptionally well to timely fertilizer schedules.',
    category: 'Seeds'
  },
  'Black Soil (Cotton-friendly)-Winter (Rabi)': {
    crop: 'Wheat & Safflower',
    advice: 'Retains moisture well. Minimal winter watering required.',
    category: 'Fertilizers'
  },
  'Black Soil (Cotton-friendly)-Summer (Zaid)': {
    crop: 'Sunflowers & Millets',
    advice: 'Protective pesticide spraying is critical due to active pests in warm weather.',
    category: 'Pesticides'
  }
};

export default function Home() {
  const navigate = useNavigate();
  const [farmerStories, setFarmerStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interactive Matcher State
  const [selectedSoil, setSelectedSoil] = useState('Loamy (Fertile & Rich)');
  const [selectedSeason, setSelectedSeason] = useState('Monsoon (Kharif)');

  // Swiper State & Responsive Width Handling
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md')); // Laptop/Desktop (3 items)
  const isSm = useMediaQuery(theme.breakpoints.up('sm')); // Tablet (2 items)
  const visibleCount = isMd ? 3 : (isSm ? 2 : 1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const maxIndex = Math.max(0, farmerStories.length - visibleCount);

  // Reset index if visibleCount changes to avoid layout overflow
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [visibleCount, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApprovedStories();
      setFarmerStories(response.data || []);
    } catch (error) {
      console.error('Error fetching success stories:', error);
      setError('Failed to load success stories. Using sample data instead.');
      const fallbackStories = [
        {
          _id: 'fallback-1',
          name: 'Rajesh Kumar',
          location: 'Punjab',
          crop: 'Wheat',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          testimonial: "Using Agro Shop's quality seeds and fertilizers increased my wheat yield by 40% compared to last year. The expert advice helped me optimize my farming practices.",
          yieldIncrease: 40,
          profitIncrease: 250000,
          timeSaved: 30,
          productsUsed: ['Seeds', 'Fertilizers'],
        },
        {
          _id: 'fallback-2',
          name: 'Lakshmi Devi',
          location: 'Karnataka',
          crop: 'Paddy',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          testimonial: "The organic fertilizers from Agro Shop transformed my paddy field. My crop quality improved significantly and I earned 35% more profit this season.",
          yieldIncrease: 35,
          profitIncrease: 180000,
          timeSaved: 25,
          productsUsed: ['Fertilizers', 'Pesticides'],
        },
        {
          _id: 'fallback-3',
          name: 'Amrit Singh',
          location: 'Haryana',
          crop: 'Cotton',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          testimonial: "Professional sprayers and pesticides from Agro Shop helped me protect my cotton crop from pests. My yield increased by 50% with better quality.",
          yieldIncrease: 50,
          profitIncrease: 320000,
          timeSaved: 40,
          productsUsed: ['Sprayers', 'Pesticides'],
        }
      ];
      setFarmerStories(fallbackStories);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.toLowerCase()}`);
  };

  const currentMatcherResult = matchingTips[`${selectedSoil}-${selectedSeason}`] || {
    crop: 'Millets & Pulses',
    advice: 'A versatile crop option that works well in most local conditions.',
    category: 'Seeds'
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, bgcolor: '#FAFDF6' }}>
      {/* Immersive Creative Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${farmBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: { xs: '450px', md: '550px' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          mb: 5,
          borderRadius: 6,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Modern dark green overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(27, 94, 32, 0.8) 0%, rgba(46, 125, 50, 0.4) 100%)',
            zIndex: 1,
          }}
        />

        {/* Floating Decorative Leaf elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            fontSize: '3rem',
            opacity: 0.15,
            zIndex: 1,
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateY(-15px) rotate(5deg)' }
            }
          }}
        >
          🌿
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '8%',
            fontSize: '4rem',
            opacity: 0.12,
            zIndex: 1,
            animation: 'float 8s ease-in-out infinite alternate',
          }}
        >
          🌱
        </Box>

        {/* Glassmorphic content card */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'left',
            color: 'white',
            width: { xs: '90%', md: '55%' },
            ml: { xs: 2, md: 8 },
            p: { xs: 3, md: 5 },
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            webkitBackdropFilter: 'blur(10px)',
            borderRadius: 5,
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
          }}
        >
          <Chip
            label="🌾 100% Certified Organic & Quality Products"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold',
              mb: 3,
              border: '1px solid rgba(255,255,255,0.3)',
              px: 1,
            }}
          />
          <Typography sx={{ 
            fontWeight: 800, 
            mb: 2, 
            color: 'white', 
            fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' }, 
            lineHeight: 1.15,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            Cultivating Success For Every Farmer
          </Typography>
          <Typography sx={{ 
            color: 'rgba(255,255,255,0.9)', 
            mb: 4, 
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            lineHeight: 1.6
          }}>
            Empowering agricultural journeys with elite seeds, premium fertilizers, eco-friendly pesticides, and expert smart advisor tools.
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#4CAF50',
                color: 'white',
                fontWeight: 700,
                px: 4,
                py: 1.8,
                borderRadius: 3,
                fontSize: '1.05rem',
                boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)',
                '&:hover': {
                  bgcolor: '#388E3C',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.6)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/products')}
            >
              Explore Products
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 700,
                px: 4,
                py: 1.8,
                borderRadius: 3,
                fontSize: '1.05rem',
                borderWidth: '2px',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderColor: 'white',
                  borderWidth: '2px',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => {
                const element = document.getElementById('matcher-tool');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Smart Advisor
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Trust & Stats Section */}
      <Box sx={{ mb: 6, px: { xs: 1, md: 3 } }}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: 4, 
          boxShadow: '0 10px 30px rgba(46,125,50,0.05)',
          border: '1px solid rgba(46,125,50,0.1)',
          background: 'linear-gradient(90deg, #FFFFFF 0%, #F5FBF5 100%)'
        }}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  justifyContent: { xs: 'flex-start', md: 'center' },
                  px: 2
                }}>
                  <Box sx={{ 
                    fontSize: '2.5rem', 
                    p: 1.5, 
                    borderRadius: '50%', 
                    bgcolor: `${stat.color}15`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: '800', color: stat.color, lineHeight: 1.1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {/* Featured Categories with Premium Glow */}
      <Box sx={{ mb: 6, px: { xs: 1, md: 3 } }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1B5E20' }}>
          Explore Categories
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Carefully formulated products matching your specific agricultural needs
        </Typography>
        
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.name}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FFF9 100%)',
                  border: `2px solid ${category.color}20`,
                  borderRadius: 5,
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: `0 15px 30px ${category.color}25`,
                    borderColor: category.color,
                    '& .category-icon': {
                      transform: 'scale(1.2) rotate(6deg)',
                    },
                    '& .category-name': {
                      color: category.color,
                    }
                  }
                }}
                onClick={() => handleCategoryClick(category.name)}
              >
                {/* Category Icon */}
                <Box
                  className="category-icon"
                  sx={{
                    fontSize: '3.5rem',
                    mb: 2,
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: `${category.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
                    mb: 1.5,
                    transition: 'color 0.3s ease',
                    fontSize: '1.25rem'
                  }}
                >
                  {category.name}
                </Typography>

                {/* Category Description */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#666',
                    lineHeight: 1.5,
                    px: 1
                  }}
                >
                  {category.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Smart Soil & Crop Matcher Tool */}
      <Box id="matcher-tool" sx={{ mb: 7, px: { xs: 1, md: 3 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box sx={{ pr: { md: 4 } }}>
              <Chip
                label="💡 SMART FARM ADVISOR"
                sx={{
                  bgcolor: '#E8F5E8',
                  color: '#2E7D32',
                  fontWeight: 'bold',
                  mb: 2,
                }}
              />
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1B5E20', mb: 2, lineHeight: 1.2 }}>
                Find The Best Match For Your Soil
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                Not sure which seeds or treatments to purchase? Select your farm's soil type and current sowing season to instantly unlock tailored crop matches and farming recommendations.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>1</Typography>
                  <Typography variant="body2" color="text.secondary">Select Soil Type</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>2</Typography>
                  <Typography variant="body2" color="text.secondary">Select Season</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>3</Typography>
                  <Typography variant="body2" color="text.secondary">Get Recommendations</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 5, 
              boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
              border: '1px solid rgba(46,125,50,0.08)',
              background: '#FFFFFF'
            }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Soil Type</InputLabel>
                    <Select
                      value={selectedSoil}
                      onChange={(e) => setSelectedSoil(e.target.value)}
                      label="Soil Type"
                    >
                      {soilTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Current Season</InputLabel>
                    <Select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(e.target.value)}
                      label="Current Season"
                    >
                      {seasons.map(season => (
                        <MenuItem key={season} value={season}>{season}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <Box sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  bgcolor: '#F5FAF5', 
                  borderLeft: '5px solid #2E7D32',
                  mt: 1
                }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    RECOMMENDED CROPS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B5E20', mb: 2 }}>
                    🌾 {currentMatcherResult.crop}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                    {currentMatcherResult.advice}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => handleCategoryClick(currentMatcherResult.category)}
                  sx={{
                    bgcolor: '#2E7D32',
                    py: 1.8,
                    fontSize: '1.05rem',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                    '&:hover': {
                      bgcolor: '#1B5E20',
                      boxShadow: '0 6px 16px rgba(46, 125, 50, 0.3)',
                    }
                  }}
                >
                  Shop Recommended {currentMatcherResult.category}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Weather-based Recommendations with Glass cards */}
      <Box sx={{ mb: 7, px: { xs: 1, md: 3 } }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1B5E20' }}>
          🌤️ Smart Weather Tips & Advice
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Optimize your farming calendar based on current seasonal changes
        </Typography>
        
        <Grid container spacing={3}>
          {weatherTips.map((tip, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  borderRadius: 4,
                  border: `2px solid ${tip.color}15`,
                  background: `linear-gradient(135deg, ${tip.color}05, #FFFFFF 100%)`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 25px ${tip.color}20`,
                    borderColor: tip.color,
                  }
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <Typography variant="h3" sx={{ mr: 2 }}>
                      {tip.icon}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {tip.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#555' }}>
                    {tip.content}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Farmer Success Stories with Premium Cards */}
      <Box sx={{ mb: 6, px: { xs: 1, md: 3 } }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1B5E20' }}>
          🌾 Inspiring Farmer Success Stories
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Real stories of success achieved by using our high-quality agricultural products
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#2E7D32' }} />
          </Box>
        ) : error ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'warning.main', py: 4, fontStyle: 'italic' }}>
            {error}
          </Typography>
        ) : farmerStories.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 6 }}>
            No success stories available at the moment.
          </Typography>
        ) : (
          <Box 
            sx={{ 
              position: 'relative', 
              width: '100%',
              px: { xs: 0, sm: 6 }, // Extra padding on sides for arrows
              boxSizing: 'border-box'
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Slider Container */}
            <Box sx={{ overflow: 'hidden', width: '100%', py: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  transform: `translate3d(-${currentIndex * (100 / visibleCount)}%, 0, 0)`,
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  width: '100%',
                }}
              >
                {farmerStories.map((story, index) => (
                  <Box
                    key={story._id || index}
                    sx={{
                      width: `${100 / visibleCount}%`,
                      flexShrink: 0,
                      p: 1.5,
                      boxSizing: 'border-box',
                    }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 5,
                        border: '1px solid rgba(46,125,50,0.1)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 15px 35px rgba(46,125,50,0.15)',
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        {/* Farmer Avatar & Info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar
                            src={story.photo}
                            sx={{ width: 65, height: 65, mr: 2, border: '3px solid #2E7D32', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                          />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1B5E20', lineHeight: 1.2 }}>
                              {story.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              📍 {story.location} • 🌾 {story.crop}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Yield / Profit Metric Cards */}
                        <Grid container spacing={1} sx={{ mb: 3 }}>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#E8F5E8', borderRadius: 2 }}>
                              <Typography sx={{ fontWeight: 'bold', color: '#2E7D32', fontSize: '1.1rem' }}>
                                +{story.yieldIncrease}%
                              </Typography>
                              <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                                Yield
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#E3F2FD', borderRadius: 2 }}>
                              <Typography sx={{ fontWeight: 'bold', color: '#1976D2', fontSize: '1.1rem' }}>
                                ₹{(story.profitIncrease >= 100000) ? `${(story.profitIncrease / 100000).toFixed(1)}L` : story.profitIncrease?.toLocaleString()}
                              </Typography>
                              <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                                Profit
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#FFF3E0', borderRadius: 2 }}>
                              <Typography sx={{ fontWeight: 'bold', color: '#F57C00', fontSize: '1.1rem' }}>
                                {story.timeSaved}%
                              </Typography>
                              <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                                Time Saved
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Testimonial Quote */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontStyle: 'italic', 
                            color: '#555', 
                            lineHeight: 1.7,
                            bgcolor: '#F9FFF9',
                            p: 2.5,
                            borderRadius: 3,
                            borderLeft: '4px solid #2E7D32',
                            mb: 3
                          }}
                        >
                          "{story.testimonial}"
                        </Typography>

                        {/* Products Badge List */}
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 1 }}>
                            PRODUCTS USED:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {story.productsUsed?.map((product, idx) => (
                              <Chip
                                key={idx}
                                label={product}
                                size="small"
                                sx={{
                                  bgcolor: '#E8F5E8',
                                  color: '#2E7D32',
                                  fontWeight: 'bold',
                                  fontSize: '0.75rem',
                                  border: '1px solid rgba(46,125,50,0.15)'
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Left and Right Nav Buttons (visible on screen size sm and up) */}
            {maxIndex > 0 && (
              <>
                <IconButton
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  sx={{
                    position: 'absolute',
                    left: { xs: -8, sm: 0 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'white',
                    color: '#2E7D32',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(46,125,50,0.1)',
                    zIndex: 3,
                    '&:hover': { bgcolor: '#F5FAF5' },
                    '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.5)', color: 'rgba(0,0,0,0.25)' },
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  disabled={currentIndex === maxIndex}
                  sx={{
                    position: 'absolute',
                    right: { xs: -8, sm: 0 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'white',
                    color: '#2E7D32',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(46,125,50,0.1)',
                    zIndex: 3,
                    '&:hover': { bgcolor: '#F5FAF5' },
                    '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.5)', color: 'rgba(0,0,0,0.25)' },
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </>
            )}

            {/* Navigation Dots */}
            {maxIndex > 0 && (
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    sx={{
                      width: idx === currentIndex ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: idx === currentIndex ? '#2E7D32' : 'rgba(46, 125, 50, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
} 