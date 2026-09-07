import { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useColors } from '@/theme';

export default function TabsLayout() {
  const colors = useColors();
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.secondaryText,
      tabBarStyle: {
        borderTopColor: colors.border,
        backgroundColor: colors.background,
      },
    }),
    [colors]
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, focused }) => (
            <SymbolView name={{ ios: focused ? 'message.fill' : 'message', android: 'message' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <SymbolView name={{ ios: focused ? 'gearshape.fill' : 'gearshape', android: 'settings' }} tintColor={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
