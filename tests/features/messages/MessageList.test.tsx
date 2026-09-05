/// <reference types="jest" />

import { View, Text } from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import MessageList from '@/features/messages/components/MessageList';
import type { Message } from '@/features/messages/types';

const mockScrollToEnd = jest.fn();

jest.mock('react-native', () => {
  const actualRN = jest.requireActual('react-native');
  const React = require('react');

  const MockedFlatList = React.forwardRef((props: any, ref: any) => {
    const mergeRef = (instance: any) => {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
      if (instance) {
        instance.scrollToEnd = mockScrollToEnd;
      }
    };

    let renderedChildren: any = null;
    if (props.renderItem && props.data) {
      renderedChildren = props.data.map((item: any, index: number) =>
        React.createElement(
          React.Fragment,
          { key: item.clientMessageId ?? String(item.id) },
          props.renderItem({ item, index } as any)
        )
      );
    }

    if (props.onContentSizeChange) {
      setTimeout(() => props.onContentSizeChange(0, 600), 0);
    }

    if (props.onLayout) {
      props.onLayout({ nativeEvent: { layout: { height: 400, width: 300, x: 0, y: 0 } } });
    }

    if (props.onScroll) {
      props.onScroll({
        nativeEvent: {
          contentOffset: { y: 550 },
          layoutMeasurement: { height: 400, width: 300, x: 0, y: 0 },
          contentSize: { height: 1000, width: 300 },
        },
      } as any);
    }

    return React.createElement(actualRN.View, { ...props, ref: mergeRef, testID: 'flat-list' }, renderedChildren);
  });

  return new Proxy(actualRN, {
    get(target, prop: string) {
      if (prop === 'FlatList') {
        return MockedFlatList;
      }
      return target[prop];
    },
  });
});

const baseMessage = (id: number, body: string, userId = 2): Message => ({
  id,
  userId,
  title: body,
  body,
  tags: [],
  category: 'Chat',
  createdAt: '2026-09-04T10:00:00.000Z',
});

describe('MessageList', () => {
  beforeEach(() => {
    mockScrollToEnd.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders loading state', () => {
    render(
      <MessageList
        messages={[]}
        currentUserId={1}
        isLoading
        isError={false}
        onRefresh={jest.fn()}
      />
    );
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders error state when there are no messages', () => {
    render(
      <MessageList
        messages={[]}
        currentUserId={1}
        isLoading={false}
        isError
        onRefresh={jest.fn()}
      />
    );
    expect(screen.getByText('Unable to load messages.')).toBeTruthy();
    expect(screen.getByLabelText('Retry loading messages')).toBeTruthy();
  });

  it('renders empty state when messages are empty', () => {
    render(
      <MessageList
        messages={[]}
        currentUserId={1}
        isLoading={false}
        isError={false}
        onRefresh={jest.fn()}
      />
    );
    expect(screen.getByText('No messages yet. Start the conversation.')).toBeTruthy();
  });

  it('renders message bubbles', () => {
    render(
      <MessageList
        messages={[baseMessage(1, 'Hello')]}
        currentUserId={2}
        isLoading={false}
        isError={false}
        onRefresh={jest.fn()}
      />
    );
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('calls onRefresh when pull-to-refresh is triggered', () => {
    const onRefresh = jest.fn();
    render(
      <MessageList
        messages={[baseMessage(1, 'Hello')]}
        currentUserId={2}
        isLoading={false}
        isError={false}
        onRefresh={onRefresh}
      />
    );
    fireEvent(screen.getByTestId('flat-list'), 'refresh');
    expect(onRefresh).toHaveBeenCalled();
  });

  it('scrolls to end on initial content size change', () => {
    render(
      <MessageList
        messages={[baseMessage(1, 'Hello'), baseMessage(2, 'World')]}
        currentUserId={2}
        isLoading={false}
        isError={false}
        onRefresh={jest.fn()}
      />
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(mockScrollToEnd).toHaveBeenCalledWith({ animated: false });
  });

  it('does not call scrollToEnd when user is not near bottom on new content', () => {
    mockScrollToEnd.mockClear();
    const { rerender, getByTestId } = render(
      <MessageList
        messages={[baseMessage(1, 'Hello')]}
        currentUserId={2}
        isLoading={false}
        isError={false}
        onRefresh={jest.fn()}
      />
    );
    act(() => {
      jest.runAllTimers();
    });
    mockScrollToEnd.mockClear();

    const newMessages = [
      baseMessage(1, 'Hello'),
      baseMessage(2, 'World'),
    ];
    rerender(
      <MessageList
        messages={newMessages}
        currentUserId={2}
        isLoading={false}
        isError={false}
        onRefresh={jest.fn()}
      />
    );

    fireEvent.scroll(getByTestId('flat-list'), {
      nativeEvent: {
        contentOffset: { y: 0 },
        layoutMeasurement: { height: 400, width: 300, x: 0, y: 0 },
        contentSize: { height: 1000, width: 300 },
      },
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(mockScrollToEnd).not.toHaveBeenCalled();
  });

  it('calls retry callback when retry button is pressed', () => {
    const onRetryMessage = jest.fn();
    const failedMessage: Message = {
      ...baseMessage(1, 'Failed'),
      _failed: true,
      clientMessageId: 'cm-failed',
    };
    render(
      <MessageList
        messages={[failedMessage]}
        currentUserId={2}
        isLoading={false}
        isError={false}
        onRefresh={jest.fn()}
        onRetryMessage={onRetryMessage}
      />
    );
    fireEvent.press(screen.getByLabelText('Retry sending message'));
    expect(onRetryMessage).toHaveBeenCalledWith('cm-failed', 'Failed');
  });
});
