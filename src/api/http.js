import axios from 'axios';

const STORAGE_KEY = 'foodtime_auth_session';

const http = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const session = JSON.parse(raw);
      if (session.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    } catch {
      // ignore parse error
    }
  }
  return config;
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
      window.localStorage.removeItem('foodtime_auth_session');
    }

    const message = body?.message || error.message || '网络异常';
    return Promise.reject(new Error(message));
  }
);

export default http;
