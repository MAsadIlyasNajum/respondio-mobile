import {
  FlatList,
  View,
  StyleSheet,
} from 'react-native';
import { colors, spacing } from '@/theme';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
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
}: ContactListProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (isError && !isRefetching) {
    return (
      <ErrorState
        message="Unable to load contacts."
        onRetry={onRefresh}
      />
    );
  }

  return (
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
      ListEmptyComponent={
        ListEmptyComponent || (
          <EmptyState
            title="No contacts available."
            subtitle="Pull to refresh or try again later."
          />
        )
      }
    />
  );
}

const ItemSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: spacing[4],
    marginRight: spacing[4],
  },
});
