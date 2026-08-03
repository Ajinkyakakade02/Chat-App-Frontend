// @ts-nocheck
import {
  Box, Stack, Dialog, DialogTitle, List, ListItemButton, ListItemText,
  TextField, IconButton, InputAdornment, Fab,
} from "@mui/material";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import ConversationHeader from "../ConversationHeader";
import Footer from "../Footer";
import Message from "./Message";
import { connectWebSocket, sendMessage, disconnectWebSocket } from "../../services/websocket";
import api from "../../services/api";
import { FALLBACK_CHATS, GROUP_LIST } from "../../data";
import { CaretDown, X } from "phosphor-react";

const NOVA_WELCOME = {
  id: 'nova-welcome',
  content: 'Hey! Ready to chat? 😊',
  senderId: 'local-1',
  senderName: 'Nova AI',
  type: 'CHAT',
  timestamp: new Date().toISOString(),
};

const Conversation = ({ chatData, roomId }) => {
  const [messages, setMessages] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [replyTo, setReplyTo] = useState(null);
  const [reactions, setReactions] = useState({});
  const [starred, setStarred] = useState([]);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [forwardOpen, setForwardOpen] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    const loadHistory = async () => {
      try {
        const history = await api.getChatMessages(roomId);
        setMessages(history);
      } catch {
        setMessages([]);
      }
    };
    loadHistory();
    connectWebSocket(currentUser?.id, roomId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => disconnectWebSocket();
  }, [roomId, currentUser?.id]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      if (isAtBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      setShowScrollButton(!isNearBottom);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredMessages = useMemo(() => {
    let msgs = messages;
    if (!searchQuery.trim()) return msgs;
    return msgs.filter(msg =>
      msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const displayMessages = useMemo(() => {
    if (chatData?.id === 'local-1') {
      const hasWelcome = filteredMessages.some(m => m.id === 'nova-welcome');
      if (!hasWelcome) {
        return [NOVA_WELCOME, ...filteredMessages];
      }
    }
    return filteredMessages;
  }, [chatData?.id, filteredMessages]);

  const handleReply = (text) => setReplyTo(text);
  const handleReact = (emoji, messageId) => {
    setReactions((prev) => {
      const existing = prev[messageId] || [];
      const userReacted = existing.find(
        (r) => r.emoji === emoji && r.userId === currentUser.id
      );
      if (userReacted) {
        return { ...prev, [messageId]: existing.filter(r => !(r.emoji === emoji && r.userId === currentUser.id)) };
      } else {
        return { ...prev, [messageId]: [...existing, { emoji, userId: currentUser.id }] };
      }
    });
  };
  const handleStar = (messageId) => setStarred(prev =>
    prev.includes(messageId) ? prev.filter(id => id !== messageId) : [...prev, messageId]
  );
  const handleDelete = (messageId) => setMessages(prev => prev.filter(m => m.id !== messageId));
  const handleForward = (message) => { setForwardMessage(message); setForwardOpen(true); };
  const handleForwardSend = (targetChatId) => {
    if (forwardMessage) {
      const forwardMsg = {
        senderId: currentUser.id,
        senderName: currentUser.fullName || currentUser.username || "You",
        content: forwardMessage.message,
        roomId: targetChatId,
        type: "CHAT",
        timestamp: new Date().toISOString(),
      };
      sendMessage(forwardMsg);
    }
    setForwardOpen(false);
    setForwardMessage(null);
  };

  const handleSend = (text) => {
    const message = {
      senderId: currentUser.id,
      senderName: currentUser.fullName || currentUser.username || "You",
      content: replyTo ? `↳ ${replyTo}\n${text}` : text,
      roomId: roomId,
      type: "CHAT",
      timestamp: new Date().toISOString(),
    };
    sendMessage(message);
    setReplyTo(null);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const toggleSearch = () => {
    setIsSearching(prev => !prev);
    setSearchQuery("");
  };

  return (
    <Stack height="100%" maxHeight="100vh" width="auto" position="relative">
      <ConversationHeader
        chatData={chatData}
        onSearchClick={toggleSearch}
        isSearching={isSearching}
        onClearChat={handleClearChat}
      />

      {isSearching && (
        <Box sx={{ px: 2, py: 1, bgcolor: 'background.default' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={toggleSearch}>
                    <X size={18} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Box>
      )}

      <Box
        ref={scrollContainerRef}
        className="scrollbar"
        width="100%"
        sx={{ flexGrow: 1, height: '100%', overflowY: 'scroll' }}
      >
        <Message
          menu={true}
          chatId={chatData?.id}
          messages={displayMessages}
          onReply={handleReply}
          onReact={handleReact}
          onStar={handleStar}
          onDelete={handleDelete}
          onForward={handleForward}
          starredMessages={starred}
          reactions={reactions}
        />
        <div ref={messagesEndRef} />
      </Box>

      {showScrollButton && !isSearching && (
        <Fab
          size="small"
          color="primary"
          onClick={scrollToBottom}
          sx={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            opacity: 0.8,
            '&:hover': { opacity: 1 },
          }}
        >
          <CaretDown size={20} />
        </Fab>
      )}

      {!isSearching && (
        <Footer
          onSend={handleSend}
          pickerRight={100}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      )}

      <Dialog open={forwardOpen} onClose={() => setForwardOpen(false)}>
        <DialogTitle>Forward message to</DialogTitle>
        <List sx={{ minWidth: 300 }}>
          {[...FALLBACK_CHATS, ...GROUP_LIST].filter(c => c.id !== chatData?.id).map(chat => (
            <ListItemButton key={chat.id} onClick={() => handleForwardSend(chat.id)}>
              <ListItemText primary={chat.name} />
            </ListItemButton>
          ))}
        </List>
      </Dialog>
    </Stack>
  );
};

export default Conversation;
