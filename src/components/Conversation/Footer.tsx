// @ts-nocheck
import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import React, { useState, useRef } from "react";
import {
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Camera,
  File,
  Image,
  Sticker,
  User,
} from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
  "& .MuiFilledInput-root": {
    borderRadius: 16,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' },
  },
}));

const Actions = [
  { color: "#4da5fe", icon: <Image size={24} />, y: 102, title: "Photo/Video" },
  { color: "#1b8cfe", icon: <Sticker size={24} />, y: 172, title: "Stickers" },
  { color: "#0172e4", icon: <Camera size={24} />, y: 242, title: "Image" },
  { color: "#0159b2", icon: <File size={24} />, y: 312, title: "Document" },
  { color: "#013f7f", icon: <User size={24} />, y: 382, title: "Contact" },
];

const ChatInput = ({ openPicker, setOpenPicker, message, setMessage }) => {
  const [openActions, setOpenActions] = useState(false);
  const fileInputRef = useRef(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
    setOpenActions(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Selected file: ${file.name}`);
      e.target.value = "";
    }
  };

  return (
    <>
      <StyledInput
        fullWidth
        placeholder="Type a message..."
        variant="filled"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <Stack sx={{ width: "max-content" }}>
              <Stack
                sx={{ position: "relative", display: openActions ? "inline-block" : "none" }}
              >
                {Actions.map((el, idx) => (
                  <Tooltip key={idx} placement="right" title={el.title}>
                    <Fab
                      onClick={handleAttachmentClick}
                      sx={{ position: "absolute", top: -el.y, backgroundColor: el.color }}
                      aria-label="add"
                    >
                      {el.icon}
                    </Fab>
                  </Tooltip>
                ))}
              </Stack>
              <InputAdornment position="start">
                <IconButton onClick={() => setOpenActions(!openActions)}>
                  <LinkSimple />
                </IconButton>
              </InputAdornment>
            </Stack>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setOpenPicker(!openPicker)}>
                <Smiley />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*,video/*,application/*,.doc,.docx,.pdf,.txt"
      />
    </>
  );
};

const Footer = ({ pickerRight = 100, onSend }) => {
  const theme = useTheme();
  const [openPicker, setOpenPicker] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmojiSelect = (emoji) => setMessage((prev) => prev + emoji.native);

  const handleSend = () => {
    if (message.trim() === "") return;
    if (onSend) {
      onSend(message);
    } else {
      alert(`Sending: ${message}`);
    }
    setMessage("");
    setOpenPicker(false);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        p={2}
        width="100%"
        sx={{
          backgroundColor: theme.palette.mode === "light" ? "rgba(255,255,255,0.7)" : "rgba(10,11,15,0.8)",
          backdropFilter: 'blur(24px)',
          borderTop: `1px solid ${theme.palette.divider}`,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack sx={{ width: "100%" }}>
            {openPicker && (
              <Box sx={{ position: 'fixed', bottom: 80, right: pickerRight, zIndex: 10 }}>
                <Picker theme={theme.palette.mode} data={data} onEmojiSelect={handleEmojiSelect} />
              </Box>
            )}
            <ChatInput openPicker={openPicker} setOpenPicker={setOpenPicker} message={message} setMessage={setMessage} />
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
              boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
              transition: '0.2s',
              '&:hover': {
                boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
              },
            }}
          >
            <Stack sx={{ height: '100%' }} alignItems="center" justifyContent="center">
              <IconButton onClick={handleSend}>
                <PaperPlaneTilt color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;