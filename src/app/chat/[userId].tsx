import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useBlockStore } from '@/store/blockStore';
import { fetchUser } from '@/api/users';
import { CURRENT_USER_ID } from '@/utils/constants';
import { colors, spacing } from '@/theme';
import Avatar from '@/components/Avatar';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import { SymbolView } from 'expo-symbols';
import MessageList from '@/features/messages/components/MessageList';
import MessageInput from '@/features/messages/components/MessageInput';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { useCreateMessage } from '@/features/messages/hooks/useCreateMessage';

export default function ChatScreen() {
  const params = useLocalSearchParams<{ userId: string }>();
  const userId = params.userId;
  const router = useRouter();
  const { isBlocked, blockUser, unblockUser } = useBlockStore();

  const contactId = Number(userId);
  const blocked = userId ? isBlocked(String(userId)) : false;

  const { data: contact, isLoading: contactLoading } = useQuery({
    queryKey: ['chatContact', userId],
    queryFn: () => fetchUser(contactId),
    enabled: Boolean(contactId),
  });

  const { messages, isLoading, isError, refetch } = useMessages(userId);
  const { mutate, isPending } = useCreateMessage(userId);

  const handleSend = (text: string) => {
    const clientMessageId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    mutate({ text, clientMessageId });
  };

  const handleRetry = (clientMessageId: string, text: string) => {
    mutate({ text, clientMessageId });
  };

  const handleToggleBlock = () => {
    if (!userId) return;
    if (blocked) {
      unblockUser(String(userId));
    } else {
      blockUser(String(userId));
    }
  };

  const handleAvatarPress = () => {
    if (!userId) return;
    router.push(`/profile/${userId}`);
  };

  const contactName = contact?.name ?? (userId ? `User ${userId}` : 'Chat');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleAvatarPress}
            accessibilityRole="button"
            accessibilityLabel={`Open profile for ${contactName}`}
            style={styles.headerAvatar}
          >
            <Avatar
              uri={contact?.avatar}
              name={contactName}
              size="md"
              accessibilityLabel={contactName}
            />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <AppText variant="body" style={styles.headerName}>
              {contactName}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={handleToggleBlock}
            accessibilityRole="button"
            accessibilityLabel={blocked ? `Unblock ${contactName}` : `Block ${contactName}`}
            style={styles.headerButton}
          >
            <SymbolView
              name={blocked ? 'person.crop.circle.badge.checkmark' : 'person.crop.circle.badge.xmark'}
              size={24}
              tintColor={blocked ? colors.success : colors.error}
            />
          </TouchableOpacity>
        </View>

        {blocked && (
          <View
            style={styles.banner}
            accessible
            accessibilityRole="alert"
            accessibilityLabel={`You blocked ${contactName}. Tap to unblock.`}
          >
            <AppText variant="body" style={styles.bannerText}>
              You blocked {contactName}.
            </AppText>
            <AppButton
              title="Unblock"
              onPress={() => userId && unblockUser(String(userId))}
              variant="outline"
            />
          </View>
        )}

        <MessageList
          messages={messages}
          currentUserId={CURRENT_USER_ID}
          isLoading={isLoading}
          isError={isError}
          contactName={contact?.name}
          onRefresh={refetch}
          onRetryMessage={handleRetry}
        />

        {!blocked && (
          <MessageInput
            disabled={contactLoading}
            isPending={isPending}
            onSend={handleSend}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerAvatar: {
    padding: spacing[1],
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerName: {
    color: colors.text,
  },
  headerButton: {
    padding: spacing[1],
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: spacing[2],
  },
  bannerText: {
    color: colors.secondaryText,
    flex: 1,
  },
});
