/// <reference types="jest" />

import { render, screen, fireEvent } from '@testing-library/react-native';
import ChatsScreen from '@/app/(tabs)/index';
import { useContacts } from '@/features/chats/hooks/useContacts';
import { useRouter } from 'expo-router';

jest.mock('@/features/chats/hooks/useContacts');
jest.mock('expo-router');

const mockedUseContacts = jest.mocked(useContacts);
const mockPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useRouter).mockReturnValue({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  } as any);
});

describe('ChatsScreen', () => {
  it('renders contacts list when data is available', () => {
    const mockUsers = [
      { id: 1, name: 'Alice', username: 'alice', email: 'a@b.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
      { id: 2, name: 'Bob', username: 'bob', email: 'b@b.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
    ];

    mockedUseContacts.mockReturnValue({
      users: mockUsers,
      isLoading: false,
      isError: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ChatsScreen />);

    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('shows loading state on initial fetch', () => {
    mockedUseContacts.mockReturnValue({
      users: [],
      isLoading: true,
      isError: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ChatsScreen />);

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows empty state when no contacts after filtering', () => {
    mockedUseContacts.mockReturnValue({
      users: [],
      isLoading: false,
      isError: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ChatsScreen />);

    expect(screen.getByText('No contacts available.')).toBeTruthy();
  });

  it('shows error state with retry button on fetch failure', () => {
    const mockRefetch = jest.fn();
    mockedUseContacts.mockReturnValue({
      users: [],
      isLoading: false,
      isError: true,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: mockRefetch,
    });

    render(<ChatsScreen />);

    expect(screen.getByText('Unable to load contacts.')).toBeTruthy();
    fireEvent.press(screen.getByText('Retry'));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('shows error banner above list when data exists and fetch fails', () => {
    const mockUsers = [
      { id: 2, name: 'Alice', username: 'alice', email: 'a@b.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
    ];
    const mockRefetch = jest.fn();
    mockedUseContacts.mockReturnValue({
      users: mockUsers,
      isLoading: false,
      isError: true,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: mockRefetch,
    });

    render(<ChatsScreen />);

    expect(screen.getByText('Unable to refresh contacts.')).toBeTruthy();
    expect(screen.getByText('Alice')).toBeTruthy();
    fireEvent.press(screen.getByText('Retry'));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('calls router.push when a contact is tapped', () => {
    const mockUsers = [
      { id: 1, name: 'Alice', username: 'alice', email: 'a@b.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
    ];

    mockedUseContacts.mockReturnValue({
      users: mockUsers,
      isLoading: false,
      isError: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ChatsScreen />);

    fireEvent.press(screen.getByText('Alice'));
    expect(mockPush).toHaveBeenCalledWith('/chat/1');
  });

  it('does not render blocked users', () => {
    const mockUsers = [
      { id: 1, name: 'Alice', username: 'alice', email: 'a@b.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
      { id: 2, name: 'Bob', username: 'bob', email: 'b@b.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
    ];

    mockedUseContacts.mockReturnValue({
      users: [mockUsers[0]],
      isLoading: false,
      isError: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ChatsScreen />);

    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.queryByText('Bob')).toBeNull();
  });
});
