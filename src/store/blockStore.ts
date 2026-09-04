import { create } from 'zustand';

interface BlockStore {
  blockedIds: Set<string>;
  blockUser: (id: string) => void;
  unblockUser: (id: string) => void;
  isBlocked: (id: string) => boolean;
}

export const useBlockStore = create<BlockStore>((set, get) => ({
  blockedIds: new Set(),
  blockUser: (id) =>
    set((state) => {
      const next = new Set(state.blockedIds);
      next.add(id);
      return { blockedIds: next };
    }),
  unblockUser: (id) =>
    set((state) => {
      const next = new Set(state.blockedIds);
      next.delete(id);
      return { blockedIds: next };
    }),
  isBlocked: (id) => get().blockedIds.has(id),
}));
