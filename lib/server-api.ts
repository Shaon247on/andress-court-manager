"use server";

import Axios from 'axios';
import { getAccessToken } from '@/lib/cookies';

const BASE_URL = process.env.BASE_URL || 'https://stm9wlhp-8003.inc1.devtunnels.ms/api/v1';

export async function getServerApi() {
  const token = await getAccessToken();

  return Axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 15000,
  });
}
