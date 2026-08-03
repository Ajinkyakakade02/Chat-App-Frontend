// @ts-nocheck
import { Avatar, Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Bell, CaretRight, Phone, Prohibit, Star, Trash, VideoCamera, X } from 'phosphor-react';
import { useDispatch } from 'react-redux';
import { ToggleSidebar, UpdateSidebarType } from '../redux/slices/app';
import { faker } from '@faker-js/faker';
import AntSwitch from './AntSwitch';

const getAvatar = (seed) => `https://i.pravatar.cc/150?u=${seed}`;

const Contact = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        width: 320, height: '100vh',
        backdropFilter: 'blur(24px)',
        background: theme.palette.mode === 'dark' ? 'rgba(10,11,15,0.85)' : 'rgba(255,255,255,0.8)',
        borderLeft: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack sx={{ height: '100%' }}>
        <Box p={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton onClick={() => dispatch(ToggleSidebar())}><X /></IconButton>
          </Stack>
        </Box>

        <Box className="scrollbar" sx={{ flexGrow: 1, overflowY: 'scroll', px: 2 }}>
          <Stack spacing={3} alignItems="center">
            <Avatar src={getAvatar(400)} sx={{ width: 80, height: 80, borderRadius: 3 }} />
            <Typography variant="h6">{faker.name.fullName()}</Typography>
            <Typography variant="body2">+94 713725452</Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <IconButton><Phone /></IconButton>
              <IconButton><VideoCamera /></IconButton>
            </Stack>

            <Divider />

            <Typography variant="subtitle2">About</Typography>
            <Typography variant="body2">Hi, I'm working on a project.</Typography>

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">Media, Links & Docs</Typography>
              <IconButton onClick={() => dispatch(UpdateSidebarType('SHARED'))}>
                <CaretRight />
              </IconButton>
            </Stack>

            <Stack direction="row" spacing={1}>
              {[1,2,3].map((_, idx) => (
                <Box key={idx} sx={{ width: 80, height: 80, borderRadius: 2, overflow: 'hidden' }}>
                  <img src={faker.image.food()} alt="food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2}>
                <Star size={20} />
                <Typography variant="subtitle2">Starred Messages</Typography>
              </Stack>
              <IconButton onClick={() => dispatch(UpdateSidebarType('STARRED'))}><CaretRight /></IconButton>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2}>
                <Bell size={20} />
                <Typography variant="subtitle2">Mute Notifications</Typography>
              </Stack>
              <AntSwitch />
            </Stack>
          </Stack>
        </Box>

        <Box p={2} borderTop={`1px solid ${theme.palette.divider}`}>
          <Stack direction="row" spacing={2}>
            <IconButton><Prohibit /></IconButton>
            <IconButton><Trash /></IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Contact;