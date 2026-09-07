import { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { radius, spacing, useColors } from '@/theme';
import AppText from '@/components/AppText';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  retryAccessibilityLabel?: string;
}

export default function ErrorState({
  message = 'Something went wrong.',
  onRetry,
  retryLabel = 'Retry',
  retryAccessibilityLabel,
}: ErrorStateProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing[5],
          gap: spacing[3],
        },
        message: {
          textAlign: 'center',
          color: colors.secondaryText,
        },
        retry: {
          marginTop: spacing[3],
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[5],
          borderRadius: radius.sm,
          backgroundColor: colors.primary,
        },
        retryText: {
          color: colors.onPrimary,
        },
      }),
    [colors]
  );

  return (
    <View style={styles.container}>
      <AppText variant="body" style={styles.message}>
        {message}
      </AppText>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryAccessibilityLabel ?? retryLabel}
          android_ripple={{ color: 'rgba(255,255,255,0.18)' }}
          style={styles.retry}
        >
          <AppText variant="button" style={styles.retryText}>
            {retryLabel}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}
