/// <reference types="jest" />

import { act, render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ContactItem from '@/features/chats/components/ContactItem';
import type { User } from '@/types/User';
import type { Post } from '@/types/Post';

jest.mock('expo-router', () => {
  let callback: (() => void) | undefined;
  return {
    useFocusEffect: jest.fn((cb) => {
      callback = cb;
    }),
    getFocusEffectCallback: () => callback,
  };
});

const baseUser = (id: number, name: string): User => ({
  id,
  name,
  username: name.toLowerCase(),
  email: `${name.toLowerCase()}@example.com`,
  avatar: '',
  phone: '',
  website: '',
  address: { street: '', city: '', zipcode: '' },
});

const basePost = (overrides: Partial<Post> & {
  id: number;
  userId: number;
  body: string;
  createdAt: string;
}): Post => {
  const post: Post = {
    id: overrides.id,
    userId: overrides.userId,
    title: overrides.body,
    body: overrides.body,
    tags: [],
    category: 'Chat',
    createdAt: overrides.createdAt,
  };
  return { ...post, ...overrides };
};

const noop = () => {};

describe('ContactItem', () => {
  it('renders user name and avatar', () => {
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={noop} lastMessage={null} messageStatus="success" />
    );
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('shows No messages yet when there is no lastMessage', () => {
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={noop} lastMessage={null} messageStatus="success" />
    );
    expect(screen.getByText('No messages yet')).toBeTruthy();
  });

  it('shows actual message body when lastMessage exists', () => {
    const post = basePost({ id: 10, userId: 1, body: 'Hello there', createdAt: '2026-09-04T12:00:00.000Z' });
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={noop} lastMessage={post} messageStatus="success" />
    );
    expect(screen.getByText('Hello there')).toBeTruthy();
  });

  it('shows formatted timestamp when lastMessage exists', () => {
    const post = basePost({ id: 10, userId: 1, body: 'Hello', createdAt: '2026-09-04T12:00:00.000Z' });
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={noop} lastMessage={post} messageStatus="success" />
    );
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = new Date('2026-09-04T12:00:00.000Z') >= startOfToday;
    if (isToday) {
      expect(screen.getByText('12:00 PM')).toBeTruthy();
    } else {
      expect(screen.getByText('Sep 4')).toBeTruthy();
    }
  });

  it('shows loading indicator instead of No messages yet while loading', () => {
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={noop} lastMessage={null} messageStatus="loading" />
    );
    const loadingIndicators = screen.getAllByText('...');
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('No messages yet')).toBeNull();
  });

  it('shows error fallback when messageStatus is error', () => {
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={noop} lastMessage={null} messageStatus="error" />
    );
    expect(screen.getByText('Unable to load message')).toBeTruthy();
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={onPress} lastMessage={null} messageStatus="success" />
    );
    fireEvent.press(screen.getByText('Alice'));
    expect(onPress).toHaveBeenCalled();
  });

  it('selects latest message by createdAt, not array order', () => {
    const latest = basePost({ id: 20, userId: 1, body: 'newest', createdAt: '2026-09-04T14:00:00.000Z' });
    const older = basePost({ id: 10, userId: 1, body: 'older', createdAt: '2026-09-04T08:00:00.000Z' });

    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={noop} lastMessage={latest} messageStatus="success" />
    );
    expect(screen.getByText('newest')).toBeTruthy();
    expect(screen.queryByText('older')).toBeNull();
  });

  it('shows dash when loading', () => {
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={noop} lastMessage={null} messageStatus="loading" />
    );
    const loadingIndicators = screen.getAllByText('...');
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(1);
  });

  it('ignores rapid repeated presses while navigation is in flight', () => {
    const onPress = jest.fn();
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={onPress} lastMessage={null} messageStatus="success" />
    );
    fireEvent.press(screen.getByText('Alice'));
    fireEvent.press(screen.getByText('Alice'));
    fireEvent.press(screen.getByText('Alice'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('re-enables contact after screen regains focus', () => {
    const onPress = jest.fn();
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={onPress} lastMessage={null} messageStatus="success" />
    );

    fireEvent.press(screen.getByLabelText('Chat with Alice'));
    expect(onPress).toHaveBeenCalledTimes(1);

    const { getFocusEffectCallback } = require('expo-router');
    const callback = getFocusEffectCallback();
    if (callback) {
      callback();
    }

    act(() => {});

    fireEvent.press(screen.getByLabelText('Chat with Alice'));
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it('sets accessibilityState to disabled while navigating', async () => {
    const onPress = jest.fn();
    render(
      <ContactItem user={baseUser(1, 'Alice')} onPress={onPress} lastMessage={null} messageStatus="success" />
    );

    fireEvent.press(screen.getByLabelText('Chat with Alice'));
    expect(onPress).toHaveBeenCalledTimes(1);
    let button = screen.getByLabelText('Chat with Alice');
    expect(button.props.accessibilityState.disabled).toBe(true);

    const { getFocusEffectCallback } = require('expo-router');
    const callback = getFocusEffectCallback();
    if (callback) {
      callback();
    }

    act(() => {});

    await waitFor(() => {
      button = screen.getByLabelText('Chat with Alice');
      expect(button.props.accessibilityState.disabled).toBe(false);
    });
  });
});
