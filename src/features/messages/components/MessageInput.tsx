import { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';
import { colors, spacing, radius } from '@/theme';

interface MessageInputProps {
  disabled?: boolean;
  isPending?: boolean;
  onSend: (text: string) => void;
}

export default function MessageInput({
  disabled,
  isPending,
  onSend,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isPending || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handlePressIn = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.9);
  };
  const handlePressOut = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(1);
  };

  const isEmpty = !text.trim();
  const sendDisabled = isEmpty || isPending || !!disabled;

  return (
    <View style={styles.container}>
      <View style={[styles.row, disabled && styles.disabled]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={colors.secondaryText}
          style={styles.input}
          multiline
          maxLength={2000}
          editable={!disabled && !isPending}
          textContentType="none"
          onSubmitEditing={handleSend}
          accessibilityLabel="Message text input"
        />
        <Pressable
          onPress={handleSend}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={sendDisabled}
          accessibilityRole="button"
          accessibilityLabel={isPending ? 'Sending message' : 'Send message'}
          accessibilityHint="Sends your message"
          style={[styles.sendButton, sendDisabled && styles.sendDisabled]}
        >
          <Animated.View style={[styles.sendIcon, animatedStyle]}>
            <SymbolView
              name={isPending ? 'hourglass' : 'arrow.up.right'}
              size={20}
              tintColor={colors.primary}
            />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[2],
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    color: colors.text,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  sendDisabled: {
    backgroundColor: colors.surface,
  },
  sendIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
