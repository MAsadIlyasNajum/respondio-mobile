/// <reference types="jest" />

import { renderHook, act } from '@testing-library/react-native';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { useQuery } from '@tanstack/react-query';

jest.mock('@/api/posts');
jest.mock('@tanstack/react-query');

const mockedUseQuery = jest.mocked(useQuery);

const basePost = (overrides: Partial<Record<string, any>> & { id: number; userId: number; body: string; createdAt: string }) => ({
  id: overrides.id,
  userId: overrides.userId,
  title: overrides.body,
  body: overrides.body,
  tags: [],
  category: 'Chat',
  createdAt: overrides.createdAt,
});

describe('useMessages', () => {
  it('filters posts to the selected contact and the current user', () => {
    const mockPosts = [
      basePost({ id: 10, userId: 2, body: 'to contact', createdAt: '2026-09-04T10:00:00.000Z' }),
      basePost({ id: 11, userId: 1, body: 'from me', createdAt: '2026-09-04T09:00:00.000Z' }),
      basePost({ id: 12, userId: 3, body: 'unrelated', createdAt: '2026-09-04T08:00:00.000Z' }),
      basePost({ id: 13, userId: 2, body: 'to contact 2', createdAt: '2026-09-04T11:00:00.000Z' }),
    ];

    mockedUseQuery.mockReturnValue({
      data: { total: 4, limit: 100, offset: 0, results: mockPosts },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isPending: false,
      isFetching: false,
      status: 'success',
    } as any);

    const { result } = renderHook(() => useMessages(2));

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages.map((m) => m.id)).not.toContain(12);
  });

  it('sorts messages by createdAt ascending', () => {
    const mockPosts = [
      basePost({ id: 10, userId: 2, body: 'later', createdAt: '2026-09-04T12:00:00.000Z' }),
      basePost({ id: 11, userId: 1, body: 'earlier', createdAt: '2026-09-04T08:00:00.000Z' }),
      basePost({ id: 12, userId: 2, body: 'middle', createdAt: '2026-09-04T10:00:00.000Z' }),
    ];

    mockedUseQuery.mockReturnValue({
      data: { total: 3, limit: 100, offset: 0, results: mockPosts },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isPending: false,
      isFetching: false,
      status: 'success',
    } as any);

    const { result } = renderHook(() => useMessages(2));

    expect(result.current.messages.map((m) => m.body)).toEqual(['earlier', 'middle', 'later']);
  });

  it('returns isLoading true during fetch and empty messages', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
      isPending: false,
      isFetching: false,
      status: 'pending',
    } as any);

    const { result } = renderHook(() => useMessages(2));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.messages).toEqual([]);
  });

  it('returns isError true when the query errors', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
      isPending: false,
      isFetching: false,
      status: 'error',
    } as any);

    const { result } = renderHook(() => useMessages(2));

    expect(result.current.isError).toBe(true);
    expect(result.current.messages).toEqual([]);
  });

  it('returns a callable refetch', async () => {
    const mockRefetch = jest.fn();
    mockedUseQuery.mockReturnValue({
      data: { total: 0, limit: 100, offset: 0, results: [] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
      isPending: false,
      isFetching: false,
      status: 'success',
    } as any);

    const { result } = renderHook(() => useMessages(2));

    expect(typeof result.current.refetch).toBe('function');

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockRefetch).toHaveBeenCalled();
  });
});
