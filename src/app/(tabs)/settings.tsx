import { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, useColors } from '@/theme';
import AppText from '@/components/AppText';
import AppInfo from '@/features/settings/components/AppInfo';
import BlockedUsersList from '@/features/settings/components/BlockedUsersList';
import AboutText from '@/features/settings/components/AboutText';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingTop: insets.top,
          paddingHorizontal: spacing[4],
          paddingBottom: spacing[4],
          gap: spacing[5],
          backgroundColor: colors.background,
          flexGrow: 1,
        },
        section: {
          gap: spacing[3],
        },
        sectionTitle: {
          color: colors.text,
        },
      }),
    [colors, insets.top]
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <AppInfo />
      <View style={styles.section}>
        <AppText variant="heading" style={styles.sectionTitle}>
          Blocked users
        </AppText>
        <BlockedUsersList />
      </View>
      <View style={styles.section}>
        <AboutText />
      </View>
    </ScrollView>
  );
}
