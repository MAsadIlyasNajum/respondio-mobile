import { memo, useMemo } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { radius, spacing, useColors } from '@/theme';
import AppText from '@/components/AppText';
import { formatMessageTime } from '@/utils/format';
import type { Message } from '@/features/messages/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  contactName?: string;
  isGrouped?: boolean;
  isLastInGroup?: boolean;
  onRetry?: () => void;
}

const MessageBubble = ({
  message,
  isOwn,
  contactName,
  isGrouped = false,
  isLastInGroup = true,
  onRetry,
}: MessageBubbleProps) => {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          paddingHorizontal: spacing[4],
          paddingVertical: isGrouped ? 0 : spacing[2],
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
          borderRadius: radius.lg,
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
          marginBottom: isLastInGroup ? spacing[1] : 0,
        },
        textOutgoing: {
          color: colors.messageOutgoingText,
        },
        textIncoming: {
          color: colors.messageIncomingText,
        },
        rowFooter: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[1],
          alignSelf: 'flex-end',
        },
        time: {
          opacity: 0.7,
          color: colors.secondaryText,
        },
        timeOutgoing: {
          color: colors.messageOutgoingText,
          opacity: 0.8,
        },
        retry: {
          paddingLeft: spacing[1],
        },
        retryPressed: {
          opacity: 0.5,
        },
      }),
    [colors, isGrouped, isLastInGroup]
  );

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
        {isLastInGroup && (
          <View style={styles.rowFooter}>
            <AppText
              variant="timestamp"
              style={[styles.time, isOwn && styles.timeOutgoing]}
            >
              {timestamp}
            </AppText>
            {failed && onRetry && (
              <Pressable
                onPress={onRetry}
                accessibilityRole="button"
                accessibilityLabel="Retry sending message"
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={({ pressed }) => [
                  styles.retry,
                  Platform.OS !== 'android' && pressed && styles.retryPressed,
                ]}
              >
                <SymbolView name={{ ios: 'arrow.clockwise', android: 'refresh' }} size={18} tintColor={colors.error} />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(MessageBubble);
