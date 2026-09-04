import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';
import ContactList from '@/features/chats/components/ContactList';
import { useContacts } from '@/features/chats/hooks/useContacts';

export default function ChatsScreen() {
  const router = useRouter();
  const { users, isLoading, isError, isRefetching, isFetchingNextPage, hasNextPage, refetch, fetchNextPage } =
    useContacts();

  return (
    <View style={styles.container}>
      <AppText variant="screenTitle" style={styles.title}>
        Chats
      </AppText>
      <ContactList
        data={users}
        isLoading={isLoading}
        isError={isError}
        isRefetching={isRefetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onRefresh={refetch}
        onFetchNextPage={fetchNextPage}
        onContactPress={(user) => router.push(`/chat/${user.id}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
});
