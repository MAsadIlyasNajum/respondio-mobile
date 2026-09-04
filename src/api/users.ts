import { api } from './client';
import type { User } from '@/types/User';
import type { PaginatedResponse } from '@/types/Api';

export const fetchUsers = async ({
  offset = 0,
  limit = 20,
}: {
  offset?: number;
  limit?: number;
}) => {
  const { data } = await api.get<PaginatedResponse<User>>('/api/users', {
    params: { limit, offset },
  });
  return data;
};

export const fetchUser = async (id: number) => {
  const { data } = await api.get<User>(`/api/users/${id}`);
  return data;
};
