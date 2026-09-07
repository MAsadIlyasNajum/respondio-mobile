/// <reference types="jest" />

import { renderHook, act } from '@testing-library/react-native';
import { useQuery } from '@tanstack/react-query';
import { useProfile } from '@/features/profile/hooks/useProfile';

jest.mock('@/api/users');
jest.mock('@tanstack/react-query');

const mockedUseQuery = jest.mocked(useQuery);

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns isLoading true during fetch', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    const { result } = renderHook(() => useProfile('2'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('returns user on success', () => {
    const mockUser = {
      id: 2,
      name: 'Bob',
      username: 'bob',
      email: 'bob@example.com',
      avatar: '',
      phone: '',
      website: '',
      address: { street: '', city: '', zipcode: '' },
    };

    mockedUseQuery.mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as any);

    const { result } = renderHook(() => useProfile('2'));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('returns isError true on fetch rejection', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
    } as any);

    const { result } = renderHook(() => useProfile('2'));

    expect(result.current.isError).toBe(true);
    expect(result.current.user).toBeUndefined();
  });

  it('returns a callable refetch', async () => {
    const mockRefetch = jest.fn();
    mockedUseQuery.mockReturnValue({
      data: { id: 2, name: 'Bob', username: 'bob', email: 'bob@example.com', avatar: '', phone: '', website: '', address: { street: '', city: '', zipcode: '' } },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    } as any);

    const { result } = renderHook(() => useProfile('2'));

    expect(typeof result.current.refetch).toBe('function');

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('uses query key [user, userId]', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    renderHook(() => useProfile('2'));

    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['user', '2'],
      })
    );
  });

  it('does not enable query for invalid ids', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as any);

    renderHook(() => useProfile('invalid'));

    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );
  });
});
