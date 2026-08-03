// @ts-nocheck
import { Avatar, Box, Button, Divider, IconButton, Stack, TextField, Typography } from '@mui/material';
import {
  Camera,
  CheckCircle,
  PencilSimple,
  ArrowLeft,
  Bell,
  Lock,
  Key,
  Image,
  Keyboard,
  Question,
} from 'phosphor-react';
import { useTheme } from '@mui/material/styles';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : {};
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    about: user?.about || '',
    avatar: user?.avatar || '',
  });
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedUser({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      about: user?.about || '',
      avatar: user?.avatar || '',
    });
  }, [user]);

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
        setEditedUser(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const api = (await import('../../services/api')).default;
      const updatedUser = await api.updateProfile(user.id, {
        fullName: editedUser.fullName,
        email: editedUser.email,
        phoneNumber: editedUser.phone,
        about: editedUser.about,
        avatar: editedUser.avatar,
      });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setPreviewAvatar(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      about: user?.about || '',
      avatar: user?.avatar || '',
    });
    setIsEditing(false);
    setPreviewAvatar(null);
  };

  const displayName = user?.fullName || user?.username || 'Unknown';

  // ✅ Always use a letter avatar based on the current name
  const avatarSrc = previewAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8B5CF6&color=fff&size=200`;

  return (
    <Stack direction="row" sx={{ width: '100%' }}>
      <Box
        className="scrollbar"
        sx={{
          overflow: 'scroll',
          height: '100vh',
          width: 320,
          backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
          boxShadow: '0px 0px 2px rgba(0)',
        }}
      >
        <Stack p={4} spacing={5}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowLeft size={24} color="#4B4B4B" />
            </IconButton>
            <Typography variant="h6">Profile</Typography>
          </Stack>

          <Stack direction="row" spacing={3} alignItems="center">
            <Box
              onClick={handleAvatarClick}
              sx={{
                position: 'relative',
                cursor: isEditing ? 'pointer' : 'default',
                width: 56,
                height: 56,
                borderRadius: '50%',
                overflow: 'hidden',
                '&:hover .avatar-overlay': {
                  opacity: isEditing ? 1 : 0,
                },
              }}
            >
              <Avatar src={avatarSrc} sx={{ width: 56, height: 56 }}>
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              {isEditing && (
                <Box
                  className="avatar-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <Camera size={20} color="#fff" />
                </Box>
              )}
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Stack spacing={0.5}>
              <Typography variant="article">{displayName}</Typography>
              <Typography variant="body2">{user?.about || 'Hey there! I am using Chat App'}</Typography>
            </Stack>
          </Stack>

          {!isEditing ? (
            <Button
              startIcon={<PencilSimple />}
              onClick={() => setIsEditing(true)}
              variant="outlined"
              sx={{ borderRadius: 2, alignSelf: 'flex-start' }}
            >
              Edit Profile
            </Button>
          ) : (
            <Stack spacing={2} sx={{ width: '100%' }}>
              <TextField
                label="Name"
                fullWidth
                value={editedUser.fullName}
                onChange={(e) => setEditedUser(prev => ({ ...prev, fullName: e.target.value }))}
                size="small"
              />
              <TextField
                label="Phone"
                fullWidth
                value={editedUser.phone}
                onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                size="small"
              />
              <TextField
                label="Email"
                fullWidth
                value={editedUser.email}
                onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                size="small"
              />
              <TextField
                label="About"
                fullWidth
                multiline
                rows={3}
                value={editedUser.about}
                onChange={(e) => setEditedUser(prev => ({ ...prev, about: e.target.value }))}
                size="small"
              />
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={handleCancel} sx={{ borderRadius: 2 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  startIcon={<CheckCircle />}
                  sx={{ borderRadius: 2 }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </Stack>
            </Stack>
          )}

          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Settings
            </Typography>
            {[
              { label: 'Notifications', icon: <Bell size={20} />, path: '/settings' },
              { label: 'Privacy', icon: <Lock size={20} />, path: '/settings' },
              { label: 'Security', icon: <Key size={20} />, path: '/settings' },
              { label: 'Chat Wallpaper', icon: <Image size={20} />, path: '/settings' },
              { label: 'Keyboard Shortcuts', icon: <Keyboard size={20} />, path: '/settings' },
              { label: 'Help', icon: <Question size={20} />, path: '/settings' },
            ].map((item, idx) => (
              <Stack
                key={idx}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => navigate(item.path)}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {item.icon}
                  <Typography variant="body2">{item.label}</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">›</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Profile;