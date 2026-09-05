/// <reference types="jest" />

import { Platform } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AppButton from '@/components/AppButton';

describe('AppButton', () => {
  it('renders title text', () => {
    render(<AppButton title="Confirm" onPress={jest.fn()} />);
    expect(screen.getByText('Confirm')).toBeTruthy();
  });

  it('invokes onPress when tapped', () => {
    const onPress = jest.fn();
    render(<AppButton title="Tap" onPress={onPress} />);
    fireEvent.press(screen.getByText('Tap'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders loading label when loading', () => {
    render(<AppButton title="Save" onPress={jest.fn()} loading />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('adds android_ripple when running on Android', () => {
    const original = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'android', configurable: true });
    try {
      const onPress = jest.fn();
      render(<AppButton title="Go" onPress={onPress} />);
      fireEvent.press(screen.getByText('Go'));
      expect(onPress).toHaveBeenCalled();
    } finally {
      Object.defineProperty(Platform, 'OS', { value: original, configurable: true });
    }
  });
});
