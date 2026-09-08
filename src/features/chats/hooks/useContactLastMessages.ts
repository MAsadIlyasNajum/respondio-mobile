import { useMemo } from 'react';
import { useConversationMetadata } from '@/features/conversations/hooks/useConversation';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/api/posts';
import { CURRENT_USER_ID } from '@/utils/constants';
import type { Post } from '@/types/Post';
import { formatConversationTime } from '@/utils/format';

export interface ContactLastMessageResult {
  contactId: number;
  message: Post | null;
  timestamp: string;
  isLoading: boolean;
  isError: boolean;
}

export const useContactLastMessages = (contactIds: number[]): ContactLastMessageResult[] => {
  const conversationMetadata = useConversationMetadata(contactIds);

  const ownQuery = useQuery({
    queryKey: ['conversation', 'own'],
    queryFn: () => fetchPosts({ userId: CURRENT_USER_ID }),
    staleTime: 30_000,
    enabled: contactIds.length > 0,
  });

  const latestOutgoing = useMemo(() => {
    const ownPosts = ownQuery.data?.results ?? [];
    if (ownPosts.length === 0) return null;
    return ownPosts.reduce((latest, post) =>
      new Date(post.createdAt).getTime() > new Date(latest.createdAt).getTime()
        ? post
        : latest
    );
  }, [ownQuery.data?.results]);

  return useMemo(() => {
    return contactIds.map((contactId) => {
      const meta = conversationMetadata.get(contactId);
      const latestIncoming = meta?.lastIncoming ?? null;

      let message: Post | null = null;
      if (latestIncoming && latestOutgoing) {
        message = new Date(latestIncoming.createdAt).getTime() >= new Date(latestOutgoing.createdAt).getTime()
          ? latestIncoming
          : latestOutgoing;
      } else {
        message = latestIncoming ?? latestOutgoing ?? null;
      }

      const timestamp = message ? formatConversationTime(message.createdAt) : '—';
      const isLoading = (meta?.isLoading ?? false) || ownQuery.isLoading;
      const isError = (meta?.isError ?? false) || ownQuery.isError;

      return {
        contactId,
        message,
        timestamp,
        isLoading,
        isError,
      };
    });
  }, [contactIds, conversationMetadata, latestOutgoing, ownQuery.isLoading, ownQuery.isError]);
};