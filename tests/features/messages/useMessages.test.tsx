/// <reference types="jest" />

import { renderHook, act } from '@testing-library/react-native';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { useQuery } from '@tanstack/react-query';

jest.mock('@/api/posts');
jest.mock('@tanstack/react-query');

const mockedUseQuery = jest.mocked(useQuery);

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

const contactPosts = (posts: any[]) => ({
  data: mockPaginated(posts),
  isLoading: false,
  isError: false,
  isRefetching: false,
  isFetching: false,
  isPending: false,
  refetch: jest.fn(),
  status: 'success',
} as any);

const ownPosts = (posts: any[]) => ({
  data: mockPaginated(posts),
  isLoading: false,
  isError: false,
  isRefetching: false,
  isFetching: false,
  isPending: false,
  refetch: jest.fn(),
  status: 'success',
} as any);

const loadingState = {
  data: undefined,
  isLoading: true,
  isError: false,
  isRefetching: false,
  isFetching: true,
  isPending: true,
  refetch: jest.fn(),
  status: 'pending',
} as any;

const errorState = {
  data: undefined,
  isLoading: false,
  isError: true,
  isRefetching: false,
  isFetching: false,
  isPending: false,
  refetch: jest.fn(),
  status: 'error',
} as any;

describe('useMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('query keys', () => {
    it('uses stable, distinct query keys for contact and current-user posts', () => {
      mockedUseQuery.mockReturnValue(loadingState);

      renderHook(() => useMessages(8));

      const callKeys = mockedUseQuery.mock.calls.map((call) => call[0]?.queryKey);
      expect(callKeys).toContainEqual(['conversation', 'contact', '8']);
      expect(callKeys).toContainEqual(['conversation', 'own']);
    });

    it('contact and own query keys differ for the same contact', () => {
      mockedUseQuery.mockReturnValue(loadingState);

      renderHook(() => useMessages(8));

      const callKeys = mockedUseQuery.mock.calls.map((call) => call[0]?.queryKey);
      expect(callKeys[0]).toEqual(['conversation', 'contact', '8']);
      expect(callKeys[1]).toEqual(['conversation', 'own']);
      expect(callKeys[0]).not.toEqual(callKeys[1]);
    });
  });

  describe('merge and order', () => {
    it('merges contact and current-user posts into one conversation', () => {
      const contact = [
        basePost({ id: 10, userId: 8, body: 'hello from contact', createdAt: '2026-09-04T10:00:00.000Z' }),
      ];
      const own = [
        basePost({ id: 11, userId: 1, body: 'hello from me', createdAt: '2026-09-04T11:00:00.000Z' }),
      ];

      mockedUseQuery.mockImplementation((options: any) => {
        const queryKey = options?.queryKey;
        if (queryKey?.[0] === 'conversation' && queryKey?.[1] === 'own') {
          return ownPosts(own);
        }
        return contactPosts(contact);
      });

      const { result } = renderHook(() => useMessages(8));

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages.map((m) => m.id)).toEqual([10, 11]);
    });

    it('sorts messages chronologically (oldest first, newest last)', () => {
      const contact = [
        basePost({ id: 10, userId: 8, body: 'later', createdAt: '2026-09-04T12:00:00.000Z' }),
        basePost({ id: 12, userId: 8, body: 'earliest', createdAt: '2026-09-04T08:00:00.000Z' }),
      ];
      const own = [
        basePost({ id: 11, userId: 1, body: 'middle', createdAt: '2026-09-04T10:00:00.000Z' }),
      ];

      mockedUseQuery.mockImplementation((options: any) => {
        const queryKey = options?.queryKey;
        if (queryKey?.[0] === 'conversation' && queryKey?.[1] === 'own') {
          return ownPosts(own);
        }
        return contactPosts(contact);
      });

      const { result } = renderHook(() => useMessages(8));

      expect(result.current.messages.map((m) => m.body)).toEqual([
        'earliest',
        'middle',
        'later',
      ]);
    });

    it('deduplicates posts with the same id across queries', () => {
      const dupPost = basePost({
        id: 99,
        userId: 8,
        body: 'duplicate',
        createdAt: '2026-09-04T10:00:00.000Z',
      });
      const contact = [dupPost];
      const own = [
        dupPost,
        basePost({ id: 100, userId: 1, body: 'own msg', createdAt: '2026-09-04T11:00:00.000Z' }),
      ];

      mockedUseQuery.mockImplementation((options: any) => {
        const queryKey = options?.queryKey;
        if (queryKey?.[0] === 'conversation' && queryKey?.[1] === 'own') {
          return ownPosts(own);
        }
        return contactPosts(contact);
      });

      const { result } = renderHook(() => useMessages(8));

      const ids = result.current.messages.map((m) => m.id);
      expect(ids.filter((id) => id === 99)).toHaveLength(1);
      expect(ids).toContain(99);
      expect(ids).toContain(100);
      expect(result.current.messages).toHaveLength(2);
    });

    it('excludes posts that do not belong to the contact or current user', () => {
      const contact = [
        basePost({ id: 10, userId: 8, body: 'from contact', createdAt: '2026-09-04T08:00:00.000Z' }),
      ];
      const own = [
        basePost({ id: 11, userId: 1, body: 'from me', createdAt: '2026-09-04T09:00:00.000Z' }),
      ];

      mockedUseQuery.mockImplementation((options: any) => {
        const queryKey = options?.queryKey;
        if (queryKey?.[0] === 'conversation' && queryKey?.[1] === 'own') {
          return ownPosts(own);
        }
        return contactPosts(contact);
      });

      const { result } = renderHook(() => useMessages(8));

      const userIds = result.current.messages.map((m) => m.userId);
      expect(userIds).not.toContain(3);
      expect(userIds).toEqual([8, 1]);
    });
  });

  describe('loading, error, and refetch', () => {
    it('returns isLoading true during initial fetch', () => {
      mockedUseQuery.mockReturnValue(loadingState);

      const { result } = renderHook(() => useMessages(8));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.messages).toEqual([]);
    });

    it('returns isError when either query errors', () => {
      const contactErrorState = { ...errorState, isError: true };
      const ownSuccess = ownPosts([]);

      mockedUseQuery.mockImplementation((options: any) => {
        const queryKey = options?.queryKey;
        if (queryKey?.[0] === 'conversation' && queryKey?.[1] === 'own') {
          return ownSuccess;
        }
        return contactErrorState;
      });

      const { result } = renderHook(() => useMessages(8));

      expect(result.current.isError).toBe(true);
    });

    it('returns isFetching true when either query is refetching', () => {
      const contactRefetching = {
        ...contactPosts([]),
        isRefetching: true,
      };
      const ownSuccess = ownPosts([]);

      mockedUseQuery.mockImplementation((options: any) => {
        const queryKey = options?.queryKey;
        if (queryKey?.[0] === 'conversation' && queryKey?.[1] === 'own') {
          return ownSuccess;
        }
        return contactRefetching;
      });

      const { result } = renderHook(() => useMessages(8));

      expect(result.current.isRefetching).toBe(true);
    });

    it('returns a callable refetch that triggers both queries', async () => {
      const contactRefetch = jest.fn();
      const ownRefetch = jest.fn();

      mockedUseQuery.mockImplementation((options: any) => {
        const queryKey = options?.queryKey;
        if (queryKey?.[0] === 'conversation' && queryKey?.[1] === 'own') {
          return { ...ownPosts([]), refetch: ownRefetch };
        }
        return { ...contactPosts([]), refetch: contactRefetch };
      });

      const { result } = renderHook(() => useMessages(8));

      await act(async () => {
        await result.current.refetch();
      });

      expect(contactRefetch).toHaveBeenCalled();
      expect(ownRefetch).toHaveBeenCalled();
    });
  });
});
