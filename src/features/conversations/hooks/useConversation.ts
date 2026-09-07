import { useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchPosts } from '@/api/posts';
import { CURRENT_USER_ID } from '@/utils/constants';
import type { Post } from '@/types/Post';

export interface ConversationMessages {
  messages: Post[];
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  refetch: () => void;
}

export const useConversationMessages = (contactId: number | string): ConversationMessages => {
  const cid = Number(contactId);

  const contactQuery = useQuery({
    queryKey: ['conversation', 'contact', String(cid)],
    queryFn: () => fetchPosts({ userId: cid }),
    staleTime: 30_000,
    enabled: Boolean(cid),
  });

  const ownQuery = useQuery({
    queryKey: ['conversation', 'own'],
    queryFn: () => fetchPosts({ userId: CURRENT_USER_ID }),
    staleTime: 30_000,
    enabled: Boolean(cid),
  });

  const messages = useMemo(() => {
    const contactPosts = contactQuery.data?.results ?? [];
    const ownPosts = ownQuery.data?.results ?? [];
    const combined = [...contactPosts, ...ownPosts];

    const seen = new Set<number>();
    const deduped: Post[] = [];
    for (let i = 0; i < combined.length; i++) {
      const post = combined[i];
      if (!seen.has(post.id)) {
        seen.add(post.id);
        deduped.push(post);
      }
    }

    return deduped.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [contactQuery.data?.results, ownQuery.data?.results]);

  return {
    messages,
    isLoading: contactQuery.isLoading || ownQuery.isLoading,
    isError: contactQuery.isError || ownQuery.isError,
    isRefetching: contactQuery.isRefetching || ownQuery.isRefetching,
    refetch: () => {
      contactQuery.refetch();
      ownQuery.refetch();
    },
  };
};

export interface ConversationMetadata {
  contactId: number;
  lastIncoming: Post | null;
  isLoading: boolean;
  isError: boolean;
}

export const useConversationMetadata = (
  contactIds: number[],
  staleTime = 30_000
): Map<number, ConversationMetadata> => {
  const results = useQueries({
    queries: contactIds.map((contactId) => ({
      queryKey: ['conversation', 'metadata', String(contactId)],
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
