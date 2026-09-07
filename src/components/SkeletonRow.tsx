import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { spacing, useColors } from '@/theme';

const SHIMMER_WIDTH = 60;

export default function SkeletonRow() {
  const colors = useColors();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      true
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (shimmer.value - 0.5) * SHIMMER_WIDTH }],
  }));

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: colors.border }]} />
      <View style={styles.content}>
        <View style={[styles.title, { backgroundColor: colors.border }]} />
        <View style={[styles.subtitle, { backgroundColor: colors.border }]} />
      </View>
      <View style={[styles.shimmerTrack, { backgroundColor: colors.surface }]}>
        <Animated.View
          style={[
            styles.shimmerHighlight,
            { backgroundColor: colors.background },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    gap: spacing[2],
  },
  title: {
    height: 14,
    width: '60%',
    borderRadius: 4,
  },
  subtitle: {
    height: 10,
    width: '40%',
    borderRadius: 4,
  },
  shimmerTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  shimmerHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SHIMMER_WIDTH,
    borderRadius: 4,
  },
});
