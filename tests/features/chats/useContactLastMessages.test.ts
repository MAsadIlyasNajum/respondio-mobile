/// <reference types="jest" />

import { renderHook, act } from '@testing-library/react-native';
import { useContactLastMessages } from '@/features/chats/hooks/useContactLastMessages';
import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/api/posts';

jest.mock('@/api/posts');
jest.mock('@tanstack/react-query');

const mockedUseQueries = jest.mocked(useQueries);
const mockedUseQuery = jest.mocked(useQuery);
const mockedFetchPosts = jest.mocked(fetchPosts);

const mockPaginated = (results: any[]) => ({
  total: results.length,
  limit: 50,
  offset: 0,
  results,
});

const basePost = (overrides: Partial<Record<string, any>> & {
  id: number;
  userId: number;
  body: string;
  createdAt: string;
}) => ({
  id: overrides.id,
  userId: overrides.userId,
  title: overrides.body,
  body: overrides.body,
  tags: [],
  category: 'Chat',
  createdAt: overrides.createdAt,
});

const contactQueryResult = (posts: any[]) => ({
  data: posts.length > 0 ? posts[0] : null,
  isLoading: false,
  isError: false,
  isRefetching: false,
  isPending: false,
  status: 'success',
} as any);

const ownQueryResult = (posts: any[]) => ({
  data: mockPaginated(posts),
  isLoading: false,
  isError: false,
  isRefetching: false,
  isFetching: false,
  isPending: false,
  refetch: jest.fn(),
  status: 'success',
} as any);

const loadingQueryResult = {
  data: undefined,
  isLoading: true,
  isError: false,
  isRefetching: false,
  isFetching: true,
  isPending: true,
  refetch: jest.fn(),
  status: 'pending',
} as any;

const errorQueryResult = {
  data: undefined,
  isLoading: false,
  isError: true,
  isRefetching: false,
  isFetching: false,
  isPending: false,
  refetch: jest.fn(),
  status: 'error',
} as any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useContactLastMessages', () => {
  it('returns empty array when contactIds is empty', () => {
    mockedUseQueries.mockReturnValue([]);
    mockedUseQuery.mockReturnValue({ ...ownQueryResult([]), enabled: false } as any);

    const { result } = renderHook(() => useContactLastMessages([]));

    expect(result.current).toEqual([]);
    expect(mockedUseQueries).toHaveBeenCalledWith({
      queries: [],
    });
  });

  it('fetches latest incoming post per contact', () => {
    const contact1Posts = [
      basePost({ id: 1, userId: 2, body: 'older', createdAt: '2026-09-04T10:00:00.000Z' }),
      basePost({ id: 2, userId: 2, body: 'newer', createdAt: '2026-09-04T12:00:00.000Z' }),
    ];
    const contact2Posts = [
      basePost({ id: 3, userId: 3, body: 'only one', createdAt: '2026-09-04T11:00:00.000Z' }),
    ];

    mockedUseQueries.mockImplementation((options: any) => {
      const queries = options.queries;
      return queries.map((query: any) => {
        const userId = Number(query.queryKey[2]);
        if (userId === 2) return contactQueryResult([contact1Posts[1]]);
        if (userId === 3) return contactQueryResult([contact2Posts[0]]);
        return contactQueryResult([]);
      });
    });

    mockedUseQuery.mockReturnValue(ownQueryResult([]));

    const { result } = renderHook(() => useContactLastMessages([2, 3]));

    expect(result.current).toHaveLength(2);
    expect(result.current[0].contactId).toBe(2);
    expect(result.current[0].message?.body).toBe('newer');
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].isError).toBe(false);

    expect(result.current[1].contactId).toBe(3);
    expect(result.current[1].message?.body).toBe('only one');
  });

  it('returns null message when contact has no posts', () => {
    mockedUseQueries.mockImplementation((options: any) => {
      return options.queries.map(() => contactQueryResult([]));
    });

    mockedUseQuery.mockReturnValue(ownQueryResult([]));

    const { result } = renderHook(() => useContactLastMessages([2]));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].contactId).toBe(2);
    expect(result.current[0].message).toBeNull();
    expect(result.current[0].timestamp).toBe('—');
  });

  it('returns isLoading true when query is loading', () => {
    mockedUseQueries.mockImplementation((options: any) => {
      return options.queries.map(() => loadingQueryResult);
    });

    mockedUseQuery.mockReturnValue(loadingQueryResult);

    const { result } = renderHook(() => useContactLastMessages([2]));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].isLoading).toBe(true);
    expect(result.current[0].message).toBeNull();
  });

  it('returns isError true when query errors', () => {
    mockedUseQueries.mockImplementation((options: any) => {
      return options.queries.map(() => errorQueryResult);
    });

    mockedUseQuery.mockReturnValue(errorQueryResult);

    const { result } = renderHook(() => useContactLastMessages([2]));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].isError).toBe(true);
    expect(result.current[0].message).toBeNull();
  });

  it('uses stable query keys per contact', () => {
    mockedUseQueries.mockImplementation((options: any) => {
      const queries = options.queries;
      return queries.map((query: any) => contactQueryResult([]));
    });

    mockedUseQuery.mockReturnValue(ownQueryResult([]));

    renderHook(() => useContactLastMessages([2, 3]));

    const callArgs = mockedUseQueries.mock.calls[0][0] as any;
    expect(callArgs.queries[0].queryKey).toEqual(['conversation', 'metadata', '2']);
    expect(callArgs.queries[1].queryKey).toEqual(['conversation', 'metadata', '3']);
  });

  it('does not crash with duplicate contact ids', () => {
    mockedUseQueries.mockImplementation((options: any) => {
      return options.queries.map(() => contactQueryResult([]));
    });

    mockedUseQuery.mockReturnValue(ownQueryResult([]));

    const { result } = renderHook(() => useContactLastMessages([2, 2]));

    expect(result.current).toHaveLength(2);
    expect(result.current[0].contactId).toBe(2);
    expect(result.current[1].contactId).toBe(2);
  });

  it('does not attribute outgoing posts to a contact because recipientId is unavailable', () => {
    const incomingPost = basePost({
      id: 1,
      userId: 8,
      body: 'incoming',
      createdAt: '2025-08-01T10:00:00.000Z',
    });
    const outgoingPost = basePost({
      id: 10,
      userId: 1,
      body: 'outgoing',
      createdAt: '2025-08-02T12:00:00.000Z',
    });

    mockedUseQueries.mockImplementation((options: any) => {
      return options.queries.map(() => contactQueryResult([incomingPost]));
    });

    mockedUseQuery.mockReturnValue(ownQueryResult([outgoingPost]));

    const { result } = renderHook(() => useContactLastMessages([8]));

    expect(result.current[0].message?.body).toBe('incoming');
    expect(result.current[0].message?.userId).toBe(8);
  });

  it('returns null when both contact and own queries return empty', () => {
    mockedUseQueries.mockImplementation((options: any) => {
      return options.queries.map(() => contactQueryResult([]));
    });

    mockedUseQuery.mockReturnValue(ownQueryResult([]));

    const { result } = renderHook(() => useContactLastMessages([8]));

    expect(result.current[0].contactId).toBe(8);
    expect(result.current[0].message).toBeNull();
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].isError).toBe(false);
  });

  it('propagates loading state from own query', () => {
    mockedUseQueries.mockImplementation((options: any) => {
      return options.queries.map(() => contactQueryResult([]));
    });

    mockedUseQuery.mockReturnValue(loadingQueryResult);

    const { result } = renderHook(() => useContactLastMessages([8]));

    expect(result.current[0].isLoading).toBe(true);
    expect(result.current[0].message).toBeNull();
  });

  it('propagates error state from own query', () => {
    mockedUseQueries.mockImplementation((options: any) => {
      return options.queries.map(() => contactQueryResult([]));
    });

    mockedUseQuery.mockReturnValue(errorQueryResult);

    const { result } = renderHook(() => useContactLastMessages([8]));

    expect(result.current[0].isError).toBe(true);
    expect(result.current[0].message).toBeNull();
  });
});
