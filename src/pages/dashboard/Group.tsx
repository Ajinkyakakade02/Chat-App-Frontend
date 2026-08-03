// @ts-nocheck
import { Box, Stack, Typography, IconButton, Divider, Collapse, Button } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, Users, ChatCircleDots } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';
import { SimpleBarStyle } from '../../components/Scrollbar';
import '../../css/global.css';
import { GROUP_LIST } from '../../data';
import ChatElement from '../../components/ChatElement';

const Group = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [expandedGroup, setExpandedGroup] = useState(null);

  const toggleGroup = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const openGroupChat = (groupId) => {
    navigate(`/chat/${groupId}`);
  };

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const currentUserName = currentUser.fullName || currentUser.username || 'You';
  const currentUserAvatar = currentUser.avatar || `https://i.pravatar.cc/150?u=you`;

  // Add "You" as the first member for each group
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
      ...group.members.filter((m) => m.id !== (currentUser.id || 'you')), // avoid duplicate
    ],
  }));

  return (
    <Stack direction="row" sx={{ width: '100%' }}>
      {/* Left sidebar */}
      <Box
        sx={{
          height: '100vh',
          width: 320,
          backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
          boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
        }}
      >
        <Stack p={3} spacing={2} sx={{ height: '100vh' }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={() => navigate('/app')}>
              <CaretLeft size={24} color="#4B4B4B" />
            </IconButton>
            <Typography variant="h5">Groups</Typography>
          </Stack>

          <Divider />

          {/* Scrollable group list */}
          <Stack className="scrollbar" spacing={3} sx={{ flexGrow: 1, overflowY: 'scroll' }}>
            <SimpleBarStyle timeout={500} clickOnTrack={false}>
              <Stack spacing={2}>
                {groupsWithYou.map((group) => (
                  <Box key={group.id}>
                    {/* Group header – click to expand/collapse, or use buttons */}
                    <Box
                      onClick={() => toggleGroup(group.id)}
                      sx={{ cursor: 'pointer' }}
                    >
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

                    {/* Buttons to open chat or view members */}
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

                    {/* Expandable member list */}
                    <Collapse in={expandedGroup === group.id} timeout="auto" unmountOnExit>
                      <Stack spacing={1} sx={{ pl: 4, pt: 1, pb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Members
                        </Typography>
                        {group.members.map((member) => (
                          <Box
                            key={member.id}
                            onClick={() => {
                              // Don't navigate if it's "You"
                              if (member.id !== 'you') {
                                navigate(`/chat/${member.id}`);
                              }
                            }}
                            sx={{ cursor: member.id === 'you' ? 'default' : 'pointer' }}
                          >
                            <ChatElement
                              id={member.id}
                              name={member.name}
                              img={member.img}
                              msg={member.msg}
                              time={member.time}
                              unread={member.unread}
                              online={member.online}
                              pinned={false}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </Collapse>
                  </Box>
                ))}
              </Stack>
            </SimpleBarStyle>
          </Stack>

          <Box mt={2} />
        </Stack>
      </Box>
    </Stack>
  );
};

export default Group;