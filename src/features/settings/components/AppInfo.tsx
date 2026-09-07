import Constants from 'expo-constants';
import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { radius, spacing, useColors } from '@/theme';
import AppText from '@/components/AppText';

const version = Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0';
const appName = Constants.expoConfig?.name ?? 'Respondio Mobile';

export default function AppInfo() {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing[4],
          gap: spacing[2],
        },
        title: {
          color: colors.text,
        },
        userName: {
          color: colors.primary,
          fontWeight: '600',
        },
        version: {
          color: colors.secondaryText,
        },
        description: {
          color: colors.secondaryText,
        },
      }),
    [colors]
  );

  return (
    <View style={styles.card}>
      <AppText variant="heading" accessibilityRole="header" style={styles.title}>
        {appName}
      </AppText>
      <AppText variant="body" style={styles.userName}>
        Muhammad Asad Ilyas
      </AppText>
      <AppText variant="body" style={styles.version}>
        Version {version}
      </AppText>
      <AppText variant="caption" style={styles.description}>
        Demo chat app powered by a public mock API.
      </AppText>
    </View>
  );
}
