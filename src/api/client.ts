import { create } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { QueryClient } from '@tanstack/react-query';

export interface NormalizedApiError {
  message: string;
  status?: number;
  code?: string;
}

export const api = create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized: NormalizedApiError = {
      message: error.response?.data?.message || error.message || 'Something went wrong',
      status: error.response?.status,
      code: error.code,
    };
    return Promise.reject(normalized);
  }
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
      gcTime: 5 * 60 * 1000,
    },
  },
});
