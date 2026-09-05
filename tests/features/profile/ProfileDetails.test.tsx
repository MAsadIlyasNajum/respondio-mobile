/// <reference types="jest" />

import { render, screen } from '@testing-library/react-native';
import ProfileDetails from '@/features/profile/components/ProfileDetails';

const mockUser = {
  id: 1,
  name: 'Alice',
  username: 'alice',
  email: 'alice@example.com',
  avatar: '',
  phone: '555-0100',
  website: 'alice.dev',
  address: { street: '1 Main', city: 'Town', zipcode: '00000' },
};

describe('ProfileDetails', () => {
  it('renders a composed accessibility label per row', () => {
    render(<ProfileDetails user={mockUser} />);
    expect(screen.getByLabelText('Email, alice@example.com')).toBeTruthy();
    expect(screen.getByLabelText('Phone, 555-0100')).toBeTruthy();
    expect(screen.getByLabelText('Website, alice.dev')).toBeTruthy();
    expect(screen.getByLabelText('Address, 1 Main, Town, 00000')).toBeTruthy();
  });

  it('each row exposes text accessibility role', () => {
    render(<ProfileDetails user={mockUser} />);
    const rows = screen.getAllByRole('text');
    expect(rows.length).toBeGreaterThan(0);
  });
});
