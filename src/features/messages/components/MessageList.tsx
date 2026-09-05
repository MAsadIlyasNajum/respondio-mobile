import { useRef } from 'react';
import { FlatList, View, StyleSheet, type ListRenderItemInfo, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
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

const SCROLL_NEAR_BOTTOM_THRESHOLD = 150;

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
  const flatListRef = useRef<FlatList<Message>>(null);
  const hasInitiallyScrolled = useRef(false);
  const isNearBottom = useRef(true);
  const contentHeightRef = useRef(0);
  const layoutHeightRef = useRef(0);

  const handleContentSizeChange = (_width: number, height: number) => {
    contentHeightRef.current = height;
    if (!hasInitiallyScrolled.current && messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: false });
      hasInitiallyScrolled.current = true;
    } else if (hasInitiallyScrolled.current && isNearBottom.current) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleLayout = (_event: { nativeEvent: { layout: { height: number } } }) => {
    layoutHeightRef.current = _event.nativeEvent.layout.height;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const maxOffset = contentSize.height - layoutMeasurement.height;
    isNearBottom.current = maxOffset <= 0 || contentOffset.y >= maxOffset - SCROLL_NEAR_BOTTOM_THRESHOLD;
  };

  if (isLoading && !isFetching && messages.length === 0) {
    return <LoadingState />;
  }

  if (isError && !isFetching && messages.length === 0) {
    return (
      <ErrorState
        message="Unable to load messages."
        onRetry={onRefresh}
        retryAccessibilityLabel="Retry loading messages"
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
      ref={flatListRef}
      style={styles.list}
      contentContainerStyle={styles.content}
      data={messages}
      inverted
      keyExtractor={(item) => item.clientMessageId ?? String(item.id)}
      renderItem={renderItem}
      onRefresh={onRefresh}
      refreshing={isFetching}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onContentSizeChange={handleContentSizeChange}
      onLayout={handleLayout}
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
  },
  spacer: {
    flex: 1,
  },
});
