import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SymbolView, SFSymbol, AndroidSymbol } from 'expo-symbols';
import { spacing, useColors } from '@/theme';
import AppText from '@/components/AppText';
import type { User } from '@/types/User';

interface ProfileDetailsProps {
  user: User;
}

export default function ProfileDetails({ user }: ProfileDetailsProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: spacing[4],
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
        },
        textContainer: {
          flex: 1,
          gap: spacing[1],
        },
        label: {
          color: colors.secondaryText,
        },
        value: {
          color: colors.text,
        },
      }),
    [colors]
  );

  const address = [user.address.street, user.address.city, user.address.zipcode]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.container}>
      {user.email ? <DetailRow icon={{ ios: 'envelope', android: 'mail' }} label="Email" value={user.email} /> : null}
      {user.phone ? <DetailRow icon={{ ios: 'phone', android: 'phone' }} label="Phone" value={user.phone} /> : null}
      {user.website ? <DetailRow icon={{ ios: 'globe', android: 'globe' }} label="Website" value={user.website} /> : null}
      {address ? <DetailRow icon={{ ios: 'mappin.and.ellipse', android: 'location_on' }} label="Address" value={address} /> : null}
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: { ios: SFSymbol; android: AndroidSymbol }; label: string; value: string }) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
        },
        textContainer: {
          flex: 1,
          gap: spacing[1],
        },
        label: {
          color: colors.secondaryText,
        },
        value: {
          color: colors.text,
        },
      }),
    [colors]
  );
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}, ${value}`}
      style={styles.row}
    >
      <SymbolView name={icon} size={18} tintColor={colors.secondaryText} />
      <View style={styles.textContainer}>
        <AppText variant="metadata" style={styles.label}>
          {label}
        </AppText>
        <AppText variant="body" style={styles.value}>
          {value}
        </AppText>
      </View>
    </View>
  );
}
