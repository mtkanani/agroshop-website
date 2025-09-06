import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const placeOrder = async (order, token) => {
  const { data } = await axios.post(`${API_URL}/orders`, order, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getMyOrders = async (token) => {
  const { data } = await axios.get(`${API_URL}/orders/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getOrderById = async (id, token) => {
  const { data } = await axios.get(`${API_URL}/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}; 