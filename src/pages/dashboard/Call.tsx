// @ts-nocheck
import { Box, Stack, Typography, IconButton } from '@mui/material';
import { Phone, CaretLeft } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Call = () => {
  const theme = useTheme();
  const navigate = useNavigate();

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
            <Typography variant="h5">Calls</Typography>
          </Stack>

          {/* Placeholder */}
          <Stack
            sx={{ flexGrow: 1 }}
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Phone size={48} color={theme.palette.text.secondary} opacity={0.4} />
            <Typography variant="body2" color="text.secondary">
              No call history yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Your recent calls will appear here
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Right panel – empty for now */}
    </Stack>
  );
};

export default Call;