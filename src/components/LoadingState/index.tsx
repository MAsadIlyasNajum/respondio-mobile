import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { colors } from '@/theme';

interface LoadingStateProps {
  size?: 'small' | 'large';
}

export default function LoadingState({ size = 'large' }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} testID="loading-indicator" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
