import { io } from 'socket.io-client';
import { SERVER_URL } from './api';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL, {
      autoConnect: false,
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const connectSocket = (userId) => {
  const s = getSocket();
  if (!s.connected) {
    s.auth = { userId };
    s.connect();
    s.once('connect', () => {
      if (userId) s.emit('user:join', { userId });
    });
    s.off('reconnect');
    s.on('reconnect', () => {
      if (userId) s.emit('user:join', { userId });
    });
  } else if (userId) {
    s.emit('user:join', { userId });
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
