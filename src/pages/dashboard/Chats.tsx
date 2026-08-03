// @ts-nocheck
import { Box, IconButton, Stack, Typography, Button, Divider, Tabs, Tab, Collapse } from '@mui/material';
import { CircleDashed, MagnifyingGlass, Users, ChatCircleDots } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import ChatElement from '../../components/ChatElement';
import api from '../../services/api';
import { GROUP_LIST } from '../../data';

const NOVA_CHAT = {
  id: 'local-1',
  name: 'Nova AI',
  img: '/favicon.ico',
  msg: 'Ready to chat? 😊',
  time: '',
  unread: 0,
  pinned: true,
  online: true,
};

const Chats = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { chatId: selectedChatId } = useParams();
  const [chatList, setChatList] = useState([NOVA_CHAT]);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroup, setExpandedGroup] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.getAllUsers();
        const currentUser = JSON.parse(localStorage.getItem('user'));
        let filtered = (res || [])
          .filter(u => u.id !== currentUser?.id)
          .map(u => ({
            id: u.id,
            name: u.fullName || u.username,
            img: u.avatar || `https://i.pravatar.cc/150?u=${u.id}`,
            msg: '',
            time: '',
            unread: 0,
            pinned: false,
            online: u.status === 'ONLINE',
          }));

        const novaIndex = filtered.findIndex(u => u.id === 'local-1');
        if (novaIndex >= 0) {
          filtered[novaIndex] = { ...NOVA_CHAT };
        } else {
          filtered.unshift(NOVA_CHAT);
        }

        filtered = filtered.filter(u => u.id === 'local-1')
                  .concat(filtered.filter(u => u.id !== 'local-1'));

        setChatList(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const openChat = (chatId) => navigate(`/chat/${chatId}`);
  const openGroupChat = (groupId) => navigate(`/chat/${groupId}`);
  const toggleGroup = (groupId) => setExpandedGroup(expandedGroup === groupId ? null : groupId);

  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const currentUserName = currentUser.fullName || currentUser.username || 'You';
  const currentUserAvatar = currentUser.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=8B5CF6&color=fff&size=200`;

  const groupsWithYou = GROUP_LIST.map((group) => ({
    ...group,
    members: [
      {
        id: currentUser.id || 'you',
        name: currentUserName,
        img: currentUserAvatar,
        msg: '',
        time: '',
        unread: 0,
        online: true,
      },
      ...group.members.filter((m) => m.id !== (currentUser.id || 'you')),
    ],
  }));

  const allChats = chatList;
  const unreadChats = chatList.filter(el => el.unread > 0);
  const groups = groupsWithYou;
  const archivedChats = [];

  const getCurrentList = () => {
    switch (tabValue) {
      case 0: return allChats;
      case 1: return groups;
      case 2: return archivedChats;
      case 3: return unreadChats;
      default: return allChats;
    }
  };

  const filteredList = getCurrentList().filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.msg && item.msg.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box sx={{
      position: "relative", width: 320,
      background: theme.palette.mode === 'dark' ? 'rgba(10,11,15,0.7)' : 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(24px)',
      borderRight: `1px solid ${theme.palette.divider}`,
    }}>
      <Stack p={2.5} spacing={2} sx={{ height: "100vh" }}>
        <Stack direction="row" alignItems='center' justifyContent='space-between'>
          <Typography variant='h5'>Chats</Typography>
          <IconButton><CircleDashed /></IconButton>
        </Stack>

        <Search>
          <SearchIconWrapper>
            <MagnifyingGlass color="#709CE6" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => { setTabValue(newValue); setSearchQuery(''); }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ minHeight: 36, '& .MuiTab-root': { minWidth: 'auto', px: 1.5 } }}
        >
          <Tab label="All Chats" />
          <Tab label="Groups" />
          <Tab label="Archived" />
          <Tab label="Unread" />
        </Tabs>

        <Divider />

        <Stack className='scrollbar' spacing={1} direction='column' sx={{ flexGrow: 1, overflow: 'scroll' }}>
          {tabValue !== 1 ? (
            filteredList.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                No chats yet
              </Typography>
            ) : (
              filteredList.map(item => (
                <Box
                  key={item.id}
                  onClick={() => openChat(item.id)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedChatId === item.id ? 'action.selected' : 'transparent',
                    borderRadius: 2,
                  }}
                >
                  <ChatElement {...item} />
                </Box>
              ))
            )
          ) : (
            filteredList.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                No groups yet
              </Typography>
            ) : (
              filteredList.map((group) => (
                <Box key={group.id}>
                  <Box onClick={() => toggleGroup(group.id)} sx={{ cursor: 'pointer' }}>
                    <ChatElement
                      id={group.id}
                      name={group.name}
                      img={group.img}
                      msg={group.msg}
                      time={group.time}
                      unread={group.unread}
                      online={group.online}
                      pinned={group.pinned}
                    />
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ px: 1, mt: 0.5 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ChatCircleDots />}
                      onClick={(e) => { e.stopPropagation(); openGroupChat(group.id); }}
                      fullWidth
                    >
                      Open Chat
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Users />}
                      onClick={(e) => { e.stopPropagation(); toggleGroup(group.id); }}
                      fullWidth
                    >
                      Members
                    </Button>
                  </Stack>

                  <Collapse in={expandedGroup === group.id} timeout="auto" unmountOnExit>
                    <Stack spacing={1} sx={{ pl: 4, pt: 1, pb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Members
                      </Typography>
                      {group.members.map((member) => (
                        <Box
                          key={member.id}
                          onClick={() => { if (member.id !== 'you') openChat(member.id); }}
                          sx={{ cursor: member.id === 'you' ? 'default' : 'pointer' }}
                        >
                          <ChatElement {...member} />
                        </Box>
                      ))}
                    </Stack>
                  </Collapse>
                </Box>
              ))
            )
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Chats;
