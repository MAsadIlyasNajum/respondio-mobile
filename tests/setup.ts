/// <reference types="jest" />

jest.mock('react-native-reanimated', () => {
  const { View, Text, Image, ScrollView, FlatList } = require('react-native');
  const sharedValue = (initial: any) => ({ value: initial, _isSharedValue: true });
  return {
    default: {
      View,
      Text,
      Image,
      ScrollView,
      FlatList,
      call: () => {},
      createAnimatedComponent: (c: any) => c,
    },
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
    useSharedValue: sharedValue,
    useDerivedValue: sharedValue,
    useAnimatedStyle: (cb: any) => (typeof cb === 'function' ? cb() : {}),
    useAnimatedProps: jest.fn(() => ({})),
    useAnimatedRef: sharedValue,
    useAnimatedScrollHandler: jest.fn(() => ({})),
    useAnimatedReaction: jest.fn(),
    useWorkletCallback: jest.fn(),
    useAnimatedKeyboard: jest.fn(() => ({ height: 0, state: 0 })),
    withSpring: (v: any) => v,
    withTiming: (v: any) => v,
    withRepeat: jest.fn((v: any) => v),
    withSequence: jest.fn(),
    withDecay: jest.fn(),
    interpolate: jest.fn(),
    interpolateColor: jest.fn(),
    Extrapolate: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    runOnUI: (fn: any) => fn,
    runOnJS: (fn: any) => fn,
    useAnimatedSensor: jest.fn(() => ({ sensor: 0, data: null })),
    Easing: { linear: (v: any) => v, ease: (v: any) => v, bezier: () => (v: any) => v },
  };
});

jest.mock('expo-symbols', () => ({
  SymbolView: 'SymbolView',
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: View,
    SafeAreaView: View,
    SafeAreaInsetsContext: {
      Consumer: ({ children }: any) => children(inset),
      Provider: ({ children }: any) => children,
    },
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
    initialWindowMetrics: inset,
  };
});

jest.mock('expo-constants', () => {
  const value = { version: '1.0.0', name: 'respondio-mobile' };
  return {
    __esModule: true,
    default: { expoConfig: value, manifest: value },
    Constants: { expoConfig: value, manifest: value },
  };
});

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    QueryClient: jest.fn().mockImplementation(() => ({
      defaultQueryOptions: jest.fn(),
      getQueryCache: jest.fn(() => ({
        get: jest.fn(),
        subscribe: jest.fn(),
      })),
      isFetching: jest.fn(() => 0),
      invalidateQueries: jest.fn(),
    })),
    QueryClientProvider: jest.fn(({ children }) => children),
    useQuery: jest.fn(),
    useInfiniteQuery: jest.fn(),
    useQueryClient: jest.fn(),
    useQueries: jest.fn(),
  };
});
