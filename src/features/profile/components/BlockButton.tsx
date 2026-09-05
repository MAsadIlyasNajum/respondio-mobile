import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import AppButton from '@/components/AppButton';
import { SymbolView } from 'expo-symbols';
import { useBlockStore } from '@/store/blockStore';

interface BlockButtonProps {
  userId: string;
  userName: string;
}

export default function BlockButton({ userId, userName }: BlockButtonProps) {
  const blocked = useBlockStore((s) => s.blockedIds.has(userId));
  const blockUser = useBlockStore((s) => s.blockUser);
  const unblockUser = useBlockStore((s) => s.unblockUser);
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleBlockPress = () => {
    if (blocked) {
      unblockUser(userId);
      return;
    }
    if (!confirming) {
      setConfirming(true);
      timerRef.current = setTimeout(() => setConfirming(false), 3000);
    }
  };

  const handleConfirm = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setConfirming(false);
    blockUser(userId);
  };

  const handleCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setConfirming(false);
  };

  if (blocked) {
    return (
      <AppButton
        title={`Unblock ${userName}`}
        onPress={handleBlockPress}
        variant="primary"
        icon={<SymbolView name="checkmark.circle" size={18} tintColor="#FFFFFF" />}
        accessibilityLabel={`Unblock ${userName}`}
      />
    );
  }

  if (confirming) {
    return (
      <View style={styles.confirmRow}>
        <AppButton
          title="Confirm"
          onPress={handleConfirm}
          variant="primary"
          accessibilityLabel={`Confirm block ${userName}`}
          accessibilityHint="Blocks this user"
        />
        <AppButton
          title="Cancel"
          onPress={handleCancel}
          variant="outline"
          accessibilityLabel="Cancel block"
        />
      </View>
    );
  }

  return (
    <AppButton
      title={`Block ${userName}`}
      onPress={handleBlockPress}
      variant="outline"
      icon={<SymbolView name="hand.raised" size={18} tintColor={colors.primary} />}
      accessibilityLabel={`Block ${userName}`}
      accessibilityHint="Shows confirmation step before blocking"
    />
  );
}

const styles = StyleSheet.create({
  confirmRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
});
