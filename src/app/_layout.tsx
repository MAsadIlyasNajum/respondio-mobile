import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { queryClient } from '@/api/client';
import { ThemeProvider } from '@/theme';
import { useAppForegroundRefetch } from '@/hooks/useAppForegroundRefetch';

function Root() {
  useAppForegroundRefetch();

  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }} />
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Root />
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
