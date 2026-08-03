// @ts-nocheck
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
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
  X,
} from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: 16,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.02)",
    backdropFilter: "blur(12px)",
    border: `1px solid ${theme.palette.divider}`,
    padding: "4px 0",
  },
  "& .MuiInputBase-input": {
    padding: "10px 0",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiInputAdornment-root": {
    marginTop: "0 !important",
    alignSelf: "center",
  },
}));

const Actions = [
  { color: "#4ddbfe", icon: <Image size={24} />, title: "Photo/Video" },
  { color: "#4ddbfe", icon: <Sticker size={24} />, title: "Stickers" },
  { color: "#4ddbfe", icon: <Camera size={24} />, title: "Image" },
  { color: "#4ddbfe", icon: <File size={24} />, title: "Document" },
  { color: "#4ddbfe", icon: <User size={24} />, title: "Contact" },
];

const ChatInput = ({
  openPicker,
  setOpenPicker,
  message,
  setMessage,
  onSendMessage,
}) => {
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (onSendMessage) {
        onSendMessage();
      }
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
        onKeyDown={handleKeyDown}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                onClick={() => setOpenActions(!openActions)}
              >
                <LinkSimple size={28} />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setOpenPicker(!openPicker)}>
                <Smiley size={28} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {openActions && (
        <Box
          sx={{
            position: "absolute",
            bottom: 70,
            left: 10,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            zIndex: 10,
          }}
        >
          {Actions.map((el, idx) => (
            <Tooltip key={idx} placement="right" title={el.title}>
              <IconButton
                onClick={handleAttachmentClick}
                sx={{ backgroundColor: el.color, "&:hover": { opacity: 0.8 } }}
              >
                {el.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      )}
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

const Footer = ({ pickerRight = 100, onSend, replyTo, onCancelReply }) => {
  const theme = useTheme();
  const [openPicker, setOpenPicker] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmojiSelect = (emoji) => setMessage((prev) => prev + emoji.native);

  const handleSend = () => {
    if (message.trim() === "") return;
    if (onSend) {
      onSend(message);
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
          backgroundColor:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.7)"
              : "rgba(10,11,15,0.8)",
          backdropFilter: "blur(24px)",
          borderTop: `1px solid ${theme.palette.divider}`,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        {replyTo && (
          <Box
            sx={{
              px: 2,
              pb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
              Replying to: {replyTo}
            </Typography>
            <IconButton size="small" onClick={() => onCancelReply && onCancelReply()}>
              <X size={16} />
            </IconButton>
          </Box>
        )}

        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack sx={{ flex: 1 }}>
            {openPicker && (
              <Box
                sx={{
                  position: "fixed",
                  bottom: 80,
                  right: pickerRight,
                  zIndex: 10,
                }}
              >
                <Picker
                  theme={theme.palette.mode}
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                />
              </Box>
            )}
            <ChatInput
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              message={message}
              setMessage={setMessage}
              onSendMessage={handleSend}
            />
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
              boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
              transition: "0.2s",
              "&:hover": {
                boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton onClick={handleSend} sx={{ color: "#fff" }}>
              <PaperPlaneTilt />
            </IconButton>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;