import { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import EmptyState from '@/components/EmptyState';
import { useBlockStore } from '@/store/blockStore';

export default function BlockedUsersList() {
  const blockedIds = useBlockStore((s) => s.blockedIds);
  const unblockUser = useBlockStore((s) => s.unblockUser);

  const sortedIds = useMemo(() => {
    return Array.from(blockedIds).map(Number).sort((a, b) => a - b).map(String);
  }, [blockedIds]);

  if (sortedIds.length === 0) {
    return <EmptyState title="No blocked users." />;
  }

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.row}>
      <AppText variant="body" style={styles.name}>
        User #{item}
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
      data={sortedIds}
      keyExtractor={(item) => item}
      renderItem={renderItem}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  name: {
    color: colors.text,
  },
  separator: {
    height: spacing[2],
  },
});
