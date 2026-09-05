import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import AppText from '@/components/AppText';
import { SymbolView } from 'expo-symbols';
import type { User } from '@/types/User';

interface ProfileDetailsProps {
  user: User;
}

export default function ProfileDetails({ user }: ProfileDetailsProps) {
  const address = [user.address.street, user.address.city, user.address.zipcode]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.container}>
      {user.email ? <DetailRow icon="envelope" label="Email" value={user.email} /> : null}
      {user.phone ? <DetailRow icon="phone" label="Phone" value={user.phone} /> : null}
      {user.website ? <DetailRow icon="globe" label="Website" value={user.website} /> : null}
      {address ? <DetailRow icon="mappin.and.ellipse" label="Address" value={address} /> : null}
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <SymbolView name={icon as any} size={18} tintColor={colors.secondaryText} />
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

const styles = StyleSheet.create({
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
});
