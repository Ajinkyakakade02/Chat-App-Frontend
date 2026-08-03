// @ts-nocheck
import { useState } from 'react';
import {
  Avatar, Box, IconButton, Stack, Typography, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  MagnifyingGlass, Phone, VideoCamera, X,
  DotsThreeVertical, User, Image, Palette, Trash
} from 'phosphor-react';
import StyledBadge from './StyledBadge';
import { useDispatch } from 'react-redux';
import { ToggleSidebar, UpdateSidebarType } from '../redux/slices/app';
import { useNavigate } from 'react-router-dom';

const ConversationHeader = ({ chatData, onSearchClick, isSearching, onClearChat }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const name = chatData?.name || 'Unknown';
  const online = chatData?.online || false;
  const img = chatData?.img ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8B5CF6&color=fff&size=200`;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    // Navigate to the user's profile page
    navigate(`/user/${chatData.id}`);
    handleMenuClose();
  };

  const handleSharedMedia = () => {
    dispatch(ToggleSidebar());
    dispatch(UpdateSidebarType('SHARED'));
    handleMenuClose();
  };

  const handleChatTheme = () => {
    navigate('/settings');
    handleMenuClose();
  };

  const handleClearChat = () => {
    if (onClearChat) {
      onClearChat();
    }
    handleMenuClose();
  };

  return (
    <Box
      p={1.5}
      sx={{
        backdropFilter: 'blur(24px)',
        background: theme.palette.mode === 'dark' ? 'rgba(10,11,15,0.8)' : 'rgba(255,255,255,0.8)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} onClick={() => dispatch(ToggleSidebar())} sx={{ cursor: 'pointer' }}>
          <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
            <Avatar src={img} alt={name} sx={{ borderRadius: 2 }}>
              {name.charAt(0).toUpperCase()}
            </Avatar>
          </StyledBadge>
          <Stack spacing={0.2}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption" color={online ? 'success.main' : 'text.secondary'}>
              {online ? 'Online' : 'Offline'}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton><VideoCamera /></IconButton>
          <IconButton><Phone /></IconButton>
          <IconButton onClick={onSearchClick}>
            {isSearching ? <X /> : <MagnifyingGlass />}
          </IconButton>
          <IconButton onClick={handleMenuOpen}>
            <DotsThreeVertical />
          </IconButton>
        </Stack>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            backdropFilter: 'blur(12px)',
            background: 'rgba(30,30,40,0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon><User size={20} /></ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSharedMedia}>
          <ListItemIcon><Image size={20} /></ListItemIcon>
          <ListItemText>Media, Links, & Docs</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleChatTheme}>
          <ListItemIcon><Palette size={20} /></ListItemIcon>
          <ListItemText>Chat Theme</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClearChat}>
          <ListItemIcon><Trash size={20} color="red" /></ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Clear Chat</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ConversationHeader;