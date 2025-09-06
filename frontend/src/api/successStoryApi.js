import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Submit a new success story
export const submitSuccessStory = async (storyData) => {
  try {
    const response = await axios.post(`${API_URL}/success-stories`, storyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error submitting success story' };
  }
};

// Get approved success stories
export const getApprovedStories = async () => {
  try {
    const response = await axios.get(`${API_URL}/success-stories`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching success stories' };
  }
};

// Admin: Get all success stories
export const getAllStories = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/success-stories/admin`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching all success stories' };
  }
};

// Admin: Approve a success story
export const approveStory = async (storyId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_URL}/success-stories/${storyId}/approve`, {}, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error approving success story' };
  }
};

// Admin: Reject a success story
export const rejectStory = async (storyId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_URL}/success-stories/${storyId}/reject`, {}, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error rejecting success story' };
  }
};

// Admin: Delete a success story
export const deleteStory = async (storyId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${API_URL}/success-stories/${storyId}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting success story' };
  }
}; 