import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useColors } from '@/theme';

interface LoadingStateProps {
  size?: 'small' | 'large';
  accessibilityLabel?: string;
}

export default function LoadingState({
  size = 'large',
  accessibilityLabel = 'Loading',
}: LoadingStateProps) {
  const colors = useColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={size}
        color={colors.primary}
        testID="loading-indicator"
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="progressbar"
      />
    </View>
  );
}
