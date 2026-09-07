import type { Post } from '@/types/Post';

export type Message = Post;

export interface UseMessagesResult {
  messages: Message[];
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  refetch: () => void;
}

export interface UseCreateMessageResult {
  sendMessage: (text: string) => void;
  isPending: boolean;
  isError: boolean;
}
