// @ts-nocheck
import { Box, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import SideBar from './dashboard/SideBar';
import Chats from '../pages/dashboard/Chats';
import Conversation from '../components/Conversation';
import { FALLBACK_CHATS, GROUP_LIST } from '../data';
import api from '../services/api';

const getRoomId = (userId1, userId2) => {
  if (!userId1 || !userId2) return null;
  return [userId1, userId2].sort().join('-');
};

const ChatLayout = () => {
  const { chatId } = useParams();
  const [selectedChat, setSelectedChat] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?.id;

  const roomId = useMemo(() => {
    if (!chatId || !currentUserId) return null;
    return getRoomId(currentUserId, chatId);
  }, [chatId, currentUserId]);

  useEffect(() => {
    const fetchChat = async () => {
      if (!chatId) {
        setSelectedChat(null);
        return;
      }

      const allChats = [...FALLBACK_CHATS, ...GROUP_LIST];
      let found = allChats.find(c => c.id === chatId);
      if (found) {
        setSelectedChat(found);
        return;
      }

      try {
        const user = await api.getUserById(chatId);
        // Force Nova AI to use the app logo (inline SVG)
        const avatar =
          user.id === 'local-1'
            ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" rx="20" fill="%235B5FE3"/%3E%3Ctext x="50" y="70" font-size="60" text-anchor="middle" fill="white" font-weight="bold"%3EN%3C/text%3E%3C/svg%3E'
            : user.avatar || `https://i.pravatar.cc/150?u=${user.id}`;
        setSelectedChat({
          id: user.id,
          name: user.fullName || user.username,
          img: avatar,
          online: user.status === 'ONLINE',
        });
      } catch {
        setSelectedChat({ id: chatId, name: 'Unknown', img: '' });
      }
    };
    fetchChat();
  }, [chatId]);

  if (!selectedChat || !roomId) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Loading…</Typography>
      </Box>
    );
  }

  return (
    <Stack direction="row" sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <SideBar />
      <Chats key={currentUser?.id} />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Conversation chatData={selectedChat} roomId={roomId} />
      </Box>
    </Stack>
  );
};

export default ChatLayout;