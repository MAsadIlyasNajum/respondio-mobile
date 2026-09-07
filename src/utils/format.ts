export const formatMessageTime = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

export const formatMessageDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  if (date >= startOfToday) {
    return 'Today';
  }

  if (date >= startOfYesterday) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatConversationTime = (isoString?: string): string => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  if (date >= startOfToday) {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }

  if (date >= startOfYesterday) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date);
};
