// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Avatar, Box, IconButton, Menu, MenuItem, Stack, Typography, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GearSix } from 'phosphor-react';
import { Nav_Buttons, Profile_Menu } from '../../data';
import { useNavigate } from 'react-router-dom';

const getPath = (index) => {
  switch (index) {
    case 0: return '/app';
    case 1: return '/group';
    case 2: return '/call';
    default: break;
  }
};

const getMenuPath = (index) => {
  switch (index) {
    case 0: return '/profile';
    case 1: return '/settings';
    case 2: return '/auth/login';
    default: break;
  }
};

const SideBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const displayName = user?.fullName || user?.username || 'User';
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <Box
      sx={{
        width: 72,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        backdropFilter: 'blur(24px)',
        background: theme.palette.mode === 'dark'
          ? 'rgba(10,11,15,0.85)'
          : 'rgba(255,255,255,0.8)',
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack spacing={2} alignItems="center">
        {/* Logo */}
        <Box sx={{ width: 48, height: 48, borderRadius: 2, overflow: 'hidden' }}>
          <img src="/favicon.ico" alt="ChatApp" style={{ width: '100%', objectFit: 'cover' }} />
        </Box>

        <Stack spacing={1}>
          {Nav_Buttons.map((el) => (
            <Tooltip key={el.index} title={['Chats','Groups','Calls'][el.index] || ''} placement="right">
              <IconButton
                onClick={() => { setSelected(el.index); navigate(getPath(el.index)); }}
                sx={{
                  color: selected === el.index ? theme.palette.primary.main : theme.palette.text.secondary,
                  bgcolor: selected === el.index ? `${theme.palette.primary.main}20` : 'transparent',
                  '&:hover': { bgcolor: `${theme.palette.primary.main}10` },
                  transition: '0.2s',
                }}
              >
                {el.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      </Stack>

      <Stack spacing={2} alignItems="center">
        <Avatar
          id="profile-button"
          sx={{
            cursor: 'pointer',
            width: 36,
            height: 36,
            bgcolor: theme.palette.primary.main,
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            transition: '0.2s',
            '&:hover': { boxShadow: 4 },
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          {firstLetter}
        </Avatar>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          PaperProps={{
            sx: { backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
          }}
        >
          {Profile_Menu.map((item, idx) => (
            <MenuItem key={idx} onClick={() => { navigate(getMenuPath(idx)); setAnchorEl(null); }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 120 }}>
                {item.icon}
                <Typography variant="body2">{item.title}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Box>
  );
};

export default SideBar;
