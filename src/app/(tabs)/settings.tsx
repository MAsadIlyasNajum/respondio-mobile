import { View, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';
import AppInfo from '@/features/settings/components/AppInfo';
import BlockedUsersList from '@/features/settings/components/BlockedUsersList';
import AboutText from '@/features/settings/components/AboutText';

export default function SettingsScreen() {
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

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    gap: spacing[5],
  },
  section: {
    gap: spacing[3],
  },
  sectionTitle: {
    color: colors.text,
  },
});
