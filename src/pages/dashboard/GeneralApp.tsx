// @ts-nocheck
import React from "react";
import Chats from "./Chats";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import Contact from "../../components/Contact";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";
import { ChatCircle } from "phosphor-react";

const GeneralApp = () => {
  const theme = useTheme();
  const { sidebar } = useSelector((store) => store.app);

  return (
    <Stack direction='row' sx={{ width: '100%' }}>
      {/* Left sidebar + chat list */}
      <Chats />

      {/* Middle / Right area */}
      <Box
        sx={{
          height: '100%',
          flexGrow: 1,
          backgroundColor: theme.palette.mode === 'light' ? '#F0F4FA' : theme.palette.background.default,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Empty state message – no conversation yet */}
        <Stack spacing={2} alignItems="center" sx={{ opacity: 0.6 }}>
          <ChatCircle size={64} color={theme.palette.text.secondary} />
          <Typography variant="h6" color="text.secondary">
            Select a conversation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a chat from the list to start messaging
          </Typography>
        </Stack>
      </Box>

      {/* Right sidebar (Contact/Shared/Starred) */}
      {sidebar.open && (() => {
        switch (sidebar.type) {
          case 'CONTACT':
            return <Contact key="contact" />;
          case 'STARRED':
            return <StarredMessages key="starred" />;
          case 'SHARED':
            return <SharedMessages key="shared" />;
          default:
            return null;
        }
      })()}
    </Stack>
  );
};

export default GeneralApp;