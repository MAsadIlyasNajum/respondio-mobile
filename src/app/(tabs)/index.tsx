import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useContacts } from '@/features/chats/hooks/useContacts';
import { useContactLastMessages } from '@/features/chats/hooks/useContactLastMessages';
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

  const contactIds = useMemo(() => users.map((user) => user.id), [users]);
  const lastMessagesResults = useContactLastMessages(contactIds);

  const lastMessages = useMemo(() => {
    const map = new Map<number, ReturnType<typeof useContactLastMessages>[number]>();
    lastMessagesResults.forEach((result) => {
      map.set(result.contactId, result);
    });
    return map;
  }, [lastMessagesResults]);

  const handleContactPress = useCallback(
    (user: User) => {
      router.push(`/chat/${user.id}`);
    },
    [router]
  );

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
      lastMessages={lastMessages}
    />
  );
}
