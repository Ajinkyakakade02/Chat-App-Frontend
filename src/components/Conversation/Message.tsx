// @ts-nocheck
import { Box, Stack } from '@mui/material'
import React from 'react';
import { Chat_History, CHAT_MESSAGES } from '../../data'
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from './MsgTypes';

const Message = ({ menu, chatId, messages, onReply, onReact, onStar, onDelete, onForward, starredMessages, reactions }) => {
  const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id;

  // If live messages are provided, use them; otherwise fall back to static history
  const displayMessages = messages && messages.length > 0
    ? messages.map(msg => ({
        id: msg.id,
        type: 'msg',
        message: msg.content,
        incoming: msg.senderId !== currentUserId,
        outgoing: msg.senderId === currentUserId,
        sender: msg.senderName,
        timestamp: msg.timestamp,
      }))
    : (chatId && CHAT_MESSAGES[chatId] ? CHAT_MESSAGES[chatId] : Chat_History);

  return (
    <Box p={3}>
      <Stack spacing={3}>
        {displayMessages.map((el, idx) => {
          const msgId = el.id || `static-${idx}`;
          const isStarred = starredMessages?.includes(msgId);
          const msgReactions = reactions?.[msgId] || [];

          switch (el.type) {
            case 'divider':
              return <TimeLine key={idx} el={el} />;
            case 'msg':
              switch (el.subtype) {
                case 'img':
                  return (
                    <MediaMsg
                      key={idx}
                      el={el}
                      menu={menu}
                      onReply={onReply}
                      onReact={onReact}
                      onStar={onStar}
                      onDelete={onDelete}
                      onForward={onForward}
                      isStarred={isStarred}
                      reactions={msgReactions}
                    />
                  );
                case 'doc':
                  return (
                    <DocMsg
                      key={idx}
                      el={el}
                      menu={menu}
                      onReply={onReply}
                      onReact={onReact}
                      onStar={onStar}
                      onDelete={onDelete}
                      onForward={onForward}
                      isStarred={isStarred}
                      reactions={msgReactions}
                    />
                  );
                case 'link':
                  return (
                    <LinkMsg
                      key={idx}
                      el={el}
                      menu={menu}
                      onReply={onReply}
                      onReact={onReact}
                      onStar={onStar}
                      onDelete={onDelete}
                      onForward={onForward}
                      isStarred={isStarred}
                      reactions={msgReactions}
                    />
                  );
                case 'reply':
                  return (
                    <ReplyMsg
                      key={idx}
                      el={el}
                      menu={menu}
                      onReply={onReply}
                      onReact={onReact}
                      onStar={onStar}
                      onDelete={onDelete}
                      onForward={onForward}
                      isStarred={isStarred}
                      reactions={msgReactions}
                    />
                  );
                default:
                  return (
                    <TextMsg
                      key={idx}
                      el={el}
                      menu={menu}
                      onReply={onReply}
                      onReact={onReact}
                      onStar={onStar}
                      onDelete={onDelete}
                      onForward={onForward}
                      isStarred={isStarred}
                      reactions={msgReactions}
                    />
                  );
              }
            default:
              return <React.Fragment key={idx}></React.Fragment>;
          }
        })}
      </Stack>
    </Box>
  );
};

export default Message;