/// <reference types="jest" />

import { render, screen, fireEvent } from '@testing-library/react-native';
import MessageInput from '@/features/messages/components/MessageInput';

describe('MessageInput', () => {
  it('renders text input and send button', () => {
    render(<MessageInput onSend={jest.fn()} />);
    expect(screen.getByPlaceholderText('Type a message...')).toBeTruthy();
    expect(screen.getByLabelText('Send message')).toBeTruthy();
  });

  it('trims and sends when Send is pressed with non-empty text', () => {
    const onSend = jest.fn();
    render(<MessageInput onSend={onSend} />);
    fireEvent.changeText(screen.getByPlaceholderText('Type a message...'), '  hello  ');
    fireEvent.press(screen.getByLabelText('Send message'));
    expect(onSend).toHaveBeenCalledWith('hello');
  });

  it('does not send empty input', () => {
    const onSend = jest.fn();
    render(<MessageInput onSend={onSend} />);
    fireEvent.press(screen.getByLabelText('Send message'));
    expect(onSend).not.toHaveBeenCalled();
  });

  it('send button container is at least 44x44', () => {
    render(<MessageInput onSend={jest.fn()} />);
    const button = screen.getByLabelText('Send message');
    const style = button.props.style;
    const flat = Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;
    expect(flat.width).toBeGreaterThanOrEqual(44);
    expect(flat.height).toBeGreaterThanOrEqual(44);
  });
});
