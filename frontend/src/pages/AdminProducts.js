import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, CircularProgress, Alert, MenuItem, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Rating from '@mui/material/Rating';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Predefined agriculture categories
const AGRICULTURE_CATEGORIES = [
  { name: 'Seeds', description: 'Quality seeds for better yield' },
  { name: 'Fertilizers', description: 'Organic & chemical fertilizers' },
  { name: 'Sprayers', description: 'Professional spraying equipment' },
  { name: 'Pesticides', description: 'Crop protection products' }
];

export default function AdminProducts() {
  const { userInfo } = useSelector(state => state.user);
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [''],
    stock: '',
    rating: '',
  });
  const [actionLoading, setActionLoading] = React.useState(false);
  const [actionError, setActionError] = React.useState('');
  const [actionSuccess, setActionSuccess] = React.useState('');
  const [editOpen, setEditOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ 
    _id: '', 
    rating: '', 
    price: '', 
    stock: '',
    category: '',
    name: '',
    description: ''
  });
  const [editLoading, setEditLoading] = React.useState(false);
  const [editError, setEditError] = React.useState('');
  const [editSuccess, setEditSuccess] = React.useState('');

  React.useEffect(() => {
    if (userInfo?.token) {
      fetchProducts();
      fetchCategories();
    }
    // eslint-disable-next-line
  }, [userInfo]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      // If backend categories exist, use them; otherwise use predefined categories
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // Create predefined categories if none exist
        setCategories(AGRICULTURE_CATEGORIES);
      }
    } catch (err) {
      // Fallback to predefined categories if API fails
      setCategories(AGRICULTURE_CATEGORIES);
    }
  };

  const handleOpen = () => {
    setForm({ name: '', description: '', price: '', category: '', images: [''], stock: '', rating: '' });
    setActionError('');
    setActionSuccess('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActionError('');
    setActionSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rating' || name === 'price' || name === 'stock') {
      setForm({ ...form, [name]: value === '' ? '' : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setForm({ ...form, images: [e.target.value] });
  };

  const handleAddProduct = async () => {
    setActionLoading(true);
    setActionError('');
    setActionSuccess('');
    try {
      await axios.post(`${API_URL}/products`,
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          rating: Number(form.rating),
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setActionSuccess('Product added!');
      fetchProducts();
      setTimeout(() => { setOpen(false); }, 1000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to add product');
    }
    setActionLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setActionLoading(true);
    setActionError('');
    setActionSuccess('');
    try {
      await axios.delete(`${API_URL}/products/${id}`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      setActionSuccess('Product deleted!');
      fetchProducts();
    } catch (err) {
      setActionError('Failed to delete product');
    }
    setActionLoading(false);
  };

  const handleEditOpen = (product) => {
    setEditForm({ 
      _id: product._id, 
      rating: product.rating, 
      price: product.price, 
      stock: product.stock,
      category: product.category?._id || product.category?.name || '',
      name: product.name,
      description: product.description
    });
    setEditError('');
    setEditSuccess('');
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rating' || name === 'price' || name === 'stock') {
      setEditForm({ ...editForm, [name]: value === '' ? '' : Number(value) });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    try {
      await axios.put(`${API_URL}/products/${editForm._id}`,
        {
          rating: editForm.rating === '' ? undefined : Number(editForm.rating),
          price: editForm.price === '' ? undefined : Number(editForm.price),
          stock: editForm.stock === '' ? undefined : Number(editForm.stock),
          category: editForm.category,
          name: editForm.name,
          description: editForm.description
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setEditSuccess('Product updated!');
      fetchProducts();
      setTimeout(() => { setEditOpen(false); }, 1000);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update product');
    }
    setEditLoading(false);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditError('');
    setEditSuccess('');
  };

  if (!userInfo?.isAdmin) return <Typography>Access denied. Admins only.</Typography>;

  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: '#2E7D32', 
          mb: 2,
          background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Manage Product
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>Add Product</Button>
      </Stack>

      {loading ? <CircularProgress sx={{ my: 4 }} /> : error ? <Alert severity="error">{error}</Alert> : (
        <Grid container spacing={2}>
          {products.map(product => (
            <Grid item xs={12} md={6} lg={4} key={product._id}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                  <Typography sx={{ mt: 1 }}>Price: ₹{product.price}</Typography>
                  <Typography>Stock: {product.stock}</Typography>
                  <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                    Category: {product.category?.name || 'Uncategorized'}
                  </Typography>
                  <Rating value={Number(product.rating)} precision={0.1} readOnly size="small" sx={{ mt: 1 }} />
                  {product.images && product.images[0] && (
                    <Box component="img" src={product.images[0]} alt={product.name} sx={{ width: '100%', maxHeight: 120, objectFit: 'cover', mt: 1, borderRadius: 1 }} />
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditOpen(product)}
                      disabled={editLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(product._id)}
                      disabled={actionLoading}
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required multiline minRows={2} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Price" name="price" value={form.price} onChange={handleChange} fullWidth required type="number" />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Stock" name="stock" value={form.stock} onChange={handleChange} fullWidth required type="number" />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Rating" name="rating" value={form.rating} onChange={handleChange} fullWidth required type="number" inputProps={{ min: 0, max: 5, step: 0.1 }} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                fullWidth
                required
                helperText="Select the product category"
              >
                <MenuItem value="" disabled>
                  <em>Select a category</em>
                </MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat._id || cat.name} value={cat._id || cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload Image (JPG/PNG)
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('image', file);
                    const res = await axios.post(
                      `${API_URL}/products/upload-image`,
                      formData,
                      { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } }
                    );
                    setForm({ ...form, images: [res.data.image] });
                  }}
                />
              </Button>
              {form.images[0] && (
                <Box component="img" src={form.images[0]} alt="Preview" sx={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 1 }} />
              )}
            </Grid>
          </Grid>
          {actionError && <Alert severity="error" sx={{ mt: 2 }}>{actionError}</Alert>}
          {actionSuccess && <Alert severity="success" sx={{ mt: 2 }}>{actionSuccess}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddProduct} variant="contained" disabled={actionLoading}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                fullWidth
                required
                multiline
                minRows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Price"
                name="price"
                value={editForm.price}
                onChange={handleEditChange}
                fullWidth
                required
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Stock"
                name="stock"
                value={editForm.stock}
                onChange={handleEditChange}
                fullWidth
                required
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Rating"
                name="rating"
                value={editForm.rating === 0 ? '' : editForm.rating}
                onChange={e => {
                  const value = e.target.value;
                  setEditForm({ ...editForm, rating: value === '' ? '' : Number(value) });
                }}
                fullWidth
                required
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Category"
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                fullWidth
                required
                helperText="Select the product category"
              >
                <MenuItem value="" disabled>
                  <em>Select a category</em>
                </MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat._id || cat.name} value={cat._id || cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          {editError && <Alert severity="error" sx={{ mt: 2 }}>{editError}</Alert>}
          {editSuccess && <Alert severity="success" sx={{ mt: 2 }}>{editSuccess}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={editLoading}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 