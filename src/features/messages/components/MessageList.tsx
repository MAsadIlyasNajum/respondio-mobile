import { useRef, useMemo, useCallback } from 'react';
import { FlatList, View, StyleSheet, type ListRenderItemInfo, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import DateSeparator from '@/components/DateSeparator';
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
const GROUPING_WINDOW_MS = 5 * 60 * 1000;

type ListItem = Message | { type: 'separator'; date: string };

function isSeparator(item: ListItem | null | undefined): item is { type: 'separator'; date: string } {
  return !!item && (item as { type?: string }).type === 'separator';
}

function getDateKey(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function buildMessageList(messages: Message[]): ListItem[] {
  if (messages.length === 0) return [];

  const items: ListItem[] = [];
  let lastDateKey: string | null = null;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const dateKey = getDateKey(msg.createdAt);

    if (dateKey !== lastDateKey) {
      items.push({ type: 'separator', date: msg.createdAt });
      lastDateKey = dateKey;
    }

    items.push(msg);
  }

  return items;
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
  const flatListRef = useRef<FlatList<ListItem>>(null);
  const hasInitiallyScrolled = useRef(false);
  const isNearBottom = useRef(true);
  const contentHeightRef = useRef(0);
  const layoutHeightRef = useRef(0);
  const prevMessagesLengthRef = useRef(0);

  const listItems = useMemo(() => buildMessageList(messages), [messages]);

  const handleContentSizeChange = (_width: number, height: number) => {
    contentHeightRef.current = height;
    const hasNewMessages = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    if (!hasInitiallyScrolled.current && messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: false });
      hasInitiallyScrolled.current = true;
    } else if (hasInitiallyScrolled.current && isNearBottom.current && hasNewMessages) {
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

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ListItem>) => {
      if (isSeparator(item)) {
        return <DateSeparator date={item.date} />;
      }

      const isOwn = item.userId === currentUserId;
      const prevItem = index > 0 ? listItems[index - 1] : null;
      const nextItem = index < listItems.length - 1 ? listItems[index + 1] : null;

      const isGroupedWithPrev =
        prevItem && !isSeparator(prevItem) &&
        prevItem.userId === item.userId &&
        Math.abs(new Date(item.createdAt).getTime() - new Date(prevItem.createdAt).getTime()) < GROUPING_WINDOW_MS;

      const isGroupedWithNext =
        nextItem && !isSeparator(nextItem) &&
        nextItem.userId === item.userId &&
        Math.abs(new Date(nextItem.createdAt).getTime() - new Date(item.createdAt).getTime()) < GROUPING_WINDOW_MS;

      return (
        <MessageBubble
          message={item}
          isOwn={isOwn}
          contactName={contactName}
          isGrouped={isGroupedWithPrev ?? false}
          isLastInGroup={!(isGroupedWithNext ?? false)}
          onRetry={
            item._failed && item.clientMessageId && item.body
              ? () => onRetryMessage?.(item.clientMessageId!, item.body)
              : undefined
          }
        />
      );
    },
    [currentUserId, contactName, onRetryMessage, listItems]
  );

  const keyExtractor = useCallback(
    (item: ListItem, index: number) =>
      isSeparator(item) ? `sep-${getDateKey(item.date)}-${index}` : item.clientMessageId ?? String(item.id),
    []
  );

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

  return (
    <FlatList
      ref={flatListRef}
      style={styles.list}
      contentContainerStyle={styles.content}
      data={listItems}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onRefresh={onRefresh}
      refreshing={isFetching}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onContentSizeChange={handleContentSizeChange}
      onLayout={handleLayout}
      ListFooterComponent={isFetching ? <LoadingState size="small" /> : null}
      ListEmptyComponent={<View style={styles.spacer} />}
      windowSize={5}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews
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
