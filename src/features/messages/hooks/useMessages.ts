import type { UseMessagesResult } from '../types';
import { useConversationMessages } from '@/features/conversations/hooks/useConversation';

export const useMessages = (userId: string | number): UseMessagesResult => {
  const conversation = useConversationMessages(Number(userId));

  return {
    messages: conversation.messages,
    isLoading: conversation.isLoading,
    isError: conversation.isError,
    isRefetching: conversation.isRefetching,
    refetch: conversation.refetch,
  };
};
