import { memo, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { spacing, useColors } from '@/theme';
import Avatar from '@/components/Avatar';
import AppText from '@/components/AppText';
import { formatConversationTime } from '@/utils/format';
import type { User } from '@/types/User';
import type { Post } from '@/types/Post';

interface ContactItemProps {
  user: User;
  onPress: () => void;
  lastMessage?: Post | null;
  messageTimestamp?: string;
  messageStatus: 'loading' | 'error' | 'success';
}

function ContactItem({ user, onPress, lastMessage, messageTimestamp, messageStatus }: ContactItemProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[4],
          gap: spacing[3],
          backgroundColor: colors.background,
        },
        pressed: {
          opacity: 0.7,
          backgroundColor: colors.surface,
        },
        info: {
          flex: 1,
          gap: spacing[1],
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        },
        name: {
          color: colors.text,
        },
        timestamp: {
          color: colors.secondaryText,
        },
        placeholder: {
          color: colors.secondaryText,
        },
      }),
    [colors]
  );

  const messageText =
    messageStatus === 'loading'
      ? '...'
      : messageStatus === 'error'
        ? 'Unable to load message'
        : lastMessage?.body ?? 'No messages yet';

  const timestampText =
    messageStatus === 'loading'
      ? '...'
      : messageStatus === 'error'
        ? '—'
        : messageTimestamp
          ? messageTimestamp
          : lastMessage?.createdAt
            ? formatConversationTime(lastMessage.createdAt)
            : '—';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${user.name}`}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <Avatar uri={user.avatar} name={user.name} size="md" accessibilityLabel={user.name} />
      <View style={styles.info}>
        <View style={styles.row}>
          <AppText variant="body" style={styles.name} numberOfLines={1}>
            {user.name}
          </AppText>
          <AppText variant="metadata" style={styles.timestamp}>
            {timestampText}
          </AppText>
        </View>
        <AppText variant="caption" style={styles.placeholder} numberOfLines={1}>
          {messageText}
        </AppText>
      </View>
    </Pressable>
  );
}

export default memo(ContactItem);
