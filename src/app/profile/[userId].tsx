import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';
import { SymbolView } from 'expo-symbols';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import ProfileDetails from '@/features/profile/components/ProfileDetails';
import BlockButton from '@/features/profile/components/BlockButton';

export default function ProfileScreen() {
  const params = useLocalSearchParams<{ userId: string }>();
  const userId = params.userId;
  const router = useRouter();
  const { user, isLoading, isError, refetch } = useProfile(userId);

  if (!userId || Number.isNaN(Number(userId))) {
    return (
      <View style={styles.container}>
        <EmptyState title="Profile not available." />
      </View>
    );
  }

  if (isLoading && !user) {
    return (
      <View style={styles.container}>
        <LoadingState />
      </View>
    );
  }

  if (isError && !user) {
    return (
      <View style={styles.container}>
        <ErrorState message="Unable to load profile." onRetry={refetch} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <EmptyState title="Profile not available." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <SymbolView name="chevron.left" size={24} tintColor={colors.text} />
        </TouchableOpacity>
        <AppText variant="screenTitle" style={styles.headerTitle}>
          Profile
        </AppText>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader user={user} />
        <ProfileDetails user={user} />
        <BlockButton userId={String(user.id)} userName={user.name} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing[2],
  },
  headerTitle: {
    color: colors.text,
  },
  scrollContent: {
    padding: spacing[4],
    gap: spacing[5],
  },
});
