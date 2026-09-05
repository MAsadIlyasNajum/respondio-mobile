import { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { spacing, useColors } from '@/theme';
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
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        backButton: {
          marginRight: spacing[2],
          padding: spacing[1],
        },
        iconPressed: {
          opacity: 0.6,
        },
        headerTitle: {
          color: colors.text,
        },
        scrollContent: {
          padding: spacing[4],
          gap: spacing[5],
          paddingBottom: Math.max(insets.bottom, spacing[4]),
        },
      }),
    [colors, insets.bottom]
  );

  const params = useLocalSearchParams<{ userId: string }>();
  const userId = params.userId;
  const router = useRouter();
  const { user, isLoading, isError, refetch } = useProfile(userId);

  if (!userId || Number.isNaN(Number(userId))) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <EmptyState title="Invalid profile link." subtitle="This profile URL is not valid." />
      </SafeAreaView>
    );
  }

  if (isLoading && !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (isError && !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ErrorState
          message="Unable to load profile."
          onRetry={refetch}
          retryAccessibilityLabel="Retry loading profile"
        />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <EmptyState title="User not found." subtitle="This user may have been deleted." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
          style={({ pressed }) => [
            styles.backButton,
            Platform.OS !== 'android' && pressed && styles.iconPressed,
          ]}
        >
          <SymbolView name="chevron.left" size={24} tintColor={colors.text} />
        </Pressable>
        <AppText variant="heading" style={styles.headerTitle}>
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
    </SafeAreaView>
  );
}
