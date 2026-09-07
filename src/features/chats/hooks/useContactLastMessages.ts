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
    queryKey: ['posts', { userId: CURRENT_USER_ID }],
    queryFn: () => fetchPosts({ userId: CURRENT_USER_ID }),
    staleTime: 30_000,
    enabled: contactIds.length > 0,
  });

  const latestOutgoingByContact = useMemo(() => {
    const ownPosts = ownQuery.data?.results ?? [];
    const map = new Map<number, Post>();
    for (let i = 0; i < ownPosts.length; i++) {
      const post = ownPosts[i];
      const existing = map.get(post.userId);
      if (!existing || new Date(post.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        map.set(post.userId, post);
      }
    }
    return map;
  }, [ownQuery.data?.results]);

  return useMemo(() => {
    return contactIds.map((contactId) => {
      const meta = conversationMetadata.get(contactId);
      const latestIncoming = meta?.lastIncoming ?? null;
      const latestOutgoing = latestOutgoingByContact.get(contactId) ?? null;

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
  }, [contactIds, conversationMetadata, latestOutgoingByContact, ownQuery.isLoading, ownQuery.isError]);
};