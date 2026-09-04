import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';

interface Props {
  params: { userId: string };
}

export default function ChatScreen({ params }: Props) {
  return (
    <View style={styles.container}>
      <AppText variant="screenTitle" style={styles.title}>
        Chat
      </AppText>
      <AppText variant="body" style={styles.placeholder}>
        Chat with user {params.userId}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing[4],
  },
  title: {
    marginBottom: spacing[3],
  },
  placeholder: {
    color: colors.secondaryText,
  },
});
