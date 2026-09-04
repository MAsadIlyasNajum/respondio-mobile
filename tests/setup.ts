/// <reference types="jest" />

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
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
    })),
    QueryClientProvider: jest.fn(({ children }) => children),
    useQuery: jest.fn(),
    useInfiniteQuery: jest.fn(),
    useQueryClient: jest.fn(),
  };
});
