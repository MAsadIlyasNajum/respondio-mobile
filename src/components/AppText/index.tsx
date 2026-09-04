import { Text, type TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

type Variant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
}

export default function AppText({
  variant = 'body',
  color,
  style,
  ...rest
}: AppTextProps) {
  const variantStyle = typography[variant];
  return (
    <Text
      style={[
        styles.base,
        variantStyle,
        color !== undefined ? { color } : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
});
