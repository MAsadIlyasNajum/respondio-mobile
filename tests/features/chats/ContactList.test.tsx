/// <reference types="jest" />

import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ContactList from '@/features/chats/components/ContactList';
import type { User } from '@/types/User';

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

const noop = () => {};

function ContactListProbe() {
  return <Text testID="custom-empty">Custom empty</Text>;
}

describe('ContactList', () => {
  it('shows loading state', () => {
    render(
      <ContactList
        data={[]}
        isLoading
        isError={false}
        isRefetching={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        onRefresh={noop}
        onFetchNextPage={noop}
      />
    );
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders default empty state when data is empty', () => {
    render(
      <ContactList
        data={[]}
        isLoading={false}
        isError={false}
        isRefetching={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        onRefresh={noop}
        onFetchNextPage={noop}
      />
    );
    expect(screen.getByText('No contacts available.')).toBeTruthy();
  });

  it('honors a parent-provided ListEmptyComponent', () => {
    render(
      <ContactList
        data={[]}
        isLoading={false}
        isError={false}
        isRefetching={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        onRefresh={noop}
        onFetchNextPage={noop}
        ListEmptyComponent={<ContactListProbe />}
      />
    );
    expect(screen.getByTestId('custom-empty')).toBeTruthy();
  });

  it('error banner retry button has min height 44', () => {
    render(
      <ContactList
        data={[baseUser(1, 'Alice')]}
        isLoading={false}
        isError
        isRefetching={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        onRefresh={noop}
        onFetchNextPage={noop}
      />
    );
    const retry = screen.getByLabelText('Retry loading contacts');
    const flat = Array.isArray(retry.props.style)
      ? Object.assign({}, ...retry.props.style.filter(Boolean))
      : retry.props.style;
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  it('error banner retry triggers refresh', () => {
    const refetch = jest.fn();
    render(
      <ContactList
        data={[baseUser(1, 'Alice')]}
        isLoading={false}
        isError
        isRefetching={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        onRefresh={refetch}
        onFetchNextPage={noop}
      />
    );
    fireEvent.press(screen.getByLabelText('Retry loading contacts'));
    expect(refetch).toHaveBeenCalled();
  });

  it('renders contact rows for provided data', () => {
    render(
      <ContactList
        data={[baseUser(1, 'Alice'), baseUser(2, 'Bob')]}
        isLoading={false}
        isError={false}
        isRefetching={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        onRefresh={noop}
        onFetchNextPage={noop}
      />
    );
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });
});
