// @ts-nocheck
import { Box, Collapse, Divider, IconButton, Stack, Switch, Typography } from '@mui/material'
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CaretLeft, Image, Info, Key, Keyboard, Lock, Note
} from 'phosphor-react';
import Shortcuts from '../../sections/settings/Shortcuts';
import SettingDirection from '../../components/settings/drawer/SettingDirection';
import SettingFullscreen from '../../components/settings/drawer/SettingFullscreen';
import SettingColorPresets from '../../components/settings/drawer/SettingColorPresets';
import useSettings from '../../hooks/useSettings';

const Settings = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode, onToggleMode } = useSettings();

  const [openShortcuts, setOpenShortcuts] = useState(false);
  const [showWallpaperSettings, setShowWallpaperSettings] = useState(false);

  const handleOpenShortcuts = () => setOpenShortcuts(true);
  const handleCloseShortcuts = () => setOpenShortcuts(false);

  const mainList = [
    { key: 0, icon: <Bell size={20} />, title: 'Notifications', onclick: () => {} },
    { key: 1, icon: <Lock size={20} />, title: 'Privacy', onclick: () => {} },
    { key: 2, icon: <Key size={20} />, title: 'Security', onclick: () => {} },
    {
      key: 4,
      icon: <Image size={20} />,
      title: 'Chat Wallpaper',
      onclick: () => setShowWallpaperSettings(!showWallpaperSettings),
    },
    { key: 5, icon: <Note size={20} />, title: 'Request Account Info', onclick: () => {} },
    { key: 6, icon: <Keyboard size={20} />, title: 'Keyboard Shortcuts', onclick: handleOpenShortcuts },
    { key: 7, icon: <Info size={20} />, title: 'Help', onclick: () => {} },
  ];

  return (
    <>
      <Stack direction="row" sx={{ width: '100%' }}>
        {/* Left panel */}
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
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={3}>
              <IconButton onClick={() => navigate(-1)}>
                <CaretLeft size={24} color="#4B4B4B" />
              </IconButton>
              <Typography variant="h6">Settings</Typography>
            </Stack>

            {/* Dark Mode Toggle */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">Dark Mode</Typography>
              <Switch checked={themeMode === 'dark'} onChange={onToggleMode} color="primary" />
            </Stack>

            <Divider />

            {/* Settings list */}
            <Stack spacing={4}>
              {mainList.map(({ key, icon, title, onclick }) => (
                <React.Fragment key={key}>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ cursor: 'pointer' }}
                      onClick={onclick}
                    >
                      {icon}
                      <Typography variant="body2">{title}</Typography>
                    </Stack>

                    {/* Expandable Chat Wallpaper settings */}
                    {key === 4 && (
                      <Collapse in={showWallpaperSettings} timeout="auto" unmountOnExit>
                        <Stack spacing={2} sx={{ pl: 4, pt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Advanced appearance settings
                          </Typography>
                          <SettingDirection />
                          <SettingColorPresets />
                          <SettingFullscreen />
                        </Stack>
                      </Collapse>
                    )}

                    {key !== 7 && <Divider />}
                  </Stack>
                </React.Fragment>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Stack>

      {openShortcuts && <Shortcuts open={openShortcuts} handleClose={handleCloseShortcuts} />}
    </>
  );
};

export default Settings;