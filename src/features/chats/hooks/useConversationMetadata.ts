import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { fetchPosts } from '@/api/posts';
import type { Post } from '@/types/Post';

export interface ConversationMetadata {
  contactId: number;
  lastIncoming: Post | null;
  isLoading: boolean;
  isError: boolean;
}

export interface UseConversationMetadataOptions {
  staleTime?: number;
}

export const useConversationMetadata = (
  contactIds: number[],
  options: UseConversationMetadataOptions = {}
): Map<number, ConversationMetadata> => {
  const { staleTime = 30_000 } = options;

  const results = useQueries({
    queries: contactIds.map((contactId) => ({
      queryKey: ['conversation', String(contactId)],
      queryFn: () => fetchPosts({ userId: contactId }),
      staleTime,
      select: (data: { results: Post[] }) => {
        const contactPosts = data.results.filter((p) => p.userId === contactId);
        if (contactPosts.length === 0) return null;
        return contactPosts.reduce((latest, post) =>
          new Date(post.createdAt).getTime() > new Date(latest.createdAt).getTime()
            ? post
            : latest
        );
      },
    })),
  });

  return useMemo(() => {
    const map = new Map<number, ConversationMetadata>();
    contactIds.forEach((contactId, index) => {
      const query = results[index];
      map.set(contactId, {
        contactId,
        lastIncoming: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
      });
    });
    return map;
  }, [contactIds, results]);
};
