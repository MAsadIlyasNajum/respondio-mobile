import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/api/posts';
import { CURRENT_USER_ID } from '@/utils/constants';
import type { UseMessagesResult, Message } from '../types';

export const useMessages = (userId: string | number): UseMessagesResult => {
  const cid = Number(userId);
  const query = useQuery({
    queryKey: ['posts', { userId: cid }],
    queryFn: () => fetchPosts({ limit: 100 }),
    staleTime: 30_000,
    enabled: Boolean(cid),
  });
  const all = query.data?.results ?? [];
  const messages = (all as Message[])
    .filter((p) => p.userId === cid || p.userId === CURRENT_USER_ID)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return {
    messages,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
