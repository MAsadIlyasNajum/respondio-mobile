interface ColorTokens {
  background: string;
  surface: string;
  primary: string;
  text: string;
  secondaryText: string;
  border: string;
  error: string;
  success: string;
  messageOutgoing: string;
  messageIncoming: string;
  messageOutgoingText: string;
  messageIncomingText: string;
  onPrimary: string;
  onError: string;
}

export const lightColors: ColorTokens = {
  background: '#FFFFFF',
  surface: '#F5F7FA',
  primary: '#208AEF',
  text: '#1A1A2E',
  secondaryText: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  messageOutgoing: '#208AEF',
  messageIncoming: '#F3F4F6',
  messageOutgoingText: '#FFFFFF',
  messageIncomingText: '#1A1A2E',
  onPrimary: '#FFFFFF',
  onError: '#FFFFFF',
};

export const darkColors: ColorTokens = {
  background: '#0F1115',
  surface: '#1A1D24',
  primary: '#4DA3FF',
  text: '#F2F4F7',
  secondaryText: '#9AA3B2',
  border: '#2A2F3A',
  error: '#F87171',
  success: '#34D399',
  messageOutgoing: '#4DA3FF',
  messageIncoming: '#222632',
  messageOutgoingText: '#0F1115',
  messageIncomingText: '#F2F4F7',
  onPrimary: '#0F1115',
  onError: '#0F1115',
};

export const colors = lightColors;
export type ColorToken = keyof ColorTokens;
