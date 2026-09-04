import { View, StyleSheet, Pressable, type GestureResponderEvent } from 'react-native';
import { colors, spacing } from '@/theme';
import Avatar from '@/components/Avatar';
import AppText from '@/components/AppText';

interface ContactItemProps {
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  onPress: (event: GestureResponderEvent) => void;
}

export default function ContactItem({ user, onPress }: ContactItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <Avatar uri={user.avatar} name={user.name} size="md" />
      <View style={styles.info}>
        <AppText variant="body" style={styles.name}>
          {user.name}
        </AppText>
        <AppText variant="caption" style={styles.placeholder}>
          Tap to start chatting
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  name: {
    color: colors.text,
  },
  placeholder: {
    color: colors.secondaryText,
  },
});
