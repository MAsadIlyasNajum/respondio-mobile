import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, useColors } from '@/theme';
import AppText from '@/components/AppText';

export default function AboutText() {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: spacing[3],
        },
        text: {
          textAlign: 'center',
          color: colors.secondaryText,
        },
      }),
    [colors]
  );

  return (
    <View style={styles.container}>
      <AppText variant="body" style={styles.text}>
        This is a demo app for evaluating chat and messaging UX. Data is sourced from a public mock API; nothing here is private or persistent.
      </AppText>
    </View>
  );
}
