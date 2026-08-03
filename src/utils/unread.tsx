const UNREAD_KEY = 'chat_unread_counts';

export const getUnreadCounts = () => {
  try {
    return JSON.parse(localStorage.getItem(UNREAD_KEY) || '{}');
  } catch {
    return {};
  }
};

// Use the chat partner's ID (chatData.id), not the room ID
export const incrementUnread = (partnerId) => {
  const counts = getUnreadCounts();
  counts[partnerId] = (counts[partnerId] || 0) + 1;
  localStorage.setItem(UNREAD_KEY, JSON.stringify(counts));
  window.dispatchEvent(new CustomEvent('unread-updated', { detail: counts }));
};

export const clearUnread = (partnerId) => {
  const counts = getUnreadCounts();
  delete counts[partnerId];
  localStorage.setItem(UNREAD_KEY, JSON.stringify(counts));
  window.dispatchEvent(new CustomEvent('unread-updated', { detail: counts }));
};