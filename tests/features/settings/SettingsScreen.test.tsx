/// <reference types="jest" />

import { render, screen, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import SettingsScreen from '@/app/(tabs)/settings';
import { useBlockStore } from '@/store/blockStore';
import Constants from 'expo-constants';

jest.mock('expo-router');

const mockPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useBlockStore.setState({ blockedIds: new Set() });
  jest.mocked(useRouter).mockReturnValue({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  } as any);
});

describe('SettingsScreen', () => {
  it('renders app name and version', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('respondio-mobile')).toBeTruthy();
    expect(screen.getByText('Version 1.0.0')).toBeTruthy();
  });

  it('renders empty blocked-users state when store is empty', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('No blocked users.')).toBeTruthy();
  });

  it('renders blocked user ids when store is populated', () => {
    useBlockStore.setState({ blockedIds: new Set(['2', '3']) });

    render(<SettingsScreen />);

    expect(screen.getByText('User #2')).toBeTruthy();
    expect(screen.getByText('User #3')).toBeTruthy();
  });
});
