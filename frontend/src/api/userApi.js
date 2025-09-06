import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const loginUser = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
  return data;
};

export const registerUser = async (firstName, lastName, email, password, cityOrVillage, contactNumber) => {
  const { data } = await axios.post(`${API_URL}/auth/register`, { firstName, lastName, email, password, cityOrVillage, contactNumber });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
  return data;
};

export const updateProfile = async (profile, token) => {
  const { data } = await axios.put(`${API_URL}/users/profile`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}; 