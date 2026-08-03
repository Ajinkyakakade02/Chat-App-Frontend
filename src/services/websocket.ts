import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient: Client | null = null;

export const connectWebSocket = (
  userId: string,
  roomId: string,
  onMessageReceived: (msg: any) => void
) => {
  disconnectWebSocket();

  const socket = new SockJS('https://nova-chat-backend.onrender.com/ws');
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log('STOMP:', str),
    onConnect: () => {
      console.log('WebSocket connected');

      stompClient?.subscribe(`/topic/room-${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        onMessageReceived(receivedMessage);
      });

      stompClient?.publish({
        destination: '/app/chat.join',
        body: JSON.stringify({ userId, username: userId, roomId }),
      });
    },
  });

  stompClient.activate();
};

export const sendMessage = (message: any) => {
  if (stompClient && stompClient.active) {
    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
