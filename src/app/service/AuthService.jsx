import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const login = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, user);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || 'Login failed';
  }
}

export const register = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, user);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || 'Registration failed';
  }
}