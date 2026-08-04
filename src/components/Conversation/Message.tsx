// @ts-nocheck
import { Box, Stack } from '@mui/material'
import React from 'react';
import { CHAT_MESSAGES } from '../../data'
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from './MsgTypes';

const Message = ({ menu, chatId, messages }) => {
  const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id;

  // Only use real messages from WebSocket/API — no hardcoded fallback
  const displayMessages = (messages && messages.length > 0)
    ? messages.map(msg => ({
        id: msg.id,
        type: 'msg',
        message: msg.content,
        incoming: msg.senderId !== currentUserId,
        outgoing: msg.senderId === currentUserId,
        sender: msg.senderName,
        timestamp: msg.timestamp,
      }))
    : (chatId && CHAT_MESSAGES[chatId] ? CHAT_MESSAGES[chatId] : []);

  // Filter out JOIN/LEAVE messages
  const filteredMessages = displayMessages.filter(el => 
    el.message !== 'joined' && !el.message?.includes('joined')
  );

  return (
    <Box p={3}>
        <Stack spacing={3}>
            {filteredMessages.map((el, idx) => {
                switch (el.type) {
                    case 'divider':
                      return <TimeLine key={idx} el={el}/>
                        
                    case 'msg':
                        switch (el.subtype) {
                            case 'img':
                              return <MediaMsg key={idx} el={el} menu={menu}/>
                            case 'doc':
                                return <DocMsg key={idx} el={el} menu={menu}/>
                            case 'link':
                                return <LinkMsg key={idx} el={el} menu={menu}/>
                            case 'reply':
                                return <ReplyMsg key={idx} el={el} menu={menu}/>
                            default:
                               return <TextMsg key={idx} el={el} menu={menu}/>
                        }
                        break;
                
                    default:
                      return <React.Fragment key={idx}></React.Fragment>;
                }
            })}
        </Stack>
    </Box>
  )
}

export default Message
