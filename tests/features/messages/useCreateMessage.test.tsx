/// <reference types="jest" />

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCreateMessage } from '@/features/messages/hooks/useCreateMessage';
import { createPost } from '@/api/posts';

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: jest.fn(),
    useInfiniteQuery: jest.fn(),
    useQueryClient: jest.fn(),
    useMutation: jest.fn(),
  };
});
jest.mock('@/api/posts');

const mockedUseMutation = jest.mocked(useMutation);
const mockedUseQueryClient = jest.mocked(useQueryClient);
const mockedCreatePost = jest.mocked(createPost);

beforeEach(() => {
  jest.clearAllMocks();
});

function makeFakeClient(initial?: any) {
  let store = initial ?? { total: 0, limit: 100, offset: 0, results: [] };
  return {
    cancelQueries: jest.fn().mockResolvedValue(undefined),
    getQueryData: jest.fn(() => store),
    setQueryData: jest.fn((_key, updater) => {
      store =
        typeof updater === 'function'
          ? updater(store ?? { total: 0, limit: 100, offset: 0, results: [] })
          : updater;
      return store;
    }),
    invalidateQueries: jest.fn().mockResolvedValue(undefined),
  };
}

function captureOptions() {
  const calls = mockedUseMutation.mock.calls;
  return calls[calls.length - 1][0] as any;
}

const baseStore = { total: 0, limit: 100, offset: 0, results: [] };

describe('useCreateMessage', () => {
  it('optimistically inserts a temp message on send', async () => {
    const fakeClient = makeFakeClient(baseStore);
    mockedUseQueryClient.mockReturnValue(fakeClient as any);
    mockedUseMutation.mockReturnValue({ mutate: jest.fn(), isPending: false, isError: false } as any);

    renderHook(() => useCreateMessage(2));

    const options = captureOptions();
    await act(async () => {
      await options.onMutate({ text: 'hello', clientMessageId: 'cm-1' });
    });

    const lastSetCall = fakeClient.setQueryData.mock.calls[fakeClient.setQueryData.mock.calls.length - 1];
    const updater = lastSetCall[1] as (old: any) => any;
    const state = updater({ total: 0, limit: 100, offset: 0, results: [] });
    const temp = state.results[0];
    expect(temp).toBeDefined();
    expect(temp.clientMessageId).toBe('cm-1');
    expect(temp._optimistic).toBe(true);
    expect(temp._failed).toBeFalsy();
    expect(temp.body).toBe('hello');
    expect(temp.userId).toBe(1);
  });

  it('replaces the temp with the server message without invalidating on success', async () => {
    const fakeClient = makeFakeClient(baseStore);
    mockedUseQueryClient.mockReturnValue(fakeClient as any);
    mockedUseMutation.mockReturnValue({ mutate: jest.fn(), isPending: false, isError: false } as any);
    const serverPost = {
      id: 999,
      userId: 1,
      title: 'hello',
      body: 'hello',
      tags: [],
      category: 'Chat',
      createdAt: '2026-09-04T10:35:04.854Z',
    };
    mockedCreatePost.mockResolvedValue(serverPost);

    renderHook(() => useCreateMessage(2));
    const options = captureOptions();

    await act(async () => {
      const ctx = await options.onMutate({ text: 'hello', clientMessageId: 'cm-1' });
      const data = await options.mutationFn({ text: 'hello', clientMessageId: 'cm-1' });
      options.onSuccess(data, { text: 'hello', clientMessageId: 'cm-1' }, ctx);
      options.onSettled(data, null, { text: 'hello', clientMessageId: 'cm-1' }, ctx);
    });

    expect(mockedCreatePost).toHaveBeenCalledWith({
      userId: 1,
      title: 'hello',
      body: 'hello',
    });
    expect(fakeClient.invalidateQueries).not.toHaveBeenCalled();

    const state = fakeClient.getQueryData();
    expect(state.results).toHaveLength(1);
    expect(state.results[0].id).toBe(999);
    expect(state.results[0].clientMessageId).toBe('cm-1');
  });

  it('keeps the message in a failed state on error', async () => {
    const fakeClient = makeFakeClient(baseStore);
    mockedUseQueryClient.mockReturnValue(fakeClient as any);
    mockedUseMutation.mockReturnValue({ mutate: jest.fn(), isPending: false, isError: false } as any);
    mockedCreatePost.mockRejectedValue(new Error('Network error'));

    renderHook(() => useCreateMessage(2));
    const options = captureOptions();

    await act(async () => {
      const ctx = await options.onMutate({ text: 'hello', clientMessageId: 'cm-1' });
      try {
        await options.mutationFn({ text: 'hello', clientMessageId: 'cm-1' });
      } catch (e) {
        options.onError(e as any, { text: 'hello', clientMessageId: 'cm-1' }, ctx);
        options.onSettled(undefined, e as any, { text: 'hello', clientMessageId: 'cm-1' }, ctx);
      }
    });

    const state = fakeClient.getQueryData();
    expect(state.results).toHaveLength(1);
    expect(state.results[0]._failed).toBe(true);
    expect(state.results[0]._optimistic).toBe(true);
    expect(state.results[0].clientMessageId).toBe('cm-1');
    expect(state.results[0].body).toBe('hello');
  });

  it('invalidates queries on error', async () => {
    const fakeClient = makeFakeClient(baseStore);
    mockedUseQueryClient.mockReturnValue(fakeClient as any);
    mockedUseMutation.mockReturnValue({ mutate: jest.fn(), isPending: false, isError: false } as any);
    mockedCreatePost.mockRejectedValue(new Error('Network error'));

    renderHook(() => useCreateMessage(2));
    const options = captureOptions();

    await act(async () => {
      const ctx = await options.onMutate({ text: 'hello', clientMessageId: 'cm-1' });
      try {
        await options.mutationFn({ text: 'hello', clientMessageId: 'cm-1' });
      } catch (e) {
        options.onError(e as any, { text: 'hello', clientMessageId: 'cm-1' }, ctx);
        options.onSettled(undefined, e as any, { text: 'hello', clientMessageId: 'cm-1' }, ctx);
      }
    });

    expect(fakeClient.invalidateQueries).toHaveBeenCalled();
  });

  it('reuses the same message (no duplicate) when retrying with the same clientMessageId', async () => {
    const fakeClient = makeFakeClient(baseStore);
    mockedUseQueryClient.mockReturnValue(fakeClient as any);
    mockedUseMutation.mockReturnValue({ mutate: jest.fn(), isPending: false, isError: false } as any);
    mockedCreatePost.mockRejectedValue(new Error('Network error'));

    renderHook(() => useCreateMessage(2));
    const options = captureOptions();

    await act(async () => {
      let ctx = await options.onMutate({ text: 'hello', clientMessageId: 'cm-1' });
      try {
        await options.mutationFn({ text: 'hello', clientMessageId: 'cm-1' });
      } catch (e) {
        options.onError(e as any, { text: 'hello', clientMessageId: 'cm-1' }, ctx);
      }

      ctx = await options.onMutate({ text: 'hello', clientMessageId: 'cm-1' });
      try {
        await options.mutationFn({ text: 'hello', clientMessageId: 'cm-1' });
      } catch (e) {
        options.onError(e as any, { text: 'hello', clientMessageId: 'cm-1' }, ctx);
      }
    });

    await waitFor(() => {
      const state = fakeClient.getQueryData();
      expect(state.results).toHaveLength(1);
    });

    const state = fakeClient.getQueryData();
    expect(state.results[0].clientMessageId).toBe('cm-1');
    expect(state.results[0]._failed).toBe(true);
    expect(mockedCreatePost).toHaveBeenCalledTimes(2);
  });
});
