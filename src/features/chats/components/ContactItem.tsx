import { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { spacing, useColors } from '@/theme';
import Avatar from '@/components/Avatar';
import AppText from '@/components/AppText';

interface ContactItemProps {
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  onPress: (event: any) => void;
}

export default function ContactItem({ user, onPress }: ContactItemProps) {
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
        name: {
          color: colors.text,
        },
        placeholder: {
          color: colors.secondaryText,
        },
      }),
    [colors]
  );

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
