import Axios from 'axios';
import { getAccessToken } from './cookies';

const BASE = 'https://stm9wlhp-8003.inc1.devtunnels.ms/api/v1';

export const axios = Axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

axios.interceptors.request.use((config) => {
  try {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

export default axios;
