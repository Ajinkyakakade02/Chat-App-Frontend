// @ts-nocheck
import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  Menu,
  MenuItem,
  Popover,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DotsThreeVertical,
  DownloadSimple,
  Image,
  Star,
} from "phosphor-react";
import React, { useState } from "react";

// Quick reaction emojis
const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

// Helper to get the sent‑bubble style (dynamic primary colour)
const useSentBubbleStyle = (theme) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
});

// Parse a message that might be a reply (starts with "↳ ")
const parseReply = (message) => {
  if (message?.startsWith("↳ ")) {
    const parts = message.split("\n");
    const replyText = parts[0].replace("↳ ", "");
    const newText = parts.slice(1).join("\n");
    return { isReply: true, replyText, newText };
  }
  return { isReply: false, newText: message };
};

// ----------------------------------------------------------------------
// Message type components

const DocMsg = ({ el, menu, onReply, onReact, onStar, onDelete, onForward, isStarred, reactions }) => {
  const theme = useTheme();
  const sentStyle = useSentBubbleStyle(theme);
  const { isReply, replyText, newText } = parseReply(el.message);

  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"} alignItems="flex-start">
      {menu && (
        <MessageOptions
          el={el}
          onReply={onReply}
          onReact={onReact}
          onStar={onStar}
          onDelete={onDelete}
          onForward={onForward}
          isStarred={isStarred}
        />
      )}
      <Box sx={{ maxWidth: "75%" }}>
        <Box
          p={1.5}
          sx={{
            background: el.incoming
              ? "rgba(255,255,255,0.06)"
              : sentStyle.background,
            borderRadius: el.incoming
              ? "16px 16px 16px 4px"
              : "16px 16px 4px 16px",
            boxShadow: el.incoming ? "none" : sentStyle.boxShadow,
            wordWrap: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {el.incoming && el.sender && (
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {el.sender}
            </Typography>
          )}
          {isReply && (
            <Box
              sx={{
                borderLeft: "3px solid",
                borderColor: "primary.main",
                pl: 1,
                mb: 0.5,
                opacity: 0.8,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {replyText}
              </Typography>
            </Box>
          )}
          <Stack spacing={2}>
            <Stack p={2} spacing={3} direction="row" alignItems="center"
              sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
              <Image size={48} />
              <Typography variant="caption">Abstract.png</Typography>
              <IconButton>
                <DownloadSimple />
              </IconButton>
            </Stack>
            {newText ? (
              <Typography variant="body2" sx={{ color: el.incoming ? theme.palette.text.primary : "#fff" }}>
                {newText}
              </Typography>
            ) : null}
          </Stack>
        </Box>
        {/* Reactions */}
        {reactions && reactions.length > 0 && (
          <Stack direction="row" spacing={0.5} mt={0.5} ml={1}>
            {reactions.map((r, i) => (
              <Box key={i} sx={{ bgcolor: "rgba(255,255,255,0.1)", px: 1, py: 0.3, borderRadius: 1, fontSize: 12 }}>
                {r.emoji}
              </Box>
            ))}
          </Stack>
        )}
        {/* Star indicator */}
        {isStarred && (
          <Box sx={{ ml: 1, mt: 0.5 }}>
            <Star size={12} weight="fill" color="gold" />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

const LinkMsg = ({ el, menu, onReply, onReact, onStar, onDelete, onForward, isStarred, reactions }) => {
  const theme = useTheme();
  const sentStyle = useSentBubbleStyle(theme);
  const { isReply, replyText, newText } = parseReply(el.message);

  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"} alignItems="flex-start">
      {menu && (
        <MessageOptions
          el={el}
          onReply={onReply}
          onReact={onReact}
          onStar={onStar}
          onDelete={onDelete}
          onForward={onForward}
          isStarred={isStarred}
        />
      )}
      <Box sx={{ maxWidth: "75%" }}>
        <Box
          p={1.5}
          sx={{
            background: el.incoming
              ? "rgba(255,255,255,0.06)"
              : sentStyle.background,
            borderRadius: el.incoming
              ? "16px 16px 16px 4px"
              : "16px 16px 4px 16px",
            boxShadow: el.incoming ? "none" : sentStyle.boxShadow,
            wordWrap: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {el.incoming && el.sender && (
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {el.sender}
            </Typography>
          )}
          {isReply && (
            <Box
              sx={{
                borderLeft: "3px solid",
                borderColor: "primary.main",
                pl: 1,
                mb: 0.5,
                opacity: 0.8,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {replyText}
              </Typography>
            </Box>
          )}
          <Stack spacing={2}>
            <Stack p={2} spacing={3} alignItems="start"
              sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
              <img src={el.preview} alt={el.message} style={{ maxHeight: 210, borderRadius: "10px" }} />
              <Stack spacing={2}>
                <Typography variant="subtitle2">Creating Chat App</Typography>
                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main }}
                  component={Link} to="//https://www.youtube.com">www.youtube.com</Typography>
              </Stack>
              {newText ? (
                <Typography variant="body2" color={el.incoming ? theme.palette.text.primary : "#fff"}>
                  {newText}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        </Box>
        {reactions && reactions.length > 0 && (
          <Stack direction="row" spacing={0.5} mt={0.5} ml={1}>
            {reactions.map((r, i) => (
              <Box key={i} sx={{ bgcolor: "rgba(255,255,255,0.1)", px: 1, py: 0.3, borderRadius: 1, fontSize: 12 }}>
                {r.emoji}
              </Box>
            ))}
          </Stack>
        )}
        {isStarred && (
          <Box sx={{ ml: 1, mt: 0.5 }}>
            <Star size={12} weight="fill" color="gold" />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

const ReplyMsg = ({ el, menu, onReply, onReact, onStar, onDelete, onForward, isStarred, reactions }) => {
  const theme = useTheme();
  const sentStyle = useSentBubbleStyle(theme);
  const { isReply, replyText, newText } = parseReply(el.message);

  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"} alignItems="flex-start">
      {menu && (
        <MessageOptions
          el={el}
          onReply={onReply}
          onReact={onReact}
          onStar={onStar}
          onDelete={onDelete}
          onForward={onForward}
          isStarred={isStarred}
        />
      )}
      <Box sx={{ maxWidth: "75%" }}>
        <Box
          p={1.5}
          sx={{
            background: el.incoming
              ? "rgba(255,255,255,0.06)"
              : sentStyle.background,
            borderRadius: el.incoming
              ? "16px 16px 16px 4px"
              : "16px 16px 4px 16px",
            boxShadow: el.incoming ? "none" : sentStyle.boxShadow,
            wordWrap: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {el.incoming && el.sender && (
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {el.sender}
            </Typography>
          )}
          {isReply && (
            <Box
              sx={{
                borderLeft: "3px solid",
                borderColor: "primary.main",
                pl: 1,
                mb: 0.5,
                opacity: 0.8,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {replyText}
              </Typography>
            </Box>
          )}
          <Stack spacing={2}>
            <Stack p={2} direction="column" spacing={3} alignItems="center"
              sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
              <Typography variant="body2" color={theme.palette.text.primary}>
                {el.message}
              </Typography>
            </Stack>
            {newText ? (
              <Typography variant="body2" color={el.incoming ? theme.palette.text.primary : "#fff"}>
                {newText}
              </Typography>
            ) : null}
          </Stack>
        </Box>
        {reactions && reactions.length > 0 && (
          <Stack direction="row" spacing={0.5} mt={0.5} ml={1}>
            {reactions.map((r, i) => (
              <Box key={i} sx={{ bgcolor: "rgba(255,255,255,0.1)", px: 1, py: 0.3, borderRadius: 1, fontSize: 12 }}>
                {r.emoji}
              </Box>
            ))}
          </Stack>
        )}
        {isStarred && (
          <Box sx={{ ml: 1, mt: 0.5 }}>
            <Star size={12} weight="fill" color="gold" />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

const MediaMsg = ({ el, menu, onReply, onReact, onStar, onDelete, onForward, isStarred, reactions }) => {
  const theme = useTheme();
  const sentStyle = useSentBubbleStyle(theme);
  const { isReply, replyText, newText } = parseReply(el.message);

  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"} alignItems="flex-start">
      {menu && (
        <MessageOptions
          el={el}
          onReply={onReply}
          onReact={onReact}
          onStar={onStar}
          onDelete={onDelete}
          onForward={onForward}
          isStarred={isStarred}
        />
      )}
      <Box sx={{ maxWidth: "75%" }}>
        <Box
          p={1.5}
          sx={{
            background: el.incoming
              ? "rgba(255,255,255,0.06)"
              : sentStyle.background,
            borderRadius: el.incoming
              ? "16px 16px 16px 4px"
              : "16px 16px 4px 16px",
            boxShadow: el.incoming ? "none" : sentStyle.boxShadow,
            wordWrap: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {el.incoming && el.sender && (
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {el.sender}
            </Typography>
          )}
          {isReply && (
            <Box
              sx={{
                borderLeft: "3px solid",
                borderColor: "primary.main",
                pl: 1,
                mb: 0.5,
                opacity: 0.8,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {replyText}
              </Typography>
            </Box>
          )}
          <Stack spacing={1}>
            <img src={el.img} alt={el.message} style={{ maxHeight: 210, borderRadius: "10px" }} />
            {newText ? (
              <Typography variant="body2" color={el.incoming ? theme.palette.text.primary : "#fff"}>
                {newText}
              </Typography>
            ) : null}
          </Stack>
        </Box>
        {reactions && reactions.length > 0 && (
          <Stack direction="row" spacing={0.5} mt={0.5} ml={1}>
            {reactions.map((r, i) => (
              <Box key={i} sx={{ bgcolor: "rgba(255,255,255,0.1)", px: 1, py: 0.3, borderRadius: 1, fontSize: 12 }}>
                {r.emoji}
              </Box>
            ))}
          </Stack>
        )}
        {isStarred && (
          <Box sx={{ ml: 1, mt: 0.5 }}>
            <Star size={12} weight="fill" color="gold" />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

const TextMsg = ({ el, menu, onReply, onReact, onStar, onDelete, onForward, isStarred, reactions }) => {
  const theme = useTheme();
  const sentStyle = useSentBubbleStyle(theme);
  const { isReply, replyText, newText } = parseReply(el.message);

  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"} alignItems="flex-start">
      {menu && (
        <MessageOptions
          el={el}
          onReply={onReply}
          onReact={onReact}
          onStar={onStar}
          onDelete={onDelete}
          onForward={onForward}
          isStarred={isStarred}
        />
      )}
      <Box sx={{ maxWidth: "75%" }}>
        <Box
          p={1.5}
          sx={{
            background: el.incoming
              ? "rgba(255,255,255,0.06)"
              : sentStyle.background,
            borderRadius: el.incoming
              ? "16px 16px 16px 4px"
              : "16px 16px 4px 16px",
            boxShadow: el.incoming ? "none" : sentStyle.boxShadow,
            wordWrap: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {el.incoming && el.sender && (
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {el.sender}
            </Typography>
          )}
          {isReply && (
            <Box
              sx={{
                borderLeft: "3px solid",
                borderColor: "primary.main",
                pl: 1,
                mb: 0.5,
                opacity: 0.8,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {replyText}
              </Typography>
            </Box>
          )}
          {newText ? (
            <Typography variant="body2" color={el.incoming ? theme.palette.text.primary : "#fff"}>
              {newText}
            </Typography>
          ) : null}
        </Box>
        {reactions && reactions.length > 0 && (
          <Stack direction="row" spacing={0.5} mt={0.5} ml={1}>
            {reactions.map((r, i) => (
              <Box key={i} sx={{ bgcolor: "rgba(255,255,255,0.1)", px: 1, py: 0.3, borderRadius: 1, fontSize: 12 }}>
                {r.emoji}
              </Box>
            ))}
          </Stack>
        )}
        {isStarred && (
          <Box sx={{ ml: 1, mt: 0.5 }}>
            <Star size={12} weight="fill" color="gold" />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

const TimeLine = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Divider sx={{ width: "46%" }} />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {el.text}
      </Typography>
      <Divider sx={{ width: "46%" }} />
    </Stack>
  );
};

// ----------------------------------------------------------------------
// MessageOptions – placed on the left, handles all actions

const MessageOptions = ({
  el,
  onReply,
  onReact,
  onStar,
  onDelete,
  onForward,
  isStarred,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [reactionAnchor, setReactionAnchor] = useState(null);
  const open = Boolean(anchorEl);
  const reactionOpen = Boolean(reactionAnchor);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (actionTitle) => {
    handleClose();
    switch (actionTitle) {
      case "Reply":
        if (onReply) onReply(el.message);
        break;
      case "React to message":
        setReactionAnchor(anchorEl);
        break;
      case "Forward message":
        if (onForward) onForward(el);
        break;
      case "Star message":
        if (onStar) onStar(el.id);
        break;
      case "Report":
        alert(`Reported message: "${el.message}"`);
        break;
      case "Delete Message":
        if (onDelete) onDelete(el.id);
        break;
      default:
        break;
    }
  };

  const handleReactionSelect = (emoji) => {
    setReactionAnchor(null);
    if (onReact) onReact(emoji, el.id);
  };

  return (
    <Box sx={{ mr: 0.5, alignSelf: "center" }}>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          opacity: 0.6,
          "&:hover": { opacity: 1 },
        }}
      >
        <DotsThreeVertical size={18} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{
          sx: {
            backdropFilter: "blur(12px)",
            background: "rgba(30,30,40,0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2,
            minWidth: 160,
          },
        }}
      >
        {[
          { title: "Reply" },
          { title: "React to message" },
          { title: "Forward message" },
          { title: isStarred ? "Unstar" : "Star message" },
          { title: "Report" },
          { title: "Delete Message" },
        ].map((opt, idx) => (
          <MenuItem
            key={idx}
            onClick={() => handleAction(opt.title)}
            sx={{
              color: opt.title === "Delete Message" ? "error.main" : "text.primary",
              fontSize: "0.875rem",
            }}
          >
            {opt.title}
          </MenuItem>
        ))}
      </Menu>

      {/* Quick reaction picker */}
      <Popover
        open={reactionOpen}
        anchorEl={reactionAnchor}
        onClose={() => setReactionAnchor(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{
          sx: {
            backdropFilter: "blur(12px)",
            background: "rgba(30,30,40,0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2,
            px: 1,
            py: 0.5,
          },
        }}
      >
        <Stack direction="row" spacing={0.5}>
          {QUICK_REACTIONS.map((emoji, idx) => (
            <IconButton key={idx} size="small" onClick={() => handleReactionSelect(emoji)}>
              <Typography fontSize={18}>{emoji}</Typography>
            </IconButton>
          ))}
        </Stack>
      </Popover>
    </Box>
  );
};

export { TimeLine, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };