import { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { radius, spacing, useColors } from '@/theme';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import EmptyState from '@/components/EmptyState';
import { useBlockStore } from '@/store/blockStore';

export default function BlockedUsersList() {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[4],
          backgroundColor: colors.surface,
          borderRadius: radius.md,
        },
        name: {
          color: colors.text,
        },
        separator: {
          height: spacing[2],
        },
      }),
    [colors]
  );

  const blockedUsers = useBlockStore((s) => s.blockedUsers);
  const getUserName = useBlockStore((s) => s.getUserName);
  const unblockUser = useBlockStore((s) => s.unblockUser);

  const sortedIds = useMemo(() => {
    return Array.from(blockedUsers.keys()).map(Number).sort((a, b) => a - b).map(String);
  }, [blockedUsers]);

  if (sortedIds.length === 0) {
    return <EmptyState title="No blocked users." />;
  }

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.row}>
      <AppText variant="body" style={styles.name}>
        {getUserName(item) ?? item}
      </AppText>
      <AppButton
        title="Unblock"
        onPress={() => unblockUser(item)}
        variant="ghost"
        accessibilityLabel={`Unblock user ${item}`}
      />
    </View>
  );

  return (
    <FlatList
      testID="blocked-flatlist"
      data={sortedIds}
      keyExtractor={(item) => item}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}
