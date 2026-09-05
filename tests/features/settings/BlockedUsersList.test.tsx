/// <reference types="jest" />

import { render, screen, fireEvent } from '@testing-library/react-native';
import BlockedUsersList from '@/features/settings/components/BlockedUsersList';
import { useBlockStore } from '@/store/blockStore';

describe('BlockedUsersList', () => {
  beforeEach(() => {
    useBlockStore.setState({ blockedIds: new Set() });
  });

  it('shows empty state when no blocked ids', () => {
    render(<BlockedUsersList />);

    expect(screen.getByText('No blocked users.')).toBeTruthy();
  });

  it('renders one row per blocked id', () => {
    useBlockStore.setState({ blockedIds: new Set(['1', '3']) });

    render(<BlockedUsersList />);

    expect(screen.getByText('User #1')).toBeTruthy();
    expect(screen.getByText('User #3')).toBeTruthy();
  });

  it('sorts entries by numeric id ascending', () => {
    useBlockStore.setState({ blockedIds: new Set(['3', '1', '2']) });

    render(<BlockedUsersList />);

    const rows = screen.getAllByText(/User #\d/);
    expect(rows[0]).toHaveTextContent('User #1');
    expect(rows[1]).toHaveTextContent('User #2');
    expect(rows[2]).toHaveTextContent('User #3');
  });

  it('unblock button calls unblockUser', () => {
    useBlockStore.setState({ blockedIds: new Set(['2']) });

    render(<BlockedUsersList />);

    fireEvent.press(screen.getByLabelText('Unblock user 2'));
    expect(useBlockStore.getState().isBlocked('2')).toBe(false);
  });
});
