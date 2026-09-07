import { create } from 'zustand';
import { queryClient } from '@/api/client';

interface BlockStore {
  blockedUsers: Map<string, string>;
  blockUser: (id: string, name: string) => void;
  unblockUser: (id: string) => void;
  isBlocked: (id: string) => boolean;
  getUserName: (id: string) => string | undefined;
}

export const useBlockStore = create<BlockStore>((set, get) => ({
  blockedUsers: new Map(),
  blockUser: (id, name) => {
    set((state) => {
      const next = new Map(state.blockedUsers);
      next.set(id, name);
      return { blockedUsers: next };
    });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
  unblockUser: (id) => {
    set((state) => {
      const next = new Map(state.blockedUsers);
      next.delete(id);
      return { blockedUsers: next };
    });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
  isBlocked: (id) => get().blockedUsers.has(id),
  getUserName: (id) => get().blockedUsers.get(id),
}));
