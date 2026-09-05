import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useBlockStore } from '@/store/blockStore';
import { fetchUser } from '@/api/users';
import { CURRENT_USER_ID } from '@/utils/constants';
import { spacing, useColors } from '@/theme';
import Avatar from '@/components/Avatar';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import { SymbolView } from 'expo-symbols';
import MessageList from '@/features/messages/components/MessageList';
import MessageInput from '@/features/messages/components/MessageInput';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { useCreateMessage } from '@/features/messages/hooks/useCreateMessage';

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setAndroidKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setAndroidKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const styles = makeStyles(colors);

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
      blockUser(String(userId), contactName);
    }
  };

  const handleAvatarPress = () => {
    if (!userId) return;
    router.push(`/profile/${userId}`);
  };

  const contactName = contact?.name ?? (userId ? `User ${userId}` : 'Chat');

  const androidKeyboardPadding = androidKeyboardHeight > 0
    ? androidKeyboardHeight - insets.bottom
    : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Back"
              accessibilityHint="Go back to chats"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
              style={({ pressed }) => [
                styles.backButton,
                Platform.OS !== 'android' && pressed && styles.iconPressed,
              ]}
            >
              <SymbolView name="chevron.left" size={24} tintColor={colors.text} />
            </Pressable>
            <Pressable
              onPress={handleAvatarPress}
              accessibilityRole="button"
              accessibilityLabel={`Open profile for ${contactName}`}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              style={({ pressed }) => [
                styles.headerAvatar,
                Platform.OS !== 'android' && pressed && styles.iconPressed,
              ]}
            >
              <Avatar
                uri={contact?.avatar}
                name={contactName}
                size="md"
                accessibilityLabel={contactName}
              />
            </Pressable>
          </View>
          <View style={styles.headerCenter}>
            <AppText variant="body" style={styles.headerName}>
              {contactName}
            </AppText>
          </View>
          <Pressable
            onPress={handleToggleBlock}
            accessibilityRole="button"
            accessibilityLabel={blocked ? `Unblock ${contactName}` : `Block ${contactName}`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
            style={({ pressed }) => [
              styles.headerButton,
              Platform.OS !== 'android' && pressed && styles.iconPressed,
            ]}
          >
            <SymbolView
              name={blocked ? 'person.crop.circle.badge.checkmark' : 'person.crop.circle.badge.xmark'}
              size={24}
              tintColor={blocked ? colors.success : colors.error}
            />
          </Pressable>
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
          <View style={Platform.OS === 'android' ? { paddingBottom: androidKeyboardPadding } : undefined}>
            <MessageInput
              disabled={contactLoading}
              isPending={isPending}
              onSend={handleSend}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
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
      paddingVertical: spacing[3],
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
    backButton: {
      padding: spacing[1],
      marginRight: spacing[1],
    },
    iconPressed: {
      opacity: 0.6,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
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
