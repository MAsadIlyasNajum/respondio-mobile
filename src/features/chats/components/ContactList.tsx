import { useMemo } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, useColors } from '@/theme';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import AppText from '@/components/AppText';
import ContactItem from './ContactItem';
import type { User } from '@/types/User';

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
}: ContactListProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
        list: {
          flex: 1,
        },
        content: {
          flexGrow: 1,
        },
        separator: {
          height: 1,
          backgroundColor: colors.border,
          marginLeft: spacing[4],
          marginRight: spacing[4],
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

  if (isLoading) {
    return (
      <View style={[styles.wrapper, { paddingTop: insets.top }]}>
        <LoadingState />
      </View>
    );
  }

  if (isError && !isRefetching && data.length === 0) {
    return (
      <View style={[styles.wrapper, { paddingTop: insets.top }]}>
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
        renderItem={({ item }: { item: User }) => (
          <ContactItem
            user={item}
            onPress={() => onContactPress?.(item)}
          />
        )}
        ItemSeparatorComponent={ItemSeparator}
        onRefresh={onRefresh}
        refreshing={isRefetching}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            onFetchNextPage();
          }
        }}
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
      />
    </View>
  );
}

const ItemSeparator = () => {
  const colors = useColors();
  return (
    <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: spacing[4] }} />
  );
};
