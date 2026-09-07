/// <reference types="jest" />

import { render, screen, fireEvent } from '@testing-library/react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBlockStore } from '@/store/blockStore';
import ProfileScreen from '@/app/profile/[userId]';
import { useProfile } from '@/features/profile/hooks/useProfile';

jest.mock('@/features/profile/hooks/useProfile');
jest.mock('expo-router');

const mockedUseProfile = jest.mocked(useProfile);
const mockBack = jest.fn();

const mockUser = {
  id: 2,
  name: 'Bob',
  username: 'bob',
  email: 'bob@example.com',
  avatar: '',
  phone: '123-456-7890',
  website: 'bob.dev',
  address: { street: '123 Main St', city: 'Springfield', zipcode: '12345' },
};

beforeEach(() => {
  jest.clearAllMocks();
  useBlockStore.setState({ blockedUsers: new Map() });
  jest.mocked(useRouter).mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: mockBack,
    canGoBack: jest.fn(() => true),
  } as any);
  jest.mocked(useLocalSearchParams).mockReturnValue({ userId: '2' });
});

describe('ProfileScreen', () => {
  it('renders loading state while fetching', () => {
    mockedUseProfile.mockReturnValue({
      user: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });

    render(<ProfileScreen />);

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders profile header and details on success', () => {
    mockedUseProfile.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<ProfileScreen />);

    expect(screen.getByText('Bob')).toBeTruthy();
    expect(screen.getByText('@bob')).toBeTruthy();
    expect(screen.getByText('bob@example.com')).toBeTruthy();
    expect(screen.getByText('123-456-7890')).toBeTruthy();
    expect(screen.getByText('bob.dev')).toBeTruthy();
    expect(screen.getByText('123 Main St, Springfield, 12345')).toBeTruthy();
  });

  it('renders error state with retry on fetch failure', () => {
    const mockRefetch = jest.fn();
    mockedUseProfile.mockReturnValue({
      user: undefined,
      isLoading: false,
      isError: true,
      refetch: mockRefetch,
    });

    render(<ProfileScreen />);

    expect(screen.getByText('Unable to load profile.')).toBeTruthy();
    fireEvent.press(screen.getByText('Retry'));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('block button toggles block state', () => {
    mockedUseProfile.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<ProfileScreen />);

    expect(screen.getByLabelText('Block Bob')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Block Bob'));
    expect(screen.getByLabelText('Confirm block Bob')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Confirm block Bob'));
    expect(useBlockStore.getState().isBlocked('2')).toBe(true);
  });

  it('unblock restores state', () => {
    useBlockStore.setState({ blockedUsers: new Map([['2', 'Bob']]) });
    mockedUseProfile.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<ProfileScreen />);

    expect(screen.getByLabelText('Unblock Bob')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Unblock Bob'));
    expect(useBlockStore.getState().isBlocked('2')).toBe(false);
  });

  it('back button calls router.back', () => {
    mockedUseProfile.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<ProfileScreen />);

    fireEvent.press(screen.getByLabelText('Back'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('renders empty state when userId is missing', () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({});

    mockedUseProfile.mockReturnValue({
      user: undefined,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<ProfileScreen />);

    expect(screen.getByText('Invalid profile link.')).toBeTruthy();
  });

  it('differentiates empty state when userId is valid but user not found', () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({ userId: '999' });

    mockedUseProfile.mockReturnValue({
      user: undefined,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<ProfileScreen />);

    expect(screen.getByText('User not found.')).toBeTruthy();
  });
});
