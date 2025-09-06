import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getProducts = async (params) => {
  const { data } = await axios.get(`${API_URL}/products`, { params });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await axios.get(`${API_URL}/products/${id}`);
  return data;
}; 