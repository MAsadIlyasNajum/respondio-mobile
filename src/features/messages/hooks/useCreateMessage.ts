import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '@/api/posts';
import { CURRENT_USER_ID } from '@/utils/constants';
import type { Message } from '../types';
import type { PaginatedResponse } from '@/types/Api';

const ownPostsKey = ['conversation', 'own'] as const;
const contactPostsKey = (contactId: number) => ['conversation', 'contact', String(contactId)] as const;

export const useCreateMessage = (contactId: number) => {
  const queryClient = useQueryClient();
  const contactQueryKey = contactPostsKey(contactId);

  return useMutation<Message, Error, { text: string; clientMessageId: string }, { previous?: PaginatedResponse<Message> }>({
    mutationFn: ({ text }) =>
      createPost({ userId: CURRENT_USER_ID, title: text, body: text }),
    onMutate: async ({ text, clientMessageId }) => {
      await queryClient.cancelQueries({ queryKey: ownPostsKey });
      const previous = queryClient.getQueryData<PaginatedResponse<Message>>(ownPostsKey);
      const temp: Message = {
        id: Date.now(),
        clientMessageId,
        userId: CURRENT_USER_ID,
        title: text,
        body: text,
        category: 'Chat',
        tags: [],
        createdAt: new Date().toISOString(),
        _optimistic: true,
      };
      queryClient.setQueryData<PaginatedResponse<Message>>(ownPostsKey, (old) => {
        const results = (old?.results ?? []) as Message[];
        const exists = results.some(
          (m) => m.clientMessageId === clientMessageId
        );
        if (exists) {
          return {
            total: old?.total ?? 0,
            limit: old?.limit ?? 0,
            offset: old?.offset ?? 0,
            results: results.map((m) =>
              m.clientMessageId === clientMessageId
                ? { ...m, _optimistic: true, _failed: undefined }
                : m
            ),
          };
        }
        return {
          total: old?.total ?? 0,
          limit: old?.limit ?? 0,
          offset: old?.offset ?? 0,
          results: [...results, temp],
        };
      });
      return { previous };
    },
    onError: (_err, vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData<PaginatedResponse<Message>>(ownPostsKey, (old) => ({
          ...(old ?? { total: 0, limit: 0, offset: 0, results: [] }),
          results: (old?.results ?? []).map((m) =>
            m.clientMessageId === vars.clientMessageId
              ? { ...m, _optimistic: true, _failed: true }
              : m
          ),
        }));
      }
    },
    onSuccess: (serverPost, vars) => {
      queryClient.setQueryData<PaginatedResponse<Message>>(ownPostsKey, (old) => ({
        ...(old ?? { total: 0, limit: 0, offset: 0, results: [] }),
        results: (old?.results ?? []).map((m) =>
          m.clientMessageId === vars.clientMessageId
            ? { ...(serverPost as Message), clientMessageId: vars.clientMessageId }
            : m
        ),
      }));
      queryClient.invalidateQueries({ queryKey: contactQueryKey });
      queryClient.invalidateQueries({ queryKey: ['conversation', 'metadata', String(contactId)] });
    },
    onSettled: (_data, err) => {
      if (err) {
        queryClient.invalidateQueries({ queryKey: ownPostsKey });
        queryClient.invalidateQueries({ queryKey: contactQueryKey });
        queryClient.invalidateQueries({ queryKey: ['conversation', 'metadata', String(contactId)] });
      }
    },
  });
};
