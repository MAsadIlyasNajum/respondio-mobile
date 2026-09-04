/// <reference types="jest" />

import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useContacts } from '@/features/chats/hooks/useContacts';
import { useBlockStore } from '@/store/blockStore';
import { useInfiniteQuery } from '@tanstack/react-query';

jest.mock('@/api/users');
jest.mock('@tanstack/react-query');

const mockedUseInfiniteQuery = jest.mocked(useInfiniteQuery);

beforeEach(() => {
  jest.clearAllMocks();
  useBlockStore.setState({ blockedIds: new Set() });
});

describe('useContacts', () => {
  it('filters out blocked users from results', async () => {
    const mockUsers = [
      { id: 1, name: 'Alice', username: 'alice', email: 'a@b.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
      { id: 2, name: 'Bob', username: 'bob', email: 'b@b.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
      { id: 3, name: 'Charlie', username: 'charlie', email: 'c@b.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
    ];

    mockedUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ results: mockUsers }], pageParams: [0] },
      isLoading: false,
      isError: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
      isPending: false,
      isFetching: false,
    } as any);

    useBlockStore.setState({ blockedIds: new Set(['2']) });

    const { result } = renderHook(() => useContacts());

    expect(result.current.users).toHaveLength(2);
    expect(result.current.users.map((u) => u.id)).not.toContain(2);
  });

  it('returns hasNextPage correctly', async () => {
    const mockUsers = [
      { id: 1, name: 'Alice', username: 'alice', email: 'a@b.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
    ];

    mockedUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ results: mockUsers }], pageParams: [0] },
      isLoading: false,
      isError: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
      isPending: false,
      isFetching: false,
    } as any);

    const { result } = renderHook(() => useContacts());

    expect(result.current.hasNextPage).toBe(false);
  });

  it('fetchNextPage calls fetchNextPage from query', async () => {
    const mockFetchNextPage = jest.fn();

    mockedUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ results: [] }], pageParams: [0] },
      isLoading: false,
      isError: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
      refetch: jest.fn(),
      isPending: false,
      isFetching: false,
    } as any);

    const { result } = renderHook(() => useContacts(1));

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('refetch is returned and callable', async () => {
    const mockRefetch = jest.fn();

    mockedUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ results: [] }], pageParams: [0] },
      isLoading: false,
      isError: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: mockRefetch,
      isPending: false,
      isFetching: false,
    } as any);

    const { result } = renderHook(() => useContacts());

    expect(typeof result.current.refetch).toBe('function');

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('isError is true when query errors', async () => {
    mockedUseInfiniteQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
      isPending: false,
      isFetching: false,
    } as any);

    const { result } = renderHook(() => useContacts());

    expect(result.current.isError).toBe(true);
  });
});
