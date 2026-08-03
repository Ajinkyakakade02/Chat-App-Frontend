// @ts-nocheck
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'phosphor-react';
import Conversation from '../../components/Conversation';
import { FALLBACK_CHATS, GROUP_LIST } from '../../data';
import { userService } from '../../services/api';

const ChatView = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chatData, setChatData] = useState(null);

  useEffect(() => {
    const fetchChat = async () => {
      // Check in demo chats first
      const allChats = [...FALLBACK_CHATS, ...GROUP_LIST];
      let found = allChats.find(c => c.id === chatId);
      if (found) {
        setChatData(found);
        return;
      }
      // Try backend
      try {
        const res = await userService.getUserById(chatId);
        const user = res.data;
        setChatData({
          id: user.id,
          name: user.fullName || user.username,
          img: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
          online: user.status === 'ONLINE',
        });
      } catch {
        setChatData({ id: chatId, name: 'Unknown', img: '' });
      }
    };
    fetchChat();
  }, [chatId]);

  if (!chatData) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,                     // take all remaining space
      }}
    >
      {/* Back button to return to main chat list */}
      <Box sx={{ p: 1, display: { sm: 'none' } }}>
        <IconButton onClick={() => navigate('/app')}>
          <ArrowLeft size={24} />
        </IconButton>
      </Box>

      {/* Conversation (fills the rest) */}
      <Conversation chatData={chatData} />
    </Box>
  );
};

export default ChatView;