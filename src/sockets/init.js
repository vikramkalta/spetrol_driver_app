import {io} from 'socket.io-client';
import { setSocketConnected } from '../actions/home';

import { APP_CONFIG } from '../config';

let socket;

export const initSocket = (token, dispatch) => {
  socket = io(APP_CONFIG.SOCKET_URL, {
    path: '/socket.io',
    query: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    dispatch(setSocketConnected(true));
    socket.sendBuffer = [];
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    dispatch(setSocketConnected(false));
  });
};

export const closeSocket = () => socket?.close();

export const getSocketRef = () => socket;

export const emit = (event, msg) => {
  socket?.emit(event, msg);
};