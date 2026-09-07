import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { radius, avatarSizes, useColors } from '@/theme';
import AppText from '@/components/AppText';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: AvatarSize;
  accessibilityLabel?: string;
}

export default function Avatar({ uri, name, size = 'md', accessibilityLabel }: AvatarProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          overflow: 'hidden',
          backgroundColor: colors.surface,
        },
        image: {
          resizeMode: 'cover',
        },
        fallback: {
          backgroundColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        },
        initials: {
          color: colors.secondaryText,
        },
      }),
    [colors]
  );

  const dimension = avatarSizes[size];
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?';

  return (
    <View
      style={[
        styles.container,
        { width: dimension, height: dimension, borderRadius: radius.full },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { width: dimension, height: dimension, borderRadius: radius.full },
          ]}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
          accessible
          accessibilityLabel={accessibilityLabel}
        />
      ) : (
        <View
          accessible
          accessibilityLabel={accessibilityLabel}
          style={[
            styles.fallback,
            { width: dimension, height: dimension, borderRadius: radius.full },
          ]}
        >
          <AppText variant="caption" style={styles.initials}>
            {initials}
          </AppText>
        </View>
      )}
    </View>
  );
}
