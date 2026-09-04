import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';

interface Props {
  params: { userId: string };
}

export default function ProfileScreen({ params }: Props) {
  return (
    <View style={styles.container}>
      <AppText variant="screenTitle" style={styles.title}>
        Profile
      </AppText>
      <AppText variant="body" style={styles.placeholder}>
        Profile for user {params.userId}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing[4],
  },
  title: {
    marginBottom: spacing[3],
  },
  placeholder: {
    color: colors.secondaryText,
  },
});
