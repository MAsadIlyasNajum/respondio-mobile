/// <reference types="jest" />

import { render, screen, fireEvent } from '@testing-library/react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBlockStore } from '@/store/blockStore';
import ChatScreen from '@/app/chat/[userId]';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { useCreateMessage } from '@/features/messages/hooks/useCreateMessage';

jest.mock('@/features/messages/hooks/useMessages');
jest.mock('@/features/messages/hooks/useCreateMessage');
jest.mock('expo-router');

const mockedUseMessages = jest.mocked(useMessages);
const mockedUseCreateMessage = jest.mocked(useCreateMessage);
const mockPush = jest.fn();

const mockContact = {
  id: 2,
  name: 'Bob',
  username: 'bob',
  email: 'bob@example.com',
  avatar: '',
  phone: '',
  website: '',
  address: { street: '', city: '', zipcode: '' },
};

const baseMessage = (id: number, body: string) => ({
  id,
  userId: 2,
  title: body,
  body,
  tags: [],
  category: 'Chat',
  createdAt: '2026-09-04T10:00:00.000Z',
});

describe('ChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBlockStore.setState({ blockedUsers: new Map() });
    jest.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => true),
    } as any);
    jest.mocked(useLocalSearchParams).mockReturnValue({ userId: '2' });
    jest.mocked(useQuery).mockReturnValue({
      data: mockContact,
      isLoading: false,
      isError: false,
    } as any);
    mockedUseMessages.mockReturnValue({
      messages: [],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
    mockedUseCreateMessage.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
    } as any);
  });

  it('renders message bubbles from useMessages', () => {
    mockedUseMessages.mockReturnValue({
      messages: [baseMessage(10, 'Hello there')],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<ChatScreen />);

    expect(screen.getByText('Hello there')).toBeTruthy();
  });

  it('presses Send through the createPost mutation path', () => {
    const mutate = jest.fn();
    mockedUseCreateMessage.mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
    } as any);

    render(<ChatScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Type a message...'), 'hi there');
    fireEvent.press(screen.getByLabelText('Send message'));

    expect(mutate).toHaveBeenCalledWith({
      text: 'hi there',
      clientMessageId: expect.any(String),
    });
  });

  it('shows blocked banner and hides the composer when contact is blocked', () => {
    useBlockStore.setState({ blockedUsers: new Map([['2', 'Bob']]) });

    render(<ChatScreen />);

    expect(screen.getByText('You blocked Bob.')).toBeTruthy();
    expect(screen.queryByLabelText('Message text input')).toBeNull();
  });

  it('unblocks a contact and restores the composer', () => {
    useBlockStore.setState({ blockedUsers: new Map([['2', 'Bob']]) });

    render(<ChatScreen />);

    expect(screen.getByText('You blocked Bob.')).toBeTruthy();
    fireEvent.press(screen.getByText('Unblock'));
    expect(screen.queryByText('You blocked Bob.')).toBeNull();
    expect(screen.getByLabelText('Message text input')).toBeTruthy();
  });

  it('navigates to the profile screen when the header avatar is tapped', () => {
    render(<ChatScreen />);

    fireEvent.press(screen.getByLabelText('Open profile for Bob'));
    expect(mockPush).toHaveBeenCalledWith('/profile/2');
  });

  it('navigates back when the back button is tapped', () => {
    const mockBack = jest.fn();
    jest.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: mockBack,
      canGoBack: jest.fn(() => true),
    } as any);

    render(<ChatScreen />);

    fireEvent.press(screen.getByLabelText('Back'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('header back button has hitSlop for accessibility', () => {
    render(<ChatScreen />);
    const back = screen.getByLabelText('Back');
    expect(back.props.hitSlop).toBeDefined();
    expect(back.props.accessibilityRole).toBe('button');
  });

  it('header block button has accessibility role and label', () => {
    render(<ChatScreen />);
    const block = screen.getByLabelText('Block Bob');
    expect(block.props.accessibilityRole).toBe('button');
  });
});
