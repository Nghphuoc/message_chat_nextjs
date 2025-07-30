import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

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
    return response;
  } catch (error) {
    console.error("Registration error:", error.response?.data);

    const detail = error.response?.data?.detail;

    let message = "Đăng ký thất bại";

    if (Array.isArray(detail)) {
      // Pydantic validation error list
      message = detail.map((e) => `${e.loc[1]}: ${e.msg}`).join(", ");
    } else if (typeof detail === "object" && detail?.message) {
      // Custom error like { detail: { message: '...' } }
      message = detail.message;
    }

    throw new Error(message);
  }
}
