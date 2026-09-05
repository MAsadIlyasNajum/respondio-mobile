import type { User } from '@/types/User';

export interface UseProfileResult {
  user: User | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export interface ProfileScreenProps {
  userId: string;
}
