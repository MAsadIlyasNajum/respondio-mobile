import { useMemo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: Platform.OS === 'android' ? Math.max(insets.top, spacing[6]) : insets.top,
          paddingHorizontal: spacing[4],
        },
        sectionTitle: {
          color: colors.text,
          marginTop: spacing[5],
          marginBottom: spacing[3],
        },
        footer: {
          marginTop: spacing[5],
        },
      }),
    [colors, insets.top]
  );

  return (
    <View style={styles.container}>
      <BlockedUsersList
        ListHeaderComponent={
          <View>
            <AppInfo />
            <AppText variant="heading" style={styles.sectionTitle}>
              Blocked users
            </AppText>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <AboutText />
          </View>
        }
      />
    </View>
  );
}
