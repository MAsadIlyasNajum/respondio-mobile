import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#208AEF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          borderTopColor: '#E5E7EB',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, focused }) => (
            <SymbolView name={focused ? 'message.fill' : 'message'} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <SymbolView name={focused ? 'gearshape.fill' : 'gearshape'} tintColor={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
