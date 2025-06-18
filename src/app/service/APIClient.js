// utils/apiClient.js
import axios from 'axios';

class APIClient {
  constructor(baseURL = '') {
    this.instance = axios.create({
      baseURL,
    });

    // Gắn Authorization header cho mỗi request nếu có token
    this.instance.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Xử lý lỗi toàn cục (nếu cần)
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Có thể xử lý redirect nếu 401/403 ở đây
        return Promise.reject(error);
      }
    );
  }

  get(url, config = {}) {
    return this.instance.get(url, config);
  }

  post(url, data = {}, config = {}) {
    return this.instance.post(url, data, config);
  }

  put(url, data = {}, config = {}) {
    return this.instance.put(url, data, config);
  }

  delete(url, config = {}) {
    return this.instance.delete(url, config);
  }
}

// Singleton
const API = new APIClient();

export default API;





/* // pages/profile.js
import { useEffect, useState } from 'react';
import API from '@/utils/apiClient';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/api/user-info');
        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
}
 */