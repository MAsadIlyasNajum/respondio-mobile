import { View, StyleSheet, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';
import { formatMessageTime } from '@/utils/format';
import type { Message } from '@/features/messages/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  contactName?: string;
  onRetry?: () => void;
}

export default function MessageBubble({
  message,
  isOwn,
  contactName,
  onRetry,
}: MessageBubbleProps) {
  const failed = !!message._failed;
  const timestamp = formatMessageTime(message.createdAt);

  return (
    <View
      style={[
        styles.row,
        isOwn ? styles.rowOutgoing : styles.rowIncoming,
      ]}
    >
      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={
          isOwn
            ? `Your message, ${message.body}`
            : `Message from ${contactName ?? 'contact'}, ${message.body}`
        }
        style={[
          styles.bubble,
          isOwn ? styles.bubbleOutgoing : styles.bubbleIncoming,
          failed && styles.bubbleFailed,
        ]}
      >
        <AppText
          variant="body"
          style={[
            styles.text,
            isOwn ? styles.textOutgoing : styles.textIncoming,
          ]}
        >
          {message.body}
        </AppText>
        <View style={styles.rowFooter}>
          <AppText variant="caption" style={styles.time}>
            {timestamp}
          </AppText>
          {failed && onRetry && (
            <Pressable
              onPress={onRetry}
              accessibilityRole="button"
              accessibilityLabel="Retry sending message"
              hitSlop={8}
              style={styles.retry}
            >
              <SymbolView name="arrow.clockwise" size={18} tintColor={colors.error} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
    flexDirection: 'row',
  },
  rowOutgoing: {
    justifyContent: 'flex-end',
  },
  rowIncoming: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  bubbleOutgoing: {
    backgroundColor: colors.messageOutgoing,
    alignSelf: 'flex-end',
  },
  bubbleIncoming: {
    backgroundColor: colors.messageIncoming,
    alignSelf: 'flex-start',
  },
  bubbleFailed: {
    opacity: 0.7,
  },
  text: {
    marginBottom: spacing[1],
  },
  textOutgoing: {
    color: '#FFFFFF',
  },
  textIncoming: {
    color: colors.text,
  },
  rowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    alignSelf: 'flex-end',
  },
  time: {
    opacity: 0.7,
  },
  timeOutgoing: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  retry: {
    paddingLeft: spacing[1],
  },
});
