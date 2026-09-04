import { View, StyleSheet, Pressable } from 'react-native';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({
  message = 'Something went wrong.',
  onRetry,
  retryLabel = 'Retry',
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="body" style={styles.message}>
        {message}
      </AppText>
      {onRetry && (
        <Pressable onPress={onRetry} style={styles.retry}>
          <AppText variant="button" style={styles.retryText}>
            {retryLabel}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  retryText: {
    color: '#FFFFFF',
  },
});
