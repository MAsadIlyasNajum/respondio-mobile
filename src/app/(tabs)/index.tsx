import { useRouter } from 'expo-router';
import { useContacts } from '@/features/chats/hooks/useContacts';
import ContactList from '@/features/chats/components/ContactList';
import type { User } from '@/types/User';

export default function ChatsScreen() {
  const router = useRouter();
  const {
    users,
    isLoading,
    isError,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useContacts();

  const handleContactPress = (user: User) => {
    router.push(`/chat/${user.id}`);
  };

  return (
    <ContactList
      data={users}
      isLoading={isLoading}
      isError={isError}
      isRefetching={isRefetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onRefresh={refetch}
      onFetchNextPage={fetchNextPage}
      onContactPress={handleContactPress}
    />
  );
}
