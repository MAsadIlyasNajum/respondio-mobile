import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="screenTitle" style={styles.title}>
        Settings
      </AppText>
      <AppText variant="body" style={styles.placeholder}>
        Settings placeholder
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
