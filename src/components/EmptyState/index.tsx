import { type ReactNode } from 'react';
import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, useColors } from '@/theme';
import AppText from '@/components/AppText';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
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
        icon: {
          marginBottom: spacing[3],
        },
        title: {
          textAlign: 'center',
          color: colors.text,
        },
        subtitle: {
          textAlign: 'center',
          color: colors.secondaryText,
        },
        action: {
          marginTop: spacing[4],
        },
      }),
    [colors]
  );

  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <AppText variant="heading" style={styles.title}>
        {title}
      </AppText>
      {subtitle && (
        <AppText variant="body" style={styles.subtitle}>
          {subtitle}
        </AppText>
      )}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}
