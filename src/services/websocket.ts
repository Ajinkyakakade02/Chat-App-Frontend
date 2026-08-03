import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient: Client | null = null;
const globalListeners: Array<(msg: any) => void> = [];

export const connectWebSocket = (
  userId: string,
  roomId: string,
  onMessageReceived: (msg: any) => void
) => {
  disconnectWebSocket();

  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log('STOMP:', str),
    onConnect: () => {
      console.log('WebSocket connected');

      stompClient?.subscribe(`/topic/room-${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        // Notify the specific chat component
        onMessageReceived(receivedMessage);
        // Notify all global listeners (for unread counts, etc.)
        globalListeners.forEach((listener) => listener(receivedMessage));
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

// Add or remove a global listener for incoming messages
export const addGlobalMessageListener = (listener: (msg: any) => void) => {
  globalListeners.push(listener);
};

export const removeGlobalMessageListener = (listener: (msg: any) => void) => {
  const index = globalListeners.indexOf(listener);
  if (index > -1) globalListeners.splice(index, 1);
};