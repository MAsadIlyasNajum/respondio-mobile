import { useInfiniteQuery } from '@tanstack/react-query';
import { useBlockStore } from '@/store/blockStore';
import { fetchUsers } from '@/api/users';
import { CURRENT_USER_ID } from '@/utils/constants';
import type { User } from '@/types/User';

export interface UseContactsResult {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

export const useContacts = (limit = 20): UseContactsResult => {
  const blockedUsers = useBlockStore((state) => state.blockedUsers);

  const query = useInfiniteQuery({
    queryKey: ['users', { limit }],
    queryFn: ({ pageParam = 0 }) => fetchUsers({ offset: pageParam, limit }),
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    initialPageParam: 0,
    staleTime: 60_000,
  });

  const allUsers = query.data?.pages.flatMap((page) => page.results) ?? [];
  const users = allUsers.filter(
    (user) =>
      !blockedUsers.has(String(user.id)) && user.id !== CURRENT_USER_ID,
  );

  return {
    users,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefetching: query.isRefetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
};
