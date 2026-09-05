import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import Avatar from '@/components/Avatar';
import AppText from '@/components/AppText';
import type { User } from '@/types/User';

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <Avatar
        uri={user.avatar}
        name={user.name}
        size="lg"
        accessibilityLabel={user.name}
      />
      <AppText variant="heading" style={styles.name}>
        {user.name}
      </AppText>
      <AppText variant="body" style={styles.username}>
        @{user.username}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing[2],
  },
  name: {
    color: colors.text,
  },
  username: {
    color: colors.secondaryText,
  },
});
