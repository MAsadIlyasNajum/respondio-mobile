/// <reference types="jest" />

import { useBlockStore } from '@/store/blockStore';

describe('blockStore', () => {
  beforeEach(() => {
    useBlockStore.setState({ blockedUsers: new Map() });
  });

  describe('blockUser', () => {
    it('adds an entry to the Map', () => {
      useBlockStore.getState().blockUser('1', 'Alice');

      const state = useBlockStore.getState();
      expect(state.blockedUsers.has('1')).toBe(true);
    });

    it('stores the name associated with the id', () => {
      useBlockStore.getState().blockUser('2', 'Bob');

      expect(useBlockStore.getState().getUserName('2')).toBe('Bob');
    });

    it('creates a new Map instance (immutability)', () => {
      const before = useBlockStore.getState().blockedUsers;

      useBlockStore.getState().blockUser('1', 'Alice');

      const after = useBlockStore.getState().blockedUsers;
      expect(after).not.toBe(before);
      expect(before.has('1')).toBe(false);
    });

    it('overwrites the name when blocking an already-blocked user', () => {
      useBlockStore.getState().blockUser('1', 'Alice');
      useBlockStore.getState().blockUser('1', 'Alice Updated');

      expect(useBlockStore.getState().getUserName('1')).toBe('Alice Updated');
      expect(useBlockStore.getState().blockedUsers.size).toBe(1);
    });
  });

  describe('unblockUser', () => {
    it('removes the entry from the Map', () => {
      useBlockStore.getState().blockUser('1', 'Alice');
      useBlockStore.getState().unblockUser('1');

      expect(useBlockStore.getState().blockedUsers.has('1')).toBe(false);
    });

    it('creates a new Map instance (immutability)', () => {
      useBlockStore.getState().blockUser('1', 'Alice');
      const before = useBlockStore.getState().blockedUsers;

      useBlockStore.getState().unblockUser('1');

      const after = useBlockStore.getState().blockedUsers;
      expect(after).not.toBe(before);
      expect(after.has('1')).toBe(false);
    });

    it('does not affect other entries', () => {
      useBlockStore.getState().blockUser('1', 'Alice');
      useBlockStore.getState().blockUser('2', 'Bob');
      useBlockStore.getState().unblockUser('1');

      expect(useBlockStore.getState().isBlocked('2')).toBe(true);
    });
  });

  describe('isBlocked', () => {
    it('returns false for a user that has not been blocked', () => {
      expect(useBlockStore.getState().isBlocked('1')).toBe(false);
    });

    it('returns true for a blocked user', () => {
      useBlockStore.getState().blockUser('1', 'Alice');

      expect(useBlockStore.getState().isBlocked('1')).toBe(true);
    });

    it('returns false after the user is unblocked', () => {
      useBlockStore.getState().blockUser('1', 'Alice');
      useBlockStore.getState().unblockUser('1');

      expect(useBlockStore.getState().isBlocked('1')).toBe(false);
    });
  });

  describe('getUserName', () => {
    it('returns the stored name for a blocked user', () => {
      useBlockStore.getState().blockUser('1', 'Alice');

      expect(useBlockStore.getState().getUserName('1')).toBe('Alice');
    });

    it('returns undefined for a user that has not been blocked', () => {
      expect(useBlockStore.getState().getUserName('1')).toBeUndefined();
    });

    it('returns undefined after the user is unblocked', () => {
      useBlockStore.getState().blockUser('1', 'Alice');
      useBlockStore.getState().unblockUser('1');

      expect(useBlockStore.getState().getUserName('1')).toBeUndefined();
    });
  });

  describe('multiple block/unblock operations', () => {
    it('preserves state correctness across mixed operations', () => {
      useBlockStore.getState().blockUser('1', 'Alice');
      useBlockStore.getState().blockUser('2', 'Bob');
      useBlockStore.getState().blockUser('3', 'Charlie');

      expect(useBlockStore.getState().blockedUsers.size).toBe(3);

      useBlockStore.getState().unblockUser('2');

      expect(useBlockStore.getState().blockedUsers.size).toBe(2);
      expect(useBlockStore.getState().isBlocked('1')).toBe(true);
      expect(useBlockStore.getState().isBlocked('2')).toBe(false);
      expect(useBlockStore.getState().isBlocked('3')).toBe(true);
      expect(useBlockStore.getState().getUserName('3')).toBe('Charlie');
    });

    it('handles blocking and unblocking the same user repeatedly', () => {
      useBlockStore.getState().blockUser('1', 'Alice');
      useBlockStore.getState().unblockUser('1');
      useBlockStore.getState().blockUser('1', 'Alice');

      expect(useBlockStore.getState().blockedUsers.size).toBe(1);
      expect(useBlockStore.getState().isBlocked('1')).toBe(true);
      expect(useBlockStore.getState().getUserName('1')).toBe('Alice');
    });
  });
});
