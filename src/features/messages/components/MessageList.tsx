import { FlatList, View, StyleSheet, type ListRenderItemInfo } from 'react-native';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import MessageBubble from './MessageBubble';
import type { Message } from '@/features/messages/types';

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  isLoading: boolean;
  isError: boolean;
  isFetching?: boolean;
  contactName?: string;
  onRefresh: () => void;
  onRetryMessage?: (clientMessageId: string, text: string) => void;
}

export default function MessageList({
  messages,
  currentUserId,
  isLoading,
  isError,
  isFetching = false,
  contactName,
  onRefresh,
  onRetryMessage,
}: MessageListProps) {
  if (isLoading && !isFetching && messages.length === 0) {
    return <LoadingState />;
  }

  if (isError && !isFetching && messages.length === 0) {
    return (
      <ErrorState
        message="Unable to load messages."
        onRetry={onRefresh}
      />
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        title="No messages yet. Start the conversation."
        subtitle="Your message history will appear here."
      />
    );
  }

  const renderItem = ({ item }: ListRenderItemInfo<Message>) => {
    const isOwn = item.userId === currentUserId;
    return (
      <View>
        <MessageBubble
          message={item}
          isOwn={isOwn}
          contactName={contactName}
          onRetry={
            item._failed && item.clientMessageId && item.body
              ? () => onRetryMessage?.(item.clientMessageId!, item.body)
              : undefined
          }
        />
      </View>
    );
  };

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={messages}
      inverted
      keyExtractor={(item) => item.clientMessageId ?? String(item.id)}
      renderItem={renderItem}
      onRefresh={onRefresh}
      refreshing={isFetching}
      ListFooterComponent={isFetching ? <LoadingState size="small" /> : null}
      ListEmptyComponent={<View style={styles.spacer} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  spacer: {
    flex: 1,
  },
});
