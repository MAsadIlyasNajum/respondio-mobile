import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/AppText';
import { spacing, useColors } from '@/theme';
import { formatMessageDate } from '@/utils/format';

interface DateSeparatorProps {
  date: string;
}

function DateSeparator({ date }: DateSeparatorProps) {
  const colors = useColors();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AppText variant="metadata" style={[styles.text, { color: colors.secondaryText }]}>
          {formatMessageDate(date)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  pill: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {},
});

export default memo(DateSeparator);
