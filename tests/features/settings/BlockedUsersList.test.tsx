/// <reference types="jest" />

import { render, screen, fireEvent } from '@testing-library/react-native';
import BlockedUsersList from '@/features/settings/components/BlockedUsersList';
import { useBlockStore } from '@/store/blockStore';

describe('BlockedUsersList', () => {
  beforeEach(() => {
    useBlockStore.setState({ blockedUsers: new Map() });
  });

  it('shows empty state when no blocked ids', () => {
    render(<BlockedUsersList />);

    expect(screen.getByText('No blocked users.')).toBeTruthy();
  });

  it('renders one row per blocked id', () => {
    useBlockStore.setState({ blockedUsers: new Map([['1', 'Alice'], ['3', 'Charlie']]) });

    render(<BlockedUsersList />);

    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Charlie')).toBeTruthy();
  });

  it('sorts entries by numeric id ascending', () => {
    useBlockStore.setState({ blockedUsers: new Map([['3', 'Charlie'], ['1', 'Alice'], ['2', 'Bob']]) });

    render(<BlockedUsersList />);

    const rows = screen.getAllByText(/User #\d|Alice|Bob|Charlie/);
    expect(rows[0]).toHaveTextContent('Alice');
    expect(rows[1]).toHaveTextContent('Bob');
    expect(rows[2]).toHaveTextContent('Charlie');
  });

  it('unblock button calls unblockUser', () => {
    useBlockStore.setState({ blockedUsers: new Map([['2', 'Bob']]) });

    render(<BlockedUsersList />);

    fireEvent.press(screen.getByLabelText('Unblock user 2'));
    expect(useBlockStore.getState().isBlocked('2')).toBe(false);
  });

  it('does not render the inner FlatList with scrollEnabled={false}', () => {
    useBlockStore.setState({ blockedUsers: new Map([['2', 'Bob']]) });

    render(<BlockedUsersList />);

    const flatList = screen.getByTestId('blocked-flatlist');
    expect(flatList.props.scrollEnabled).not.toBe(false);
  });
});

