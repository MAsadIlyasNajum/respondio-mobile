import { useCallback, useMemo } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, useColors } from '@/theme';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import AppText from '@/components/AppText';
import SkeletonRow from '@/components/SkeletonRow';
import ContactItem from './ContactItem';
import type { User } from '@/types/User';
import type { ContactLastMessageResult } from '@/features/chats/hooks/useContactLastMessages';

interface ContactListProps {
  data: User[];
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
  onFetchNextPage: () => void;
  onContactPress?: (user: User) => void;
  onEndReachedThreshold?: number;
  ListEmptyComponent?: React.ReactElement | null;
  ListHeaderComponent?: React.ReactElement | null;
  lastMessages?: Map<number, ContactLastMessageResult>;
}

export default function ContactList({
  data,
  isLoading,
  isError,
  isRefetching,
  isFetchingNextPage,
  hasNextPage,
  onRefresh,
  onFetchNextPage,
  onContactPress,
  onEndReachedThreshold = 0.5,
  ListEmptyComponent,
  ListHeaderComponent,
  lastMessages,
}: ContactListProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: Platform.OS === 'android' ? Math.max(insets.top, spacing[6]) : insets.top,
        },
        list: {
          flex: 1,
        },
        content: {
          flexGrow: 1,
        },
        separator: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginHorizontal: spacing[4],
        },
        errorBanner: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.error,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2],
        },
        errorBannerText: {
          color: colors.onError,
          flex: 1,
        },
        errorBannerRetryText: {
          color: colors.onError,
          fontWeight: '600',
        },
        errorBannerRetry: {
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
          minHeight: 44,
          justifyContent: 'center',
          alignItems: 'center',
        },
        headerTitle: {
          color: colors.text,
          paddingHorizontal: spacing[4],
          paddingBottom: spacing[2],
        },
      }),
    [colors, insets.top]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      onFetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: User }) => {
      const messageData = lastMessages?.get(item.id);
      const messageStatus = messageData
        ? messageData.isLoading
          ? 'loading'
          : messageData.isError
            ? 'error'
            : 'success'
        : 'success';

      return (
        <ContactItem
          user={item}
          onPress={() => onContactPress?.(item)}
          lastMessage={messageData?.message ?? null}
          messageTimestamp={messageData?.timestamp ?? '—'}
          messageStatus={messageStatus}
        />
      );
    },
    [onContactPress, lastMessages]
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [styles.separator]
  );

  if (isLoading) {
    return (
      <View style={[styles.wrapper, { paddingTop: Platform.OS === 'android' ? Math.max(insets.top, spacing[6]) : insets.top }]}>
        <AppText variant="screenTitle" style={styles.headerTitle}>
          Chats
        </AppText>
        <View testID="skeleton-list">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </View>
      </View>
    );
  }

  if (isError && !isRefetching && data.length === 0) {
    return (
      <View style={[styles.wrapper, { paddingTop: Platform.OS === 'android' ? Math.max(insets.top, spacing[6]) : insets.top }]}>
        <ErrorState
          message="Unable to load contacts."
          onRetry={onRefresh}
          retryAccessibilityLabel="Retry loading contacts"
        />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <AppText variant="screenTitle" style={styles.headerTitle}>
        Chats
      </AppText>
      {isError && !isRefetching && data.length > 0 && (
        <View style={styles.errorBanner}>
          <AppText variant="caption" style={styles.errorBannerText}>
            Unable to refresh contacts.
          </AppText>
          <Pressable
            onPress={onRefresh}
            accessibilityRole="button"
            accessibilityLabel="Retry loading contacts"
            android_ripple={{ color: 'rgba(255,255,255,0.18)' }}
            style={({ pressed }) => [
              styles.errorBannerRetry,
              pressed && { opacity: 0.85 },
            ]}
          >
            <AppText variant="caption" style={styles.errorBannerRetryText}>
              Retry
            </AppText>
          </Pressable>
        </View>
      )}
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        onRefresh={onRefresh}
        refreshing={isRefetching}
        onEndReached={handleEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={
          isFetchingNextPage ? <LoadingState size="small" /> : null
        }
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          ListEmptyComponent ?? (
            <EmptyState
              title="No contacts available."
              subtitle="Pull to refresh or try again later."
            />
          )
        }
        windowSize={5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
}
