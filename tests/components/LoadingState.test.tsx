/// <reference types="jest" />

import { render, screen } from '@testing-library/react-native';
import LoadingState from '@/components/LoadingState';

describe('LoadingState', () => {
  it('renders the loading indicator with a testID', () => {
    render(<LoadingState />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('exposes progressbar accessibility role and label', () => {
    render(<LoadingState />);
    const indicator = screen.getByTestId('loading-indicator');
    expect(indicator.props.accessibilityRole).toBe('progressbar');
    expect(indicator.props.accessibilityLabel).toBe('Loading');
  });
});
