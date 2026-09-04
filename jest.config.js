module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-symbols|expo-image|expo-file-system|expo-av|expo-asset|expo-constants|expo-linking|expo-splash-screen|expo-status-bar|expo-system-ui|expo-web-browser|expo-router|expo-font|@tanstack/react-query|zustand))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^test-renderer$': 'react-test-renderer',
  },
};
