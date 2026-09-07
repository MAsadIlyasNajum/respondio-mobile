/// <reference types="jest" />

import { render, screen, fireEvent } from '@testing-library/react-native';
import ErrorState from '@/components/ErrorState';

describe('ErrorState', () => {
  it('renders the default message', () => {
    render(<ErrorState />);
    expect(screen.getByText('Something went wrong.')).toBeTruthy();
  });

  it('exposes button accessibility on the retry Pressable', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Boom" onRetry={onRetry} retryLabel="Try again" />);
    const button = screen.getByLabelText('Try again');
    expect(button.props.accessibilityRole).toBe('button');
    fireEvent.press(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
