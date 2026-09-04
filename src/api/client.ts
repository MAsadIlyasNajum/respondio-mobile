import { create } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { QueryClient } from '@tanstack/react-query';

export const api = create({
  baseURL: API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      gcTime: 5 * 60 * 1000,
    },
  },
});
