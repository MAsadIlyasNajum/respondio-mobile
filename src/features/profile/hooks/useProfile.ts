import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/api/users';
import type { User } from '@/types/User';
import type { UseProfileResult } from '../types';

export const useProfile = (userId: string | number): UseProfileResult => {
  const id = Number(userId);
  const query = useQuery<User>({
    queryKey: ['user', String(id)],
    queryFn: () => fetchUser(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 60_000,
  });
  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
