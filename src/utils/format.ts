export const formatMessageTime = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};
