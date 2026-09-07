import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

export const useAppForegroundRefetch = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let previousStatus: AppStateStatus = AppState.currentState;

    const subscription = AppState.addEventListener('change', (nextStatus) => {
      if (previousStatus === 'background' || previousStatus === 'inactive') {
        if (nextStatus === 'active') {
          queryClient.refetchQueries({ type: 'active' });
        }
      }
      previousStatus = nextStatus;
    });

    return () => {
      subscription.remove();
    };
  }, [queryClient]);
};
