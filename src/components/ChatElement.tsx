// @ts-nocheck
import { Avatar, Badge, Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StyledBadge from './StyledBadge';

const ChatElement = ({ id, name, img, msg, time, online, unread }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 3,
        background: 'transparent',
        transition: 'background 0.2s, box-shadow 0.2s',
        '&:hover': {
          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
          boxShadow: theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          {online ? (
            <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
              <Avatar src={img} sx={{ width: 48, height: 48, borderRadius: 2 }}>
                {name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </StyledBadge>
          ) : (
            <Avatar src={img} sx={{ width: 48, height: 48, borderRadius: 2 }}>
              {name?.charAt(0)?.toUpperCase()}
            </Avatar>
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption" noWrap sx={{ maxWidth: 160 }}>{msg}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={0.8} alignItems="center">
          <Typography variant="caption">{time}</Typography>
          {unread > 0 && (
            <Badge badgeContent={unread} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 18, height: 18 } }} />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElement;