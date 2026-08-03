// @ts-nocheck
import {
  Avatar,
  Box,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowLeft, Phone, VideoCamera } from "phosphor-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isNova = userId === "local-1";   // special handling for Nova AI

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.getUserById(userId);
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary">User not found</Typography>
      </Box>
    );
  }

  const displayName = user.fullName || user.username || "Unknown";
  const avatarUrl =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=5B5FE3&color=fff&size=200`;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        background: theme.palette.background.default,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480, p: 3 }}>
        {/* Back button */}
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>

        <Stack spacing={4} alignItems="center" mt={4}>
          <Avatar src={avatarUrl} sx={{ width: 120, height: 120 }}>
            {displayName.charAt(0).toUpperCase()}
          </Avatar>

          <Stack spacing={1} alignItems="center">
            <Typography variant="h5" fontWeight={700}>
              {displayName}
            </Typography>
            {/* Show the tagline only for Nova AI */}
            {isNova ? (
              <Typography variant="body2" color="text.secondary">
                Your friendly chat companion ✨
              </Typography>
            ) : (
              user.about && (
                <Typography variant="body2" color="text.secondary">
                  {user.about}
                </Typography>
              )
            )}
          </Stack>

          {/* Action buttons – hidden for Nova AI */}
          {!isNova && (
            <Stack direction="row" spacing={3}>
              <IconButton sx={{ bgcolor: "action.hover", p: 2 }}>
                <Phone size={24} />
              </IconButton>
              <IconButton sx={{ bgcolor: "action.hover", p: 2 }}>
                <VideoCamera size={24} />
              </IconButton>
            </Stack>
          )}

          {/* Contact info – hidden for Nova AI */}
          {!isNova && (
            <Box
              sx={{
                width: "100%",
                bgcolor: theme.palette.background.paper,
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" mb={2}>
                Contact Information
              </Typography>
              <Stack spacing={2}>
                {user.phoneNumber && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone size={18} color={theme.palette.text.secondary} />
                    <Typography variant="body2">{user.phoneNumber}</Typography>
                  </Stack>
                )}
                {user.email && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">{user.email}</Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default UserProfile;