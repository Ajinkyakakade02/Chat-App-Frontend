import React, { createContext, useContext, useState, useCallback } from 'react';

const UnreadContext = createContext();

export const useUnread = () => useContext(UnreadContext);

export const UnreadProvider = ({ children }) => {
  const [unreadCounts, setUnreadCounts] = useState({});

  const incrementUnread = useCallback((chatId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [chatId]: (prev[chatId] || 0) + 1,
    }));
  }, []);

  const resetUnread = useCallback((chatId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [chatId]: 0,
    }));
  }, []);

  return (
    <UnreadContext.Provider value={{ unreadCounts, incrementUnread, resetUnread }}>
      {children}
    </UnreadContext.Provider>
  );
};