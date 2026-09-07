import { Text, type TextProps, StyleSheet } from 'react-native';
import { typography, useColors } from '@/theme';

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
  const colors = useColors();
  const variantStyle = typography[variant];
  return (
    <Text
      style={[
        styles.base,
        variantStyle,
        color !== undefined ? { color } : { color: colors.text },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {},
});
