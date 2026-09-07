import { useMemo } from 'react';
import { type GestureResponderEvent, Pressable, StyleSheet, View, Platform, type AccessibilityProps } from 'react-native';
import { radius, spacing, typography, useColors } from '@/theme';
import AppText from '@/components/AppText';

type Variant = 'primary' | 'outline' | 'ghost';

interface AppButtonProps extends AccessibilityProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  accessibilityLabel,
  accessibilityRole,
  ...accessibilityRest
}: AppButtonProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[5],
          borderRadius: radius.md,
          gap: spacing[2],
        },
        primary: {
          backgroundColor: colors.primary,
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        },
        ghost: {
          backgroundColor: 'transparent',
        },
        pressed: {
          opacity: 0.85,
          transform: [{ scale: 0.98 }],
        },
        disabled: {
          opacity: 0.5,
        },
        text: {
          ...typography.button,
        },
        primaryText: {
          color: colors.onPrimary,
        },
        outlineText: {
          color: colors.primary,
        },
        ghostText: {
          color: colors.primary,
        },
        icon: {
          marginRight: spacing[2],
        },
      }),
    [colors]
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      {...accessibilityRest}
      android_ripple={
        variant === 'primary'
          ? { color: 'rgba(255,255,255,0.18)' }
          : { color: 'rgba(0,0,0,0.08)' }
      }
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        Platform.OS !== 'android' && pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <AppText
        variant="button"
        style={[
          styles.text,
          variant === 'primary' && styles.primaryText,
          variant === 'outline' && styles.outlineText,
          variant === 'ghost' && styles.ghostText,
        ]}
      >
        {loading ? 'Loading...' : title}
      </AppText>
    </Pressable>
  );
}
