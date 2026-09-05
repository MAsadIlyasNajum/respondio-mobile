import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';

export default function AboutText() {
  return (
    <View style={styles.container}>
      <AppText variant="body" style={styles.text}>
        This is a demo app for evaluating chat and messaging UX. Data is sourced from a public mock API; nothing here is private or persistent.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
  text: {
    textAlign: 'center',
    color: colors.secondaryText,
  },
});
