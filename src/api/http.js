import axios from 'axios';

const http = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body.code !== 0) {
      return Promise.reject(new Error(body.message || '请求失败'));
    }
    return body;
  },
  (error) => {
    const status = error.response?.status;
    const body = error.response?.data;

    if (status === 401) {
      localStorage.removeItem('foodtime_auth_session');
    }

    const message = body?.message || error.message || '网络异常';
    return Promise.reject(new Error(message));
  }
);

export default http;
