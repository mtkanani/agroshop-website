import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getStats = async (token) => {
  const { data } = await axios.get(`${API_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getUsers = async (token) => {
  const { data } = await axios.get(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getUserById = async (id, token) => {
  const { data } = await axios.get(`${API_URL}/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateUser = async (id, user, token) => {
  const { data } = await axios.put(`${API_URL}/admin/users/${id}`, user, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteUser = async (id, token) => {
  const { data } = await axios.delete(`${API_URL}/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const suspendUser = async (id, token) => {
  const { data } = await axios.put(`${API_URL}/admin/users/${id}/suspend`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const resetUserPassword = async (id, password, token) => {
  const { data } = await axios.put(`${API_URL}/admin/users/${id}/reset-password`, { password }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}; 